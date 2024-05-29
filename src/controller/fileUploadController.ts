import { Request, Response } from 'express'
import * as xlsx from 'xlsx'

const excleFilePath = async (req: Request, res: Response) => {
    let exclePath = req?.file?.path
    return res.status(201).json({ exclePath })
}

const imageFilePath = async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded or invalid file type" });
    }
    let imagePath = req?.file?.path
    return res.status(201).json({ imagePath })
}


export { excleFilePath, imageFilePath }