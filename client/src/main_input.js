import React from 'react';
import './style/main_input.css';

class MainInput extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            message:''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this. handleChange.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
    }

    componentDidMount() {
        this.props.socket.on('message', messageObj=>{
            this.props.submitMessage(messageObj);
            //focus was used so user can immediately type in chat box without clicking on it
            this.messageArea.focus();
        })
    }

    //when a user sends a message, socket emits the message ,which is saved in the state, to everyone
    handleSubmit(event){
        event.preventDefault();
        this.props.socket.emit('newMessage',this.state.message);
        this.setState({message:''});
    }

    handleChange(event){
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
           [name]: value
        });
    }

    onKeyDown(event){
        if(event.key==='Enter'){
            event.preventDefault();
            event.stopPropagation();
            this.handleSubmit(event);
        }
    }

    render(){
        return(
            <div className="Input-Container">
                <div className="Input-Main">
                    <form className="InputForm" onSubmit={this.handleSubmit}>
                    <textarea className="New-Message"
                              value={this.state.message}
                              name="message"
                              maxLength= "600"
                              placeholder= "Type your message here..."
                              onChange={this.handleChange}
                              onKeyDown={this.onKeyDown}
                              ref={(area)=>{this.messageArea = area;}}
                              autoFocus={"True"}
                    >
                    </textarea>
                    <input className="Send-Button" disabled={this.state.message === ''} type="submit" value="Send"/>
                    </form>
                </div>
            </div>
        )
    }
}

export default MainInput;