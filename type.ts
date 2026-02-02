
export type ResponseData<T> = {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
  path: string;
};


export type ResponseError = {
  statusCode: number;
  message: string;
  errors: ValidationErrorItem[];
  timestamp: string;
  path: string;
};


export type ValidationErrorItem = {
  field: string;
  message: string;
}


export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};
export type User = {
  id: string;
  username: string;
  email: string;
  role: string;
  storeId?: string;
  status: string;
  createdAt: string;
}
