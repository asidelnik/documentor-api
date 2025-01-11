import express from 'express';
import { collections } from '../services/db.service.js';

const cities = express.Router();

cities.get('/cities', async (req, res) => {
  try {
    const cities = await collections.cities.toArray();
    res.json({ cities });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cities', error });
  }
});

export default cities;