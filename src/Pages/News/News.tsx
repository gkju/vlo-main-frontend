import {SmallCard} from "../../Components/SmallCard";
import styled from "styled-components";
import {motion} from "framer-motion";
import {SmallCardProps, SmallCardWrapper} from "../../Components/SmallCardWrapper";
import {MediumCardHorizontal} from "../../Components/MediumCardHorizontal";
import {MediumCardVertical} from "../../Components/MediumCardVertical";
import {useNavigate} from "react-router-dom";

const Items: SmallCardProps[] = [
    {
        title: "Ddd aaa",
        tag: "Tag",
        author: "Author",
        time: "2137",
        Id: "haha",
        imgSrc: "https://images.unsplash.com/photo-1661861108638-9810d775ec5d?ixlib=rb-1.2.1&dl=luca-herren-PC96pO-yZv0-unsplash.jpg&q=80&fm=jpg&crop=entropy&cs=tinysrgb"
    },
    {
        title: "Ddd aaa",
        tag: "Tag",
        author: "Author",
        time: "2137",
        Id: "nide",
        imgSrc: "https://images.unsplash.com/photo-1661796428215-04fc2830aae6?ixlib=rb-1.2.1&dl=evan-wise-jZkFVycn3FQ-unsplash.jpg&q=80&fm=jpg&crop=entropy&cs=tinysrgb"
    },
    {
        title: "Ddd aaa",
        tag: "Tag",
        author: "Author",
        time: "2137",
        Id: "nie",
        imgSrc: "https://images.unsplash.com/photo-1661854735281-f597d47132ed?ixlib=rb-1.2.1&dl=mariola-grobelska-n3JPNo11Aac-unsplash.jpg&q=80&fm=jpg&crop=entropy&cs=tinysrgb"
    }
];

export const News = () => {
    const navigate = useNavigate();
    const GetArticle = (index: number) => {
        index %= Items.length;
        return {
            ...Items[index],
            onPointerUp: () => navigate(Items[index].Id)
        }
    };

    return <motion.div className="relative" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
        <Toolbar className="absolute z-10 w-full">
            <div className="px-20 pt-10 grid grid-cols-5">
                <div className="">
                    Szukaj
                </div>
                <div className="">
                    Autor
                </div>
                <div className="">
                    Data
                </div>
                <div className="">
                    Temat
                </div>
                <motion.button onPointerUp={() => navigate("/CreateArticle")} initial={{scale: 1}} whileHover={{scale: 1.1}} className="text-white bg-[#6D5DD3] rounded-xl p-2 -mt-2 w-full">
                    Utwórz
                </motion.button>
            </div>
        </Toolbar>
        <div className="p-10 xl:pr-5 py-20 relative h-[100vh] grid grid-cols-2 xl:grid-cols-[5fr_5fr_7fr] grid-rows-2 justify-items-center items-center">
            <SmallCardWrapper
                {...GetArticle(0)}
                className="col-span-2 sm:col-span-1 md:hidden lg:block"
            />
            <SmallCardWrapper {...GetArticle(1)} className="hidden sm:block md:hidden lg:block"/>
            <motion.div whileHover={{scale: 1.05}} className="hidden md:block lg:hidden px-5 py-5 w-full h-full row-start-1 col-start-1 col-end-3 col-span-2">
                <MediumCardHorizontal {...GetArticle(2)}/>
            </motion.div>
            <motion.div whileHover={{scale: 1.05}} className="px-5 py-5 w-full h-full row-start-2 col-start-1 col-end-3 col-span-2">
                <MediumCardHorizontal {...GetArticle(3)}/>
            </motion.div>
            <MediumCardVertical whileHover={{scale: 1.05}}
                className="hidden w-full p-5 xl:block row-start-1 row-end-3 col-start-3 col-end-3 h-full"
                {...GetArticle(4)}
            />
        </div>
    </motion.div>
}

const Toolbar = styled.div`
  color: rgba(255,255,255,0.3);
`;
