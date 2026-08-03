const Sach = require('../models/Sach');

// Hàm kiểm tra các trường số không được âm
const validateSachData = (item) => {
    const donGia = item.donGia !== undefined ? item.donGia : item.DonGia;
    const soCuong = item.soCuong !== undefined ? item.soCuong : item.SoCuong;
    const namXuatBan = item.namXuatBan !== undefined ? item.namXuatBan : item.NamXuatBan;

    if (donGia !== undefined && donGia < 0) return 'Đơn giá không được là số âm!';
    if (soCuong !== undefined && soCuong < 0) return 'Số cuốn không được là số âm!';
    if (namXuatBan !== undefined && namXuatBan < 0) return 'Năm xuất bản không được là số âm!';
    return null;
};

// Lấy danh sách sách
exports.getAll = async (req, res) => {
    try {
        const list = await Sach.find();
        res.status(200).json(list);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Tạo mới sách (Hỗ trợ cả 1 đối tượng {} hoặc 1 Mảng [])
exports.create = async (req, res) => {
    try {
        const dataList = Array.isArray(req.body) ? req.body : [req.body];

        // RÀNG BUỘC: Kiểm tra không cho phép số âm trước khi lưu
        for (const item of dataList) {
            const error = validateSachData(item);
            if (error) {
                return res.status(400).json({ message: error });
            }
        }

        const newSach = await Sach.insertMany(req.body);
        res.status(201).json(newSach);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Cập nhật thông tin sách
exports.update = async (req, res) => {
    try {
        // RÀNG BUỘC: Kiểm tra số âm khi cập nhật
        const error = validateSachData(req.body);
        if (error) {
            return res.status(400).json({ message: error });
        }

        const updated = await Sach.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { 
                returnDocument: 'after', // Sửa warning { new: true }
                runValidators: true      // Ép Mongoose chạy kiểm tra Validation từ Schema
            }
        );

        if (!updated) {
            return res.status(404).json({ message: 'Không tìm thấy sách!' });
        }

        res.status(200).json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Xóa sách
exports.delete = async (req, res) => {
    try {
        const deleted = await Sach.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Không tìm thấy sách để xóa!' });
        }
        res.status(200).json({ message: 'Đã xóa sách thành công!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};