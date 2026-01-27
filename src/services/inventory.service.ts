import api from './api';

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  threshold?: number;
  status: 'Good' | 'Low' | 'Expiring Soon' | 'Out of Stock';
  batch?: string;
  expiry?: string;
  batches?: Batch[];
}

export interface Batch {
  id: string;
  quantity: number;
  expiry: string;
  status: 'Good' | 'Expiring Soon' | 'Expired';
}

export const inventoryService = {
  // Franchise: Get store inventory
  getStoreInventory: async (storeId?: string): Promise<InventoryItem[]> => {
    // return api.get('/inventory/store');
    return [
      { id: '1', name: 'Burger Buns', quantity: 150, unit: 'pcs', threshold: 50, status: 'Good' },
      { id: '2', name: 'Beef Patties', quantity: 20, unit: 'kg', threshold: 25, status: 'Low' },
    ];
  },

  // Kitchen: Get kitchen inventory (raw materials)
  getKitchenInventory: async (): Promise<InventoryItem[]> => {
    // return api.get('/inventory/kitchen');
    return [
      { id: '1', name: 'Flour (Premium)', quantity: 2000, unit: 'kg', batch: 'B-231020', expiry: '2024-04-20', status: 'Good' },
      { id: '3', name: 'Milk (Whole)', quantity: 50, unit: 'L', batch: 'B-231022', expiry: '2023-10-29', status: 'Low' },
    ];
  },

  // Common: Get item details
  getItemDetails: async (itemId: string): Promise<InventoryItem | null> => {
    // return api.get(`/inventory/${itemId}`);
    return {
      id: itemId,
      name: 'Flour (Premium)',
      quantity: 2000,
      unit: 'kg',
      threshold: 500,
      status: 'Good',
      batches: [
        { id: 'B-231020', quantity: 1500, expiry: '2024-04-20', status: 'Good' },
        { id: 'B-230915', quantity: 500, expiry: '2023-11-15', status: 'Good' },
      ],
    };
  },

  // Common: Update stock level
  updateStock: async (itemId: string, quantity: number, type: 'add' | 'remove'): Promise<void> => {
    // return api.post(`/inventory/${itemId}/adjust`, { quantity, type });
    console.log(`Adjusting stock for ${itemId}: ${type} ${quantity}`);
  },
};
