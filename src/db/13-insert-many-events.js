import { MongoClient } from 'mongodb';

const uri = process.env.ATLAS_URI || '';
const client = new MongoClient(uri);

async function eventsInsert() {
  try {
    // Connect to the Atlas cluster - db - collection
    await client.connect();
    const db = client.db(process.env.DB_NAME);

    const events = [
      {
        title: "Gang Fight in Downtown",
        description: "A violent gang fight broke out in downtown Tel Aviv.",
        startTime: new Date("2023-10-01T18:00:00Z"),
        duration: 60,
        videoIds: [],
        tags: ["gang", "violence"],
        status: 1,
        priority: 1,
        fatalities: 2,
        injuries: 5,
        severity: 5,
        types: ["gang"],
        location: {
          coordinates: [34.7818, 32.0853],
          type: "Point"
        },
        locationTexts: {
          country: "Israel",
          city: "Tel Aviv",
          address: "Downtown"
        },
        endTime: "2023-10-01T19:00:00Z"
      },
      {
        title: "Protest Turns Violent",
        description: "A peaceful protest turned violent near the city center.",
        startTime: new Date("2023-10-02T15:00:00Z"),
        duration: 120,
        videoIds: [ObjectId()],
        tags: ["protests", "violence"],
        status: 2,
        priority: 1,
        fatalities: 0,
        injuries: 10,
        severity: 4,
        types: ["protests"],
        location: {
          coordinates: [34.7818, 32.0853],
          type: "Point"
        },
        locationTexts: {
          country: "Israel",
          city: "Tel Aviv",
          address: "City Center"
        },
        endTime: "2023-10-02T17:00:00Z"
      },
      {
        title: "Domestic Violence Incident",
        description: "A severe domestic violence incident reported in a residential area.",
        startTime: new Date("2023-10-03T20:00:00Z"),
        duration: 30,
        videoIds: [],
        tags: ["domestic", "violence"],
        status: 1,
        priority: 1,
        fatalities: 1,
        injuries: 2,
        severity: 5,
        types: ["domestic"],
        location: {
          coordinates: [34.7818, 32.0853],
          type: "Point"
        },
        locationTexts: {
          country: "Israel",
          city: "Tel Aviv",
          address: "Residential Area"
        },
        endTime: "2023-10-03T20:30:00Z"
      }
    ];

    await db.collection(process.env.EVENTS_COLLECTION_NAME).insertMany(events);


    console.log('Events location index created');
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
}

eventsInsert().catch(console.dir);