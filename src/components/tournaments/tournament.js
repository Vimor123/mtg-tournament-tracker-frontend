import { useParams } from "react-router-dom";
import { Navbar } from "../navbar";
import React from "react";
import { ReactSession }  from 'react-client-session';

import {
    PieChart,
    Pie,
    Tooltip,
    BarChart,
    XAxis,
    YAxis,
    Legend,
    CartesianGrid,
    Bar,
  } from "recharts";


function Tournament() {
    ReactSession.setStoreType("localStorage");

    const [tournament, setTournament] = React.useState({ "tournamentstart" : "", "tournamentend" : "", "players" : []});

    const [navbar, setNavbar] = React.useState({"user" : "unregistered"});

    const [dataChart, setDataChart] = React.useState([]);

    const params = useParams();

    React.useEffect(() =>{
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
        fetch("/api/player/login", options)
            .then((response) => {
                if (response.status === 200) {
                    let navbar_object = {"user" : "player"}
                    setNavbar(navbar_object);
                } else {
                    let navbar_object = {"user" : "unregistered"}
                    setNavbar(navbar_object);
                }
            });
        fetch("/api/tournament/" + params.id)
            .then( response => {
                if (response.ok) {
                    return response.json();
                }
            })
            .then( response => {
                let fetchedTournament = response;

                let fetchedPlayers = fetchedTournament.players;

                fetchedPlayers = fetchedPlayers.sort((player1, player2) => (player1.position > player2.position) ? 1 : -1)

                fetchedTournament.players = fetchedPlayers;

                let decktypeData = []

                fetchedPlayers.forEach(player => {
                    let decktypeInTable = false;
                    decktypeData.forEach(decktype => {
                        if (decktype.name === player.deck.decktype.namedecktype) {
                            decktypeInTable = true;
                            decktype.points += player.wins * 3 + player.draws;
                        }
                    })
                    if (!decktypeInTable) {
                        decktypeData = [...decktypeData, {"name" : player.deck.decktype.namedecktype, "points" : player.wins * 3 + player.draws}]
                    }
                });

                setDataChart(decktypeData);

                console.log(decktypeData);

                setTournament(fetchedTournament);
            })
    }, []);

    return (
        <div>
            <Navbar navbar = {navbar}/>
            <h2> {tournament.nametournament} </h2>
            <p className="tournament-info-element"> Date: {tournament.tournamentstart.substring(0, 10)} </p>
            <p className="tournament-info-element"> Tournament duration: {tournament.tournamentstart.substring(11, 16)} - {tournament.tournamentend.substring(11, 16)} </p>
            <p className="tournament-info-element"> Format: {tournament.format} </p>

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
            </div>

            {tournament.players.map(player => (
                <div className="mini-form-tournament">
                    <p className="start-field"> {player.position} </p>
                    <p className="start-field"> <a href={"/player/" + player.player.idplayer}> {player.player.username} </a> </p>
                    <p className="start-field"> <a href={"/deck/" + player.deck.iddeck}> {player.deck.nameDeck} </a> </p>
                    <p className="start-field"> {player.points} </p>
                    <p className="start-field"> {player.pointsleague} </p>
                    <p className="start-field"> {player.wins} </p>
                    <p className="start-field"> {player.losses} </p>
                    <p className="start-field"> {player.draws} </p>
                </div>
            ))}

            <div className="stats-box">
                <div>
                    <h4> Decktype points </h4>
                    <PieChart width={350} height={350}>
                        <Pie
                        dataKey="points"
                        isAnimationActive={false}
                        data={dataChart}
                        cx={200}
                        cy={200}
                        outerRadius={80}
                        fill="#7E5397"
                        label
                        />
                        <Tooltip />
                    </PieChart>
                </div>
            </div>

        </div>

    );
}

export {Tournament};