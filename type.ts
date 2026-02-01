


export type ResponseData<T> = {
    statusCode: number,
    message: string,
    data:T,
    timestamp: string
    path: string
}
export type UserReponse = {
    id: string,
    email: string,
    username: string,
    role : string
    storeId?: string
}

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
}