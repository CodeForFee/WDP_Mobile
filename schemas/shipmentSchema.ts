import { z } from "zod";

export const ReceiveShipmentBody = z.object({
    items: z.array(z.object({
        batchId: z.number().int().positive('ID lô hàng không hợp lệ'),
        actualQty: z.number().int().min(0, 'Số lượng thực nhận không hợp lệ'),
        damagedQty: z.number().int().min(0, 'Số lượng hàng hỏng không hợp lệ'),
        evidenceUrls: z.array(z.string()).optional()
    })),
    notes: z.string().optional()
});


export type ReceiveShipmentBodyType = z.infer<typeof ReceiveShipmentBody>;

// Keep old names if needed
export type ReceiveShipmentInput = ReceiveShipmentBodyType;
export type ShipmentReceiveItemInput = ReceiveShipmentBodyType['items'][number];
