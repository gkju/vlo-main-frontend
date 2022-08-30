import {FunctionComponent, useEffect} from "react";
import authService from "./AuthService";

export const LogoutRequest: FunctionComponent = () => {
    useEffect(() => {
        authService.signOut();
    });

    return <></>;
}
