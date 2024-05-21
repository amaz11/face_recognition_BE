export interface StudentType {
    name: String;
    email: String;
    address: String;
    password: String;
    phone: string;
    exam_name: string;
    exam_date: string;
    exam_start: number;
    exam_end: number;
    hall_address: string;
    rollNo: String;
    registerNo: String;
}

export interface StudentQueryParams {
    roomNo: string;
    hall_address: string;
    date: string;
}

export type StudentUser = StudentInterFace[]

export interface StudentInterFace {
    id: number
    faceVector: string
    studentId: number
    createAt: string
    student: Student
}

export interface Student {
    id: number
    name: string
    email: string
    address: string
    password: string
    phone: string
    first_login: boolean
    registretionDone: boolean
    varify: boolean
    createAt: string
    updateAt: string
}
