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
            const user = {
                UUID: uuid.v4(),
                username: req.body.username,
                password: crypt.hashSync(req.body.password.toString(), crypt.genSaltSync()),
                isAdmin: false,
                secret: secretCode
            }
            const token = jwt.sign({
                    username: user.username,
                    role: user.UUID
                },
                user.secret);
            users.push(user);
            res.send({logMessage: "New user made", token: token, id: user.UUID, username: user.username});
        } else {
            return res.status(401).send({
                errorMessage: "User already exists"
            })
        }
    }
});

module.exports = router;