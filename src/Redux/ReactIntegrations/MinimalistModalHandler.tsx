import {FunctionComponent, useState} from "react";
import {useSelector} from "react-redux";
import {deleteCurrentMinimalistModal, selectCurrentMinimalistModal} from "../Slices/MinimalModal";
import {Button, InputSize, MinimalModal, Modal} from "@gkju/vlo-ui";
import Store from "../Store/Store";
import styled from "styled-components";
import {GetBackground} from "../../ThemeProvider";

export const MinimalistModalHandler : FunctionComponent = (props) => {
    const modalData = useSelector(selectCurrentMinimalistModal);
    const [error, setError] = useState('');

    const closeHandler = () => {
        Store.dispatch(deleteCurrentMinimalistModal());
    };

    const successHandler = async (value: string) => {
        await modalData.handler(value);
    };

    return (
        <MinimalModal password={modalData?.password ?? false} open={modalData !== undefined} initialValue={modalData?.initialValue ?? ''} close={closeHandler} handler={successHandler} validator={modalData?.validator ?? (s => "jd")} placeholder={modalData?.placeholder ?? ""} />
    );
};
