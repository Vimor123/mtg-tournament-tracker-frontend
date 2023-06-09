import { Navbar } from "../navbar";
import React from "react";
import { ReactSession }  from 'react-client-session';
import { useNavigate, useParams } from "react-router-dom";
import "../styles/tournament.css";

function NewTournament() {
    ReactSession.setStoreType("localStorage");

    const [position, setPosition] = React.useState(1);
    
    const navigate = useNavigate();

    const [form, setForm] = React.useState({ nametournament : "", tournamentstart : "", tournamentend : "", players: [], format : ""});

    const [newPlayer, setNewPlayer] = React.useState({nameplayer : "", iddeck : "", position : "", points : "", pointsleague : "",
                                                        wins : "", losses : "", draws : ""});

    const [allPlayers, setAllPlayers] = React.useState([]);

    const [allDecks, setAllDecks] = React.useState([]);

    const [matchingDecks, setMatchingDecks] = React.useState([]);

    const [navbar, setNavbar] = React.useState({"user" : "unregistered"});

    const params = useParams();

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
            });
        fetch("/api/player")
            .then( response => {
                if (response.ok) {
                    return response.json();
                }
            })
            .then( response => {
                setAllPlayers(response);
            })
        fetch("/api/deck")
            .then( response => {
                if (response.ok) {
                    return response.json();
                }
            })
            .then( response => {
                setAllDecks(response);
            })
    }, []);

    function onChange(event) {
        event.preventDefault();
        const {name, value} = event.target;
        setForm(oldForm => ({...oldForm, [name]: value}))
    }

    function onChangePlayer(event) {
        event.preventDefault();
        console.log(newPlayer);
        const {name, value} = event.target;
        setNewPlayer(oldPlayer => ({...oldPlayer, [name]: value}))
        if (name === "nameplayer") {
            let matchingDecks = [];
            allDecks.forEach( deck => {
                if (deck.player.username === value) {
                    matchingDecks = [...matchingDecks, deck];
                }
            })
            setMatchingDecks(matchingDecks);
        }
    }

    function addPlayer(event) {
        event.preventDefault();
        console.log(form);
        setPosition(oldPosition => oldPosition + 1);

        let newForm = form;
        newForm.players = [...newForm.players, newPlayer];
        setForm(newForm);

        setNewPlayer({nameplayer : "", iddeck : "", position : "", points : "", pointsleague : "",
                        wins : "", losses : "", draws : ""})
    }

    function deletePlayer(event, player) {
        event.preventDefault();
        let newPlayers = [...form.players];
        newPlayers.splice(newPlayers.indexOf(player), 1);

        let newForm = form;
        newForm.players = newPlayers;
        setForm(newForm);

        setPosition(oldPosition => oldPosition - 1);
    }

    function handleSubmit(event) {
        event.preventDefault();
        let formPlayers = []
        form.players.forEach( (player, index) => {
            let playerid = 0;
            allPlayers.forEach( player2 => {
                if (player2.username == player.nameplayer) {
                    playerid = player2.idplayer;
                }
            })
            let formPlayer = {
                "idplayer" : playerid,
                "iddeck" : player.iddeck,
                "position" : index + 1,
                "points" : player.points,
                "pointsleague" : player.pointsleague,
                "wins" : player.wins,
                "losses" : player.losses,
                "draws" : player.draws
            }
            formPlayers = [...formPlayers, formPlayer]
        })

        const data = {
            "login" : {
                "username" : ReactSession.get("username"),
                "password" : ReactSession.get("password")
            },
            "nametournament" : form.nametournament,
            "tournamentstart" : form.tournamentstart.toString().split("T").join(" ") + ":00",
            "tournamentend" : form.tournamentend.toString().split("T").join(" ") + ":00",
            "format" : form.format,
            "idleague" : params.id,
            "players" : formPlayers
        };
        console.log(data);
        const options = {
            method:'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        fetch("/api/tournament/create", options)
            .then( response => {
                if (response.ok) {
                    navigate("/league/" + params.id);
                } else {
                    alert(response.json.message);
                }
            });
    }

    function isValid() {
        const {nametournament, tournamentstart, tournamentend} = form;
        return form.nametournament.length > 0 && form.tournamentstart.length > 0 && form.tournamentend.length > 0;
    }

    function isValidPlayer() {
        return newPlayer.wins >= 0 && newPlayer.draws >= 0 && newPlayer.losses >= 0 && newPlayer.points >= 0 && newPlayer.pointsleague >= 0 && newPlayer.nameplayer.length > 0;
    }

    return (
        <div>
            <Navbar navbar = {navbar} />
            <div>
                <h2 className="login-title">
                    New tournament
                </h2>
            </div>
            <div className="new-league" onSubmit={handleSubmit}>
                <form>
                    <div class="form-field">
                        <input type="text" name="nametournament" placeholder="Tournament name" onChange={onChange} value={form.nametournament} required/>
                    </div>
                    
                    <p> Format </p>

                    <select className="format-select" name="format" onChange={onChange} value={form.format} required>
                        <option value="Standard"> Standard </option>
                        <option value="Pioneer"> Pioneer </option>
                        <option value="Modern"> Modern </option>
                        <option value="Pauper"> Pauper </option>
                    </select>

                    <div class="form-field">
                        <p> Start time </p>
                        <input type="datetime-local" name="tournamentstart" onChange={onChange} value={form.tournamentstart} required/>
                    </div>

                    <div class="form-field">
                        <p> End time </p>
                        <input type="datetime-local" name="tournamentend" onChange={onChange} value={form.tournamentend} required/>
                    </div>

                    <h2> Players </h2>

                    <div className="mini-form-start">
                        <p className="start-field"> Position </p>
                        <p className="start-field"> Player </p>
                        <p className="start-field"> Deck </p>
                        <p className="start-field"> Points </p>
                        <p className="start-field"> League points </p>
                        <p className="start-field"> Wins </p>
                        <p className="start-field"> Losses </p>
                        <p className="start-field"> Draws </p>
                        <p className="start-field"> </p>
                    </div>

                    <div className="players-container">
                        {form.players.map( (player, index) => (
                            <div className="mini-form-tournament">
                                <p className="start-field"> {index + 1} </p>
                                <p className="start-field"> {player.nameplayer} </p>
                                <p className="start-field"> {player.iddeck ? "Deck set" : "Deck not set"} </p>
                                <p className="start-field"> {player.points} </p>
                                <p className="start-field"> {player.pointsleague} </p>
                                <p className="start-field"> {player.wins} </p>
                                <p className="start-field"> {player.losses} </p>
                                <p className="start-field"> {player.draws} </p>
                                <button className="delete-btn" onClick={event => deletePlayer(event, player)}>
                                    <img className="trash-icon" src="/trash-icon.png" alt="trash-icon"/>
                                </button>
                            </div>
                        ))}
                    </div>

                    <form className="mini-form-tournament">
                            <p className="start-field"> {position} </p>
                            <div className="mini-form-field-tournament">
                                <input className="nameplayer" type="text" name="nameplayer" placeholder="Player name" onChange={onChangePlayer} value={newPlayer.nameplayer} required/>
                            </div>
                            <select className="mini-form-field-tournament" name="iddeck" onChange={onChangePlayer} value={newPlayer.iddeck} >
                                {matchingDecks.map( deck => (
                                    <option className="deck-select" value={deck.iddeck}> {deck.nameDeck} </option>
                                ))}
                                <option className="deck-select" value=""> None </option>
                            </select>

                            <div className="mini-form-field-tournament">
                                <input type="number" name="points" onChange={onChangePlayer} value={newPlayer.points} required/>
                            </div>
                            <div className="mini-form-field-tournament">
                                <input type="number" name="pointsleague" onChange={onChangePlayer} value={newPlayer.pointsleague} required/>
                            </div>
                            <div className="mini-form-field-tournament">
                                <input type="number" name="wins" onChange={onChangePlayer} value={newPlayer.wins} required/>
                            </div>
                            <div className="mini-form-field-tournament">
                                <input type="number" name="losses" onChange={onChangePlayer} value={newPlayer.losses} required/>
                            </div>
                            <div className="mini-form-field-tournament">
                                <input type="number" name="draws" onChange={onChangePlayer} value={newPlayer.draws} required/>
                            </div>

                            <button class="add-btn" onClick={addPlayer} disabled={!isValidPlayer()}> Add player </button>
                    </form>

                    <div>
                        <button class="btn" type="submit" disabled={!isValid()}> Add new tournament </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export {NewTournament};