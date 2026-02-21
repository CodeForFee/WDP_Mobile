import api from "@/api/interceptor";
import { ENDPOINT } from "@/api/endpoint";
import { InventoryItem, InventoryTransaction, QueryInventory, QueryInventoryTransaction, BaseResponePagination, ResponseData } from "@/type";

export const inventoryRequest = {
    // GET /inventory/store
    getInventoryStore: (query?: QueryInventory) => api.get<ResponseData<BaseResponePagination<InventoryItem[]>>>(ENDPOINT.INVENTORY_STORE, { params: query }),

    // GET /inventory/store/transactions
    getInventoryStoreTransactions: (query?: QueryInventoryTransaction) => api.get<ResponseData<BaseResponePagination<InventoryTransaction[]>>>(ENDPOINT.INVENTORY_STORE_TRANSACTIONS, { params: query }),
};

