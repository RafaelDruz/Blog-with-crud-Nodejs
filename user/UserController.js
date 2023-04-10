const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require('bcryptjs');
const adminAuth = require("../middlewares/adminAuth");
const  jwt  = require ("jsonwebtoken"); 
const  secretjwt  = "jhjsdrrbusfasddgsd"; 

router.get("/users", adminAuth, (req, res) => {
    User.findAll().then(users => {
        res.render("admin/users/index", {users: users});
    });
});

router.get("/users/create", (req, res) => {
    res.render("pagination/users/create")
});

router.post("/users/create", (req, res) => {
    const {email, password} = req.body;
    User.findOne({where:{email: email}}).then(user => {
        if(user == undefined){  
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);
            User.create({
                email: email,
                password: hash,
                isadmin: 'user'
            }).then(() => {
                res.redirect("/");
                console.log("Password created.");
            }).catch((err) => {
                res.redirect("/");
                console.log("Have a problem creating password.");
            });
        } else {
            res.redirect("/users/create");
            console.log("User already created.")
        }
    });
});

router.get("/login", (req, res) => {
    res.render("pagination/users/login")
});

router.post("/authenticate", (req, res) => {
    const {email, password} = req.body;
    if((!email || email === "") || (!password || password === "")){
        console.log("Use a valid user.")
        res.redirect("/login");
    }else{
        User.findOne({where: {email: email}}).then(user => {
            if(user != undefined){
                const correct = bcrypt.compareSync(password, user. password); 
                if(correct){
                    req.session.user = { id: user.id, email: user.email}
                        jwt.sign({email: user.email},secretjwt,{expiresIn: '10m'},(err, token) => {
                        if(err){
                            res.status(400);
                            res.json({err: "Error"});
                        } else { 
                            req.token = token;
                            res.cookie('auth',token);
                            res.redirect("/articles");
                            console.log("Authenticated");
                        }
                    })
                } else {
                    res.redirect("/login");
                    console.log("Is not authenticated")
                }
            } else {
                res.redirect("/login");
                console.log("User undefined")
            }
        });
    }
});

router.post("/user/delete", async (req, res) => {
    const id = req.body.id;
    if (!id) {
      return res.redirect("/users");
    }
    try {
        const user = await User.findByPk(id);
        await user.destroy({ where: { id } });
        res.redirect("/users");
        console.log("User deleted!")
      } catch (err) {
        console.error(err);
        res.redirect("/users");
      }
});

router.get("/logout", (req, res) => {
    res
    .status(200)
    .clearCookie('auth')
    req.session.user = undefined;
    res.redirect("/home");
})

module.exports = router;