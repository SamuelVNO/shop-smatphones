import { useState } from "react";

interface LoginProps {
  onLogin: (user: { email: string; name: string }) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTimeout(() => {
      if (isRegister) {
        if (name && email && password) {
          onLogin({ name, email });
        } else {
          setError("Preencha todos os campos.");
        }
      } else {
        if (email && password) {
          // Simulação: se for a primeira vez, pede cadastro
          setError("Usuário não encontrado. Clique em 'Criar conta'.");
        } else {
          setError("Preencha todos os campos.");
        }
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-sm flex flex-col gap-4"
      >
        <h1 className="text-2xl font-bold text-center mb-4">
          {isRegister ? "Criar Conta" : "Entrar na ShopSmart"}
        </h1>
        {isRegister && (
          <input
            type="text"
            placeholder="Nome"
            className="p-3 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
        <input
          type="email"
          placeholder="E-mail"
          className="p-3 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          className="p-3 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold text-lg shadow transition"
          disabled={loading}
        >
          {loading
            ? isRegister
              ? "Criando..."
              : "Entrando..."
            : isRegister
            ? "Criar Conta"
            : "Entrar"}
        </button>
        <div className="text-center mt-2">
          {isRegister ? (
            <span className="text-sm">
              Já tem conta?{" "}
              <button
                type="button"
                className="text-blue-600 hover:underline"
                onClick={() => {
                  setIsRegister(false);
                  setError("");
                }}
              >
                Entrar
              </button>
            </span>
          ) : (
            <span className="text-sm">
              Não tem conta?{" "}
              <button
                type="button"
                className="text-blue-600 hover:underline"
                onClick={() => {
                  setIsRegister(true);
                  setError("");
                }}
              >
                Criar conta
              </button>
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
