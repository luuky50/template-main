const uuid = require('uuid')
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const crypt = require('bcrypt');
const crypto = require('crypto');
const users = require("../data/user_data");
const checkToken = require("../middleware/token_check");
const router = express.Router();

router.use(bodyParser.json());

//Register
router.post('/', async (req, res) => {
    if (req.body.username && req.body.password) {
        const foundUser = users.find(u => u.username === req.body.username);
        if (!foundUser) {
            const secretCode = crypto.randomBytes(50).toString('hex');
            console.log("Making new user");
            let user = {
                UUID: uuid.v4(),
                username: req.body.username,
                password: crypt.hashSync(req.body.password.toString(), crypt.genSaltSync()),
                secret: secretCode
            }
            users.push(user);
            res.end("New user made");
        } else {
            res.send("User already exists");
        }
    }
});

router.get('/', checkToken, async (req, res) =>{
    res.send("It's done");
});

module.exports = router;