export interface IProduct {
  id: number;
  name: string;
  categoryId: number;
  price: string;
  qty: number;
  isActive: boolean;
  category: {
    id: number;
    name: string
  }
  productImages?: IProductImage[];
}

export interface IProductImage {
  id: number;
  productId: number;
  imageUrl: string;
  fileName: string;
}