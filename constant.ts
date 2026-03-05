import { QueryOrder, QueryCatalog, QueryClaim, QueryShipment, QueryInventory, QueryInventoryTransaction } from "./type";

export const KEY = {
    me: ['profile'],
    orders: ['orders'],
    claims: ['claims'],
    inventory: ['inventory'],
    shipments: ['shipments'],
} as const;

export const QUERY_KEY = {
    // ======================
    // AUTH / PROFILE
    // ======================
    auth: {
        me: () => [...KEY.me] as const,
    },

    // ======================
    // ORDERS
    // ======================
    orders: {
        catalog: (query: QueryCatalog) => [...KEY.orders, 'catalog', query] as const,
        myStore: (query: QueryOrder) => [...KEY.orders, 'my-store', query] as const,
        detail: (id: string) => [...KEY.orders, 'detail', id] as const,
    },

    // ======================
    // CLAIMS
    // ======================
    claims: {
        myStore: (query: QueryClaim) => [...KEY.claims, 'my-store', query] as const,
        detail: (id: string) => [...KEY.claims, 'detail', id] as const,
    },

    // ======================
    // INVENTORY
    // ======================
    inventory: {
        store: (query: QueryInventory) => [...KEY.inventory, 'store', query] as const,
        transaction: (query: QueryInventoryTransaction) => [...KEY.inventory, 'transaction', query] as const,
    },

    // ======================
    // SHIPMENTS
    // ======================
    shipments: {
        myStore: (query: QueryShipment) => [...KEY.shipments, 'my-store', query] as const,
        detail: (id: string) => [...KEY.shipments, 'detail', id] as const,
    },

} as const;

export const PAGINATION_DEFAULT = {
    sortOrder: 'DESC' as 'DESC' | 'ASC'
};
