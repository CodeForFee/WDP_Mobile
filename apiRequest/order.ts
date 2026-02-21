import api from "@/api/interceptor";
import { ENDPOINT } from "@/api/endpoint";
import { CreateOrderBodyType } from "@/schemas/orderSchema";
import { Order, OrderDetail, CatalogItem, QueryOrder, QueryCatelog, BaseResponePagination, ResponseData } from "@/type";

export const orderRequest = {
    // GET /orders/catalog
    getCatalog: (query?: QueryCatelog) => api.get<ResponseData<CatalogItem[]>>(ENDPOINT.ORDER_CATALOG, { params: query }),


    // GET /orders/my-store
    getMyStoreOrders: (query?: QueryOrder) => api.get<ResponseData<BaseResponePagination<Order[]>>>(ENDPOINT.MY_STORE_ORDER, { params: query }),

    // GET /orders/:id
    getOrderDetail: (id: string) => api.get<ResponseData<OrderDetail>>(ENDPOINT.ORDER_DETAIL(id)),

    // POST /orders
    createOrder: (data: CreateOrderBodyType) => api.post<ResponseData<Order>>(ENDPOINT.CREATE_ORDER, data),

    // PATCH /orders/franchise/:id/cancel
    cancelOrder: (id: string) => api.patch<ResponseData<{ orderId: string, status: string }>>(ENDPOINT.CANCEL_ORDER(id), {}),
};
