import { Alert } from "react-native";
import { UseFormSetError } from "react-hook-form";
import { BaseResponseError, ValidationResponseError } from "@/type";




export class HttpError extends Error {
  status: number;
  payload: BaseResponseError;

  constructor(status: number, payload: BaseResponseError) {
    super(payload.message || "Http Error");
    this.status = status;
    this.payload = payload;
  }
}


export class EntityError extends HttpError {
  payload: ValidationResponseError;

  constructor(payload: ValidationResponseError) {
    super(payload.statusCode, payload);
    this.payload = payload;
  }
}






interface HandleErrorParams {
  error: unknown;
  setError?: UseFormSetError<any>;
}

export const handleErrorApi = ({ error, setError }: HandleErrorParams) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach(({ field, message }) => {
      setError(field, {
        type: "server",
        message,
      });
    });
    return;
  }

  if (error instanceof HttpError) {
    Alert.alert("Lỗi", error.payload.message);
    return;
  }

  if (error instanceof Error) {
    Alert.alert("Lỗi", error.message);
    return;
  }

  Alert.alert("Lỗi", "Có lỗi không xác định xảy ra");
};
