import {AccountsDataModelsDataModelsArticle, ArticleApi} from "@gkju/vlo-boards-client-axios-ts";
import {OpenApiSettings, UNSAFE_TOKEN_instance} from "../../OpenApiConfig";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {article, picture} from "../Constants";
import {AxiosResponse} from "axios";
import {useThrottle} from "react-use";
import _ from "lodash";

const api = new ArticleApi(OpenApiSettings, "", UNSAFE_TOKEN_instance);

export const createArticle = async (): Promise<string> => {
    let articleId = (await api.apiArticlesArticlePost()).data;
    return String(articleId);
}

export const useSetPicture = () => {

    const queryClient = useQueryClient();

    return async (articleId: string, file: File) => {
        await api.apiArticlesArticleSetPicturePost(articleId, file);
        await queryClient.invalidateQueries([article, articleId]);
    }
}

export const useArticlePicture = (Id: string) => {
    return useQuery([article, Id, picture], () => {
        return api.apiArticlesArticleGetPictureGet(Id);
    }, {retry: false});
}

export const useSetTitle = (id: string) => {
    const queryClient = useQueryClient();
    return _.debounce(async (title: string) => {
        await api.apiArticlesArticleSetTitlePut({
            articleId: id,
            title
        });
        await queryClient.invalidateQueries([article, id]);
    }, 1000);
}

export const useSetContent = (id: string) => {
    const queryClient = useQueryClient();
    return _.debounce(async (contentJson: string) => {
        await api.apiArticlesArticlePut({
            articleId: id,
            contentJson
        });
        await queryClient.invalidateQueries([article, id]);
    }, 5000);
}

export const useArticleTags = (id: string) => {
    return useQuery([article, id, "tags"], () => {
        return api.apiArticlesArticleTagsGet(id);
    }, {retry: false});
}

export const useArticleDetails = (id: string) => {
    return useQuery<AxiosResponse<AccountsDataModelsDataModelsArticle>>([article, id], () => {
        return api.apiArticlesArticleGetArticleGet(id);
    });
}

export const isValidJson = (str: string) => {
    if(!str.startsWith("{") || !str.endsWith("}")) {
        return false;
    }
    return /^[\],:{}\s]*$/.test(str.replace(/\\["\\\/bfnrtu]/g, '@').
    replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
    replace(/(?:^|:|,)(?:\s*\[)+/g, ''));
}
