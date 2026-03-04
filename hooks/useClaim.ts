import { claimRequest } from "@/apiRequest/claim";
import { CreateClaimBodyType } from "@/schemas/claimSchema";
import { QueryClaim } from "@/type";
import { KEY, QUERY_KEY } from "@/constant";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useClaim = () => {
    const queryClient = useQueryClient();

    const useMyStoreClaims = (query: QueryClaim) => {
        return useQuery({
            queryKey: QUERY_KEY.claims.myStore(query),
            queryFn: async () => {
                const res = await claimRequest.getMyStoreClaims(query);
                return res.data.data.items;
            },
        });
    };

    const useClaimDetail = (id: string) => {
        return useQuery({
            queryKey: QUERY_KEY.claims.detail(id),
            queryFn: async () => {
                const res = await claimRequest.getClaimDetail(id);
                return res.data.data;
            },
            enabled: !!id,
        });
    };

    const createClaimMutation = useMutation({
        mutationFn: async (data: CreateClaimBodyType) => {
            const res = await claimRequest.createClaim(data);
            return res.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: KEY.claims });
        },
    });

    return {
        useMyStoreClaims,
        useClaimDetail,
        createClaimMutation,
    };
};
