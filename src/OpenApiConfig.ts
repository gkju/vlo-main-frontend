import {Configuration} from "@gkju/vlo-accounts-client-axios-ts";
import {apiOrigin, authOrigin} from "./Config";
import authService from "./Auth/AuthService";
import axios from "axios";

export const AccountsOpenApiSettings = new Configuration({
    basePath: authOrigin,
    accessToken: authService.GetToken
});

export const OpenApiSettings = new Configuration({
    basePath: apiOrigin,
    accessToken: authService.GetToken
});

export const UNSAFE_TOKEN_instance = axios.create({
    withCredentials: true
});

UNSAFE_TOKEN_instance.interceptors.request.use(async (config) => {
    if(!config.headers) {
        return config;
    }

    config.headers.Authorization = "Bearer " + await authService.GetToken();
    return config;
});
