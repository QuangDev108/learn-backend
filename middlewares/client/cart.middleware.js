const Cart = require("../../models/cart.model");

module.exports.cartId = async (req, res, next) => {
    let cart = null;

    if (req.cookies.cartId) {
        cart = await Cart.findOne({
            _id: req.cookies.cartId
        });
    }

    // Nếu không có cookie, hoặc cookie có nhưng cart đã bị xóa khỏi DB
    // thì tạo cart mới để tránh lỗi "Cannot read properties of null"
    if (!cart) {
        cart = new Cart();
        await cart.save();

        const expiresTime = 1000 * 60 * 60 * 24 * 365;

        res.cookie("cartId", cart.id, {
            expires: new Date(Date.now() + expiresTime)
        });
    }

    cart.totalQuantity = cart.products.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    res.locals.miniCart = cart;

    next();
};