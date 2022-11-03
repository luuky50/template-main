const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const checkToken = require("../middleware/token_check");
const chair_router = require("../data/chair_data")
const users = require("../data/user_data");
router.use(bodyParser.json());

router.get('/', (req, res) => {
    console.log("In");
    // res.send('Hello World!')
    const filters = req.query;
    let chairs = [];
    if (filters !== undefined && filters !== null) {
        chairs = chair_router.filter(item =>
            Object.
            entries(filters).
            every(([filter, value]) => item[filter].toString() === value.toString())
        );
        console.log(chairs);
        res.json(chairs);
        return;
    }
    res.json(chair_router);
})

// console.log(chairs);
// if(chairs === [] || chairs === null){
//     chair_router.filter(item => {
//         console.log(item);
//         for (const filter in filters) {
//             console.log(item[filter]);
//             if (item[filter].toString() === filters[filter].toString()) {
//                 chairs.push(item);
//             }
//         }
//
//     });
// }


router.get('/:id', (req, res) => {
    const idRequest = req.params.id;
    const idResponse = chair_router.find(t => t.id === Number(idRequest));
    console.log(idResponse);
    res.json(idResponse);
})

router.post('/bid', checkToken, (req, res) => {
    let request = req.body;
    if(!users.find(u => u.UUID === request.data.userId)){
        return res.status(401).send({
            errorMessage : "User not found"
        })
    }
    let chairToBeChanged = chair_router.find(t => t.id === Number(request.data.chairId));
    if(!chairToBeChanged){
        return res.status(401).send({
            errorMessage : "Chair not found"
        })
    }
    let bid = {
        userId: request.data.userId,
        bidAmount: request.data.bidAmount,
        date: request.data.date
    }

    chairToBeChanged.bids.push(bid);
    res.send(bid);
})

router.post('/', (req, res) => {
    let response;
    console.log("Response in backend: " + req.body);
    if (req.body !== undefined) {
        response = {
            id: req.body.id,
            color: req.body.color,
            value: req.body.value
        }
        console.log(response);
        chair_router.push(response);
        res.end(JSON.stringify(response));
    } else {
        throw new Error("Body is undefined");
    }
})

router.put('/', (req, res) => {

})

router.delete('/:id', (req, res) => {
    const idRequest = req.params.id;
    console.log(req.params.id);
    const idResponseIndex = chair_router.findIndex(x => x.id === parseInt(idRequest));
    console.log(idResponseIndex);
    if (idResponseIndex !== -1) {
        chair_router.splice(idResponseIndex, 1)
        for (const item of chair_router) {
            console.log(item);
        }
        res.send("Chair with id: " + idRequest + " is going to be deleted");
    } else {
        throw new Error("ID doesn't exist");
    }


})

module.exports = router;