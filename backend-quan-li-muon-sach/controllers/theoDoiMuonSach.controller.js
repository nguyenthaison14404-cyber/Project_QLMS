const TheoDoiMuonSach = require('../models/TheoDoiMuonSach');
const Sach = require('../models/Sach');

// Lấy danh sách phiếu mượn
exports.getAll = async (req, res) => {
    try {
        const list = await TheoDoiMuonSach.find();
        res.status(200).json(list);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Mượn sách (Tạo mới phiếu mượn + Giảm số cuốn kho sách)
exports.muonSach = async (req, res) => {
    try {
        const now = new Date();

        if (Array.isArray(req.body)) {
            for (const item of req.body) {
                const maSach = item.maSach || item.MaSach;
                const ngayMuon = item.ngayMuon ? new Date(item.ngayMuon) : now;

                if (ngayMuon > now) {
                    return res.status(400).json({ message: `Lỗi: Ngày mượn sách (${maSach}) không được vượt quá thời gian hiện tại!` });
                }

                const sach = await Sach.findOne({ $or: [{ maSach: maSach }, { MaSach: maSach }] });
                if (!sach) {
                    return res.status(404).json({ message: `Mã sách "${maSach}" không tồn tại trong kho!` });
                }

                const stock = sach.soCuong !== undefined ? sach.soCuong : (sach.soCuon !== undefined ? sach.soCuon : sach.SoCuon);
                if (stock <= 0) {
                    return res.status(400).json({ message: `Sách "${sach.tenSach || sach.TenSach}" này đã hết, không mượn được!` });
                }
            }

            const listData = [];
            for (const item of req.body) {
                const maSach = item.maSach || item.MaSach;
                listData.push({
                    maDocGia: item.maDocGia || item.MaDocGia,
                    maSach: maSach,
                    ngayMuon: item.ngayMuon || item.NgayMuon || now,
                    ngayTra: item.ngayTra || item.NgayTra || null
                });

                await Sach.updateOne(
                    { $or: [{ maSach: maSach }, { MaSach: maSach }] },
                    { $inc: { soCuong: -1, soCuon: -1, SoCuon: -1 } }
                );
            }

            const result = await TheoDoiMuonSach.insertMany(listData);
            return res.status(201).json(result);
        }

        const maDocGia = req.body.maDocGia || req.body.MaDocGia;
        const maSach = req.body.maSach || req.body.MaSach;
        const ngayMuonInput = req.body.ngayMuon || req.body.NgayMuon;
        const ngayMuon = ngayMuonInput ? new Date(ngayMuonInput) : now;

        if (ngayMuon > now) {
            return res.status(400).json({ message: 'Lỗi: Ngày mượn không được vượt quá thời gian hiện tại!' });
        }

        const sach = await Sach.findOne({ $or: [{ maSach: maSach }, { MaSach: maSach }] });
        if (!sach) {
            return res.status(404).json({ message: `Mã sách "${maSach}" không tồn tại trong kho!` });
        }

        const stock = sach.soCuong !== undefined ? sach.soCuong : (sach.soCuon !== undefined ? sach.soCuon : sach.SoCuon);
        if (stock <= 0) {
            return res.status(400).json({ message: `Sách "${sach.tenSach || sach.TenSach}" này đã hết, không mượn được!` });
        }

        const newPhieu = new TheoDoiMuonSach({
            maDocGia: maDocGia,
            maSach: maSach,
            ngayMuon: ngayMuon,
            ngayTra: req.body.ngayTra || req.body.NgayTra || null
        });

        await newPhieu.save();

        await Sach.updateOne(
            { $or: [{ maSach: maSach }, { MaSach: maSach }] },
            { $inc: { soCuong: -1, soCuon: -1, SoCuon: -1 } }
        );

        res.status(201).json(newPhieu);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Trả sách: Kiểm tra ngày & Tăng lại số cuốn vào kho
exports.traSach = async (req, res) => {
    try {
        const { id } = req.params;
        const now = new Date();

        const phieu = await TheoDoiMuonSach.findById(id);
        if (!phieu) {
            return res.status(404).json({ message: 'Không tìm thấy phiếu mượn!' });
        }

        if (phieu.ngayTra) {
            return res.status(400).json({ message: 'Sách này đã được trả trước đó!' });
        }

        const ngayTraInput = req.body.ngayTra || req.body.NgayTra;
        const ngayTraCapNhat = ngayTraInput ? new Date(ngayTraInput) : now;

        if (ngayTraCapNhat > now) {
            return res.status(400).json({ message: 'Lỗi: Ngày trả không được vượt quá thời gian hiện tại!' });
        }

        const ngayMuon = new Date(phieu.ngayMuon || phieu.NgayMuon);
        if (ngayTraCapNhat <= ngayMuon) {
            return res.status(400).json({ message: 'Lỗi: Ngày trả phải lớn hơn ngày mượn sách!' });
        }

        const result = await TheoDoiMuonSach.findByIdAndUpdate(
            id,
            { 
                ngayTra: ngayTraCapNhat,
                NgayTra: ngayTraCapNhat
            },
            { returnDocument: 'after' }
        );

        const maSach = phieu.maSach || phieu.MaSach;
        await Sach.updateOne(
            { $or: [{ maSach: maSach }, { MaSach: maSach }] },
            { $inc: { soCuong: 1, soCuon: 1, SoCuon: 1 } }
        );

        res.status(200).json({ message: 'Đã trả sách thành công!', data: result });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi khi cập nhật trả sách: ' + err.message });
    }
};

// Xóa phiếu mượn sách
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const phieu = await TheoDoiMuonSach.findById(id);
        
        if (!phieu) {
            return res.status(404).json({ message: 'Không tìm thấy phiếu mượn để xóa!' });
        }

        // Nếu xóa phiếu chưa được trả, hoàn trả lại 1 cuốn vào kho sách
        if (!phieu.ngayTra && !phieu.NgayTra) {
            const maSach = phieu.maSach || phieu.MaSach;
            await Sach.updateOne(
                { $or: [{ maSach: maSach }, { MaSach: maSach }] },
                { $inc: { soCuong: 1, soCuon: 1, SoCuon: 1 } }
            );
        }

        await TheoDoiMuonSach.findByIdAndDelete(id);
        res.status(200).json({ message: 'Đã xóa phiếu mượn thành công!' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi khi xóa phiếu mượn: ' + err.message });
    }
};