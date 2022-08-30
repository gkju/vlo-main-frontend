import styled from "styled-components";
import {FunctionComponent} from "react";
import {SmallCardProps} from "./SmallCardWrapper";
import {motion, MotionProps} from "framer-motion";
import {Title} from "./MediumCardHorizontal";

export const MediumCardVertical: FunctionComponent<SmallCardProps & {className?: string} & MotionProps> = (props) => {
    return <motion.div className="p-10" {...props}>
        <CardHorizontal imgSrc={props.imgSrc}>
            <Tag animate={{scale: 1}} whileHover={{scale: 0.95}}>{props.tag}</Tag>
            <Title>
                {props.title}
            </Title>
        </CardHorizontal>
    </motion.div>
}

const CardHorizontal = styled.div<{imgSrc: string}>`
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
