const jwt = require('jsonwebtoken');
module.exports = function (req, res, next) {
   if( req.header("auth-token")) {
    try {
        const decode =   jwt.verify(req.header("auth-token"), 'aloksdKey');
        req.user = decode;
        next();
    } catch (error) {
        res.status(401).json('User token not valid.');
    }
  
   } else {
    res.status(401).json('User token missing');
   }
} 