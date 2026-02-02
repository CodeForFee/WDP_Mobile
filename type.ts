
export type ResponseData<T> = {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
  path: string;
};


export type BaseResponseError = {
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
  path: string;
}


export type ValidationErrorItem = {
  field: string;
  message: string;
}

export type ValidationResponseError = BaseResponseError & {
  statusCode: 400 | 422;
  errors: ValidationErrorItem[];
}


export type ResponseError =
  | ValidationResponseError
  | BaseResponseError;

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
