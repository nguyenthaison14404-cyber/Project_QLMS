const mongoose = require('mongoose');

const nhanVienSchema = new mongoose.Schema({
    msnv: { 
        type: String, 
        required: [true, 'Mã số nhân viên không được để trống'], 
        unique: true,
        trim: true 
    },
    hoTenNV: { 
        type: String, 
        required: [true, 'Họ tên nhân viên không được để trống'],
        trim: true 
    },
    password: { 
        type: String, 
        required: [true, 'Mật khẩu không được để trống'] 
    },
    chucVu: { 
        type: String, 
        required: true,
        enum: {
            values: [
                'Quản lý thư viện',
                'Thủ thư ca sáng',
                'Thủ thư ca chiều',
                'Thủ thư ca tối',
                'Nhân viên kho'
            ],
            message: 'Chức vụ {VALUE} không hợp lệ'
        },
        default: 'Thủ thư ca sáng' 
    },
    diaChi: { 
        type: String, 
        default: '',
        trim: true 
    },
    soDienThoai: { 
        type: String, 
        required: [true, 'Số điện thoại không được để trống'],
        match: [/^0[0-9]{9}$/, 'Số điện thoại phải gồm đúng 10 chữ số và bắt đầu bằng số 0']
    }
}, { timestamps: true });

module.exports = mongoose.model('NhanVien', nhanVienSchema);