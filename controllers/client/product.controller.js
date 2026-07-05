const Product = require('../../models/product.model');
const productsHelpers = require("../../helpers/products");
const productsCategoryHelpers = require("../../helpers/products-category");
const productCategory = require('../../models/product-category.model');


// [GET] /products
module.exports.index = async (req, res) => {
    const products = await Product.find({
        
        status: 'active',
        deleted: false
    }).sort({position: "desc"});

    const newProducts = productsHelpers.priceNewProducts(products);
    

    res.render('client/pages/products/index',{
        PageTitle: 'Danh sách Sản phẩm',
        products: newProducts
    });
}

// [GET] /products:slug
module.exports.detail = async (req, res) => {
    try{
        const find = {
            deleted: false,
            slug: req.params.slug,
            status: "active"
        };

        const product = await Product.findOne(find);

        console.log(product);

        res.render("client/pages/products/detail", {
            pageTitle: product.title,
            product: product
        });
    } catch(error){
        res.redirect(`/products`);
    }
}

// [GET] /products:slugCategory
module.exports.category = async (req, res) => {

    const category = await productCategory.findOne({
        slug: req.params.slugCategory,
        status: "active",
        deleted: false
    });
    

    const listSubCategory = await productsCategoryHelpers.getSubCategory(category.id);

    const listSubCategoryId = listSubCategory.map(item => item.id); 
    

    const products = await Product.find({
        product_category_id: { $in: [category.id, ...listSubCategoryId] },
        deleted: false
    }).sort({position: "desc"});

    const newProducts = productsHelpers.priceNewProducts(products);

    res.render('client/pages/products/index',{
        PageTitle: category.title,
        products: newProducts
    });
}