const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const { auth } = require('express-oauth2-jwt-bearer');
const authConfig = require('./auth_config.json');
const app = express();
const axios = require('axios');
const jwt = require('jsonwebtoken');
const paypal = require('@paypal/checkout-server-sdk');
const bodyParser = require('body-parser');



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

app.use(bodyParser.json());
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

let client = new paypal.core.PayPalHttpClient(new paypal.core.SandboxEnvironment('AajKcSlyoUDpHMxmRKMAo5UBSW-_b32ljcUAkhxY8AMNHhRCfa2HdmYkjxgwCh6-p4xRj1rFimtiPFUb', 'ECZA9R_rPF_WGkOkqOwpAwLQ6EMiiKbIBIj2cls42lh3fdEny0Rif77MuH7Rwi96NJ8uy5fKT5PEklYc'));

app.post('/api/test2', async (req, res) => {
  if (!req.body.orderID) {
    return res.status(400).json({ message: 'Order ID is required' });
  }

  let request = new paypal.orders.OrdersCaptureRequest(req.body.orderID);
  request.requestBody({});

  try {
    let response = await client.execute(request);
    res.json({ message: 'Order successfully captured' });
  } catch (err) {
    console.error('PayPal API error:', err);
    res.status(500).json({ message: 'Error capturing order' });
  }
});


const port = process.env.API_SERVER_PORT || 3001;

app.listen(port, () => console.log(`Api started on port ${port}`));
