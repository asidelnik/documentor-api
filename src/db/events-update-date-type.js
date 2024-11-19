import { MongoClient } from 'mongodb';

const uri = process.env.ATLAS_URI || '';
const client = new MongoClient(uri);

async function run() {
  try {
    // Connect to the Atlas cluster - db - collection
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    const eventsCollection = db.collection(process.env.EVENTS_COLLECTION_NAME);

    // Fetch all events
    const events = await eventsCollection.find({}).toArray();

    for (const event of events) {
      if (typeof event.startTime === 'string') {
        const newStartTime = new Date(event.startTime);

        // Update the event document
        await eventsCollection.updateOne(
          { _id: event._id },
          { $set: { startTime: newStartTime } }
        );
      }
    }

    console.log('Event documents updated successfully');
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);