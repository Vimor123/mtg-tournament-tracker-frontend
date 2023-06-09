import { Navbar } from "../navbar";
import React from "react";
import { ReactSession }  from 'react-client-session';
import { useNavigate } from "react-router-dom";

function NewLeague() {
    ReactSession.setStoreType("localStorage");
    
    const navigate = useNavigate();

    const [form, setForm] = React.useState({ nameleague : "", leaguestart : ""});

    const [navbar, setNavbar] = React.useState({"user" : "unregistered"});

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
                    navigate("/leagues");
                }
            })
    }, []);

    function onChange(event) {
        const {name, value} = event.target;
        setForm(oldForm => ({...oldForm, [name]: value}))
    }

    function handleSubmit(event) {
        event.preventDefault();
        const data = {
            "login" : {
                "username" : ReactSession.get("username"),
                "password" : ReactSession.get("password")
            },
            "nameleague" : form.nameleague,
            "leaguestart" : form.leaguestart
        };
        const options = {
            method:'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        fetch("/api/league/create", options)
            .then( response => {
                if (response.ok) {
                    navigate("/leagues");
                } else {
                    alert(response.json.message);
                }
            });
    }

    function isValid() {
        const {nameleague, leaguestart} = form;
        return form.nameleague.length > 0 && form.leaguestart.length > 0;
    }

    return (
        <div>
            <Navbar navbar = {navbar} />
            <div>
                <h2 className="login-title">
                    New league
                </h2>
            </div>
            <div className="new-league" onSubmit={handleSubmit}>
                <form>
                    <div class="form-field">
                        <input type="text" name="nameleague" placeholder="League name" onChange={onChange} value={form.nameleague} required/>
                    </div>

                    <div class="form-field">
                        <p> Start date </p>
                        <input type="date" name="leaguestart" onChange={onChange} value={form.leaguestart} required/>
                    </div>

                    <div>
                        <button class="btn" type="submit" disabled={!isValid()}> Add new league </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export {NewLeague};