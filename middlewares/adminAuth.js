function adminAuth(req,res,next){
     if(req.session.user != undefined && req.session.user.adm){
         
        next();
     }else{
         if(req.session.user == undefined)
         res.redirect("/login")
        else res.redirect("/")
     }

}

module.exports = adminAuth