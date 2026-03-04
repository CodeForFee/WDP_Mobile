



export const ENDPOINT = {
    // Auth
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh-token',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    PROFILE: '/auth/me',

    // Orders
    ORDER_CATALOG: '/orders/catalog',
    CREATE_ORDER: '/orders',
    MY_STORE_ORDER: '/orders/my-store',
    ORDER_DETAIL: (id: string) => `/orders/${id}`,
    CANCEL_ORDER: (id: string) => `/orders/franchise/${id}/cancel`,

    // Claims
    CLAIM_MY_STORE: '/claims/my-store',
    CLAIM_DETAIL: (id: string) => `/claims/${id}`,
    CREATE_CLAIM: '/claims',

    // Inventory
    INVENTORY_STORE: '/inventory/store',
    INVENTORY_STORE_TRANSACTIONS: '/inventory/store/transactions',


    // Shipments
    SHIPMENTS_MY_STORE: '/shipments/store/my',
    SHIPMENT_DETAIL: (id: string) => `/shipments/${id}`,
    SHIPMENT_RECEIVE_ALL: (id: string) => `/shipments/${id}/receive-all`,
    SHIPMENT_RECEIVE: (id: string) => `/shipments/${id}/receive`,

};

