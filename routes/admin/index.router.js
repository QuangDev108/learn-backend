const systemConfig = require('../../config/system');    
const dashboardRouters = require('./dashboard.router');
const productRouters = require('./product.router');

module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;

    app.use(PATH_ADMIN + "/dashboard", dashboardRouters);
    
    app.use(PATH_ADMIN + "/products", productRouters);
}