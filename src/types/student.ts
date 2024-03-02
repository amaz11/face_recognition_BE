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
