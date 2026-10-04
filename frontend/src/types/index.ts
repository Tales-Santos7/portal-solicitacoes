export type Category =
  | "TI"
  | "RH"
  | "COMPRAS"
  | "FINANCEIRO"
  | "INFRAESTRUTURA";

export type Status = "ABERTO" | "EM_ATENDIMENTO" | "CONCLUIDO";

export interface User {
  id: number;
  username: string;
}

export interface RequestItem {
  id: number;
  title: string;
  description: string;
  category: Category;
  status: Status;
  createdAt: string;
  updatedAt?: string;
  user: User;
}

export interface Dashboard {
  total: number;
  abertas: number;
  atendimento: number;
  concluidas: number;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface CreateRequestData {
  title: string;
  description: string;
  category: Category;
}

export interface UpdateRequestData {
  title: string;
  description: string;
  category: Category;
}

export interface RequestFilters {
  title?: string;
  category?: Category;
  status?: Status;
  startDate?: string;
  endDate?: string;
}

export const CATEGORIES: Category[] = [
  "TI",
  "RH",
  "COMPRAS",
  "FINANCEIRO",
  "INFRAESTRUTURA",
];

export const STATUSES: Status[] = ["ABERTO", "EM_ATENDIMENTO", "CONCLUIDO"];
