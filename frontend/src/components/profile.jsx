import React, {useEffect,useState} from 'react';
import axios from 'axios';
import ArcadeScoreboard from './ArcadeScoreboard';
import Settings from './Settings';
import './profile.css';

const SpotifyProfile = () => {
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  const [listLength, setListLength] = useState(20);
  const [showSettings, setShowSettings] = useState(false);

  if (error) {
    return <div>Error: {error}</div>;
  }

  const getItems = (category) => { 
    axios.get(`http://127.0.0.1:8000/scoreify/topitems/?items=${category}&limit=${listLength}`, {withCredentials: true})
    .then(response => {
      setItems(response.data);
    })
    .catch(err => {
      setError(err.message)
    });
  };

  const settingsUpdate = () => {

  }

  return (
    <>
      {showSettings ? (
        <Settings 
          onBack={() => setShowSettings(false)}
          updateSettings={settingsUpdate}
        />
      ) : (
        <ArcadeScoreboard 
          scores={items.map(item => ({
            name: item.name,
            score: item.popularity
          }))}
          onTracksClick={() => getItems('tracks')}
          onArtistsClick={() => getItems('artists')}
          onSettingsClick={() => setShowSettings(true)}
        />
      )}
    </>
  );
};
    
export default SpotifyProfile;