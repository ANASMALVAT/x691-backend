const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./src/routes/api');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors({ origin:"http://localhost:3000",credentials : true }));

app.use(cors());

// Routes
app.use(routes);

// Start the server on port 5000
const port = 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
