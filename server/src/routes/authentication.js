const jwt = require('jsonwebtoken');
const users = require("../data/user_data")
const crypt = require("bcrypt");
const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const crypto = require("crypto");
const checkToken = require("../middleware/token_check");


router.use(bodyParser.json());

//Uitloggen
router.post('/logout', checkToken, async (req, res) => {
    const user = users.find(u => u.username === req.verifiedUser.username);
    if (user) {
        user.secret = crypto.randomBytes(50).toString('hex');
        users.splice(req.verifiedUser, 0, user);
        return res.send({logMessage:"Secret has been changed"});
    } else {
        return res.status(401).send({logError:"Secret has not been changed"});
    }
});

//Inloggen
router.post('/login', async (req, res) => {
        if (req.body.username && req.body.password) {
            const foundUser = users.find(u => u.username === req.body.username);
            if (foundUser) {
                if (await crypt.compareSync(req.body.password, foundUser.password)) {
                    const token = jwt.sign({
                            username: foundUser.username,
                            role: foundUser.UUID
                        },
                        foundUser.secret);
                    res.send({token: token, id: foundUser.UUID,username: foundUser.username, isAdmin: foundUser.isAdmin});
                } else {
                    res.status(401).send({logMessage:"Password is wrong"});
                }
            } else {
                res.status(401).send({errorMessage:"User not found"});
            }
        } else {
            res.status(401).send({errorMessage:"Username or/and password isn't filled in"});
        }
    }
)
;

module.exports = router;

