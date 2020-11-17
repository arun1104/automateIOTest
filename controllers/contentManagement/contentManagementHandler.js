'use strict';
const constants = require('../../utils/constants');
const Logger = require('../../utils/logger');
const dbLayer = require('../../services/mongodb/mongodbLayer');
const { createContentSchema } = require('./hapiSchema');

class ContentManagement{
  constructor() {
    this.dbLayer = dbLayer;
    this.createContentHandler = this.createContentHandler.bind(this);
    this.formatResponse = this.formatResponse.bind(this);
  }
  formatResponse(result){
    result.contentId = result['_id'];
    delete result['_id'];
  }

  async createContentHandler(req, res){
    const correlationId = req.correlationId();
    const logger = new Logger(correlationId, 'createContentHandler-ContentManagement', 'createContent');
    logger.info('Entry');
    try {
      const reqBody = await createContentSchema.validateAsync(req.body);
      reqBody.createdBy = req.name;
      reqBody.owner = req.userId;
      let response = await this.dbLayer.createDoc({data: reqBody}, correlationId, constants.CONTENT_COLLECTION);
      this.formatResponse(response);
      res.status(constants.HTTP_STATUS_CREATED).send(response);
    } catch (err) {
      if (err.status && err.message) {
        res.status(err.status).send({ message: err.message });
      } else if (err.message) {
        res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ message: err.message }); // JOI validation error
      } else {
        res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: constants.UNEXPECTED_ERROR });
      }
    }
  }
}
module.exports = new ContentManagement();
