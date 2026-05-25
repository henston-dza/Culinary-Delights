const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    // Check if not token
    if (!authHeader) {
        return res.status(401).json({ message: 'No authorization token, access denied' });
    }

    // Verify token format (Bearer <token>)
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ message: 'Token format is invalid, must be Bearer <token>' });
    }

    const token = parts[1];

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_culinary_key_123');
        
        // Attach user info to request
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is invalid or expired, authorization failed' });
    }
};
