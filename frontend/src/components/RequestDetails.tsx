import type { RequestItem } from "../types";

import { StatusBadge } from "./StatusBadge";

interface RequestDetailsProps {
  request: RequestItem;
}

const CATEGORY_LABELS: Record<string, string> = {
  TI: "Tecnologia da Informação",
  RH: "Recursos Humanos",
  COMPRAS: "Compras",
  FINANCEIRO: "Financeiro",
  INFRAESTRUTURA: "Infraestrutura",
};

function formatDate(date?: string) {
  if (!date) {
    return "-";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function getCategoryLabel(category: string) {
  return CATEGORY_LABELS[category] ?? category;
}

export function RequestDetails({ request }: RequestDetailsProps) {
  return (
    <div className="request-details">
      <div className="details-header">
        <div>
          <span className="details-id">Solicitação #{request.id}</span>

          <h3>{request.title}</h3>
        </div>

        <StatusBadge status={request.status} />
      </div>

      <div className="details-grid">
        <div className="detail-item">
          <span className="detail-label">Categoria</span>

          <strong>{getCategoryLabel(request.category)}</strong>
        </div>

        <div className="detail-item">
          <span className="detail-label">Solicitante</span>

          <strong>{request.user.username}</strong>
        </div>

        <div className="detail-item">
          <span className="detail-label">Criada em</span>

          <strong>{formatDate(request.createdAt)}</strong>
        </div>

        <div className="detail-item">
          <span className="detail-label">Atualizada em</span>

          <strong>{formatDate(request.updatedAt)}</strong>
        </div>
      </div>

      <div className="detail-description">
        <span className="detail-label">Descrição</span>

        <p>{request.description}</p>
      </div>
    </div>
  );
}
