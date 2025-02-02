import { AxiosRequestConfig } from "axios";
import { DMDPSon } from "models/entities";
import { requestBackend } from "util/requests";

export function findAll(description: string, page?: number, size?: number, status?: string, sort = "code") {
    const config : AxiosRequestConfig = {
        method: "GET",
        url: "/mdpSons",
        params: {
            description,
            page,
            size,
            sort,
            status
        },
        withCredentials: true
    }

    return requestBackend(config);
}

export function findAllActiveAndCurrentOne(id: number) {
    const config : AxiosRequestConfig = {
        method: "GET",
        url: "/mdpSons/activeAndCurrentOne",
        params: {
            id
        },
        withCredentials: true
    }

    return requestBackend(config);
}

export function findById(id: number) {
    return requestBackend({ url: `/mdpSons/${id}`, withCredentials: true });
}

export function insert(obj: DMDPSon) {
    const config: AxiosRequestConfig = {
        method: "POST",
        url: "/mdpSons",
        withCredentials: true,
        data: obj
    }

    return requestBackend(config);
}

export function update(obj: DMDPSon) {
    const config: AxiosRequestConfig = {
        method: "PUT",
        url: `/mdpSons/${obj.code}`,
        withCredentials: true,
        data: obj
    }

    return requestBackend(config);
}

export function inactivate(id: number) {
    const config: AxiosRequestConfig = {
        method: "PUT",
        url: `/mdpSons/inactivate/${id}`,
        withCredentials: true
    }

    return requestBackend(config);
}

export function deleteById(id: number) {
    const config : AxiosRequestConfig = {
        method: "DELETE",
        url: `/mdpSons/${id}`,
        withCredentials: true
    }

    return requestBackend(config);
}