import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.ATLAS_URI || '';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    // Connect to the Atlas cluster - db - collection
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    const eventsCollection = db.collection(process.env.EVENTS_COLLECTION_NAME);

    // Update the schema of all documents in the events collection
    await eventsCollection.updateMany(
      {},
      {
        $set: {
          'locationStart.type': 'point'
        }
      }
    );

    console.log('Event documents updated successfully');
  } catch (err) {
    console.log('Error:', err);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);