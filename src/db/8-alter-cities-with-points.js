import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.ATLAS_URI || '';
const client = new MongoClient(uri);

async function createPopulateCitiesCollection() {
  try {
    // Connect to the Atlas cluster - db - collection
    await client.connect();
    const db = client.db(process.env.DB_NAME);

    await db.collection('cities').drop();

    const schema = {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['name', 'location'],
          properties: {
            name: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            location: {
              bsonType: 'object',
              required: ['type', 'coordinates'],
              properties: {
                type: {
                  bsonType: 'string',
                  enum: ['Point'],
                  description: 'must be a string and is required'
                },
                coordinates: {
                  bsonType: 'array',
                  items: {
                    bsonType: 'double'
                  },
                  description: 'must be an array of doubles and is required'
                }
              }
            }
          }
        }
      }
    };
    await db.createCollection('cities', schema);

    const cities = [
      { name: 'Tel Aviv - Yafo', location: { type: 'Point', coordinates: [32.0800, 34.7800] } },
      { name: 'Jerusalem', location: { type: 'Point', coordinates: [31.7789, 35.2256] } },
      { name: 'Haifa', location: { type: 'Point', coordinates: [32.8192, 34.9992] } },
      { name: 'Rishon LeẔiyyon', location: { type: 'Point', coordinates: [31.9500, 34.8000] } },
      { name: 'Petaẖ Tiqwa', location: { type: 'Point', coordinates: [32.0889, 34.8864] } },
      { name: 'Ashdod', location: { type: 'Point', coordinates: [31.8000, 34.6500] } },
      { name: 'Netanya', location: { type: 'Point', coordinates: [32.3286, 34.8567] } },
      { name: 'Beersheba', location: { type: 'Point', coordinates: [31.2589, 34.7997] } },
      { name: 'Holon', location: { type: 'Point', coordinates: [32.0167, 34.7667] } },
      { name: 'Bené Beraq', location: { type: 'Point', coordinates: [32.0833, 34.8333] } },
      { name: 'Ramat Gan', location: { type: 'Point', coordinates: [32.0700, 34.8236] } },
      { name: 'Ashqelon', location: { type: 'Point', coordinates: [31.6667, 34.5667] } },
      { name: 'Reẖovot', location: { type: 'Point', coordinates: [31.8969, 34.8167] } },
      { name: 'Bat Yam', location: { type: 'Point', coordinates: [32.0167, 34.7500] } },
      { name: 'Bet Shemesh', location: { type: 'Point', coordinates: [31.7456, 34.9867] } },
      { name: 'Kefar Sava', location: { type: 'Point', coordinates: [32.1714, 34.9083] } },
      { name: 'Modi‘in Makkabbim Re‘ut', location: { type: 'Point', coordinates: [31.9077, 35.0076] } },
      { name: 'Hadera', location: { type: 'Point', coordinates: [32.4500, 34.9167] } },
      { name: 'Herẕliyya', location: { type: 'Point', coordinates: [32.1653, 34.8458] } },
      { name: 'Nazareth', location: { type: 'Point', coordinates: [32.7019, 35.3033] } },
      { name: 'Lod', location: { type: 'Point', coordinates: [31.9519, 34.8881] } },
      { name: 'Ramla', location: { type: 'Point', coordinates: [31.9275, 34.8625] } },
      { name: 'Ra‘ananna', location: { type: 'Point', coordinates: [32.1833, 34.8667] } },
      { name: 'Qiryat Gat', location: { type: 'Point', coordinates: [31.6061, 34.7717] } },
      { name: 'Rahat', location: { type: 'Point', coordinates: [31.3925, 34.7544] } },
      { name: 'Nahariyya', location: { type: 'Point', coordinates: [33.0058, 35.0989] } },
      { name: 'Afula', location: { type: 'Point', coordinates: [32.6064, 35.2881] } },
      { name: 'Givatayim', location: { type: 'Point', coordinates: [32.0714, 34.8100] } },
      { name: 'Hod HaSharon', location: { type: 'Point', coordinates: [32.1500, 34.8833] } },
      { name: 'Rosh Ha‘Ayin', location: { type: 'Point', coordinates: [32.0956, 34.9567] } },
      { name: 'Qiryat Ata', location: { type: 'Point', coordinates: [32.8000, 35.1000] } },
      { name: 'Umm el Faḥm', location: { type: 'Point', coordinates: [32.5194, 35.1536] } },
      { name: 'Eilat', location: { type: 'Point', coordinates: [29.5569, 34.9517] } },
      { name: 'Nes Ẕiyyona', location: { type: 'Point', coordinates: [31.9333, 34.8000] } },
      { name: '‘Akko', location: { type: 'Point', coordinates: [32.9278, 35.0817] } },
      { name: 'El‘ad', location: { type: 'Point', coordinates: [32.0522, 34.9511] } },
      { name: 'Ramat HaSharon', location: { type: 'Point', coordinates: [32.1500, 34.8333] } },
      { name: 'Karmiel', location: { type: 'Point', coordinates: [32.9136, 35.2961] } },
      { name: 'Tiberias', location: { type: 'Point', coordinates: [32.7944, 35.5333] } },
      { name: 'Eṭ Ṭaiyiba', location: { type: 'Point', coordinates: [32.2667, 35.0103] } },
      { name: 'Ben Zakkay', location: { type: 'Point', coordinates: [31.8558, 34.7300] } },
      { name: 'Pardés H̱anna Karkur', location: { type: 'Point', coordinates: [32.4711, 34.9675] } },
      { name: 'Qiryat Moẕqin', location: { type: 'Point', coordinates: [32.8333, 35.0833] } },
      { name: 'Qiryat Ono', location: { type: 'Point', coordinates: [32.0636, 34.8553] } },
      { name: 'Shefar‘am', location: { type: 'Point', coordinates: [32.8056, 35.1694] } },
      { name: 'Qiryat Bialik', location: { type: 'Point', coordinates: [32.8333, 35.0833] } },
      { name: 'Qiryat Yam', location: { type: 'Point', coordinates: [32.8333, 35.0667] } },
      { name: 'Or Yehuda', location: { type: 'Point', coordinates: [32.0306, 34.8533] } },
      { name: 'Ẕefat', location: { type: 'Point', coordinates: [32.9658, 35.4983] } },
      { name: 'Dimona', location: { type: 'Point', coordinates: [31.0667, 35.0333] } },
      { name: 'Tamra', location: { type: 'Point', coordinates: [32.8536, 35.1978] } },
      { name: 'Netivot', location: { type: 'Point', coordinates: [31.4167, 34.5833] } },
      { name: 'Sakhnīn', location: { type: 'Point', coordinates: [32.8667, 35.3000] } },
      { name: 'Be’er Ya‘aqov', location: { type: 'Point', coordinates: [31.9425, 34.8336] } },
      { name: 'Yehud', location: { type: 'Point', coordinates: [32.0333, 34.8833] } },
      { name: 'Ofaqim', location: { type: 'Point', coordinates: [31.3167, 34.6167] } },
      { name: 'Kefar Yona', location: { type: 'Point', coordinates: [32.3171, 34.9358] } },
      { name: 'Al Buţayḩah', location: { type: 'Point', coordinates: [32.9087, 35.6320] } },
      { name: 'Al Khushnīyah', location: { type: 'Point', coordinates: [32.9994, 35.8108] } },
      { name: 'Fīq', location: { type: 'Point', coordinates: [32.7793, 35.7003] } },
    ];

    const collection = db.collection('cities');
    await collection.insertMany(cities);

    console.log('Event documents updated successfully');
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
}

createPopulateCitiesCollection().catch(console.error);