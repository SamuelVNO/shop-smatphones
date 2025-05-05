import { useState, useEffect } from "react";
import { Endereco } from "../types";

interface Phone {
  name: string;
  price: number;
  quantity: number;
  image: string;
  description: string;
}

interface CheckoutProps {
  cart: Phone[];
  total: number;
  onConfirm: (enderecoInfo: {
    cep: string;
    endereco: string;
    numero: string;
    complemento: string;
    pagamento: string;
  }) => void;
  enderecoInfo?: {
    cep: string;
    endereco: string;
    numero: string;
    complemento: string;
  };
  desconto?: number;
  cupomAplicado?: string | null;
  enderecos?: Endereco[];
  selectedEndereco?: number;
}

export default function Checkout({
  cart,
  total,
  onConfirm,
  enderecoInfo,
  desconto = 0,
  cupomAplicado,
  enderecos = [],
  selectedEndereco = -1,
}: CheckoutProps) {
  const [payment, setPayment] = useState("credit");
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [selectedEnderecoState, setSelectedEnderecoState] =
    useState<number>(selectedEndereco);

  useEffect(() => {
    if (enderecoInfo) {
      setCep(enderecoInfo.cep);
      setEndereco(enderecoInfo.endereco);
      setNumero(enderecoInfo.numero);
      setComplemento(enderecoInfo.complemento);
    }
  }, [enderecoInfo]);

  // Preencher campos ao selecionar endereço salvo
  useEffect(() => {
    if (selectedEnderecoState >= 0 && enderecos[selectedEnderecoState]) {
      setCep(enderecos[selectedEnderecoState].cep);
      setEndereco(enderecos[selectedEnderecoState].endereco);
      setNumero(enderecos[selectedEnderecoState].numero);
      setComplemento(enderecos[selectedEnderecoState].complemento || "");
    }
  }, [selectedEnderecoState, enderecos]);

  // Inicializar select se vier prop selectedEndereco
  useEffect(() => {
    if (selectedEndereco >= 0 && enderecos[selectedEndereco]) {
      setSelectedEnderecoState(selectedEndereco);
      setCep(enderecos[selectedEndereco].cep);
      setEndereco(enderecos[selectedEndereco].endereco);
      setNumero(enderecos[selectedEndereco].numero);
      setComplemento(enderecos[selectedEndereco].complemento || "");
    }
  }, [selectedEndereco, enderecos]);

  const totalComDesconto = Math.max(total - desconto, 0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
      <h1 className="text-3xl font-bold mb-6">Finalizar Compra</h1>
      <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Itens do Carrinho</h2>
        <ul className="mb-4 divide-y">
          {cart.map((item, idx) => (
            <li key={idx} className="flex items-center gap-4 py-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-contain rounded border"
              />
              <div className="flex-1">
                <div className="font-bold text-gray-900">{item.name}</div>
                <div className="text-gray-700 text-xs mb-1 line-clamp-2">
                  {item.description}
                </div>
                <div className="text-green-700 font-bold">
                  R$ {item.price.toFixed(2)}
                </div>
                <div className="text-sm">Qtd: {item.quantity}</div>
              </div>
              <div className="text-right min-w-[100px]">
                <div className="text-lg font-bold text-green-600">
                  R$ {(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="mb-4">
          <h3 className="font-bold mb-1">Endereço de Entrega</h3>
          {enderecos.length === 0 && (
            <div className="text-red-600 text-xs mb-2">
              Cadastre um endereço no perfil para finalizar a compra.
            </div>
          )}
          {enderecos.length > 0 && (
            <select
              className="w-full p-2 border rounded mb-2"
              value={selectedEnderecoState}
              onChange={(e) => setSelectedEnderecoState(Number(e.target.value))}
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
          <div className="text-sm text-gray-700">
            {cep} - {endereco}
            {numero && ", " + numero}
            {complemento && " - " + complemento}
          </div>
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Forma de Pagamento</label>
          <select
            className="w-full p-2 border rounded"
            value={payment}
            onChange={(e) => setPayment(e.target.value)}
          >
            <option value="credit">Cartão de Crédito</option>
            <option value="debit">Cartão de Débito</option>
            <option value="pix">PIX</option>
            <option value="boleto">Boleto</option>
          </select>
        </div>
        {cupomAplicado && desconto > 0 && (
          <div className="mb-2 text-green-700 font-bold text-sm">
            Cupom {cupomAplicado} aplicado: -R$ {desconto.toFixed(2)}
          </div>
        )}
        <div className="mb-4 flex flex-col gap-1">
          <label className="block font-semibold mb-1">CEP</label>
          <input
            type="text"
            placeholder="CEP*"
            className="p-2 border rounded flex-1 mb-2"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
          />
          <label className="block font-semibold mb-1">Endereço</label>
          <input
            type="text"
            placeholder="Endereço*"
            className="p-2 border rounded flex-1 mb-2"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
          />
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Número*"
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
        </div>
        <div className="mb-4 flex flex-col gap-1">
          <div className="text-lg font-bold">
            Total: R$ {totalComDesconto.toFixed(2)}
          </div>
          <div className="text-green-700 font-bold">
            Valor à vista no PIX: R$ {(totalComDesconto * 0.9).toFixed(2)}
          </div>
        </div>
        <button
          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-bold text-lg shadow transition"
          onClick={() => {
            if (!cep || !endereco || !numero) {
              alert(
                "Preencha todos os campos obrigatórios do endereço para finalizar o pedido."
              );
              return;
            }
            onConfirm({
              cep,
              endereco,
              numero,
              complemento,
              pagamento: payment,
            });
          }}
          disabled={!cep || !endereco || !numero || enderecos.length === 0}
        >
          Confirmar Pedido
        </button>
      </div>
    </div>
  );
}
