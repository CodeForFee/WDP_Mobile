import { Alert } from "react-native";
import { UseFormSetError } from "react-hook-form";
import { ResponseError } from "@/type";

/* ================= ERROR CLASSES ================= */

export class HttpError extends Error {
  payload: ResponseError;

  constructor(payload: ResponseError) {
    super(payload.message);
    this.name = "HttpError";
    this.payload = payload;
  }
}

export class EntityError extends HttpError {
  constructor(payload: ResponseError) {
    super(payload);
    this.name = "EntityError";
  }
}

/* ================= HANDLE ERROR ================= */

interface HandleErrorParams {
  error: unknown;
  setError?: UseFormSetError<any>;
}

export const handleErrorApi = ({
  error,
  setError,
}: HandleErrorParams) => {

 
  if (error instanceof EntityError) {
    if (!setError) {
      Alert.alert("Lỗi", error.message);
      return;
    }

      // map errors với setError
    const errors = error.payload.errors;
    if (errors && errors.length > 0) {
      errors.forEach((err) => {
        setError(err.field, {
          type: "server",
          message: err.message,
        });
      });
    }
    return;
  }


  if (error instanceof HttpError) {
    Alert.alert("Lỗi", error.message);
    return;
  }


  Alert.alert("Lỗi", "Có lỗi không xác định xảy ra");
};
