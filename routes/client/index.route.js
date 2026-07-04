const productsRouter = require('./product.route');
const homeRouter = require('./home.route');

const categoryMiddleware = require('../../middlewares/client/category.middleware');

module.exports = (app) => {
    app.use(categoryMiddleware.category);

    app.use('/', homeRouter);

    app.use('/products', productsRouter);

}