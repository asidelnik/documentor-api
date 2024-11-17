// // server.js
// import jsonServer from 'json-server';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';
// import { tryParseIntOrUndefined } from './functions.js';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const server = jsonServer.create();
// const router = jsonServer.router(path.join(__dirname, 'db-test.json'));
// const middlewares = jsonServer.defaults();
// server.use(jsonServer.bodyParser);
// server.use(middlewares);

// // server.use((req, res, next) => {
// //   res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
// //   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
// //   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
// //   next();
// // });

// /////////////////////////////////////////////////////////////////////////////////
// // Videos
// /////////////////////////////////////////////////////////////////////////////////
// server.put('/video-set-status/:id', (req, res) => {
//   const db = router.db; // lowdb instance
//   const { id } = req.params;
//   const { status } = req.query;

//   const videoExists = db.get('videos').find({ id }).value() !== undefined;

//   if (videoExists) {
//     db.get('videos').find({ id }).assign({ status: Number(status) }).write();
//     res.json({ message: 'Video status updated successfully' });
//     // res.status(404).send('Video not found');
//   } else {
//     res.status(404).send('Video not found');
//   }
// });


// server.put('/video-set-event/:id', (req, res) => {
//   try {
//     const db = router.db; // lowdb instance
//     const { id } = req.params;
//     let { newEventId, oldEventId } = req.query;

//     newEventId = newEventId === 'null' ? null : newEventId;
//     oldEventId = oldEventId === 'null' ? null : oldEventId;

//     const videoExists = db.get('videos').find({ id }).value() !== undefined;
//     if (!videoExists) {
//       throw new Error('Video not found');
//     }

//     if (newEventId === null) {
//       db.get('videos').find({ id }).assign({ eventId: null }).write();
//       if (oldEventId !== null) {
//         db.get('events')
//           .find({ id: oldEventId })
//           .update('videoIds', videoIds => videoIds.filter(videoId => videoId !== id))
//           .write();
//       }
//     } else {
//       const newEvent = db.get('events').find({ id: newEventId }).value();
//       const newEventExists = newEvent !== undefined;

//       if (videoExists && newEventExists) {
//         // Set Video's eventId
//         db.get('videos').find({ id }).assign({ eventId: newEventId }).write();

//         if (!newEvent.videoIds.includes(id)) {
//           // If the Video doesn't exist in the Event, add it
//           db.get('events')
//             .find({ id: newEventId })
//             .update('videoIds', videoIds => [...videoIds, id])
//             .write();

//           // If the Video existed in another event, remove it
//           if (oldEventId !== null) {
//             db.get('events')
//               .find({ id: oldEventId })
//               .update('videoIds', videoIds => videoIds.filter(videoId => videoId !== id))
//               .write();
//           }
//         }
//       } else {
//         throw new Error('Video or event not found')
//       }
//     }
//     res.json({ message: 'Success' });
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });


// server.get('/videos', (req, res) => {
//   const { fromDate, toDate, statuses, page = 1, limit = 10 } = req.query;
//   let { eventId } = req.query;

//   const db = router.db; // lowdb instance
//   let videos = db.get('videos').value();

//   if (fromDate && toDate) {
//     const from = new Date(fromDate);
//     const to = new Date(toDate);
//     videos = videos.filter(video => {
//       const videoDate = new Date(video.startTime);
//       return videoDate >= from && videoDate <= to;
//     });
//   } else if (fromDate) {
//     const from = new Date(fromDate);
//     videos = videos.filter(video => {
//       const videoDate = new Date(video.startTime);
//       return videoDate >= from;
//     });
//   } else if (toDate) {
//     const to = new Date(toDate);
//     videos = videos.filter(video => {
//       const videoDate = new Date(video.startTime);
//       return videoDate <= to;
//     });
//   }

//   if (!statuses || statuses === '') {
//     videos = [];
//   } else {
//     const statusesArray = statuses.split(',').map(Number);
//     videos = videos.filter(video => statusesArray.includes(video.status));
//   }

//   eventId = eventId === 'null' ? null : eventId;
//   if (eventId) {
//     videos = videos.filter(video => video.eventId === eventId);
//   }

//   // const videosCount = videos.length;

//   // Pagination
//   const start = (page - 1) * limit;
//   const end = start + limit;
//   videos = videos.slice(start, end);

//   res.json(videos); //{ , videosCount });
// });


// // TODO - merge the count into the videos fetch request
// server.get('/videos-count', (req, res) => {
//   const { fromDate, toDate, statuses } = req.query; /*lat, lng, radius,*/
//   let { eventId } = req.query;
//   const db = router.db;
//   let videos = db.get('videos').value();

//   if (fromDate && toDate) {
//     const from = new Date(fromDate);
//     const to = new Date(toDate);
//     videos = videos.filter(video => {
//       const videoDate = new Date(video.startTime);
//       return videoDate >= from && videoDate <= to;
//     });
//   }

//   // if (lat && lng && radius) {
//   //   const parsedRadius = tryParseInt(radius, 0);
//   //   videos = videos.filter(video => {
//   //     const distance = Math.sqrt(
//   //       Math.pow(video.startLocation.coordinates[0] - lat, 2) +
//   //       Math.pow(video.startLocation.coordinates[1] - lng, 2)
//   //     );
//   //     return distance <= parsedRadius;
//   //   });
//   // }

//   if (!statuses || statuses === '') {
//     videos = [];
//   } else {
//     const statusesArray = statuses.split(',').map(Number);
//     videos = videos.filter(video => statusesArray.includes(video.status));
//   }

//   eventId = eventId === 'null' ? null : eventId;
//   if (eventId) {
//     videos = videos.filter(video => video.eventId === eventId);
//   }

//   res.json(videos.length);
// });




// /////////////////////////////////////////////////////////////////////////////////
// // Events
// /////////////////////////////////////////////////////////////////////////////////
// server.get('/events/:id', (req, res) => {
//   const db = router.db; // lowdb instance
//   const { id } = req.params;

//   let event = db.get('events').find({ id }).value();

//   if (event) {
//     const videos = db.get('videos').filter({ eventId: id }).value();
//     event = { ...event, videos };
//     res.json(event);
//   } else {
//     res.status(404).send('Event not found');
//   }
// });


// server.get('/events-autocomplete', (req, res) => {
//   const { page = 1, limit = 100 } = req.query;
//   const db = router.db; // lowdb instance
//   let events = db.get('events').filter({ status: 1 })
//     .sort((a, b) => b.videoIds.length - a.videoIds.length)
//     .sort((a, b) => b.startTime - a.startTime)
//     .value()
//     .map(event => ({ id: event.id, label: event.title }));

//   // Pagination
//   const pageParsed = tryParseIntOrUndefined(page);
//   const limitParsed = tryParseIntOrUndefined(limit);

//   // TODO - fix this error handling. Responds with cors error instead  of json error
//   if (pageParsed === undefined || limitParsed === undefined) {
//     res.status(400).jsonp({
//       error: "Invalid pagination values"
//     })
//     return;
//   }

//   const start = (pageParsed - 1) * limitParsed;
//   const end = start + limitParsed;
//   events = events.slice(start, end);

//   res.json(events);
// });


// // GET Events by filters, sort & pagination (default sort latest)
// server.get('/events', (req, res) => {
//   try {
//     const { fromDate, toDate, priority, freeText, statuses, page = 1, limit = 3 } = req.query;/*lat, lng, radius,*/
//     const db = router.db; // lowdb instance
//     let events = db.get('events').value();

//     if (fromDate && toDate) {
//       const from = new Date(fromDate);
//       const to = new Date(toDate);
//       events = events.filter(event => {
//         const eventStartTime = new Date(event.startTime);
//         return eventStartTime >= from && eventStartTime <= to;
//       });
//     } else if (fromDate) {
//       const from = new Date(fromDate);
//       events = events.filter(event => {
//         const eventStartTime = new Date(event.startTime);
//         return eventStartTime >= from;
//       });
//     } else if (toDate) {
//       const to = new Date(toDate);
//       events = events.filter(event => {
//         const eventStartTime = new Date(event.startTime);
//         return eventStartTime <= to;
//       });
//     }

//     if (!priority || priority === '') {
//       events = [];
//     } else {
//       const priorityArray = priority.split(',').map(Number);
//       events = events.filter(event => priorityArray.includes(event.priority));
//     }

//     if (freeText && freeText.trim() !== '') {
//       const lowerCaseFreeText = freeText.toLowerCase();
//       events = events.filter(event =>
//         event.title.toLowerCase().includes(lowerCaseFreeText) ||
//         event.description.toLowerCase().includes(lowerCaseFreeText)
//       );
//     }

//     if (!statuses || statuses === '') {
//       events = [];
//     } else {
//       const statusesArray = statuses.split(',').map(Number);
//       events = events.filter(event => statusesArray.includes(event.status));
//     }

//     // Add property count of event videos with status 1
//     events = events
//       .sort((a, b) => b.videoIds.length - a.videoIds.length)
//       .sort((a, b) => b.startTime - a.startTime)
//       .map(event => {
//         const eventVideos = db.get('videos').filter({ eventId: event.id }).value();
//         const eventVideosUnprocessed = db.get('videos').filter({ eventId: event.id, status: 1 }).value();
//         return {
//           id: event.id,
//           title: event.title,
//           description: event.description,
//           startTime: event.startTime,
//           endTime: event.endTime,
//           duration: event.duration,
//           locationName: event.locationName,
//           tags: event.tags,
//           videoIds: event.videoIds,
//           status: event.status,
//           priority: event.priority,
//           videosUnprocessedCount: eventVideosUnprocessed.length,
//           videosCount: eventVideos.length
//         };
//       });

//     const eventsCount = events.length;
//     // Pagination
//     const pageParsed = tryParseIntOrUndefined(page);
//     const limitParsed = tryParseIntOrUndefined(limit);

//     // TODO - fix this error handling. Responds with cors error instead  of json error
//     if (pageParsed === undefined || limitParsed === undefined) {
//       res.status(400).jsonp({
//         error: "Invalid pagination values"
//       })
//       return;
//     }

//     const start = (pageParsed - 1) * limitParsed;
//     const end = start + limitParsed;
//     events = events.slice(start, end);

//     res.json({ events, eventsCount });
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });

// server.post('/events', (req, res) => {
//   try {
//     const db = router.db;
//     const { title, priority, startTime, endTime, description, status } = req.body;

//     // Validate required fields
//     if (!title || !priority || !startTime || !status) {
//       throw new Error('Missing required fields');
//     }
//     // Calculate the duration

//     const newEvent = {
//       id: (db.get('events').value().length + 1).toString(),
//       title,
//       description: description || '',
//       startTime,
//       endTime: endTime || null,
//       // duration,
//       // locationName: "Night Watch street, Westeros",
//       // startLocation: {
//       //   "type": "Point",
//       //   "coordinates": [32.0853, 34.7818],
//       //   "heading": 177
//       // },
//       videoIds: [],
//       tags: [],
//       status,
//       priority,
//     };

//     db.get('events').push(newEvent).write();
//     res.status(201).json({ message: 'Event added successfully' });
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });

// server.put('/events/:id', (req, res) => {
//   try {
//     const db = router.db;
//     const { id } = req.params;
//     const { title, priority, startTime, endTime, description, status } = req.body;
//     // Validate required fields
//     if (!title || !priority || !startTime || !status) {
//       throw new Error('Missing required fields');
//     }

//     const event = db.get('events').find({ id }).value();

//     if (event !== undefined) {
//       const updatedEvent = { ...event, title, description, startTime, endTime, status, priority };

//       db.get('events').find({ id }).assign(updatedEvent).write();
//       res.status(200).json({ message: 'Event updated successfully' });
//     } else {
//       throw new Error('Event not found');
//     }
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });


// server.get('/header-badges', (req, res) => {
//   const db = router.db;
//   // Count of videos with status unprocessed
//   const videos = db.get('videos').filter({ status: 1 }).size().value();
//   // Count of active events with high priority
//   const events = db.get('events').filter({ priority: 3, status: 1 }).size().value();

//   res.json({ videos, events });
// });


// server.use(router)
// server.listen(3004, () => {
//   console.log('JSON Server is running')
// })




// // if (lat && lng && radius) {
// //   const parsedRadius = tryParseInt(radius, 0);
// //   events = events.filter(event => {
// //     const distance = Math.sqrt(
// //       Math.pow(event.startLocation.coordinates[0] - lat, 2) +
// //       Math.pow(event.startLocation.coordinates[1] - lng, 2)
// //     );
// //     return distance <= parsedRadius;
// //   });
// // }


// // if (tags) {
// //   const tagsArray = tags.split(',');
// //   events = events.filter(event => tagsArray.every(tag => event.tags.includes(tag)));
// // }


// // if (lat && lng && radius) {
// //   const parsedRadius = tryParseInt(radius, 0);
// //   videos = videos.filter(video => {
// //     const distance = Math.sqrt(
// //       Math.pow(video.startLocation.coordinates[0] - lat, 2) +
// //       Math.pow(video.startLocation.coordinates[1] - lng, 2)
// //     );
// //     return distance <= parsedRadius;
// //   });
// // }

// // if (eventId) {
// //   videos = videos.filter(video => video.eventId !== null);
// // }