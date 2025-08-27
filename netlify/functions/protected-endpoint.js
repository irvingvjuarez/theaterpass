const jwt = require('jsonwebtoken');

// Middleware function to verify auth
const verifyAuth = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
}

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    // Check authentication
    const token = event.headers.authorization?.replace('Bearer ', '');
    const user = verifyAuth(token);

    if (!user) {
        return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ error: 'Unauthorized' })
        }
    }

    // Your protected logic here
    return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
            message: 'Authorized',
            user: { userId: user.userId, email: user.email }
        })
    }
}