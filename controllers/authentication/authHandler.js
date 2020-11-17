'use strict';
const constants = require('../../utils/constants');
const Logger = require('../../utils/logger');
const commonUtils = require('../../utils/common');
const { loginSchema } = require('./hapiSchema');

class Authentication {
  constructor() {
    this.loginRequesthandler = this.loginRequesthandler.bind(this);
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
      let userId = constants.TEST_USER_ID_HASH;
      let pass = constants.TEST_USER_PASS_HASH;
      if (userNameHash === userId && pass === passHash){
        let token = commonUtils.createJwtToken([constants.DEFAULT_USER_ROLE]);
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
