const jwt = require('jsonwebtoken');
const users = require("../data/user_data")
const crypt = require("bcrypt");
const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const crypto = require("crypto");
const checkToken = require("../middleware/token_check");


router.use(bodyParser.json());

//Uitloggen secret veranderen
router.put('/', checkToken, async (req, res) => {
    const user = users.find(u => u.username === req.verifiedUser.username);
    if (user) {
        user.secret = crypto.randomBytes(50).toString('hex');
        users.splice(req.verifiedUser, 0, user);
        return res.end("Secret has been changed");
    } else {
        return res.end("Secret has not been changed");
    }
});

//Inloggen
router.post('/', async (req, res) => {
        if (req.body.username && req.body.password) {
            console.log("User with name " + req.body.username + " tries to log in.");
            const foundUser = users.find(u => u.username === req.body.username);
            if (foundUser) {
                console.log("FoUND!");
                if (await crypt.compareSync(req.body.password, foundUser.password)) {
                    const token = jwt.sign({
                            username: foundUser.username,
                            role: foundUser.UUID
                        },
                        foundUser.secret);
                    res.send({token: token, id: foundUser.UUID});
                } else {
                    res.status(401).send("Password is wrong");
                }
            } else {
                console.log("USER NOT FOUND!");
                res.status(401).send("User not found");
            }
        } else {
            res.send("Username or/and password isn't filled in");
        }
    }
)
;

module.exports = router;

