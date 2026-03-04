import { shipmentRequest } from "@/apiRequest/shipment";
import { ReceiveShipmentBodyType } from "@/schemas/shipmentSchema";
import { QueryShipment } from "@/type";
import { KEY, QUERY_KEY } from "@/constant";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useShipment = () => {
    const queryClient = useQueryClient();

    const useMyStoreShipments = (query: QueryShipment) => {
        return useQuery({
            queryKey: QUERY_KEY.shipments.myStore(query),
            queryFn: async () => {
                const res = await shipmentRequest.getMyStoreShipments(query);
                return res.data.data.items;
            },
        });
    };

    const useShipmentDetail = (id: string) => {
        return useQuery({
            queryKey: QUERY_KEY.shipments.detail(id),
            queryFn: async () => {
                const res = await shipmentRequest.getShipmentDetail(id);
                return res.data.data;
            },
            enabled: !!id,
        });
    };

    const receiveAllMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await shipmentRequest.receiveAllShipment(id);
            return res.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: KEY.shipments });
        },
    });

    const receiveWithDetailsMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string, data: ReceiveShipmentBodyType }) => {
            const res = await shipmentRequest.receiveShipment(id, data);
            return res.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: KEY.shipments });
        },
    });

    return {
        useMyStoreShipments,
        useShipmentDetail,
        receiveAllMutation,
        receiveWithDetailsMutation,
    };
};
