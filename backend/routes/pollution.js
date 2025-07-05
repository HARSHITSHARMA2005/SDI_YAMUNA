import express from 'express';
import fs from 'fs';
import csv from 'csv-parser';

const router = express.Router();

router.get('/', async (req, res) => {
  const results = [];

  try {
    fs.createReadStream('Yamuna_final_data.csv')
      .pipe(csv())
      .on('data', (data) => {
        results.push({
          location: data.Location,
          latitude: parseFloat(data.Latitude),
          longitude: parseFloat(data.Longitude),
          ph: parseFloat(data.pH),
          turbidity: parseFloat(data["Turbidity_(NTU)"]),
          ammonia: parseFloat(data["Ammonia_(mg/L)"]),

          phosphate: parseFloat(data["Phosphate_(mg/L)"]),
          bod: parseFloat(data["BOD_(mg/l)"]),
          cod: parseFloat(data["COD_(mg/l)"]),
          do: parseFloat(data["DO_(mg/l)"]),
          chloride: parseFloat(data["Chloride_(mg/L)"]),
          sulphur: parseFloat(data["Sulphur_(mg/L)"]),
          color: data.Quality_Label.trim(),  // ✅ Using CSV label directly
        });
      })
      .on('end', () => {
        res.json(results);
      });
  } catch (err) {
    res.status(500).json({ message: 'Failed to read pollution data' });
  }
});

export default router;
