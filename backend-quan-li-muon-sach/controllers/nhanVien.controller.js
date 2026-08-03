const NhanVien = require('../models/NhanVien');

// Lấy danh sách nhân viên
exports.getAll = async (req, res) => {
    try {
        const list = await NhanVien.find();
        res.status(200).json(list);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Thêm mới (hỗ trợ cả 1 NV hoặc mảng nhiều NV từ Postman)
exports.create = async (req, res) => {
    try {
        if (Array.isArray(req.body)) {
            const listData = req.body.map(item => ({
                msnv: item.msnv || item.MSNV,
                hoTenNV: item.hoTenNV || item.HoTenNV,
                password: item.password || item.Password || '123456',
                chucVu: item.chucVu || item.ChucVu || 'Thủ thư ca sáng',
                diaChi: item.diaChi || item.DiaChi || '',
                soDienThoai: item.soDienThoai || item.SoDienThoai || ''
            }));
            const result = await NhanVien.insertMany(listData);
            return res.status(201).json(result);
        }

        const newNV = new NhanVien({
            msnv: req.body.msnv,
            hoTenNV: req.body.hoTenNV,
            password: req.body.password || '123456',
            chucVu: req.body.chucVu || 'Thủ thư ca sáng',
            diaChi: req.body.diaChi || '',
            soDienThoai: req.body.soDienThoai || ''
        });
        await newNV.save();
        res.status(201).json(newNV);
    } catch (err) {
        // Bắt lỗi trùng khóa (Duplicate Key Error - Code 11000)
        if (err.code === 11000) {
            const duplicatedVal = err.keyValue?.msnv || req.body?.msnv || '';
            return res.status(400).json({ 
                message: `Mã nhân viên "${duplicatedVal}" đã tồn tại trong hệ thống!` 
            });
        }

        res.status(400).json({ message: err.message });
    }
};

// Cập nhật nhân viên
exports.update = async (req, res) => {
    try {
        const updated = await NhanVien.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { returnDocument: 'after', runValidators: true }
        );

        if (!updated) {
            return res.status(404).json({ message: 'Không tìm thấy nhân viên!' });
        }

        res.status(200).json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Xóa nhân viên
exports.delete = async (req, res) => {
    try {
        const deleted = await NhanVien.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Không tìm thấy nhân viên!' });
        }
        res.status(200).json({ message: 'Xóa nhân viên thành công!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};