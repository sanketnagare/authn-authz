import express, { NextFunction, Request, Response } from "express";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { JwtPayload } from "jsonwebtoken";
dotenv.config();

export interface CustomRequest extends Request {
    // token: string | JwtPayload;
    user: JwtPayloadWithRole
}

export interface JwtPayloadWithRole extends JwtPayload {
    role?: string; // Add the 'role' property
}

export const auth = async(req: Request, res:Response, next:NextFunction) => {

    try {
        // const token = req.body.token;
        // const token = req.cookies.tokencookie 
        const token = req.header("Authorization")?.replace("Bearer ", "")

        if(!token) {
            return res.status(401).json({
                success:false,
                message: "Token missing"
            })
        }

        const secret = process.env.JWT_SECRET;
        if(!secret) {
            throw new Error("Secret key is not available")
        }

        try {
            const payload = jwt.verify(token, secret) as JwtPayload;
            console.log(payload);
            (req as CustomRequest).user = payload;
            // req.user = payload
        } 
        catch (error) {
            return res.status(401).json({
                success:false,
                message:"Token us invalid"
            })
        }
        next();
    } catch (error) {
        return res.status(401).json({
            success:false,
            message:"Token us invalid"
        })
    }
}

export const isStudent = async(req: Request, res:Response, next:NextFunction) => {
    try {
        if(((req as CustomRequest).user).role !== "student")
        {
            return res.status(401)
            .json({
                success:false,
                message:"This is protected route for students"
            })
        }
        next();
    } catch (error) {
        return res.status(500)
        .json({
            success:false,
            message:"User Role is not matching"
        })
    }
}

export const isTeacher = async(req: Request, res:Response, next:NextFunction) => {
    try {
        if(((req as CustomRequest).user).role !== "teacher")
        {
            return res.status(401)
            .json({
                success:false,
                message:"This is protected route for teacher"
            })
        }
        next();
    } catch (error) {
        return res.status(500)
        .json({
            success:false,
            message:"User Role is not matching"
        })
    }
}
