import { getApiUrl } from '../config';

// Example of using the URL in an API call:
const fetchUserProfile = async () => {
    try {
        const response = await fetch(`${getApiUrl()}/scoreify/profile/`, {
            credentials: 'include'
        });
        // ... rest of the code
    } catch (error) {
        console.error('Error fetching profile:', error);
    }
}; 