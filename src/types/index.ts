export interface Endereco {
  cep: string;
  endereco: string;
  numero: string;
  complemento?: string;
}

export interface User {
  name: string;
  email: string;
  avatar?: string;
}

export interface Pedido {
  id: number;
  itens: Phone[];
  total: number;
  endereco: string;
  pagamento: string;
  data: string;
  cupom?: string;
  desconto: number;
  status: string;
  rastreio: string;
}

export interface Phone {
  name: string;
  price: number;
  quantity: number;
  image: string;
  description: string;
} 