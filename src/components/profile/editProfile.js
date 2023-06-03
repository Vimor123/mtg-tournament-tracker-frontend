import React from "react";
import { json, useNavigate } from "react-router-dom";
import { Navbar } from "../navbar";
import "../styles/login.css";
import { ReactSession }  from 'react-client-session';

function EditProfile() {
    ReactSession.setStoreType("localStorage");
    
    const navigate = useNavigate();

    const [form, setForm] = React.useState({ id: "",  username: '', password: '', name: '', surname: ''});

    const [navbar, setNavbar] = React.useState({"user" : "unregistered"});

    const [player, setPlayer] = React.useState({});

    React.useEffect(() => {
        var username = ReactSession.get("username");
        var password = ReactSession.get("password");

        const options = {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                "username" : username,
                "password" : password
            })
        };
        fetch("/api/player/login", options)
            .then((response) => {
                if (response.status === 200) {
                    let navbar_object = {"user" : "player"}
                    setNavbar(navbar_object);
                    return response.json();
                } else {
                    let navbar_object = {"user" : "unregistered"}
                    setNavbar(navbar_object);
                    navigate("/");
                }
            })
            .then( response => {
                setPlayer(response);
                setForm({ username: response.username, password: '', name : response.name, surname: response.surname})
            })
    }, []);

    function onChange(event) {
        const {name, value} = event.target;
        setForm(oldForm => ({...oldForm, [name]: value}))
    }

    function handleSubmit(event) {
        event.preventDefault();
        const data = {
            "id" : ReactSession.get("id"),
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
        fetch("/api/player/edit", options)
            .then( response => {
                if (response.ok) {
                    ReactSession.set("username", form.username);
                    ReactSession.set("password", form.password);
                    navigate("/profile");
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
                    Edit profile
                </h2>
            </div>
            <div className="edit-profile" onSubmit={handleSubmit}>
                <form>
                    <div class="form-field">
                        <input type="text" name="username" placeholder="Username" onChange={onChange} value={form.username} required/>
                    </div>

                    <div class="form-field">
                        <input type="password" name="password" placeholder="Password" onChange={onChange} value={form.password} required/>
                    </div>

                    <div class="form-field">
                        <input type="text" name="name" placeholder="Name" onChange={onChange} value={form.email} required/>
                    </div>

                    <div class="form-field">
                        <input type="text" name="surname" placeholder="Surname" onChange={onChange} value={form.email} required/>
                    </div>

                    <div>
                        <button class="btn" type="submit" disabled={!isValid()}> Save changes </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export {EditProfile};