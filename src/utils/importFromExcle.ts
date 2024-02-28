import * as xlsx from 'xlsx'

export const importFromExcle = (exclePath: string) => {

    const workbook = xlsx.readFile(`${exclePath}`);
    let workbook_sheet = workbook.SheetNames;
    let users: any[] = xlsx.utils.sheet_to_json(
        workbook.Sheets[workbook_sheet[0]]
    );
    return users
}