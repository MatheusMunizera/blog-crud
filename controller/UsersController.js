const express = require("express");
const router = express.Router();
const User = require("../model/User");
const bcrypt = require("bcryptjs") // npm install bcryptjs --save



router.get("/register", (req,res) => {
    res.render("users/create");
})

router.post("/users/create",(req,res)=>{
    let email = req.body.email;
    let password = req.body.password;
    let adm = req.body.adm;

    User.findOne({
        where: {email: email}
    }).then( user => {
        if(user == undefined){
            let salt = bcrypt.genSaltSync(10); 
            let hash = bcrypt.hashSync(password, salt)
        
            User.create({
                email: email,
                password: hash,
                adm: adm
            }).then(()=>{

                res.redirect("/login")
            }).catch(err => console.log(err))
        }else{
            res.redirect("/login")
        }
    })

    
})

router.get("/login", (req,res)=>{
    res.render("users/login");
})

router.post("/authenticate", (req,res)=>{
    let email = req.body.email;
    let password = req.body.password;

    User.findOne({where:{email:email}}).then((user)=>{
        if(user != undefined){// Se existe um usuário com esse email
            //Validar senha hash com bcrypt
            let corret = bcrypt.compareSync(password, user.password);
          
            if(corret ){
                req.session.user = {
                    id: user.id,
                    email: user.email,
                    adm: user.adm
                }
                res.redirect("/")
               
            }else{
                res.redirect("/login");
            }
        }else{
            res.redirect("/login");
        }
    })

})

router.get("/logout", (req,res)=>{
    req.session.user = undefined;
    res.redirect("/");
})


module.exports = router;