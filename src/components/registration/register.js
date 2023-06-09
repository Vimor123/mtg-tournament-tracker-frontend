import React from "react";
import { json, useNavigate } from "react-router-dom";
import { Navbar } from "../navbar";
import "../styles/login.css"

function Register() {
    const [form, setForm] = React.useState({ username: '', password: '', name: '', surname: ''});
    const navigate = useNavigate();

    const navbar = {"user" : "unregistered"}

    function onChange(event) {
        const {name, value} = event.target;
        setForm(oldForm => ({...oldForm, [name]: value}))
    }

    function handleSubmit(event) {
        event.preventDefault();
        const data = {
            "username" : form.username,
            "password" : form.password,
            "name" : form.name,
            "surname" : form.surname,
        };
        const options = {
            method:'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        fetch("/api/player/create", options)
            .then( response => {
                if (response.ok) {
                    navigate("/");
                } else {
                    alert(response.json.message);
                }
            });
    }

    function isValid() {
        const {username, password, name, surname} = form;
        return form.username.length > 0 && form.password.length > 0 && form.name.length > 0 && form.surname.length > 0;
    }

    return (
        <div>
            <Navbar navbar = {navbar} />
            <div>
                <h2 className="login-title">
                    Register
                </h2>
                <p className="intro-element">
                    Please enter your user credentials.
                </p>
            </div>
            <div className="register" onSubmit={handleSubmit}>
                <form>
                    <div class="form-field">
                        <input type="text" name="username" placeholder="Username" onChange={onChange} value={form.username} required/>
                    </div>

                    <div class="form-field">
                        <input type="password" name="password" placeholder="Password" onChange={onChange} value={form.password} required/>
                    </div>

                    <div class="form-field">
                        <input type="text" name="name" placeholder="Name" onChange={onChange} value={form.name} required/>
                    </div>

                    <div class="form-field">
                        <input type="text" name="surname" placeholder="Surname" onChange={onChange} value={form.surname} required/>
                    </div>

                    <div>
                        <button class="btn" type="submit" disabled={!isValid()}> Register </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export {Register};