import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  username?: string;
  onLogout: () => void;
}

export function Layout({ children, username, onLogout }: LayoutProps) {
  return (
    <main className="app-container">
      <header className="app-header">
        <div className="brand">
          <img src="https://i.ibb.co/8nFcML0Q/ODF.png" alt="Logo" className="brand-icon" />
          <div>
            <h1>Portal de Solicitações</h1>

            <p>Gestão de demandas internas</p>
          </div>
        </div>

        <div className="header-user">
          {username && <span className="username">{username}</span>}

          <button type="button" className="secondary" onClick={onLogout}>
            Sair
          </button>
        </div>
      </header>

      <div className="app-content">{children}</div>
    </main>
  );
}
