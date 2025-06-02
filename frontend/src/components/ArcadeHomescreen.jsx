import React from 'react';
import '../stylesheets/ArcadeScoreboard.css';
import { getApiUrl } from '../config';

const ArcadeHomescreen = () => {
    return (
        <div className="arcade-fullscreen">
            <div className="arcade-cabinet">
                <div className="screen-bezel">
                    <div className="screen">
                        <div className="screen-header">
                            <h1>WELCOME TO SCOREIFY</h1>
                        </div>
                        <div className="arcade-buttons">
                            <button className="arcade-btn" onClick={() => window.location.href = `${getApiUrl()}/scoreify/callback/`}>LOGIN</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArcadeHomescreen;