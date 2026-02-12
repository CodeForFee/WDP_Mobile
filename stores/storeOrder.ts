import { create } from "zustand";

interface OrderItem {
    id: number;
    quantity: number;
    name?: string;
    unit?: string;
    image_url?: string;
}
interface OrderState {
    items: OrderItem[];
    addItem: (item: OrderItem) => void;
    updateQuantity: (id: number, quantity: number) => void;
    removeItem: (id: number) => void;
    clearItems: () => void;
}

export const useStoreOrder = create<OrderState>((set) => ({
    items: [],

    addItem: (item) =>
        set((state) => ({
            items: [...state.items, item],
        })),

    updateQuantity: (id, quantity) =>
        set((state) => ({
            items: state.items.map((p) =>
                p.id === id
                    ? { ...p, quantity }
                    : p
            ),
        })),

    removeItem: (id) =>
        set((state) => ({
            items: state.items.filter(
                (p) => p.id !== id
            ),
        })),

    clearItems: () => set({ items: [] }),
}));
