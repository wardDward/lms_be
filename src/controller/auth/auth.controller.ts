import expressAsyncHandler from "express-async-handler";
import bcrypt from 'bcryptjs'
import { PrismaClient } from "../../../generated/prisma";
import { Request, Response } from "express";
import { generateAccessToken, generateRefreshToken } from "../../utils/token";

const prisma = new PrismaClient()


export const register = expressAsyncHandler(async (req: Request, res: Response) => {

    const data = req.body

    const existEmail = await prisma.user.findUnique({
        where: { email: data.email }
    })

    if (existEmail) {
        throw new Error('Email is already exists.')
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)
    const user = await prisma.user.create({
        data: {
            ...data,
            password: hashedPassword,
            birth_day: new Date(data.birth_day)
        }
    })

    res.json(user)
})


export const login = expressAsyncHandler(async (req: Request, res: Response) => {

    const data = req.body

    const user = await prisma.user.findUnique({
        where: {
            email: data.email
        }
    })

    if (!user) {
        res.status(401).json({
            message: "Invalid credentials"
        })
        return
    }

    const checkedPassword = await bcrypt.compare(data.password, user.password)

    if (!checkedPassword) {
        res.status(422).json({
            message: "Invalid credentials"
        })
    }

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    await prisma.personalToken.create({
        data: {
            user_id: user.id,
            token: refreshToken
        }
    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    })

    res.json(accessToken)
})