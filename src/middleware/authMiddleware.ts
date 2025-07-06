import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
     res.status(401).json({ error: "Unauthorized" });
     return
  }

  jwt.verify(token, process.env.ACCESS_TOKEN!, (err, decoded) => {
    if (err) {
       res.status(403).json({ message: "Forbidden" });
       return
    }
    // res.json(decoded)
    req.user = decoded;
    next();
  });
};
