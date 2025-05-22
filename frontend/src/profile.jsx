import React, {useEffect,useState} from 'react';
import axios from 'axios';

const SpotifyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tracks, setTracks] = useState([]);


  useEffect(() => {
    
    axios.get("http://127.0.0.1:8000/scoreify/profile/", {withCredentials: true})
    .then(response => {
        console.log(response);
        setProfile(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
    
  }, []);
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const getTracks = (items) => { 
    axios.get(`http://127.0.0.1:8000/scoreify/topitems/?items=${items}`, {withCredentials: true})
    .then(response => {
      console.log(response.data);
      setTracks(response.data);
    })
    .catch(err => {
      setError(err.message)
    });

  };

  

  return (
    <div>
      <h1>Spotify Profile</h1>
      <div>
        <button onClick={() => getTracks('tracks')}>Tracks</button>
        <button onClick={() => getTracks('artists')}>Artists</button>
      </div>
      <div>
        {tracks.map(item => (
          <div key={item.id}>
            <p>{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
    
export default SpotifyProfile;