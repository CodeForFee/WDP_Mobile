import { shipmentRequest } from "@/apiRequest/shipment";
import { ReceiveShipmentBodyType } from "@/schemas/shipmentSchema";
import { QueryShipment } from "@/type";

export const useShipment = {
    getMyStoreShipments: async (query?: QueryShipment) => {
        const res = await shipmentRequest.getMyStoreShipments(query);
        return res.data.data;
    },
    getShipmentById: async (id: string) => {
        const res = await shipmentRequest.getShipmentDetail(id);
        return res.data.data;
    },
    receiveAll: async (id: string) => {
        const res = await shipmentRequest.receiveAllShipment(id);
        return res.data.data;
    },
    receiveWithDetails: async (id: string, data: ReceiveShipmentBodyType) => {
        const res = await shipmentRequest.receiveShipment(id, data);
        return res.data.data;
    },
};
