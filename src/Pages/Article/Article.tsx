import {useParams} from "react-router-dom";

export const Article = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <div>Article {id}</div>
    )
}
