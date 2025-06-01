import React from 'react';
import './ArcadeScoreboard.css';

const ArcadeScoreboard = ({ scores, onTracksClick, onArtistsClick, onSettingsClick}) => {

  return (
    <div className="arcade-fullscreen">
      <div className="arcade-cabinet">
        <div className="screen-bezel">
          <div className="screen">
            <div className="screen-header">
              <h1>SCOREIFY</h1>
            </div>
            <div className="arcade-buttons">
              <button className="arcade-btn" onClick={onTracksClick}>TRACKS</button>
              <button className="arcade-btn" onClick={onArtistsClick}>ARTISTS</button>
              <button className='arcade-btn' onClick={onSettingsClick}>SETTINGS</button>
            </div>
            <div className="score-list">
              <div className="score-entry">
                <span className="rank">{"Rank"}</span>
                <span className="name">{"Name"}</span>
                <span className="score">{"Score"}</span>
              </div>
              {scores.map((score, index) => (
                <div key={index} className="score-entry">
                  <span className="rank">{(index + 1).toString().padStart(2, '0')}</span>
                  <span className="name">{score.name.toUpperCase().padEnd(12, ' ')}</span>
                  <span className="score">{score.score.toString().padStart(6, '0')}</span>
                </div>
              ))}
            </div>
            <div className="screen-footer">
              <p>SELECT YOUR CATEGORY</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArcadeScoreboard; 