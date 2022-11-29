import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoute from './routes/auth.js';
import usersRoute from './routes/users.js';
import hotelsRoute from './routes/hotels.js';
import roomsRoute from './routes/rooms.js';
import transRoute from './routes/transactions.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
dotenv.config();

const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log('Connected MongoDB');
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('mongoDB disconnected!');
});

mongoose.connection.on('disconnected', () => {
  console.log('mongoDB disconnected!');
});

//middlewares
app.use('/auth', authRoute);
app.use('/users', usersRoute);
app.use('/hotels', hotelsRoute);
app.use('/rooms', roomsRoute);
app.use('/transactions', transRoute);

app.use((err, req, res, next) => {
  const errorStatus = err.errorStatus || 500;
  const errorMessage = err.message || 'Something went wrong!';
  res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
  });
});

app.listen(process.env.PORT || 5000, () => {
  connectMongo();
  console.log('Connect to backend');
});
