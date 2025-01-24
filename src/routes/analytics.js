import express from 'express';
import { collections } from '../services/db.service.js';
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const analytics = express.Router();

analytics.get('/events-count-per-type', async (req, res) => {
  const { fromDate, toDate, lat, long, radius } = req.query;

  try {
    let query = {};

    if (fromDate && toDate) {
      query.startTime = { $gte: new Date(fromDate), $lte: new Date(toDate) };
    } else if (fromDate) {
      query.startTime = { $gte: new Date(fromDate) };
    } else if (toDate) {
      query.startTime = { $lte: new Date(toDate) };
    }

    if (lat && long && radius) {
      const radiusInMeters = Number(radius) * 1000;
      query.location = {
        $geoWithin: {
          $centerSphere: [[Number(long), Number(lat)], radiusInMeters / 6378100]
        }
      };
    }

    const eventsCountPerType = await collections.events
      .aggregate([
        { $match: query },
        { $group: { _id: "$types", count: { $sum: 1 } } }
      ])
      .project({ type: 1, count: 1 })
      .toArray();

    res.json(eventsCountPerType);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events count per type', error });
  }
});

analytics.get('/dangerous-cities', async (req, res) => {
  const { type, fromDate, toDate } = req.query;

  try {
    let query = {};

    if (type) {
      query.types = type;
    }

    if (fromDate && toDate) {
      query.startTime = { $gte: new Date(fromDate), $lte: new Date(toDate) };
    } else if (fromDate) {
      query.startTime = { $gte: new Date(fromDate) };
    } else if (toDate) {
      query.startTime = { $lte: new Date(toDate) };
    }

    const dangerousCities = await collections.events
      .aggregate([
        { $match: query },
        { $group: { _id: "$locationTexts.city", eventsCount: { $sum: 1 } } },
        { $sort: { eventsCount: -1 } },
        { $limit: 8 },
        { $project: { cityName: "$_id", eventsCount: 1 } }
      ])
      .toArray();

    res.json(dangerousCities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dangerous cities', error });
  }
});

analytics.get('/events-frequency-over-time', async (req, res) => {
  const { type, year, lat, long, radius } = req.query;

  try {
    let query = {};

    if (type) {
      query.types = type;
    }

    if (year) {
      const start = new Date(`${year}-01-01`);
      const end = new Date(`${year}-12-31`);
      query.startTime = { $gte: start, $lte: end };
    }

    if (lat && long && radius) {
      const radiusInMeters = Number(radius) * 1000;
      query.location = {
        $geoWithin: {
          $centerSphere: [[Number(long), Number(lat)], radiusInMeters / 6378100]
        }
      };
    }

    const eventFrequency = await collections.events.aggregate([
      { $match: query },
      {
        $group: {
          _id: { month: { $month: "$startTime" } },
          eventsCount: { $sum: 1 }
        }
      },
      { $sort: { "_id.month": 1 } }
    ]).toArray();

    const formattedFrequency = eventFrequency.map(item => ({
      monthName: monthNames[item._id.getMonth()],
      eventsCount: item.eventsCount
      // new Date(0, item._id.month - 1).toLocaleString('default', { month: 'long' }),
    }));

    res.json(formattedFrequency);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching event frequency over time', error });
  }
});

analytics.get('/recent-events', async (req, res) => {
  const { type, fromDate, toDate, lat, long, radius } = req.query;

  try {
    let query = {};

    if (type) {
      query.types = type;
    }

    if (fromDate && toDate) {
      query.startTime = { $gte: new Date(fromDate), $lte: new Date(toDate) };
    } else if (fromDate) {
      query.startTime = { $gte: new Date(fromDate) };
    } else if (toDate) {
      query.startTime = { $lte: new Date(toDate) };
    }

    if (lat && long && radius) {
      const radiusInMeters = Number(radius) * 1000;
      query.location = {
        $geoWithin: {
          $centerSphere: [[Number(long), Number(lat)], radiusInMeters / 6378100]
        }
      };
    }

    const recentEvents = await collections.events.find(query)
      .sort({ startTime: -1 })
      .limit(5)
      .project({ title: 1, startTime: 1, 'locationTexts.country': 1, 'locationTexts.address': 1, 'locationTexts.city': 1, types: 1 })
      .toArray();

    console.log(recentEvents, typeof recentEvents.startTime);
    res.json(recentEvents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recent events', error });
  }
});

export default analytics;