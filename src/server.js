import express from 'express';
import cors from 'cors';
import videos from './routes/videos.js';
import events from './routes/events.js';
import shared from './routes/shared.js';
import { connectToDatabase } from './services/db.service.js';
import { corsOptions } from './config/corsOptions';

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors(corsOptions));
app.use(express.json());

connectToDatabase()
  .then(() => {
    app.use('/videos', videos);
    app.use('/events', events);
    app.use('/shared', shared);

    app.listen(PORT, () => {
      console.log(`Server started at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed', error);
    process.exit();
  });
