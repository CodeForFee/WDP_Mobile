import api from "@/api/interceptor";
import { ENDPOINT } from "@/api/endpoint";
import { InventoryItem, InventoryTransaction, QueryInventory, QueryInventoryTransaction, BaseResponsePagination, ResponseData } from "@/type";

export const inventoryRequest = {
    // GET /inventory/store : xem danh sách tồn kho của my store
    getInventoryStore: (query?: QueryInventory) => api.get<ResponseData<BaseResponsePagination<InventoryItem>>>(ENDPOINT.INVENTORY_STORE, { params: query }),

    // GET /inventory/store/transactions : xem danh sách giao dịch của my store
    getInventoryStoreTransactions: (query?: QueryInventoryTransaction) => api.get<ResponseData<BaseResponsePagination<InventoryTransaction>>>(ENDPOINT.INVENTORY_STORE_TRANSACTIONS, { params: query }),
};


