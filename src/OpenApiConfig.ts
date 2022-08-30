import {Configuration} from "@gkju/vlo-accounts-client-axios-ts";
import {authOrigin} from "./Config";
import authService from "./Auth/AuthService";

export const AccountsOpenApiSettings = new Configuration({
    basePath: authOrigin,
    accessToken: authService.GetToken
});
