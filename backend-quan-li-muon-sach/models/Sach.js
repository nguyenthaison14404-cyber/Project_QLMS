const mongoose = require('mongoose');

const SachSchema = new mongoose.Schema({
  maSach: { 
    type: String, 
    required: [true, 'Mã sách không được để trống!'], 
    unique: true 
  },
  tenSach: { 
    type: String, 
    required: [true, 'Tên sách không được để trống!'] 
  },
  tacGia: { 
    type: String, 
    required: [true, 'Tác giả không được để trống!'] 
  },
  donGia: { 
    type: Number, 
    required: [true, 'Đơn giá không được để trống!'],
    min: [0, 'Đơn giá không được là số âm!'] 
  },
  soCuong: { 
    type: Number, 
    required: [true, 'Số cuốn không được để trống!'],
    min: [0, 'Số cuốn không được là số âm!'] 
  },
  namXuatBan: { 
    type: Number, 
    required: [true, 'Năm xuất bản không được để trống!'],
    min: [0, 'Năm xuất bản không được là số âm!'] 
  },
  maNXB: { 
    type: String, 
    required: [true, 'Mã NXB không được để trống!'] 
  }
}, { timestamps: true });

module.exports = mongoose.model('Sach', SachSchema);