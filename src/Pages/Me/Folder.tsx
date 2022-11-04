import {FunctionComponent, MouseEventHandler, PointerEventHandler, useCallback, useState} from "react";
import {AccountsDataModelsDataModelsFolder} from "@gkju/vlo-boards-client-axios-ts";
import {MdFileCopy, MdFolder} from "react-icons/md";
import {Card} from "./Card";
import {ClickAwayListener, Menu, MenuItem} from "@mui/material";
import {Handler, useDrag, useGesture} from "@use-gesture/react";
import {motion, useAnimation} from "framer-motion";
import {animated, useSpring} from "react-spring";
import {useKeyPress} from "react-use";
import {Handler_t} from "./File";
import {useNavigate} from "react-router-dom";
import {file_t, folder_t} from "./Me";
import {file_api} from "./Queries";
import {useQueryClient} from "@tanstack/react-query";
import {files, me} from "../Constants";

interface FolderProps {
    folder: AccountsDataModelsDataModelsFolder;
    focused: boolean;
    setFocused: (focused: boolean, isClickAway: boolean) => void;
    handleDrag: Handler_t;
    handleDragStart: Handler_t;
    handleDragEnd: Handler_t;
    files?: file_t[];
    folders?: folder_t[];
}

export const Folder: FunctionComponent<FolderProps> = (props) => {
    const folder = props.folder;
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

    const navigate = useNavigate();

    const isPressedCmd = useKeyPress("Meta");
    const isPressedCtrl = useKeyPress("Control");
    const mod = isPressedCmd[0] || isPressedCtrl[0];

    const handleDblClick = useCallback<MouseEventHandler>((event) => {
        navigate("/me/" + folder.id ?? '');
    }, [navigate, folder]);

    const handlePointer = useCallback<PointerEventHandler>((event) => {
        event.preventDefault();
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

    const client = useQueryClient();

    const handleDelete = async () => {
        await file_api.apiFileManagementFileDeleteFolderDelete(folder.id ?? '');
        client.invalidateQueries([me, files]);
        handleClose();
    }

    const handleClose = () => {
        setContextMenu(null);
    };

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <div>
                <animated.div onPointerDown={handlePointer} onDoubleClick={handleDblClick} {...bind()}  className="touch-none">
                        <div className={`
                            ${focused ? "border-blue-700" : "border-transparent"} 
                            ${focused ? "bg-blue-500 bg-opacity-20" : ""} 
                            border-4 rounded-2xl transition-all ease-in-out touch-none
                            `}
                             onContextMenu={handleContextMenu}
                        >
                            <Card {...props}>
                                <div className="text-7xl">
                                    <MdFolder />
                                </div>

                                {folder.name}
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
                            <MenuItem onClick={handleDelete}>Usuń (bez plików)</MenuItem>
                        </Menu>
                </animated.div>
            </div>
        </ClickAwayListener>
    )
}
