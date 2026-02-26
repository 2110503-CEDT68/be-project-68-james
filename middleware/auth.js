const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
exports.protect = async (req, res, next) => {
    let token;

    // 1. เช็คว่ามีการส่ง Token มาใน Header (ช่อง Authorization) ไหม?
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        // ถอดเอาเฉพาะตัว Token ออกมาจากคำว่า "Bearer <token>"
        token = req.headers.authorization.split(' ')[1];
    }

    // 2. ถ้าไม่มี Token ส่งมาเลย ให้เตะกลับไป
    if (!token|| token=='null') {
        return res.status(401).json({ 
            success: false, 
            msg: 'Not authorize to access this route' 
        });
    }

    try {
        // 3. แกะกล่อง Token ด้วยคีย์ลับของเรา (JWT_SECRET)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        console.log(decoded);

        // 4. เอา ID ที่แกะได้ไปค้นหา User ใน Database แล้วแปะไว้ที่ req.user
        req.user = await User.findById(decoded.id);

        // ให้ไปทำงานฟังก์ชันต่อไปได้ (เช่น getMe)
        next();
    } catch (err) {
        console.log(err.stack);
        return res.status(401).json({ 
            success: false, 
            msg: 'Not authorize to access this route' 
        });
    }
};
// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        // เช็คก่อนว่า req.user มีค่าไหม ป้องกันเซิร์ฟเวอร์พัง
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route (No user found)'
            });
        }

        // เช็คว่า Role ตรงกับที่กำหนดไว้ไหม (เช่น admin)
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role ${req.user.role} is not authorized to access this route`
            });
        }
        
        next();
    };
};