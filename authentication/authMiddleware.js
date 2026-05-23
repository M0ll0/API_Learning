const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

function authMiddleware(req, res, next) {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "No token provided"
        });
    }

    try {

        const decoded = jwt.verify(token, secret);

        req.user = decoded;

        next();

    } catch (err) {

        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });

    }
}

function logout(req, res) {

    res.clearCookie("token");

    return res.json({
        success: true
    });
}

module.exports = {authMiddleware,logout};