    const express = require('express');
    const { PrismaClient } = require('@prisma/client');
    const bodyParser = require('body-parser');
    const app = express();

    // inisialisasi prisma client
    const prisma = new PrismaClient();

    // set view engine
    app.set('view engine', 'ejs');
    app.set('views', './src/views');

    // middleware untuk parsing JSON
    app.use(bodyParser.json());

    // routes
    const userRoutes = require('./src/routes/users');
    const accountRoutes = require('./src/routes/accounts');
    const transactionRoutes = require('./src/routes/transactions');

    // use routes
    app.use('/api/v1/users', userRoutes);
    app.use('/api/v1/accounts', accountRoutes);
    app.use('/api/v1/transactions', transactionRoutes);

    app.get('/', (req, res) => {
        res.render('index'); // Render index.ejs
    });

    if (require.main === module) {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }

    module.exports = app;