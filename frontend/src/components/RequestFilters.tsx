import { useEffect, useState } from "react";

import type {
  Category,
  RequestFilters as RequestFiltersType,
  Status,
} from "../types";

interface RequestFiltersProps {
  filters: RequestFiltersType;
  onApply: (filters: RequestFiltersType) => void;
  onClear: () => void;
}

const CATEGORIES: {
  value: Category;
  label: string;
}[] = [
  { value: "TI", label: "TI" },
  { value: "RH", label: "Recursos Humanos" },
  { value: "COMPRAS", label: "Compras" },
  { value: "FINANCEIRO", label: "Financeiro" },
  {
    value: "INFRAESTRUTURA",
    label: "Infraestrutura",
  },
];

const STATUSES: {
  value: Status;
  label: string;
}[] = [
  { value: "ABERTO", label: "Aberto" },
  {
    value: "EM_ATENDIMENTO",
    label: "Em atendimento",
  },
  { value: "CONCLUIDO", label: "Concluído" },
];

export function RequestFilters({
  filters,
  onApply,
  onClear,
}: RequestFiltersProps) {
  const [draft, setDraft] = useState<RequestFiltersType>(filters);

  useEffect(() => {
    setDraft(filters);
  }, [filters]);

  function update(field: keyof RequestFiltersType, value: string) {
    setDraft((current) => ({
      ...current,
      [field]: value || undefined,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onApply(draft);
  }

  const hasFilters = Object.values(draft).some(Boolean);

  return (
    <form className="filters" onSubmit={handleSubmit}>
      <div className="filter-field">
        <label htmlFor="filter-title">Título</label>

        <input
          id="filter-title"
          type="search"
          placeholder="Pesquisar..."
          value={draft.title ?? ""}
          onChange={(event) => update("title", event.target.value)}
        />
      </div>

      <div className="filter-field">
        <label htmlFor="filter-category">Categoria</label>

        <select
          id="filter-category"
          value={draft.category ?? ""}
          onChange={(event) => update("category", event.target.value)}
        >
          <option value="">Todas</option>

          {CATEGORIES.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-field">
        <label htmlFor="filter-status">Estado</label>

        <select
          id="filter-status"
          value={draft.status ?? ""}
          onChange={(event) => update("status", event.target.value)}
        >
          <option value="">Todos</option>

          {STATUSES.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-field">
        <label htmlFor="filter-start-date">Data inicial</label>

        <input
          id="filter-start-date"
          type="date"
          value={draft.startDate ?? ""}
          onChange={(event) => update("startDate", event.target.value)}
        />
      </div>

      <div className="filter-field">
        <label htmlFor="filter-end-date">Data final</label>

        <input
          id="filter-end-date"
          type="date"
          value={draft.endDate ?? ""}
          onChange={(event) => update("endDate", event.target.value)}
        />
      </div>

      <div className="filter-actions">
        <button type="submit" disabled={!hasFilters}>
          Pesquisar
        </button>

        {hasFilters && (
          <button type="button" className="secondary" onClick={onClear}>
            Limpar filtros
          </button>
        )}
      </div>
    </form>
  );
}
