import React, {Fragment, FunctionComponent, ReactPropTypes} from "react";
import {Routes, Route, Navigate, useLocation} from "react-router-dom";
import {Menu} from "./Components/Menu";
import styled from "styled-components";
import {Home} from "./Pages/Home/Home";
import {useWindowSize} from "react-use";
import {About} from "./Pages/About/About";
import { AnimatePresence } from "framer-motion";
import Editor from "./Components/Editor/Editor";
import {News} from "./Pages/News/News";

export const AuthedRoutes: FunctionComponent = (props) => {
    const {width} = useWindowSize();
    const horizontal = width < 800;
    const location = useLocation();

    return (
        <>
            <Menu />
            <Background style={{marginLeft: horizontal ? '' : '200px'}}>
                <AnimatePresence mode="wait">
                    <Routes location={location} key={location.pathname}>
                        <Route path="/news" element={<News />} />
                        <Route path="/edit" element={<Editor />} />
                        <Route path="/about" element={<About />} />
                        <Route path="*" element={<Home />} />
                    </Routes>
                </AnimatePresence>
            </Background>
        </>
    )
}

const Background = styled.div`
  background: rgba(33, 33, 43, 1);
  min-height: 100vh;
  height: 100%;
`;
