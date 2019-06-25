import React from 'react';
import './style/login.css';
import LoginForm from './login-form';
import RegisterForm from './register-form';

/**
 * @desc This class renders the Login page. It holds the login and register form components
 */
class LoginPage extends React.Component{
    render(){
        return(
            <div className="Login-Page">
                <div className="Front-Title-Banner">
                    <h1 className="Front-Title">
                        Chat Room
                    </h1>
                </div>
                <div className="Login-Info">
                    <LoginForm />
                </div>
                <div id="Create-User-Modal">
                    <RegisterForm />
                </div>
            </div>
            )
    }
}

export default LoginPage;