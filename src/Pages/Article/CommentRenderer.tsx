import {FunctionComponent, PropsWithChildren, ReactNode, useRef, useState} from "react";
import {
    AccountsDataModelsDataModelsComment,
    AccountsDataModelsDataModelsReactionType
} from "@gkju/vlo-boards-client-axios-ts";
import {useProfilePicture} from "../../Components/Queries";
import {VLoader} from "@gkju/vlo-ui";
import {AiFillHeart, AiFillLike} from "react-icons/ai";
import kerfus from "./kerfus.webp";
import saul from "./saul.webp";
import {NeumorphTextArea, ReactionType} from "./Article";
import {motion} from "framer-motion";
import {useAddReactionToComment, useAddReply, useDeleteComment} from "./Queries";
import {Button} from "@mui/material";
import {isDevelopment} from "../../Config";
import authService from "../../Auth/AuthService";
import {useSelector, useStore} from "react-redux";
import {selectProfile} from "../../Redux/Slices/Auth";
import {modal, queueModal} from "../../Redux/Slices/Modal";
import Store from "../../Redux/Store/Store";

interface CommentProps {
    comment: AccountsDataModelsDataModelsComment;
    comments: AccountsDataModelsDataModelsComment[];
    articleId: string;
}

export const CommentRenderer: FunctionComponent<PropsWithChildren<CommentProps>> = ({comment, articleId, comments}) => {

    const pic = useProfilePicture(comment.author?.id ?? "");

    const addReaction = useAddReactionToComment(articleId, comment.id ?? "");

    const getReactionCount = (type: ReactionType) => {
        return comment.reactions?.filter(r => r.reactionType === type).length ?? 0;
    }

    const [commentText, setCommentText] = useState("");
    const [touched, setTouched] = useState(false);
    const [show, setShow] = useState(false);

    const addCommentHandler = () => {
        if (commentText.length > 0) {
            addComment(commentText);
            setCommentText("");
            setTouched(false);
            setShow(false);
        }
    }

    const dialogRef = useRef<HTMLDialogElement>(null);

    const profile = useSelector(selectProfile);

    const isAuthor = comment.author?.id === profile?.sub;

    const addReply = useAddReply(articleId, comment.id ?? "");

    const deleteCommentApiCall = useDeleteComment(articleId, comment.id ?? "");
    const deleteComment = () => {
        const html = document.querySelector('html');
        dialogRef.current?.showModal();
        html?.classList.add("locked");
    }

    const closeModal = () => {
        dialogRef.current?.close();
        shouldUnlockScroll();
    }

    const shouldUnlockScroll = () => {
        // won't work with html dialogs
        const modals = document.querySelectorAll('.vlomodal');
        const html = document.querySelector('html');

        if (html !== null) {
            html.classList.remove('locked');
        }
    };

    const addComment = (text: string) => {
        addReply(text);
    }

    if(pic.isLoading || !pic.data?.data) {
        return <VLoader/>;
    }

    if(!pic.data?.data.startsWith("http")) {
        pic.data.data = `https://avatars.dicebear.com/api/identicon/${comment.author?.id}.svg`;
    }

    if (isDevelopment && !pic.isLoading && pic.data?.data) {
        // @ts-ignore
        pic.data.data = pic.data.data.replace("https://", "http://");
    }

    return <>
        <div className="grid grid-rows-[20px_1fr_20px] mt-2 grid-cols-[50px_10fr] items-start justify-items-start">
            <img className="w-10 h-10 row-span-2 pt-2" src={pic.data?.data ?? ""} alt={comment.author?.userName ?? ""}/>
            <div className="row-start-1 row-end-2 col-start-2 font-bold">
                {comment.author?.userName}
            </div>
            {comment.content}
            <div className="text-[rgba(255,255,255,0.3)] text-xs flex justify-center items-center center-align">
                <span className="cursor-pointer" onClick={() => setShow(!show)}>
                    Odpowiedz
                </span>
                <ReactionWrapper title="Like" onClick={() => addReaction(ReactionType.Like)}>
                    <AiFillLike />
                    {getReactionCount(ReactionType.Like)}
                </ReactionWrapper>
                <ReactionWrapper title="Kerfuś" onClick={() => addReaction(ReactionType.Kerfus)}>
                    <img className="w-[0.5rem] h-[0.8rem] " src={kerfus} />
                    {getReactionCount(ReactionType.Kerfus)}
                </ReactionWrapper>
                <ReactionWrapper title="Saul" onClick={() => addReaction(ReactionType.Saul)}>
                    <img className="w-[0.5rem] h-[0.8rem]" src={saul} />
                    {getReactionCount(ReactionType.Saul)}
                </ReactionWrapper>
                <ReactionWrapper title="Love" onClick={() => addReaction(ReactionType.Love)}>
                    <AiFillHeart />
                    {getReactionCount(ReactionType.Love)}
                </ReactionWrapper>
                {isAuthor && <>
                    <span className="pl-2 cursor-pointer" onClick={() => deleteComment()}>
                    Usuń
                    </span>
                    <dialog ref={dialogRef} className="bg-transparent">
                        <div className="
                            rounded-2xl p-10 font-[Lato] font-bold
                            bg-[#0b0b0e]
                            text-white
                            text-xl
                            grid
                        ">
                            Czy na pewno chcesz usunąć komentarz?
                            <div className="pt-5 w-full">
                                <Button onClick={() => {closeModal();}}>Nie</Button>
                                <Button onClick={() => {closeModal(); deleteCommentApiCall();}} className="float-right">Tak</Button>
                            </div>
                        </div>
                    </dialog>
                </>}
            </div>
        </div>
        {show && <>
            <NeumorphTextArea className="mt-5" value={commentText} onChange={e => {setCommentText(e.target.value); setTouched(true); e.target.style.setProperty("--lines", String(e.target.value.split(/\r\n|\r|\n/).length))}} placeholder="Dodaj odpowiedź" hasValue={commentText.length > 0} />
            {touched && <div className="mt-5 mx-5">
                <Button className="" variant="outlined" onClick={() => {setTouched(false); setCommentText(""); setShow(false);}}>Anuluj</Button>
                <Button className="float-right" variant="contained" onClick={addCommentHandler}>Dodaj</Button>
            </div>}
        </>}
        <div className="pl-5 border-l-2 border-[rgba(255,255,255,0.3)]">
            {comments.filter(c => c.inReplyTo?.id === comment.id).sort((a,b) => Number(new Date(a?.createdOn ?? "") > new Date(b?.createdOn ?? ""))*2-1).map(c => <>
                <CommentRenderer key={c.id} comment={c} articleId={articleId} comments={comments} />
            </>)}
        </div>
    </>
}

export const ReactionWrapper: FunctionComponent<PropsWithChildren<any>> = ({children, ...props}) => {
    return (
        <motion.div {...props} whileHover={{scale: 1.1, y: -2}} whileTap={{scale: 0.9, y: 0}} className="relative w-[2rem] flex items-center align-center justify-around cursor-pointer">
            {children}
        </motion.div>
    );
}
