import api from "@/api/interceptor";
import { ENDPOINT } from "@/api/endpoint";
import { CreateClaimBodyType } from "@/schemas/claimSchema";
import { Claim, ClaimDetail, BaseResponsePagination, ResponseData, QueryClaim } from "@/type";

export const claimRequest = {
    // GET /claims/my-store : xem danh sách khiếu nại của my store
    getMyStoreClaims: (query?: QueryClaim) => api.get<ResponseData<BaseResponsePagination<Claim>>>(ENDPOINT.CLAIM_MY_STORE, { params: query }),


    // GET /claims/:id : xem chi tiết khiếu nại
    getClaimDetail: (id: string) => api.get<ResponseData<ClaimDetail>>(ENDPOINT.CLAIM_DETAIL(id)),

    // POST /claims : tạo khiếu nại
    createClaim: (data: CreateClaimBodyType) => api.post<ResponseData<Claim>>(ENDPOINT.CREATE_CLAIM, data),
};

