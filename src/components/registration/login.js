import { Navbar } from '../navbar.js'
import { useNavigate } from "react-router-dom";
import { ReactSession } from 'react-client-session';
import React from 'react'; 
import "../styles/login.css";

function Login() {
    ReactSession.setStoreType("localStorage");
    ReactSession.set("username", undefined);
    ReactSession.set("password", undefined);
    const navigate = useNavigate();

    const navbar = {"user" : "unregistered"};

    const [loginForm, setLoginForm] = React.useState({ username: '', password: ''});

    function onChange(event) {
        const {name, value} = event.target;
        setLoginForm(oldForm => ({...oldForm, [name]: value}))
    }

    function validateForm() {
        return loginForm.username.length > 0 && loginForm.password.length > 0;
    }

    function handleSubmit(event) {
        event.preventDefault();
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "username" : loginForm.username,
                "password" : loginForm.password
            })
        };
        fetch('/api/player/login', options)
            .then(response => {
                return response.json();
            })
            .then(response => {
                if (response.message !== undefined) {
                    alert(response.message)
                } else {
                    console.log(response);
                    ReactSession.set("username", loginForm.username);
                    ReactSession.set("password", loginForm.password);
                    ReactSession.set("id", response.idplayer);
                    navigate("/");
                }
            })
    }

    return (
        <div>
            <Navbar navbar = {navbar} />
            <div>
                <h2 className="login-title">
                    Login
                </h2>
            </div>
            <div className="login" onSubmit={handleSubmit}>
                <form>
                    <div className="form-field">
                        <input type="text" name = "username" placeholder="Username" required onChange={onChange} defaultValue={loginForm.username}/>
                    </div>
                    <div className="form-field">
                        <input type="password" name = "password" placeholder="Password" required onChange={onChange} defaultValue={loginForm.password}/>
                    </div>
                    <div>
                        <button className="btn" type="submit" disabled={!validateForm()}>Log in</button>
                    </div>
                </form>
            </div>
        </div>
    );
}


export { Login };