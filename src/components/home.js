import { ReactSession }  from 'react-client-session';
import { Navbar } from "./navbar"
import React from 'react';
import "./styles/main.css"

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
        </div>
    );
}
export {Home};