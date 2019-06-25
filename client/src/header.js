import React from 'react';
import './style/header.css';
import Privatechat from "./privatechat";
import { withRouter } from 'react-router-dom';
import logout from "./assets/icons8-shutdown-32.png"


/**
 * @desc This class renders the header of the chat page and all the functionality contained within.
 * examples functionalities include displaying total users online, option to logout
 */
class ChatHeader extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            totalUsers: 0
        };

        this.handleLogout = this.handleLogout.bind(this);
    }

    componentDidMount(){
        this.props.socket.on('total',(amount) => {
            console.log(amount);
            this.setState({totalUsers: amount})}
        )
    }

    handleLogout(e){
        e.preventDefault();
        console.log("logout pressed");
        this.props.socket.emit('logout');
        this.props.history.push("/");
    }

    render(){
        const usersOnline = this.state.totalUsers;
        return (
            <div className="Header-Container">
            <div className="Chat-Header">
                <p className="Title-Name">
                    Chat Room
                </p>
                <div className="Status-Container">
                    <p>
                        Users Online:
                        <span className="Users-Online">
                            {usersOnline}
                        </span>
                    </p>
                    <div className="Divider">
                    </div>
                    <div className="Account">
                        <p className="Account-Name">
                            {this.props.name}
                        </p>
                        <input type="image" className="Logout" src={logout} onClick={this.handleLogout}/>
                    </div>
                </div>
            </div>
            </div>
        );
    }
}

export default withRouter(ChatHeader);
