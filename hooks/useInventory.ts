import api from "@/api/interceptor";
import { ENDPOINT } from "@/api/endpoint";
import { ResponseData } from "@/type";

export type InventoryStoreItem = {
    id: string;
    productId: number;
    warehouseId: number;
    stockQuantity: number;
    committedQuantity: number;
    availableQuantity: number;
    minStockLevel: number;
    maxStockLevel: number;
    product: {
        id: number;
        name: string;
        sku: string;
        imageUrl: string;
    };
};

export const useInventory = {
    getInventoryStore: async (query?: any) => {
        const res = await api.get<ResponseData<{ items: InventoryStoreItem[] }>>(ENDPOINT.INVENTORY_STORE, { params: query });
        return res.data.data;
    },
};
