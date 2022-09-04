import {VLoader} from "@gkju/vlo-ui";
import {useMount} from "react-use";
import {createArticle} from "./Queries";
import {useNavigate} from "react-router-dom";

export const InitCreateArticle = () => {
    const navigate = useNavigate();

    useMount(async () => {
        const id = await createArticle();
        navigate(`/CreateArticle/${id}`);
    });

    return (
        <VLoader />
    )
}
