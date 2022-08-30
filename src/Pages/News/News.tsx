import {SmallCard} from "../../Components/SmallCard";
import styled from "styled-components";
import {motion} from "framer-motion";
import {SmallCardWrapper} from "../../Components/SmallCardWrapper";
import {MediumCardHorizontal} from "../../Components/MediumCardHorizontal";
import {MediumCardVertical} from "../../Components/MediumCardVertical";

export const News = () => {
    return <>
        <div className="p-10 xl:pr-5 py-20 relative h-[100vh] grid grid-cols-2 xl:grid-cols-[5fr_5fr_7fr] grid-rows-2 justify-items-center items-center">
            <SmallCardWrapper
                title="Ddd aaa"
                tag="Tag"
                author="Author"
                time="2137"
                imgSrc="https://images.unsplash.com/photo-1661861108638-9810d775ec5d?ixlib=rb-1.2.1&dl=luca-herren-PC96pO-yZv0-unsplash.jpg&q=80&fm=jpg&crop=entropy&cs=tinysrgb"
            />
            <SmallCardWrapper
                title="Ddd aaa"
                tag="Tag"
                author="Author"
                time="2137"
                imgSrc="https://images.unsplash.com/photo-1661861108638-9810d775ec5d?ixlib=rb-1.2.1&dl=luca-herren-PC96pO-yZv0-unsplash.jpg&q=80&fm=jpg&crop=entropy&cs=tinysrgb"
            />
            <motion.div whileHover={{scale: 1.05}} className="px-5 lg:py-5 w-full h-full row-start-2 col-start-1 col-end-3 col-span-2">
                <MediumCardHorizontal
                    tag="test"
                    title="Składanie komputera tutoriel"
                    author="nie"
                    time="21.37"
                    imgSrc="https://images.unsplash.com/photo-1661854735281-f597d47132ed?ixlib=rb-1.2.1&dl=mariola-grobelska-n3JPNo11Aac-unsplash.jpg&q=80&fm=jpg&crop=entropy&cs=tinysrgb" />
            </motion.div>
            <MediumCardVertical
                className="hidden w-full p-10 pb-5 xl:block row-start-1 row-end-3 col-start-3 col-end-3 h-full"
                tag="test"
                title="Oman tutoriel"
                author="nie"
                time="21.37"
                imgSrc="https://images.unsplash.com/photo-1661796428215-04fc2830aae6?ixlib=rb-1.2.1&dl=evan-wise-jZkFVycn3FQ-unsplash.jpg&q=80&fm=jpg&crop=entropy&cs=tinysrgb" />
        </div>
    </>
}
