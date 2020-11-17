'use strict';
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
let fs = require('fs');
const path = require('path');
const constants = require('./../utils/constants');
const filePath = path.join(__dirname, constants.PRIVATE_KEY_FILE);

class CommonUtility{
  constructor(){
    this.createJwtToken = this.createJwtToken.bind(this);
    this.createHash = this.createHash.bind(this);
    this.verifyToken = this.verifyToken.bind(this);
  }

  verifyToken(token){
    let cert = fs.readFileSync(filePath);
    let decoded = jwt.verify(token, cert, { algorithms: [constants.JWT_SIGNING_ALGORITHM] });
    return decoded;
  }

  createJwtToken(grps, userId) {
    const privateKey = fs.readFileSync(filePath);
    let jwtToken = jwt.sign({
      iat: Math.floor(Date.now() / 1000) - 30,
      exp: Math.floor(Date.now() / 1000) + constants.TOKEN_VALIDITY,
      roles: grps,
      userId,
    }, privateKey, { algorithm: constants.JWT_SIGNING_ALGORITHM });
    return jwtToken;
  }

  createHash(value){
    const hash = crypto.createHash(constants.HASHING_ALGORITHM).update(value).digest(constants.HASHING_OUTPUT_FORMAT);
    return hash;
  }
}

module.exports = new CommonUtility();
