const Chat = require('../../models/chat.model');
const uploadToCloudinary = require('../../helpers/uploadToCloudinary');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('User kết nối (socket):', socket.id);

        socket.on('CLIENT_SEND_MESSAGE', async (data) => {
            try {
                console.log('Dữ liệu nhận được từ client:', {
                    content: data.content,
                    images_count: data.images ? data.images.length : 0,
                });

                const userId = data.userId;
                const fullName = data.fullName;
                const images = [];

                // Upload images lên Cloudinary (convert base64 → Buffer nếu cần)
                if (data.images && data.images.length > 0) {
                    for (const image of data.images) {
                        try {
                            let buffer;

                            if (typeof image === 'string') {
                                // Nếu là data URL: 'data:image/...;base64,AAA...'
                                if (image.indexOf(',') !== -1) {
                                    const base64Data = image.split(',')[1];
                                    buffer = Buffer.from(base64Data, 'base64');
                                } else {
                                    // Nếu chỉ là base64 string không có header
                                    buffer = Buffer.from(image, 'base64');
                                }
                            } else if (Buffer.isBuffer(image)) {
                                buffer = image;
                            } else {
                                throw new Error('Định dạng ảnh không hợp lệ');
                            }

                            const link = await uploadToCloudinary(buffer);
                            images.push(link);
                            console.log('Upload ảnh thành công:', link);
                        } catch (err) {
                            console.error('LỖI UPLOAD CLOUDINARY:', err.message || err);
                        }
                    }
                }

                console.log('Các ảnh sau khi upload:', images);

                // Lưu vào database
                const chat = new Chat({
                    user_id: userId,
                    room_chat_id: data.room_chat_id || 'general',
                    content: data.content,
                    images: images,
                });

                const result = await chat.save();
                console.log('✅ Lưu vào DB thành công:', result._id);

                // Gửi lại cho tất cả clients
                io.emit('SERVER_RETURN_MESSAGE', {
                    _id: result._id,
                    userId: userId,
                    fullName: fullName,
                    content: data.content,
                    images: images,
                    createdAt: result.createdAt,
                });
            } catch (error) {
                console.error('❌ LỖI KHI SAVE CHAT:', error.message || error);
                socket.emit('SERVER_ERROR', {
                    message: 'Lỗi lưu tin nhắn',
                    error: error.message || String(error),
                });
            }
        });

        socket.on('CLIENT_SEND_TYPING', (data) => {
            socket.broadcast.emit('SERVER_RETURN_TYPING', {
                userId: data.userId,
                fullName: data.fullName,
                type: data.type,
            });
        });

        socket.on('disconnect', () => {
            console.log('User ngắt kết nối (socket):', socket.id);
        });
    });
};