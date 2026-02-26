const mongoose = require('mongoose');

const CoworkingSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'],
            unique: true,
            trim: true,
            maxlength: [100, 'Name can not be more than 100 characters']
        },
        address: {
            type: String,
            required: [true, 'Please add an address']
        },
        telephone: {
            type: String,
            required: [true, 'Please add a telephone number']
        },
        openTime: {
            type: String,
            required: [true, 'Please add an open time (e.g., 08:00)']
        },
        closeTime: {
            type: String,
            required: [true, 'Please add a close time (e.g., 20:00)']
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// 🔥 Reverse populate (Coworking → Reservations)
// เปลี่ยนจาก appointments เป็น reservations เพื่อให้ตรงกับระบบจองห้อง
CoworkingSchema.virtual('reservations', {
    ref: 'Reservation', // ต้องตรงกับชื่อ Model ในไฟล์ Reservation.js
    localField: '_id',       
    foreignField: 'coworking', // บอกว่าในไฟล์ Reservation จะอ้างอิงกลับมาหาไฟล์นี้ด้วยคำว่า 'coworking'
    justOne: false
});

// 🟢 เพิ่ม Middleware: ถ้า Admin สั่งลบ Coworking Space นี้ทิ้ง ให้ไปลบ "ข้อมูลการจอง (Reservations)" ของห้องนี้ทิ้งด้วย 
// (จะได้ไม่มีข้อมูลขยะค้างในระบบ)
CoworkingSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    console.log(`Reservations being removed from coworking ${this._id}`);
    await this.model('Reservation').deleteMany({ coworking: this._id });
    next();
});

module.exports = mongoose.model('Coworking', CoworkingSchema);