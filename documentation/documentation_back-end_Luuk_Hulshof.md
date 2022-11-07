# Back-end
- [Data](./documentation_back-end_Luuk_Hulshof.md#data)
  - [ChairData](./documentation_back-end_Luuk_Hulshof.md#chair_data)
  - [UserData](./documentation_back-end_Luuk_Hulshof.md#user_data)
- [Middleware](./documentation_back-end_Luuk_Hulshof.md#middleware)
  - [Token_Check](./documentation_back-end_Luuk_Hulshof.md#token_check)
- [Routes](./documentation_back-end_Luuk_Hulshof.md#routes)
  - [Authentication](./documentation_back-end_Luuk_Hulshof.md#authentication)
  - [Chair_Router](./documentation_back-end_Luuk_Hulshof.md#chair_router)
    - [Chair](./documentation_back-end_Luuk_Hulshof.md#chair)
    - [Bid](./documentation_back-end_Luuk_Hulshof.md#bid)
    - [Checks](./documentation_back-end_Luuk_Hulshof.md#checks)
      - [Date_Check](./documentation_back-end_Luuk_Hulshof.md#datecheck)
      - [Chair_Check](./documentation_back-end_Luuk_Hulshof.md#chaircheck)
  - [Index](./documentation_back-end_Luuk_Hulshof.md#index)
  - [User_Router](./documentation_back-end_Luuk_Hulshof.md#user_router)


# Data
## chair_data
Voorbeeld chair_data:
```javascript
module.exports = 
    [
        {
            id: 'c51d73ab-d5d6-4896-851f-5af342a02e0c',
            name: "PELLO",
            description: "Armchair",
            color: "red",
            price: 200,
            bids: [],
            endsBy: "2022-12-04"
        }
    ]
```

## user_data
Voorbeeld user_data:
```javascript
module.exports =
    [
        {
            UUID: '09939747-dd4c-414d-b5dd-d173922fea88',
            username: 'admin',
            password: '$2b$10$2Wp.pLz/SD.49hpPGdJCjeZLmepb5jMclysVsogyHUdYXkJk7nuT2',
            isAdmin: true,
            wonBids: [ ],
            secret: '376464ae9350d835a0945b1f603f702bfd98abf06569a82a78f40dd2f0f5240e84b08e3054bb521e665931411ce729c7d128'
        }
    ]
```
# Middleware
Middleware is een check of een transitie layer voor een front-end en back-end. Hierdoor is communicatie tussen de twee
ends beter en kan er beter met data worden gedistribueerd.
## token_check
Deze middleware wordt overal gebruikt waar de gebruiker ingelogd voor moeten zijn. Dus neem als voorbeeld een bod
versturen.
```javascript
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
```
Deze middleware checkt eerst of er een authorization header aanwezig is en gaat daarna checken of er een token in de
header staat. Wanneer deze token aanwezig is wordt deze gedecode en stuurt hij een error code als de decoding niet lukt.
Als de decoding wel is goed gegaan wordt er naar de gebruikersnaam gekeken of de gebruiker wel bestaat. Als de gebruiker
bestaat wordt de token geverified of het klopt met de user's secret. Zo niet stuurt de back-end een error message terug.

# Routes
## authentication
De authenticatie wordt gebruikt om te kunnen inloggen of uitloggen.
```javascript
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
```
Bij het uitloggen wordt de secret van de gevonden user veranderd, zodat de gemaakte token niet meer klopt. Als de token
van de gebruiker niet meer klopt kan de gebruiker dus geen functies uitvoeren waarvoor hij of zij moet ingelogd zijn.
Het veranderen van de secret wordt gedaan d.m.v de extensie 'crypto'.
```javascript
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
```
Bij het inloggen moet de gebruiker een gebruikersnaam en wachtwoord ingevuld hebben. Wanneer de gebruiker zijn 
gebruikersnaam of wachtwoord verkeerd heeft, stuurt de backend een foutmelding. Als alle gegevens kloppen wordt het
wachtwoord encrypt en wordt er een nieuwe token voor de gebruiker gemaakt. Deze token wordt dan ook weer teruggestuurd
naar de front-end.
## chair_router

### Chair
De chair bestaat uit gegevens en functionaliteiten van chairs en functionaliteiten voor bids.
```javascript
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
```
Bij het ophalen van de stoelen wordt er eerst gekeken of er filters aanwezig zijn of als er een zoekterm is ingevuld.
Als er filters zijn toegevoegd wordt er door de stoelen gefilterd voor elke aanwezige filter. Als er een zoekterm is 
ingevuld gaat de functie op naam basis kijken of er letters voorkomen in de namen van de stoelen. En toont alleen 
diegene waar de letters in voorkomen.
```javascript
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
```
Deze functie is alleen voor het zoeken naar een stoel met een specifieke id. Als deze stoel met die id niet bestaat, 
geeft de back-end een foutmelding terug. Anders wordt de stoel terug gestuurd.
```javascript
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
```
Het sturen van een stoel gaat met deze functie eerst wordt er een aantal checks [DateCheck](./documentation_back-end_Luuk_Hulshof.md#datecheck) [ChairCheck](./documentation_back-end_Luuk_Hulshof.md#chaircheck) gedaan. Wanneer
deze checks zijn voltooid maakt hij een nieuwe stoel object aan die de functie dan stuurt naar de stoelen. De back-end 
stuurt dan nog een conformatie dat het posten is gelukt.
```javascript
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
```
Het updaten van een stoel is bijna hetzelfde als het posten. Alleen wordt er nu met oude date en nieuwe data gewerkt 
in plaats van alleen nieuwe data. Eerst wordt er een [ChairCheck](./documentation_back-end_Luuk_Hulshof.md#chaircheck) gedaan en daarna wordt er bekeken of de id 
van de oude stoel wel bestaat. Zo ja, wordt de oude stoel overschreven met de nieuwe.
```javascript
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
```
Bij het deleten wordt er met een query een id gevraagd en met dat id gezocht naar een stoel die gedelete moet worden.
Als de stoel met deze id bestaat, wordt deze verwijderd uit de stoel array. Zo niet, wordt er een error verstuurd vanuit
de back-end.
### Bid
Dit zijn de functionaliteiten van de bid
```javascript
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
```
Bij deze functie wordt er eerst gecheckt of de id van de gemaakt bid wel bestaat. Daarna wordt er gecheckt of de bid wel
van een bestaande chair afkomt. En dan kijken we of het geboden geld wel aan het minimale van de stoel komt en of het
hoger is dan de rest biedingen. Als deze checks allemaal goed zijn maakt het een nieuwe bid aan die dan wordt verstuurd.
Voor deze functie moet de gebruiker de middleware checkToken gebruiken.
```javascript
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
```
Bij deze functie wordt er eerst gecheckt of de stoel wel bestaan van de bid, daarna wordt er gekeken of de bid wel
bestaat in de stoel. Zo ja, wordt de bid verwijderd uit deze stoel. Voor deze functie moet de gebruiker de middleware 
checkToken gebruiken.
### Checks
#### DateCheck
```javascript
function dateCheck(res, request){
    let date = new Date().getTime();
    let requestDate = new Date(request).getTime();
    if(requestDate <= date){
        return res.status(400).send({
            errorMessage: "End date can't be before the current date"
        })
    }
}
```
Deze functie checkt of de gerequeste datum niet gelijk of in het verleden is van nu.

#### ChairCheck
```javascript
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
```
Deze functie checkt alle variables van de gemaakte chair object
## index
De index zorg ervoor dat alle routers worden gebruikt in de back-end
## user_router
Registreren van een gebruiker
```javascript
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
```
Bij het registreren wordt er eerst gekeken of de gebruikersnaam en wachtwoord wel zijn ingevuld. Als dit zo is checkt 
het of er al een persoon bestaan met dezelfde email of naam. Zo niet maken we een nieuwe secret code aan voor de
nieuwe gebruiker en wordt deze gebruiker automatisch ingelogd met een token.