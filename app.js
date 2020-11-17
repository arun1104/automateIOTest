'use strict';
const express = require('express');
const correlator = require('express-correlation-id');
const app = express();
const bodyParser = require('body-parser');
let swaggerTools = require('swagger-tools');
const cors = require('cors');
const fs = require('fs');
let yaml = require('js-yaml');
const path = require('path');
const morgan = require('morgan');
const constants = require('./utils/constants');
let {authMiddleware} = require('./middlewares/auth');
const routes = require('./routes');
app.use(bodyParser.json());
app.use(correlator());
app.use(morgan(constants.MORGAN_LOG_FORMAT));
app.use(cors());

const ymlPath = path.join(__dirname, '.', constants.SWAGGER_FILE_NAME);
const swaggerDoc = yaml.safeLoad(fs.readFileSync(ymlPath, 'utf8'));
const options = {
  controllers: routes,
  useStubs: (process.env.NODE_ENV === constants.DEV_ENV),
};

swaggerTools.initializeMiddleware(swaggerDoc, function(middleware) {
  // generate swagger metadata
  app.use(middleware.swaggerMetadata());

  // Validate Swagger requests
  app.use(middleware.swaggerValidator());

  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());
  app.use(authMiddleware);
  // Route validated requests to appropriate controller
  app.use(middleware.swaggerRouter(options));
  const port = (process.env.PORT) ? process.env.PORT : constants.PORT;
  app.listen(port, function() {
    console.log(constants.SERVER_RUNNING_LOG, port);
  });
});


