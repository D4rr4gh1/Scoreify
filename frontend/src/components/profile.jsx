import React, {useEffect,useState} from 'react';
import axios from 'axios';
import ArcadeScoreboard from './ArcadeScoreboard';
import Settings from './Settings';
import './profile.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const SpotifyProfile = () => {
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  const [listLength, setListLength] = useState(20);
  const [timeFrame, setTimeFrame] = useState('short_term');
  const [showSettings, setShowSettings] = useState(false);
  const [category, setCategory] = useState('tracks');

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

  const handleCategoryChange = (category) => {
    setCategory(category);
    getItems(category);
  }

  const handleSaveSettings = () => {
    // TODO: Save settings logic here
    setShowSettings(false);
    getItems(category);
  }

  return (
    <>
      <ArcadeScoreboard 
        scores={items.map(item => ({
          name: item.name,
          score: item.popularity
        }))}
        onTracksClick={() => handleCategoryChange('tracks')}
        onArtistsClick={() => handleCategoryChange('artists')}
        onSettingsClick={() => setShowSettings(true)}
      />
      <Modal 
        show={showSettings} 
        onHide={() => setShowSettings(false)}
        centered
        className="arcade-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title className="arcade-text">SETTINGS</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="settings-content">
            <div className="setting-item">
              <label className="arcade-text">List Length:</label>
              <input 
                type="number" 
                value={listLength}
                onChange={(e) => setListLength(parseInt(e.target.value))}
                min="1"
                max="50"
                className="arcade-input"
              />
            </div>
            <div className="setting-item">
              <label className="arcade-text">Time Frame:</label>
              <select 
                value={timeFrame}
                onChange={(e) => setTimeFrame(e.target.value)}
                className="arcade-input" 
              >
                <option value="short_term">Short Term</option>
                <option value="medium_term">Medium Term</option>
                <option value="long_term">Long Term</option>
              </select>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowSettings(false)}
            className="arcade-btn"
          >
            CLOSE
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSaveSettings}
            className="arcade-btn"
          >
            SAVE
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
    
export default SpotifyProfile;