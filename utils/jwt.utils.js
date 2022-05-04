import jwt from 'jsonwebtoken'

export const signJWT = (payload, secret, expiresIn) => {
    return jwt.sign(payload, secret, {expiresIn})
}

export const verifyJWT = (token, secret, expiresIn = {}) => {
    try {
        const decoded = jwt.verify(token, secret, expiresIn);
        return { payload: decoded, expired: false };
    } catch (error) {
        return { payload: null, expired: error.message.includes("jwt expired") };
    }
}