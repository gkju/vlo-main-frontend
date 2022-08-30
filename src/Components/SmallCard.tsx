import {FunctionComponent, PropsWithChildren} from "react";
import styled from "styled-components";

export interface Props {
    style?: any;
    className?: string;
}

export const SmallCard: FunctionComponent<PropsWithChildren<Props>> = (props) => {
    return <>
        <StyledDiv style={props.style} className={`w-full sm:h-full ${props?.className}`}>
            {props?.children}
        </StyledDiv>
    </>
}

const StyledDiv = styled.div`
  background: #1D1D28;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  border-radius: 35px;
  cursor: pointer;
  width: 100%;
`;
