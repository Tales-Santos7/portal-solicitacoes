import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import {
  createRequestSchema,
  filtersSchema,
  statusSchema,
  updateRequestSchema,
} from "../schemas/request";

export async function listRequests(req: Request, res: Response) {
  const filters = filtersSchema.parse(req.query);

  const where: any = {
    ...(filters.title
      ? { title: { contains: filters.title, mode: "insensitive" } }
      : {}),
    ...(filters.category ? { category: filters.category } : {}),
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.startDate || filters.endDate
      ? {
          createdAt: {
            ...(filters.startDate ? { gte: new Date(filters.startDate) } : {}),
            ...(filters.endDate
              ? { lte: new Date(`${filters.endDate}T23:59:59.999`) }
              : {}),
          },
        }
      : {}),
  };

  const requests = await prisma.request.findMany({
    where,
    include: { user: { select: { id: true, username: true } } },
    orderBy: { createdAt: "desc" },
  });

  return res.json(requests);
}

export async function getRequest(req: Request, res: Response) {
  const id = Number(req.params.id);
  const item = await prisma.request.findUnique({
    where: { id },
    include: { user: { select: { id: true, username: true } } },
  });

  if (!item)
    return res.status(404).json({ message: "Solicitação não encontrada." });
  return res.json(item);
}

export async function createRequest(req: Request, res: Response) {
  const data = createRequestSchema.parse(req.body);

  const item = await prisma.request.create({
    data: { ...data, userId: req.user!.id },
    include: { user: { select: { id: true, username: true } } },
  });

  return res.status(201).json(item);
}

export async function updateRequest(req: Request, res: Response) {
  const id = Number(req.params.id);
  const data = updateRequestSchema.parse(req.body);

  const existing = await prisma.request.findUnique({ where: { id } });

  if (!existing)
    return res.status(404).json({ message: "Solicitação não encontrada." });
  if (existing.status !== "ABERTO") {
    return res
      .status(409)
      .json({ message: "Somente solicitações abertas podem ser editadas." });
  }
  if (existing.userId !== req.user!.id) {
    return res
      .status(403)
      .json({ message: "Você só pode editar suas próprias solicitações." });
  }

  const item = await prisma.request.update({
    where: { id },
    data,
    include: { user: { select: { id: true, username: true } } },
  });

  return res.json(item);
}

export async function deleteRequest(req: Request, res: Response) {
  const id = Number(req.params.id);
  const existing = await prisma.request.findUnique({ where: { id } });

  if (!existing)
    return res.status(404).json({ message: "Solicitação não encontrada." });
  if (existing.status !== "ABERTO") {
    return res
      .status(409)
      .json({ message: "Somente solicitações abertas podem ser excluídas." });
  }
  if (existing.userId !== req.user!.id) {
    return res
      .status(403)
      .json({ message: "Você só pode excluir suas próprias solicitações." });
  }

  await prisma.request.delete({ where: { id } });
  return res.status(204).send();
}

export async function updateStatus(req: Request, res: Response) {
  const id = Number(req.params.id);
  const { status } = statusSchema.parse(req.body);

  const existing = await prisma.request.findUnique({ where: { id } });
  if (!existing)
    return res.status(404).json({ message: "Solicitação não encontrada." });

  const item = await prisma.request.update({
    where: { id },
    data: { status },
    include: { user: { select: { id: true, username: true } } },
  });

  return res.json(item);
}

export async function dashboard(_req: Request, res: Response) {
  const [total, abertas, atendimento, concluidas] = await Promise.all([
    prisma.request.count(),
    prisma.request.count({ where: { status: "ABERTO" } }),
    prisma.request.count({ where: { status: "EM_ATENDIMENTO" } }),
    prisma.request.count({ where: { status: "CONCLUIDO" } }),
  ]);

  return res.json({ total, abertas, atendimento, concluidas });
}
