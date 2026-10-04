import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { env } from "../lib/env";
import { loginSchema } from "../schemas/auth";

export async function login(req: Request, res: Response) {
  const data = loginSchema.parse(req.body);
  const user = await prisma.user.findUnique({
    where: { username: data.username },
  });

  if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) {
    return res.status(401).json({ message: "Usuário ou senha inválidos." });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username },
    env.JWT_SECRET,
    { expiresIn: "8h" },
  );

  return res.json({
    token,
    user: { id: user.id, username: user.username },
  });
}

export async function me(req: Request, res: Response) {
  return res.json({ user: req.user });
}

export async function logout(_req: Request, res: Response) {
  // JWT é stateless. O frontend remove o token localmente.
  return res.status(204).send();
}
