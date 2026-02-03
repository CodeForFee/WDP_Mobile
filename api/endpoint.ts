

export const ENDPOINT = {
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh-token',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    PROFILE: '/user/me',


    ORDER_CATALOG: '/orders/catalog',
    ORDER: '/orders',
    ORDER_DETAIL: (id: string) => `/orders/${id}`,
    ORDERS_MY_STORE: '/orders/my-store',
    ORDER_CANCEL: (id: string) => `/orders/${id}/cancel`,

}

