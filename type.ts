import { ClaimStatus, OrderStatus, ShipmentStatus, TransactionType, UserRole } from "./enum";

/* ================= BASE TYPES ================= */

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
  error?: string;
  errors?: { field: string; message: string }[];
  timestamp?: string;
  path?: string;
};

export type ValidationErrorItem = {
  field: string;
  message: string;
}

export type BaseResponsePagination<T> = {
  items: T[]
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  }
}

export type BaseRequestPagination = {
  sortOrder: 'ASC' | 'DESC';
  sortBy?: string;
}

/* ================= AUTH TYPES ================= */

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type User = {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  storeId: string | null;
  status: string;
  createdAt: string;
}

/* ================= STORE TYPES ================= */

export type Store = {
  id: string;
  name: string;
  address: string;
  managerName: string | null;
  phone: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/* ================= PRODUCT TYPES ================= */

export type Product = {
  id: number;
  sku: string;
  name: string;
  baseUnitId: number;
  shelfLifeDays: number;
  imageUrl: string | null;
  isActive: boolean;
}

export type CatalogItem = {
  id: number;
  sku: string;
  name: string;
  unit: string;
  imageUrl?: string;
};

export type Catelog = CatalogItem;
export type ProductCatalogDto = CatalogItem;




/* ================= ORDER TYPES ================= */

export type Order = {
  id: string;
  storeId: string;
  status: OrderStatus;
  deliveryDate: string;
  createdAt: string;
  items?: OrderItem[];
}

export type OrderMyStore = Order;


export type OrderItem = {
  id: number;
  orderId: string;
  productId: number;
  quantityRequested: number;
  quantityApproved: number | null;
  product: Product;
}

export type OrderDetail = Order & {
  items: OrderItem[];
  store: Store;
}

export type QueryOrder = BaseRequestPagination & {
  status?: OrderStatus
  search?: string
  storeId?: string
  fromDate?: string
  toDate?: string
}

export type QueryCatalog = BaseRequestPagination & {
  search?: string
}

export type QueryClaim = BaseRequestPagination & {
  status?: ClaimStatus
  search?: string    //search by claimId, shipmentId
  storeId?: string
  fromDate?: string
  toDate?: string
}


/* ================= SHIPMENT TYPES ================= */

export type Shipment = {
  id: string;
  orderId: string;
  status: ShipmentStatus;
  createdAt: string;
  order: {
    id: string;
    storeId: string;
    storeName: string;
  };
}

export type ShipmentItem = {
  batchId: number;
  batchCode: string;
  productId: number;
  productName: string;
  sku: string;
  quantity: number;
  expiryDate: string;
  imageUrl: string | null;
}

export type ShipmentDetail = Shipment & {
  items: ShipmentItem[];
}

export type QueryShipment = BaseRequestPagination & {
  status?: ShipmentStatus
  search?: string
  storeId?: string
  fromDate?: string
  toDate?: string
}

/* ================= INVENTORY TYPES ================= */

export type InventoryItem = {
  inventoryId: number;
  batchId: number;
  productId: number;
  productName: string;
  sku: string;
  batchCode: string;
  quantity: number;
  expiryDate: string;
  unit: string;
  imageUrl: string | null;
}

export type InventoryTransaction = {
  transactionId: number;
  warehouseId: number;
  batchId: number;
  adjustmentQuantity: number;
  newQuantity: number;
  reason: string;
  type: TransactionType;
  productName?: string;
  batchCode?: string;
  date?: string;
  note?: string;
}

export type QueryInventory = BaseRequestPagination & {
  search?: string;
}

export type QueryInventoryTransaction = BaseRequestPagination & {
  type?: TransactionType;
  fromDate?: string;
  toDate?: string;
}

/* ================= CLAIM TYPES ================= */

export type Claim = {
  id: string;
  shipmentId: string;
  status: ClaimStatus;
  createdAt: string;
  resolvedAt: string | null;
  items: ClaimItem[];
};

export type ClaimItem = {
  productName: string;
  sku: string;
  quantityMissing: number;
  quantityDamaged: number;
  reason: string;
  imageUrl?: string;
};

export type ClaimDetail = Claim & {
  items: ClaimItem[];
}

