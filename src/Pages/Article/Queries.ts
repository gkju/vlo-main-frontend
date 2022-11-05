import {useQueryClient} from "@tanstack/react-query";
import {AccountsDataModelsDataModelsReactionType, ArticleApi} from "@gkju/vlo-boards-client-axios-ts";
import {OpenApiSettings, UNSAFE_TOKEN_instance} from "../../OpenApiConfig";
import {article} from "../Constants";

export const api = new ArticleApi(OpenApiSettings, "", UNSAFE_TOKEN_instance);

export const useAddReaction = (id: string) => {
    const queryClient = useQueryClient();
    return async (reaction: AccountsDataModelsDataModelsReactionType) => {
        await api.apiArticlesArticleAddReactionPost(reaction, id);
        await queryClient.invalidateQueries([article, id]);
    }
}

export const useAddComment = (id: string) => {
    const queryClient = useQueryClient();
    return async (comment: string) => {
        await api.apiArticlesArticleAddCommentPost(comment, id);
        await queryClient.invalidateQueries([article, id]);
    }
}
