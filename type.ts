import { OrderStatus } from "./enum";

export type ResponseData<T> = {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
  path: string;
};


export type ResponseError = {
  statusCode: number;
  message: string;
  errors: ValidationErrorItem[];
  timestamp: string;
  path: string;
};


export type ValidationErrorItem = {
  field: string;
  message: string;
}


export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};
export type User = {
  id: string;
  username: string;
  email: string;
  role: string;
  storeId?: string;
  status: string;
  createdAt: string;
}

export type Catelog = {
  id: number;
  name: string;
  sku: string;
  unit: string;
  /** URL ảnh — backend GET /orders/catalog cần trả field này (image_url hoặc imageUrl) giống API đơn hàng */
  image_url?: string;
  imageUrl?: string;
  thumbnail?: string;
  photo?: string;
}

export type Product = Catelog & {
  shelfLifeDays: number;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}



export type Item = {
  id: number;
  orderId: string;
  quantityRequested: string;
  quantityApproved: string;
  product: Product;
}

export type Store = {
  id: string;
  name: string;
  address: string;
  managerName: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export type Order = {
  id: string,
  store_id: string,
  status: OrderStatus,
  deliveryDate: string,
  createdAt: string
}
export type OrderDetail = Order & {
  totalAmount: string;
  priority: string;
  note: string;
  updatedAt: string;
  items: Item[];
  store: Store;
}
export type OrderMyStore = Omit<OrderDetail, 'store'>
export type CancelOrder = {
  orderId: string,
  status: OrderStatus
}

