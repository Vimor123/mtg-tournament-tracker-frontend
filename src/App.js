import './App.css';
import { Home } from "./components/home";
import { Login } from "./components/registration/login";
import { Register } from "./components/registration/register";
import { PlayerSearch } from './components/players/players';
import { Player } from "./components/players/player";
import { Profile } from "./components/profile/profile";
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import { EditProfile } from './components/profile/editProfile';

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
          <Route path="/profile" element= {<Profile/>}/>
          <Route path="/editprofile" element = {<EditProfile/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
