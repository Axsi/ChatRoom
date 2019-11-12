import React from 'react';
import './style/mainchat.css';
import MainInput from "./main_input";
import Messages from "./messages"

class MainChat extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            messages: []
        };
        this.handleMessage = this.handleMessage.bind(this);
    }

    handleMessage(message){
        //keep a collection of messages to be displayed in chat window
        this.setState(prevState=>({
            messages: [...prevState.messages, message]
        }));
        console.log(this.state.messages);
    }


    render(){
        return(
            <div className="Chat-Container">
                <div className="Chat-Inner">
                    <Messages messages={this.state.messages} name={this.props.name}/>
                </div>
                <MainInput socket={this.props.socket} submitMessage={this.handleMessage}/>
            </div>
        )
    }
}

export default MainChat;