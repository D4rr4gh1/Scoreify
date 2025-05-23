import React, {useEffect,useState} from 'react';
import axios from 'axios';
import ArcadeScoreboard from './ArcadeScoreboard';
import './profile.css';

const SpotifyProfile = () => {
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  const [listLength, setListLength] = useState(20);

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


  

  return (
      <ArcadeScoreboard 
        scores={items.map(item => ({
          name: item.name,
          score: item.popularity
        }))}
        onTracksClick={() => getItems('tracks')}
        onArtistsClick={() => getItems('artists')}
      />
  );
};
    
export default SpotifyProfile;