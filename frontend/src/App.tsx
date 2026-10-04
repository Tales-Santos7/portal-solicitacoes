import { FormEvent, useCallback, useEffect, useState } from "react";

import { Layout } from "./components/Layout";
import { MetricCard } from "./components/MetricCard";
import { Modal } from "./components/Modal";
import { RequestDetails } from "./components/RequestDetails";
import { RequestFilters } from "./components/RequestFilters";
import { RequestForm } from "./components/RequestForm";
import { RequestTable } from "./components/RequestTable";

import { api } from "./services/api";

import type {
  CreateRequestData,
  Dashboard,
  RequestFilters as RequestFiltersType,
  RequestItem,
  Status,
  UpdateRequestData,
  User,
} from "./types";

interface LoginProps {
  onLogin: (user: User) => void;
}

function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = await api.login({
        username: username.trim(),
        password,
      });

      localStorage.setItem("token", result.token);

      onLogin(result.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível entrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login">
      <form className="card form login-card" onSubmit={handleSubmit}>
        <div className="login-header">
          <img src="https://i.ibb.co/8nFcML0Q/ODF.png" alt="" className="login-icon"/>

          <h1>Portal de Solicitações</h1>

          <p>Acesso interno ao sistema</p>
        </div>

        <label>
          Usuário
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            disabled={loading}
            required
          />
        </label>

        <label>
          Senha
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            disabled={loading}
            required
          />
        </label>

        {error && (
          <div className="error" role="alert">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !username.trim() || !password}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}

const EMPTY_DASHBOARD: Dashboard = {
  total: 0,
  abertas: 0,
  atendimento: 0,
  concluidas: 0,
};

function App() {
  const [user, setUser] = useState<User | null>(null);

  const [checkingAuth, setCheckingAuth] = useState(true);

  const [items, setItems] = useState<RequestItem[]>([]);

  const [dashboard, setDashboard] = useState<Dashboard>(EMPTY_DASHBOARD);

  const [filters, setFilters] = useState<RequestFiltersType>({});

  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(
    null,
  );

  const [editingRequest, setEditingRequest] = useState<RequestItem | null>(
    null,
  );

  const [showCreate, setShowCreate] = useState(false);

  const loadData = useCallback(
    async (currentFilters: RequestFiltersType = filters) => {
      setLoading(true);
      setError("");

      try {
        const [requests, indicators] = await Promise.all([
          api.requests(currentFilters),
          api.dashboard(),
        ]);

        setItems(requests);
        setDashboard(indicators);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Não foi possível carregar os dados.",
        );
      } finally {
        setLoading(false);
      }
    },
    [filters],
  );

  /*
   * Restaura a sessão existente.
   */
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setCheckingAuth(false);
      return;
    }

    let active = true;

    async function restoreSession() {
      try {
        const currentUser = await api.me();

        if (active) {
          setUser(currentUser);
        }
      } catch {
        localStorage.removeItem("token");

        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setCheckingAuth(false);
        }
      }
    }

    restoreSession();

    return () => {
      active = false;
    };
  }, []);

  /*
   * Trata expiração da sessão.
   */
  useEffect(() => {
    function handleAuthExpired() {
      localStorage.removeItem("token");

      setUser(null);
      setItems([]);
      setDashboard(EMPTY_DASHBOARD);
      setSelectedRequest(null);
      setEditingRequest(null);
      setShowCreate(false);
    }

    window.addEventListener("auth:expired", handleAuthExpired);

    return () => {
      window.removeEventListener("auth:expired", handleAuthExpired);
    };
  }, []);

  /*
   * Carrega os dados quando o utilizador
   * está autenticado ou quando os filtros
   * aplicados são alterados.
   */
  useEffect(() => {
    if (!user) {
      return;
    }

    loadData();
  }, [user, loadData]);

  async function handleCreate(data: CreateRequestData) {
    setSaving(true);
    setError("");

    try {
      await api.createRequest(data);

      setShowCreate(false);

      await loadData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível criar a solicitação.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(data: UpdateRequestData) {
    if (!editingRequest) {
      return;
    }

    setSaving(true);
    setError("");

    try {
      await api.updateRequest(editingRequest.id, data);

      setEditingRequest(null);

      await loadData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível atualizar a solicitação.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(item: RequestItem, status: Status) {
    if (item.status === status || saving) {
      return;
    }

    setError("");
    setSaving(true);

    try {
      await api.updateStatus(item.id, status);

      await loadData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível alterar o estado.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item: RequestItem) {
    if (saving) {
      return;
    }

    const confirmed = window.confirm(
      `Deseja realmente excluir a solicitação #${item.id}?`,
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSaving(true);

    try {
      await api.deleteRequest(item.id);

      if (selectedRequest?.id === item.id) {
        setSelectedRequest(null);
      }

      await loadData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível excluir a solicitação.",
      );
    } finally {
      setSaving(false);
    }
  }

  function handleLogin(currentUser: User) {
    setUser(currentUser);
    setError("");
  }

  async function handleLogout() {
    try {
      await api.logout();
    } catch {
      /*
       * Mesmo que o servidor não responda,
       * a sessão local deve ser encerrada.
       */
    } finally {
      localStorage.removeItem("token");

      setUser(null);
      setItems([]);
      setDashboard(EMPTY_DASHBOARD);
      setFilters({});
      setSelectedRequest(null);
      setEditingRequest(null);
      setShowCreate(false);
      setError("");
    }
  }

  function handleFiltersApply(nextFilters: RequestFiltersType) {
    setFilters(nextFilters);
  }

  function clearFilters() {
    setFilters({});
  }

  if (checkingAuth) {
    return (
      <main className="loading-screen">
        <p>Verificando sessão...</p>
      </main>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout username={user.username} onLogout={handleLogout}>
      <section className="page-heading">
        <div>
          <h2>Dashboard</h2>

          <p>Acompanhe e gerencie as solicitações internas.</p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreate(true)}
          disabled={saving}
        >
          Nova solicitação
        </button>
      </section>

      <section className="metrics">
        <MetricCard label="Total" value={dashboard.total} />

        <MetricCard label="Abertas" value={dashboard.abertas} />

        <MetricCard label="Em atendimento" value={dashboard.atendimento} />

        <MetricCard label="Concluídas" value={dashboard.concluidas} />
      </section>

      <section className="card requests-card">
        <div className="section-heading">
          <div>
            <h2>Solicitações</h2>

            <p>Consulte, filtre e gerencie as solicitações cadastradas.</p>
          </div>
        </div>

        <RequestFilters
          filters={filters}
          onApply={handleFiltersApply}
          onClear={clearFilters}
        />

        {error && (
          <div className="error" role="alert">
            {error}
          </div>
        )}

        <RequestTable
          items={items}
          currentUserId={user.id}
          loading={loading}
          onView={setSelectedRequest}
          onEdit={setEditingRequest}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      </section>

      <Modal
        open={showCreate}
        title="Nova solicitação"
        onClose={() => !saving && setShowCreate(false)}
        width="medium"
      >
        <RequestForm
          submitLabel="Criar solicitação"
          loading={saving}
          onSubmit={handleCreate}
          onCancel={() => !saving && setShowCreate(false)}
        />
      </Modal>

      <Modal
        open={Boolean(editingRequest)}
        title="Editar solicitação"
        onClose={() => !saving && setEditingRequest(null)}
        width="medium"
      >
        {editingRequest && (
          <RequestForm
            initialData={{
              title: editingRequest.title,
              description: editingRequest.description,
              category: editingRequest.category,
            }}
            submitLabel="Salvar alterações"
            loading={saving}
            onSubmit={handleUpdate}
            onCancel={() => !saving && setEditingRequest(null)}
          />
        )}
      </Modal>

      <Modal
        open={Boolean(selectedRequest)}
        title="Detalhes da solicitação"
        onClose={() => setSelectedRequest(null)}
        width="large"
      >
        {selectedRequest && <RequestDetails request={selectedRequest} />}
      </Modal>
    </Layout>
  );
}

export default App;
