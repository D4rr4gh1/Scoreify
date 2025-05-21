import React, {useEffect,useState} from 'react';
import axios from 'axios';

const SpotifyProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


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

    
      return (
        <div>
          <h1>Spotify Profile</h1>
          <div>
            <h2>{profile.display_name}</h2>
          </div>
        </div>
      );
    };
    
    export default SpotifyProfile;