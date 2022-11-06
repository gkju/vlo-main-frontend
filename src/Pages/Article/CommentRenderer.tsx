import {FunctionComponent, PropsWithChildren} from "react";
import {AccountsDataModelsDataModelsComment} from "@gkju/vlo-boards-client-axios-ts";

interface CommentProps {
    comment: AccountsDataModelsDataModelsComment;
}

export const Comment: FunctionComponent<PropsWithChildren<CommentProps>> = ({comment}) => {

    return <>
        {comment.content}
    </>
}
