const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const moment = require('moment');
const http = require("http");
const { Server } = require("socket.io");
dotenv.config();

const db = require('./config/database');
db.connect();

const systemConfig = require('./config/system');

const routeAdmin = require(`./routes/admin/index.router`);
const routes = require('./routes/client/index.route');

const Chat = require('./models/chat.model');
const uploadToCloudinary = require('./helpers/uploadToCloudinary');

const app = express();
const port = process.env.PORT;

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');

//SocketIO
const server = http.createServer(app); 
const io = new Server(server, {
    maxHttpBufferSize: 50 * 1024 * 1024, // 50MB
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
global._io = io;

// Socket.IO Chat Handler
io.on("connection", (socket) => {
    socket.on("CLIENT_SEND_MESSAGE", async (data) => {
        try {
            const userId = data.userId;
            const fullName = data.fullName;
            let images = [];

            // Upload images lên Cloudinary
            if (data.images && data.images.length > 0) {
                for (const image of data.images) {
                    try {
                        // Convert base64 string to Buffer
                        const base64Data = image.split(',')[1];
                        const buffer = Buffer.from(base64Data, 'base64');
                        
                        const link = await uploadToCloudinary(buffer);
                        images.push(link);
                    } catch (error) {
                        console.error("LỖI UPLOAD CLOUDINARY:", error.message);
                    }
                }
            }

            // Lưu vào database
            const chat = new Chat({
                user_id: userId,
                room_chat_id: data.room_chat_id || "general",
                content: data.content,
                images: images
            });

            const result = await chat.save();

            // Gửi lại cho tất cả clients
            io.emit("SERVER_RETURN_MESSAGE", {
                _id: result._id,
                userId: userId,
                fullName: fullName,
                content: data.content,
                images: images,
                createdAt: result.createdAt
            });
        } catch (error) {
            console.error("❌ LỖI KHI SAVE CHAT:", error.message);
            socket.emit("SERVER_ERROR", {
                message: "Lỗi lưu tin nhắn",
                error: error.message
            });
        }
    });

    socket.on("CLIENT_SEND_TYPING", (data) => {
        socket.broadcast.emit("SERVER_RETURN_TYPING", {
            userId: data.userId,
            fullName: data.fullName,
            type: data.type
        });
    });

    socket.on("disconnect", () => {
        console.log("User ngắt kết nối:", socket.id);
    });
});
//End SocketIO


//Flash
app.use(cookieParser('ABCDEFGHIJKLMNOPQRSTUVWXYZ'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
//End flash

//TinyMCE
app.use('/tinymce', express.static(`${__dirname}/node_modules/tinymce`));

app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;

app.use(express.static(`${__dirname}/public`));

//Routes
routeAdmin(app);
routes(app);
app.use((req, res) => {
    res.status(404).render("client/pages/errors/404", {
        pageTitle: "404 Not Found",
    });
});

server.listen(port, () => {  
  console.log(`Server đang chạy tại http://localhost:${port}`);
});