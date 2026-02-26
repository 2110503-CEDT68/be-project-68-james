const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB(); 

// --- [ 1. ดึงไฟล์ Router เข้ามาเก็บในตัวแปร (ต้องทำก่อน) ] ---
const hospitals = require('./routes/hospitals');
const appointments = require('./routes/appointments');
const auth = require('./routes/auth');

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
app.use(xss()); // ย้ายขึ้นมาไว้ตรงนี้ก่อนเข้า Router

// Rate Limiter
const limiter=rateLimit({
windowMs:10*60*1000,//10 mins (แก้จาก windowsMs เป็น windowMs)
max: 100
});
app.use(limiter); // ย้ายมาเรียกใช้หลังจากสร้าง app แล้ว และก่อนเข้า Router

// --- [ ส่วนของ Swagger API Documentation ] ---
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Library API',
      version: '1.0.0',
      description: 'A simple Express VacQ API'
    },
    servers: [
      {
        url: 'http://localhost:5050/api/v1'
      }
    ]
  },
  apis: ['./routes/*.js'],
};

const swaggerDocs=swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));
// ---------------------------------------------

// --- [ 2. เรียกใช้งาน Router (ดึงตัวแปรจากข้อ 1 มาใช้) ] ---
app.use('/api/v1/hospitals', hospitals);
app.use('/api/v1/appointments', appointments); 
app.use('/api/v1/auth', auth);

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