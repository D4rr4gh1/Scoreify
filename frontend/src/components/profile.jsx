import React, {useState, useEffect, useCallback} from 'react';
import axios from 'axios';
import ArcadeScoreboard from './ArcadeScoreboard';
import ArcadeError from './ArcadeError';
import '../stylesheets/profile.css';
import { useNavigate } from 'react-router-dom';
import ArcadeSettings from './ArcadeSettings';
import ArcadeHelp from './ArcadeHelp';

const SpotifyProfile = () => {
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  const [listLength, setListLength] = useState(20);
  const [timeFrame, setTimeFrame] = useState('short_term');
  const [showSettings, setShowSettings] = useState(false);
  const [category, setCategory] = useState('tracks');
  const [showHelp, setShowHelp] = useState(false);
  const navigate = useNavigate();

  const handleGetItems = useCallback((category, listLength, timeFrame) => { 
    axios.get(`http://127.0.0.1:8000/scoreify/topitems/?items=${category}&limit=${listLength}&time_range=${timeFrame}`, {withCredentials: true})
    .then(response => {
      console.log(response.data);
      setItems(response.data);
    })
    .catch(err => {
      setError(err.response?.data || 'ERROR');
      setTimeout(() => {
        navigate('/', {replace: true});
      }, 3000);
    });
  }, [navigate]);

  useEffect(() => {
    handleGetItems(category, listLength, timeFrame);
  }, [category, listLength, timeFrame, handleGetItems]);

  if (error) {
    return (
      <ArcadeError 
        message={error}
        onTimeout={() => navigate('/', { replace: true })}
      />
    );
  }

  const handleLogout = () => {
    axios.get('http://127.0.0.1:8000/scoreify/logout/', { withCredentials: true })
      .then(() => {
        setError('LOGOUT SUCCESSFUL');
      })
      .catch(err => {
        setError(err.response?.data || 'LOGOUT ERROR');
      });
  };

  const handleSaveSettings = (updatedListLength, updatedTimeFrame) => {
    setListLength(updatedListLength);
    setTimeFrame(updatedTimeFrame);
    setShowSettings(false);
  }

  return (
    <>
      <ArcadeScoreboard 
        scores={items.map(item => ({
          name: item.name,
          score: item.popularity,
          artist: item.artists ? item.artists[0].name : null,
          url: item.external_urls.spotify
        }))}
        onTracksClick={() => setCategory('tracks')}
        onArtistsClick={() => setCategory('artists')}
        onSettingsClick={() => setShowSettings(true)}
        onHelpClick={() => setShowHelp(true)}
      />
      <ArcadeSettings
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        listLength={listLength}
        setListLength={setListLength}
        timeFrame={timeFrame}
        setTimeFrame={setTimeFrame}
        handleSaveSettings={handleSaveSettings}
        handleLogout={handleLogout}
      />
      <ArcadeHelp
        showHelp={showHelp}
        setShowHelp={setShowHelp}
      />
    </>
  );
};
    
export default SpotifyProfile;