import { useParams } from "react-router-dom";
import { useArticleDetails, useArticlePicture } from "../CreateArticle/Queries";
import {RippleAble, VLoader} from "@gkju/vlo-ui";
import styled from "styled-components";
import { isDevelopment } from "../../Config";
import Editor from "../../Components/Editor/Editor";
import authService from "../../Auth/AuthService";
import {useAddComment, useAddReaction} from "./Queries";
import {AiFillDislike, AiFillHeart, AiFillLike} from "react-icons/ai";
import {FunctionComponent, PropsWithChildren, useState} from "react";
import { motion } from "framer-motion";
import saul from "./saul.webp";
import kerfus from "./kerfus.webp";
import {AccountsDataModelsDataModelsArticle} from "@gkju/vlo-boards-client-axios-ts";
import {Button} from "@mui/material";

var formatter = new Intl.DateTimeFormat("pl", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

enum ReactionType
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
      <div className="flex justify-items-center items-center justify-center">
        <div className="max-w-[800px] w-full grid grid-cols-[1fr_10fr_1fr]">
          <div className="col-start-2 row-start-1 py-2 px-2">
            <Intro className="">
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
          <div className="w-full col-start-1 row-start-1 pt-7">
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
          <Comments className="w-full pt-10 col-span-full">
            <div className="px-10 grid mx-auto w-full max-w-[700px] relative">
              <NeumorphTextArea className="" value={commentText} onChange={e => {setCommentText(e.target.value); setTouched(true); e.target.style.setProperty("--lines", String(e.target.value.split(/\r\n|\r|\n/).length))}} placeholder="Dodaj komentarz" hasValue={commentText.length > 0} />
              {touched && <div className="mt-5 mx-5">
                <Button className="" variant="outlined" onClick={() => {setTouched(false); setCommentText("");}}>Anuluj</Button>
                <Button className="float-right" variant="contained" onClick={addCommentHandler}>Dodaj</Button>
              </div>}
            </div>
          </Comments>
        </div>
      </div>
    </>
  );
};

const Comments = styled.div`

`

const getReactionCount = (article: AccountsDataModelsDataModelsArticle, reactionType: ReactionType) => {
    return Array.from(article.reactions ?? [])?.filter(x => x.reactionType === reactionType).length;
}

const ReactionCountWrapper: FunctionComponent<PropsWithChildren<any>> = ({children, ...props}) => {
  return (
      <div className="w-full h-5 flex justify-center mx-auto center-align items-center rounded-full text-sm">
        {children}
      </div>
  );
}

const NeumorphTextArea = styled.textarea<{hasValue: Boolean, error?: Boolean}>`
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

const ReactionWrapper: FunctionComponent<PropsWithChildren<any>> = ({children, ...props}) => {
    return (
        <motion.div {...props} whileHover={{scale: 1.2, rotateZ: 10}} whileTap={{scale: 0.9, rotateZ: -10}} className="relative py-2 grid grid-rows-2 justify-center center-align items-center">
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
  font-family: Lato, serif;
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
