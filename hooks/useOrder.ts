import { orderRequest } from "@/apiRequest/order";
import { CreateOrderBodyType } from "@/schemas/orderSchema";
import { QueryOrder, QueryCatalog } from "@/type";
import { KEY, QUERY_KEY } from "@/constant";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useOrder = () => {
    const queryClient = useQueryClient();

    const useCatalog = (query: QueryCatalog) => {
        return useQuery({
            queryKey: QUERY_KEY.orders.catalog(query),
            queryFn: async () => {
                const res = await orderRequest.getCatalog(query);
                return res.data.data.items;
            },
        });
    };

    const useMyStoreOrders = (query: QueryOrder) => {
        return useQuery({
            queryKey: QUERY_KEY.orders.myStore(query),
            queryFn: async () => {
                const res = await orderRequest.getMyStoreOrders(query);
                return res.data.data.items;
            },
        });
    };

    const useOrderDetail = (id: string) => {
        return useQuery({
            queryKey: QUERY_KEY.orders.detail(id),
            queryFn: async () => {
                const res = await orderRequest.getOrderDetail(id);
                return res.data.data;
            },
            enabled: !!id,
        });
    };

    const createOrderMutation = useMutation({
        mutationFn: async (data: CreateOrderBodyType) => {
            const res = await orderRequest.createOrder(data);
            return res.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: KEY.orders });
        },
    });

    const cancelOrderMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await orderRequest.cancelOrder(id);
            return res.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: KEY.orders });
        },
    });

    return {
        useCatalog,
        useMyStoreOrders,
        useOrderDetail,
        createOrderMutation,
        cancelOrderMutation,
    };
};