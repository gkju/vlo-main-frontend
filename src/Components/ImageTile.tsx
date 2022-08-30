import styled from "styled-components";
import Image from "../Pages/About/sztab.jpeg";

interface Props {
    src: string;
}

export const Intro = styled.div<Props>`
  background: url(${p => p.src}) no-repeat center;
  background-size: cover;
  border-radius: 10px;
  width: 100%;
  height: 100%;
  font-family: Lato, sans-serif;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const IntroText = styled.div`
  width: 100%;
  height: 100%;
  font-family: Lato, sans-serif;
  text-align: center;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
`
