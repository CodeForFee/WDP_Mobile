import { inventoryRequest } from "@/apiRequest/inventory";
import { QueryInventory, QueryInventoryTransaction } from "@/type";
import { QUERY_KEY } from "@/constant";
import { useQuery } from "@tanstack/react-query";

export const useInventory = () => {
    const useStoreInventory = (query: QueryInventory) => {
        return useQuery({
            queryKey: QUERY_KEY.inventory.store(query),
            queryFn: async () => {
                const res = await inventoryRequest.getInventoryStore(query);
                return res.data.data.items;
            },
        });
    };

    const useStoreTransactions = (query: QueryInventoryTransaction) => {
        return useQuery({
            queryKey: QUERY_KEY.inventory.transaction(query),
            queryFn: async () => {
                const res = await inventoryRequest.getInventoryStoreTransactions(query);
                return res.data.data.items;
            },
        });
    };

    return {
        useStoreInventory,
        useStoreTransactions,
    };
};
