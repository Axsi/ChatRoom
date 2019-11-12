const env = require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();


const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
//create a session middleware
const session = require('express-session')({
    secret:'haha', resave: false, saveUninitialized: false
});

const crypto = require('crypto');

const server = require('http').Server(app);
const io = require('socket.io')(server);
const shortid = require('shortid');

const mongo = require('mongodb').MongoClient;


const sharedsession = require('express-socket.io-session');

var db;
var collection;
var connected_users={};

// app.use(express.static(__dirname + '/build'));
//
// app.get('/', (req, res)=>{
//     res.sendFile('index.html', {root: __dirname + '/build'});
// });

app.use(bodyParser.json());
app.use(session);

//======Socket.IO =========
io.use(sharedsession(session));

io.on('connection', function(socket){
    console.log('a user connected');
    console.log(Object.keys(io.sockets.sockets));
    //socket.handshake.session is acessible through express-socket.io-session module, it lets us access the socket.handshake session
    //which is the req.session session object
    if(connected_users[socket.handshake.session.passport.user]){
        connected_users[socket.handshake.session.passport.user].disconnect();
    }
    // here we push the connected user and its socket into connected_user global array
    connected_users[socket.handshake.session.passport.user] = socket;

    io.emit('total', Object.keys(io.sockets.sockets).length);

    io.emit('onlineUsers', Object.keys(connected_users));

    socket.on('newMessage', function(message){
        let messageObj = {username: socket.handshake.session.passport.user, message: message, id: shortid.generate()};
        io.emit('message', messageObj);
    });

    socket.on('logout', function(){
        console.log("logged out/ disconnected");
        socket.disconnect();
    });

    socket.on('disconnect', function(){
        console.log('user disconnected');
        Object.keys(connected_users).forEach((id)=>{
            if(this.id === connected_users[id].id){
                delete connected_users[id];
            }
        });
        console.log(Object.keys(io.sockets.sockets));
        io.emit('total', Object.keys(io.sockets.sockets).length);
        io.emit('onlineUsers', Object.keys(connected_users));
    });

});

server.listen(process.env.SOCKET_PORT || 80, function(err){
    if(err){
        console.log('error', err);
    }
    console.log("socket.io listening on port 80");
});




//=========================

//====== PassportJS =======
//Verification function used in the local strategy, it gets passed req.body.username and req.body.password from passport
passport.use(new LocalStrategy(
    function(username, password, done){
        collection.findOne({username: username}, function(err, user){
            //check if user name exists if not return false, also be notified when there is an error
            if(err){
                return done(err);
            }
            if(!user){
                return done(null, false);
            }
            authenticate({username: username, password: password})
                .then(function(response){
                    if(!response){
                        return done(null, false);
                    }else{
                        return done(null,user);
                    }
                });
        });
    }
    ));

passport.serializeUser(function(user, done){
    done(null, user.username);
});

passport.deserializeUser(function(username, done){
    collection.findOne({username: username}, function(err, user){
        if(err){
            return done(err);
        }else{
            done(null, user);
        }
    });
});


//initialize returns a middle which must be called at the start of connect/express based apps
app.use(passport.initialize());
//if app is uses persistent login sessions, passport.session must be used. Returns middleware that reads a user out
//of session if one is there, it will store the user in req.user
app.use(passport.session());

//=========================

app.get('/friendAmount', function(req, res, next){
    res.json({username: req.user.username, friends:req.user.friends});
});

app.post('/login', function(req, res, next){
    passport.authenticate('local', function(err, user, info){
        if(err){
            return next(err);
        }
        if(!user){
            res.sendStatus(401);
            // res.status(401).send("User entered does not exist");
        }
        req.logIn(user, function(err){
            if(err){
                return next(err);
            }
            currentUser = user.username;
            res.json({url: "/chatroom"});
        })
    })(req, res, next);
});

app.post('/registration', (req, res)=>{
    let hashAndSalt = hashPassword(req.body.newPassword);
    collection.findOne({username: req.body.newUser})
        .then(function(response){
            if(response != null){
                res.send({registrationStatus: "Username already exists"});
            }else{
              collection.insertOne({
                  //inserting data/accountInfo into database
                  username: req.body.newUser,
                  password: hashAndSalt.passwordHash,
                  salt: hashAndSalt.saltKey,
                  friends: []
              });
              res.send({registrationStatus: "User has been created"});
            }
        });
});


app.use(bodyParser.json());
app.listen(process.env.LOCAL_PORT || 8100, ()=> {
    console.log('Server running on http://localhost:8100/');
});

//======= MongoDB =========
mongo.connect(process.env.MONGO_URL||'mongodb://localhost:27017',{useNewUrlParser: true},(err,client)=>{
    if(err){
        console.log(err);
        return;
    }
    db = client.db('ChatRoom');
    collection = db.collection('users');
    // collection.findOneAndUpdate({username: "Larpmaster400"},{$setOnInsert: {username: "Larpmaster400",
    //             password: "some hash", salt: "some salt", friends:[]}}, {upsert: true, returnOriginal: false});
    console.log('Listening on port 27017');
});

//====== Helper Functions =======

function generateSalt(){
    //Set to string or else it returns as a buffer
    return crypto.randomBytes(4).toString('hex');
}

function hashPassword(password){
    let salt = generateSalt();
    //createHmac applies hash algorithm to both given data and the secret key(salt)
    let hashedPassword = crypto.createHmac("sha256",salt)
        .update(password)
        .digest("hex");
    return {
        saltKey: salt,
        passwordHash: hashedPassword
    };
}

// need the return collection... this is so you return the promise
function authenticate(loginData){
    return collection.findOne({username: loginData.username})
        .then(function(response){
            if(!response){
                return false;
            }
            let hashedPassword = crypto.createHmac("sha256", response.salt)
                .update(loginData.password)
                .digest("hex");
            return hashedPassword === response.password;
        });
}