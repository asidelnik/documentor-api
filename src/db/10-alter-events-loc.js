import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.ATLAS_URI || '';
const client = new MongoClient(uri);

async function alterEventsLoc() {
  try {
    // Connect to the Atlas cluster - db - collection
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    const eventsCollection = db.collection(process.env.EVENTS_COLLECTION_NAME);

    const events = await eventsCollection.find({}).toArray();
    for (const event of events) {
      let loc = {
        "coordinates": event.locationStart.coordinates,
        "type": "point"
      };

      await eventsCollection.updateOne(
        { _id: event._id },
        {
          $set: {
            'locationStart.loc': loc
          }
        }
      );
    }

    await eventsCollection.updateMany(
      {},
      {
        $unset: {
          'locationStart.coordinates': "",
          'locationStart.type': ""
        }
      }
    );

    console.log('Event documents updated successfully');
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
}

alterEventsLoc().catch(console.dir);