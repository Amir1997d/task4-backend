const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;
const users = require('./api/users');
const auth = require('./api/auth');

app.use(cors());
app.use(bodyParser.json());
app.use('/api/users', users);
app.use('/', auth);

app.listen(port, () => {
  console.log(`Express server is running on port ${port}`);
});
