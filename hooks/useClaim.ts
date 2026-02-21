import { claimRequest } from "@/apiRequest/claim";
import { CreateClaimBodyType } from "@/schemas/claimSchema";
import { QueryClaim } from "@/type";

export const useClaim = {
    getMyStoreClaims: async (query?: QueryClaim) => {
        const res = await claimRequest.getMyStoreClaims(query);
        return res.data.data;
    },
    getClaimById: async (id: string) => {
        const res = await claimRequest.getClaimDetail(id);
        return res.data.data;
    },
    createClaim: async (data: CreateClaimBodyType) => {
        const res = await claimRequest.createClaim(data);
        return res.data.data;
    },
};
