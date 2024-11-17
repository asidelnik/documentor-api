import express from 'express';
import { ObjectId } from 'mongodb';
import { collections } from '../services/db.service';

// Create an instance of the express router.
const videos = express.Router();

videos.put('/video-set-status/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.query;

  try {
    const video = await collections.videos.findOne({ _id: new ObjectId(id) });

    if (video) {
      await collections.videos.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: Number(status) } }
      );
      res.json({ message: 'Video status updated successfully' });
    } else {
      res.status(404).send('Video not found');
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating video status', error });
  }
});

videos.put('/video-set-event/:id', async (req, res) => {
  const { id } = req.params;
  let { newEventId, oldEventId } = req.query;

  newEventId = newEventId === 'null' ? null : new ObjectId(newEventId);
  oldEventId = oldEventId === 'null' ? null : new ObjectId(oldEventId);

  try {
    const video = await collections.videos.findOne({ _id: new ObjectId(id) });

    if (!video) {
      return res.status(404).send('Video not found');
    }

    if (newEventId === null) {
      await collections.videos.updateOne(
        { _id: new ObjectId(id) },
        { $set: { eventId: null } }
      );
      if (oldEventId !== null) {
        await collections.events.updateOne(
          { _id: oldEventId },
          { $pull: { videoIds: new ObjectId(id) } }
        );
      }
    } else {
      const newEvent = await collections.events.findOne({ _id: newEventId });

      if (newEvent) {
        await collections.videos.updateOne(
          { _id: new ObjectId(id) },
          { $set: { eventId: newEventId } }
        );

        if (!newEvent.videoIds.includes(id)) {
          await collections.events.updateOne(
            { _id: newEventId },
            { $push: { videoIds: new ObjectId(id) } }
          );

          if (oldEventId !== null) {
            await collections.events.updateOne(
              { _id: oldEventId },
              { $pull: { videoIds: new ObjectId(id) } }
            );
          }
        }
      } else {
        return res.status(404).send('Event not found');
      }
    }
    res.json({ message: 'Success' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating video event' });
  }
});

videos.get('/videos', async (req, res) => {
  const { fromDate, toDate, statuses, page = 1, limit = 10 } = req.query;
  let { eventId } = req.query;

  try {
    let query = {};

    if (fromDate && toDate) {
      query.startTime = { $gte: new Date(fromDate), $lte: new Date(toDate) };
    } else if (fromDate) {
      query.startTime = { $gte: new Date(fromDate) };
    } else if (toDate) {
      query.startTime = { $lte: new Date(toDate) };
    }

    if (statuses) {
      const statusesArray = statuses.split(',').map(Number);
      query.status = { $in: statusesArray };
    }

    eventId = eventId === 'null' ? null : new ObjectId(eventId);
    if (eventId) {
      query.eventId = eventId;
    }

    const videos = await collections.videos
      .find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .toArray();

    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching videos', error });
  }
});

videos.get('/videos-count', async (req, res) => {
  const { fromDate, toDate, statuses } = req.query;
  let { eventId } = req.query;

  try {
    let query = {};

    if (fromDate && toDate) {
      query.startTime = { $gte: new Date(fromDate), $lte: new Date(toDate) };
    } else if (fromDate) {
      query.startTime = { $gte: new Date(fromDate) };
    } else if (toDate) {
      query.startTime = { $lte: new Date(toDate) };
    }

    if (statuses) {
      const statusesArray = statuses.split(',').map(Number);
      query.status = { $in: statusesArray };
    }

    eventId = eventId === 'null' ? null : new ObjectId(eventId);
    if (eventId) {
      query.eventId = eventId;
    }

    const count = await collections.videos.countDocuments(query);

    res.json(count);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching videos count' });
  }
});

videos.get('*', (_req, res) => {
  res.status(404).json({ message: 'Videos resource not found' });
});

export default videos;
