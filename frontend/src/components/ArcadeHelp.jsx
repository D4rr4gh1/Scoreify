import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

const ArcadeHelp = ({showHelp, setShowHelp}) => {
  return (
    <Modal 
    show={showHelp} 
    onHide={() => setShowHelp(false)}
    centered
    className="arcade-modal"
  >
    <Modal.Header closeButton>
      <Modal.Title className="arcade-text">HELP</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <div className="settings-content">
        <div className="setting-item">
            <label className='arcade-text'>
                This app is inspired by <Link to="https://receiptify.herokuapp.com/index.html" target="_blank">'Receiptify'</Link> by <Link to="https://michellexliu.me/" target="_blank">Michelle Liu</Link>.
                All rankings are calculated based on some algorithmused by spotify, I'm not sure what it is honestly. The code is available on my GitHub,
                it is not the tidiest but it was a learning experience. This app is not affiliated with Spotify. Your data is not stored, it is only used to get the data from Spotify.
                If you wish to revoke permissions, you can do so by visiting <Link to="http://www.spotify.com/account/apps/?_ga=2.57194153.2059435232.1677244602-1044990631.1616788427" target="_blank">Spotify's manage apps page</Link>.
            </label>
        </div>
        <div className="setting-item">
            <label className='arcade-text'>
                About Me: This was made by Darragh Connolly, you can find me on <Link to="https://www.linkedin.com/in/darragh-connolly-394347253" target="_blank">LinkedIn</Link> and <Link to="https://github.com/D4rr4gh1" target="_blank">GitHub</Link>.
            </label>
        </div>
        <div className="setting-item">
          <label className="arcade-text">List Length: This is the number of items that will be displayed on the scoreboard.</label>
        </div>
        <div className="setting-item">
          <label className="arcade-text">Time Frame: This is the time frame for the items that will be displayed on the scoreboard. Short term is the last 4 weeks, medium term is the last 6 months, and long term is all time.</label>
        </div>
        <div className="setting-item">
            <label className='arcade-text'>Score: This is the popularity score of the item. The higher the score, the more popular the item is.</label>
        </div>
      </div>
    </Modal.Body>
    <Modal.Footer>
      <Button 
        variant="secondary" 
        onClick={() => setShowHelp(false)}
        className="arcade-btn"
      >
        CLOSE
      </Button>
    </Modal.Footer>
  </Modal>
  );
};

export default ArcadeHelp;