require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');
const app = express();
const port = process.env.PORT || 3000;
const errorHandler = require('./src/helpers/error_handler');
const PostRoute = require('./src/routes/post');

const apiBase = process.env.BASE_PATH || '/api';

// Access Swagger Docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//allow cors
app.use(cors());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// parse requests of content-type - application/json
app.use(bodyParser.json());
// allow api code file
app.use(express.static('public'));

// define user route
app.use(`${apiBase}/posts`, PostRoute);

// handle errors
// global error handler
app.use(errorHandler);
// listen for requests
app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});
