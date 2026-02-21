import api from "@/api/interceptor";
import { ENDPOINT } from "@/api/endpoint";
import { ReceiveShipmentBodyType } from "@/schemas/shipmentSchema";
import { BaseResponePagination, QueryShipment, Shipment, ShipmentDetail, ResponseData } from "@/type";

export const shipmentRequest = {
    // GET /shipments/store/my
    getMyStoreShipments: (query?: QueryShipment) => api.get<ResponseData<Shipment[]>>(ENDPOINT.SHIPMENTS_MY_STORE, { params: query }),


    // GET /shipments/:id
    getShipmentDetail: (id: string) => api.get<ResponseData<ShipmentDetail>>(ENDPOINT.SHIPMENT_DETAIL(id)),

    // PATCH /shipments/:id/receive-all
    receiveAllShipment: (id: string) => api.patch<ResponseData<{ shipmentId: string, status: string, receivedAt: string }>>(ENDPOINT.SHIPMENT_RECEIVE_ALL(id), {}),

    // POST /shipments/:id/receive
    receiveShipment: (id: string, data: ReceiveShipmentBodyType) => api.post<ResponseData<{ shipmentId: string, status: string, receivedAt: string, autoCreatedClaim: any }>>(ENDPOINT.SHIPMENT_RECEIVE(id), data),
};
