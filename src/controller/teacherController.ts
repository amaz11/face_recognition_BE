import { Request, Response } from 'express'
import * as xlsx from 'xlsx'

const createTeacher = async (req: Request, res: Response) => {
    let exclePath = req?.file?.path
    const workbook = xlsx.readFile(`${exclePath}`);  // Step 2
    let workbook_sheet = workbook.SheetNames;                // Step 3
    let workbook_response = xlsx.utils.sheet_to_json(        // Step 4
        workbook.Sheets[workbook_sheet[0]]
    );

    return res.json({ file: workbook_response })
}


export { createTeacher }