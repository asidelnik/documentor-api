import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.ATLAS_URI || '';
const client = new MongoClient(uri);

async function createPopulateCitiesCollection() {
  try {
    // Connect to the Atlas cluster - db - collection
    await client.connect();
    const db = client.db(process.env.DB_NAME);

    const schema = {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['name', 'lat', 'long'],
          properties: {
            name: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            lat: {
              bsonType: 'double',
              description: 'must be a double and is required'
            },
            long: {
              bsonType: 'double',
              description: 'must be a double and is required'
            }
          }
        }
      }
    };
    await db.createCollection('cities', schema);

    const cities = [
      { name: 'Tel Aviv - Yafo', lat: 32.0800, long: 34.7800 },
      { name: 'Jerusalem', lat: 31.7789, long: 35.2256 },
      { name: 'Haifa', lat: 32.8192, long: 34.9992 },
      { name: 'Rishon LeẔiyyon', lat: 31.9500, long: 34.8000 },
      { name: 'Petaẖ Tiqwa', lat: 32.0889, long: 34.8864 },
      { name: 'Ashdod', lat: 31.8000, long: 34.6500 },
      { name: 'Netanya', lat: 32.3286, long: 34.8567 },
      { name: 'Beersheba', lat: 31.2589, long: 34.7997 },
      { name: 'Holon', lat: 32.0167, long: 34.7667 },
      { name: 'Bené Beraq', lat: 32.0833, long: 34.8333 },
      { name: 'Ramat Gan', lat: 32.0700, long: 34.8236 },
      { name: 'Ashqelon', lat: 31.6667, long: 34.5667 },
      { name: 'Reẖovot', lat: 31.8969, long: 34.8167 },
      { name: 'Bat Yam', lat: 32.0167, long: 34.7500 },
      { name: 'Bet Shemesh', lat: 31.7456, long: 34.9867 },
      { name: 'Kefar Sava', lat: 32.1714, long: 34.9083 },
      { name: 'Modi‘in Makkabbim Re‘ut', lat: 31.9077, long: 35.0076 },
      { name: 'Hadera', lat: 32.4500, long: 34.9167 },
      { name: 'Herẕliyya', lat: 32.1653, long: 34.8458 },
      { name: 'Nazareth', lat: 32.7019, long: 35.3033 },
      { name: 'Lod', lat: 31.9519, long: 34.8881 },
      { name: 'Ramla', lat: 31.9275, long: 34.8625 },
      { name: 'Ra‘ananna', lat: 32.1833, long: 34.8667 },
      { name: 'Qiryat Gat', lat: 31.6061, long: 34.7717 },
      { name: 'Rahat', lat: 31.3925, long: 34.7544 },
      { name: 'Nahariyya', lat: 33.0058, long: 35.0989 },
      { name: 'Afula', lat: 32.6064, long: 35.2881 },
      { name: 'Givatayim', lat: 32.0714, long: 34.8100 },
      { name: 'Hod HaSharon', lat: 32.1500, long: 34.8833 },
      { name: 'Rosh Ha‘Ayin', lat: 32.0956, long: 34.9567 },
      { name: 'Qiryat Ata', lat: 32.8000, long: 35.1000 },
      { name: 'Umm el Faḥm', lat: 32.5194, long: 35.1536 },
      { name: 'Eilat', lat: 29.5569, long: 34.9517 },
      { name: 'Nes Ẕiyyona', lat: 31.9333, long: 34.8000 },
      { name: '‘Akko', lat: 32.9278, long: 35.0817 },
      { name: 'El‘ad', lat: 32.0522, long: 34.9511 },
      { name: 'Ramat HaSharon', lat: 32.1500, long: 34.8333 },
      { name: 'Karmiel', lat: 32.9136, long: 35.2961 },
      { name: 'Tiberias', lat: 32.7944, long: 35.5333 },
      { name: 'Eṭ Ṭaiyiba', lat: 32.2667, long: 35.0103 },
      { name: 'Ben Zakkay', lat: 31.8558, long: 34.7300 },
      { name: 'Pardés H̱anna Karkur', lat: 32.4711, long: 34.9675 },
      { name: 'Qiryat Moẕqin', lat: 32.8333, long: 35.0833 },
      { name: 'Qiryat Ono', lat: 32.0636, long: 34.8553 },
      { name: 'Shefar‘am', lat: 32.8056, long: 35.1694 },
      { name: 'Qiryat Bialik', lat: 32.8333, long: 35.0833 },
      { name: 'Qiryat Yam', lat: 32.8333, long: 35.0667 },
      { name: 'Or Yehuda', lat: 32.0306, long: 34.8533 },
      { name: 'Ẕefat', lat: 32.9658, long: 35.4983 },
      { name: 'Dimona', lat: 31.0667, long: 35.0333 },
      { name: 'Tamra', lat: 32.8536, long: 35.1978 },
      { name: 'Netivot', lat: 31.4167, long: 34.5833 },
      { name: 'Sakhnīn', lat: 32.8667, long: 35.3000 },
      { name: 'Be’er Ya‘aqov', lat: 31.9425, long: 34.8336 },
      { name: 'Yehud', lat: 32.0333, long: 34.8833 },
      { name: 'Ofaqim', lat: 31.3167, long: 34.6167 },
      { name: 'Kefar Yona', lat: 32.3171, long: 34.9358 },
      { name: 'Al Buţayḩah', lat: 32.9087, long: 35.6320 },
      { name: 'Al Khushnīyah', lat: 32.9994, long: 35.8108 },
      { name: 'Fīq', lat: 32.7793, long: 35.7003 },
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