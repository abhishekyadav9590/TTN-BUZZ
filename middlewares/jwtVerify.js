let jwt=require('jsonwebtoken');
module.exports=(req,res,next)=> {
    const token = req.headers.authorization;
    jwt.verify(token, 'secret', (err, decoded) => {
        if (err) {
            res.sendStatus(403);
        } else {
            req.user = decoded;
            next();
        }
    })
}