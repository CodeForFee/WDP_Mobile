

import { z } from "zod";

export const orderSchema = z.object({
    deliveryDate: z.iso.datetime(),

    items: z.array(
        z.object({
            productId: z.number().int().positive(),
            quantity: z.number().int().positive(),
        })
    ).min(1),
});


export type OrderInput = z.infer<typeof orderSchema>;
