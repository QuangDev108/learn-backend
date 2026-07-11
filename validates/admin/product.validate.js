module.exports.createPost = (req,res,next) => {
    if(!req.body.title) {
        console.log(req.body);
        req.flash("error", `Vui lòng nhập tiêu đề `);
        res.redirect(req.get("Referrer") || "/");
        return;
    }

    if (req.body.title.length < 5) {
        req.flash("error", "Tiêu đề dài tối thiểu là 5 ký tự!");
        return res.redirect(req.get("Referrer") || "/");
    }

    next();

    next();
}