const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
    date: { // เปลี่ยนจาก apptDate เป็น date ให้ตรงกับ Requirement ข้อ 3
        type: Date,
        required: [true, 'Please add a reservation date']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    coworking: { // เปลี่ยนจาก hospital เป็น coworking 
        type: mongoose.Schema.ObjectId,
        ref: 'Coworking', // ต้องชี้ไปที่โมเดล Coworking ที่เราเพิ่งสร้าง
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
    
});


module.exports = mongoose.model('Reservation', ReservationSchema);