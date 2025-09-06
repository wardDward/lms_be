import expressAsyncHandler from "express-async-handler";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { PrismaClient } from "../../../generated/prisma";
import { Request, Response } from "express";
import { generateAccessToken, generateRefreshToken } from "../../utils/token";

const prisma = new PrismaClient()


export const register = expressAsyncHandler(async (req: Request, res: Response) => {

    const { role_uuid: _role, ...userData } = req.body
    const existEmail = await prisma.user.findUnique({
        where: { email: userData.email }
    })

    if (existEmail) {
        res.status(422).json({ email: ['Email already exists.'] })
    }

    const roleExists = await prisma.role.findFirst({
        where: {
            uuid: _role
        }
    })

    if (!roleExists) {
        res.status(404).json({ errors: "Role not found" })
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10)
    const user = await prisma.user.create({
        data: {
            ...userData,
            password: hashedPassword,
            birth_day: new Date(userData.birth_day),
            role_id: roleExists?.id
        }
    })

    res.json(user)
})


export const login = expressAsyncHandler(async (req: Request, res: Response) => {

    const data = req.body

    const user = await prisma.user.findUnique({
        where: { email: data.email },
        include: { role: true }
    })

    if (!user) {
        res.status(401).json({
            errors:
                { email: ["Invalid credentials"] }
        })
        return
    }

    const checkedPassword = await bcrypt.compare(data.password, user.password)

    if (!checkedPassword) {
        res.status(422).json({
            errors:
                { email: ["Invalid credentials"] }
        })
    }


    const accessToken = generateAccessToken(user.id)
    const refreshToken = generateRefreshToken(user.id)

    await prisma.personalToken.create({
        data: {
            user_id: user.id,
            token: refreshToken,
            expired_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        }
    })

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'strict',
        path: '/',
        maxAge: 5 * 1000 // 5 seconds
    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "prodn",
        sameSite: 'strict',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days

    })

    res.json({
        accessToken: accessToken,
    })
})


export const refreshToken = expressAsyncHandler(async (req: Request, res: Response) => {
    const oldToken = req.cookies.refreshToken
    if (!oldToken) {
        res.status(401).json({ message: 'Unauthorized' })
        return
    }

    jwt.verify(oldToken, process.env.REFRESH_TOKEN!, async (err: any, decoded: any) => {
        if (err || !decoded?.sub) {
            res.clearCookie('refreshToken', { path: '/' })
            return res.status(403).json({ message: 'Invalid token.' })
        }

        const tokenDoc = await prisma.personalToken.findFirst({
            where: {
                user_id: decoded.sub,
                token: oldToken
            }
        })

        if (!tokenDoc) {
            res.clearCookie('refreshToken', { path: '/' })
            return res.status(401).json({ message: 'refresh token cannot be found.' })
        }

        // check expiration
        if (new Date() > tokenDoc.expired_at) {
            await prisma.personalToken.delete({ where: { id: tokenDoc.id, } })
            res.clearCookie('refreshToken', { path: '/' })
            return res.status(401).json({ message: 'refresh token expired.' })
        }

        const newAccessToken = generateAccessToken(decoded)
        const newRefreshToken = generateRefreshToken(decoded)

        await prisma.personalToken.delete({ where: { id: tokenDoc.id } });
        await prisma.personalToken.create({
            data: {
                user_id: decoded.sub,
                token: newRefreshToken,
                expired_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            }
        })

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
        })

        res.json({ accessToken: newAccessToken })
    })
})