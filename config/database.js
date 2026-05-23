const mongoose = require('mongoose');

module.exports.connect = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Kết nối MongoDB thành công');
    } catch (error) {
        console.error('Lỗi kết nối MongoDB:', error);
    }
}