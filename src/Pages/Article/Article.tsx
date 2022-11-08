import { useParams } from "react-router-dom";
import { useArticleDetails, useArticlePicture } from "../CreateArticle/Queries";
import {RippleAble, VLoader} from "@gkju/vlo-ui";
import styled from "styled-components";
import { isDevelopment } from "../../Config";
import Editor from "../../Components/Editor/Editor";
import authService from "../../Auth/AuthService";
import {useAddComment, useAddReaction} from "./Queries";
import {AiFillDislike, AiFillHeart, AiFillLike} from "react-icons/ai";
import {FunctionComponent, PropsWithChildren, useEffect, useState} from "react";
import { motion } from "framer-motion";
import saul from "./saul.webp";
import kerfus from "./kerfus.webp";
import {AccountsDataModelsDataModelsArticle} from "@gkju/vlo-boards-client-axios-ts";
import {Button} from "@mui/material";
import {CommentRenderer} from "./CommentRenderer";

var formatter = new Intl.DateTimeFormat("pl", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export enum ReactionType
{
  Like,
  Dislike,
  Kerfus,
  Saul,
  Love,
}

const getScStyle = (input: number) => {
  let color: string = "";
  if (input < 100) {
    color = "red";
  } else if (input < 1000) {
    color = "orange";
  } else if (input < 10000) {
    color = "yellow";
  } else if (input < 100000) {
    color = "green";
  } else if (input < 1000000) {
    color = "blue";
  }

  return { color };
};

export const Article = () => {
  const { id } = useParams<{ id: string }>();
  const res = useArticleDetails(id ?? "");
  const addReaction = useAddReaction(id ?? "");
  const article = res?.data?.data ?? undefined;
  const picture = useArticlePicture(id ?? "");

  if (isDevelopment && !picture.isLoading && picture.data?.data) {
    // @ts-ignore
    picture.data.data = picture.data.data.replace("https://", "http://");
  }

  const [commentText, setCommentText] = useState("");
  const [touched, setTouched] = useState(false);
  const addComment = useAddComment(id ?? "");

  useEffect(() => {
    try {
      // @ts-ignore
      (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {

    }
  });

  const addCommentHandler = () => {
    if (commentText.length > 0) {
      addComment(commentText);
      setCommentText("");
      setTouched(false);
    }
  }

  if (!article) {
    return <VLoader />;
  }

  console.log("sometimes you just have to gułesz");

  return (
    <>
      <Background src={picture.data?.data ?? ""}>
        <Title>{article.title}</Title>
      </Background>
      <div className="flex flex-col justify-items-center items-center justify-center">
        <div className="max-w-[800px] w-full grid grid-cols-[1fr_10fr_1fr]">
          <div className="col-start-2 row-start-1 py-2 px-2">
            <Intro className="text-xs md:text-lg">
              {article?.author?.userName},{" "}
              {formatter.format(new Date(article.modifiedOn ?? ""))}
              <span className="ml-auto right-0">
                Social credit:{" "}
                <span style={getScStyle(article?.author?.socialCredit ?? 0)}>
                  {article?.author?.socialCredit}
                </span>
              </span>
            </Intro>
            <Editor
                className="pt-3 px-0 mx-0 col-start-2 row-start-1"
                innerClassName="py-0 px-0 my-0 mx-0"
                contentEditableClassName={"px-0"}
                extraConfig={{ readOnly: true }}
                initialEditorState={article.contentJson}
                forceHeight={false}
            />
          </div>
          <div className="w-full row-start-2 flex justify-center md:px-0 col-start-1 col-end-4 md:block md:col-start-1 md:col-end-2 md:row-start-1 pt-7">
            <ReactionWrapper title="Like" onClick={() => addReaction(ReactionType.Like)}>
              <AiFillLike />
              <ReactionCountWrapper>
                {getReactionCount(article, ReactionType.Like)}
              </ReactionCountWrapper>
            </ReactionWrapper>
            <ReactionWrapper title="Kerfuś" onClick={() => addReaction(ReactionType.Kerfus)}>
              <img className="w-[1.5rem] h-[1.9rem] " src={kerfus} />
              <ReactionCountWrapper>
                {getReactionCount(article, ReactionType.Kerfus)}
              </ReactionCountWrapper>
            </ReactionWrapper>
            <ReactionWrapper title="Saul" onClick={() => addReaction(ReactionType.Saul)}>
              <img className="w-[1.5rem] h-[1.9rem]" src={saul} />
              <ReactionCountWrapper>
                {getReactionCount(article, ReactionType.Saul)}
              </ReactionCountWrapper>
            </ReactionWrapper>
            <ReactionWrapper title="Love" onClick={() => addReaction(ReactionType.Love)}>
              <AiFillHeart />
              <ReactionCountWrapper>
                {getReactionCount(article, ReactionType.Love)}
              </ReactionCountWrapper>
            </ReactionWrapper>
          </div>
        </div>
        <ins className="adsbygoogle w-full h-60"
             style={{display: "block"}}
             data-ad-layout="in-article"
             data-ad-format="fluid"
             data-ad-client="ca-pub-3366108701161830"
             data-ad-slot="2999214848" />
        <Comments className="w-full col-span-full bg-[#1A1A23]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#21212B" fill-opacity="1" d="M0,160L48,181.3C96,203,192,245,288,245.3C384,245,480,203,576,154.7C672,107,768,53,864,74.7C960,96,1056,192,1152,229.3C1248,267,1344,245,1392,234.7L1440,224L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
          </svg>
          <div className="px-10 grid mx-auto pb-10 w-full max-w-[700px] relative">
            <NeumorphTextArea className="" value={commentText} onChange={e => {setCommentText(e.target.value); setTouched(true); e.target.style.setProperty("--lines", String(e.target.value.split(/\r\n|\r|\n/).length))}} placeholder="Dodaj komentarz" hasValue={commentText.length > 0} />
            {touched && <div className="mt-5 mx-5">
              <Button className="" variant="outlined" onClick={() => {setTouched(false); setCommentText("");}}>Anuluj</Button>
              <Button className="float-right" variant="contained" onClick={addCommentHandler}>Dodaj</Button>
            </div>}
          </div>
          <div className="px-10">
            {article.comments?.filter(c => c.inReplyTo == undefined)?.map((comment) => (
                <CommentRenderer articleId={article.articleId ?? ""} comments={article.comments ?? []} comment={comment} key={comment.id} />
            ))}
          </div>
          <div className="h-[100px]">

          </div>
        </Comments>
      </div>
    </>
  );
};

const Comments = styled.div`

`

const getReactionCount = (article: AccountsDataModelsDataModelsArticle, reactionType: ReactionType) => {
    return Array.from(article.reactions ?? [])?.filter(x => x.reactionType === reactionType).length;
}

export const ReactionCountWrapper: FunctionComponent<PropsWithChildren<any>> = ({children, ...props}) => {
  return (
      <div className="w-full h-5 flex justify-center mx-auto center-align items-center rounded-full text-sm">
        {children}
      </div>
  );
}

export const NeumorphTextArea = styled.textarea<{hasValue: Boolean, error?: Boolean}>`
  --lines: 1;
  font-family: Raleway, serif;
  font-style: normal;
  font-weight: bold;
  background: transparent;
  border: none;
  width: 100%;
  min-height: 70px;
  height: calc(var(--lines) * 20px + 50px);
  font-size: 20px;
  padding: 20px 20px 20px 20px;
  color: ${(props) => (props.hasValue ? 'rgba(180,180,180,0.6)' : 'rgba(161,161,161,0.4)')};
  transition: all 0.2s linear;
  text-align: center;
  border-radius: 30px;
  resize: none;
  box-shadow: ${(props) => (props?.error ? '0px 0px 5px 5px #f44336' : '')};
  &:focus {
    outline: none;
    color: white;
    box-shadow: ${(props) => !props?.error && '0px 0px 5px 5px #6D5DD3'};
  }
`;

export const ReactionWrapper: FunctionComponent<PropsWithChildren<any>> = ({children, ...props}) => {
    return (
        <motion.div {...props} whileHover={{scale: 1.2, y: -10}} whileTap={{scale: 0.9, y: 0}} className="relative px-5 md:px-0 py-2 grid grid-rows-2 justify-center center-align items-center cursor-pointer">
            {children}
        </motion.div>
    );
}

const Intro = styled.div`
  width: 100%;
  font-family: Raleway, serif;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.3);
  display: flex;
  justify-items: center;
  height: 30px;
  align-items: center;
`;

const Background = styled.div<{ src: string }>`
  width: 100%;
  height: 30vh;
  background: url(${(props) => props.src}) center;
  background-size: cover;
`;

const Title = styled.div`
  font-family: Lato, sans-serif;
  font-size: 60px;
  backdrop-filter: brightness(0.8) blur(3px);
  font-weight: 500;
  height: 30vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  top: 0;
  z-index: 2;
`;
