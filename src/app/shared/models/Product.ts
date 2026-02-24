export interface Product {
  id: number;
  name: string;
  image: string;
  category: {
    id: number;
    name: string;
  };
  material: string;
  price: number;
  description: string;
  stock: number;
}
