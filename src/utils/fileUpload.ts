import multer, { FileFilterCallback, } from 'multer'
import { Request, Response } from 'express';

// image files upload

// store file in server
const fileStore = multer.diskStorage({
    destination: (req: Request, file, callback) => {
        callback(null, './upload');
    },
    filename: (req: Request, file, callback) => {
        // console.log(file.originalname.replace(/[^\w.-]/g, ' '));
        callback(null, new Date().toISOString().replace(/:/g, "-") + file.originalname.replace(/[^\w.-]/g, ' '))
    }
})

// excle file filttering
const fileFilter = (req: Request, file: any, callback: FileFilterCallback) => {
    if (file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "application/octet-stream") {
        callback(null, true);
    }
    else {
        console.log("This is Not image file");
        callback(null, false);
    }
}

export const uploadImgs = multer({
    storage: fileStore,
    fileFilter: fileFilter,
});

//excle upload

// excle file store
const fileStoreExcel = multer.diskStorage({
    destination: (req: Request, file, callback) => {
        callback(null, './upload/file');
    },
    filename: (req: Request, file, callback) => {
        callback(null, new Date().toISOString().replace(/:/g, "-") + file.originalname.trim())
    }
})

// excle file filttering
const fileFilterExcel = (req: Request, file: any, callback: FileFilterCallback) => {
    if (file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.mimetype === "application/vnd.ms-excel") {
        callback(null, true);
    }
    else {
        console.log("This is Not excel file");
        callback(null, false);
    }
}

export const uploadExcles = multer({
    storage: fileStoreExcel,
    fileFilter: fileFilterExcel
}); 