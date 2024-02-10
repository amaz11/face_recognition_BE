import { Request, Response } from 'express'
import * as xlsx from 'xlsx'
import prisma from '../utils/prisma'
import randomestring from 'randomstring'

interface UserData {
    name: string;
    email: string;
    password: string;
    address: string;
    positions: string;
    phone: string
}
const processUserWithPassword = async (user: UserData[]) => {
    if (user) {
        const userWithPassword = await Promise.all(user?.map(createUserWithPassword))
        console.log(userWithPassword);
        // try {
        //     await prisma.teachers.createMany({
        //         data: ,
        //         skipDuplicates: true,
        //     })

        // } catch (error) {
        //     console.log(error);
        // }
    }

}

const createUserWithPassword = async (user: UserData) => {
    try {
        const randomPassword = randomestring.generate(12)
        return {
            ...user,
            name: user.name,
            email: user.email,
            password: randomPassword,
        };
    }
    catch (error) {
        console.log(error);
    }
}

const createTeacher = async (req: Request, res: Response) => {
    let { exclePath } = req?.body
    const workbook = xlsx.readFile(`${exclePath}`);  // Step 2
    let workbook_sheet = workbook.SheetNames;                // Step 3
    let user: UserData[] = xlsx.utils.sheet_to_json(        // Step 4
        workbook.Sheets[workbook_sheet[0]]
    );
    processUserWithPassword(user).then(() => prisma?.$disconnect()).catch(error => {
        console.error('Error processing users:', error);
        prisma.$disconnect();
    });

    return res.json()
}


export { createTeacher }