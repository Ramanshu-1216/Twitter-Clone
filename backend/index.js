const express = require('express');
const cors = require('cors');
require('./mongoDb/config.js');
const app = express();
app.use(express.json());

app.use(cors());
app.use('/user', require('./routes/userRoute'));
app.use('/auth', require('./routes/protecterRoute.js'));
app.get("/", (req, res) => {
    res.send("app is running");
});
app.listen(8000, (req) => {
    console.log("Server is running on port 8000");
});