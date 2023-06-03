import { Navbar } from "../navbar";
import "../styles/login.css";
import "../styles/search.css";
import "../styles/players.css";
import React from "react";
import { ReactSession }  from 'react-client-session';

function PlayerSearch() {
    ReactSession.setStoreType("localStorage");

    const [form, setForm] = React.useState({ username: '' });

    const [players, setPlayers] = React.useState([]);

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
                } else {
                    let navbar_object = {"user" : "unregistered"}
                    setNavbar(navbar_object);
                }
            })
    }, []);

    function onChange(event) {
        const {name, value} = event.target;
        setForm(oldForm => ({...oldForm, [name]: value}))
    }

    function handleSubmit(event) {
        event.preventDefault();
        fetch(`/api/player/search/${form.username}`)
            .then( response => {
                if (response.ok) {
                    return response.json();
                }
            })
            .then( response => {
                setPlayers(response);
                
                console.log(response);
            });
    }

    function isValid() {
        const {username} = form;
        return form.username.length > 0;
    }

    return (
        <div>
            <Navbar navbar = {navbar} />
            <div>
                <h2 className="login-title">
                    Search players by username
                </h2>
            </div>
            <div className="search" onSubmit={handleSubmit}>
                <form>
                    <div className="form-field">
                        <input type="text" name="username" placeholder="Username" onChange={onChange} value={form.username} required/>
                    </div>

                    <div>
                        <button className="btn" type="submit" disabled={!isValid()}> Search </button>
                    </div>
                </form>
            </div>
            <div className="result-box">
                <h2>
                    Players:
                </h2>
                {players.map( player => (
                    <div className="player-container">
                        <p> {player.username} </p>
                        <p className="name-surname"> {player.name + " " + player.surname} </p>
                        <a className="look-icon" href={"/player/" + player.idplayer}>
                            <img className="look-icon-image" src="search-icon.png" alt="look"/>
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}

export {PlayerSearch};