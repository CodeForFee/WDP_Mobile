import api from "@/api/interceptor";
import { ENDPOINT } from "@/api/endpoint";
import { ReceiveShipmentBodyType } from "@/schemas/shipmentSchema";
import { BaseResponsePagination, QueryShipment, Shipment, ShipmentDetail, ResponseData } from "@/type";

export const shipmentRequest = {
    // GET /shipments/store/my : xem danh sách shipment của my store
    getMyStoreShipments: (query?: QueryShipment) => api.get<ResponseData<BaseResponsePagination<Shipment>>>(ENDPOINT.SHIPMENTS_MY_STORE, { params: query }),

    // GET /shipments/:id : xem chi tiết shipment
    getShipmentDetail: (id: string) => api.get<ResponseData<ShipmentDetail>>(ENDPOINT.SHIPMENT_DETAIL(id)),

    // PATCH /shipments/:id/receive-all : xác nhận đơn hàng đủ hàng( k bị hư hại)
    receiveAllShipment: (id: string) => api.patch<ResponseData<{ shipmentId: string, status: string, hasDiscrepancy: boolean, claimId: string | null }>>(ENDPOINT.SHIPMENT_RECEIVE_ALL(id), {}),

    // POST /shipments/:id/receive : xác nhận đơn hàng thiếu hàng( có thể bị hư hại)
    receiveShipment: (id: string, data: ReceiveShipmentBodyType) => api.post<ResponseData<{ shipmentId: string, status: string, hasDiscrepancy: boolean, claimId: string | null }>>(ENDPOINT.SHIPMENT_RECEIVE(id), data),
};


