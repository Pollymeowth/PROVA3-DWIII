import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import reservaRoutes from './routes/reservaRoutes';

dotenv.config();

const app = express();
// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Routes
app.use('/', reservaRoutes);

// DB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/reserva')
  .then(() => {
    console.log('MongoDB conectado');
    app.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'));
  })
  .catch(err => console.error(err));