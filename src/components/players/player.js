import { useParams } from "react-router-dom";
import { Navbar } from "../navbar";
import React from "react";
import { ReactSession }  from 'react-client-session';
import "../styles/profile.css"

function Player() {
    ReactSession.setStoreType("localStorage");

    const [navbar, setNavbar] = React.useState({"user" : "unregistered"});

    const [player, setPlayer] = React.useState({});
    const [decks, setDecks] = React.useState([]);

    const params = useParams();
    

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
                } else {
                    let navbar_object = {"user" : "unregistered"}
                    setNavbar(navbar_object);
                }
            });

        const idplayer = params.id;
        fetch("/api/player/" + idplayer)
            .then( response => {
                if (response.ok) {
                    return response.json();
                }
            })
            .then( response => {
                setPlayer(response);
            });
        fetch("/api/deck/player/" + idplayer)
            .then( response => {
                if (response.ok) {
                    return response.json();
                }
            })
            .then( response => {
                setDecks(response);
            });
    }, []);

    return (
        <div>
            <Navbar navbar = {navbar}/>
            <h2 className="profile-title"> Player profile </h2>
            <table className="info-table">
                <tr>
                    <td className="table-cell">
                        Username:
                    </td>
                    <td className="table-cell">
                        {player.username}
                    </td>
                </tr>
                <tr>
                    <td className="table-cell">
                        Name:
                    </td>
                    <td className="table-cell">
                        {player.name}
                    </td>
                </tr>
                <tr>
                    <td className="table-cell">
                        Surname:
                    </td>
                    <td className="table-cell">
                        {player.surname}
                    </td>
                </tr>
            </table>
            <h2 className="profile-title"> Decks </h2>
            <div className="deck-container" id="start-row">
                <p className="deck-container-item"> Deck </p>
                <p className="deck-container-item"> Colors </p>
                <p className="deck-container-item"> Deck type </p>
                <p className="deck-container-item"> Type colors </p>
                <p className="deck-container-item"> </p>
            </div>
            {decks.map( deck => (
                <div className="deck-container">
                    <p className="deck-container-item"> {deck.nameDeck} </p>
                    <div className="colors-container">
                        {deck.colors.map ( color => (
                            <img className="mana-symbol" src={"/mana_symbols/" + color.namecolor + ".png"} alt="Mana Symbol"/>
                        ))}
                    </div>
                    <p className="deck-container-item"> {deck.decktype.namedecktype} </p>
                    <div className="colors-container">
                        {deck.decktype.decktypecolors.map ( color => (
                            <img className="mana-symbol" src={"/mana_symbols/" + color.namecolor + ".png"} alt="Mana Symbol"/>
                        ))}
                    </div>
                    <div className="deck-container-item">
                        <a className="look-icon" href={"/deck/" + deck.iddeck}>
                            <img className="look-icon-image" src="/search-icon.png" alt="look"/>
                        </a>
                    </div>
                </div>
            ))}
        </div>
    );
}

export {Player};