const mongoose = require('mongoose');

const docGiaSchema = new mongoose.Schema({
  maDocGia: { 
    type: String, 
    required: [true, 'Mã độc giả không được để trống!'], 
    unique: true 
  },
  hoLot: { 
    type: String, 
    required: [true, 'Họ lót không được để trống!'] 
  },
  ten: { 
    type: String, 
    required: [true, 'Tên không được để trống!'] 
  },
  ngaySinh: { 
    type: Date 
  },
  phai: { 
    type: String, 
    enum: ['Nam', 'Nữ', 'Khác'], 
    default: 'Khác' 
  },
  diaChi: { 
    type: String 
  },
  dienThoai: { 
    type: String,
    required: [true, 'Số điện thoại không được để trống!'],
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v); // Đúng 10 chữ số (0-9), không chứa bất kỳ ký tự nào khác
      },
      message: props => `${props.value} không hợp lệ! Số điện thoại phải bao gồm đúng 10 chữ số và không chứa ký tự đặc biệt.`
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('DocGia', docGiaSchema);