import 'dotenv/config';
import './src/libs/sentry.js';
import express from 'express';
import { createServer } from 'http';
import * as swaggerUi from 'swagger-ui-express';
import { initSocket } from './src/libs/socket.js' ;
import { setupExpressErrorHandler } from '@sentry/node';
import json from 'body-parser';
const app = express();
const server = createServer(app);
import swaggerDocument from './swagger.json' assert { type: "json" };


// set view engine
app.set('view engine', 'ejs');
app.set('views', './src/views');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// media handler
app.use('/images', express.static('uploads/images'));

// routes
import userRoutes from './src/routes/users.js';
import accountRoutes from './src/routes/accounts.js';
import transactionRoutes from './src/routes/transactions.js';
import mediaRoutes from './src/routes/media.js';

// use routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/accounts', accountRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/media', mediaRoutes);

// swagger routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// inisialisasi WebSocket
initSocket(server);

app.get('/', (req, res) => {
    res.render('index'); // Render index.ejs
});


app.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error(500, "My awesome Sentry error!");
  });
  
setupExpressErrorHandler(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API docs available at http://localhost:${PORT}/api-docs`);
});


export default app;