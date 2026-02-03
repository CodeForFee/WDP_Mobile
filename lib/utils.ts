import { ResponseError } from '@/type';
import { jwtDecode } from 'jwt-decode';
export const normalizePath = (path: string) => {
  return path.startsWith('/') ? path.slice(1) : path
}

export const decodeJWT = <T>(token: string) => {
  return jwtDecode<T>(token);
}
export const isValidationError = (error: ResponseError): boolean => {
  return Array.isArray(error.errors) && error.errors.length > 0;
};