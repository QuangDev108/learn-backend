const productCategory = require("../models/product-category.model")

module.exports.getSubCategory = async (parentId) => {
    const getCatagory = async (parentId) => {
        const subs = await productCategory.find({
            parentId: parentId,
            status: "active",
            deleted: false,
        });

        let allSub = [...subs];

        for (const sub of subs) {
            const childs = await getCatagory(sub.id);
            allSub = allSub.concat(childs);
        }

        return allSub;
    };

    const result = await getCatagory(parentId);
    return result;
}