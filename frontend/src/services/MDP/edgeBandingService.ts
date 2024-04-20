import { AxiosRequestConfig } from "axios";
import { DEdgeBanding } from "models/entities";
import { requestBackend } from "util/requests";

export function findAll(description: string, page?: number, size?: number, sort = "code") {
    const config : AxiosRequestConfig = {
        method: "GET",
        url: "/edgeBandings",
        params: {
            description,
            page,
            size,
            sort 
        },
        withCredentials: true
    }

    return requestBackend(config);
}

export function findAllActiveAndCurrentOne(id: number) {
    const config : AxiosRequestConfig = {
        method: "GET",
        url: "/edgeBandings/activeAndCurrentOne",
        params: {
            id
        },
        withCredentials: true
    }

    return requestBackend(config);
}

export function findById(id: number) {
    return requestBackend({ url: `/edgeBandings/${id}`, withCredentials: true });
}

export function insert(obj: DEdgeBanding) {
    const config: AxiosRequestConfig = {
        method: "POST",
        url: "/edgeBandings",
        withCredentials: true,
        data: obj
    }

    return requestBackend(config);
}

export function update(obj: DEdgeBanding) {
    const config: AxiosRequestConfig = {
        method: "PUT",
        url: `/edgeBandings/${obj.code}`,
        withCredentials: true,
        data: obj
    }

    return requestBackend(config);
}

export function inactivate(id: number) {
    const config: AxiosRequestConfig = {
        method: "PUT",
        url: `/edgeBandings/inactivate/${id}`,
        withCredentials: true
    }

    return requestBackend(config);
}

export function deleteById(id: number) {
    const config : AxiosRequestConfig = {
        method: "DELETE",
        url: `/edgeBandings/${id}`,
        withCredentials: true
    }

    return requestBackend(config);
}