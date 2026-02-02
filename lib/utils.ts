import { jwtDecode } from 'jwt-decode';
export const normalizePath = (path: string) => {
  return path.startsWith('/') ? path.slice(1) : path
}

export const decodeJWT = <T>(token: string) => {
  return jwtDecode<T>(token);
}