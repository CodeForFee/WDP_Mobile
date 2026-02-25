import { OrderStatus } from "./enum";

export type ResponseData<T> = {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
  path: string;
};


/** Theo api.md - ResponseError */
export type ResponseError = {
  statusCode: number;
  message: string;
  error?: string;
  errors?: { field: string; message: string }[];
  timestamp?: string;
  path?: string;
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

/** ProductCatalogDto - GET /orders/catalog (Blind Ordering: id, name, sku, unit) */
export type ProductCatalogDto = {
  id: number;
  name: string;
  sku: string;
  unit: string;
  imageUrl?: string;
};

/** @deprecated Dùng ProductCatalogDto */
export type Catelog = ProductCatalogDto;

export type Product = Catelog & {
  shelfLifeDays: number;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}



/** Order item trong chi tiết đơn - theo api.md (camelCase) */
export type OrderItemDetail = {
  id: number;
  productId?: number;
  productName?: string;
  requestedQty?: number;
  quantityRequested?: string;
  quantityApproved?: string;
  product?: Product;
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

/** Order response - theo api.md (camelCase) */
export type Order = {
  id: string;
  storeId: string;
  status: OrderStatus;
  deliveryDate: string;
  createdAt: string;
};

/** Chi tiết đơn hàng - theo api.md */
export type OrderDetail = Order & {
  totalAmount?: string;
  priority?: string;
  note?: string;
  updatedAt?: string;
  items: OrderItemDetail[];
  store: Store;
};

export type OrderMyStore = Omit<OrderDetail, 'store'>;

/** Response PATCH /orders/franchise/:id/cancel - theo api.md */
export type CancelOrderResponse = {
  orderId: string;
  status: OrderStatus;
};

/** @deprecated Dùng CancelOrderResponse */
export type CancelOrder = CancelOrderResponse;

