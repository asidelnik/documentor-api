import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.ATLAS_URI || '';
const client = new MongoClient(uri);

async function createPopulateEventTypesCollection() {
  try {
    // Connect to the Atlas cluster - db - collection
    await client.connect();
    const db = client.db(process.env.DB_NAME);

    const schema = {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['id', 'label'],
          properties: {
            id: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            label: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
          }
        }
      }
    };
    await db.createCollection('eventTypes', schema);

    const eventTypes = [
      { id: '1', label: 'Domestic' },
      { id: '2', label: 'Neighbors' },
      { id: '3', label: 'Gang' },
      { id: '4', label: 'Transportation' },
      { id: '5', label: 'Protests' },
      { id: '6', label: 'Assault' },
      { id: '7', label: 'Bullying' },
    ];

    const collection = db.collection('eventTypes');
    await collection.insertMany(eventTypes);

    console.log('Documents updated successfully');
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
}

createPopulateEventTypesCollection().catch(console.error);