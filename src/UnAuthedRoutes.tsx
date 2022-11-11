import React, {Fragment, FunctionComponent, ReactPropTypes, useEffect, useState} from "react";
import {Routes, Route, Navigate, useLocation, useNavigate} from "react-router-dom";
import {useMount, useWindowSize} from "react-use";
import {AnimatePresence, motion} from "framer-motion";
import {Menu} from "./Components/Menu";
import {CreateArticle} from "./Pages/CreateArticle/CreateArticle";
import {InitCreateArticle} from "./Pages/CreateArticle/InitCreateArticle";
import {Article} from "./Pages/Article/Article";
import {News} from "./Pages/News/News";
import Editor from "./Components/Editor/Editor";
import {About} from "./Pages/About/About";
import {Me} from "./Pages/Me/Me";
import {Contact} from "./Pages/Contact/Contact";
import {LogoutRequest} from "./Auth/LogoutRequest";
import {Home} from "./Pages/Home/Home";
import {Background, HideMenuRoutes} from "./AuthedRoutes";
import authService from "./Auth/AuthService";

type RoutesProps = {

}

export const UnAuthedRoutes: FunctionComponent<RoutesProps> = (props) => {
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
                        <Route path="/Login" element={<Login />} />
                        <Route path="*" element={<Home />} />
                    </Routes>
                </AnimatePresence>
            </Background>
        </>
    );
};

const Login: FunctionComponent = () => {
    const navigate = useNavigate();
    useMount(() => {
        (async () => {
            await authService.resetUser();
            authService.signInSilent()
                .then(() => navigate("/"))
                .catch(() => authService.signInRedirect())
                .then(() => navigate("/"))
        })();
    });
    return <></>;
}
