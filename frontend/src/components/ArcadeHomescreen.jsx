import React from 'react';
import '../stylesheets/ArcadeScoreboard.css';
import { getApiUrl } from '../config';
import axios from 'axios';

const ArcadeHomescreen = () => {
    const handleLogin = () => {
        // Ensure cookies are enabled and credentials are included
        axios.defaults.withCredentials = true;
        window.location.href = `${getApiUrl()}/scoreify/callback/`;
    };

    return (
        <div className="arcade-fullscreen">
            <div className="arcade-cabinet">
                <div className="screen-bezel">
                    <div className="screen">
                        <div className="screen-header">
                            <h1>WELCOME TO SCOREIFY</h1>
                        </div>
                        <div className="arcade-buttons">
                            <button className="arcade-btn" onClick={handleLogin}>LOGIN</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArcadeHomescreen;