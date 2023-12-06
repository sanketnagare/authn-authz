export interface Marks {
    subject: string;
    score: number;
  }
  
  export interface Student extends Marks {
    name: string,
    email: string,
    password: string,
    roll: number,
    token?: string,
    role: "student" | "teacher",
    marks?: Marks[]
  }
  