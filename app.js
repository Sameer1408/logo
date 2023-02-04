const connetToMongo = require('./db');
const express = require('express');
const bodyParser= require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const http = require("http");
const {Server} = require("socket.io");
require('dotenv').config();
const cloudinary  = require('cloudinary')

cloudinary.config({
    cloud_name:"digze3wuc",
    api_key:"134248587677843",
    api_secret:"ZG83Eoz13E4a2L451JLMFBpRaT4"
    })
  

connetToMongo();
const app = express();

app.use(express.json());
app.use(cors())
app.use(bodyParser.urlencoded({extended:true}))
app.use(fileUpload());

const port = 4000;


app.use('/api/auth',require('./auth.js'))

const server = http.createServer(app);


// const io = new Server(server,{
//     cors:{
//         origin:"http://localhost:3000",
//         methods:["GET","POST"],
//     }
// })


// io.on("connection",(socket)=>{
//     console.log(`User connected${socket.id}`);


// })

server.listen(process.env.PORT || port,()=>{
    console.log(`Server is listening at ${port}`);
})