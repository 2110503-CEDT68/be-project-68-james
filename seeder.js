const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Coworking = require('./models/Coworking');

dotenv.config({ path: './config/config.env' });

mongoose.connect(process.env.MONGO_URI);

const coworkings = [
  {
    "name": "True Digital Park West",
    "address": "101 Sukhumvit Road, Bang Chak, Phra Khanong, Bangkok 10260",
    "telephone": "02-009-1101",
    "openTime": "09:00",
    "closeTime": "18:00"
  },
  {
    "name": "JustCo Silom Edge",
    "address": "2 Silom Rd, Suriya Wong, Bang Rak, Bangkok 10500",
    "telephone": "02-055-8606",
    "openTime": "08:30",
    "closeTime": "18:00"
  },
  {
    "name": "HUBBA Habbito",
    "address": "45/3 Sukhumvit 71 Rd, Phra Khanong Nuea, Watthana, Bangkok 10110",
    "telephone": "02-118-0839",
    "openTime": "09:00",
    "closeTime": "17:00"
  },
  {
    "name": "NapLab Wangmai",
    "address": "759 Soi Chulalongkorn 6, Wang Mai, Pathum Wan, Bangkok 10330",
    "telephone": "095-951-9523",
    "openTime": "00:00",
    "closeTime": "23:59"
  },
  {
    "name": "KLOUD by KBank",
    "address": "Siam Square Soi 7, Pathum Wan, Bangkok 10330",
    "telephone": "02-273-1144",
    "openTime": "10:00",
    "closeTime": "20:00"
  },
  {
    "name": "The Work Loft Silom",
    "address": "1 Chaloem Khet 1 Soi, Silom, Bang Rak, Bangkok 10500",
    "telephone": "02-631-1662",
    "openTime": "08:00",
    "closeTime": "20:00"
  },
  {
    "name": "Draft Board Chidlom",
    "address": "Orakarn Building, 12th Floor, Chidlom, Bangkok 10330",
    "telephone": "02-655-7640",
    "openTime": "09:30",
    "closeTime": "18:30"
  },
  {
    "name": "Common Ground G Tower",
    "address": "9 Rama IX Rd, Huai Khwang, Bangkok 10310",
    "telephone": "02-026-3200",
    "openTime": "09:00",
    "closeTime": "18:00"
  },
  {
    "name": "The Hive Thonglor",
    "address": "46/9 Soi Sukhumvit 49, Khlong Tan Nuea, Watthana, Bangkok 10110",
    "telephone": "02-662-6062",
    "openTime": "08:00",
    "closeTime": "20:00"
  },
  {
    "name": "Spaces Phayathai",
    "address": "128 Phaya Thai Rd, Thanon Phetchaburi, Ratchathewi, Bangkok 10400",
    "telephone": "02-026-0635",
    "openTime": "08:30",
    "closeTime": "18:00"
  },
  {
    "name": "WorkWize (The Street Ratchada)",
    "address": "139 Ratchadaphisek Rd, Din Daeng, Bangkok 10400",
    "telephone": "02-121-1111",
    "openTime": "09:00",
    "closeTime": "20:00"
  },
  {
    "name": "The Great Room (Park Silom)",
    "address": "1 Convent Rd, Silom, Bang Rak, Bangkok 10500",
    "telephone": "02-073-0222",
    "openTime": "09:00",
    "closeTime": "18:00"
  },
  {
    "name": "Pencave Co-working Space",
    "address": "Naiipa Art Complex, 46 Sukhumvit 46, Phra Khanong, Bangkok 10110",
    "telephone": "062-554-4348",
    "openTime": "09:00",
    "closeTime": "18:00"
  },
  {
    "name": "Maven Mesh",
    "address": "29 Ladprao Soi 23, Chankasem, Chatuchak, Bangkok 10900",
    "telephone": "02-938-1234",
    "openTime": "09:00",
    "closeTime": "19:00"
  },
  {
    "name": "Monstar Hub (Asoke)",
    "address": "18 Ratchadaphisek Rd, Khlong Toei, Bangkok 10110",
    "telephone": "02-114-7890",
    "openTime": "08:30",
    "closeTime": "21:00"
  },
  {
    "name": "Growth Cafe & Co.",
    "address": "Siam Square Soi 2, Pathum Wan, Bangkok 10330",
    "telephone": "095-991-4569",
    "openTime": "09:00",
    "closeTime": "22:00"
  },
  {
    "name": "WOTSO Thailand",
    "address": "Summer Hill, Phra Khanong, Khlong Toei, Bangkok 10110",
    "telephone": "02-017-0200",
    "openTime": "09:00",
    "closeTime": "18:00"
  },
  {
    "name": "Klique Desk",
    "address": "942/144 Rama IV Rd, Suriya Wong, Bang Rak, Bangkok 10500",
    "telephone": "02-105-4655",
    "openTime": "09:00",
    "closeTime": "19:00"
  },
  {
    "name": "Too Fast To Sleep (SCB Business Center)",
    "address": "Siam Square Soi 1, Pathum Wan, Bangkok 10330",
    "telephone": "081-899-1122",
    "openTime": "10:00",
    "closeTime": "20:00"
  },
  {
    "name": "TDPK Co-working Space (East)",
    "address": "101 Sukhumvit Rd, Bang Chak, Phra Khanong, Bangkok 10260",
    "telephone": "02-009-1100",
    "openTime": "09:00",
    "closeTime": "18:00"
  }
];
const importData = async () => {
  try {
    await Coworking.deleteMany();
    await Coworking.insertMany(coworkings);

    console.log('Data Imported!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

importData();