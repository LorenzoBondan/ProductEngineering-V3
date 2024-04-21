import { AxiosRequestConfig } from "axios";
import { DDrawerPull } from "models/entities";
import { requestBackend } from "util/requests";

export function findAll(description: string, page?: number, size?: number, status?: string, sort = "code") {
    const config : AxiosRequestConfig = {
        method: "GET",
        url: "/drawerPulls",
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
        url: "/drawerPulls/activeAndCurrentOne",
        params: {
            id
        },
        withCredentials: true
    }

    return requestBackend(config);
}

export function findById(id: number) {
    return requestBackend({ url: `/drawerPulls/${id}`, withCredentials: true });
}

export function insert(obj: DDrawerPull) {
    const config: AxiosRequestConfig = {
        method: "POST",
        url: "/drawerPulls",
        withCredentials: true,
        data: obj
    }

    return requestBackend(config);
}

export function update(obj: DDrawerPull) {
    const config: AxiosRequestConfig = {
        method: "PUT",
        url: `/drawerPulls/${obj.code}`,
        withCredentials: true,
        data: obj
    }

    return requestBackend(config);
}

export function inactivate(id: number) {
    const config: AxiosRequestConfig = {
        method: "PUT",
        url: `/drawerPulls/inactivate/${id}`,
        withCredentials: true
    }

    return requestBackend(config);
}

export function deleteById(id: number) {
    const config : AxiosRequestConfig = {
        method: "DELETE",
        url: `/drawerPulls/${id}`,
        withCredentials: true
    }

    return requestBackend(config);
}