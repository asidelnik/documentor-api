import express from 'express';
import cors from 'cors';
import videos from './src/routes/videos.js';
import events from './src/routes/events.js';
import analytics from './src/routes/analytics.js';
import cities from './src/routes/cities.js';
import shared from './src/routes/shared.js';
import { connectToDatabase } from './src/services/db.service.js';
import { corsOptions } from './src/config/corsOptions.js';

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors(corsOptions));
app.use(express.json());

connectToDatabase()
  .then(() => {
    app.use('/videos', videos);
    app.use('/events', events);
    app.use('/analytics', analytics);
    app.use('/cities', cities);
    app.use('/shared', shared);

    app.listen(PORT, () => {
      console.log(`Server started at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed', error);
    process.exit();
  });
