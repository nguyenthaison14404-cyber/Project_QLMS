const NhaXuatBan = require('../models/NhaXuatBan');

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
        await NhaXuatBan.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Đã xóa NXB thành công!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};