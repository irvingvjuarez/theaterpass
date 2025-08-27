const jwt = require('jsonwebtoken');

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        // Get token from Authorization header or cookie
        let token = event.headers.authorization?.replace('Bearer ', '');

        if (!token && event.headers.cookie) {
            const cookies = event.headers.cookie.split(';');
            const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth_token='));
            if (authCookie) {
                token = authCookie.split('=')[1];
            }
        }

        if (!token) {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({
                    authenticated: false, message: 'No token provided'
                })
            }
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                authenticated: true,
                user: { userId: decoded.userId, email: decoded.email }
            })
        }
    } catch (error) {
        return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ authenticated: false, message: 'Invalid token' });
        }
    }
}