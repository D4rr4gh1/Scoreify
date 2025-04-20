
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import SpotifyProfile from './profile';
import Home from './home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/dashboard" element={<SpotifyProfile />}/>
      </Routes>
    </Router>
  );
}

export default App;
