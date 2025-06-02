import React from 'react';
import '../stylesheets/ArcadeScoreboard.css';
import { SettingsIcon, HelpIcon } from './icons';
import { Link } from 'react-router-dom';

const ArcadeScoreboard = ({ scores, onTracksClick, onArtistsClick, onSettingsClick, onHelpClick}) => {

  return (
    <div className="arcade-fullscreen">
      <div className="arcade-cabinet">
        <div className="screen-bezel">
          <div className="screen">
            <div className="screen-header">
              <h1>SCOREIFY</h1>
            </div>
            <div className="arcade-buttons" style={{ justifyContent: 'space-between' }}>
              <div style={{ width: '100px' }}></div>
              <div style={{ display: 'flex', gap: '20px', minWidth: 'fit-content' }}>
                <button className="arcade-btn" onClick={onTracksClick}>TRACKS</button>
                <button className="arcade-btn" onClick={onArtistsClick}>ARTISTS</button>
              </div>
              <div style={{ display: 'flex', gap: '20px', width: '100px', justifyContent: 'flex-end', minWidth: 'fit-content'  }}>
                <button className='arcade-btn' onClick={onSettingsClick}>
                  <SettingsIcon />
                </button>
                <button className='arcade-btn' onClick={onHelpClick}>
                  <HelpIcon />
                </button>
              </div>
            </div>
            <div className="score-list">
              <div className="score-entry">
                <span className="rank">{"Rank"}</span>
                <span className="name">{"Name"}</span>
                <span className="score">{"Score"}</span>
              </div>
              {scores.map((score, index) => (
                <div key={index} className="score-entry">
                  {console.log(score)}
                  <span className="rank">{(index + 1).toString().padStart(2, '0')}</span>
                  <span className="name">
                    <Link to={score.url} target="_blank" className="item-link">
                      {score.name.toUpperCase().padEnd(12, ' ')}
                      {score.artist && <span className="artist"> - {score.artist.toUpperCase().padEnd(12, ' ')}</span>}
                    </Link>
                  </span>
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