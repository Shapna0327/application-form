import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import signupRouter from './router/signuproute';
import loginRouter from './router/loginroute';
import applicationRouter from './router/applicationroute';



const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use('/application', applicationRouter);


mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log('MongoDB Atlas connected to BBI DB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err);
  });