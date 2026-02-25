import { z } from "zod";

/** CreateOrderDto - theo api.md: deliveryDate (ISO), items (productId, quantity) */
export const orderSchema = z.object({
  deliveryDate: z.string().datetime({ message: "Ngày giao phải là định dạng ISO" }),

  items: z
    .array(
      z.object({
        productId: z.number().int().positive("Mã sản phẩm phải > 0"),
        quantity: z.number().int().positive("Số lượng phải > 0"),
      })
    )
    .min(1, "Cần ít nhất 1 sản phẩm"),
});

export type OrderInput = z.infer<typeof orderSchema>;
