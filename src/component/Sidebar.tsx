// import React from "react";

interface SidebarProps {
  onNavigate: (page: string) => void;
  current: string;
  user?: { name: string; avatar?: string };
}

const menu = [
  {
    label: "Produtos",
    page: "produtos",
    icon: <span className="text-cyan-400">📱</span>,
  },
  {
    label: "Meus Pedidos",
    page: "pedidos",
    icon: <span className="text-yellow-400">📦</span>,
  },
  {
    label: "Perfil",
    page: "perfil",
    icon: <span className="text-blue-300">👤</span>,
  },
  {
    label: "Sair",
    page: "logout",
    icon: <span className="text-red-400">🚪</span>,
  },
];

export default function Sidebar({ onNavigate, current, user }: SidebarProps) {
  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-blue-800 via-blue-700 to-blue-500 text-white flex flex-col py-10 px-6 shadow-2xl rounded-tr-3xl rounded-br-3xl z-50">
      <div className="mb-8 text-center flex flex-col items-center gap-2">
        <img
          src={
            user?.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              user?.name || "U"
            )}`
          }
          alt="avatar"
          className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
        />
        <div className="text-xl font-bold mt-2 tracking-tight drop-shadow">
          {user?.name || "Usuário"}
        </div>
      </div>
      <div className="mb-8 text-center">
        <div className="text-3xl font-extrabold mb-1 tracking-tight drop-shadow">
          ShopSmart
        </div>
        <div className="text-xs text-blue-200 font-semibold">
          Sua loja de smartphones
        </div>
      </div>
      <nav className="flex-1" aria-label="Menu lateral">
        <ul className="space-y-2">
          {menu
            .filter((item) => item.page !== "logout")
            .map((item) => (
              <li key={item.page}>
                <button
                  className={`w-full flex items-center gap-3 px-5 py-3 rounded-xl transition font-semibold text-lg tracking-tight ${
                    current === item.page
                      ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg scale-105"
                      : "hover:bg-blue-600/60 hover:scale-105"
                  }`}
                  onClick={() => onNavigate(item.page)}
                  aria-current={current === item.page ? "page" : undefined}
                  aria-label={item.label}
                  type="button"
                >
                  {item.icon} {item.label}
                </button>
              </li>
            ))}
        </ul>
      </nav>
      {/* Botão Sair separado, próximo ao rodapé */}
      <div className="mt-6">
        <button
          className={`w-full flex items-center gap-3 px-5 py-3 rounded-xl transition font-semibold text-lg tracking-tight hover:bg-blue-600/60 hover:scale-105 text-red-400`}
          onClick={() => onNavigate("logout")}
          aria-label="Sair"
          type="button"
        >
          <span className="text-red-400">🚪</span> Sair
        </button>
      </div>
      <div className="mt-10 text-xs text-blue-200 text-center font-semibold">
        © 2025 ShopSmart
      </div>
    </aside>
  );
}
