import {FunctionComponent, PropsWithChildren} from "react";

export const Card: FunctionComponent<PropsWithChildren<any>> = (props) => {
    return <div className="
            grid items-center justify-items-center border-gray-500 border-2 rounded-xl
            grid-columns-2 grid-rows-[7fr_2fr] p-2
            h-40 max-w-40"
            {...props}
           >
        {props.children}
    </div>
}
