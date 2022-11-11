import {FunctionComponent, MouseEventHandler, PointerEventHandler, useCallback, useRef, useState} from "react";
import {AccountsDataModelsDataModelsFile, AccountsDataModelsDataModelsFolder} from "@gkju/vlo-boards-client-axios-ts";
import {MdFileCopy, MdFolder, MdVideocam} from "react-icons/md";
import {Card} from "./Card";
import {ClickAwayListener, Menu, MenuItem, Popover, Typography} from "@mui/material";
import {Handler, useDrag, useGesture} from "@use-gesture/react";
import {animated} from "react-spring";
import {useKeyPress} from "react-use";
import {file_api, useFile} from "./Queries";
import {file_t, folder_t} from "./Me";
import {isDevelopment} from "../../Config";
import {useQueryClient} from "@tanstack/react-query";
import {files, me} from "../Constants";

export type Handler_t = Handler<"drag", PointerEvent | MouseEvent | TouchEvent | KeyboardEvent>;

interface FileProps {
    file: AccountsDataModelsDataModelsFile;
    focused: boolean;
    setFocused: (focused: boolean, isClickAway: boolean) => void;
    handleDrag: Handler_t;
    handleDragStart: Handler_t;
    handleDragEnd: Handler_t;
    files?: file_t[];
    folders?: folder_t[];
}

export const File: FunctionComponent<FileProps> = (props) => {
    const file = props.file;
    const {focused, setFocused} = props;

    const bind = useGesture({
        onDragStart: props.handleDragStart,
        onDrag: (arg) => {
            const {event, down, xy, movement: [mx, my]} = arg;
            setFocused(true, false);
            props.handleDrag(arg);
        },
        onDragEnd: props.handleDragEnd
    });

    const handleClick = useCallback<MouseEventHandler>((event) => {
        const clicks = event.detail;
        switch (clicks) {
            case 1:
                // handled by pointer handler
                break;
            case 2:
                // open folder
                break;
        }

    }, [setFocused]);

    const isPressedCmd = useKeyPress("Meta");
    const isPressedCtrl = useKeyPress("Control");
    const mod = isPressedCmd[0] || isPressedCtrl[0];

    const handlePointer = useCallback<PointerEventHandler>((event) => {
        setFocused(mod ? !focused : true, false);
    }, [setFocused]);

    const handleClickAway = useCallback(() => {
        setFocused(false, true);
    }, [setFocused]);

    const [contextMenu, setContextMenu] = useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);

    const handleContextMenu: MouseEventHandler = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setContextMenu(
            contextMenu === null
                ? {
                    mouseX: event.clientX + 2,
                    mouseY: event.clientY - 6,
                }
                : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
                  // Other native context menus might behave different.
                  // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
                null,
        );
    };

    const handleClose = () => {
        setContextMenu(null);
    };

    const client = useQueryClient();

    const deleteFile = async () => {
        await file_api.apiFileManagementFileDeleteFileDelete(file.objectId ?? '');
        client.invalidateQueries([me, files]);
        handleClose();
    }

    const {data, isLoading, error} = useFile(file.objectId ?? '');

    const popid = "popid123";
    const [isPopOpen, setIsPopOpen] = useState(false);

    if(isDevelopment && data) {
        data.data = data?.data.replace('https://', 'http://') ?? '';
    }

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <div onPointerDown={handlePointer} onClick={handleClick}>
                <animated.div {...bind()} className="touch-none" title={file.fileName ?? ''}>
                    <div className={`
                            ${focused ? "border-blue-700" : "border-transparent"} 
                            ${focused ? "bg-blue-500 bg-opacity-20" : ""} 
                            border-4 rounded-2xl transition-all ease-in-out touch-none
                            `}
                         onContextMenu={handleContextMenu}
                    >
                        <Card {...props} style={file.userManageable === false ? {opacity: 0.3} : {}}>
                            <div className="text-7xl relative flex justify-center">
                                <FileIcon file={file} url={data?.data ?? ''} />
                            </div>
                            <div className="max-w-40">
                                {file.fileName?.substring(0, 10) + (file?.fileName && file.fileName?.length > 10 ? '...' : '')}
                            </div>
                        </Card>
                    </div>
                    <Menu
                        open={contextMenu !== null}
                        onClose={handleClose}
                        anchorReference="anchorPosition"
                        anchorPosition={
                            contextMenu !== null
                                ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                                : undefined
                        }
                    >
                        <MenuItem onClick={deleteFile} disabled={!file.userManageable} className={`${!file.userManageable && "opacity-30 cursor-not-allowed"}`}>Usuń</MenuItem>
                        <a className="appearance-none border-none bg-transparent p-0 m-0" style={{background: "", margin: "", padding: ""}} download href={data?.data ?? ''}>
                            <MenuItem onClick={handleClose}>Pobierz</MenuItem>
                        </a>
                        <MenuItem aria-describedby={popid} onClick={() => setIsPopOpen(true)}>Przenieś do</MenuItem>

                    </Menu>
                </animated.div>
            </div>
        </ClickAwayListener>
    )
}

const FileIcon: FunctionComponent<{file: file_t, url: string}> = (props) => {
    if(props.file.contentType?.startsWith('image')) {
        if(props.file.backedInMinio !== true) {
            return <img src={`https://avatars.dicebear.com/api/identicon/${props.file.objectId}.svg`} alt={props.file.fileName ?? ''} className="w-full h-full pointer-events-none" />
        }
        return <img src={props.url} alt={props.file.fileName ?? ''} className="h-full max-w-[min(180px,100%)] pointer-events-none object-cover" />
    }

    if(props.file.contentType?.startsWith('video')) {
        if(props.file.backedInMinio !== true) {
            return <MdVideocam />
        }
        return <video src={props.url} className="max-w-[min(180px,100%)] object-contain" controls />
    }

    return (
       <MdFileCopy />
    );
}
