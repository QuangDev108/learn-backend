module.exports.createPost = (req,res,next) => {
    if(!req.body.title) {
        console.log(req.body);
        req.flash("error", `Vui lòng nhập tiêu đề `);
        res.redirect(req.get("Referrer") || "/");
        return;
    }

    next();
}