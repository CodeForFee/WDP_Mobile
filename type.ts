import { ClaimStatus, OrderStatus, ShipmentStatus, TransactionType } from "./enum";

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
  errors: ValidationErrorItem[];
  timestamp: string;
  path: string;
};

export type ValidationErrorItem = {
  field: string;
  message: string;
}

export type BaseResponePagination<T> = {
  items: T
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  }
}

export type BaseRequestPagination = {
  page: number;
  limit: number;
  sortOrder: 'ASC' | 'DESC'
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
  role: string;
  storeId?: string;
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
  minStockLevel: number;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CatalogItem = {
  productId: number;
  sku: string;
  name: string;
  unit: string;
  imageUrl: string;
  isAvailable: boolean;
};


/* ================= ORDER TYPES ================= */

export type Order = {
  id: string;
  storeId: string;
  status: OrderStatus;
  totalAmount: string;
  deliveryDate: string;
  note: string | null;
  priority: string;
  createdAt: string;
  updatedAt: string;
}

export type OrderItem = {
  id: number;
  orderId: string;
  productId: number;
  quantityRequested: string;
  quantityApproved: string | null;
  product: Product;
}

export type OrderDetail = Order & {
  items: OrderItem[];
  store: Store;
}

export type CancelOrder = {
  orderId: string;
  status: OrderStatus;
}

export type QueryOrder = BaseRequestPagination & {
  sortBy?: string
  status?: OrderStatus
  search?: string
  storeId?: string
  fromDate?: string
  toDate?: string
}

export type QueryCatelog = BaseRequestPagination & {
  sortBy?: string
  isActive?: boolean
  search?: string
}

export type QueryClaim = BaseRequestPagination & {
  sortBy?: string
  status?: ClaimStatus
  search?: string    //search by claimId, shipmentId
  storeId?: string  // disable in be
  fromDate?: string
  toDate?: string
}


/* ================= SHIPMENT TYPES ================= */

export type Shipment = {
  id: string;
  orderId: string;
  storeName: string;
  status: ShipmentStatus;
  shipDate: string;
  createdAt: string;
}

export type ShipmentItem = {
  batchId: number;
  batchCode: string;
  productId: number;
  productName: string;
  quantity: number;
  unit: string;
  expiryDate: string;
}

export type ShipmentDetail = Shipment & {
  storeId: string;
  items: ShipmentItem[];
}

export type QueryShipment = BaseRequestPagination & {
  sortBy?: string
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
  sortBy?: string;
}

export type QueryInventoryTransaction = BaseRequestPagination & {
  sortBy?: string;
  type?: TransactionType;
  fromDate?: string;
  toDate?: string;
}

/* ================= CLAIM TYPES ================= */

export type Claim = {
  claimId: string;
  shipmentId: string;
  storeId?: string;
  status: string;
  description: string;
  items: ClaimItem[];
  createdAt: string;
  resolutionNote?: string;
  resolvedAt?: string;
  totalDamaged?: number;
  totalMissing?: number;
};

export type ClaimItem = {
  productId: number;
  productName: string;
  batchId: number;
  batchCode?: string;
  quantityMissing: number;
  quantityDamaged: number;
  reason: string;
  imageProofUrl?: string;
};

export type ClaimDetail = Claim & {
  items: ClaimItem[];
}

