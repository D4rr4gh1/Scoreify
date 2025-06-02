const config = {
    development: {
        apiUrl: 'http://127.0.0.1:8000',
        frontendUrl: 'http://127.0.0.1:3000'
    },
    production: {
        apiUrl: 'https://scoreify-4vc1.onrender.com',
        frontendUrl: 'https://scoreify.vercel.app'
    }
};

const isDevelopment = process.env.NODE_ENV === 'development';

export const getApiUrl = () => isDevelopment ? config.development.apiUrl : config.production.apiUrl;
export const getFrontendUrl = () => isDevelopment ? config.development.frontendUrl : config.production.frontendUrl; 