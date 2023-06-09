import { Navbar } from "../navbar";
import React from "react";
import { ReactSession }  from 'react-client-session';
import "../styles/newdeck.css";
import { useNavigate } from "react-router-dom";

function NewDeck() {
    ReactSession.setStoreType("localStorage");

    const [newDeck, setNewDeck] = React.useState({"namedeck" : "", "iddecktype" : 0, "cards" : []})

    const [deckTypes, setDeckTypes] = React.useState([]);

    const [newDecktype, setNewDecktype] = React.useState({"namedecktype" : ""});

    const [newDecktypeColors, setNewDecktypeColors] = React.useState([]);

    const [cards, setCards] = React.useState([]);

    const [newCard, setNewCard] = React.useState({"cardname" : "", "quantity" : 0, "insideboard" : false});

    const [navbar, setNavbar] = React.useState({"user" : "unregistered"});

    const navigate = useNavigate();


    const handleCheck = (event) => {
        var updatedDecktypeColors = [...newDecktypeColors];
        if (event.target.checked) {
          updatedDecktypeColors = [...newDecktypeColors, event.target.value];
        } else {
          updatedDecktypeColors.splice(newDecktypeColors.indexOf(event.target.value), 1);
        }
        setNewDecktypeColors(updatedDecktypeColors);
    }

    const handleCheckSideboard = (event) => {
        if (event.target.checked) {
            setNewCard(oldCard => ({...oldCard, ["insideboard"]: true}));
        } else {
            setNewCard(oldCard => ({...oldCard, ["insideboard"]: false}));
        }
    }

    function onChangeCard(event) {
        const {name, value} = event.target;
        setNewCard(oldCard => ({...oldCard, [name]: value}))
    }

    function onChange(event) {
        const {name, value} = event.target;
        setNewDeck(oldDeck => ({...oldDeck, [name]: value}))
    }

    function onChangeDecktype(event) {
        const {name, value} = event.target;
        setNewDecktype(oldDecktype => ({...oldDecktype, [name]: value}))
    }

    function addCard(event) {
        setCards(oldCards => ([...oldCards, newCard]));
        setNewCard({"cardname" : "", "quantity" : 0, "insideboard" : false});
    }

    function deleteCard(event, card) {
        event.preventDefault();
        let newCards = [...cards];
        newCards.splice(newCards.indexOf(card), 1);
        setCards(newCards);
    }

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
        fetch("/api/deck/types")
            .then( response => {
                if (response.ok) {
                    return response.json();
                }
            })
            .then( response => {
                setDeckTypes(response);
            })
    }, []);

    function handleSubmit(event) {
        event.preventDefault();
        const data = {
            "login" : {
                "username" : ReactSession.get("username"),
                "password" : ReactSession.get("password")
            },
            "namedeck" : newDeck.namedeck,
            "iddecktype" : newDeck.iddecktype,
            "cards" : cards,
        };
        const options = {
            method:'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        fetch("/api/deck/create", options)
            .then( response => {
                if (response.ok) {
                    navigate("/profile");
                } else {
                    alert("Deck creation unsuccessful")
                }
            });
    }

    function createNewDecktype(event) {
        event.preventDefault();
        const data = {
            "login" : {
                "username" : ReactSession.get("username"),
                "password" : ReactSession.get("password")
            },
            "namedecktype" : newDecktype.namedecktype,
            "colors" : newDecktypeColors,
        };
        const options = {
            method:'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        fetch("/api/decktype/create", options)
            .then( response => {
                if (response.ok) {
                    alert("New decktype created")
                } else {
                    alert("Error while creating decktype");
                }
            });
    }

    return (
        <div>
            <Navbar navbar = {navbar} />
            <h4 className="new-deck-subtitle"> New deck </h4>
            <div className="new-deck" onSubmit={handleSubmit}>
                <form>
                    <div className="form-field">
                        <input type="text" name="namedeck" placeholder="Deck name" onChange={onChange} value={newDeck.namedeck} required/>
                    </div>

                    <h4 className="new-deck-subtitle">
                        Deck type
                    </h4>

                    <select className="decktype-select" name="iddecktype" onChange={onChange} value={newDeck.iddecktype} required>
                        {deckTypes.map( deckType => (
                            <option value={deckType.iddecktype}> {deckType.namedecktype} </option>
                        ))}
                    </select>

                    <h4 className="new-deck-subtitle">
                        Create new deck type
                    </h4>

                    <div className="form-field">
                        <input type="text" name="namedecktype" placeholder="Deck type name" onChange={onChangeDecktype} value={newDeck.namedecktype}/>
                    </div>

                    <div className="colors-container">
                        <div className="color-container">
                            <img className="color-symbol" src="/mana_symbols/W.png" alt="White symbol"/>        
                            <input value={"White"} type="checkbox" onChange={handleCheck} />
                        </div>
                        <div className="color-container">
                            <img className="color-symbol" src="/mana_symbols/U.png" alt="Blue symbol"/>        
                            <input value={"Blue"} type="checkbox" onChange={handleCheck} />
                        </div>
                        <div className="color-container">
                            <img className="color-symbol" src="/mana_symbols/B.png" alt="Black symbol"/>        
                            <input value={"Black"} type="checkbox" onChange={handleCheck} />
                        </div>
                        <div className="color-container">
                            <img className="color-symbol" src="/mana_symbols/R.png" alt="Red symbol"/>        
                            <input value={"Red"} type="checkbox" onChange={handleCheck} />
                        </div>
                        <div className="color-container">
                            <img className="color-symbol" src="/mana_symbols/G.png" alt="Green symbol"/>        
                            <input value={"Green"} type="checkbox" onChange={handleCheck} />
                        </div>
                    </div>

                    <div className="btn-box">
                        <button class="btn" onClick={createNewDecktype}> Create decktype </button>
                    </div>

                    <h4 className="new-deck-subtitle">
                        Cards
                    </h4>

                    <div>
                        {cards.map( card => (
                            <div className="card-mini-container">
                                <p> {card.cardname} </p>
                                <p> {card.quantity} </p>
                                <p> {card.insideboard ? "Sideboard" : "Main Deck"} </p>
                                <button className="delete-btn" onClick={event => deleteCard(event, card)}>
                                    <img className="trash-icon" src="/trash-icon.png" alt="trash-icon"/>
                                </button>
                            </div>
                        ))}
                        <form className="mini-form">
                            <div className="mini-form-field">
                                <input className="card-name-field" type="text" name="cardname" placeholder="Card name" onChange={onChangeCard} value={newCard.cardname} required/>
                            </div>
                            <div className="mini-form-field">
                                <input className="quantity-field" type="number" name="quantity" placeholder="" onChange={onChangeCard} value={newCard.quantity} required/>
                            </div>
                            <div className="mini-form-field">
                                <input value={"Sideboard"} type="checkbox" onChange={handleCheckSideboard} />
                            </div>
                            <p> In sideboard </p>
                            <button class="add-btn" onClick={addCard}> Add card </button>
                        </form>
                    </div>

                    <div className="btn-box">
                        <button class="btn" type="submit"> Create deck </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export {NewDeck};