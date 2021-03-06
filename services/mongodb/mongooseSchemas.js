'use strict';
const mongoose = require('mongoose');
const constants = require('../../utils/constants');
const Schema = mongoose.Schema;

const contentSchema = new Schema({}, { strict: false, timestamps: true });
contentSchema.index({ name: 1, context: 1, owner: 1 }, { unique: true });
mongoose.model(constants.CONTENT_COLLECTION, contentSchema, constants.CONTENT_COLLECTION);

const fileContentSchema = new Schema({}, { strict: false, timestamps: true });
contentSchema.index({ name: 1}, { unique: true });
mongoose.model(constants.FILES_COLLECTION, fileContentSchema, constants.FILES_COLLECTION);

const usersSchema = new Schema({}, { strict: false, timestamps: true });
usersSchema.index({ userId: 1}, { unique: true });
mongoose.model(constants.USERS_COLLECTION, usersSchema, constants.USERS_COLLECTION);
