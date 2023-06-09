import { Navbar } from "../navbar";
import "../styles/login.css";
import "../styles/search.css";
import React from "react";
import { ReactSession }  from 'react-client-session';

function LeagueSearch() {
    ReactSession.setStoreType("localStorage");

    const [form, setForm] = React.useState({ nameleague: '' });

    const [admin, setAdmin] = React.useState(false);

    const [leagues, setLeagues] = React.useState([]);

    const [oldLeagues, setOldLeagues] = React.useState([]);

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
                    return response.json();
                }
            })
            .then( response => {
                if ("adminprivileges" in response) {
                    if (response.adminprivileges) {
                        setAdmin(true);
                    }
                }
            })
        
        fetch("/api/league")
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
            })
            .then( response => {
                let allLeagues = response;
                let actualLeauges = [];
                let finishedLeagues = [];
                allLeagues.forEach(element => {
                    if (element.leagueend == null) {
                        actualLeauges = [...actualLeauges, element];
                    } else {
                        finishedLeagues = [...finishedLeagues, element];
                    }
                });
                setLeagues(actualLeauges);
                setOldLeagues(finishedLeagues);
            })
    }, []);

    function onChange(event) {
        const {name, value} = event.target;
        setForm(oldForm => ({...oldForm, [name]: value}))
    }

    function handleSubmit(event) {
        event.preventDefault();
        fetch(`/api/league/search/${form.nameleague}`)
            .then( response => {
                if (response.ok) {
                    return response.json();
                }
            })
            .then( response => {
                let allLeagues = response;
                let actualLeauges = [];
                let finishedLeagues = [];
                allLeagues.forEach(element => {
                    if (element.leagueend == null) {
                        actualLeauges = [...actualLeauges, element];
                    } else {
                        finishedLeagues = [...finishedLeagues, element];
                    }
                });
                setLeagues(actualLeauges);
                setOldLeagues(finishedLeagues);
            });
    }

    function deleteLeague(event, league) {
        event.preventDefault();
        const options = {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                "username" : ReactSession.get("username"),
                "password" : ReactSession.get("password")
            })
        };
        fetch("/api/league/delete/" + league.idleague, options)
            .then( response => {
                if (response.ok) {
                    window.location.reload();
                } else {
                    alert("Error while deleting league")
                }
            })
    }

    return (
        <div>
            <Navbar navbar = {navbar} />
            <div>
                <h2 className="login-title">
                    Search leagues by name
                </h2>
            </div>
            <div className="search" onSubmit={handleSubmit}>
                <form>
                    <div className="form-field">
                        <input type="text" name="nameleague" placeholder="League name" onChange={onChange} value={form.nameleague}/>
                    </div>

                    <div>
                        <button className="btn" type="submit"> Search </button>
                    </div>
                </form>
            </div>
            <div className="result-box">
                <h2>
                    Leagues:
                </h2>
                <div className="deck-container" id="start-row">
                    <p className="deck-container-item"> League </p>
                    <p className="deck-container-item"> Start date </p>
                    <p className="deck-container-item"> </p>
                </div>
                {leagues.map( league => (
                    <div className="deck-container">
                        <p className="deck-container-item"> {league.nameleague} </p>
                        <p className="deck-container-item"> {league.leaguestart} </p>
                        <div className="deck-container-item">
                            <a className="look-icon" href={"/league/" + league.idleague}>
                                <img className="look-icon-image" src="/search-icon.png" alt="look"/>
                            </a>
                            { admin ? <button className="delete-btn" onClick={event => deleteLeague(event, league)}>
                                <img className="delete-icon-image" src="/trash-icon.png" alt="trash"/>
                            </button> : null}
                        </div>
                    </div>
                ))}
                <h2>
                    Old leagues:
                </h2>
                <div className="deck-container" id="start-row">
                    <p className="deck-container-item"> League </p>
                    <p className="deck-container-item"> Start date </p>
                    <p className="deck-container-item"> End date </p>
                    <p className="deck-container-item"> </p>
                </div>
                {oldLeagues.map( league => (
                    <div className="deck-container">
                    <p className="deck-container-item"> {league.nameleague} </p>
                    <p className="deck-container-item"> {league.leaguestart} </p>
                    <p className="deck-container-item"> {league.leagueend} </p>
                    <div className="deck-container-item">
                        <a className="look-icon" href={"/league/" + league.idleague}>
                            <img className="look-icon-image" src="/search-icon.png" alt="look"/>
                        </a>
                        { admin ? <button className="delete-btn" onClick={event => deleteLeague(event, league)}>
                            <img className="delete-icon-image" src="/trash-icon.png" alt="trash"/>
                        </button> : null}
                    </div>
                </div>
                ))}
                { admin ? <a className="edit-profile-btn" href="/newleague">
                    <p> Add new league </p>
                </a> : null}
            </div>
        </div>
    );
}

export {LeagueSearch};