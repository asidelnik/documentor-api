import express from 'express';
import cors from 'cors';
import videos from './src/routes/videos';
import events from './src/routes/events';
import { connectToDatabase } from './services/db.service';

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

connectToDatabase()
  .then(() => {
    app.use('/videos', videos);
    app.use('/events', events);

    app.listen(PORT, () => {
      console.log(`Server started at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed', error);
    process.exit();
  });
