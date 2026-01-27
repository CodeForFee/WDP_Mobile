import api from './api';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  price?: number;
}

export interface Order {
  id: string;
  storeId?: string;
  storeName?: string;
  date: string;
  status: 'Pending' | 'Processing' | 'Ready' | 'Delivered' | 'Consolidated';
  items: OrderItem[];
  total?: string;
  priority?: 'Normal' | 'High';
}

export const orderService = {
  // Franchise: Get orders for the current store
  getMyOrders: async (): Promise<Order[]> => {
    // return api.get('/orders/my');
    return [
      { id: '1', date: '2023-10-25', status: 'Pending', items: [], total: '$120.00' },
      { id: '2', date: '2023-10-24', status: 'Processing', items: [], total: '$450.50' },
      { id: '3', date: '2023-10-22', status: 'Delivered', items: [], total: '$210.25' },
    ];
  },

  // Franchise: Create a new order
  createOrder: async (items: { productId: string; quantity: number }[]): Promise<Order> => {
    // return api.post('/orders', { items });
    return {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      items: [],
      total: '$0.00',
    };
  },

  // Kitchen: Get all incoming orders
  getIncomingOrders: async (): Promise<Order[]> => {
    // return api.get('/orders/incoming');
    return [
      { id: '1', storeName: 'Store #123', date: '2023-10-25', status: 'Pending', items: [], priority: 'High' },
      { id: '2', storeName: 'Store #124', date: '2023-10-25', status: 'Processing', items: [], priority: 'Normal' },
    ];
  },

  // Kitchen: Update order status
  updateStatus: async (orderId: string, status: string): Promise<void> => {
    // return api.patch(`/orders/${orderId}/status`, { status });
    console.log(`Updating order ${orderId} to ${status}`);
  },

  // Common: Get order details
  getOrderDetails: async (orderId: string): Promise<Order | null> => {
    // return api.get(`/orders/${orderId}`);
    return {
      id: orderId,
      storeName: 'Store #123',
      date: '2023-10-25',
      status: 'Pending',
      priority: 'High',
      items: [
        { id: 'p1', name: 'Burger Buns', quantity: 50, unit: 'pack' },
        { id: 'p2', name: 'Beef Patties', quantity: 20, unit: 'kg' },
      ],
    };
  },
};
