import { ReactSession }  from 'react-client-session';
import { Navbar } from "./navbar"
import React from 'react';
import "./styles/main.css"
import "./styles/home.css"

function Home() {
    ReactSession.setStoreType("localStorage");

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

    return (
        <div>
            <Navbar navbar = {navbar} />
            <h1 className="home-title">
                Welcome to Magic the Gathering tournament tracker!
            </h1>
            <div className="intro-div">
                <div className="intro-element">
                    Here, you can track your league progress, results of LGS tournaments and the current meta decks.
                </div>
                <div className="intro-element">
                    Each league consists of multiple tournaments, if you wish to view the total league standings, head over to the <a className="text-link" href="leagues"> "Leagues" </a> tab and select your league.
                    In a league, you can view the details for each tournament, all the players that played in the tournament, their rankings and their decklists.
                </div>
                <div className="intro-element">
                    If you wish to search for decklists, head over to the <a className="text-link" href="decks"> "Decks" </a>  tab and search decks by entering the name of the decktype.
                </div>
                <div className="intro-element">
                    You can also search for individual players and view their profiles at the <a className="text-link" href="players"> "Players" </a>  tab
                </div>
            </div>
        </div>
    );
}
export {Home};