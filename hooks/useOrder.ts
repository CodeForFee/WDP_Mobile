import { orderRequest } from "@/apiRequest/order";
import { CreateOrderBodyType } from "@/schemas/orderSchema";
import { QueryOrder, QueryCatalog } from "@/type";

export const useOrder = {
    getCatalog: async (query?: QueryCatalog) => {
        const res = await orderRequest.getCatalog(query);
        return res.data.data;
    },
    createOrder: async (data: CreateOrderBodyType) => {
        const res = await orderRequest.createOrder(data);
        return res.data.data;
    },
    cancelOrder: async (id: string) => {
        const res = await orderRequest.cancelOrder(id);
        return res.data.data;
    },
    getMyStoreOrders: async (query?: QueryOrder) => {
        const res = await orderRequest.getMyStoreOrders(query);
        return res.data.data;
    },
    getOrderById: async (id: string) => {
        const res = await orderRequest.getOrderDetail(id);
        return res.data.data;
    },
} 