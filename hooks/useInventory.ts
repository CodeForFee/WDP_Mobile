import { inventoryRequest } from "@/apiRequest/inventory";
import { QueryInventory, QueryInventoryTransaction } from "@/type";

export const useInventory = {
    getStoreInventory: async (query?: QueryInventory) => {
        const res = await inventoryRequest.getInventoryStore(query);
        return res.data.data;
    },
    getStoreTransactions: async (query?: QueryInventoryTransaction) => {
        const res = await inventoryRequest.getInventoryStoreTransactions(query);
        return res.data.data;
    },
};
