import express from 'express';
import { ObjectId } from 'mongodb';
import { collections } from '../services/db.service';

// Create an instance of the express router.
const videos = express.Router();

videos.put('/video-set-status/:id', (req, res) => {
  const db = router.db; // lowdb instance
  const { id } = req.params;
  const { status } = req.query;

  const videoExists = db.get('videos').find({ id }).value() !== undefined;

  if (videoExists) {
    db.get('videos').find({ id }).assign({ status: Number(status) }).write();
    res.json({ message: 'Video status updated successfully' });
    // res.status(404).send('Video not found');
  } else {
    res.status(404).send('Video not found');
  }
});


videos.put('/video-set-event/:id', (req, res) => {
  try {
    const db = router.db; // lowdb instance
    const { id } = req.params;
    let { newEventId, oldEventId } = req.query;

    newEventId = newEventId === 'null' ? null : newEventId;
    oldEventId = oldEventId === 'null' ? null : oldEventId;

    const videoExists = db.get('videos').find({ id }).value() !== undefined;
    if (!videoExists) {
      throw new Error('Video not found');
    }

    if (newEventId === null) {
      db.get('videos').find({ id }).assign({ eventId: null }).write();
      if (oldEventId !== null) {
        db.get('events')
          .find({ id: oldEventId })
          .update('videoIds', videoIds => videoIds.filter(videoId => videoId !== id))
          .write();
      }
    } else {
      const newEvent = db.get('events').find({ id: newEventId }).value();
      const newEventExists = newEvent !== undefined;

      if (videoExists && newEventExists) {
        // Set Video's eventId
        db.get('videos').find({ id }).assign({ eventId: newEventId }).write();

        if (!newEvent.videoIds.includes(id)) {
          // If the Video doesn't exist in the Event, add it
          db.get('events')
            .find({ id: newEventId })
            .update('videoIds', videoIds => [...videoIds, id])
            .write();

          // If the Video existed in another event, remove it
          if (oldEventId !== null) {
            db.get('events')
              .find({ id: oldEventId })
              .update('videoIds', videoIds => videoIds.filter(videoId => videoId !== id))
              .write();
          }
        }
      } else {
        throw new Error('Video or event not found')
      }
    }
    res.json({ message: 'Success' });
  } catch (error) {
    res.status(500).send(error.message);
  }
});


videos.get('/videos', (req, res) => {
  const { fromDate, toDate, statuses, page = 1, limit = 10 } = req.query;
  let { eventId } = req.query;

  const db = router.db; // lowdb instance
  let videos = db.get('videos').value();

  if (fromDate && toDate) {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    videos = videos.filter(video => {
      const videoDate = new Date(video.startTime);
      return videoDate >= from && videoDate <= to;
    });
  } else if (fromDate) {
    const from = new Date(fromDate);
    videos = videos.filter(video => {
      const videoDate = new Date(video.startTime);
      return videoDate >= from;
    });
  } else if (toDate) {
    const to = new Date(toDate);
    videos = videos.filter(video => {
      const videoDate = new Date(video.startTime);
      return videoDate <= to;
    });
  }

  if (!statuses || statuses === '') {
    videos = [];
  } else {
    const statusesArray = statuses.split(',').map(Number);
    videos = videos.filter(video => statusesArray.includes(video.status));
  }

  eventId = eventId === 'null' ? null : eventId;
  if (eventId) {
    videos = videos.filter(video => video.eventId === eventId);
  }

  // const videosCount = videos.length;

  // Pagination
  const start = (page - 1) * limit;
  const end = start + limit;
  videos = videos.slice(start, end);

  res.json(videos); //{ , videosCount });
});


// TODO - merge the count into the videos fetch request
videos.get('/videos-count', (req, res) => {
  const { fromDate, toDate, statuses } = req.query; /*lat, lng, radius,*/
  let { eventId } = req.query;
  const db = router.db;
  let videos = db.get('videos').value();

  if (fromDate && toDate) {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    videos = videos.filter(video => {
      const videoDate = new Date(video.startTime);
      return videoDate >= from && videoDate <= to;
    });
  }

  // if (lat && lng && radius) {
  //   const parsedRadius = tryParseInt(radius, 0);
  //   videos = videos.filter(video => {
  //     const distance = Math.sqrt(
  //       Math.pow(video.startLocation.coordinates[0] - lat, 2) +
  //       Math.pow(video.startLocation.coordinates[1] - lng, 2)
  //     );
  //     return distance <= parsedRadius;
  //   });
  // }

  if (!statuses || statuses === '') {
    videos = [];
  } else {
    const statusesArray = statuses.split(',').map(Number);
    videos = videos.filter(video => statusesArray.includes(video.status));
  }

  eventId = eventId === 'null' ? null : eventId;
  if (eventId) {
    videos = videos.filter(video => video.eventId === eventId);
  }

  res.json(videos.length);
});


videos.get('*', (_req, res) => {
  res.status(404).json({ message: 'Videos resource not found' });
});

export default videos;
