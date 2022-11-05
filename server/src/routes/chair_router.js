const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const checkToken = require("../middleware/token_check");
const chair_router = require("../data/chair_data")
const users = require("../data/user_data");
const uuid = require("uuid");
router.use(bodyParser.json());

router.get('/', (req, res) => {
    // res.send('Hello World!')
    const filters = req.query;
    console.log(filters);
    let chairs = [];
    if (filters !== undefined && filters !== null) {
        if(!filters.search) {
            chairs = chair_router.filter(item =>
                Object.entries(filters).every(([filter, value]) => item[filter].toString() === value.toString())
            );
        }else{
            chairs = chair_router.filter(item => item.name.includes(filters.search));
        }
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
    const idResponse = chair_router.find(t => t.id === idRequest);
    console.log(idResponse);
    if(!idResponse){
        return res.status(401).send({
            errorMessage : "Chair not found"
        })
    }else {
        res.json(idResponse);
    }
})

router.post('/bid', checkToken, (req, res) => {
    let request = req.body;
    if(!users.find(u => u.UUID === request.data.userId)){
        return res.status(401).send({
            errorMessage : "User not found"
        })
    }
    let chairToBeChanged = chair_router.find(t => t.id === request.data.chairId);
    if(!chairToBeChanged){
        return res.status(401).send({
            errorMessage : "Chair not found"
        })
    }
    let bid = {
        bidId: uuid.v4(),
        userName: request.data.userName,
        userId: request.data.userId,
        bidAmount: request.data.bidAmount,
        date: request.data.date
    }

    chairToBeChanged.bids.push(bid);
    res.send(bid);
})

router.delete('/:chairId/:bidId', checkToken, (req, res) => {
    const bidId = req.params.bidId;
    const chairId = req.params.chairId;
    console.log(chairId)
    const chairRequest = chair_router.findIndex(x => x.id === chairId);
    if(chairRequest === -1){
        return res.status(401).send({
            errorMessage : "Chair not found"
        })
    }
    const bidRequest = chair_router[chairRequest].bids.findIndex(bid => bid.bidId === bidId)
    if(bidRequest === -1){
        return res.status(401).send({
            errorMessage : "Bid not found"
        })
    }
    chair_router[chairRequest].bids.splice(bidRequest, 1);
})

router.post('/', checkToken, (req, res) => {
    let response;
    console.log("Response in backend: " + JSON.stringify(req.body));
    if (req.body !== undefined) {
        response = {
            id: uuid.v4(),
            name: req.body.data.chairName,
            description: req.body.data.chairDescription,
            color: req.body.data.chairColor,
            price: req.body.data.chairPrice,
            endsBy: req.body.data.chairDate
        }
        console.log(response);
        chair_router.push(response);
        res.end(JSON.stringify(response));
    } else {
        throw new Error("Body is undefined");
    }
})

router.put('/', checkToken,(req, res) => {
    const request = req.body;
    console.log("Response in backend: " + JSON.stringify(request));
    const idResponseIndex = chair_router.findIndex(x => x.id === request.data.id);
    if(idResponseIndex === -1){
        return res.status(401).send({
            errorMessage : "Chair not found"
        })
    }
    console.log(idResponseIndex)
    chair_router[idResponseIndex] = request.data;
})

router.delete('/:id', (req, res) => {
    const idRequest = req.params.id;
    console.log(req.params.id);
    const idResponseIndex = chair_router.findIndex(x => x.id === idRequest);
    console.log(idResponseIndex);
    if (idResponseIndex !== -1) {
        chair_router.splice(idResponseIndex, 1)
        for (const item of chair_router) {
            console.log(item);
        }
        res.send({
            logMessage: "Chair with id " + idRequest + " is going to be deleted"});
    } else {
        return res.status(401).send({
            errorMessage : "Chair not found"
        })
    }
})

module.exports = router;