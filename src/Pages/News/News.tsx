import {SmallCard} from "../../Components/SmallCard";
import styled from "styled-components";
import {AnimatePresence, motion} from "framer-motion";
import {SmallCardProps, SmallCardWrapper} from "../../Components/SmallCardWrapper";
import {MediumCardHorizontal} from "../../Components/MediumCardHorizontal";
import {MediumCardVertical} from "../../Components/MediumCardVertical";
import {useNavigate} from "react-router-dom";
import {accountsApi, useArticles} from "../CreateArticle/Queries";
import {useEffect, useState} from "react";
import {AccountsDataModelsDataModelsArticle} from "@gkju/vlo-boards-client-axios-ts";
import _ from "lodash";
import {VLoader} from "@gkju/vlo-ui";

export const News = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [debouncedSearch, _setDebouncedSearch] = useState("");
    const setDebouncedSearch = _.debounce((str: string) => {
        _setDebouncedSearch(str);
    }, 300);
    const articles = useArticles(debouncedSearch);
    // @ts-ignore
    const GetArticle = (index: number): AccountsDataModelsDataModelsArticle | undefined => {
        // @ts-ignore
        if(articles?.data?.data && articles?.data?.data?.length) {
            // @ts-ignore
            const article: AccountsDataModelsDataModelsArticle = articles.data.data[index % articles.data.data.length];
            return article;
        }
    };

    return <motion.div className="relative" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
        <Toolbar className="absolute z-10 w-full">
            <div className="px-20 pt-10 grid grid-cols-5">
                <input type="text" value={search} onChange={e => {setSearch(e.target.value); setDebouncedSearch(e.target.value)}} placeholder="Szukaj..." className="bg-transparent outline-none" />
                <motion.button onPointerUp={() => navigate("/CreateArticle")} initial={{scale: 1}} whileHover={{scale: 1.1}} className="text-white bg-[#6D5DD3] col-start-5 col-span-2 rounded-xl p-2 -mt-2 w-full">
                    Utwórz
                </motion.button>
            </div>
        </Toolbar>
        <AnimatePresence mode="wait">
            {!articles.isRefetching && !articles.isLoading &&
                <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}
                    className="p-10 xl:pr-5 py-20 relative h-[100vh] grid grid-cols-2 xl:grid-cols-[5fr_5fr_7fr] grid-rows-2 justify-items-center items-center">
                    <SmallCardWrapper
                        article={GetArticle(1)}
                        className="col-span-2 md:hidden lg:col-span-1 lg:block"
                    />
                    <SmallCardWrapper article={GetArticle(2)} className="hidden lg:block"/>
                    <motion.div whileHover={{scale: 1.05}}
                                className="hidden md:block lg:hidden px-5 py-5 w-full h-full row-start-1 col-start-1 col-end-3 col-span-2">
                        <MediumCardHorizontal article={GetArticle(1)}/>
                    </motion.div>
                    <motion.div whileHover={{scale: 1.05}}
                                className="px-5 py-5 w-full h-full row-start-2 col-start-1 col-end-3 col-span-2">
                        <MediumCardHorizontal article={GetArticle(0)}/>
                    </motion.div>
                    <MediumCardVertical whileHover={{scale: 1.05}}
                                        className="hidden w-full p-5 xl:block row-start-1 row-end-3 col-start-3 col-end-3 h-full"
                                        article={GetArticle(3)}
                    />
                </motion.div>
            }
        </AnimatePresence>
    </motion.div>
}

const Toolbar = styled.div`
  color: rgba(255,255,255,0.3);
`;
