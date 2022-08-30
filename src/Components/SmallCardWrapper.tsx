import {motion} from "framer-motion";
import {SmallCard} from "./SmallCard";
import styled from "styled-components";
import {FunctionComponent} from "react";

export interface SmallCardProps {
    tag: string;
    title: string;
    author: string;
    time: string;
    imgSrc: string;
}

export const SmallCardWrapper: FunctionComponent<SmallCardProps> = (props) => {
    return <div className="p-5 xl:pb-10">
        <SmallCard>
            <motion.div animate={{scale: 1}} whileHover={{scale: 0.95}}>
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
    font-size: 30px;
`;

export const Tag = styled(motion.div)`
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
`

export const SmallCardImg = styled.img`
    border-radius: 35px;
    padding: 10px;
`;
