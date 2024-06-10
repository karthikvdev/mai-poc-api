import mongoose from "mongoose";

export const dbConnection = () =>{
    mongoose.connect('mongodb://127.0.0.1:27017/poc-mai').then((res) => {
        console.log("Mongo DB connected successfully.")
    }).catch((err) => {
        console.log("Error in Mongo DB connection.")
    });
}
