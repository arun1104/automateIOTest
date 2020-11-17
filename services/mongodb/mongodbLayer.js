'use strict';
const Logger = require('../../utils/logger');
const constants = require('../../utils/constants');
const Mongoose = require('mongoose');
require('./mongooseSchemas');

class DBLayer {
  constructor() {
    this.Mongoose = Mongoose;
    this.getDocs = this.getDocs.bind(this);
    this.updateDoc = this.updateDoc.bind(this);
    this.findOne = this.findOne.bind(this);
    this.createDoc = this.createDoc.bind(this);
    this.updateManyDocs = this.updateManyDocs.bind(this);
  }

  async updateManyDocs(options, attribute){
    const logger = new Logger(options.correlationId, 'updateManyDocs-mongodbLayer', 'updateManyDocs');
    logger.info('Entry', options);
    try {
      let connectionString = `${process.env.mongoUrl}`;
      logger.info('Connection string', connectionString);
      await this.Mongoose.connect(connectionString, {dbName: process.env.dbName, useNewUrlParser: true, useUnifiedTopology: true });
      let model = this.Mongoose.model(options.collection);
      let queryObject = {};
      queryObject[attribute] = { $in: options.query.idList};
      let result = await model.updateMany(queryObject, options.data);
      result = JSON.parse(JSON.stringify(result));
      return result;
    } catch (err) {
      logger.error(err);
      throw (new Error(' DB error'));
    }
  }

  async findOne(options) {
    const logger = new Logger(options.correlationId, 'findOne-mongodbLayer', 'findOne');
    logger.info('Entry', options);
    try {
      let connectionString = `${process.env.mongoUrl}`;
      logger.info('Connection string', connectionString);
      await this.Mongoose.connect(connectionString, {dbName: process.env.dbName, useNewUrlParser: true, useUnifiedTopology: true });
      let model = this.Mongoose.model(options.collection);
      let doc = await model.findOne(options.query, {_id: 0}).lean();
      return doc;
    } catch (err){
      logger.error(err);
      throw (new Error(' DB error'));
    }
  }

  async getDocs(options) {
    const logger = new Logger(options.correlationId, 'getDocs-mongodbLayer', 'findOne');
    logger.info('Entry', options);
    try {
      let connectionString = `${process.env.mongoUrl}`;
      logger.info('Connection string', connectionString);
      await this.Mongoose.connect(connectionString, {dbName: process.env.dbName, useNewUrlParser: true, useUnifiedTopology: true });
      let model = this.Mongoose.model(options.collection);
      let doc = await model.find(options.query, {__v: 0}).lean();
      return doc;
    } catch (err){
      logger.error(err);
      throw (new Error(' DB error'));
    }
  }

  async createDoc(options, correlationId, modelName) {
    const logger = new Logger(correlationId, 'createDoc-mongodbLayer', 'createDoc');
    try {
      let connectionString = `${process.env.mongoUrl}`;
      logger.info('Connection string', connectionString);
      await this.Mongoose.connect(connectionString, { dbName: process.env.dbName, useNewUrlParser: true, useUnifiedTopology: true });
      let Model = this.Mongoose.model(modelName);
      let newDoc = new Model(options.data);
      let result = JSON.parse(JSON.stringify(newDoc));
      await newDoc.save();
      return result;
    } catch (err) {
      logger.error(err);
      let errObj;
      if (err.code === constants.MONGO_DB_DUPLICATE_KEY_ERROR_CODE){
        errObj = {status: constants.HTTP_STATUS_BAD_REQUEST, message: constants.CONTENT_DUPLICATE_ERROR};
        throw errObj;
      } else {
        errObj = {message: constants.UNEXPECTED_ERROR, status: constants.HTTP_STATUS_INTERNAL_SERVER_ERROR};
        throw errObj;
      }
    }
  }

  async updateDoc(options, correlationId, modelName) {
    const logger = new Logger(correlationId, 'updateDoc-mongodbLayer', 'updateDoc');
    try {
      let connectionString = `${process.env.mongoUrl}`;
      logger.info('Connection string', connectionString);
      await this.Mongoose.connect(connectionString, { dbName: process.env.dbName, useNewUrlParser: true, useUnifiedTopology: true });
      let model = this.Mongoose.model(modelName);
      let result = await model.findOneAndUpdate(options.query, options.data, { new: true });
      result = JSON.parse(JSON.stringify(result));
      return result;
    } catch (err) {
      logger.error(err);
      throw (new Error(' DB error'));
    }
  }

  async deleteMany(options, correlationId, modelName) {
    const logger = new Logger(correlationId, 'deleteMany-mongodbLayer', 'deleteMany');
    try {
      let connectionString = `${process.env.mongoUrl}`;
      logger.info('Connection string', connectionString);
      await this.Mongoose.connect(connectionString, { dbName: process.env.dbName, useNewUrlParser: true, useUnifiedTopology: true });
      let model = this.Mongoose.model(modelName);
      await model.deleteMany(options.query);
      return { message: 'docs deleted successfully' };
    } catch (err) {
      logger.error(err);
      throw (new Error(' DB error'));
    }
  }

  async deleteDoc(options, correlationId, modelName) {
    const logger = new Logger(correlationId, 'deleteDoc-mongodbLayer', 'deleteDoc');
    try {
      let connectionString = `${process.env.mongoUrl}`;
      logger.info('Connection string', connectionString);
      await this.Mongoose.connect(connectionString, { dbName: process.env.dbName, useNewUrlParser: true, useUnifiedTopology: true });
      let model = this.Mongoose.model(modelName);
      await model.findOneAndDelete(options.query);
      return { message: 'doc deleted successfully' };
    } catch (err) {
      logger.error(err);
      throw (new Error(' DB error'));
    }
  }
}

module.exports = new DBLayer();
