import { MongoClient } from 'mongodb';

const uri = process.env.ATLAS_URI || '';
const client = new MongoClient(uri);

async function geoIndexes() {
  try {
    // Connect to the Atlas cluster - db - collection
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    const eventsCollection = db.collection(process.env.EVENTS_COLLECTION_NAME);
    await eventsCollection.createIndex({ "location": "2dsphere" });

    console.log('Events location index created');
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
}

geoIndexes().catch(console.dir);