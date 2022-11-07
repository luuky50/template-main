const express = require('express')
const app = express();
const port = 5555;

const chairs_router = require('./chair_router');
const login_router = require('./user_router');
const auth = require('./authentication');
const cors = require('cors');

app.use(cors())
app.use("/auth", auth);
app.use("/chairs", chairs_router);
app.use("/user", login_router);

app.listen(port, () => {
  //console.log(`Example app listening on port ${port}`)
})
