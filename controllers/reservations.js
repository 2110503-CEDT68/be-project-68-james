// controllers/reservations.js
const Reservation = require('../models/Reservation');
const Coworking = require('../models/Coworking');

//@desc    Get all reservations
//@route   GET /api/v1/reservations
//@access  Private
exports.getReservations = async (req, res, next) => {
  let query;

  if (req.user.role !== "admin") { 
    // Requirement #4: General users can view their reservations
    query = Reservation.find({ user: req.user.id }).populate({
      path: 'coworking',
      select: 'name address telephone openTime closeTime'
    });
  } else { 
    // Requirement #7: Admin can view any reservations
    if (req.params.coworkingId) {
      query = Reservation.find({ coworking: req.params.coworkingId }).populate({
        path: 'coworking',
        select: "name address telephone openTime closeTime"
      });
    } else {
      query = Reservation.find().populate({
        path: 'coworking',
        select: 'name address telephone openTime closeTime'
      });
    }
  }

  try {
    const reservations = await query;
    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Cannot find Reservation"
    });
  }
}; 

//@desc    Get single reservation
//@route   GET /api/v1/reservations/:id
//@access  Private
exports.getReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id).populate({
        path: 'coworking',
        select: 'name address telephone openTime closeTime'
      });

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: `No reservation with the id of ${req.params.id}`
      });
    }

    // ดักไว้: ถ้าเป็น User ธรรมดา ต้องดูได้แค่ของตัวเอง
    if (reservation.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to view this reservation`
      });
    }

    res.status(200).json({
      success: true,
      data: reservation
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Cannot find Reservation"
    });
  }
};

//@desc    Add reservation
//@route   POST /api/v1/coworkings/:coworkingId/reservations
//@access  Private
exports.addReservation = async (req, res, next) => {
    try {
        // 1. สำคัญมาก! ต้องระบุว่า "ใคร" เป็นคนจอง และจอง "ตึกไหน"
        req.body.coworking = req.params.coworkingId; 
        req.body.user = req.user.id; // 👈 ถ้าบรรทัดนี้หายไป ระบบจะนับโควต้าไม่ได้ครับ!

        // 2. ค้นหาว่า User คนนี้จองไปแล้วกี่ที่
        const existedReservations = await Reservation.find({ user: req.user.id });

        // 3. ดักจับโควต้า: ถ้าจองครบ 3 ครั้งแล้ว และไม่ใช่ admin ให้เตะออก
        if (existedReservations.length >= 3 && req.user.role !== 'admin') {
            return res.status(400).json({
                success: false,
                message: `The user with ID ${req.user.id} has already made 3 reservations`
            }); // 👈 อย่าลืมใส่คำว่า return ข้างหน้า res.status นะครับ ไม่งั้นโค้ดมันจะไหลไปสร้างการจองต่อ
        }

        // 4. ถ้ามีไม่ถึง 3 ครั้ง ถึงจะอนุญาตให้สร้างลง Database ได้
        const reservation = await Reservation.create(req.body);

        res.status(201).json({
            success: true,
            data: reservation
        });

    } catch (err) {
        console.log(err.stack);
        res.status(500).json({
            success: false,
            message: "Cannot create Reservation"
        });
    }
};

//@desc     Update reservation
//@route    PUT /api/v1/reservations/:id
//@access   Private
exports.updateReservation = async (req, res, next) => {
  try {
    let reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: `No reservation with the id of ${req.params.id}`
      });
    }

    // Requirement #5 & #8: User edit their own, Admin edit any
    if (reservation.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update this reservation`
      });
    }

    reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: reservation
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Cannot update Reservation"
    });
  }
};

//@desc     Delete reservation
//@route    DELETE /api/v1/reservations/:id
//@access   Private
exports.deleteReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: `No reservation with the id of ${req.params.id}`
      });
    }

    // Requirement #6 & #9: User delete their own, Admin delete any
    if (reservation.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to delete this reservation`
      });
    }

    await reservation.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Cannot delete Reservation"
    });
  }
};