const NhaXuatBan = require('../models/NhaXuatBan');
const Sach = require('../models/Sach'); // Import thêm Model Sach để kiểm tra ràng buộc

exports.getAll = async (req, res) => {
    try {
        const data = await NhaXuatBan.find();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const newItem = new NhaXuatBan(req.body);
        await newItem.save();
        res.status(201).json(newItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const updated = await NhaXuatBan.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        // 1. Tìm thông tin Nhà xuất bản cần xóa
        const nxb = await NhaXuatBan.findById(req.params.id);
        if (!nxb) {
            return res.status(404).json({ message: 'Không tìm thấy Nhà xuất bản!' });
        }

        // 2. Kiểm tra xem có sách nào trong kho đang liên kết với NXB này không
        const hasBook = await Sach.findOne({
            $or: [
                { maNXB: nxb.maNXB },
                { maNXB: nxb._id },
                { maNXB: req.params.id }
            ]
        });

        if (hasBook) {
            return res.status(400).json({ 
                message: 'Không thể xóa Nhà xuất bản do đã có sách thuộc NXB này trong kho!' 
            });
        }

        // 3. Tiến hành xóa nếu không có ràng buộc
        await NhaXuatBan.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Đã xóa NXB thành công!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};