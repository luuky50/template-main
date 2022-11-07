const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const checkToken = require("../middleware/token_check");
const chair_router = require("../data/chair_data")
const users = require("../data/user_data");
const uuid = require("uuid");
router.use(bodyParser.json());

router.get('/', (req, res) => {
    const filters = req.query;
    //console.log(filters);
    let chairs = [];
    if (filters !== undefined && filters !== null) {
        if (!filters.search) {
            chairs = chair_router.filter(item =>
                Object.entries(filters).every(([filter, value]) => item[filter].toString() === value.toString())
            );
        } else {
            chairs = chair_router.filter(item => item.name.includes(filters.search));
        }
        res.json(chairs);
        return;
    }
    res.json(chair_router);
})

router.get('/:id', (req, res) => {
    const idRequest = req.params.id;
    const idResponse = chair_router.find(t => t.id === idRequest);
    //console.log(idResponse);
    if (!idResponse) {
        return res.status(404).send({
            errorMessage: "Chair not found"
        })
    } else {
        res.json(idResponse);
    }
})

router.post('/bid', checkToken, (req, res) => {
    let request = req.body;

    if (!users.find(u => u.UUID === request.data.userId)) {
        return res.status(404).send({
            errorMessage: "User not found"
        })
    }
    let chairToBeChanged = chair_router.find(t => t.id === request.data.chairId);
    if (!chairToBeChanged) {
        return res.status(404).send({
            errorMessage: "Chair not found"
        })
    }
    if (chairToBeChanged.bids[chairToBeChanged.bids.length - 1]?.bidAmount >= request.data.bidAmount || chairToBeChanged.price >= request.data.bidAmount) {
        return res.status(422).send({
            errorMessage: "Bid is not higher than current bid"
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
    //console.log(chairId)
    const chairRequest = chair_router.findIndex(x => x.id === chairId);
    if (chairRequest === -1) {
        return res.status(404).send({
            errorMessage: "Chair not found"
        })
    }
    const bidRequest = chair_router[chairRequest].bids.findIndex(bid => bid.bidId === bidId)
    if (bidRequest === -1) {
        return res.status(404).send({
            errorMessage: "Bid not found"
        })
    }
    chair_router[chairRequest].bids.splice(bidRequest, 1);
    return res.send({
        logMessage: "Bid" + bidRequest + " on chair " + chairRequest + " has been deleted"
    });
})

router.post('/', checkToken, (req, res) => {
    let request = req.body.data;
    if(dateCheck(res, request.endsBy) === res.ok) {
        if (chairCheck(res, request) === res.ok) {
            let response = {
                id: uuid.v4(),
                name: request.name,
                description: request.description,
                color: request.color,
                price: request.price,
                bids: [ ],
                endsBy: request.endsBy
            }
            chair_router.push(response);
            return res.send({
                logMessage: "Chair has been made with these values: " + JSON.stringify(request)
            });
        }
    }
})

router.put('/', checkToken, (req, res) => {
    const request = req.body.data;
    if(chairCheck(res, request) === res.ok) {
        const idResponseIndex = chair_router.findIndex(x => x.id === request.id);
        if (idResponseIndex === -1) {
            return res.status(404).send({
                errorMessage: "Chair not found"
            })
        }
        chair_router[idResponseIndex] = request;
        return res.send({
            logMessage: "Chair with id " + idResponseIndex + " has been changed with these values: " + JSON.stringify(request)
        });
    }
})

router.delete('/:id', (req, res) => {
    const idRequest = req.params.id;
    const idResponseIndex = chair_router.findIndex(x => x.id === idRequest);
    if (idResponseIndex !== -1) {
        chair_router.splice(idResponseIndex, 1)
        res.send({
            logMessage: "Chair with id " + idRequest + " is going to be deleted"
        });
    } else {
        return res.status(404).send({
            errorMessage: "Chair not found"
        })
    }
})

function dateCheck(res, request){
    let date = new Date().getTime();
    let requestDate = new Date(request).getTime();
    if(requestDate <= date){
        return res.status(400).send({
            errorMessage: "End date can't be before the current date"
        })
    }
}

//Value checking for chair request
function chairCheck(res, request) {
    if (!request.name) {
        return res.status(400).send({
            errorMessage: "Name of chair is empty"
        })
    }
    if (!request.description) {
        return res.status(400).send({
            errorMessage: "Description of chair is empty"
        })
    }
    if (!request.color) {
        return res.status(400).send({
            errorMessage: "Color of chair is empty"
        })
    }
    if (!request.price) {
        return res.status(400).send({
            errorMessage: "Price of chair is empty"
        })
    }
    if (!request.endsBy) {
        return res.status(400).send({
            errorMessage: "End of auction of chair is empty"
        })
    }
}

module.exports = router;