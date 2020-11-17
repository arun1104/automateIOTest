'use strict';
const constants = require('../../utils/constants');
const dbLayer = require('../../services/mongodb/mongodbLayer');
const Logger = require('../../utils/logger');
const commonUtils = require('../../utils/common');
const { loginSchema } = require('./hapiSchema');

class Authentication {
  constructor() {
    this.loginRequesthandler = this.loginRequesthandler.bind(this);
    this.db = dbLayer;
  }

  async loginRequesthandler(req, res) {
    const correlationId = req.correlationId();
    const logger = new Logger(correlationId, 'loginRequesthandler-Authentication', 'login');
    logger.info('Entry');
    try {
      const reqBody = await loginSchema.validateAsync(req.body);
      const userNameHash = commonUtils.createHash(reqBody.userId);
      const passHash = commonUtils.createHash(reqBody.password);
      // instead of DB, for test, taking it from constants.
      // Not recommended for production
      let options = {query: {userId: userNameHash}, correlationId, collection: constants.USERS_COLLECTION};
      let user = await this.db.findOne(options);
      if (user.pass === passHash){
        let token = commonUtils.createJwtToken([constants.DEFAULT_USER_ROLE], reqBody.userId, user.userName);
        res.status(constants.HTTP_STATUS_OK).send({token});
      } else {
        res.status(constants.HTTP_STATUS_UNAUTHORIZED).send({message: constants.UNAUTHORIZED});
      }
    } catch (err) {
      if (err.status && err.message) {
        res.status(err.status).send({ message: err.message });
      } else if (err.message) {
        res.status(400).send({ message: err.message }); // JOI validation error
      } else {
        res.status(500).send({ message: constants.UNEXPECTED_ERROR });
      }
    }
  }
}

module.exports = new Authentication();
