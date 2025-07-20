import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

type CustomJwtPayload = {
  sub: number;
};

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN!, async (err, decoded: unknown) => {
    if (err || !decoded || typeof decoded !== "object" || !("sub" in decoded)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { sub } = decoded as CustomJwtPayload;
    try {
      const user = await prisma.user.findUnique({
        where: { id: sub },
      });

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      const role = await prisma.role.findUnique({
        where: { id: user.role_id },
        select: {
          name: true,
        },
      });

      const userWithRole = {
        ...user,
        role,
      };

      req.user = userWithRole;
      next();
    } catch (error) {
      console.error("Authmiddleware error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
};
