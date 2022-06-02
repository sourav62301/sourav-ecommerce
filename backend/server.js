const app = require('./app.js');
const dotenv = require('dotenv');
const connectDatabase = require('./config/dataBase');


// Handling Uncaught Exception
process.on('uncaughtException', (err)=>{
    console.log(`Error : ${err.message}`);
    console.log("Shutting the Server due to Uncaught Exception")
    process.exit(1);
})



// config
dotenv.config({path:"backend/config/config.env"})



// Connecting to the Database
connectDatabase()


const server = app.listen(process.env.PORT, ()=>{
    console.log(`Server is working on http://localhost:${process.env.PORT}`)
})


// Unhandled Promise Rejections
process.on('unhandledRejection', err =>{
    console.log(`Error : ${err.message}`);
    console.log("Shutting down the Server due to Unhandled Promise Rejection")

    server.close(()=>{
        process.exit(1);
    })
})