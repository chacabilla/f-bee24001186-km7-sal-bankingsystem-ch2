    const express = require('express');
    const { PrismaClient } = require('@prisma/client');
    const bodyParser = require('body-parser');
    const app = express();

    // inisialisasi prisma client
    const prisma = new PrismaClient();

    // set view engine
    app.set('view engine', 'ejs');
    app.set('views', './views');

    // middleware untuk parsing JSON
    app.use(bodyParser.json());

    // routes
    const userRoutes = require('./routes/users');
    const accountRoutes = require('./routes/accounts');
    const transactionRoutes = require('./routes/transactions');

    // use routes
    app.use('/api/v1/users', userRoutes);
    app.use('/api/v1/accounts', accountRoutes);
    app.use('/api/v1/transactions', transactionRoutes);

    app.get('/', (req, res) => {
        res.render('index'); // Render index.ejs
    });

    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

