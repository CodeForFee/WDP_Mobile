import { ENDPOINT } from "@/api/endpoint";
import api from "@/api/interceptor";
import { OrderInput } from "@/schemas/orderSchema";
import { CancelOrder, Catelog, Order, OrderDetail, OrderMyStore, ResponseData } from "@/type";


export const useOrder = {
    getCatalog: async () => {
        const res = await api.get<ResponseData<Catelog[]>>(ENDPOINT.ORDER_CATALOG);
        return res.data.data;
    },
    createOrder: async (data: OrderInput) => {
        const res = await api.post<ResponseData<Order>>(ENDPOINT.ORDER, data);
        return res.data.data;
    },
    cancelOrder: async (id: string) => {
        const res = await api.delete<ResponseData<CancelOrder>>(ENDPOINT.ORDER_CANCEL(id));
        return res.data.data;
    },
    getMyStoreOrders: async () => {
        const res = await api.get<ResponseData<OrderMyStore[]>>(ENDPOINT.ORDERS_MY_STORE);
        return res.data.data;
    },
    getOrderById: async (id: string) => {
        const res = await api.get<ResponseData<OrderDetail>>(ENDPOINT.ORDER_DETAIL(id));
        return res.data.data;
    },
} 