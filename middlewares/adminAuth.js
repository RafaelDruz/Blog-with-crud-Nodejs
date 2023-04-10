
const  jwt  = require ("jsonwebtoken"); 
const  secretjwt  = ""; 

function adminAuth(req, res, next){
    if(req.session.user != undefined){
        if (req.session.user.email){ 
            const authToken = req.cookies.auth;
            if(authToken != undefined){ 
                jwt.verify(authToken,secretjwt,(err, decoded) => {
                    if(err){
                        res.redirect("/login")
                    }else{
                        req.token = authToken
                        req.decoded = decoded;
                        console.log("Authorized")
                        next();
                    }  
                })
            }else{   
                console.log("Err token.")
            }
        }else{
            console.log("Not authorized to access this route.")
            res.redirect("/login");
        }    
    }else{
       console.log("without access admin")
        res.redirect("/login");
    };
};

module.exports = adminAuth;