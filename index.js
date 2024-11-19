require('dotenv').config();
require('./src/libs/sentry.js');
const express = require('express');
const Sentry = require('@sentry/node');
const bodyParser = require('body-parser');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

// set view engine
app.set('view engine', 'ejs');
app.set('views', './src/views');

// middleware untuk parsing JSON
app.use(bodyParser.json());

// media handler
app.use('/images', express.static('uploads/images'));

// routes
const emailRoutes = require('./src/routes/email');
const userRoutes = require('./src/routes/users');
const accountRoutes = require('./src/routes/accounts');
const transactionRoutes = require('./src/routes/transactions');
const mediaRoutes = require('./src/routes/media');

// use routes
app.use('/api/v1/email', emailRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/accounts', accountRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/media', mediaRoutes);

// swagger routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
    res.render('index'); // Render index.ejs
});


app.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error(500, "My awesome Sentry error!");
  });
  
Sentry.setupExpressErrorHandler(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API docs available at http://localhost:${PORT}/api-docs`);
});


module.exports = app;