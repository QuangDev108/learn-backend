const User = require("../../models/user.model");
const usersSocket = require("../../sockets/clients/users.socket");

// [GET] /users/not-friend
module.exports.notFriend = async (req, res) => {
    //Socket
    usersSocket(res);
    //End Socket

    const userId = res.locals.user.id;

    const myUser = await User.findOne({
        _id: userId
    });

    const requestFriends = myUser.requestFriends;
    const acceptFriends = myUser.acceptFriends;

    console.log(requestFriends);

    const users = await User.find({
        $and: [
            {_id: { $ne: userId } },
            {_id: { $nin: requestFriends }},
            {_id: { $nin: acceptFriends }},
        ],
        
        status: "active",
        deleted: false
    }).select("avatar fullName");

    console.log(users);

    res.render("client/pages/users/not-friend", {
        pageTitle: "Danh sách người dùng",
        users: users
    });
};