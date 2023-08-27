import express from 'express';

const app = express();
app.use(express.json());

app.use('/user', require('./routes/userRoutes'));
app.use('/protected', require('./routes/protectedRoute'));

app.get("/", (req, res) => {
    res.send("app is running");
});

app.listen(8000);