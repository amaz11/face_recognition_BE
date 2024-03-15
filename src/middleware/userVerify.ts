import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../utils/secret";
import prisma from "../utils/prisma";
// headers.authorization.split(" ")[1]
export const teacherVerify = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split("Bearer ")[1];

        if (!token) {
            return res.status(401).json({ error: "Unauthorized - No Token Provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!);

        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized - Invalid Token" });
        }

        const user = await prisma.teachers.findUnique({
            where: {
                id: (decoded as any).id,
            },
            select: {
                id: true,
                email: true,
                name: true,
            }
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        (req as any).user = user;
        next()

    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

export const studentVerify = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split("Bearer ")[1];

        if (!token) {
            return res.status(401).json({ error: "Unauthorized - No Token Provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!);

        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized - Invalid Token" });
        }

        const user = await prisma.students.findUnique({
            where: {
                id: (decoded as any).id,
            },
            select: {
                id: true,
                email: true,
                name: true,
            }
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        (req as any).user = user;
        next()

    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

export const adminVerify = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split("Bearer ")[1];

        if (!token) {
            return res.status(401).json({ error: "Unauthorized - No Token Provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!);

        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized - Invalid Token" });
        }

        const user = await prisma.admin.findUnique({
            where: {
                id: (decoded as any).id,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true
            }
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (user.role.toLocaleLowerCase() === "admin") {
            (req as any).user = user;
            next()
        } else {
            return res.status(401).json({ error: "Unauthorized or Invalid Token" });
        }


    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}