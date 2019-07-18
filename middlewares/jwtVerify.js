let jwt=require('jsonwebtoken');
const keys=require('../config/keys');
module.exports=(req,res,next)=> {
    const token = req.headers.authorization;
    jwt.verify(token, keys.jwt.secret, (err, decoded) => {
        if (err) {
            res.sendStatus(403);
        } else {
            req.body.user = decoded.data;
            req.user = decoded.data;
            next();
        }
    })
}
