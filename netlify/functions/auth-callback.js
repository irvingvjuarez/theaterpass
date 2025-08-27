const { google } = require('googleapis');
const jwt = require('jsonwebtoken');

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'GET') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { code, error } = event.queryStringParameters || {};

    if (error) {
        return {
            statusCode: 302,
            headers: { Location: '/login?error=access_denied' }
        };
    }

    if (!code) {
        return {
            statusCode: 302,
            headers: { Location: '/login?error=no_code' }
        };
    }

    try {
        // Exchange code for tokens
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        // Get user info
        const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
        const userInfo = await oauth2.userinfo.get();

        const user = {
            id: userInfo.data.id,
            email: userInfo.data.email,
            name: userInfo.data.name,
            picture: userInfo.data.picture
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // [PENDING] Store user in Azure Storage Account 
        // await storageUser(user);

        // Redirect to frontend with token
        return {
            statusCode: 302,
            headers: {
                Location: `/dashboard?token=${token}`,
                'Set-Cookie': `auth_token=${token}; HttpOnly; Path=/ Max-Age=604800; SameSite=Strict`
            }
        };
        
    } catch (error) {
        console.error('Auth callback error:', error);
        return {
            statusCode: 302,
            headers: { Location: '/login?error=auth_failed' }
        }
    }
}