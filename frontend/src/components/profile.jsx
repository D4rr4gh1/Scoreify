import React, {useState, useEffect, useCallback} from 'react';
import axios from 'axios';
import ArcadeScoreboard from './ArcadeScoreboard';
import ArcadeError from './ArcadeError';
import '../stylesheets/profile.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ArcadeSettings from './ArcadeSettings';
import ArcadeHelp from './ArcadeHelp';
import { getApiUrl } from '../config';

const SpotifyProfile = () => {
  const [searchParams] = useSearchParams();
  const sessionID = searchParams.get('session_id');
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  const [listLength, setListLength] = useState(20);
  const [timeFrame, setTimeFrame] = useState('short_term');
  const [showSettings, setShowSettings] = useState(false);
  const [category, setCategory] = useState('tracks');
  const [showHelp, setShowHelp] = useState(false);
  const navigate = useNavigate();


  const handleGetItems = useCallback((category, listLength, timeFrame) => { 
    axios.get(`${getApiUrl()}/scoreify/topitems/?items=${category}&limit=${listLength}&time_range=${timeFrame}&session_id=${sessionID}`, {withCredentials: true})
    .then(response => {
      setItems(response.data);
    })
    .catch(err => {
      setError({msg: err.response?.data || 'ERROR', code: err.response?.status || 500});
      setTimeout(() => {
        navigate('/', {replace: true});
      }, 3000);
    });
  }, [navigate]);

  useEffect(() => {
    handleGetItems(category, listLength, timeFrame);
  }, [category, listLength, timeFrame, handleGetItems]);

  if (error) {
    return (
      <ArcadeError 
        message={error.msg}
        onTimeout={error.code === 400 ? 
          () => { setTimeout(() => setError(null), 3000); navigate('/dashboard', { replace: true }) } : 
          () => { setTimeout(() => setError(null), 3000); navigate('/', { replace: true }) }}
      />
    );
  }

  if (!sessionID) {
    setError({msg: 'SESSION ID NOT IN URL', code: 400});
    setTimeout(() => {
      navigate('/', {replace: true});
    }, 3000);
  }

  const handleLogout = () => {
    axios.get(`${getApiUrl()}/scoreify/logout/?session_id=${sessionID}`, { withCredentials: true })
      .then(() => {
        setError({msg: 'LOGOUT SUCCESSFUL', code: 200});
      })
      .catch(err => {
        setError({msg: err.response?.data || 'LOGOUT ERROR', code: err.response?.status || 500});
      });
  };

  const handleSaveSettings = (updatedListLength, updatedTimeFrame) => {
    if (updatedListLength < 1 || updatedListLength > 50) {
      setError({msg: 'LIST LENGTH MUST BE BETWEEN 1 AND 50', code: 400});
      return;
    }
    if (updatedTimeFrame !== 'short_term' && updatedTimeFrame !== 'medium_term' && updatedTimeFrame !== 'long_term') {
      setError({msg: 'TIME FRAME MUST BE EITHER SHORT, MEDIUM, OR LONG', code: 400});
      return;
    }
    setListLength(updatedListLength);
    setTimeFrame(updatedTimeFrame);
    setShowSettings(false);
  }

  return (
    <>
      <ArcadeScoreboard 
        scores={items.map(item => ({
          name: item.name,
          score: item.popularity,
          artist: item.artists ? item.artists[0].name : null,
          url: item.external_urls.spotify
        }))}
        onTracksClick={() => setCategory('tracks')}
        onArtistsClick={() => setCategory('artists')}
        onSettingsClick={() => setShowSettings(true)}
        onHelpClick={() => setShowHelp(true)}
      />
      <ArcadeSettings
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        listLength={listLength}
        setListLength={setListLength}
        timeFrame={timeFrame}
        setTimeFrame={setTimeFrame}
        handleSaveSettings={handleSaveSettings}
        handleLogout={handleLogout}
      />
      <ArcadeHelp
        showHelp={showHelp}
        setShowHelp={setShowHelp}
      />
    </>
  );
};
    
export default SpotifyProfile;