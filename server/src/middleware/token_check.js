const jwt = require("jsonwebtoken");
const users = require("../data/user_data");

const checkToken = (req, res, next) => {
    //console.log("In checktoken");
    const auth = req.headers['authorization'];
    //console.log("Auth: " + auth);
    if(!auth){
        return res.status(400).send({
            errorMessage : "Authorization header is not added to the request"
        })
    }
    const tokenArray = auth.split(" ");
    if(tokenArray[1] !== "null" && tokenArray[1]) {
        const payload = jwt.decode(tokenArray[1]);
        if(!payload){
            return res.status(401).send({
                errorMessage : "User token invalid"
            })
        }
        const userName = payload.username;
        const foundUser = users.find(u => u.username === userName);
        if (foundUser) {
            try{
                req.verifiedUser = jwt.verify(tokenArray[1], foundUser.secret);
            }catch{
                return res.status(401).send({
                    errorMessage : "User secret invalid"
                })
            }
            next();
        } else {
            return res.status(404).send({
                errorMessage : "No user found with token"
            })
        }
    }else{
        return res.status(401).send({
            errorMessage : "User not logged in"
        })
    }
}

module.exports = checkToken;
