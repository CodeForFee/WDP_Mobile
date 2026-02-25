

export const ENDPOINT = {
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh-token',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    PROFILE: '/auth/me',


    ORDER_CATALOG: '/orders/catalog',
    ORDER: '/orders',
    ORDER_DETAIL: (id: string) => `/orders/${id}`,
    ORDERS_MY_STORE: '/orders/my-store',
    /** PATCH /orders/franchise/:id/cancel - theo api.md */
    ORDER_CANCEL: (id: string) => `/orders/franchise/${id}/cancel`,

}

