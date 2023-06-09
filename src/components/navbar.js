import "./styles/navbar.css";

function Navbar(props) {
    const {user} = props.navbar;

    if (user == "unregistered") {
        return (
            <nav className="navbar">
                <a className="nav-element" href="/">
                    <h3> Home </h3>
                </a>
                <a className="nav-element" href="/leagues">
                    <h3> Leagues </h3>
                </a>
                <a className="nav-element" href="/decks">
                    <h3> Decks </h3>
                </a>
                <a className="nav-element" href="/players">
                    <h3> Players </h3>
                </a>
                <a className="nav-element" href="/login">
                    <h3> Login </h3>
                </a>
                <a className="nav-element" href="/register">
                    <h3> Register </h3>
                </a>
            </nav>
        );
    } else if (user == "player") {
        return (
            <nav className="navbar">
                <a className="nav-element" href="/">
                    <h3> Home </h3>
                </a>
                <a className="nav-element" href="/leagues">
                    <h3> Leagues </h3>
                </a>
                <a className="nav-element" href="/decks">
                    <h3> Decks </h3>
                </a>
                <a className="nav-element" href="/players">
                    <h3> Players </h3>
                </a>
                <a className="nav-element" href="/profile">
                    <h3> Profile </h3>
                </a>
                <a className="nav-element" href="/login">
                    <h3> Logout </h3>
                </a>
            </nav>
        );
    } else if (user == "admin") {
        return (
            <nav className="navbar">
                <a className="nav-element" href="/">
                    <h3> Home </h3>
                </a>
                <a className="nav-element" href="/leagues">
                    <h3> Leagues </h3>
                </a>
                <a className="nav-element" href="/decks">
                    <h3> Decks </h3>
                </a>
                <a className="nav-element" href="/players">
                    <h3> Players </h3>
                </a>
                <a className="nav-element" href="/profile">
                    <h3> Profile </h3>
                </a>
                <a className="nav-element" href="/login">
                    <h3> Logout </h3>
                </a>
            </nav>
        );
    }
}
export {Navbar};