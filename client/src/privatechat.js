import React from 'react';
import './style/privatechat.css';
import arrow from "./assets/icons8-back-100.png"
import close from "./assets/icons8-close-window-100.png"
import MainInput from "./main_input";


class PrivateChat extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            SidePanelWidth:  0,
            PrivateChatWidth: 0,
            ConnectedUsers: [],
            ClickedUser:''
        };
        this.openSide = this.openSide.bind(this);
        this.closeSide = this.closeSide.bind(this);
        // this.friendChat = this.friendChat.bind(this);
    }

    componentDidMount() {
        this.props.socket.on('onlineUsers', connectUsers=>{
            let filteredUsers = connectUsers.filter((user)=>{
                return this.props.name !== user
            });
            this.setState({ConnectedUsers: filteredUsers});
        })
    }

    openSide(event){
        event.preventDefault();
        const name = event.target.name;
        if(event.target.name === "PrivateChatWidth"){
            this.setState({
                ClickedUser: event.target.id
            })
        }
        this.setState({
            [name]: '500px'
        })
    }

    closeSide(event){
        event.preventDefault();
        const name = event.target.name;
        this.setState({
            [name]: 0
        })
    }

    render(){
        // let filteredUsers = Object.keys(this.state.ConnectedUsers).filter(users=>{
        //     return users !== this.props.name
        //     }
        // );
        return(
            <div className="Panel-Container">
                <input type="image" className="Open-Side" src={arrow} name="SidePanelWidth" onClick={this.openSide}/>
            <div className="Side-Panel" style={{width: this.state.SidePanelWidth}}>
                <input type="image" className="Close-Panel" src={close} name="SidePanelWidth" onClick={this.closeSide}/>
                <div className="Online-Container">
                <span className="Online-Title">Users Online</span>
                <div className="Online-List>">
                    {this.state.ConnectedUsers.map((keyName)=> (
                        <button className="User-Button" name="PrivateChatWidth"
                                id={keyName} key={keyName} onClick={this.openSide}>
                            {keyName}
                        </button>
                    ))}
                </div>
                </div>
                {/*<a className="Open-Private" name="PrivateChatWidth" href="#" onClick={this.openSide}>o</a>*/}
                <div className="Private-Container" style={{width: this.state.PrivateChatWidth}}>
                    <input type="image" className="Close-Panel" src={close} name="PrivateChatWidth" onClick={this.closeSide}/>
                    <div className="Online-Container">
                    <span className="Online-Title">{this.state.ClickedUser}</span>
                    </div>
                    {/*<MainInput socket={this.props.socket}/>*/}
                </div>
            </div>
            </div>
        )
    }
}

export default PrivateChat;