const express = require('express');

const mongoose = require('mongoose');
const router = require("./routes/user-routes")
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();


app.use(cors({credentials: true, origin: "http://localhost:3000"}));
app.use(cookieParser());
app.use(express.json());

app.use('/api',  router);
mongoose.connect("mongodb+srv://admin:vLw6y5aQEYjMePp@cluster0.ghixis6.mongodb.net/?retryWrites=true&w=majority").then(() => {
    app.listen(5000);
    console.log("Database is connected! Listening to localhost 5000");
}).catch((err)=> console.log(err));
//vLw6y5aQEYjMkePp