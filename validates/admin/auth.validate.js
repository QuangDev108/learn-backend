module.exports.loginPost = (req,res,next) => {
    if(!req.body.email) {
        console.log(req.body);
        req.flash("error", `Vui lòng nhập email! `);
        res.redirect(req.get("Referrer") || "/");
        return;
    }

    if(!req.body.password) {
        console.log(req.body);
        req.flash("error", `Vui lòng nhập mật khẩu! `);
        res.redirect(req.get("Referrer") || "/");
        return;
    }

    next();
}