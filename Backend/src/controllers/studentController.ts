import {studentModel} from "../models/studentModel.js";
import express, { Request, Response} from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { Student } from "./types.js";
import { logger } from "../logger/logger.js";
dotenv.config();

export const createStudent =  async(req:Request, res:Response) => {
    try {
        const{name, email, password, roll, role, marks}:Student = req.body;

        console.log(roll);
        console.log(role)
        console.log(marks)

        const checkUser = await studentModel.findOne({email : email});

        if(checkUser) {
            logger.log("error", "User already exist in database");
            return res.status(401)
            .json({
                success:false,
                message: "User already exist in database"
            })
            
        }

        let hashpassword: string;

        try{
            hashpassword = await bcrypt.hash(password, 10)
        }catch(error) {
            logger.log("error", "Error in hasing password");
            return res.status(500)
            .json({
                success:false,
                message: "Error in hasing password"
            })
        }
        
        const studentObj = new studentModel({
            name,
            email,
            password: hashpassword,
            roll,
            role,
            marks
        })

        const savedStudent = await studentObj.save();

        res.status(200)
        .json({
            success:true,
            data: savedStudent,
            message: "New student added in database"
        })
        logger.log("info", "New student added in database");

    } catch (error) {
        logger.log("error", "Error while adding student");
        res.status(500)
        .json({
            success:false,
            message: "Error while adding student"
        })
    }
}

export const getStudents = async(req:Request, res:Response):Promise<void> => {
    try {
        const allStudent = await studentModel.find({});

        res.status(200)
        .json({
            success:true,
            data: allStudent,
            message: "All students fetched Successfully"
        })
        logger.log("info", "All students fetched Successfully");
        

    } catch (error) {
        console.log(error)
        logger.log("error", "Error while fetching students");
        res.status(500)
        .json({
            success:false,
            message: "Error while fetching students"
        })
    }
}

export const getOneStudent = async(req:Request, res:Response):Promise<void> => {

    try {
        const rollnumber = req.params.roll;

        const foundStudent = await studentModel.findOne({roll: rollnumber});

        if(!foundStudent) {
            logger.log("error", "Student not found");
            res.status(404)
            .json({
                success:false,
                message: "Student not found"
            })
        }

        logger.log("info", "Student found succesfully");
        res.status(200)
        .json({
            success:true,
            data: foundStudent,
            message: "Student found succesfully"
            })
    } catch (error) {
        logger.log("error", "Error while fetching student");
        res.status(500)
        .json({
            success:false,
            message: "Error while fetching student"
            })
    }

    
}

export const updateStudentUsingPut = async(req:Request, res:Response):Promise<void> => {
    try {
        const rollnumber = req.params.roll;
        const updatedStudent = await studentModel.findOneAndReplace({roll: rollnumber},  req.body, {new:true});

        logger.log("info", "Student updated in database");
        res.status(200)
        .json({
            success:true,
            data: updatedStudent,
            message: "Student updated in database"
        })
    } catch (error) {
        console.log(error)
        logger.log("error", "Problem in updating student");
        res.status(500)
        .json({
            success:false,
            message: "Problem in updating student"
        })
    }
}

export const updateStudent = async (req:Request, res:Response):Promise<void> => {
    try {
        const rollnumber = req.params.roll;
        const updatedStudent = await studentModel.findOneAndUpdate({roll: rollnumber},  req.body, {new:true});

        logger.log("info", "Student updated in database");
        res.status(200)
        .json({
            success:true,
            data: updatedStudent,
            message: "Student updated in database"
        })
    } catch (error) {
        logger.log("error", "Problem in updating student");
        console.log(error)
        res.status(500)
        .json({
            success:false,
            message: "Problem in updating student"
        })
    }
}

export const deleteStudent = async(req:Request, res:Response):Promise<void> => {
    try {
        const rollnumber = req.params.roll;

        const deletedStudent = await studentModel.findOneAndDelete({roll: rollnumber});

        if(!deleteStudent) {
            logger.log("error", "Student not found");
            res.status(404)
                .json({
                    success:false,
                    message: "Student not found"
                })
        }

        logger.log("info", "Student deleted succesfully");
        res.status(200)
        .json({
                success:true,
                data: deletedStudent,
                message: "Student deleted succesfully"
        })
    } catch (error) {
        logger.log("error", "Error while deleting student");
        res.status(500)
        .json({
                success:false,
                message: "Error while deleting student"
        })
    }
}


export const login = async(req:Request, res:Response) => {

    try {
        const {email, password } = req.body;

        // const email = "sanket@gmaill.com"
        // const password = "123456"

        if(!email || !password) {
            logger.log("error", "Please fill all the details");
            return res.status(400).json({
                success:false,
                message:"Please fill all the details"
            })
        }

        const user = await studentModel.findOne({email});

        if(!user) {
            logger.log("error", "User is not registered");
            return res.status(401).json({
                success:false,
                message:"User is not registered"
            })
        }

        // data that we will insert into jwt token
        const payload = {
            email:user.email,
            roll: user.roll,
            role: user.role
        }

        // verify password and generate token
        // password matching
        if(await bcrypt.compare(password, user.password)){
            
            // making token with payload, secretkey, and time
            let token = jwt.sign(payload, process.env.JWT_SECRET!, {expiresIn: "2h"} );

            // add token in user and remove password from it
            user.token = token;
            user.password = ""

            // we have to add options in 
            // const options = {
            //     expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            //     httpOnly:true
            // }
            // res.cookie("tokencookie", token, options).status(200).json({
            //     success:true,
            //     token,
            //     user,
            //     message: "User Logged in successfully"
            // })

            logger.log("info", "User Logged in successfully");
            res.status(200).json({
                success:true,
                token,
                user,
                message: "User Logged in successfully"
            })
        }
        // password not matching
        else{
            logger.log("error", "Password incorrect");
            return res.status(403).json({
                success:false,
                message:"Password incorrect"
            })
        }
    } catch (error) {
        console.log(error);
        logger.log("error", "Login failure");
        return res.status(500).json({
            success:false,
            message: "Login failure"
        })
    }
}






export const teacherLogin = async(req:Request, res:Response) => {

    try {
        const {teacherEmail, teacherPassword } = req.body;

        // const email = "sanket@gmaill.com"
        // const password = "123456"

        if(!teacherEmail || !teacherPassword) {
            logger.log("error", "Please fill all the details");
            return res.status(400).json({
                success:false,
                message:"Please fill all the details"
            })
        }

        const user = await studentModel.findOne({email: teacherEmail});

        if(!user) {
            logger.log("error", "User is not registered");
            return res.status(401).json({
                success:false,
                message:"User is not registered"
            })
        }

        // data that we will insert into jwt token
        const payload = {
            email:user.email,
            roll: user.roll,
            role: user.role
        }

        // verify password and generate token
        // password matching
        if(await bcrypt.compare(teacherPassword, user.password)){
            
            // making token with payload, secretkey, and time
            let token = jwt.sign(payload, process.env.JWT_SECRET!, {expiresIn: "2h"} );

            // add token in user and remove password from it
            user.token = token;
            user.password = ""

            // we have to add options in 
            // const options = {
            //     expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            //     httpOnly:true
            // }
            // res.cookie("tokencookie", token, options).status(200).json({
            //     success:true,
            //     token,
            //     user,
            //     message: "User Logged in successfully"
            // })

            logger.log("info", "User Logged in successfully");
            res.status(200).json({
                success:true,
                token,
                user,
                message: "User Logged in successfully"
            })
        }
        // password not matching
        else{
            logger.log("error", "Password incorrect");
            return res.status(403).json({
                success:false,
                message:"Password incorrect"
            })
        }
    } catch (error) {
        console.log(error);
        logger.log("error", "Login failure");
        return res.status(500).json({
            success:false,
            message: "Login failure"
        })
    }
}