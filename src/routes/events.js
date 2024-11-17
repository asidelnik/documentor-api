import express from 'express';
import { ObjectId } from 'mongodb';
import { collections } from '../services/db.service';


const events = express.Router();
/////////////////////////////////////////////////////////////////////////////////
// Events
/////////////////////////////////////////////////////////////////////////////////
events.get('/events/:id', (req, res) => {
  const db = router.db; // lowdb instance
  const { id } = req.params;

  let event = db.get('events').find({ id }).value();

  if (event) {
    const videos = db.get('videos').filter({ eventId: id }).value();
    event = { ...event, videos };
    res.json(event);
  } else {
    res.status(404).send('Event not found');
  }
});


events.get('/events-autocomplete', (req, res) => {
  const { page = 1, limit = 100 } = req.query;
  const db = router.db; // lowdb instance
  let events = db.get('events').filter({ status: 1 })
    .sort((a, b) => b.videoIds.length - a.videoIds.length)
    .sort((a, b) => b.startTime - a.startTime)
    .value()
    .map(event => ({ id: event.id, label: event.title }));

  // Pagination
  const pageParsed = tryParseIntOrUndefined(page);
  const limitParsed = tryParseIntOrUndefined(limit);

  // TODO - fix this error handling. Responds with cors error instead  of json error
  if (pageParsed === undefined || limitParsed === undefined) {
    res.status(400).jsonp({
      error: "Invalid pagination values"
    })
    return;
  }

  const start = (pageParsed - 1) * limitParsed;
  const end = start + limitParsed;
  events = events.slice(start, end);

  res.json(events);
});


// GET Events by filters, sort & pagination (default sort latest)
events.get('/events', (req, res) => {
  try {
    const { fromDate, toDate, priority, freeText, statuses, page = 1, limit = 3 } = req.query;/*lat, lng, radius,*/
    const db = router.db; // lowdb instance
    let events = db.get('events').value();

    if (fromDate && toDate) {
      const from = new Date(fromDate);
      const to = new Date(toDate);
      events = events.filter(event => {
        const eventStartTime = new Date(event.startTime);
        return eventStartTime >= from && eventStartTime <= to;
      });
    } else if (fromDate) {
      const from = new Date(fromDate);
      events = events.filter(event => {
        const eventStartTime = new Date(event.startTime);
        return eventStartTime >= from;
      });
    } else if (toDate) {
      const to = new Date(toDate);
      events = events.filter(event => {
        const eventStartTime = new Date(event.startTime);
        return eventStartTime <= to;
      });
    }

    if (!priority || priority === '') {
      events = [];
    } else {
      const priorityArray = priority.split(',').map(Number);
      events = events.filter(event => priorityArray.includes(event.priority));
    }

    if (freeText && freeText.trim() !== '') {
      const lowerCaseFreeText = freeText.toLowerCase();
      events = events.filter(event =>
        event.title.toLowerCase().includes(lowerCaseFreeText) ||
        event.description.toLowerCase().includes(lowerCaseFreeText)
      );
    }

    if (!statuses || statuses === '') {
      events = [];
    } else {
      const statusesArray = statuses.split(',').map(Number);
      events = events.filter(event => statusesArray.includes(event.status));
    }

    // Add property count of event videos with status 1
    events = events
      .sort((a, b) => b.videoIds.length - a.videoIds.length)
      .sort((a, b) => b.startTime - a.startTime)
      .map(event => {
        const eventVideos = db.get('videos').filter({ eventId: event.id }).value();
        const eventVideosUnprocessed = db.get('videos').filter({ eventId: event.id, status: 1 }).value();
        return {
          id: event.id,
          title: event.title,
          description: event.description,
          startTime: event.startTime,
          endTime: event.endTime,
          duration: event.duration,
          locationName: event.locationName,
          tags: event.tags,
          videoIds: event.videoIds,
          status: event.status,
          priority: event.priority,
          videosUnprocessedCount: eventVideosUnprocessed.length,
          videosCount: eventVideos.length
        };
      });

    const eventsCount = events.length;
    // Pagination
    const pageParsed = tryParseIntOrUndefined(page);
    const limitParsed = tryParseIntOrUndefined(limit);

    // TODO - fix this error handling. Responds with cors error instead  of json error
    if (pageParsed === undefined || limitParsed === undefined) {
      res.status(400).jsonp({
        error: "Invalid pagination values"
      })
      return;
    }

    const start = (pageParsed - 1) * limitParsed;
    const end = start + limitParsed;
    events = events.slice(start, end);

    res.json({ events, eventsCount });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

events.post('/events', (req, res) => {
  try {
    const db = router.db;
    const { title, priority, startTime, endTime, description, status } = req.body;

    // Validate required fields
    if (!title || !priority || !startTime || !status) {
      throw new Error('Missing required fields');
    }
    // Calculate the duration

    const newEvent = {
      id: (db.get('events').value().length + 1).toString(),
      title,
      description: description || '',
      startTime,
      endTime: endTime || null,
      // duration,
      // locationName: "Night Watch street, Westeros",
      // startLocation: {
      //   "type": "Point",
      //   "coordinates": [32.0853, 34.7818],
      //   "heading": 177
      // },
      videoIds: [],
      tags: [],
      status,
      priority,
    };

    db.get('events').push(newEvent).write();
    res.status(201).json({ message: 'Event added successfully' });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

events.put('/events/:id', (req, res) => {
  try {
    const db = router.db;
    const { id } = req.params;
    const { title, priority, startTime, endTime, description, status } = req.body;
    // Validate required fields
    if (!title || !priority || !startTime || !status) {
      throw new Error('Missing required fields');
    }

    const event = db.get('events').find({ id }).value();

    if (event !== undefined) {
      const updatedEvent = { ...event, title, description, startTime, endTime, status, priority };

      db.get('events').find({ id }).assign(updatedEvent).write();
      res.status(200).json({ message: 'Event updated successfully' });
    } else {
      throw new Error('Event not found');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

events.get('/header-badges', (req, res) => {
  const db = router.db;
  // Count of videos with status unprocessed
  const videos = db.get('videos').filter({ status: 1 }).size().value();
  // Count of active events with high priority
  const events = db.get('events').filter({ priority: 3, status: 1 }).size().value();

  res.json({ videos, events });
});

export default events;