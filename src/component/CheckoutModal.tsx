// import React from "react";

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ open, onClose }: CheckoutModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full flex flex-col items-center">
        <svg
          className="w-16 h-16 text-green-500 mb-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
        <h2 className="text-2xl font-bold mb-2 text-center">
          Pedido Realizado!
        </h2>
        <p className="text-gray-700 mb-6 text-center">
          Seu pedido foi confirmado com sucesso. Em breve você receberá mais
          informações no seu e-mail.
        </p>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
          onClick={onClose}
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
