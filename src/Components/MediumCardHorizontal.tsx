import styled from "styled-components";
import {FunctionComponent} from "react";
import {SmallCardProps} from "./SmallCardWrapper";
import {motion} from "framer-motion";

export const MediumCardHorizontal: FunctionComponent<SmallCardProps & {className?: string}> = (props) => {
    return <>
        <CardHorizontal {...props}>
            <Tag animate={{scale: 1}} whileHover={{scale: 0.95}}>{props.tag}</Tag>
            <Title>
                {props.title}
            </Title>
        </CardHorizontal>
    </>
}

export const Title = styled.div`
  font-family: Lato, serif;
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

const CardHorizontal = styled.div<SmallCardProps>`
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
