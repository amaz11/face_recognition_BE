import { Request, Response } from 'express'
// const readXlsxFile = require('read-excel-file/node')
import * as xlsx from 'xlsx'

const createTeacher = async (req: Request, res: Response) => {
    let exclePath = req?.file?.path
    // const row = await readXlsxFile(exclePath)
    const workbook = xlsx.readFile(`${exclePath}`);  // Step 2
    let workbook_sheet = workbook.SheetNames;                // Step 3
    let workbook_response = xlsx.utils.sheet_to_json(        // Step 4
        workbook.Sheets[workbook_sheet[0]]
    );

    return res.json({ file: workbook_response })
}


export { createTeacher }