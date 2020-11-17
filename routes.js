'use strict';
const authHandler = require('./controllers/authentication/authHandler');
const contentHandler = require('./controllers/contentManagement/contentManagementHandler');

module.exports = {
  login: authHandler.loginRequesthandler,
  createContent: contentHandler.createContentHandler,
};
