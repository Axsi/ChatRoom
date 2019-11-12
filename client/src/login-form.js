import React from 'react';
import { withRouter } from 'react-router-dom';
import './style/login-form.css';

class LoginForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            username:'',
            password:''
        };

        this.registerModal = this.registerModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    registerModal(){
        let modal = document.getElementById("Create-User-Modal");
        modal.style.display = "block";

        window.onclick = function(event) {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        }
    }

    handleChange(event){
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            [name]: value
        });
    }

    handleSubmit(event){
        event.preventDefault();
        let data = this.state;
        let fetchData = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json;charset=utf-8'}
        };

        fetch('/login', fetchData)
            .then(response=> response.json())
            .then(data=>{
                this.props.history.push(data.url);
            })
    }

    //ideally we don't want functions inside render as they would be called every time render is called which is
    // a waste and not efficient
    render(){
        return(
            <form className="User-Info-Form" onSubmit={this.handleSubmit}>
                <div className="FormGroup">
                    <label htmlFor="User-Name">User Name:</label><br/>
                    <input id="User-Name" type="text" name="username" onChange={this.handleChange}/>
                </div>
                <div className="FormGroup">
                    <label htmlFor="User-Password">Password:</label><br/>
                    <input id="User-Password" type="password" name="password" onChange={this.handleChange}/>
                </div>
                <input className="Login-Button" type="submit" value="Sign-in"/>
                <a className="Create-User" href="#" onClick={this.registerModal}> Register new account</a>
            </form>
        )
    }
}

export default withRouter(LoginForm);