import {useParams} from "react-router-dom";
import {useArticleDetails, useArticlePicture} from "../CreateArticle/Queries";
import {VLoader} from "@gkju/vlo-ui";
import styled from "styled-components";
import {isDevelopment} from "../../Config";
import Editor from "../../Components/Editor/Editor";

var formatter = new Intl.DateTimeFormat( 'pl', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
} );

const getScStyle = (input: number) => {
    let color: string = "";
    if(input < 100) {
        color = 'red';
    } else if(input < 1000) {
        color = 'orange';
    } else if(input < 10000) {
        color = 'yellow';
    } else if(input < 100000) {
        color = 'green';
    } else if(input < 1000000) {
        color = 'blue';
    }

    return {color};
}

export const Article = () => {
    const { id } = useParams<{ id: string }>();
    const res = useArticleDetails(id ?? '');
    const article = res?.data?.data ?? undefined;
    const picture = useArticlePicture(id ?? '');

    if(isDevelopment && !picture.isLoading && picture.data?.data) {
        // @ts-ignore
        picture.data.data = picture.data.data.replace("https://", "http://");
    }

    if(!article) {
        return <VLoader />
    }

    return (<>

        <Background src={picture.data?.data ?? ''}>
            <Title>{article.title}</Title>
        </Background>
        <div className="flex justify-items-center items-center justify-center">
            <div className="max-w-[800px]">
                <Intro className="px-10 py-5">
                    {article?.author?.userName}, {formatter.format(new Date(article.modifiedOn ?? ''))}
                    <span className="ml-auto right-0">
                        Social credit: <span style={getScStyle(article?.author?.socialCredit ?? 0)}>{article?.author?.socialCredit}</span>
                    </span>
                </Intro>

                <Editor
                    className="pt-0"
                    innerClassName="py-0 my-0"
                    extraConfig={{readOnly: true}}
                    initialEditorState={article.contentJson}
                />
            </div>
        </div>

    </>)
}

const Intro = styled.div`
  width: 100%;
  font-family: Raleway, serif;
  font-weight: 500;
  color: rgba(255,255,255,0.3);
  display: flex;
  justify-items: center;
  height: 30px;
  align-items: center;
`

const Background = styled.div<{src: string}>`
    width: 100%;
    height: 30vh;
    background: url(${props => props.src}) center;
    background-size: cover;
`

const Title = styled.div`
    font-family: Lato, serif;
    font-size: 60px;
    backdrop-filter: brightness(0.8) blur(5px);
    font-weight: 500;
    height: 30vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    top: 0;
    z-index: 2;
`
