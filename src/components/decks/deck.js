import { useParams } from "react-router-dom";
import { Navbar } from "../navbar";
import React from "react";
import { ReactSession }  from 'react-client-session';
import "../styles/deck.css";
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

function Deck() {
    ReactSession.setStoreType("localStorage");

    const [navbar, setNavbar] = React.useState({"user" : "unregistered"});
    const [deck, setDeck] = React.useState({"colors" : [], "cards" : [], "player" : {"username" : ""},
                                            "decktype" : {"namedecktype" : "", "decktypecolors" : []}});

    const [creatureNo, setCreatureNo] = React.useState(0);
    const [spellsNo, setSpellsNo] = React.useState(0);
    const [landsNo, setLandsNo] = React.useState(0);
    const [sideboardNo, setSideboardNo] = React.useState(0);

    const [creatures, setCreatures] = React.useState([])
    const [spells, setSpells] = React.useState([])
    const [lands, setLands] = React.useState([])
    const [sideboard, setSideboard] = React.useState([])

    const params = useParams();

    const [dataChart, setDataChart] = React.useState([
        { name : "Creatures", value : 0},
        { name : "Spells", value : 0},
        { name : "Lands", value : 0},
    ]);

    const [manaChart, setManaChart] = React.useState([
        { name : "0", value : 0},
        { name : "1", value : 0},
        { name : "2", value : 0},
        { name : "3", value : 0},
        { name : "4", value : 0},
        { name : "5", value : 0},
        { name : "6+", value : 0},
    ]);

    React.useEffect(() =>{
        var username = ReactSession.get("username");
        var password = ReactSession.get("password");

        const legal_mana_literals = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
                                    "W", "U", "B", "R", "G", "W/P", "U/P", "B/P", "R/P", "G/P", "2/W", "2/U", "2/B", "2/R", "2/G",
                                    "W/U", "W/B", "U/R", "U/B", "B/G", "B/R", "R/G", "R/W", "G/W", "G/U", "X"];

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
        fetch("/api/deck/" + params.id)
            .then( response => {
                if (response.ok) {
                    return response.json();
                }
            })
            .then( response => {
                setDeck(response);
                setSideboard([]);
                setSideboardNo(0);
                setLands([]);
                setLandsNo(0);
                setCreatures([]);
                setCreatureNo(0);
                setSpells([]);
                setSpellsNo(0);
                setManaChart([
                    { name : "0", value : 0},
                    { name : "1", value : 0},
                    { name : "2", value : 0},
                    { name : "3", value : 0},
                    { name : "4", value : 0},
                    { name : "5", value : 0},
                    { name : "6+", value : 0},
                ]);
                let cardarray = response.cards;
                cardarray.forEach(card => {
                    let sideboard = false;
                    let land = false;
                    let creature = false;
                    if (card.insideboard) {
                        sideboard = true;
                    }
                    card.card.cardtypes.forEach(cardtype => {
                        if (cardtype.namecardtype == "Land") {
                            land = true;
                        }
                        if (cardtype.namecardtype == "Creature") {
                            creature = true;
                        }
                    })

                    let manacost_symbols = []
                    let manacost_string = card.card.manacost;
                    if (manacost_string.length > 2) {
                        let manacost_string_stripped = manacost_string.slice(1, -1);
                        let manacosts = manacost_string_stripped.split("}/{");
                        manacosts.forEach( manacost => {
                            let manacost_literals = manacost.split("}{");
                            let new_manacost_literals = [];
                            manacost_literals.forEach ( literal => {
                                if (legal_mana_literals.includes(literal)) {
                                    if (literal == "W/P") {
                                        new_manacost_literals.push("WP");
                                    } else if (literal == "U/P") {
                                        new_manacost_literals.push("UP");
                                    } else if (literal == "B/P") {
                                        new_manacost_literals.push("BP");
                                    } else if (literal == "R/P") {
                                        new_manacost_literals.push("RP");
                                    } else if (literal == "G/P") {
                                        new_manacost_literals.push("GP");
                                    } else if (literal == "2/W") {
                                        new_manacost_literals.push("W2");
                                    } else if (literal == "2/U") {
                                        new_manacost_literals.push("U2");
                                    } else if (literal == "2/B") {
                                        new_manacost_literals.push("B2");
                                    } else if (literal == "2/R") {
                                        new_manacost_literals.push("R2");
                                    } else if (literal == "2/G") {
                                        new_manacost_literals.push("G2");
                                    } else if (literal == "W/U") {
                                        new_manacost_literals.push("WU");
                                    } else if (literal == "W/B") {
                                        new_manacost_literals.push("WB");
                                    } else if (literal == "U/R") {
                                        new_manacost_literals.push("UR");
                                    } else if (literal == "U/B") {
                                        new_manacost_literals.push("UB");
                                    } else if (literal == "B/R") {
                                        new_manacost_literals.push("BR");
                                    } else if (literal == "B/G") {
                                        new_manacost_literals.push("BG");
                                    } else if (literal == "R/G") {
                                        new_manacost_literals.push("RG");
                                    } else if (literal == "R/W") {
                                        new_manacost_literals.push("WR");
                                    } else if (literal == "G/U") {
                                        new_manacost_literals.push("UG");
                                    } else if (literal == "G/W") {
                                        new_manacost_literals.push("WG");
                                    } else {
                                        new_manacost_literals.push(literal);
                                    }
                                }
                            })
                            manacost_symbols = [...manacost_symbols, new_manacost_literals];
                        });
                    }

                    let newCard = card;
                    newCard.manacost_symbols = manacost_symbols;
                
                    if (sideboard) {
                        setSideboard(oldSideboard => ([...oldSideboard, newCard]));
                        setSideboard(oldSideboard => (oldSideboard.sort((card1, card2) => (card1.card.namecard > card2.card.namecard) ? 1 : -1)));
                        setSideboardNo(oldSideboardNo => oldSideboardNo + card.quantity);
                    } else if (land) {
                        setLands(oldLands => ([...oldLands, newCard]));
                        setLands(oldLands => (oldLands.sort((card1, card2) => (card1.card.namecard > card2.card.namecard) ? 1 : -1)));
                        setLandsNo(oldLandsNo => oldLandsNo + card.quantity);
                        

                    } else if (creature) {
                        setCreatures(oldCreatures => ([...oldCreatures, newCard]));
                        setCreatures(oldCreatures => (oldCreatures.sort((card1, card2) => (card1.card.namecard > card2.card.namecard) ? 1 : -1)));
                        setCreatureNo(oldCreatureNo => oldCreatureNo + card.quantity);

                        let mana_cost_symbols = card.manacost_symbols[0]
                        let cmc = 0;
                        mana_cost_symbols.forEach(symbol => {
                            if (isNaN(symbol)) {
                                cmc += 1;
                            } else {
                                cmc += parseInt(symbol);
                            }
                        })
                        let oldManaChart = manaChart;
                        if (cmc == 0) {
                            oldManaChart[0]["value"] += 1;
                        } else if (cmc == 1) {
                            oldManaChart[1]["value"] += 1;
                        } else if (cmc == 2) {
                            oldManaChart[2]["value"] += 1;
                        } else if (cmc == 3) {
                            oldManaChart[3]["value"] += 1;
                        } else if (cmc == 4) {
                            oldManaChart[4]["value"] += 1;
                        } else if (cmc == 5) {
                            oldManaChart[5]["value"] += 1;
                        } else if (cmc >= 6) {
                            oldManaChart[6]["value"] += 1;
                        }
                        setManaChart(oldManaChart);
                    } else {
                        setSpells(oldSpells => ([...oldSpells, newCard]));
                        setSpells(oldSpells => (oldSpells.sort((card1, card2) => (card1.card.namecard > card2.card.namecard) ? 1 : -1)));
                        setSpellsNo(oldSpellsNo => oldSpellsNo + card.quantity);

                        let mana_cost_symbols = card.manacost_symbols[0]
                        let cmc = 0;
                        mana_cost_symbols.forEach(symbol => {
                            if (isNaN(symbol)) {
                                cmc += 1;
                            } else {
                                cmc += parseInt(symbol);
                            }
                        })
                        let oldManaChart = manaChart;
                        if (cmc == 0) {
                            oldManaChart[0]["value"] += card.quantity;
                        } else if (cmc == 1) {
                            oldManaChart[1]["value"] += card.quantity;
                        } else if (cmc == 2) {
                            oldManaChart[2]["value"] += card.quantity;
                        } else if (cmc == 3) {
                            oldManaChart[3]["value"] += card.quantity;
                        } else if (cmc == 4) {
                            oldManaChart[4]["value"] += card.quantity;
                        } else if (cmc == 5) {
                            oldManaChart[5]["value"] += card.quantity;
                        } else if (cmc >= 6) {
                            oldManaChart[6]["value"] += card.quantity;
                        }
                        setManaChart(oldManaChart);
                    }

                });

                setDataChart([
                    { name : "Creatures", value : creatureNo},
                    { name : "Spells", value : spellsNo},
                    { name : "Lands", value : landsNo},
                ])

                /*
                let sorted_creatures = creatures.sort(
                    (card1, card2) => (card1.card.namecard < card2.card.namecard) ? 1 : -1);
                setCreatures(sorted_creatures);
                let sorted_spells = spells.sort(
                    (card1, card2) => (card1.card.namecard < card2.card.namecard) ? 1 : -1);
                setSpells(sorted_spells);
                let sorted_lands = lands.sort(
                    (card1, card2) => (card1.card.namecard < card2.card.namecard) ? 1 : -1);
                setLands(sorted_lands);
                let sorted_sideboard = creatures.sort(
                    (card1, card2) => (card1.card.namecard < card2.card.namecard) ? 1 : -1);
                setSideboard(sorted_sideboard);
                */
            })
    }, []);

    return (
        <div>
            <Navbar navbar = {navbar}/>
            <div className="deck-header">
                <h2>
                    {deck.nameDeck}
                </h2>
                <div className="colors-container">
                    {deck.colors.map ( color => (
                        <img className="mana-symbol" src={"/mana_symbols/" + color.namecolor + ".png"} alt="Mana Symbol"/>
                    ))}
                </div>
            </div>
            <h3 className="deck-subtitle">
                by <a className="player-link" href={"/player/" + deck.player.idplayer}> {deck.player.username} </a>
            </h3>
            <div className="decktype-header">
                <h3 className="deck-subtitle"> Decktype: {deck.decktype.namedecktype} </h3>
                <div className="colors-container">
                    {deck.decktype.decktypecolors.map ( color => (
                        <img className="mana-symbol" src={"/mana_symbols/" + color.namecolor + ".png"} alt="Mana Symbol"/>
                    ))}
                </div>
            </div>
            <h2> Cards </h2>
            <div className="card-box">
                <div className="card-column">
                    <h3>
                        Creatures ({creatureNo})
                    </h3>
                    {creatures.map ( card => (
                        <div className="card-container"> 
                            <p className="card-title"> {card.quantity} <a href={card.card.picture}> {card.card.namecard} </a> </p>
                            <div className="manacosts-container">
                            {card.manacost_symbols.map( manacost => (
                                <div className="manacost-container">
                                    {manacost.map( symbol => ( 
                                        <img className="mana-symbol-small" src={"/mana_symbols/" + symbol + ".png"} alt="Mana Symbol"/>
                                    ))}
                                </div>
                            ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="card-column">
                    <h3>
                        Spells ({spellsNo})
                    </h3>
                    {spells.map ( card => (
                        <div className="card-container"> 
                            <p className="card-title"> {card.quantity} <a href={card.card.picture}> {card.card.namecard} </a> </p>
                            <div className="manacosts-container">
                            {card.manacost_symbols.map( manacost => (
                                <div className="manacost-container">
                                    {manacost.map( symbol => ( 
                                        <img className="mana-symbol-small" src={"/mana_symbols/" + symbol + ".png"} alt="Mana Symbol"/>
                                    ))}
                                </div>
                            ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="card-column">
                    <h3>
                        Lands ({landsNo})
                    </h3>
                    {lands.map ( card => (
                        <div className="card-container"> 
                            <p className="card-title"> {card.quantity} <a href={card.card.picture}> {card.card.namecard} </a> </p>
                            <div className="manacosts-container">
                            {card.manacost_symbols.map( manacost => (
                                <div className="manacost-container">
                                    {manacost.map( symbol => ( 
                                        <img className="mana-symbol-small" src={"/mana_symbols/" + symbol + ".png"} alt="Mana Symbol"/>
                                    ))}
                                </div>
                            ))}
                            </div>
                        </div>
                    ))}
                    <h3>
                        Sideboard ({sideboardNo})
                    </h3>
                    {sideboard.map ( card => (
                        <div className="card-container"> 
                            <p className="card-title"> {card.quantity} <a href={card.card.picture}> {card.card.namecard} </a> </p>
                            <div className="manacosts-container">
                            {card.manacost_symbols.map( manacost => (
                                <div className="manacost-container">
                                    {manacost.map( symbol => ( 
                                        <img className="mana-symbol-small" src={"/mana_symbols/" + symbol + ".png"} alt="Mana Symbol"/>
                                    ))}
                                </div>
                            ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <h2> Stats </h2>

            <div className="stats-box">
                <div>
                    <h4>Card distribution</h4>
                    <PieChart width={300} height={300}>
                        <Pie
                        dataKey="value"
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
                <div>
                    <h4>Mana values</h4>
                    <BarChart width={300} height={300} data={manaChart}>
                        <Bar dataKey="value" fill="#7E5397" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                    </BarChart>
                </div>
            </div>
        </div>  
    );
}

export {Deck};