import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jobRouter from './routes/jobRoutes.js';

const app = express();
dotenv.config({ path: './config.env' });


app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization','Content-Disposition'],
}));
app.use('/lambda',jobRouter);

const PORT = 5000;
app.get('/', (req, res) => {
    res.send(`HyperExecute Lambda`);
});

app.listen(PORT, () => {
    console.log(`server up and running  at ${PORT}`);
});

