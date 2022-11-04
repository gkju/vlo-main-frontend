import {useQuery} from "@tanstack/react-query";
import {article, files, me, picture} from "../Constants";
import {FileApi} from "@gkju/vlo-boards-client-axios-ts";
import {OpenApiSettings, UNSAFE_TOKEN_instance} from "../../OpenApiConfig";

export const file_api = new FileApi(OpenApiSettings, "", UNSAFE_TOKEN_instance);

export const useFilesFolders = () => {
    return useQuery([me, files], () => {
        return file_api.apiFileManagementFileGetUserFoldersFilesGet();
    });
};

export const useFile = (Id: string) => {
    return useQuery([me, files, Id], () => {
        return file_api.apiFileManagementFileGetFileGet(Id);
    }, {retry: false});
};

export const useFileDetails = (Id: string) => {
    return useQuery([files, Id], () => {
        return file_api.apiFileManagementFileGetFilesInfoGet(Id);
    });
};
