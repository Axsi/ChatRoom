import React from 'react';
import './style/chatroom.css';
import ChatHeader from './header';
import MainChat from './mainchat';
import Privatechat from './privatechat';
import io from 'socket.io-client';

/**
 * @desc This class will be the main parent class that will hold the rest of the components on the chat page.
 * It will pass its local state username and socket object down to its children to be used
 */
class ChatRoom extends React.Component{
    constructor(props){
        super(props);
        this.socket = io.connect('http://localhost');
        this.state = {
            username: '',
            friends: '',
        };
    }

    componentDidMount() {
        fetch('/friendAmount')
            .then(response => response.json())
            .then(data => {
                this.setState({username: data.username, friends: data.friends.length});
            });
    }

    render(){
        return(
            <React.Fragment>
                <ChatHeader name={this.state.username} socket={this.socket}/>
                <Privatechat name={this.state.username} socket={this.socket} />
                <MainChat name={this.state.username} socket={this.socket} />
            </React.Fragment>

        );
    }
}


export default ChatRoom;
