const express=require('express');
const app=express();
const port=3000;
const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config();
const cors=require('cors')


const AuthRoute=require('./Auth/Auth');
const  expense=require('./Expense/Expense')


//midlleware
app.use(express.json());
app.use(cors())
app.use('',AuthRoute);
app.use('',expense)







//connect to database

const connect=async()=>{

try {
    await mongoose.connect(process.env.MONGO_URL)
    console.log("Database connected")
    
} catch (error) {
    console.log("Error connecting to database")


}

}











//crrate a server
app.listen(port,()=>{
    connect();

console.log("server is running on port",port)


})