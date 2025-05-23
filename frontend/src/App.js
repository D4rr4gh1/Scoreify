import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import SpotifyProfile from './components/profile';
import ArcadeHomescreen from './components/ArcadeHomescreen';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ArcadeHomescreen />}/>
        <Route path="/dashboard" element={<SpotifyProfile />}/>
      </Routes>
    </Router>
  );
}

export default App;
