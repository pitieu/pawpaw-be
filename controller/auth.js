import bcrypt from 'bcryptjs'

export const isLoggedIn = (req, res, next) => {
    const token = req.header('auth-token');
    if(!token) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.user = verified
        next()
    } catch(err) {
        res.status(400).send('Invalid Token');
    }
};

export const generateHashedPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

export const validatePassword = async (password, userPassword) => {
    return await bcrypt.compare(password, userPassword);
}