import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const ArcadeSettings = ({showSettings, setShowSettings, listLength, setListLength, timeFrame, setTimeFrame, handleSaveSettings, handleLogout}) => {
  return (
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
      <Button 
        variant="danger" 
        onClick={handleLogout}
        className="arcade-btn"
      >
        LOGOUT
      </Button>
    </Modal.Footer>
  </Modal>
  );
};

export default ArcadeSettings;