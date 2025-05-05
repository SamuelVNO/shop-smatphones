import { useState } from "react";
import { smartphonesMock } from "../mocks/smartphones-mocks";

interface ProdutosProps {
  onAddToCart: (phone: (typeof smartphonesMock)[number]) => void;
}

// Função para normalizar texto (remover acentos e deixar minúsculo)
function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

export default function Produtos({ onAddToCart }: ProdutosProps) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  // Filtragem por nome/descrição (ignora acentos e caixa)
  const filtered = smartphonesMock.filter((phone) => {
    const searchTerm = normalize(search);
    const name = normalize(phone.name);
    const description = normalize(phone.description);
    return name.includes(searchTerm) || description.includes(searchTerm);
  });

  // Ordenação
  const sorted = [...filtered].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (sort === "rating-desc") return b.rating - a.rating;
    if (sort === "rating-asc") return a.rating - b.rating;
    return 0;
  });

  return (
    <div className="flex flex-col gap-6 p-8 w-full">
      <h1 className="text-2xl font-bold mb-4">Produtos</h1>
      {/* Barra de pesquisa e filtros */}
      <div className="flex flex-col md:flex-row gap-4 mb-4 items-center">
        <input
          type="text"
          placeholder="Pesquisar por nome ou descrição..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full md:w-1/3"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">Ordenar por</option>
          <option value="price-asc">Preço: Menor para Maior</option>
          <option value="price-desc">Preço: Maior para Menor</option>
          <option value="rating-desc">Avaliação: Maior para Menor</option>
          <option value="rating-asc">Avaliação: Menor para Maior</option>
        </select>
      </div>
      {/* Listagem de produtos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sorted.map((phone, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow p-4 flex flex-col items-center"
          >
            <img
              src={phone.image}
              alt={phone.name}
              className="w-32 h-32 object-contain mb-2"
            />
            <h2 className="text-lg font-bold mb-1">{phone.name}</h2>
            <p className="text-gray-700 text-sm mb-1 text-center">
              {phone.description}
            </p>
            <p className="text-gray-500 text-xs mb-1">
              Lançamento:{" "}
              {new Date(phone.releaseDate).toLocaleDateString("pt-BR")}
            </p>
            <p className="text-yellow-500 font-semibold">
              Avaliação: {phone.rating} ⭐
            </p>
            <p className="text-lg font-bold text-green-600 mt-2">
              R$ {phone.price.toFixed(2)}
            </p>
            <button
              className="mt-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition font-semibold"
              onClick={() => onAddToCart(phone)}
            >
              Adicionar ao Carrinho
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
