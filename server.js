const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db'); 
const mongoSanitize=require('express-mongo-sanitize');
const helmet=require('helmet');
const {xss}=require('express-xss-sanitizer');
const rateLimit=require('express-rate-limit');
const hpp=require('hpp');
const cors=require('cors');

// นำเข้า Swagger
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB(); 

// --- [ 1. ดึงเฉพาะไฟล์ Auth Router เข้ามา ] ---
// ❌ ปิด coworkings และ reservations ชั่วคราว
const coworkings = require('./routes/coworkings');
const reservations = require('./routes/reservations');
const auth = require('./routes/auth'); // ✅ เปิดไว้แค่ Auth

// สร้าง app ก่อน ค่อยเรียกใช้ app.use()
const app = express();
app.use(hpp());
app.use(cors());

// Body parser
app.use(express.json());
app.use(mongoSanitize());
// Cookie parser
app.use(cookieParser());
app.use(helmet());
app.use(xss()); 

// Rate Limiter
const limiter=rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 100
});
app.use(limiter); 

// --- [ ส่วนของ Swagger API Documentation ] ---
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Authentication API', // เปลี่ยนชื่อนิดหน่อยให้ตรงกับงาน
      version: '1.0.0',
      description: 'API for User Authentication'
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1'
      }
    ]
  },
  // เปลี่ยนให้ Swagger ไปอ่านแค่ไฟล์ auth.js ไฟล์เดียว
  apis: ['./routes/auth.js'], 
};

const swaggerDocs=swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));
// ---------------------------------------------

// --- [ 2. เรียกใช้งาน Router ] ---
// ❌ ปิดการเรียกใช้งาน coworkings และ reservations
 app.use('/api/v1/coworkings', coworkings);
 app.use('/api/v1/reservations', reservations);
app.use('/api/v1/auth', auth); // ✅ เปิดใช้งานแค่ Auth

const PORT = process.env.PORT || 5000;

// เอาตัวแปร server มารับค่าเอาไว้
const server = app.listen(
    PORT, 
    console.log('Server running in ', process.env.NODE_ENV, ' mode on port ', PORT)
);

// Handle unhandled promise rejections (ดักจับ Error)
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});