import { useState } from "react";
import { smartphonesMock } from "./mocks/smartphones-mocks";

export default function App() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [cart, setCart] = useState<
    { phone: (typeof smartphonesMock)[number]; quantity: number }[]
  >([]);

  const filteredPhones = smartphonesMock
    .filter(
      (phone) =>
        phone.name.toLowerCase().includes(search.toLowerCase()) ||
        phone.description.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "releaseDate") {
        return sortOrder === "asc"
          ? new Date(a.releaseDate).getTime() -
              new Date(b.releaseDate).getTime()
          : new Date(b.releaseDate).getTime() -
              new Date(a.releaseDate).getTime();
      }
      if (sortBy === "price") {
        return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
      }
      return 0;
    });

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

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Lista de Smartphones</h1>

      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Buscar por nome ou descrição"
          className="p-2 border rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="p-2 border rounded"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="name">Ordenar por Nome</option>
          <option value="releaseDate">Ordenar por Lançamento</option>
          <option value="price">Ordenar por Preço</option>
        </select>
        {(sortBy === "releaseDate" || sortBy === "price") && (
          <select
            className="p-2 border rounded"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="asc">Crescente</option>
            <option value="desc">Decrescente</option>
          </select>
        )}
      </div>

      <div className="flex w-full max-w-5xl gap-6">
        <div className="w-3/5 bg-white shadow-md rounded-lg p-4">
          {filteredPhones.map((phone, index) => (
            <div
              key={index}
              className="border-b last:border-b-0 py-4 flex items-start"
            >
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">
                  {phone.name}
                </h2>
                <p className="text-gray-700 text-sm">{phone.description}</p>
                <p className="text-gray-600 text-sm">
                  Lançamento:{" "}
                  {new Date(phone.releaseDate).toLocaleDateString("pt-BR")}
                </p>
                <p className="text-yellow-500 font-semibold">
                  Avaliação: {phone.rating} ⭐
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-600">
                  R$ {phone.price.toFixed(2)}
                </p>
                <button
                  className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                  onClick={() => addToCart(phone)}
                >
                  Adicionar ao carrinho
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="w-2/5 bg-white shadow-md rounded-lg p-4">
          <h2 className="text-2xl font-bold mb-4">Carrinho</h2>
          {cart.length === 0 ? (
            <p className="text-gray-600">Nenhum item no carrinho</p>
          ) : (
            <>
              {cart.map((item, index) => (
                <div key={index} className="flex justify-between py-2 border-b">
                  <span>
                    {item.phone.name} - {item.quantity}x R${" "}
                    {item.phone.price.toFixed(2)}
                  </span>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => removeFromCart(item.phone.name)}
                  >
                    Remover
                  </button>
                </div>
              ))}
              <p className="text-xl font-bold mt-4">
                Total: R$ {totalPrice.toFixed(2)}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
