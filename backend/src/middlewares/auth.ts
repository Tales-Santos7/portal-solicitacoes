import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../lib/env";
import { AuthUser } from "../types/auth";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Não autenticado." });
  }

  try {
    const token = header.substring(7);
    const payload = jwt.verify(token, env.JWT_SECRET) as AuthUser;
    req.user = { id: payload.id, username: payload.username };
    next();
  } catch {
    return res.status(401).json({ message: "Token inválido ou expirado." });
  }
}
