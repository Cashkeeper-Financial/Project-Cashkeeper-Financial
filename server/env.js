import axios from 'axios';

exports.handler = async (event, context) => {
    try {
        const apiKey = process.env.API_KEY; // Ensure API_KEY is set in your environment variables
        const apiUrl = 'https://7fwwglseys3xlqk6hogiazspv40gzoug.lambda-url.us-east-1.on.aws/api/generate-token'; // Replace with your API endpoint

        // Make the POST request
        const response = await axios.post(
            apiUrl,
            {}, // If your API expects a request body, add it here
            {
                headers: {
                    'x-api-key': apiKey,
                },
            }
        );
        const token = response.data?.token; 
        
        return {
            statusCode: 200,
            body: JSON.stringify({ token }),
        };
    } catch (error) {
        console.error('Error connecting to the API:', error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
