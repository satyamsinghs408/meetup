const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {  // implement refresh and check the unsual behaviour
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
    if (token) {
        console.log(token);
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                console.log(err);
                return res.json({
                
                    message: 'Failed tp Authenticate'
                })
            }
            console.log("verified")
            req.user = {};
            // console.log(decoded)
            req.user.id = decoded.userid;
            req.user.email = decoded.email;
            next();
        });
    }
    else {
            res.json({message:"Incorrect Token Given"})
    }     
    
}
module.exports= verifyJWT