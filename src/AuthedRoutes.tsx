import React, {
  Fragment,
  FunctionComponent,
  ReactPropTypes,
  useEffect,
  useState,
} from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Menu } from "./Components/Menu";
import styled from "styled-components";
import { Home } from "./Pages/Home/Home";
import { useWindowSize } from "react-use";
import { About } from "./Pages/About/About";
import { AnimatePresence, motion } from "framer-motion";
import Editor from "./Components/Editor/Editor";
import { News } from "./Pages/News/News";
import { Article } from "./Pages/Article/Article";
import { CreateArticle } from "./Pages/CreateArticle/CreateArticle";
import { InitCreateArticle } from "./Pages/CreateArticle/InitCreateArticle";
import { Me } from "./Pages/Me/Me";
import {LogoutRequest} from "./Auth/LogoutRequest";
import {Contact} from "./Pages/Contact/Contact";

let HideMenuRoutes = ["/CreateArticle", "/articles/"];

export const AuthedRoutes: FunctionComponent = (props) => {
  const { width } = useWindowSize();
  const horizontal = width < 800;
  const location = useLocation();
  const [isMenuOpen, setMenuOpen] = useState(true);
  useEffect(() => {
    let shouldBeOpen = true;
    HideMenuRoutes.forEach((route) => {
      if (location.pathname.startsWith(route)) {
        shouldBeOpen = false;
      }
    });
    setMenuOpen(shouldBeOpen);
  }, [location]);

  return (
    <>
      <motion.span
        className={`${isMenuOpen ? "" : "pointer-events-none"}`}
        animate={{ opacity: isMenuOpen ? 1 : 0 }}
      >
        <Menu />
      </motion.span>
      <Background
        animate={{ paddingLeft: !horizontal && isMenuOpen ? "200px" : "" }}
      >
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/CreateArticle/:id" element={<CreateArticle />} />
            <Route path="/CreateArticle" element={<InitCreateArticle />} />
            <Route path="/news/:id" element={<Article />} />
            <Route path="/news" element={<News />} />
            <Route path="/articles/:id" element={<Article />} />
            <Route path="/articles" element={<News />} />
            <Route path="/edit" element={<Editor />} />
            <Route path="/about" element={<About />} />
            <Route path="/me" element={<Me />} />
            <Route path="/me/:id" element={<Me />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/logout" element={<LogoutRequest />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </AnimatePresence>
      </Background>
    </>
  );
};

const Background = styled(motion.div)`
  background: rgba(33, 33, 43, 1);
  min-height: 100vh;
  height: 100%;
  position: relative;
`;
