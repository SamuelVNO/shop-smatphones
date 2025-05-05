import { useRef, useState, useEffect } from "react";

interface Endereco {
  cep: string;
  endereco: string;
  numero: string;
  complemento?: string;
}

interface PerfilProps {
  user: { name: string; email: string; avatar?: string; telefones?: string[] };
  setUser: (user: {
    name: string;
    email: string;
    avatar?: string;
    telefones?: string[];
  }) => void;
  enderecos: Endereco[];
  setEnderecos: (ends: Endereco[]) => void;
}

export default function Perfil({
  user,
  setUser,
  enderecos,
  setEnderecos,
}: PerfilProps) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [avatar, setAvatar] = useState(user.avatar || "");
  const [telefones, setTelefones] = useState<string[]>([""]);
  const [cpf, setCpf] = useState("");
  const [novoEndereco, setNovoEndereco] = useState<Endereco>({
    cep: "",
    endereco: "",
    numero: "",
    complemento: "",
  });
  const [cepLoading, setCepLoading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [editError, setEditError] = useState("");

  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
    setAvatar(user.avatar || "");
    setTelefones(
      user.telefones && Array.isArray(user.telefones) ? user.telefones : [""]
    );
  }, [user]);

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAvatar(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditSave = () => {
    if (!name || !email) {
      setEditError("Preencha nome e e-mail.");
      return;
    }
    setUser({ ...user, name, email, avatar, telefones });
    setShowEdit(false);
    setEditError("");
  };

  const buscarCep = async () => {
    if (!novoEndereco.cep) return;
    setCepLoading(true);
    try {
      const res = await fetch(
        `https://viacep.com.br/ws/${novoEndereco.cep.replace(/\D/g, "")}/json/`
      );
      const data = await res.json();
      if (data.erro) {
        setNovoEndereco({ ...novoEndereco, endereco: "" });
      } else {
        setNovoEndereco({
          ...novoEndereco,
          endereco: `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`,
        });
      }
    } catch {
      setNovoEndereco({ ...novoEndereco, endereco: "" });
    }
    setCepLoading(false);
  };

  const handleAddEndereco = () => {
    if (!novoEndereco.cep || !novoEndereco.endereco || !novoEndereco.numero)
      return;
    setEnderecos([...enderecos, novoEndereco]);
    setNovoEndereco({ cep: "", endereco: "", numero: "", complemento: "" });
  };

  const handleRemoveEndereco = (idx: number) => {
    setEnderecos(enderecos.filter((_, i) => i !== idx));
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center gap-10 p-8 bg-gray-100">
      {/* Modal de edição de dados */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md flex flex-col gap-6 border border-gray-200 relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold"
              onClick={() => setShowEdit(false)}
              title="Fechar"
            >
              ×
            </button>
            <h2 className="text-xl font-bold text-center mb-2">Editar Dados</h2>
            <div className="flex flex-col items-center gap-2">
              <img
                src={
                  avatar ||
                  "https://ui-avatars.com/api/?name=" + encodeURIComponent(name)
                }
                alt="avatar"
                className="w-20 h-20 rounded-full object-cover border-4 border-orange-400 shadow"
              />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInput}
                onChange={handleAvatar}
              />
              <button
                className="mt-1 px-3 py-1 bg-blue-600 text-white rounded shadow hover:bg-blue-700 text-sm"
                onClick={() => fileInput.current?.click()}
              >
                Trocar foto
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <label className="font-semibold text-sm">Nome</label>
              <input
                className="p-3 border rounded bg-gray-50 text-gray-900 text-base"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome"
              />
              <label className="font-semibold text-sm">E-mail</label>
              <input
                className="p-3 border rounded bg-gray-50 text-gray-900 text-base"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail"
              />
              <label className="font-semibold text-sm">Telefones</label>
              {telefones.map((tel, idx) => (
                <div key={idx} className="flex gap-2 items-center mb-1">
                  <input
                    className="p-3 border rounded bg-gray-50 text-gray-900 text-base flex-1"
                    value={tel}
                    onChange={(e) => {
                      const novos = [...telefones];
                      novos[idx] = e.target.value;
                      setTelefones(novos);
                    }}
                    placeholder={`Telefone ${idx + 1}`}
                  />
                  {telefones.length > 1 && (
                    <button
                      type="button"
                      className="text-red-500 hover:bg-red-100 rounded-full p-2 transition text-xs font-semibold"
                      onClick={() =>
                        setTelefones(telefones.filter((_, i) => i !== idx))
                      }
                      title="Remover telefone"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs font-semibold hover:bg-blue-200 transition"
                onClick={() => setTelefones([...telefones, ""])}
              >
                + Adicionar telefone
              </button>
              <label className="font-semibold text-sm">CPF</label>
              <input
                className="p-3 border rounded bg-gray-50 text-gray-900 text-base"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="CPF"
              />
              {editError && (
                <div className="text-xs text-red-600 mt-1">{editError}</div>
              )}
              <button
                className="bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 text-white py-3 rounded-lg font-bold mt-2 shadow transition hover:scale-105 text-base"
                onClick={handleEditSave}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Card de boas-vindas */}
      <div className="w-full max-w-3xl bg-white rounded-xl shadow p-6 flex items-center gap-6 border border-gray-200">
        <div className="flex items-center gap-4 flex-1">
          <img
            src={
              avatar ||
              "https://ui-avatars.com/api/?name=" + encodeURIComponent(name)
            }
            alt="avatar"
            className="w-20 h-20 rounded-full object-cover border-4 border-orange-400 shadow"
          />
          <div className="flex flex-col gap-1">
            <span className="text-xl font-bold text-gray-900">
              Bem-vindo, {name}
            </span>
            <span className="text-gray-600 text-sm">{email}</span>
          </div>
        </div>
        <button
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-bold text-base shadow"
          onClick={() => setShowEdit(true)}
        >
          <svg
            className="inline w-5 h-5 mr-2 -mt-1"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 10-4-4l-8 8v3zm0 0v3h3"
            />
          </svg>
          Editar dados
        </button>
      </div>
      {/* Endereços cadastrados */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 border border-gray-100 flex flex-col gap-6 transition hover:shadow-2xl">
        <h2 className="text-2xl font-bold mb-2 text-blue-700 text-center tracking-tight">
          Endereços cadastrados
        </h2>
        <div className="flex flex-col gap-3">
          {enderecos.length === 0 && (
            <div className="text-gray-500 text-center py-6">
              Nenhum endereço cadastrado.
            </div>
          )}
          {enderecos.map((end, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between bg-gray-50 rounded-lg shadow-sm px-4 py-3 border border-gray-100 hover:shadow-md transition group"
            >
              <div className="flex items-center gap-3">
                <span className="text-blue-500 text-xl">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 21c-4.418 0-8-4.03-8-9a8 8 0 1116 0c0 4.97-3.582 9-8 9z"
                    />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </span>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800 group-hover:text-blue-700 transition">
                    {end.cep} - {end.endereco}
                  </span>
                  <span className="text-gray-600 text-sm">
                    Nº {end.numero}
                    {end.complemento && `, ${end.complemento}`}
                  </span>
                </div>
              </div>
              <button
                className="text-red-500 hover:bg-red-100 rounded-full p-2 transition text-xs font-semibold"
                onClick={() => handleRemoveEndereco(idx)}
                title="Remover endereço"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
        {/* Formulário de novo endereço */}
        <form
          className="flex flex-col gap-3 mt-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleAddEndereco();
          }}
        >
          <div className="flex gap-2 items-end">
            <input
              className="p-3 border rounded-lg w-32 bg-gray-50 text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 transition placeholder-gray-400"
              placeholder="CEP"
              value={novoEndereco.cep}
              onChange={(e) =>
                setNovoEndereco({ ...novoEndereco, cep: e.target.value })
              }
            />
            <button
              type="button"
              className="bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 text-white px-4 py-3 rounded-lg shadow text-sm font-bold transition hover:scale-105"
              onClick={buscarCep}
              disabled={cepLoading || !novoEndereco.cep}
            >
              {cepLoading ? "Buscando..." : "Buscar CEP"}
            </button>
          </div>
          <input
            className="p-3 border rounded-lg bg-gray-50 text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 transition placeholder-gray-400"
            placeholder="Endereço"
            value={novoEndereco.endereco}
            onChange={(e) =>
              setNovoEndereco({ ...novoEndereco, endereco: e.target.value })
            }
          />
          <div className="flex gap-2">
            <input
              className="p-3 border rounded-lg w-24 bg-gray-50 text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 transition placeholder-gray-400"
              placeholder="Número"
              value={novoEndereco.numero}
              onChange={(e) =>
                setNovoEndereco({ ...novoEndereco, numero: e.target.value })
              }
            />
            <input
              className="p-3 border rounded-lg flex-1 bg-gray-50 text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 transition placeholder-gray-400"
              placeholder="Complemento"
              value={novoEndereco.complemento}
              onChange={(e) =>
                setNovoEndereco({
                  ...novoEndereco,
                  complemento: e.target.value,
                })
              }
            />
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-cyan-400 hover:from-blue-700 hover:to-cyan-500 text-white px-6 py-3 rounded-lg shadow font-bold transition hover:scale-105 text-base"
          >
            Adicionar
          </button>
        </form>
      </div>
      {/* Configurações */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 border border-gray-100 flex flex-col gap-4 mt-4 transition hover:shadow-2xl">
        <h2 className="text-2xl font-bold mb-2 text-blue-700 text-center tracking-tight">
          Configurações
        </h2>
        <div className="flex items-center gap-4 justify-center">
          <span className="font-semibold text-base">Tema:</span>
          <select
            className="p-3 border rounded-lg bg-gray-50 text-gray-900 text-base"
            value="Claro"
            disabled
          >
            <option value="light">Claro</option>
          </select>
        </div>
      </div>
    </div>
  );
}
