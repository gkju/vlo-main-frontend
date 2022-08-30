import {FunctionComponent} from "react";
import authService from "./AuthService";
import {useMount} from "react-use";
import {useSelector} from "react-redux";
import {selectLastKnownUrl} from "../Redux/Slices/Auth";

export const LogoutCallback: FunctionComponent = (props) => {

    useMount(async () => {
        try {
            const res = await authService.processSignOutUrl(window.location.href);
            if(res) {
                window.location.replace("/");
            }
        } catch (e) {
            window.location.replace("/");
        }
    })

    return (
        <div>processing logout</div>
    )
}
