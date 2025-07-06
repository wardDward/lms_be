import expressAsyncHandler from "express-async-handler";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
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
            birth_day: new Date(data.birth_day),
            role_id: "68655848ce9060512e41d140"
        }
    })

    res.json(user)
})


export const login = expressAsyncHandler(async (req: Request, res: Response) => {

    const data = req.body

    const user = await prisma.user.findUnique({
        where: { email: data.email },
        include: {
            role: {
                select: {
                    name: true
                }
            }
        }
    })

    if (!user) {
        res.status(401).json({ message: "Invalid credentials" })
        return
    }

    const checkedPassword = await bcrypt.compare(data.password, user.password)

    if (!checkedPassword) {
        res.status(422).json({ message: "Invalid credentials" })
    }

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    await prisma.personalToken.create({
        data: {
            user_id: user.id,
            token: refreshToken,
            expired_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        }
    })

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    })

    res.json(accessToken)
})


export const refreshToken = expressAsyncHandler(async (req: Request, res: Response) => {
    const oldToken = req.cookies.refreshToken

    if (!oldToken) {
        res.status(401).json({ message: 'Unauthorized' })
        return
    }

    jwt.verify(oldToken, process.env.REFRESH_TOKEN!, async (err: any, decoded: any) => {
        if (err || !decoded?.id) {
            res.clearCookie('refreshToken')
            return res.status(401).json({ message: 'Invalid token.' })
        }

        const tokenDoc = await prisma.personalToken.findFirst({
            where: {
                user_id: decoded.id,
                token: oldToken
            }
        })

        if (!tokenDoc) {
            res.clearCookie('refreshToken')
            return res.status(401).json({ message: 'refresh token cannot be found.' })
        }

        // check expiration
        if (new Date() > tokenDoc.expired_at) {
            await prisma.personalToken.delete({ where: { id: tokenDoc.id, } })
            res.clearCookie('refreshToken')
            return res.status(401).json({ message: 'refresh token expired.' })
        }

        const newAccessToken = generateAccessToken(decoded)
        const newRefreshToken = generateRefreshToken(decoded)

        await prisma.personalToken.create({
            data: {
                user_id: decoded.id,
                token: newRefreshToken,
                expired_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            }
        })

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        })

        res.json(newAccessToken)
    })
})