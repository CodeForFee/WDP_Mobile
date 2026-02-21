import { claimRequest } from "@/apiRequest/claim";
import { CreateClaimBodyType } from "@/schemas/claimSchema";

export const useClaim = {
    getMyStoreClaims: async (status?: string) => {
        const res = await claimRequest.getMyStoreClaims({ status });
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
