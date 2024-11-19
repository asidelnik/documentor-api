import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.ATLAS_URI || '';
const client = new MongoClient(uri);

async function run() {
  try {
    // Connect to the Atlas cluster - db - collection
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    const eventsCollection = db.collection(process.env.EVENTS_COLLECTION_NAME);
    const videosCollection = db.collection(process.env.VIDEOS_COLLECTION_NAME);

    // Fetch all events
    const events = await eventsCollection.find({}).toArray();

    for (const event of events) {
      // Fetch the corresponding videos
      const videoIds = event.videoIds.map(id => id);
      const videos = await videosCollection.find({ id: { $in: videoIds } }).toArray();

      // Replace videoIds with the corresponding Video._id
      const newVideoIds = videos.map(video => video._id);

      // Update the event document
      await eventsCollection.updateOne(
        { _id: event._id },
        { $set: { videoIds: newVideoIds } }
      );
    }

    console.log('Event documents updated successfully');
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);