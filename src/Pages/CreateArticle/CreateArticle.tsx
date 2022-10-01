import { motion } from "framer-motion";
import Editor from "../../Components/Editor/Editor";
import styled from "styled-components";
import {
  Autocomplete,
  Button,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { RippleAble, VLoader } from "@gkju/vlo-ui";
import { BiUpArrowAlt } from "react-icons/bi";
import {
  AccountsDataModelsDataModelsTag,
  ArticleApi,
} from "@gkju/vlo-boards-client-axios-ts";
import { OpenApiSettings } from "../../OpenApiConfig";
import { useParams } from "react-router-dom";
import {
  isValidJson,
  useArticleDetails,
  useArticlePicture,
  useArticleTags,
  useAvailableTags,
  useDeleteTag,
  useSetAutoPublish,
  useSetContent,
  useSetPublic,
  useSetTag,
  useSetTitle,
} from "./Queries";
import { EditablePicture } from "./EditablePicture";
import { EditorState, LexicalEditor } from "lexical";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorBoundaryFallback } from "../../Components/ErrorBoundaryFallback";
import authService from "../../Auth/AuthService";
import { DateTimePicker } from "@mui/x-date-pickers";
import { Moment } from "moment";
import { useUnmount } from "react-use";

function uniqBy<Type>(a: Type[], key: (inp: Type) => string) {
  return [...new Map(a.map((x: any) => [key(x), x])).values()];
}

export const CreateArticle = () => {
  const [isOpen, setOpen] = useState(false);
  let { id } = useParams<{ id: string }>();
  id ??= " ";
  const putSetTitle = useSetTitle(id);
  const putSetContent = useSetContent(id);
  const putSetContentNow = useSetContent(id);
  const putAddTag = useSetTag(id);
  const deleteTag = useDeleteTag(id);
  const setPublic = useSetPublic(id);
  const setAutoPublish = useSetAutoPublish(id);

  const [publicLoading, setPublicLoading] = useState(false);
  const [tagsInputValue, setTagsInputValue] = useState("");
  const [tagsValues, setTagsValues] = useState<
    AccountsDataModelsDataModelsTag[]
  >([]);
  const [autoPublishValue, setAutoPublishValue] = useState("");
  const tagsChangeHandler = (
    event: React.ChangeEvent<{}>,
    values: AccountsDataModelsDataModelsTag[]
  ) => {
    const newTagValues = uniqBy(values, (x) => x.id ?? "");
    const valuesToSend = newTagValues.filter((x) => !tagsValues.includes(x));
    const valuesToRemove = tagsValues.filter((x) => !newTagValues.includes(x));
    setTagsValues(newTagValues);
    for (const tag of valuesToSend) {
      putAddTag(tag.content ?? "");
    }
    for (const tag of valuesToRemove) {
      deleteTag(tag.content ?? "");
    }
  };

  const currentTags = useArticleTags(id);
  useEffect(() => {
    setTagsValues(currentTags.data?.data ?? []);
  }, [currentTags.isLoading]);
  const tags = useAvailableTags(tagsInputValue);
  const availableTags: AccountsDataModelsDataModelsTag[] =
    tags.data?.data ?? [];

  const { data, error, isLoading } = useArticleDetails(id);

  const article = data?.data;

  useEffect(() => {
    if (article) {
      setTitle(article.title ?? "");
      setAutoPublishValue(article?.autoPublishOn ?? "");
    }
  }, [isLoading]);

  const [title, setTitle] = useState(article?.title ?? "");
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    putSetTitle(e.target.value);
    setTitle(e.target.value);
  };

  const [contentJson, setContentJson] = useState("");
  const handleChange = async (
    editorState: EditorState,
    editor: LexicalEditor
  ) => {
    const json = JSON.stringify(editorState.toJSON());
    setContentJson(json);
    putSetContent(json);
  };
  useUnmount(() => {
    putSetContentNow(contentJson);
  });

  const handlePublicChange = async () => {
    setPublicLoading(true);
    await putSetContentNow(contentJson);
    await setPublic(!article?.public);
    setPublicLoading(false);
  };

  if (
    article?.autoPublish &&
    article?.autoPublishOn &&
    +new Date(article.autoPublishOn) > +new Date("0001-01-01T00:00:00") &&
    +new Date(article.autoPublishOn) < +Date.now()
  ) {
    article.public = true;
  }
  const handleAutoPublishChange = async (newValue: Moment | null) => {
    setAutoPublishValue(newValue?.toISOString() ?? "");
    await setAutoPublish(newValue?.toISOString() ?? "");
  };

  if (isLoading) {
    return <VLoader />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-h-[200vh]">
        <input
          type="text"
          placeholder="Tytuł"
          value={title}
          onChange={handleTitleChange}
          className="p-5 fixed top-0 outline-none text-[150%] bg-[rgb(23,23,32)] w-full z-20"
        />
        <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
          <div className="h-[76px]"></div>
          <div>
            <Editor
              className="pt-[3rem]"
              onChange={handleChange}
              initialEditorState={article?.contentJson}
            />
          </div>
        </ErrorBoundary>

        <div className="bottom-0 text-left fixed pointer-events-none">
          <motion.div
            animate={{
              rotateX: isOpen ? 180 : 0,
              rotateY: isOpen ? 180 : 0,
              y: isOpen ? 0 : 300,
              transition: { duration: 0.3 },
            }}
            onPointerUp={() => setOpen(!isOpen)}
            className="p-6 origin-center pointer-events-auto text-center inline-block"
          >
            <div className="flex text-5xl justify-items-center items-center">
              <RippleAble className="rounded-full cursor-pointer flex justify-items-center align-middle">
                <BiUpArrowAlt className="bg-[#6C5DD3] rounded-full" />
              </RippleAble>
            </div>
          </motion.div>
          <motion.div
            animate={{ y: isOpen ? 0 : 300, transition: { duration: 0.3 } }}
            className="pointer-events-auto grid h-[400px] rounded-t-2xl items-center grid-rows-[100px_1fr_1fr_1fr] w-[100vw] grid-cols-5 bg-[rgb(23,23,32)]"
          >
            <div className="w-full col-span-full text-[rgba(255,255,255,0.3)] p-10 whitespace-nowrap">
              Zapisano o{" "}
              {new Date(article?.modifiedOn ?? "").toLocaleTimeString("pl-PL")}
              <span className="float-right">
                {article?.public
                  ? "Publiczny"
                  : "Niepubliczny, autopublikacja jest " +
                    (article?.autoPublish ? "włączona" : "wyłączona")}
              </span>
            </div>
            <SmallCard className="row-start-2 row-end-4 col-span-2 text-center grid justify-items-center">
              <div className="bg-[#1D1D28] relative h-[200px] w-[80%] p-3 rounded-xl grid grid-rows-[5fr_2fr]">
                <EditablePicture articleId={id} />
                <div className="text-2xl h-full flex justify-center items-center">
                  Miniatura
                </div>
              </div>
            </SmallCard>
            <div className="row-start-2 w-full h-full relative row-end-4 col-span-3 text-center grid">
              <EditablePicture borderRadius="35px" articleId={id} />
              <div className="text-4xl font-sans absolute justify-self-center self-center z-10">
                Miniatura
              </div>
            </div>
            <div className="row-start-4 col-span-3 p-10 w-full">
              <Autocomplete
                multiple
                limitTags={2}
                options={availableTags}
                value={tagsValues}
                onChange={tagsChangeHandler}
                getOptionLabel={(o) => o.content ?? ""}
                groupBy={(option) => (option?.content ?? "")[0]}
                className="w-full"
                autoComplete
                onInputChange={(event, newInputValue) => {
                  setTagsInputValue(newInputValue);
                }}
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
            <div className="row-start-4 col-start-5 p-10 w-full">
              <Button onPointerUp={handlePublicChange} disabled={publicLoading}>
                {!article?.public ? "Opublikuj" : "Ukryj"}
              </Button>
            </div>
            <div className="row-start-4 col-start-4 text-center grid justify-center">
              <DateTimePicker
                label="Automatycznie opublikuj o"
                value={autoPublishValue}
                onChange={handleAutoPublishChange}
                renderInput={(params) => <TextField {...params} />}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const SmallCard = styled.div`
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
`;
