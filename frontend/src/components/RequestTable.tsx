import type { RequestItem, Status } from "../types";

import { StatusBadge } from "./StatusBadge";

interface RequestTableProps {
  items: RequestItem[];
  currentUserId?: number;
  loading?: boolean;
  onView: (item: RequestItem) => void;
  onEdit: (item: RequestItem) => void;
  onDelete: (item: RequestItem) => void;
  onStatusChange: (item: RequestItem, status: Status) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  TI: "TI",
  RH: "Recursos Humanos",
  COMPRAS: "Compras",
  FINANCEIRO: "Financeiro",
  INFRAESTRUTURA: "Infraestrutura",
};

const STATUS_OPTIONS: {
  value: Status;
  label: string;
}[] = [
  {
    value: "ABERTO",
    label: "Aberto",
  },
  {
    value: "EM_ATENDIMENTO",
    label: "Em atendimento",
  },
  {
    value: "CONCLUIDO",
    label: "Concluído",
  },
];

function formatDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export function RequestTable({
  items,
  currentUserId,
  loading = false,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
}: RequestTableProps) {
  if (loading) {
    return (
      <div className="table-state" role="status">
        <p>Carregando solicitações...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="table-state">
        <p>Nenhuma solicitação encontrada.</p>
      </div>
    );
  }

  return (
    <div className="request-table-wrapper">
      <table className="request-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Solicitação</th>
            <th>Categoria</th>
            <th>Solicitante</th>
            <th>Data</th>
            <th>Estado</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => {
            const isOwner = item.user.id === currentUserId;

            const canEdit = isOwner && item.status === "ABERTO";

            const canDelete = isOwner && item.status === "ABERTO";

            return (
              <tr key={item.id}>
                <td>
                  <span className="request-id">#{item.id}</span>
                </td>

                <td>
                  <div className="request-title">
                    <strong>{item.title}</strong>

                    <span>{item.description}</span>
                  </div>
                </td>

                <td>{CATEGORY_LABELS[item.category] ?? item.category}</td>

                <td>{item.user.username}</td>

                <td>{formatDate(item.createdAt)}</td>

                <td>
                  <div className="status-cell">
                    <StatusBadge status={item.status} />

                    <select
                      value={item.status}
                      onChange={(event) =>
                        onStatusChange(item, event.target.value as Status)
                      }
                      aria-label={`Alterar estado da solicitação ${item.id}`}
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </td>

                <td>
                  <div className="table-actions">
                    <button
                      type="button"
                      className="secondary"
                      onClick={() => onView(item)}
                    >
                      Ver
                    </button>

                    {canEdit && (
                      <button
                        type="button"
                        className="secondary"
                        onClick={() => onEdit(item)}
                      >
                        Editar
                      </button>
                    )}

                    {canDelete && (
                      <button
                        type="button"
                        className="danger"
                        onClick={() => onDelete(item)}
                      >
                        Excluir
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
