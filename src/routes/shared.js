import express from 'express';
import { ObjectId } from 'mongodb';
import { collections } from '../services/db.service.js';

// Create an instance of the express router.
const shared = express.Router();

shared.get('/header-badges', async (req, res) => {
  try {
    const videos = await collections.videos.countDocuments({ status: 1 });
    const events = await collections.events.countDocuments({ priority: 3, status: 1 });

    res.json({ videos, events });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching header badges', error });
  }
});

shared.get('/event-types', async (req, res) => {
  try {
    const eventTypes = await collections.eventTypes
      .aggregate([
        { $project: { id: "$_id", label: 1, _id: 0 } }
      ])
      .toArray();
    res.json(eventTypes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching event types', error });
  }
});

shared.get('*', (_req, res) => {
  res.status(404).json({ message: 'Resource not found' });
});

export default shared;
