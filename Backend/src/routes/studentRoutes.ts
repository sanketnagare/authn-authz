import express, { Router, Request, Response } from "express";
import {createStudent, getStudents, getOneStudent, updateStudentUsingPut, updateStudent, deleteStudent, login, teacherLogin} from "../controllers/studentController.js";
import { auth, isStudent, isTeacher } from "../middleware/auth.js";

const router:Router = express.Router();

router.post("/addstudent", createStudent);
router.get("/getstudents", getStudents);
router.get("/getonestudent/:roll", getOneStudent);
router.put("/updatestudent/:roll", updateStudentUsingPut)
router.patch("/updatestudent/:roll", updateStudent);
router.delete("/deletestudent/:roll", deleteStudent);
router.post("/login", login);
router.post("/teacherlogin", teacherLogin)

router.get("/student", auth,  isStudent, (req: Request, res:Response) => {
    res.status(200)
    .json({
        succcess:true,
        message:"Welcome student"
    })
})

router.get("/teacher", auth, isTeacher, (req: Request, res:Response) => {
    res.status(200)
    .json({
        sucess:true,
        message:"Welcome Teahcer"
    })
})


export default router;