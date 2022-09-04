import {IdTokenClaims} from "oidc-client-ts";
import React, {DragEventHandler, Fragment, FunctionComponent, MouseEventHandler, useRef, useState} from "react";
import styled from "styled-components";
import {motion} from "framer-motion";
import MuiIcon from '@mui/icons-material/Edit';
import DeleteMuiIcon from '@mui/icons-material/Delete';
import {Modal} from "@gkju/vlo-ui";
import {useCancellables} from "@gkju/vlo-ui/dist/Utils/UseCancelTimeouts";
import {useArticlePicture, useSetPicture} from "./Queries";
import {GetPrimary} from "../../ThemeProvider";
import {isDevelopment} from "../../Config";

interface props {
    articleId: string
}

export const EditablePicture: FunctionComponent<props> = (props) => {
    const [hover, setHover] = useState(false);
    const [open, setOpen] = useState(false);
    const [editRotation, setEditRotation] = useState<number>(0.0);
    const [editColor, setEditColor] = useState("rgb(255,255,255)");
    const handleStates = useCancellables();
    const picture = useArticlePicture(props.articleId);

    const prevDP = (e: Event | React.DragEvent) => {
        e.preventDefault();
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        let files = e.dataTransfer.files;
        for(let file of files) {
            if(file.type.startsWith("image")) {
                return upload(file);
            }
        }

        promptEditError();
    }

    const promptEditError = () => {
        const states: [Function, number][] = [
            [() => setHover(true), 0],
            [() => setEditColor("rgb(255,70,64)"), 50],
            [() => setEditRotation(50), 100],
            [() => setEditRotation(-80), 200],
            [() => setEditRotation(40), 300],
            [() => setEditRotation(0), 400],
            [() => setEditColor("rgb(255,255,255)"), 600],
            [() => setHover(false), 600],
        ];

        handleStates(states);
    };

    const setPicture = useSetPicture();

    const upload = async (file: File) => {
        try {
            await setPicture(props.articleId, file);
        } catch {
            promptEditError();
        }
    };

    const handleClick : MouseEventHandler = async (e) => {
        console.log(213)
        let opts = {
            types: [
                {
                    description: 'Images',
                    accept: {
                        'image/*': ['.png', '.gif', '.jpeg', '.jpg']
                    }
                },
            ],
                excludeAcceptAllOption: true,
            multiple: false
        };
        // @ts-ignore
        if(window?.showOpenFilePicker) {
            // @ts-ignore
            let files: FileSystemFileHandle[] = await window.showOpenFilePicker(opts);
            for(let file of files) {
                upload(await file.getFile());
            }
        }
    };

    if(isDevelopment) {
        if(picture.data?.data ?? {} instanceof String) {
            // @ts-ignore
            picture.data.data = picture.data.data.replace("https", "http");
        }
    }

    return (
        <Wrapper onPointerUp={handleClick} onDragOver={e => {prevDP(e);}} onDrop={e => {prevDP(e); handleDrop(e)}}
                 onDragEnter={(e) => {setHover(true); prevDP(e);}} onDragLeave={(e) => {setHover(false); prevDP(e);}}>
            <HideOverflow onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
                <motion.div animate={{scale: hover ? 1.05 : 1}} transition={{duration: 0.35}}>
                    <EditIcon animate={{opacity: hover ? 1 : 0, rotate: editRotation, color: editColor}} transition={{duration: 0.35}}>
                        <MuiIcon style={{fontSize: "60px"}} />
                    </EditIcon>
                    <img src={!picture.error ? picture.data?.data ?? '' :  `https://avatars.dicebear.com/api/identicon/${props.articleId}.svg`} />
                </motion.div>
            </HideOverflow>
        </Wrapper>
    );
}

const Wrapper = styled(motion.div)`
    display: flex;
    position: relative;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    width: 200px;
    border-radius: 10px;
    user-select: none;
    z-index: 2;
`;

const EditIcon = styled(motion.div)`
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    width: 200px;
    height: 100%;
    border-radius: 10px;
    background-color: rgba(0,0,0,0.6);
    pointer-events: none;
    color: white;
    z-index: 1;
    opacity: 0;
`;

const HideOverflow = styled(motion.div)`
    overflow: hidden;
    width: 200px;
    border-radius: 10px;
`;

const Button = styled(motion.div)`
    position: absolute;
    bottom: 10px;
    right: 10px;
    z-index: 1;
    color: white;
    background: ${GetPrimary()};
    border-radius: 20%;
    padding: 5px;
    cursor: pointer;
`
