import { FormEvent, useEffect, useState } from "react";

import type { Category, CreateRequestData, UpdateRequestData } from "../types";

interface RequestFormProps {
  initialData?: {
    title: string;
    description: string;
    category: Category;
  };

  submitLabel?: string;

  loading?: boolean;

  onSubmit: (data: CreateRequestData | UpdateRequestData) => Promise<void>;

  onCancel?: () => void;
}

const CATEGORIES: {
  value: Category;
  label: string;
}[] = [
  {
    value: "TI",
    label: "Tecnologia da Informação",
  },
  {
    value: "RH",
    label: "Recursos Humanos",
  },
  {
    value: "COMPRAS",
    label: "Compras",
  },
  {
    value: "FINANCEIRO",
    label: "Financeiro",
  },
  {
    value: "INFRAESTRUTURA",
    label: "Infraestrutura",
  },
];

const TITLE_MAX_LENGTH = 120;
const DESCRIPTION_MAX_LENGTH = 2000;

export function RequestForm({
  initialData,
  submitLabel = "Criar solicitação",
  loading = false,
  onSubmit,
  onCancel,
}: RequestFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");

  const [description, setDescription] = useState(
    initialData?.description ?? "",
  );

  const [category, setCategory] = useState<Category>(
    initialData?.category ?? "TI",
  );

  const [error, setError] = useState("");

  useEffect(() => {
    setTitle(initialData?.title ?? "");

    setDescription(initialData?.description ?? "");

    setCategory(initialData?.category ?? "TI");

    setError("");
  }, [initialData]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) {
      return;
    }

    setError("");

    const normalizedTitle = title.trim();

    const normalizedDescription = description.trim();

    if (!normalizedTitle) {
      setError("Informe o título da solicitação.");
      return;
    }

    if (!normalizedDescription) {
      setError("Informe a descrição da solicitação.");
      return;
    }

    if (normalizedTitle.length < 3) {
      setError("O título deve possuir pelo menos 3 caracteres.");
      return;
    }

    if (normalizedDescription.length < 5) {
      setError("A descrição deve possuir pelo menos 5 caracteres.");
      return;
    }

    if (normalizedTitle.length > TITLE_MAX_LENGTH) {
      setError(
        `O título pode possuir no máximo ${TITLE_MAX_LENGTH} caracteres.`,
      );
      return;
    }

    if (normalizedDescription.length > DESCRIPTION_MAX_LENGTH) {
      setError(
        `A descrição pode possuir no máximo ${DESCRIPTION_MAX_LENGTH} caracteres.`,
      );
      return;
    }

    try {
      await onSubmit({
        title: normalizedTitle,
        description: normalizedDescription,
        category,
      });

      if (!initialData) {
        setTitle("");
        setDescription("");
        setCategory("TI");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível salvar a solicitação.",
      );
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <label>
        Título
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Ex.: Problema no computador"
          maxLength={TITLE_MAX_LENGTH}
          disabled={loading}
          required
        />
        <small>
          {title.length}/{TITLE_MAX_LENGTH}
        </small>
      </label>

      <label>
        Descrição
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Descreva detalhadamente a solicitação..."
          maxLength={DESCRIPTION_MAX_LENGTH}
          disabled={loading}
          required
        />
        <small>
          {description.length}/{DESCRIPTION_MAX_LENGTH}
        </small>
      </label>

      <label>
        Categoria
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value as Category)}
          disabled={loading}
        >
          {CATEGORIES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>

      {error && (
        <div className="error" role="alert">
          {error}
        </div>
      )}

      <div className="form-actions">
        {onCancel && (
          <button
            type="button"
            className="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </button>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Salvando..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
