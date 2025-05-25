import React, {useEffect,useState} from 'react';
import axios from 'axios';
import ArcadeScoreboard from './ArcadeScoreboard';
import Settings from './Settings';
import './profile.css';
import Modal from 'react-bootstrap/Modal';

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

  const openSettings = () => {
    setShowSettings(true);
  }

  const closeSettings = () => {
    setShowSettings(false);
  }

  const settingsUpdate = () => {

  }

  return (
    <>

        <Modal open={showSettings} onClose={closeSettings}>
          <Settings 
            onBack={() => setShowSettings(false)}
            updateSettings={settingsUpdate}
          />
        </Modal>
        <ArcadeScoreboard 
          scores={items.map(item => ({
            name: item.name,
            score: item.popularity
          }))}
          onTracksClick={() => getItems('tracks')}
          onArtistsClick={() => getItems('artists')}
          onSettingsClick={() => setShowSettings(true)}
        />

    </>

  );
};
    
export default SpotifyProfile;