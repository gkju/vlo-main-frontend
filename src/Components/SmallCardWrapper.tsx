import {motion} from "framer-motion";
import {SmallCard} from "./SmallCard";
import styled from "styled-components";
import {FunctionComponent, HTMLAttributes} from "react";
import {AccountsDataModelsDataModelsArticle} from "@gkju/vlo-boards-client-axios-ts";
import {useArticlePicture} from "../Pages/CreateArticle/Queries";
import {isDevelopment} from "../Config";
import {useNavigate} from "react-router-dom";

export interface SmallCardProps {
    article?: AccountsDataModelsDataModelsArticle
}

export const SmallCardWrapper: FunctionComponent<SmallCardProps & {className: string} & HTMLAttributes<HTMLDivElement>> = (props) => {
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

    return <div {...props} onPointerUp={() => navigate(article?.articleId ?? '')} className={`p-5 xl:pb-10 w-full h-full ${props.className}`}>
        <SmallCard className="grid grid-rows-[1fr_50px] h-full md:grid-rows-[10fr_2fr]">
            <motion.div className="p-3 h-full" animate={{scale: 1}} whileHover={{scale: 0.95}}>
                <Tag animate={{scale: 1}} whileHover={{scale: 0.95}}>{article?.tags ? article?.tags[0]?.content ?? '' : ''}</Tag>
                <SmallCardImg src={picture.data?.data ?? ''} />
            </motion.div>
            <SmallCardTitle>{article.title}</SmallCardTitle>
            <SmallCardFooter>
                {article.author?.userName}
                <SmallCardTime className="text-right">
                    {new Date(article.modifiedOn ?? '').toLocaleDateString()}
                </SmallCardTime>

            </SmallCardFooter>
        </SmallCard>
    </div>
}


export const SmallCardTime = styled.span`
    margin-left: auto;
    margin-right: 0;
`;

export const SmallCardFooter = styled.div`
    padding: 0 35px 20px;
    color: rgba(255, 255, 255, 0.3);
    font-size: 14px;
    display: flex;
    font-weight: 300;
`

export const SmallCardTitle = styled.div`
    font-family: Lato, sans-serif;
    padding: 0 35px 0 35px;
    margin-top: 5px;
    font-size: 30px;
    align-self: end;
    text-align: left;
`;

export const Tag = styled(motion.div)`
    background: #6D5DD3;
    position: absolute;
    padding: 5px 15px;
    left: auto;
    right: 25px;
    top: 25px;
    border-radius: 20px;
    font-family: Raleway, serif;
    font-weight: 500;
    z-index: 2;
    text-align: left;
    max-width: 200px;
`

export const SmallCardImg = styled.div<{src: string}>`
    border-radius: 35px;
    width: 100%;
    height: 100%;
    background: url(${props => props.src}) center;
    background-size: cover;
`;
