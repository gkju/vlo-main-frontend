import styled from "styled-components";
import {FunctionComponent} from "react";
import {SmallCardProps} from "./SmallCardWrapper";
import {motion} from "framer-motion";
import {useArticlePicture} from "../Pages/CreateArticle/Queries";
import {isDevelopment} from "../Config";
import {useNavigate} from "react-router-dom";

export const MediumCardHorizontal: FunctionComponent<SmallCardProps & {className?: string}> = (props) => {
    const {article} = props;
    const picture = useArticlePicture(article?.articleId ?? '');
    const navigate = useNavigate();

    if(!article || picture.isLoading) {
        return <></>
    }

    // TODO: Better solution
    if(isDevelopment && picture.data?.data) {
        // @ts-ignore
        picture.data.data = picture.data.data.replace("https://", "http://");
    }

    return <>
        <CardHorizontal onPointerUp={() => navigate(article?.articleId ?? '')} {...props} imgSrc={picture.data?.data ?? ''}>
            <Tag animate={{scale: 1}} whileHover={{scale: 0.95}}>{article?.tags ? article?.tags[0]?.content ?? '' : ''}</Tag>
            <Title>
                {article.title}
            </Title>
        </CardHorizontal>
    </>
}

export const Title = styled.div`
  font-family: Lato, sans-serif;
  font-size: 60px;
  font-weight: 500;
  text-align: center;
  height: 100%;
  display: flex;
  align-items: center;
  justify-items: center;
  justify-content: center;
  padding: 30px;
`;

const CardHorizontal = styled.div<SmallCardProps & {imgSrc: string}>`
  border-radius: 35px;
  width: 100%;
  height: 100%;
  position: relative;
  background: url(${props => props.imgSrc}) center;
  background-size: cover;
  cursor: pointer;
`;

const Tag = styled(motion.div)`
    background: #6D5DD3;
    position: absolute;
    padding: 5px 15px;
    left: auto;
    right: 15px;
    top: 15px;
    border-radius: 20px;
    font-family: Raleway, serif;
    font-weight: 500;
    z-index: 2;
`;
