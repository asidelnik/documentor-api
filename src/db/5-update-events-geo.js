import { MongoClient } from 'mongodb';

const uri = process.env.ATLAS_URI || '';
const client = new MongoClient(uri);

async function run() {
  try {
    // Connect to the Atlas cluster - db - collection
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    const eventsCollection = db.collection(process.env.EVENTS_COLLECTION_NAME);

    eventsCollection.updateMany(
      {},
      {
        $set: {
          types: [],
          fatalities: 0,
          injuries: 0,
          severity: 0,
          locationStart: {
            country: "israel",
            city: "",
            coordinates: { $ifNull: ["$startLocation.coordinates", []] }
          }
        }
      }
    )

    console.log('Event documents updated successfully');
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);

