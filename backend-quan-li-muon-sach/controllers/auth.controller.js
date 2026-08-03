const NhanVien = require('../models/NhanVien');

exports.login = async (req, res) => {
    try {
        const { msnv, password } = req.body;

        // Tìm nhân viên theo MSNV và Password
        const user = await NhanVien.findOne({ msnv, password });
        if (!user) {
            return res.status(400).json({ message: 'Mã nhân viên hoặc mật khẩu không đúng!' });
        }

        // Kiểm tra quyền Admin (Ví dụ: Chức vụ chứa chữ "Quản lý" hoặc "Admin")
        const isAdmin = user.chucVu.toLowerCase().includes('quản lý') || 
                        user.chucVu.toLowerCase().includes('admin');

        // Trả về thông tin đăng nhập
        res.status(200).json({
            _id: user._id,
            msnv: user.msnv,
            hoTenNV: user.hoTenNV,
            chucVu: user.chucVu,
            isAdmin: isAdmin
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};