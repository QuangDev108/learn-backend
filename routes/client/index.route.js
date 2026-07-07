const productsRouter = require('./product.route');
const homeRouter = require('./home.route');
const searchRouter = require('./search.router');

const categoryMiddleware = require('../../middlewares/client/category.middleware');

module.exports = (app) => {
    app.use(categoryMiddleware.category);

    app.use('/', homeRouter);

    app.use('/products', productsRouter);

    app.use('/search', searchRouter);

}