import api from "@/api/interceptor";
import { ENDPOINT } from "@/api/endpoint";
import { CreateClaimBodyType } from "@/schemas/claimSchema";
import { Claim, ClaimDetail, BaseResponePagination, ResponseData, QueryClaim } from "@/type";

export const claimRequest = {
    // GET /claims/my-store
    getMyStoreClaims: (query?: QueryClaim) => api.get<ResponseData<BaseResponePagination<Claim[]>>>(ENDPOINT.CLAIM_MY_STORE, { params: query }),


    // GET /claims/:id
    getClaimDetail: (id: string) => api.get<ResponseData<ClaimDetail>>(ENDPOINT.CLAIM_DETAIL(id)),

    // POST /claims
    createClaim: (data: CreateClaimBodyType) => api.post<ResponseData<Claim>>(ENDPOINT.CREATE_CLAIM, data),
};
