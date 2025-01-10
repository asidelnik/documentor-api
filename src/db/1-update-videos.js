import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.ATLAS_URI || '';
const client = new MongoClient(uri);

async function run() {
  try {
    // Connect to the Atlas cluster - db - collection
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    const videosCollection = db.collection(process.env.VIDEOS_COLLECTION_NAME);
    const eventsCollection = db.collection(process.env.EVENTS_COLLECTION_NAME);

    // Fetch all events
    const events = await eventsCollection.find({}).toArray();
    const eventMap = new Map(events.map(event => [event.id, event._id]));

    // Fetch all videos
    const videos = await videosCollection.find({}).toArray();

    for (const video of videos) {
      if (video.eventId && eventMap.has(video.eventId)) {
        const newEventId = eventMap.get(video.eventId);

        // Update the video document
        await videosCollection.updateOne(
          { _id: video._id },
          { $set: { eventId: newEventId } }
        );
      }
    }

    console.log('Video documents updated successfully');
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);