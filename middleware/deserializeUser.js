const { signJWT, verifyJWT } = require("../utils/jwt.utils");

module.exports.deserializeUser = (req, res, next) => {
    const token = req.header('auth-token');
    if(!token) return res.status(401).send('Access Denied');

    try {
        const { payload } = verifyJWT(token, process.env.ACCESS_TOKEN_SECRET)
        req.user = payload
        next()
    } catch(err) {
        res.status(400).send('Invalid Token');
    }
};

function deser (req,res,next) {
    const {accessToken, refreshToken } = req.cookies;

    if (!accessToken) {
        return next();
    }

    const {payload: user, expired} = verifyJWT(accessToken);


}