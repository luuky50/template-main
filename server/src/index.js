const express = require('express')
const app = express();
const port = 5555;

const chairs_router = require('./routes/chair_router');
const login_router = require('./routes/user_router');
const auth = require('./routes/authentication');
const cors = require('cors');

app.use(cors())
app.use("/auth", auth);
app.use("/chairs", chairs_router);
app.use("/user", login_router);

app.get('/', (req, res) => {
  console.log(req);
  // res.send('Hello World!')
  res.json({ msg: "hello world"});
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
