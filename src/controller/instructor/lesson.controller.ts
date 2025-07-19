import expressAsyncHandler from "express-async-handler";
import { PrismaClient } from "../../../generated/prisma";
import {Request, Response} from 'express'

const prisma = new PrismaClient()


export const updateLesson = expressAsyncHandler(async(req: Request, res: Response) => {

})