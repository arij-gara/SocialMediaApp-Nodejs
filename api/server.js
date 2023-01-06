const express =require('express')
const app = express();
const mongoose = require ('mongoose')
const helmet = require ('helmet')
const dotenv = require('dotenv')
const morgan = require ('morgan')
const userroute = require('./routes/users')
const authroute = require ('./routes/auth')
const postroute = require('./routes/posts')
const conversationroute = require('./routes/conversations')
const messageroute = require('./routes/messages')
const multer = require('multer')
const path = require("path");
dotenv.config()

var cors = require('cors');
app.use(cors());
mongoose.connect(process.env.MONGO_URL, () =>{ console.log('connected to mongo ')})
app.use("/images", express.static(path.join(__dirname, "public/images")));

//midellware 
app.use(express.json())
app.use (helmet())
app.use(morgan('common'))

const storage =multer.diskStorage({
    destination: (req,file,cb) =>{
        cb(null, 'public/images')
    },
    filename: (req,file,cb) =>{ 
    cb(null,req.file)}
})
const upload= multer({storage})
app.post('/api/upload', upload.single('file'), (req,res)=>{ 
    try{
   return res.status(200).json('file uploaded successfuly')
    }catch(err){
        console.log(err)
    }
})

app.get( '/', (req,res) =>{
    res.send('welcome to home page')
})
app.use('/api/users/',userroute)
app.use('/api/auth/', authroute)
app.use('/api/posts/',postroute)
app.use('/api/conversations/', conversationroute)
app.use('/api/messages/', messageroute)
app.listen(8000, () => { console.log('Backend server is running')})