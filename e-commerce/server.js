require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const fileUpload=require('express-fileupload')
const cookieParser = require('cookie-parser')


const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(fileUpload({
    useTempFiles:true
}))

// Routes
app.use('/user',require('./routes/userRouter'))



// connect to mongodb
const URI = process.env.MONDODB_URL
mongoose.connect(URI,{
    useCreateIndex:true,
    useFindAndModify:false,
    useNewUrlParser:true,
    useUnifiedTopology:true
},err =>{
    if(err)throw err;
    console.log('connected to mongoDB')
})


// app.get('/',(req,res)=>{
//     res.json({msg : "welcome to demo"})
// })

const PORT = process.env.PORT || 5000
app.listen(PORT,() => {
    console.log('server  is running on port',PORT)
}) 