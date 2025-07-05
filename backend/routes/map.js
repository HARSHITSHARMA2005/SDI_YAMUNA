import express from 'express';
import path from 'path';

const router = express.Router();

router.get('/', (req, res) => {
  const filePath = path.resolve('map.html');
  res.sendFile(filePath);
});

export default router;
