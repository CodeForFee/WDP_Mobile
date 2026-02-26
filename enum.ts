export enum HttpErrorCode {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
}

/** Theo api.md - UserRole */
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  SUPPLY_COORDINATOR = 'supply_coordinator',
  CENTRAL_KITCHEN_STAFF = 'central_kitchen_staff',
  FRANCHISE_STORE_STAFF = 'franchise_store_staff',
}

/** Theo api.md - OrderStatus */
export enum OrderStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
  PICKING = 'picking',
  DELIVERING = 'delivering',
  COMPLETED = 'completed',
  CLAIMED = 'claimed',
}
