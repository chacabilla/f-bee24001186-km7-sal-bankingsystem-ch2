require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const PORT = 3000;

// set view engine
app.set('view engine', 'ejs');
app.set('views', './src/views');

// middleware untuk parsing JSON
app.use(bodyParser.json());

// media handler
app.use('/images', express.static('uploads/images'));
app.use('/files', express.static('uploads/files'));

const mediaRoutes = require('./src/routes/media');
app.use('/api/v1/media', mediaRoutes);

// routes
const userRoutes = require('./src/routes/users');
const accountRoutes = require('./src/routes/accounts');
const transactionRoutes = require('./src/routes/transactions');

// use routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/accounts', accountRoutes);
app.use('/api/v1/transactions', transactionRoutes);

// swagger routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
    res.render('index'); // Render index.ejs
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`API docs available at http://localhost:${PORT}/api-docs`);
    });
}

module.exports = app;