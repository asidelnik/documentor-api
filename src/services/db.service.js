import * as mongoDB from 'mongodb';
import * as dotenv from 'dotenv';

// Create a collections object
export const collections = {};


/** Connect to MongoDB and create a reference to its collections */
export async function connectToDatabase() {
  // Load environment variables from .env file to process.env
  dotenv.config();

  // Create a MongoDB client with an Atlas connection string
  const client = new mongoDB.MongoClient(process.env.ATLAS_URI || '');

  // Connect to MongoDB
  await client.connect();

  // Create a DB instance
  const documentorDB = client.db(process.env.DB_NAME);

  // Create a collection reference
  const videosCollection = documentorDB.collection(process.env.VIDEOS_COLLECTION_NAME || '');
  const eventsCollection = documentorDB.collection(process.env.EVENTS_COLLECTION_NAME || '');
  const citiesCollection = documentorDB.collection(process.env.CITIES_COLLECTION_NAME || '');
  const eventTypesCollection = documentorDB.collection(process.env.EVENTTYPES_COLLECTION_NAME || '');

  // Assign the collection reference to the collections object
  collections.videos = videosCollection;
  collections.events = eventsCollection;
  collections.cities = citiesCollection;
  collections.eventTypes = eventTypesCollection;

  console.log(
    `Successfully connected to db: ${documentorDB.databaseName}.`
  );
}
