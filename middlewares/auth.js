
'use strict';
const commonUtils = require('../utils/common');
const constants = require('../utils/constants');
module.exports.authMiddleware = function(req, res, next) {
  try {
    if (req.swagger.security.length > 0){
      let decoded = commonUtils.verifyToken(req.headers.authorization);
      const checkRole = (element) => req.swagger.security[0][constants.SWAGGER_SECURITY_ATTRIBUTE].indexOf(element) !== -1;
      const ifAuthorized = decoded.roles.some(checkRole);
      if (ifAuthorized){
        req.userId = decoded.userId;
        req.name = decoded.name;
        next();
      } else {
        res.status(constants.HTTP_STATUS_UNAUTHORIZED).send({message: constants.UNAUTHORIZED});
      }
    } else {
      next();
    }
  } catch (err) {
    res.status(constants.HTTP_STATUS_UNAUTHORIZED).send({message: constants.UNAUTHORIZED});
  }
};
