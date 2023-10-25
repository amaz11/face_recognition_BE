import multer,{FileFilterCallback,} from 'multer'
import { Request, Response } from 'express';

// store file in server
const fileStore = multer.diskStorage({
    destination:(req:Request, file, callback)=> {
        callback(null,'./upload');
    },
    filename: (req:Request,file,callback) =>{
        callback(null,new Date().toISOString().replace(/:/g,"-") + file.originalname)
    }
})

const  fileFilter = (req:Request, file:any ,callback :FileFilterCallback) =>{
    if(file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"){
        callback(null, true);
    }
    else {
        console.log("This is Not image file");
        callback(null, false);
      }
} 

export const uploads = multer({
    storage: fileStore,
    fileFilter: fileFilter,
  });
  