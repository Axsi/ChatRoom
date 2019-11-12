import React from 'react';
import './style/messages.css'

class Messages extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            this.props.messages.map((message)=>
                //determine the username displayed in a message, if its not you then display a username if it is yourself
                //then display "You"
                    this.props.name !== message.username ? (
                        <div className="Message-Others" key={message.id}>
                            <p className="Display-Name">
                                {message.username}
                            </p>
                            <div className="Message-Content">
                                {message.message}
                            </div>
                        </div>) : (
                        <div className="Message-Self" key={message.id}>
                            <div className="Message-Content-Self">
                                {message.message}
                            </div>
                            <p className="Display-Name-Self">
                                You
                            </p>
                        </div>)
                )
        )
    }
}
export default Messages;