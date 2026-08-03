const mongoose = require('mongoose');

const theoDoiMuonSachSchema = new mongoose.Schema({
  maDocGia: { 
    type: String, 
    required: [true, 'Mã độc giả không được để trống!'] 
  },
  maSach: { 
    type: String, 
    required: [true, 'Mã sách không được để trống!'] 
  },
  ngayMuon: { 
    type: Date, 
    required: [true, 'Ngày mượn không được để trống!'],
    default: Date.now 
  },
  ngayTra: { 
    type: Date, 
    default: null,
    validate: {
      validator: function(v) {
        if (!v) return true; // Cho phép null nếu sách chưa được trả
        return new Date(v) >= new Date(this.ngayMuon);
      },
      message: 'Ngày trả không thể diễn ra trước ngày mượn sách!'
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('TheoDoiMuonSach', theoDoiMuonSachSchema);