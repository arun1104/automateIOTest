
'use strict';
const commonUtils = require('../utils/common');
module.exports.authMiddleware = function(req, res, next) {
  try {
    if (req.path.toLowerCase().includes('/files')){
      if (req.method === 'POST'){
        let decodedToken = commonUtils.verifyToken(req.headers.authorization);
        console.log(decodedToken);
        next();
      } else {
        next();
      }
    } else if (req.swagger.security.length > 0){
      let decoded = commonUtils.verifyToken(req.headers.authorization);
      const checkRole = (element) => req.swagger.security[0].gramoday_auth.indexOf(element) !== -1;
      const ifAuthorized = decoded.roles.some(checkRole);
      if (ifAuthorized){
        req.userId = decoded.userId;
        next();
      } else {
        res.status(401).send({message: 'Unauthorized'});
      }
    } else {
      next();
    }
  } catch (err) {
    res.status(401).send({message: 'Invalid token'});
  }
};
