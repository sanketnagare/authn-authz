import { Schema, model } from "mongoose";
import { Student, Marks } from "../controllers/types.js";

const marksSchema = new Schema<Marks>({
    subject: {
        type: String,
        required: true,
        maxlength: 10
    },
    score: {
        type: Number,
        required: true,
    }
})

const studentSchema = new Schema<Student>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roll: {
        type: Number,
        required: true
    },
    token: { 
        type:String,
    },
    role:{
        type: String,
        enum: ["student", "teacher"],
        required:true
    },
    marks: {
        type: [marksSchema],
        required: function() {
            return this.role==="student";
        },
    }
},{
    toJSON:{
        transform(doc,ret) {
            delete ret.password
            delete ret.__v
        }
    } 
});


const studentModel = model<Student>('StudentCollection', studentSchema)

export {studentModel}