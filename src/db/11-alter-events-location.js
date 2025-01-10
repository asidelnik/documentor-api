import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.ATLAS_URI || '';
const client = new MongoClient(uri);

async function alterEventsLoc() {
  try {
    // Connect to the Atlas cluster - db - collection
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    const eventsCollection = db.collection(process.env.EVENTS_COLLECTION_NAME);

    // const events = await eventsCollection.find({}).toArray();
    // for (const event of events) {
    //   let loc = {
    //     "coordinates": [event.location.coordinates[1], event.location.coordinates[0]],
    //     "type": "point"
    //   };

    // await eventsCollection.updateOne(
    //   { _id: event._id },
    // {
    //   $set: {
    //     'location': loc
    //   },
    // },
    // {
    //   $unset: {
    //     'locationStart.loc': "",
    //   }
    // }

    // {
    //   $set: {
    //     'locationTexts': event.locationStart
    //   },
    // },
    // {
    //   $unset: {
    //     'locationStart': "",
    //   }
    // }
    //   );
    // }

    // await eventsCollection.updateMany(
    //   {},
    //   {
    //     $set: {
    //       'loc': {}
    //     },
    //   }
    // );

    await eventsCollection.updateMany(
      {},
      {
        $unset: {
          'loc': "",
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