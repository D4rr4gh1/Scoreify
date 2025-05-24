import React from 'react';
import './ArcadeScoreboard.css';

const Settings = ({ onBack, updateSettings }) => {
  return (
    <div className="arcade-fullscreen">
      <div className="arcade-cabinet">
        <div className="screen-bezel">
          <div className="screen">
            <div className="screen-header">
              <h1>SETTINGS</h1>
            </div>
            <div className="arcade-buttons">
              <button className="arcade-btn" onClick={onBack}>BACK</button>
            </div>
            <div>
                
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;