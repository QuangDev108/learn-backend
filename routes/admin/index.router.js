const systemConfig = require('../../config/system');    
const authMiddleware = require('../../middlewares/admin/auth.middleware');

const dashboardRouters = require('./dashboard.router');
const productRouters = require('./product.router');
const productsCategoryRouters = require('./products-category.router');
const roleRouters = require('./role.router');
const accountRouters = require('./account.router');
const authRouters = require('./auth.router');
const myAccountRouters = require('./my-account.router');
const settingRouters = require('./setting.router');

module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;

    app.use(
        PATH_ADMIN + "/dashboard", 
        authMiddleware.requireAuth, 
        dashboardRouters
    );
    
    app.use(
        PATH_ADMIN + "/products", 
        authMiddleware.requireAuth, 
        productRouters
    );

    app.use(
        PATH_ADMIN + "/products-category", 
        authMiddleware.requireAuth, 
        productsCategoryRouters
    );

    app.use(
        PATH_ADMIN + "/roles", 
        authMiddleware.requireAuth, 
        roleRouters
    );

    app.use(
        PATH_ADMIN + "/accounts", 
        authMiddleware.requireAuth, 
        accountRouters
    );

    app.use(PATH_ADMIN + "/auth", authRouters);

    app.use(PATH_ADMIN + "/my-account", authMiddleware.requireAuth, myAccountRouters);

    app.use(PATH_ADMIN + "/settings", authMiddleware.requireAuth, settingRouters);
}