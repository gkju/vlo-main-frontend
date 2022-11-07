import {FunctionComponent} from "react";
import styled from "styled-components";
import Image from "./sztab.jpeg";
import {Intro, IntroText} from "../../Components/ImageTile";
import {Tile} from "../../Components/Tile";
import { motion } from "framer-motion";

export const About: FunctionComponent = () => {
    return <div className="grid justify-center text-white grid-cols-2 grid-rows-3 h-[max(100vh,900px)] w-full">
        <motion.div {...transition} className="p-10 text-[100px] col-span-full">
            <Intro src={Image} className="w-full size">
                <IntroText className="flex">
                    My
                </IntroText>
            </Intro>
        </motion.div>
        <motion.div {...transition} className="p-10 h-full w-full col-span-full row-start-2 row-end-4">
            <Tile className="grid text-center grid-rows-6 grid-cols-1">
                <p className="text-[50px] m-5">shalom</p>
                <p className="row-start-2 row-end-5">
                    dzien dobry
                </p>
            </Tile>
        </motion.div>
    </div>
}

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
