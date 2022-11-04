import {AccountsDataModelsDataModelsArticle, ArticleApi, TagApi} from "@gkju/vlo-boards-client-axios-ts";
import {AccountsOpenApiSettings, OpenApiSettings, UNSAFE_TOKEN_instance} from "../../OpenApiConfig";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {article, files, picture, tags} from "../Constants";
import {AxiosResponse} from "axios";
import {useThrottle} from "react-use";
import _ from "lodash";
import {FilesApi} from "@gkju/vlo-accounts-client-axios-ts";

export const api = new ArticleApi(OpenApiSettings, "", UNSAFE_TOKEN_instance);
export const tagsApi = new TagApi(OpenApiSettings, "", UNSAFE_TOKEN_instance);
export const accountsApi = new FilesApi(AccountsOpenApiSettings, "", UNSAFE_TOKEN_instance);

export const createArticle = async (): Promise<string> => {
    let articleId = (await api.apiArticlesArticlePost()).data;
    return String(articleId);
}

export const usePresignedUrl = (fileId: string) => {
    return useQuery([files, fileId], () => {
        return accountsApi.apiFilesFilesFileGet(fileId);
    });
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

export const useSetContentNow = (id: string) => {
    const queryClient = useQueryClient();
    return async (contentJson: string) => {
        await api.apiArticlesArticlePut({
            articleId: id,
            contentJson
        });
        await queryClient.invalidateQueries([article, id]);
    };
}

export const useSetTag = (id: string) => {
    const queryClient = useQueryClient();
    return async (tagContent: string) => {
        await tagsApi.apiTagsTagAddToArticlePost(id, tagContent);
        await queryClient.invalidateQueries([article, id]);
    }
}

export const useDeleteTag = (id: string) => {
    const queryClient = useQueryClient();
    return async (tagContent: string) => {
        await tagsApi.apiTagsTagRemoveFromArticleDelete(id, tagContent);
        await queryClient.invalidateQueries([article, id]);
    }
}

export const useSetPublic = (id: string) => {
    const queryClient = useQueryClient();
    return async (isPublic: boolean) => {
        await api.apiArticlesArticleSetPublicPut({
            articleId: id,
            public: isPublic
        });
        await queryClient.invalidateQueries([article, id]);
    }
}

export const useSetAutoPublish = (id: string) => {
    const queryClient = useQueryClient();
    return async (autoPublishOn: string) => {
        await api.apiArticlesArticleSetPublishDatePut({
            articleId: id,
            publishOn: autoPublishOn
        })
        await queryClient.invalidateQueries([article, id]);
    }
}

export const useArticles = (search: string) => {
    return useQuery([article + "s", search], () => {
        return api.apiArticlesArticleSearchArticlesGet(search);
    });
}

export const useArticleTags = (id: string) => {
    return useQuery([article, id, "tags"], () => {
        return api.apiArticlesArticleGetTagsGet(id);
    });
}

export const useAvailableTags = (query?: string) => {
    return useQuery([tags, query], () => {
        return tagsApi.apiTagsTagSearchGet(query);
    });
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
