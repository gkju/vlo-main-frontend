import {FunctionComponent} from "react";
import {VLoader} from "@gkju/vlo-ui";
import styled from "styled-components";
import {useSelector} from "react-redux";
import {useProfilePicture} from "./Queries";
import {selectProfile} from "../Redux/Slices/Auth";
import {isDevelopment} from "../Config";

interface ProfilePictureProps {
    Id: string,
    className?: string
}

export const ProfilePicture: FunctionComponent<ProfilePictureProps> = (props) => {
    const { data, error, isLoading } = useProfilePicture(props.Id);
    const profile = useSelector(selectProfile);

    if(isLoading) {
        return <VLoader />
    }

    if(error) {
        return <div>Error</div>
    }

    if(!data?.data) {
        return <div></div>;
    }

    // TODO: find a better solution, ???
    if(isDevelopment) {
        data.data = data.data.replace("https", "http");
    }

    return (
        <img className={props?.className} src={data.data.startsWith("http") ? data.data : `https://avatars.dicebear.com/api/identicon/${profile?.sub}.svg`} alt="Zdjęcie profilowe" style={{borderRadius: "50%", objectFit: "cover", objectPosition:  "center"}} />
    )
}
