import { motion } from "framer-motion"
import Editor from "../../Components/Editor/Editor";
import styled from "styled-components";
import {Autocomplete, Button, MenuItem, Select, TextField} from "@mui/material";
import {useEffect, useState} from "react";
import {RippleAble, VLoader} from "@gkju/vlo-ui";
import {BiUpArrowAlt} from "react-icons/bi";
import {ArticleApi} from "@gkju/vlo-boards-client-axios-ts";
import {OpenApiSettings} from "../../OpenApiConfig";
import {useParams} from "react-router-dom";
import {isValidJson, useArticleDetails, useArticlePicture, useSetContent, useSetTitle} from "./Queries";
import {EditablePicture} from "./EditablePicture";
import {EditorState, LexicalEditor} from "lexical";
import {ErrorBoundary} from "react-error-boundary";
import {ErrorBoundaryFallback} from "../../Components/ErrorBoundaryFallback";
import authService from "../../Auth/AuthService";

export const CreateArticle = () => {
    const [isOpen, setOpen] = useState(false);
    let { id } = useParams<{ id: string }>();
    id ??= ' ';
    const putSetTitle = useSetTitle(id);
    const putSetContent = useSetContent(id);

    const [tagsValues, setTagsValues] = useState<string[]>([]);
    const tagsChangeHandler = (event: React.ChangeEvent<{}>, values: string[]) => {
        setTagsValues(values);
    }

    const availableTags: string[] = [];

    const {data, error, isLoading} = useArticleDetails(id);

    const article = data?.data;

    useEffect(() => {
        if (article) {
            setTitle(article.title ?? '');
        }
    }, [isLoading]);

    const [title, setTitle] = useState(article?.title ?? '');
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        putSetTitle(e.target.value)
        setTitle(e.target.value);
    }

    const handleChange = async (editorState: EditorState, editor: LexicalEditor) => {
        const json = JSON.stringify(editorState.toJSON());
        putSetContent(json);
    }

    if(isLoading) {
        return <VLoader />
    }

    return <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>

        <div className="max-h-[200vh]">
            <input type="text" placeholder="Tytuł" value={title} onChange={handleTitleChange} className="p-5 sticky top-0 outline-none text-[150%] bg-[rgb(23,23,32)] w-full z-20" />
           <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
               <Editor
                   onChange={handleChange}
                   initialEditorState={article?.contentJson}
               />
           </ErrorBoundary>

            <div className="bottom-0 text-left fixed pointer-events-none">
                <motion.div animate={{rotateX: isOpen ? 180 : 0, rotateY: isOpen ? 180 : 0, y: isOpen ? 0 : 300, transition: {duration: 0.3}}} onPointerUp={() => setOpen(!isOpen)} className="p-6 origin-center pointer-events-auto text-center inline-block">
                    <div className="flex text-5xl justify-items-center items-center">
                        <RippleAble className="rounded-full cursor-pointer flex justify-items-center align-middle">
                            <BiUpArrowAlt className="bg-[#6C5DD3] rounded-full" />
                        </RippleAble>
                    </div>
                </motion.div>
                <motion.div animate={{y: isOpen ? 0 : 300, transition: {duration: 0.3}}} className="pointer-events-auto grid h-[400px] rounded-t-2xl items-center grid-rows-[100px_1fr_1fr_1fr] w-[100vw] grid-cols-5 bg-[rgb(23,23,32)]">
                    <div className="w-full text-[rgba(255,255,255,0.3)] p-10 whitespace-nowrap">
                        Zapisano o {new Date(article?.modifiedOn ?? "").toLocaleTimeString("pl-PL")}
                    </div>
                    <SmallCard className="row-start-2 row-end-4 col-span-2 text-center grid justify-center">
                        <div className="bg-[#1D1D28] p-2 rounded-xl">
                            <EditablePicture articleId={id} />
                            <div className="p-2 text-2xl">
                                Miniatura
                            </div>
                        </div>
                    </SmallCard>
                    <div className="row-start-4 col-span-2 p-10 w-full">
                        <Autocomplete
                            multiple
                            limitTags={2}
                            options={availableTags}
                            value={tagsValues}
                            onChange={tagsChangeHandler}
                            groupBy={(option) => option[0]}
                            className="w-full"
                            autoComplete
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="standard"
                                    label="Tagi"
                                    placeholder="Tag"
                                />
                            )}
                        />
                    </div>
                </motion.div>
            </div>
        </div>
    </motion.div>
}

const SmallCard = styled.div`
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
`;
