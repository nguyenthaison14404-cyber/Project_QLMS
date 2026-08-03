const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Kết nối CSDL MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/quan_ly_muon_sach')
    .then(() => console.log('✅ Kết nối MongoDB thành công!'))
    .catch(err => console.error('❌ Lỗi kết nối MongoDB:', err));

// Khai báo các Route API
app.use('/api/nxb', require('./routes/nhaXuatBan.route'));
app.use('/api/docgia', require('./routes/docGia.route'));
app.use('/api/sach', require('./routes/sach.route'));
app.use('/api/muonsach', require('./routes/theoDoiMuonSach.route'));
app.use('/api/nhanvien', require('./routes/nhanVien.route'));
app.use('/api/auth', require('./routes/auth.route'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});