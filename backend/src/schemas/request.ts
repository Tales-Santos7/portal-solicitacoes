import { z } from "zod";

export const categories = [
  "TI",
  "RH",
  "COMPRAS",
  "FINANCEIRO",
  "INFRAESTRUTURA",
] as const;
export const statuses = ["ABERTO", "EM_ATENDIMENTO", "CONCLUIDO"] as const;

export const createRequestSchema = z.object({
  title: z.string().trim().min(3).max(150),
  description: z.string().trim().min(5),
  category: z.enum(categories),
});

export const updateRequestSchema = createRequestSchema.partial();

export const statusSchema = z.object({
  status: z.enum(statuses),
});

export const filtersSchema = z.object({
  title: z.string().optional(),
  category: z.enum(categories).optional(),
  status: z.enum(statuses).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});
