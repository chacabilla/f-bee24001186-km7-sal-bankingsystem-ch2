import 'dotenv/config';
import './src/libs/sentry.js';
import express from 'express';
import * as swaggerUi from 'swagger-ui-express';
import { setupExpressErrorHandler } from '@sentry/node';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path, { join } from 'path';
import swaggerDocument from './swagger.json' assert { type: "json" };

const __dirname = process.cwd();

const app = express();
const server = createServer(app);
export const io = new Server(server,
    {
        cors: {
            origin: "http://localhost:3001",
            methods: ["GET", "POST"]
        }
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// set view engine
app.set('view engine', 'ejs');
app.set('views', './src/views');

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

app.get('/notifikasi', (req, res) => {
    res.sendFile(join(__dirname, '/src/views/notifikasi.html'));
});

// Socket.IO event handling
io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

app.get('/', (req, res) => {
    res.render('index'); // Render index.ejs
});


app.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error(500, "My awesome Sentry error!");
  });
  
setupExpressErrorHandler(app);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API docs available at http://localhost:${PORT}/api-docs`);
});


export default app;