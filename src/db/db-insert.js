import { Collection, Db, MongoClient } from 'mongodb';

const uri = process.env.ATLAS_URI || '';
const client = new MongoClient(uri);

async function run() {
  try {
    // Connect to the Atlas cluster - db - collection
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    const videosCollection = db.collection(process.env.VIDEOS_COLLECTION_NAME);
    const eventsCollection = db.collection(process.env.EVENTS_COLLECTION_NAME);

    // Create new video docs
    const videoDocs = [
      {
        id: "1",
        title: "Video 1",
        url: "https://www.youtube.com/embed/SekA57AxJVE",
        thumbnail: "https://img.youtube.com/vi/SekA57AxJVE/0.jpg",
        startTime: "2023-10-24T00:00:00.000Z",
        duration: 10,
        endTime: "2023-10-24T00:00:07.000Z",
        orientation: 2,
        eventId: "3",
        status: 2,
        startLocation: {
          type: "Point",
          coordinates: [32.0853, 34.7818],
          heading: 177
        },
        endLocation: {
          type: "Point",
          coordinates: [32.0853, 34.7818],
          heading: 177
        }
      },
      {
        id: "2",
        title: "Video 2",
        url: "https://www.youtube.com/embed/oG25KSvFEq0",
        thumbnail: "https://img.youtube.com/vi/oG25KSvFEq0/0.jpg",
        startTime: "2023-10-23T00:00:05.000Z",
        duration: 10,
        endTime: "2023-10-23T00:00:10.000Z",
        orientation: 1,
        eventId: "3",
        status: 1,
        startLocation: {
          type: "Point",
          coordinates: [32.0853, 34.7818],
          heading: 177
        },
        endLocation: {
          type: "Point",
          coordinates: [32.0853, 34.7818],
          heading: 177
        }
      },
      {
        id: "3",
        title: "Video 3",
        url: "https://www.youtube.com/embed/SekA57AxJVE",
        thumbnail: "https://img.youtube.com/vi/SekA57AxJVE/0.jpg",
        startTime: "2023-10-23T00:00:06.000Z",
        duration: 10,
        endTime: "2023-10-23T00:00:13.000Z",
        orientation: 2,
        eventId: "3",
        status: 1,
        startLocation: {
          type: "Point",
          coordinates: [32.0853, 34.7818],
          heading: 177
        },
        endLocation: {
          type: "Point",
          coordinates: [32.0853, 34.7818],
          heading: 177
        }
      },
      {
        id: "4",
        title: "Video 4",
        url: "https://www.youtube.com/embed/oG25KSvFEq0",
        thumbnail: "https://img.youtube.com/vi/oG25KSvFEq0/0.jpg",
        startTime: "2023-10-23T00:00:10.000Z",
        duration: 10,
        endTime: "2023-10-23T00:00:17.000Z",
        orientation: 1,
        eventId: null,
        status: 2,
        startLocation: {
          type: "Point",
          coordinates: [32.0853, 34.7818],
          heading: 177
        },
        endLocation: {
          type: "Point",
          coordinates: [32.0853, 34.7818],
          heading: 177
        }
      },
      {
        id: "5",
        title: "Video 5",
        url: "https://www.youtube.com/embed/oG25KSvFEq0",
        thumbnail: "https://img.youtube.com/vi/oG25KSvFEq0/0.jpg",
        startTime: "2023-10-23T00:00:12.000Z",
        duration: 10,
        endTime: "2023-10-23T00:00:19.000Z",
        orientation: 2,
        eventId: "13",
        status: 2,
        startLocation: {
          type: "Point",
          coordinates: [32.0853, 34.7818],
          heading: 177
        },
        endLocation: {
          type: "Point",
          coordinates: [32.0853, 34.7818],
          heading: 177
        }
      },
      {
        id: "6",
        title: "Video 6",
        url: "https://www.youtube.com/embed/SekA57AxJVE",
        thumbnail: "https://img.youtube.com/vi/SekA57AxJVE/0.jpg",
        startTime: "2023-10-23T00:00:15.000Z",
        duration: 10,
        endTime: "2023-10-23T00:00:22.000Z",
        orientation: 1,
        eventId: "2",
        status: 3,
        startLocation: {
          type: "Point",
          coordinates: [32.08496, 34.783297],
          heading: 177
        },
        endLocation: {
          type: "Point",
          coordinates: [32.08496, 34.783297],
          heading: 177
        }
      },
      {
        id: "7",
        title: "Video 7",
        url: "https://www.youtube.com/embed/oG25KSvFEq0",
        thumbnail: "https://img.youtube.com/vi/oG25KSvFEq0/0.jpg",
        startTime: "2023-10-23T00:00:20.000Z",
        duration: 10,
        endTime: "2023-10-23T00:00:27.000Z",
        orientation: 2,
        eventId: "2",
        status: 2,
        startLocation: {
          type: "Point",
          coordinates: [32.08496, 34.783297],
          heading: 177
        },
        endLocation: {
          type: "Point",
          coordinates: [32.08496, 34.783297],
          heading: 177
        }
      },
      {
        id: "8",
        title: "Video 8",
        url: "https://www.youtube.com/embed/SekA57AxJVE",
        thumbnail: "https://img.youtube.com/vi/SekA57AxJVE/0.jpg",
        startTime: "2023-10-23T00:00:25.000Z",
        duration: 10,
        endTime: "2023-10-23T00:00:32.000Z",
        orientation: 1,
        eventId: "13",
        status: 2,
        startLocation: {
          type: "Point",
          coordinates: [32.08496, 34.783297],
          heading: 177
        },
        endLocation: {
          type: "Point",
          coordinates: [32.08496, 34.783297],
          heading: 177
        }
      },
      {
        id: "9",
        title: "Video 9",
        url: "https://www.youtube.com/embed/oG25KSvFEq0",
        thumbnail: "https://img.youtube.com/vi/oG25KSvFEq0/0.jpg",
        startTime: "2023-10-23T00:00:30.000Z",
        duration: 10,
        endTime: "2023-10-23T00:00:37.000Z",
        orientation: 2,
        eventId: "11",
        status: 3,
        startLocation: {
          type: "Point",
          coordinates: [32.08496, 34.783297],
          heading: 177
        },
        endLocation: {
          type: "Point",
          coordinates: [32.08496, 34.783297],
          heading: 177
        }
      },
      {
        id: "10",
        title: "Video 10",
        url: "https://www.youtube.com/embed/oG25KSvFEq0",
        thumbnail: "https://img.youtube.com/vi/oG25KSvFEq0/0.jpg",
        startTime: "2023-10-23T00:00:35.000Z",
        duration: 10,
        endTime: "2023-10-23T00:00:42.000Z",
        orientation: 1,
        eventId: null,
        status: 1,
        startLocation: {
          type: "Point",
          coordinates: [32.08496, 34.783297],
          heading: 177
        },
        endLocation: {
          type: "Point",
          coordinates: [32.08496, 34.783297],
          heading: 177
        }
      },
      {
        id: "11",
        title: "Video 11",
        url: "https://www.youtube.com/embed/SekA57AxJVE",
        thumbnail: "https://img.youtube.com/vi/SekA57AxJVE/0.jpg",
        startTime: "2023-10-23T00:00:40.000Z",
        duration: 10,
        endTime: "2023-10-23T00:00:47.000Z",
        orientation: 2,
        eventId: "1",
        status: 2,
        startLocation: {
          type: "Point",
          coordinates: [32.084687, 34.784981],
          heading: 177
        },
        endLocation: {
          type: "Point",
          coordinates: [32.084687, 34.784981],
          heading: 177
        }
      },
      {
        id: "12",
        title: "Video 12",
        url: "https://www.youtube.com/embed/oG25KSvFEq0",
        thumbnail: "https://img.youtube.com/vi/oG25KSvFEq0/0.jpg",
        startTime: "2023-10-23T00:00:45.000Z",
        duration: 10,
        endTime: "2023-10-23T00:00:52.000Z",
        orientation: 1,
        eventId: "3",
        status: 3,
        startLocation: {
          type: "Point",
          coordinates: [32.084687, 34.784981],
          heading: 177
        },
        endLocation: {
          type: "Point",
          coordinates: [32.084687, 34.784981],
          heading: 177
        }
      },
      {
        id: "13",
        title: "Video 13",
        url: "https://www.youtube.com/embed/SekA57AxJVE",
        thumbnail: "https://img.youtube.com/vi/SekA57AxJVE/0.jpg",
        startTime: "2023-10-23T00:00:50.000Z",
        duration: 10,
        endTime: "2023-10-23T00:00:57.000Z",
        orientation: 2,
        eventId: null,
        status: 3,
        startLocation: {
          type: "Point",
          coordinates: [32.084687, 34.784981],
          heading: 177
        },
        endLocation: {
          type: "Point",
          coordinates: [32.084687, 34.784981],
          heading: 177
        }
      },
      {
        id: "14",
        title: "Video 14",
        url: "https://www.youtube.com/embed/oG25KSvFEq0",
        thumbnail: "https://img.youtube.com/vi/oG25KSvFEq0/0.jpg",
        startTime: "2023-10-23T00:00:55.000Z",
        duration: 10,
        endTime: "2023-10-23T00:01:02.000Z",
        orientation: 1,
        eventId: null,
        status: 2,
        startLocation: {
          type: "Point",
          coordinates: [32.084687, 34.784981],
          heading: 177
        },
        endLocation: {
          type: "Point",
          coordinates: [32.084687, 34.784981],
          heading: 177
        }
      },
      {
        id: "15",
        title: "Video 15",
        url: "https://www.youtube.com/embed/oG25KSvFEq0",
        thumbnail: "https://img.youtube.com/vi/oG25KSvFEq0/0.jpg",
        startTime: "2023-10-23T00:01:00.000Z",
        duration: 10,
        endTime: "2023-10-23T00:01:07.000Z",
        orientation: 2,
        eventId: null,
        status: 3,
        startLocation: {
          type: "Point",
          coordinates: [32.084687, 34.784981],
          heading: 177
        },
        endLocation: {
          type: "Point",
          coordinates: [32.084687, 34.784981],
          heading: 177
        }
      }
    ];
    // Insert the video docs
    await videosCollection.insertMany(videoDocs);

    // Create new event docs
    const eventDocs = [
      {
        id: "1",
        title: "Jon Snow2",
        description: "White walkers incursion.",
        startTime: "2024-09-30T21:00:00.000Z",
        duration: 13,
        locationName: "Night Watch street, Westeros",
        startLocation: {
          type: "Point",
          coordinates: [32.0853, 34.7818],
          heading: 177
        },
        videoIds: ["11"],
        tags: ["Incursion", "White walkers", "Jon Snow"],
        status: 1,
        priority: 2
      },
      {
        id: "2",
        title: "Robb Stark 11",
        description: "Battle of Winterfell.",
        startTime: "2023-10-23T00:00:00.000Z",
        duration: 20,
        locationName: "Winterfell, Westeros",
        startLocation: {
          type: "Point",
          coordinates: [32.08496, 34.783297],
          heading: 177
        },
        videoIds: ["6", "7"],
        tags: ["Battle", "Winterfell", "Robb Stark"],
        status: 1,
        priority: 3
      },
      {
        id: "3",
        title: "Daenerys Targaryen - 11",
        description: "Dragon attack on King's Landing.",
        startTime: "2023-10-22T00:00:00.000Z",
        duration: 15,
        locationName: "King's Landing, Westeros",
        startLocation: {
          type: "Point",
          coordinates: [32.084687, 34.784981],
          heading: 177
        },
        videoIds: ["12", "2", "3", "1"],
        tags: ["Dragon", "King's Landing", "Daenerys Targaryen"],
        status: 1,
        priority: 2
      },
      {
        id: "4",
        title: "Tyrion Lannister",
        description: "Trial by combat.",
        startTime: "2023-10-23T00:00:00.000Z",
        endTime: "2023-10-23T00:00:10.000Z",
        duration: 10,
        locationName: "King's Landing, Westeros",
        startLocation: {
          type: "Point",
          coordinates: [32.086087, 34.781999],
          heading: 177
        },
        videoIds: [],
        tags: ["Trial", "Combat", "Tyrion Lannister"],
        status: 1,
        priority: 2
      },
      {
        id: "5",
        title: "Arya Stark",
        description: "Assassination of the Night King.",
        startTime: "2023-10-23T00:00:00.000Z",
        endTime: "2023-10-23T00:00:08.000Z",
        duration: 8,
        locationName: "Winterfell, Westeros",
        startLocation: {
          type: "Point",
          coordinates: [32.0853, 34.7818],
          heading: 177
        },
        videoIds: [],
        tags: ["Assassination", "Night King", "Arya Stark"],
        status: 1,
        priority: 1
      },
      {
        id: "6",
        title: "Cersei Lannister",
        description: "Wildfire explosion.",
        startTime: "2023-10-23T00:00:00.000Z",
        endTime: "2023-10-23T00:00:12.000Z",
        duration: 12,
        locationName: "King's Landing, Westeros",
        startLocation: {
          type: "Point",
          coordinates: [32.08496, 34.783297],
          heading: 177
        },
        videoIds: [],
        tags: ["Wildfire", "Explosion", "Cersei Lannister"],
        status: 1,
        priority: 1
      },
      {
        id: "7",
        title: "Bran Stark",
        description: "Coronation as King of the Six Kingdoms.",
        startTime: "2023-10-23T00:00:00.000Z",
        endTime: "2023-10-23T00:00:05.000Z",
        duration: 5,
        locationName: "King's Landing, Westeros",
        startLocation: {
          type: "Point",
          coordinates: [32.084687, 34.784981],
          heading: 177
        },
        videoIds: [],
        tags: ["Coronation", "King", "Bran Stark"],
        status: 1,
        priority: 1
      },
      {
        id: "8",
        title: "Sansa Stark",
        description: "Coronation as Queen in the North.",
        startTime: "2023-10-23T00:00:00.000Z",
        endTime: "2023-10-23T00:00:05.000Z",
        duration: 5,
        locationName: "Winterfell, Westeros",
        startLocation: {
          type: "Point",
          coordinates: [32.086087, 34.781999],
          heading: 177
        },
        videoIds: [],
        tags: ["Coronation", "Queen", "Sansa Stark"],
        status: 1,
        priority: 1
      },
      {
        id: "9",
        title: "Jaime Lannister",
        description: "Death in the arms of Brienne of Tarth.",
        startTime: "2023-10-23T00:00:00.000Z",
        endTime: "2023-10-23T00:00:03.000Z",
        duration: 3,
        locationName: "Winterfell, Westeros",
        startLocation: {
          type: "Point",
          coordinates: [32.0853, 34.7818],
          heading: 177
        },
        videoIds: [],
        tags: ["Death", "Brienne of Tarth", "Jaime Lannister"],
        status: 1,
        priority: 1
      },
      {
        id: "10",
        title: "Joffrey Baratheon",
        description: "Poisoning at the Purple Wedding.",
        startTime: "2023-10-23T00:00:00.000Z",
        endTime: "2023-10-23T00:00:05.000Z",
        duration: 5,
        locationName: "King's Landing, Westeros",
        startLocation: {
          type: "Point",
          coordinates: [32.08496, 34.783297],
          heading: 177
        },
        videoIds: [],
        tags: ["Poisoning", "Purple Wedding", "Joffrey Baratheon"],
        status: 1,
        priority: 1
      },
      {
        id: "11",
        title: "The wall",
        description: "The wall was breached",
        startTime: "2023-10-09T08:40:10.552Z",
        endTime: "2023-10-11T00:00:00.000Z",
        duration: 5,
        locationName: "King's Landing, Westeros",
        startLocation: {
          type: "Point",
          coordinates: [32.08496, 34.783297],
          heading: 177
        },
        videoIds: ["9"],
        tags: [],
        status: 2,
        priority: 3
      },
      {
        id: "12",
        title: "trial",
        description: "trial 2",
        startTime: "2023-10-09T08:40:10.552Z",
        endTime: "2023-10-10T00:00:00.000Z",
        videoIds: [],
        tags: [],
        status: 1,
        priority: 1
      },
      {
        id: "13",
        title: "trial 4",
        description: "trial 2",
        startTime: "2023-10-10T21:00:32.000Z",
        videoIds: ["5", "8"],
        tags: [],
        status: 1,
        priority: 3
      },
      {
        id: "14",
        title: "TRIAL 333333",
        description: "",
        startTime: "2023-10-11T21:00:32.000Z",
        videoIds: [],
        tags: [],
        status: 1,
        priority: 3
      },
      {
        id: "15",
        title: "snack bar trial",
        description: "snack bar trial",
        startTime: "2024-08-19T16:46:29.319Z",
        endTime: null,
        videoIds: [],
        tags: [],
        status: 1,
        priority: 1
      },
      {
        id: "16",
        title: "snackbar 1",
        description: "",
        startTime: "2024-08-19T17:19:39.818Z",
        endTime: null,
        videoIds: [],
        tags: [],
        status: 1,
        priority: 1
      },
      {
        id: "17",
        title: "snackbar - 2",
        description: "",
        startTime: "2024-08-19T17:20:40.820Z",
        endTime: null,
        videoIds: [],
        tags: [],
        status: 1,
        priority: 1
      },
      {
        id: "18",
        title: "snackbar - 3",
        description: "",
        startTime: "2024-08-19T17:20:55.623Z",
        endTime: null,
        videoIds: [],
        tags: [],
        status: 1,
        priority: 1
      }
    ];
    // Insert the event docs
    await eventsCollection.insertMany(eventDocs);

    // // Find the document
    // const filter = { name: 'Whiskers' };
    // const document = await videosCollection.findOne(filter);
    // // Print results
    // console.log('Document found:\n' + JSON.stringify(document));
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
