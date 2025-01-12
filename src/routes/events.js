import express from 'express';
import { ObjectId } from 'mongodb';
import { collections } from '../services/db.service.js';
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const events = express.Router();

events.get('/events/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const event = await collections.events.findOne({ _id: new ObjectId(id) });

    if (event) {
      const videos = await collections.videos.find({ eventId: new ObjectId(id) }).toArray();
      res.json({ ...event, videos });
    } else {
      res.status(404).send('Event not found');
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching event', error });
  }
});

events.get('/events-autocomplete', async (req, res) => {
  const { page = 1, limit = 100 } = req.query;

  try {
    const events = await collections.events
      .find({ status: 1 })
      .sort({ videoIds: -1, startTime: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .project({ _id: 1, title: 1 })
      .toArray();

    res.json(events.map(event => ({ id: event._id, label: event.title })));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error });
  }
});

events.get('/events', async (req, res) => {
  const { fromDate, toDate, priority, freeText, statuses, page = 1, limit = 3 } = req.query;

  try {
    let query = {};

    if (fromDate && toDate) {
      query.startTime = { $gte: new Date(fromDate), $lte: new Date(toDate) };
    } else if (fromDate) {
      query.startTime = { $gte: new Date(fromDate) };
    } else if (toDate) {
      query.startTime = { $lte: new Date(toDate) };
    }

    if (priority) {
      const priorityArray = priority.split(',').map(Number);
      query.priority = { $in: priorityArray };
    }

    if (freeText && freeText.trim() !== '') {
      const lowerCaseFreeText = freeText.toLowerCase();
      query.$or = [
        { title: { $regex: lowerCaseFreeText, $options: 'i' } },
        { description: { $regex: lowerCaseFreeText, $options: 'i' } }
      ];
    }

    if (statuses) {
      const statusesArray = statuses.split(',').map(Number);
      query.status = { $in: statusesArray };
    }

    const events = await collections.events
      .find(query)
      .sort({ videoIds: -1, startTime: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .toArray();

    const eventsWithCounts = await Promise.all(events.map(async event => {
      const eventVideos = await collections.videos.find({ eventId: event._id }).toArray();
      const eventVideosUnprocessed = await collections.videos.find({ eventId: event._id, status: 1 }).toArray();
      return {
        ...event,
        videosUnprocessedCount: eventVideosUnprocessed.length,
        videosCount: eventVideos.length
      };
    }));

    const eventsCount = await collections.events.countDocuments(query);

    res.json({ events: eventsWithCounts, eventsCount });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error });
  }
});

events.post('/events', async (req, res) => {
  const { title, priority, startTime, endTime, description, status } = req.body;

  try {
    if (!title || !priority || !startTime || !status) {
      throw new Error('Missing required fields');
    }

    const newEvent = {
      title,
      description: description || '',
      startTime: new Date(startTime),
      endTime: endTime ? new Date(endTime) : null,
      videoIds: [],
      tags: [],
      status,
      priority,
      duration: 0
    };

    const result = await collections.events.insertOne(newEvent);
    res.status(201).json({ message: 'Event added successfully', eventId: result.insertedId });
  } catch (error) {
    res.status(500).json({ message: 'Error adding event', error });
  }
});

events.put('/events/:id', async (req, res) => {
  const { id } = req.params;
  const { title, priority, startTime, endTime, description, status } = req.body;

  try {
    if (!title || !priority || !startTime || !status) {
      throw new Error('Missing required fields');
    }

    const updatedEvent = {
      title,
      description,
      startTime: new Date(startTime),
      endTime: endTime ? new Date(endTime) : null,
      status,
      priority,
    };

    const result = await collections.events.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedEvent }
    );

    if (result.matchedCount === 0) {
      throw new Error('Event not found');
    }

    res.status(200).json({ message: 'Event updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating event', error });
  }
});


//// Analytics endpoints

events.get('/events-count-per-type', async (req, res) => {
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

    const eventsCountPerType = await collections.events.aggregate([
      { $match: query },
      { $group: { _id: "$types", count: { $sum: 1 } } }
    ]).toArray();
    console.log(eventsCountPerType);

    res.json(eventsCountPerType);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events count per type', error });
  }
});

events.get('/dangerous-cities', async (req, res) => {
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

    const dangerousCities = await collections.events.aggregate([
      { $match: query },
      { $group: { _id: "$locationTexts.city", eventsCount: { $sum: 1 } } },
      { $sort: { eventsCount: -1 } },
      { $limit: 8 }
    ]).toArray();

    res.json(dangerousCities.map(city => ({ cityName: city._id, eventsCount: city.eventsCount })));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dangerous cities', error });
  }
});

events.get('/events-frequency-over-time', async (req, res) => {
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

export default events;

export interface IEvent {
  _id: string;
  title: string;
  description: string;
  types: Array<EventType>;
  duration: number;
  location: ILocation;
  locationTexts: ILocationTexts;
  videos: Array<IVideo>;
  status: number;
  priority: number;
  fatalities: number;
  injuries: number;
  severity: number;
  startTime: string;
  endTime: string;
  tags: Array<string>;
  videosUnprocessedCount: number;
  videosCount: number;
}