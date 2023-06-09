import { useParams } from "react-router-dom";
import { Navbar } from "../navbar";
import React from "react";
import { ReactSession }  from 'react-client-session';
import "../styles/deck.css";
import "../styles/leagues.css";

function League() {

    ReactSession.setStoreType("localStorage");

    const [navbar, setNavbar] = React.useState({"user" : "unregistered"});
    const [admin, setAdmin] = React.useState(false);
    const [league, setLeague] = React.useState({"nameleague" : "", "leaguestart" : null, "leagueend" : null, "tournaments" : []});

    const [playerTable, setPlayerTable] = React.useState([]);

    const params = useParams();

    function deleteTournament(event, tournament) {
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
        fetch("/api/tournament/delete/" + tournament.idtournament, options)
            .then( response => {
                if (response.ok) {
                    window.location.reload();
                } else {
                    alert("Error while deleting tournament")
                }
            });
        
        let newLeague = league;
        let tournaments = newLeague.tournaments;
        tournaments.splice(tournaments.indexOf(tournament), 1);
        newLeague.tournaments = tournaments;
        setLeague(newLeague);
    };

    React.useEffect(() =>{

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
            });
        fetch("/api/league/" + params.id)
            .then( response => {
                if (response.ok) {
                    return response.json();
                }
            })
            .then( response => {
                setLeague(response);
                
                let newPlayerTable = []
                let fetchedTournaments = response.tournaments;

                fetchedTournaments.forEach( tournament => {
                    tournament.players.forEach( player => {
                        let playerInTable = false;
                        newPlayerTable.forEach( player2 => {
                            if (player2.username === player.player.username) {
                                player2.total += player.pointsleague;
                                playerInTable = true;
                            }
                        });
                        if (!playerInTable) {
                            newPlayerTable = [...newPlayerTable, {"username" : player.player.username, "id" : player.player.idplayer, "total" : 0}];
                        }
                    })
                })

                newPlayerTable = newPlayerTable.sort((player1, player2) => (player1.total < player2.total) ? 1 : -1);

                setPlayerTable(newPlayerTable);
                console.log(newPlayerTable);
            })
    }, []);

    return (
        <div>
            <Navbar navbar = {navbar}/>
            <div className="league-header">
                <h2>
                    {league.nameleague} 
                </h2>
                <p className="league-time">
                    League duration: {league.leaguestart ? league.leaguestart : ""} - {league.leagueend ? league.leagueend : "still active"}
                </p>

                <h2>
                    Players
                </h2>

                <table>
                    <tr>
                        <th> Player </th>
                        <th> Total points </th>
                    </tr>
                    {playerTable.map(player => (
                        <tr>
                            <td> <a className="text-link" href={"/player/" + player.id}>{player.username}</a> </td>
                            <td> {player.total} </td>
                        </tr>
                    ))}
                </table>

                <div className="tournaments-box">
                    <h2>
                        Tournaments
                    </h2>
                    <div className="deck-container" id="start-row">
                        <p className="deck-container-item"> Tournament </p>
                        <p className="deck-container-item"> Start </p>
                        <p className="deck-container-item"> End </p>
                        <p className="deck-container-item"> </p>
                    </div>
                    {league.tournaments.map( tournament => (
                        <div className="deck-container">
                        <p className="deck-container-item"> {tournament.nametournament} </p>
                        <p className="deck-container-item"> {tournament.tournamentstart} </p>
                        <p className="deck-container-item"> {tournament.tournamentend} </p>
                        <div className="deck-container-item">
                            <a className="look-icon" href={"/tournament/" + tournament.idtournament}>
                                <img className="look-icon-image" src="/search-icon.png" alt="look"/>
                            </a>
                            { admin ? <button className="delete-btn" onClick={event => deleteTournament(event, tournament)}>
                                <img className="delete-icon-image" src="/trash-icon.png" alt="trash"/>
                            </button> : null}
                        </div>
                    </div>
                    ))}
                    { admin ? <a className="edit-profile-btn" href={"/newtournament/" + params.id}>
                        <p> Add new tournament </p>
                    </a> : null}
                </div>

            </div>
        </div>
    )
}

export {League};