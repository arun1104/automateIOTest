'use strict';
const mongoose = require('mongoose');
const constants = require('../../utils/constants');
const Logger = require('../../utils/logger');
const dbLayer = require('../../services/mongodb/mongodbLayer');
const { createContentSchema, moveContentSchema } = require('./hapiSchema');

class ContentManagement{
  constructor() {
    this.dbLayer = dbLayer;
    this.createContentHandler = this.createContentHandler.bind(this);
    this.formatResponse = this.formatResponse.bind(this);
    this.formatResponseForContents = this.formatResponseForContents.bind(this);
    this.getContentsHandler = this.getContentsHandler.bind(this);
    this.moveContentsHandler = this.moveContentsHandler.bind(this);
  }

  formatResponseForContents(result){
    result.forEach(element => {
      element.contentId = element._id.toString();
      delete element['_id'];
    });
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

  async getContentsHandler(req, res){
    const correlationId = req.correlationId();
    const logger = new Logger(correlationId, 'getContentsHandler-ContentManagement', 'getContentsHandler');
    logger.info('Entry');
    try {
      let options = {correlationId, collection: constants.CONTENT_COLLECTION, query: {owner: req.userId, context: req.query.context}};
      let response = await this.dbLayer.getDocs(options);
      this.formatResponseForContents(response);
      res.status(constants.HTTP_STATUS_OK).send({contents: response, length: response.length});
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

  async moveContentsHandler(req, res){
    const correlationId = req.correlationId();
    const logger = new Logger(correlationId, 'moveContentsHandler-ContentManagement', 'moveContentsHandler');
    logger.info('Entry');
    try {
      // add validation for nested folder logic
      const reqBody = await moveContentSchema.validateAsync(req.body);
      let options = {correlationId,
        collection: constants.CONTENT_COLLECTION,
        query: {_id: mongoose.Types.ObjectId(req.body.contentId)},
        data: {context: reqBody.context},
      };
      let response = await this.dbLayer.updateDoc(options, correlationId, constants.CONTENT_COLLECTION);
      res.status(constants.HTTP_STATUS_OK).send(response);
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
