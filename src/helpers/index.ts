import { StatusCode } from "../types";

type Response<T> = {
    message: string | Object[];
    code: StatusCode;
    data: T
}

export function jsonResponse<T>(value: Response<T>): Response<T> {
    return {
        code: value.code,
        data: value.data,
        message: value.message
    }
} 