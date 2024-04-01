const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const { auth } = require('express-oauth2-jwt-bearer');
const authConfig = require('./auth_config.json');
const app = express();
const axios = require('axios');
const jwt = require('jsonwebtoken');

if (
  !authConfig.domain ||
  !authConfig.authorizationParams.audience ||
  ["YOUR_API_IDENTIFIER", "{yourApiIdentifier}"].includes(authConfig.authorizationParams.audience)
) {
  console.log(
    "Exiting: Please make sure that auth_config.json is in place and populated with valid domain and audience values"
  );

  process.exit();
}

app.use(morgan('dev'));
app.use(helmet());
app.use(
  cors({
    origin: authConfig.appUri,
  })
);

const checkJwt = auth({
  audience: authConfig.authorizationParams.audience,
  issuerBaseURL: `https://${authConfig.domain}`,
});

app.get('/api/external', checkJwt, (req, res) => {
  res.send({
    msg: 'Your access token was successfully validated!',
  });
});

app.get('/api/test1', checkJwt, (req, res) => {
  const token = req.headers.authorization.split(' ')[1]; // assuming the token is in the Authorization header as a Bearer token
  const decoded = jwt.decode(token);

  res.send({
    msg: 'Here is your decoded token:',
    token: decoded
  });
});

app.get('/api/test2', checkJwt, (req, res) => {
  res.send({
    msg: 'Your access token was successfully validated!',
  });
});


const port = process.env.API_SERVER_PORT || 3001;

app.listen(port, () => console.log(`Api started on port ${port}`));
