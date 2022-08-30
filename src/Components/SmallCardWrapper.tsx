import {motion} from "framer-motion";
import {SmallCard} from "./SmallCard";
import styled from "styled-components";
import {FunctionComponent, HTMLAttributes} from "react";

export interface SmallCardProps {
    tag: string;
    title: string;
    author: string;
    time: string;
    imgSrc: string;
    Id: string;
}

export const SmallCardWrapper: FunctionComponent<SmallCardProps & {className: string} & HTMLAttributes<HTMLDivElement>> = (props) => {
    return <div {...props} className={`p-5 xl:pb-10 w-full h-full ${props.className}`}>
        <SmallCard className="grid grid-rows-[1fr_50px] h-full md:grid-rows-[10fr_2fr]">
            <motion.div className="p-3 h-full" animate={{scale: 1}} whileHover={{scale: 0.95}}>
                <Tag animate={{scale: 1}} whileHover={{scale: 0.95}}>{props.tag}</Tag>
                <SmallCardImg src={props.imgSrc} />
            </motion.div>
            <SmallCardTitle>{props.title}</SmallCardTitle>
            <SmallCardFooter>
                {props.author}
                <SmallCardTime className="text-right">
                    {props.time}
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
    font-family: Lato, serif;
    padding: 10px 0 0 35px;
    margin-top: 10px;
    font-size: 30px;
    align-self: end;
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
`

export const SmallCardImg = styled.div<{src: string}>`
    border-radius: 35px;
    width: 100%;
    height: 100%;
    background: url(${props => props.src}) center;
    background-size: cover;
`;
