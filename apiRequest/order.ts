import api from "@/api/interceptor";
import { ENDPOINT } from "@/api/endpoint";
import { CreateOrderBodyType } from "@/schemas/orderSchema";
import { Order, OrderDetail, CatalogItem, QueryOrder, QueryCatalog, BaseResponsePagination, ResponseData } from "@/type";

export const orderRequest = {
    // GET /orders/catalog : xem danh sách sản phẩm
    getCatalog: (query?: QueryCatalog) => api.get<ResponseData<BaseResponsePagination<CatalogItem>>>(ENDPOINT.ORDER_CATALOG, { params: query }),


    // GET /orders/my-store : xem danh sách đơn hàng của my store
    getMyStoreOrders: (query?: QueryOrder) => api.get<ResponseData<BaseResponsePagination<Order>>>(ENDPOINT.MY_STORE_ORDER, { params: query }),

    // GET /orders/:id : xem chi tiết đơn hàng
    getOrderDetail: (id: string) => api.get<ResponseData<OrderDetail>>(ENDPOINT.ORDER_DETAIL(id)),

    // POST /orders : tạo đơn hàng
    createOrder: (data: CreateOrderBodyType) => api.post<ResponseData<Order>>(ENDPOINT.CREATE_ORDER, data),

    // PATCH /orders/franchise/:id/cancel : hủy đơn hàng
    cancelOrder: (id: string) => api.patch<ResponseData<{ orderId: string, status: string }>>(ENDPOINT.CANCEL_ORDER(id), {}),
};

