const DocGia = require('../models/DocGia');

// Hàm kiểm tra định dạng số điện thoại (đúng 10 chữ số, không chứa ký tự khác)
const validatePhone = (phone) => {
    if (!phone) return 'Số điện thoại không được để trống!';
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
        return 'Số điện thoại không hợp lệ! Phải gồm đúng 10 chữ số và không chứa chữ cái hay ký tự đặc biệt.';
    }
    return null;
};

// Lấy danh sách độc giả
exports.getAll = async (req, res) => {
    try {
        const list = await DocGia.find();
        res.status(200).json(list);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Tạo mới độc giả (Hỗ trợ cả 1 đối tượng {} hoặc 1 mảng [])
exports.create = async (req, res) => {
    try {
        const dataList = Array.isArray(req.body) ? req.body : [req.body];

        // RÀNG BUỘC: Kiểm tra số điện thoại từng mục trước khi lưu
        for (const item of dataList) {
            const phone = item.dienThoai || item.DienThoai;
            const error = validatePhone(phone);
            if (error) {
                return res.status(400).json({ message: error });
            }
        }

        if (Array.isArray(req.body)) {
            const result = await DocGia.insertMany(req.body);
            return res.status(201).json(result);
        }

        const newDocGia = new DocGia(req.body);
        await newDocGia.save();
        res.status(201).json(newDocGia);
    } catch (err) {
        // BẮT LỖI TRÙNG MÃ (E11000) TỪ MONGODB
        if (err.code === 11000) {
            // Lấy giá trị mã bị trùng (ví dụ: "DG01")
            const duplicateValue = err.keyValue ? Object.values(err.keyValue)[0] : '';
            const message = duplicateValue
                ? `Mã độc giả "${duplicateValue}" đã tồn tại trong hệ thống!`
                : "Mã độc giả đã tồn tại trong hệ thống!";
            return res.status(400).json({ message });
        }

        res.status(400).json({ message: err.message });
    }
};

// Cập nhật thông tin độc giả
exports.update = async (req, res) => {
    try {
        const phone = req.body.dienThoai || req.body.DienThoai;
        if (phone !== undefined) {
            const error = validatePhone(phone);
            if (error) {
                return res.status(400).json({ message: error });
            }
        }

        const updated = await DocGia.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { 
                returnDocument: 'after', // Sửa warning { new: true }
                runValidators: true      // Bắt buộc chạy Validation từ Schema khi Update
            }
        );

        if (!updated) {
            return res.status(404).json({ message: 'Không tìm thấy độc giả!' });
        }

        res.status(200).json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Xóa độc giả
exports.delete = async (req, res) => {
    try {
        const deleted = await DocGia.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Không tìm thấy độc giả để xóa!' });
        }
        res.status(200).json({ message: 'Đã xóa độc giả thành công!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};