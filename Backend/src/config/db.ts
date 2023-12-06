import dotenv from 'dotenv';
import mongoose, {connect, model, Schema }from "mongoose";

dotenv.config();

export const dbconnect = ():void => {

    let url = process.env.URL;

    if(!url) {
        throw new Error("Connection URL doesn't exist")
    }
    connect(url)
    .then(() => {
        console.log("Database connected")
    })
    .catch((error) => {
        console.log(error)
        console.log("Problem in database connection")
    })
}