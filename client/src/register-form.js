import React from 'react';
import './style/register-form.css';

class RegisterForm extends React.Component{
    constructor(props){
        super(props);
        //keeping the user input data within component, making controlled component
        this.state = {
            newUser : '',
            newPassword: '',
            registrationStatus:''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event){
        //name listed in the input tag and the current value entered into the input
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

        //make a rest call here
        //had to switch to arrow functions here as this.setState was not defined using regular function approach
        //arrow function keeps meaning of 'this' the same throughout
        fetch('/registration', fetchData)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                console.log(this.state);
                this.setState({registrationStatus: data.registrationStatus});
                console.log(this.state)})
            .catch(error=>{console.log("Error: " + error)});
    }
    render(){
        return (
            <div className="Modal-Content">
                <h2 className="Registration-Header">
                    Account Registration
                </h2>
                <form className="Register-Form" onSubmit={this.handleSubmit}>
                    <div className="Register-Form-Group">
                        <label htmlFor="User-Register">User Name:</label><br/>
                        <input id="User-Register" type="text" name="newUser" onChange={this.handleChange}/>
                    </div>
                    <div className="Register-Form-Group">
                        <label htmlFor="Password-Register">Password:</label><br/>
                        <input id="Password-Register" type="password" name="newPassword" onChange={this.handleChange}/>
                    </div>
                    <input className="Register-Button" type="submit" value="Register"/>
                    <p className="Registration-Status"
                       style={{color: this.state.registrationStatus ==="User has been created" ? "green" : "red"}}>
                        {this.state.registrationStatus}
                    </p>
                </form>
            </div>
        )
    }
}

export default RegisterForm;