import { Navbar } from "../navbar";
import "../styles/login.css";
import "../styles/search.css";
import "../styles/decks.css";
import React from "react";
import { ReactSession }  from 'react-client-session';

function DeckSearch() {
    ReactSession.setStoreType("localStorage");

    const [form, setForm] = React.useState({ deckname: '' });

    const [decks, setDecks] = React.useState([]);

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
        fetch(`/api/deck/search/${form.deckname}`)
            .then( response => {
                if (response.ok) {
                    return response.json();
                }
            })
            .then( response => {
                setDecks(response);
                
                console.log(response);
            });
    }

    function isValid() {
        const {deckname} = form;
        return form.deckname.length > 0;
    }

    return (
        <div>
            <Navbar navbar = {navbar} />
            <div>
                <h2 className="login-title">
                    Search decks by deck type
                </h2>
            </div>
            <div className="search" onSubmit={handleSubmit}>
                <form>
                    <div className="form-field">
                        <input type="text" name="deckname" placeholder="Deck type" onChange={onChange} value={form.deckname} required/>
                    </div>

                    <div>
                        <button className="btn" type="submit" disabled={!isValid()}> Search </button>
                    </div>
                </form>
            </div>
            <div className="result-box">
                <h2>
                    Decks:
                </h2>
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
        </div>
    );
}

export {DeckSearch};