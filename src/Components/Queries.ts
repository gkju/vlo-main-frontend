import { useQuery } from "@tanstack/react-query";
import {
    ProfileInfoApi,
    ProfilePictureApi,
    AccountsDataModelsDataModelsApplicationUser,
    VLOBOARDSAreasAuthManageExternalLoginInfo, ExternalLoginApi, ExternalLoginsManagementApi
} from "@gkju/vlo-accounts-client-axios-ts";
import axios, { AxiosResponse } from "axios";
import {externalLoginInfo, profileInfo, profilePicture} from "./Constants";
import {AccountsOpenApiSettings} from "../OpenApiConfig";

const instance = axios.create({
  withCredentials: true
})

const pfpApi = new ProfilePictureApi(AccountsOpenApiSettings, undefined, instance);
const profileInfoApi = new ProfileInfoApi(AccountsOpenApiSettings, undefined, instance);
const externalLoginsManagementApi = new ExternalLoginsManagementApi(AccountsOpenApiSettings, undefined, instance);

export const useProfilePicture = (Id: string) => {
    const { data, error, isLoading } = useQuery<AxiosResponse>([profilePicture, Id], () => {
        return pfpApi.apiAuthProfilePictureGet(Id);
    });

    return { data, error, isLoading };
};

export const useProfileInfo = () => {
    return useQuery<AxiosResponse<AccountsDataModelsDataModelsApplicationUser>>([profileInfo, "own"], () => {
        return profileInfoApi.apiAuthProfileInfoGet();
    });
}

export const useLogins = () => {
    return useQuery<AxiosResponse<VLOBOARDSAreasAuthManageExternalLoginInfo>>([externalLoginInfo, "own"], () => {
        return externalLoginsManagementApi.apiAuthExternalLoginsManagementGet();
    });
}
