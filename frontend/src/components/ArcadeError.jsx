import React, { useEffect } from 'react';
import '../stylesheets/ArcadeScoreboard.css';

const ArcadeError = ({ message, onTimeout }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onTimeout();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onTimeout]);

  return (
    <div className="arcade-fullscreen">
      <div className="arcade-cabinet">
        <div className="screen-bezel">
          <div className="screen">
            <div className="screen-header">
              <h1>ERROR</h1>
            </div>
            <div className="error-message">
              {message}
            </div>
            <div className="screen-footer">
              <p>GAME OVER - REDIRECTING...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArcadeError; 