import { useState, useEffect } from "react";
import { smartphonesMock } from "./mocks/smartphones-mocks";
import CheckoutModal from "./component/CheckoutModal";
import Sidebar from "./component/Sidebar";
import Produtos from "./pages/Produtos";
import Login from "./pages/Login";
import Perfil from "./pages/Perfil";
import { Pedido, Endereco } from "./types";
import Checkout from "./pages/Checkout";

export default function App() {
  const [cart, setCart] = useState<
    { phone: (typeof smartphonesMock)[number]; quantity: number }[]
  >([]);
  const [page, setPage] = useState("produtos");
  const [showModal, setShowModal] = useState(false);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [user, setUserState] = useState<{ email: string; name: string } | null>(
    null
  );
  const [showCart, setShowCart] = useState(false);
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [cupom, setCupom] = useState("");
  const [cupomAplicado, setCupomAplicado] = useState<string | null>(null);
  const [cupomErro, setCupomErro] = useState("");
  const [enderecos, setEnderecos] = useState<Endereco[]>([]);
  const [selectedEnderecoCarrinho, setSelectedEnderecoCarrinho] = useState(-1);

  // Persistência do usuário
  useEffect(() => {
    const saved = localStorage.getItem("shop_user");
    if (saved) {
      setUserState(JSON.parse(saved));
    }
  }, []);

  const setUser = (user: { email: string; name: string } | null) => {
    setUserState(user);
    if (user) {
      localStorage.setItem("shop_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("shop_user");
    }
  };

  const addToCart = (phone: (typeof smartphonesMock)[number]) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.phone.name === phone.name
      );
      if (existingItem) {
        return prevCart.map((item) =>
          item.phone.name === phone.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { phone, quantity: 1 }];
    });
  };

  const removeFromCart = (phoneName: string) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) =>
          item.phone.name === phoneName
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0);
    });
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.phone.price * item.quantity,
    0
  );

  // Mock de cupons
  const cupons: Record<string, { tipo: string; valor: number }> = {
    CUPOM10: { tipo: "percent", valor: 10 },
    FRETEGRATIS: { tipo: "frete", valor: 0 },
    DESCONTO50: { tipo: "valor", valor: 50 },
  };

  let desconto = 0;
  let frete = 0;
  if (cupomAplicado && cupons[cupomAplicado]) {
    const c = cupons[cupomAplicado];
    if (c.tipo === "percent") desconto = totalPrice * (c.valor / 100);
    if (c.tipo === "valor") desconto = c.valor;
    if (c.tipo === "frete") frete = 0;
  }
  const totalComDesconto = Math.max(totalPrice - desconto, 0);

  const aplicarCupom = () => {
    if (cupons[cupom.toUpperCase()]) {
      setCupomAplicado(cupom.toUpperCase());
      setCupomErro("");
    } else {
      setCupomErro("Cupom inválido");
      setCupomAplicado(null);
    }
  };

  // Função para buscar endereço pelo CEP
  const buscarCep = async () => {
    if (!cep) return;
    setCepLoading(true);
    setCepError("");
    try {
      const res = await fetch(
        `https://viacep.com.br/ws/${cep.replace(/\D/g, "")}/json/`
      );
      const data = await res.json();
      if (data.erro) {
        setCepError("CEP não encontrado");
        setEndereco("");
      } else {
        setEndereco(
          `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`
        );
      }
    } catch {
      setCepError("Erro ao buscar CEP");
      setEndereco("");
    }
    setCepLoading(false);
  };

  useEffect(() => {
    if (cepError || endereco) {
      const timer = setTimeout(() => {
        setCepError("");
        // setEndereco(""); // Não limpa endereço automaticamente
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [cepError, endereco]);

  useEffect(() => {
    if (cupomErro || cupomAplicado) {
      const timer = setTimeout(() => {
        setCupomErro("");
        // setCupomAplicado(null); // Não limpa cupom automaticamente
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [cupomErro, cupomAplicado]);

  // Carregar endereço salvo
  useEffect(() => {
    const savedEndereco = localStorage.getItem("shop_endereco");
    if (savedEndereco) {
      const { cep, endereco, numero, complemento } = JSON.parse(savedEndereco);
      setCep(cep || "");
      setEndereco(endereco || "");
      setNumero(numero || "");
      setComplemento(complemento || "");
    }
  }, []);

  // Salvar endereço sempre que mudar
  useEffect(() => {
    localStorage.setItem(
      "shop_endereco",
      JSON.stringify({ cep, endereco, numero, complemento })
    );
  }, [cep, endereco, numero, complemento]);

  // Carregar pedidos do usuário ao logar
  useEffect(() => {
    if (user) {
      const savedPedidos = localStorage.getItem(`shop_pedidos_${user.email}`);
      if (savedPedidos) {
        setPedidos(JSON.parse(savedPedidos));
      } else {
        setPedidos([]);
      }
    }
  }, [user]);

  // Salvar pedidos sempre que mudar
  useEffect(() => {
    if (user) {
      localStorage.setItem(
        `shop_pedidos_${user.email}`,
        JSON.stringify(pedidos)
      );
    }
  }, [pedidos, user]);

  // Carregar endereços do usuário ao logar
  useEffect(() => {
    if (user) {
      const savedEnds = localStorage.getItem(`shop_enderecos_${user.email}`);
      if (savedEnds) {
        setEnderecos(JSON.parse(savedEnds));
      } else {
        setEnderecos([]);
      }
    }
  }, [user]);

  // Salvar endereços sempre que mudar
  useEffect(() => {
    if (user) {
      localStorage.setItem(
        `shop_enderecos_${user.email}`,
        JSON.stringify(enderecos)
      );
    }
  }, [enderecos, user]);

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  // Layout principal com sidebar
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Sidebar
        onNavigate={(p) => {
          if (p === "logout") setUser(null);
          else setPage(p);
        }}
        current={page}
        user={user}
      />
      <main className="flex-1" style={{ paddingLeft: 272 }}>
        {page === "produtos" && <Produtos onAddToCart={addToCart} />}
        {page === "pedidos" && (
          <div className="flex flex-col gap-6 p-8">
            <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m5-9v9m4-9v9m4-9l2 9"
                />
              </svg>
              Meus Pedidos
            </h1>
            {pedidos.length === 0 ? (
              <p className="text-gray-600">Nenhum pedido realizado ainda.</p>
            ) : (
              <div className="w-full max-w-3xl space-y-8">
                {pedidos.map((pedido, idx) => (
                  <div
                    key={pedido.id}
                    className={`bg-white rounded-xl shadow p-6 border ${
                      pedido.status === "Reembolso solicitado"
                        ? "border-red-300 bg-red-50"
                        : "border-blue-100"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span
                        className={`font-bold text-lg ${
                          pedido.status === "Reembolso solicitado"
                            ? "text-red-700"
                            : "text-blue-700"
                        }`}
                      >
                        Pedido #{pedido.id}
                      </span>
                      <span className="text-xs text-gray-500">
                        {pedido.data}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 items-center mb-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          pedido.status === "Aguardando pagamento"
                            ? "bg-yellow-100 text-yellow-700"
                            : pedido.status === "Reembolso solicitado"
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {pedido.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        Rastreio:{" "}
                        <span className="font-mono">{pedido.rastreio}</span>{" "}
                        <button
                          className="ml-1 text-blue-600 hover:underline"
                          onClick={() =>
                            navigator.clipboard.writeText(pedido.rastreio)
                          }
                        >
                          Copiar
                        </button>
                      </span>
                    </div>
                    <div className="mb-2 text-sm text-gray-700 flex items-center gap-2">
                      <span className="font-semibold">Endereço:</span>
                      <span className="truncate max-w-xs">
                        {pedido.endereco}
                      </span>
                    </div>
                    <div className="mb-2 text-sm text-gray-700 flex items-center gap-2">
                      <span className="font-semibold">Pagamento:</span>
                      {pedido.pagamento === "credit" && (
                        <span title="Cartão de Crédito">💳</span>
                      )}
                      {pedido.pagamento === "debit" && (
                        <span title="Cartão de Débito">🏧</span>
                      )}
                      {pedido.pagamento === "pix" && (
                        <span title="PIX">⚡</span>
                      )}
                      {pedido.pagamento === "boleto" && (
                        <span title="Boleto">📄</span>
                      )}
                      <span className="capitalize">{pedido.pagamento}</span>
                    </div>
                    {pedido.cupom && pedido.desconto > 0 && (
                      <div className="mb-2 text-green-700 font-bold text-sm">
                        Cupom {pedido.cupom} aplicado: -R${" "}
                        {pedido.desconto.toFixed(2)}
                      </div>
                    )}
                    <ul className="mb-4 divide-y">
                      {pedido.itens.map((item, idx2) => (
                        <li key={idx2} className="flex items-center gap-4 py-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-contain rounded border"
                          />
                          <div className="flex-1">
                            <span className="font-bold text-gray-900">
                              {item.name}
                            </span>
                            <span className="ml-2 text-xs text-gray-500">
                              Qtd: {item.quantity}
                            </span>
                            <div className="text-xs text-gray-500 line-clamp-1">
                              {item.description}
                            </div>
                          </div>
                          <span className="text-green-700 font-bold">
                            R$ {(item.price * item.quantity).toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-sm text-gray-500 line-through">
                        Valor original: R${" "}
                        {(pedido.total + (pedido.desconto || 0)).toFixed(2)}
                      </span>
                      {pedido.cupom && pedido.desconto > 0 && (
                        <span className="text-sm text-green-700 font-bold">
                          Desconto: -R$ {pedido.desconto.toFixed(2)}
                        </span>
                      )}
                      <span className="text-lg font-bold text-blue-700">
                        Total final: R$ {pedido.total.toFixed(2)}
                      </span>
                    </div>
                    {pedido.status !== "Reembolso solicitado" && (
                      <button
                        className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-sm shadow"
                        onClick={() => {
                          if (
                            window.confirm(
                              "Tem certeza que deseja solicitar reembolso deste pedido?"
                            )
                          ) {
                            setPedidos((pedidos) =>
                              pedidos.map((p, i) =>
                                i === idx
                                  ? { ...p, status: "Reembolso solicitado" }
                                  : p
                              )
                            );
                          }
                        }}
                      >
                        Solicitar reembolso
                      </button>
                    )}
                    {pedido.status === "Reembolso solicitado" && (
                      <button
                        className="mt-2 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-bold text-sm shadow"
                        onClick={() => {
                          if (
                            window.confirm(
                              "Tem certeza que deseja excluir este pedido? Esta ação não poderá ser desfeita."
                            )
                          ) {
                            setPedidos((pedidos) =>
                              pedidos.filter((_, i) => i !== idx)
                            );
                          }
                        }}
                      >
                        Excluir pedido
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {page === "perfil" && user && (
          <Perfil
            user={user}
            setUser={setUser}
            enderecos={enderecos}
            setEnderecos={setEnderecos}
          />
        )}
        {page === "checkout" && (
          <Checkout
            cart={cart.map((item) => ({
              name: item.phone.name,
              price: item.phone.price,
              quantity: item.quantity,
              image: item.phone.image,
              description: item.phone.description,
            }))}
            total={totalPrice}
            onConfirm={(enderecoInfo) => {
              // Salvar pedido
              const novoPedido = {
                id: Date.now(),
                itens: cart.map((item) => ({
                  name: item.phone.name,
                  price: item.phone.price,
                  quantity: item.quantity,
                  image: item.phone.image,
                  description: item.phone.description,
                })),
                total: Math.max(totalPrice - desconto, 0),
                endereco: `${enderecoInfo.cep} - ${enderecoInfo.endereco}, ${
                  enderecoInfo.numero
                }${
                  enderecoInfo.complemento
                    ? " - " + enderecoInfo.complemento
                    : ""
                }`,
                pagamento: enderecoInfo.pagamento,
                data: new Date().toLocaleString(),
                cupom: cupomAplicado || undefined,
                desconto: desconto,
                status: "Aguardando pagamento",
                rastreio: Math.random()
                  .toString(36)
                  .substring(2, 10)
                  .toUpperCase(),
              };
              setPedidos((prev) => [novoPedido, ...prev]);
              setShowModal(true);
              setCart([]);
              setPage("pedidos");
            }}
            enderecoInfo={{ cep, endereco, numero, complemento }}
            desconto={desconto}
            cupomAplicado={cupomAplicado}
            enderecos={enderecos}
            selectedEndereco={selectedEnderecoCarrinho}
          />
        )}
        {page !== "checkout" && (
          <button
            className="fixed bottom-8 right-8 z-50 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg p-4 text-2xl font-bold"
            onClick={() => setShowCart(true)}
          >
            🛒
            {cart.length > 0 && (
              <span className="ml-2 bg-white text-green-700 rounded-full px-2 text-sm font-bold">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>
        )}
        {/* Carrinho centralizado estilo Kabum */}
        {showCart && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95">
            <div className="w-full max-w-7xl bg-white rounded-xl shadow-2xl flex flex-col md:flex-row p-8 gap-8 border border-gray-200 relative">
              {/* Coluna de produtos */}
              <div className="flex-1 min-w-[320px]">
                <div className="flex items-center gap-2 mb-6">
                  <svg
                    className="w-7 h-7 text-orange-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m5-9v9m4-9v9m4-9l2 9"
                    />
                  </svg>
                  <h2 className="text-2xl font-bold">Carrinho</h2>
                </div>
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
                      alt="Carrinho vazio"
                      className="w-24 h-24 mb-4 opacity-60"
                    />
                    <p className="text-gray-500 text-lg mb-4">
                      Seu carrinho está vazio.
                      <br />
                      Que tal adicionar um produto?
                    </p>
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold"
                      onClick={() => {
                        setShowCart(false);
                        setPage("produtos");
                      }}
                    >
                      Continuar comprando
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="bg-gray-50 rounded-lg p-4 mb-4 border">
                      <div className="font-bold text-gray-700 mb-2">
                        PRODUTO E SERVIÇO
                      </div>
                      {cart.map((item, index) => (
                        <div
                          key={index}
                          className="flex gap-4 py-4 border-b last:border-b-0 items-center"
                        >
                          <img
                            src={item.phone.image}
                            alt={item.phone.name}
                            className="w-20 h-20 object-contain rounded border"
                          />
                          <div className="flex-1">
                            <div className="font-bold text-gray-900 mb-1">
                              {item.phone.name}
                            </div>
                            <div className="text-gray-700 text-xs mb-1 line-clamp-2">
                              {item.phone.description}
                            </div>
                            <div className="text-green-700 font-bold">
                              R$ {item.phone.price.toFixed(2)}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">Qtd:</span>
                              <span className="font-bold">{item.quantity}</span>
                            </div>
                            <button
                              className="text-red-600 hover:underline text-xs"
                              onClick={() => removeFromCart(item.phone.name)}
                            >
                              REMOVER
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 border">
                      <input
                        type="text"
                        placeholder="Cupom de desconto"
                        className="w-2/3 p-2 border rounded mr-2"
                        value={cupom}
                        onChange={(e) => setCupom(e.target.value)}
                        disabled={!!cupomAplicado}
                      />
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold"
                        onClick={aplicarCupom}
                        disabled={!!cupomAplicado}
                      >
                        {cupomAplicado ? "CUPOM APLICADO" : "APLICAR CUPOM"}
                      </button>
                      {cupomErro && (
                        <div className="text-xs text-red-600 mt-1">
                          {cupomErro}
                        </div>
                      )}
                      {cupomAplicado && (
                        <div className="text-xs text-green-700 mt-1">
                          Cupom {cupomAplicado} aplicado!
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
              {/* Coluna de resumo */}
              <div className="w-full md:w-80 flex flex-col gap-4">
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <div className="font-bold text-gray-700 mb-2">RESUMO</div>
                  {endereco && (
                    <div className="flex flex-col text-xs text-gray-700 mb-2">
                      <span className="font-semibold">
                        Endereço de entrega:
                      </span>
                      <span>
                        {cep} - {endereco}
                        {numero && ", " + numero}
                        {complemento && " - " + complemento}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm mb-1">
                    <span>Valor dos Produtos:</span>
                    <span>R$ {totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Frete:</span>
                    <span>R$ {frete.toFixed(2)}</span>
                  </div>
                  {desconto > 0 && (
                    <div className="flex justify-between text-sm mb-1 text-green-700 font-bold">
                      <span>Desconto:</span>
                      <span>- R$ {desconto.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm mb-1">
                    <span>Total a prazo:</span>
                    <span>R$ {totalComDesconto.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-green-700 mt-2">
                    <span>Valor à vista no PIX:</span>
                    <span>R$ {(totalComDesconto * 0.9).toFixed(2)}</span>
                  </div>
                  <div className="text-xs text-green-700">(Economize 10%)</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border flex flex-col gap-2">
                  <div className="font-bold text-gray-700 mb-1">ENTREGA</div>
                  {enderecos.length === 0 && (
                    <div className="text-red-600 text-xs mb-2">
                      Cadastre um endereço no perfil para finalizar a compra.
                    </div>
                  )}
                  {enderecos.length > 0 && (
                    <select
                      className="w-full p-2 border rounded mb-2"
                      value={selectedEnderecoCarrinho}
                      onChange={(e) => {
                        const idx = Number(e.target.value);
                        setSelectedEnderecoCarrinho(idx);
                        if (idx >= 0 && enderecos[idx]) {
                          setCep(enderecos[idx].cep);
                          setEndereco(enderecos[idx].endereco);
                          setNumero(enderecos[idx].numero);
                          setComplemento(enderecos[idx].complemento || "");
                        }
                      }}
                    >
                      <option value={-1}>Selecione um endereço salvo</option>
                      {enderecos.map((end, idx) => (
                        <option key={idx} value={idx}>
                          {end.cep} - {end.endereco}, {end.numero}
                          {end.complemento ? ` - ${end.complemento}` : ""}
                        </option>
                      ))}
                    </select>
                  )}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="CEP*"
                      className="p-2 border rounded flex-1"
                      value={cep}
                      onChange={(e) => setCep(e.target.value)}
                    />
                    <button
                      className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-bold"
                      onClick={buscarCep}
                      disabled={cepLoading}
                    >
                      OK
                    </button>
                  </div>
                  {cepLoading && (
                    <span className="text-xs text-blue-600">
                      Buscando endereço...
                    </span>
                  )}
                  {cepError && (
                    <span className="text-xs text-red-600">{cepError}</span>
                  )}
                  {endereco && (
                    <span className="text-xs text-green-700">{endereco}</span>
                  )}
                  {endereco && (
                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        placeholder="Número"
                        className="p-2 border rounded w-1/3"
                        value={numero}
                        onChange={(e) => setNumero(e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Complemento"
                        className="p-2 border rounded w-2/3"
                        value={complemento}
                        onChange={(e) => setComplemento(e.target.value)}
                      />
                    </div>
                  )}
                  <button className="text-orange-600 text-xs mt-1 hover:underline text-left">
                    Não lembro meu CEP
                  </button>
                </div>
                <button
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-bold text-lg shadow transition mt-2"
                  onClick={() => {
                    if (
                      enderecos.length === 0 ||
                      !cep ||
                      !endereco ||
                      !numero
                    ) {
                      alert(
                        "Cadastre e selecione um endereço completo para continuar."
                      );
                      return;
                    }
                    setShowCart(false);
                    setPage("checkout");
                  }}
                  disabled={cart.length === 0 || enderecos.length === 0}
                >
                  IR PARA O PAGAMENTO
                </button>
                <button
                  className="w-full bg-white border border-orange-500 text-orange-600 py-3 rounded-lg font-bold text-lg shadow transition mt-2 hover:bg-orange-50"
                  onClick={() => {
                    setShowCart(false);
                    setPage("produtos");
                  }}
                >
                  CONTINUAR COMPRANDO
                </button>
              </div>
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold"
                onClick={() => setShowCart(false)}
                title="Fechar"
              >
                ×
              </button>
            </div>
          </div>
        )}
        <CheckoutModal open={showModal} onClose={() => setShowModal(false)} />
      </main>
    </div>
  );
}
