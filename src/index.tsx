import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Store from "./Redux/Store/Store";
import {Provider} from "react-redux";
import {LogoutRequest} from "./Auth/LogoutRequest";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {LogoutCallback} from "./Auth/LogoutCallback";
import {LoginCallback} from "./Auth/LoginCallback";
import OIDCLogon from "./OIDCLogon";
import {ModalHandler} from "./Redux/ReactIntegrations/ModalHandler";
import {MinimalistModalHandler} from "./Redux/ReactIntegrations/MinimalistModalHandler";
import {CaptchaConfig} from "./Config";
import {GoogleReCaptchaProvider} from "react-google-recaptcha-v3";
import {createTheme, ThemeProvider} from "@mui/material";
import {plPL} from "@mui/material/locale";
import {BrowserRouter, Routes, Route} from "react-router-dom";

const theme = createTheme(
    plPL
);

const queryClient = new QueryClient();

// @ts-ignore
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient} contextSharing={true}>
            <Provider store={Store}>
                <GoogleReCaptchaProvider reCaptchaKey={String(CaptchaConfig.CaptchaKey)}>
                    <ThemeProvider theme={theme}>
                        <BrowserRouter>
                            <Routes>
                                <Route path="/LogoutRequest" element={<LogoutRequest />} />
                                <Route path="/logout-callback" element={<LogoutCallback />} />
                                <Route path="/login-callback" element={<LoginCallback />} />
                            </Routes>
                            {window === window.parent &&
                                <OIDCLogon/>
                            }
                        </BrowserRouter>
                        <ModalHandler />
                        <MinimalistModalHandler />
                    </ThemeProvider>
                </GoogleReCaptchaProvider>
            </Provider>
        </QueryClientProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();