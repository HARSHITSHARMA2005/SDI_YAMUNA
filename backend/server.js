import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from './config/db.js';

import authRoutes from './routes/auth.js';
import complaintRoutes from './routes/complaint.js';
import pollutionRoutes from './routes/pollution.js';
import mapRoute from './routes/map.js'; // ✅ NEW

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/pollution', pollutionRoutes);
app.use('/api/map', mapRoute); // ✅ Serve the Folium map

// Serve map.html statically (just in case)
app.use(express.static(path.resolve('.')));

// Test route
app.get('/', (req, res) => {
  res.send('Yamuna Backend API Running 🚀');
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
