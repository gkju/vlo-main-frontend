import {FunctionComponent} from "react";
import { VLoader } from "@gkju/vlo-ui";
import styled from "styled-components";

export const Loader: FunctionComponent = (props) => {
    return (
        <Background>
            <VLoader/>
        </Background>
    );
};

const Background = styled.div`
    background-color: #1D1D28;
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
`;
