import type { Status } from "../types";

interface StatusBadgeProps {
  status: Status;
}

const STATUS_LABELS: Record<Status, string> = {
  ABERTO: "Aberto",
  EM_ATENDIMENTO: "Em atendimento",
  CONCLUIDO: "Concluído",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const label = STATUS_LABELS[status] ?? status;

  return (
    <span
      className={`status-badge status-${status.toLowerCase()}`}
      aria-label={`Estado: ${label}`}
    >
      {label}
    </span>
  );
}
