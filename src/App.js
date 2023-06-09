import './App.css';
import { Home } from "./components/home";
import { Login } from "./components/registration/login";
import { Register } from "./components/registration/register";
import { PlayerSearch } from './components/players/players';
import { Player } from "./components/players/player";
import { Profile } from "./components/profile/profile";
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import { EditProfile } from './components/profile/editProfile';
import { Deck } from './components/decks/deck';
import { NewDeck } from './components/decks/newDeck';
import { DeckSearch } from './components/decks/decks';
import { LeagueSearch } from './components/leagues/leagues';
import { NewLeague } from './components/leagues/newLeague';
import { League } from './components/leagues/league';
import { NewTournament } from './components/tournaments/newTournament';
import { Tournament } from './components/tournaments/tournament';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element = {<Home/>}/>
          <Route path="/login" element = {<Login/>}/>
          <Route path="/register" element = {<Register/>}/>
          <Route path="/players" element = {<PlayerSearch/>} />
          <Route path="/player/:id" element = {<Player/>}/>
          <Route path="/profile" element = {<Profile/>}/>
          <Route path="/editprofile" element = {<EditProfile/>}/>
          <Route path="/decks" element = {<DeckSearch/>}/>
          <Route path="/deck/:id" element = {<Deck/>}/>
          <Route path="/newdeck" element = {<NewDeck/>}/>
          <Route path="/leagues" element = {<LeagueSearch/>}/>
          <Route path="/league/:id" element = {<League/>}/>
          <Route path="/newleague" element = {<NewLeague/>}/>
          <Route path="/tournament/:id" element = {<Tournament/>}/>
          <Route path="/newtournament/:id" element = {<NewTournament/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
