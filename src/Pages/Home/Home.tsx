import {FunctionComponent} from "react";
import {motion} from "framer-motion";
import {Intro, IntroText} from "../../Components/ImageTile";
import Image from "./vlo.jpeg";
import {Tile} from "../../Components/Tile";

export const Home: FunctionComponent = () => {
    return <div className="grid justify-center text-white grid-cols-2 grid-rows-3 h-[max(100vh,900px)] w-full">
        <motion.div {...transition} className="p-10 text-[100px] col-span-full">
            <Intro src={Image} className="w-full size">
                <IntroText className="text-xl grid grid-rows-3 justify-items-center">
                    <div className="text-[40px] font-bold">
                        Aktualności
                    </div>
                    <div className="row-start-3 font-normal w-[80%] pb-10">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </div>
                </IntroText>
            </Intro>
        </motion.div>
        <motion.div {...transition} className="p-10 h-full w-full col-span-full row-start-2 row-end-4">
            <Tile className="grid text-center grid-rows-6 grid-cols-1">
                <p className="text-[50px] m-5">AAAA</p>
                <p className="row-start-2 row-end-5">
                    AAAAAAAA
                </p>
            </Tile>
        </motion.div>
    </div>
};

const transition = {
    exit: {
        opacity: 0
    },
    initial: {
        opacity: 0
    },
    animate: {
        opacity: 1
    }
}
