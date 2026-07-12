module.exports.registerPost = (req,res,next) => {
    if(!req.body.fullName) {
        console.log(req.body);
        req.flash("error", `Họ tên ko dc để trống `);
        res.redirect(req.get("Referrer") || "/");
        return;
    }

    if(!req.body.email) {
        console.log(req.body);
        req.flash("error", `email ko dc để trống `);
        res.redirect(req.get("Referrer") || "/");
        return;
    }

    if(!req.body.password) {
        console.log(req.body);
        req.flash("error", `Mật khẩu ko dc để trống `);
        res.redirect(req.get("Referrer") || "/");
        return;
    }

    next();

}

module.exports.loginPost = (req,res,next) => {
    if(!req.body.email) {
        console.log(req.body);
        req.flash("error", `email ko dc để trống `);
        res.redirect(req.get("Referrer") || "/");
        return;
    }

    if(!req.body.password) {
        console.log(req.body);
        req.flash("error", `Mật khẩu ko dc để trống `);
        res.redirect(req.get("Referrer") || "/");
        return;
    }

    next();

}