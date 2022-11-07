import {FunctionComponent, PropsWithChildren} from "react";
import {AiFillInstagram} from "react-icons/ai";
import Image from "../Home/vlo.jpeg";
import {Intro, IntroText} from "../../Components/ImageTile";

export const Contact: FunctionComponent = (props) => {
    return <div className="grid grid-rows-[3fr_5fr_2fr] h-[100vh] w-full p-10">

    </div>
}

const IconWrapper: FunctionComponent<PropsWithChildren> = ({children}) => {
    return <>
        <div className="cursor-pointer flex center-align items-center">
                {children}
        </div>
    </>
}

const TextWrapper: FunctionComponent<PropsWithChildren> = ({children}) => {
    return <>
        <div className="pl-2">
            {children}
        </div>
    </>
}
