// [GET] /chat
module.exports.index = async (req, res) => {
    //Socket IO
    _io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);
    });
    //End Socket IO

    res.render("client/pages/chat/index", {
        pageTitle: "Chat",
    });
};