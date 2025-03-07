import express from 'express';
import dotenv from 'dotenv';
import supabase from './src/connection/db.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import userRoutes from './src/routes/user.route.js'; // ✅ Ensure this is correct
import hospitalRoutes from './src/routes/hospital.route.js'
import deshboardRoutes from './src/routes/deshboard.route.js'
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:5173', // ✅ Make sure this matches your frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use('/api/users', userRoutes);
app.use('/api/hospital', hospitalRoutes);
app.use('/api/deshboard', deshboardRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
