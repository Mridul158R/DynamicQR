const express = require("express");
const ejs = require("ejs");
const app = express();
const dotenv = require("dotenv");
const qrcode = require('qrcode')

dotenv.config({ path: "./config/.env" });

const connectDB = require("./config/db");
const UrlRouter = require("./routes/Url")
const indexRouter  = require('./routes/index')

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.set("view engine", "ejs");  
app.use(express.static("public"));

//Connect Mongo DB
connectDB();

app.use('/',indexRouter)
app.use('/api',UrlRouter)

app.listen(PORT, () => console.log(`App is listening to Port: ${PORT}`));
