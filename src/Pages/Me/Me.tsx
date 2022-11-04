import {
  DragEventHandler,
  FunctionComponent,
  MouseEventHandler,
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import {file_api, useFilesFolders} from "./Queries";
import {AccountsDataModelsDataModelsFile, AccountsDataModelsDataModelsFolder} from "@gkju/vlo-boards-client-axios-ts";
import {VLoader} from "@gkju/vlo-ui";
import {Folder} from "./Folder";
import {File, Handler_t} from "./File";
import {useKeyPress} from "react-use";
import {Handler} from "@use-gesture/react";
import {animated, useSpring} from "react-spring";
import {MdFileCopy, MdFolder} from "react-icons/md";
import {QueryClient, useQueryClient} from "@tanstack/react-query";
import {me, files as files_c} from "../Constants";
import {useNavigate, useParams} from "react-router-dom";
import animation from "./MeLottieDrop.json";
import Lottie from "lottie-react";
import {Breadcrumbs, Menu, MenuItem, Typography, Link} from "@mui/material";
import {minimalModal, queueMinimalistModal} from "../../Redux/Slices/MinimalModal";
import Store from "../../Redux/Store/Store";
import authService from "../../Auth/AuthService";

export type file_t = AccountsDataModelsDataModelsFile;
export type folder_t = AccountsDataModelsDataModelsFolder;
export const createMinimalistModal = (p: minimalModal) => Store.dispatch(queueMinimalistModal(p));

export const moveIntoFolder = async (targetFolderId: string | null, files: file_t[], folders: folder_t[], queryClient: QueryClient) => {
  for(let file of files) {
    if(targetFolderId === null) {
      await file_api.apiFileManagementFileRemoveSubFileDelete(file.parentId ?? '', file.objectId ?? '');
      continue;
    }

    await file_api.apiFileManagementFileAddSubFilePost(targetFolderId, file.objectId ?? '');
  }

  for(let folder of folders) {

    if(folder.id !== targetFolderId) {
      if(targetFolderId === null) {
        await file_api.apiFileManagementFileRemoveSubFolderDelete(folder.masterFolderId ?? '', folder.id ?? '');
        continue;
      }

      await file_api.apiFileManagementFileAddSubFolderPost(targetFolderId, folder.id ?? '');
    }

  }

  if (files.length > 0) {
    queryClient.invalidateQueries([me, files_c]);
  }
  if (folders.length > 0) {
    queryClient.invalidateQueries([me, files_c]);
  }
}

export const deleteFilesFolders = async (files: file_t[], folders: folder_t[], queryClient: QueryClient) => {
  for(let file of files) {
    await file_api.apiFileManagementFileDeleteFileDelete(file.objectId ?? '');
  }

  for(let folder of folders) {
    await file_api.apiFileManagementFileDeleteFolderDelete(folder.id ?? '');
  }

  if (files.length > 0) {
        queryClient.invalidateQueries([me, files_c]);
  }
  if (folders.length > 0) {
    queryClient.invalidateQueries([me, files_c]);
  }
}

const GetParent = (folder: folder_t | undefined, folders: Map<string, folder_t>) => {
    return folders.get(folder?.masterFolderId ?? '');
}

const GetParents = (folder: folder_t | undefined, folders: Map<string, folder_t>) => {
  let currentFolder: folder_t | undefined = folder;
  let parents: folder_t[] = [];
  let i = 0;
  while(i < 100 && currentFolder?.masterFolderId && currentFolder.masterFolderId?.length > 0) {
    parents.push(currentFolder);
    currentFolder = GetParent(currentFolder, folders);
    i++;
  }
  parents.push(currentFolder ?? {});
  parents = parents.reverse();
  return parents;
}

export const Me: FunctionComponent = () => {
  const {data, error, isLoading} = useFilesFolders();
  const refy = useRef<HTMLDivElement>(null);
  const [style,api] = useSpring(() => ({x: 0, y: 0}));
  const { id } = useParams<{ id: string }>();

  const isPressedCmd = useKeyPress("Meta");
  const isPressedCtrl = useKeyPress("Control");
  const mod = isPressedCmd[0] || isPressedCtrl[0];

  const [focusedFileList, setFocusedFileList] = useState<boolean[]>([]);
  const setFocusedFile = (index: number, focused: boolean, isClickAway: boolean) => {
    const newFocusedFileList = [...focusedFileList];
    while(index >= newFocusedFileList.length) {
        newFocusedFileList.push(false);
    }

    if(!isClickAway || !mod) {
      newFocusedFileList[index] = focused;
    }
    setFocusedFileList(newFocusedFileList);
  }

  const [focusedFolderList, setFocusedFolderList] = useState<boolean[]>([]);
  const setFocusedFolder = (index: number, focused: boolean, isClickAway: boolean) => {
    const newFocusedFolderList = [...focusedFolderList];
    while(index >= newFocusedFolderList.length) {
      newFocusedFolderList.push(false);
    }
    if(!isClickAway || !mod) {
      newFocusedFolderList[index] = focused;
    }
    setFocusedFolderList(newFocusedFolderList);
  }

  let filesFolders: FilesFolders = data?.data ?? {folders: [], files: []};

  const searchId = id ?? null;

  let files = filesFolders.files.filter(f => f.parentId == searchId);
  let folders = filesFolders.folders.filter(f => f.masterFolderId == searchId);
  let foldersMap = new Map<string, folder_t>(filesFolders.folders.map(f => [f.id ?? '', f]));
  let parents = GetParents(foldersMap.get(searchId ?? ''), foldersMap);

  let [selectedFiles, setSelectedFiles] = useState<AccountsDataModelsDataModelsFile[]>([]);
  let [selectedFolders, setSelectedFolders] = useState<AccountsDataModelsDataModelsFolder[]>([]);
  useEffect(() => {
    setSelectedFiles(files.filter((file, index) => focusedFileList[index]));
    setSelectedFolders(folders.filter((folder, index) => focusedFolderList[index]));
  }, [focusedFileList, focusedFolderList, filesFolders]);

  const [isDragging, setIsDragging] = useState(false);

  const dragHandler = useCallback<Handler<any>>((ev) => {
    const {event, down, xy, movement: [mx, my]} = ev;
    const rect = refy.current?.getBoundingClientRect();
    const topLeft = [rect?.left ?? 0, rect?.top ?? 0];
    const delta = [xy[0] - topLeft[0], xy[1] - topLeft[1]];
    api.start({x: delta[0], y: delta[1], immediate: down});
  }, []);

  const dragStartHandler = () => {
    setIsDragging(true);
  }

  const queryClient = useQueryClient();

  const dragEndHandler: Handler_t = (e) => {
    const {event, down, xy, movement: [mx, my]} = e;
    const els = document.elementsFromPoint(xy[0], xy[1]);

    let folderData: string | null = null;
    for(let el of els) {
      // @ts-ignore
      if(el.dataset?.folderId) {
        // @ts-ignore
        folderData = String(el.dataset?.folderId);
        break;
      }
    }
    setIsDragging(false);

    if(Math.abs(mx) < 10 && Math.abs(my) < 10) {
      return;
    }

    if(folderData === "root") {
      moveIntoFolder(null, selectedFiles, selectedFolders, queryClient);
    } else if(folderData !== null && folderData.length > 0) {
        moveIntoFolder(folderData, selectedFiles, selectedFolders, queryClient);
    }
  }

  const [hover, setHover] = useState(false);

  const handleDrop: DragEventHandler = (e) => {
    let files = e.dataTransfer.files;
    for (let file of files) {
      upload(file);
    }
  }

  const upload = async (file: File) => {
    const res = await file_api.apiFileManagementFileUploadFilePost(false, file);
    await file_api.apiFileManagementFileAddSubFilePost(id ?? '', res.data ?? '');
  }

  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const handleContextMenu: MouseEventHandler = (event) => {
    event.preventDefault();
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

  const handleNewFolder = () => {
    handleClose();
    createMinimalistModal({
        placeholder: "Nazwa",
        handler: async (s) => {
          let { data } = await file_api.apiFileManagementFileCreateFolderPost(s);
          console.log("data", data);
          // @ts-ignore
          if(id?.length > 0) {
            // @ts-ignore
            setTimeout(async () => {
              // @ts-ignore
              await file_api.apiFileManagementFileAddSubFolderPost(id ?? '', data ?? '');
              queryClient.invalidateQueries([me]);
            }, 50);
          }
          queryClient.invalidateQueries([me]);
        },
        validator: (s) => s.length > 0,
    });
  }

  const handleDeleteSelected = () => {
    handleClose();
    deleteFilesFolders(selectedFiles, selectedFolders, queryClient);
  }

  const client = useQueryClient();

  const navigate = useNavigate();

  if(isLoading) {
    return <VLoader />
  }

  return <div
      className="min-h-[100vh] w-full"
      onDragOver={(e) => {
        setHover(true);
        e.preventDefault();
      }}
      onDrop={(e) => {
        setHover(false);
        e.preventDefault();
        handleDrop(e);
      }}
      onDragEnter={(e) => {
        setHover(true);
        e.preventDefault();
      }}
      onDragLeave={(e) => {
        setHover(false);
        e.preventDefault();
      }}
      ref={refy}
  >
    <div className="px-10 py-5">
      <Breadcrumbs>
        <Link data-folder-id={"root"} underline="hover" color="inherit" onClick={() => navigate("/me")}>
          Root
        </Link>
        {parents.slice(0, -1).map((parent, index) => (
        <Link data-folder-id={parent.id} underline="hover" key={index} color="inherit" onClick={() => navigate(`/me/${parent.id}`)}>
          {parent.name}
        </Link>
        ))}
        <Typography color="text.primary">{parents[parents.length - 1]?.name ?? ''}</Typography>
      </Breadcrumbs>
    </div>
    {
      hover && <div className="fixed w-[100vw] h-[100vh] flex justify-center top-0 left-0 center-align z-10 pointer-events-none">
          <div className="self-center">
            <Lottie animationData={animation} loop={true} />
          </div>
        </div>
    }
    <div className={`${!isDragging && "opacity-0"} absolute transition-all duration-500`}>
      <animated.div style={style}>
        <div className="border-2 border-gray-500 rounded-xl bg-[#121228]">
            {selectedFiles.map(f => <ContextMenuUnit key={f.objectId}>
              {f.fileName } <Spacer /> <MdFileCopy className="justify-self-end right-0 self-center ml-auto" />
            </ContextMenuUnit>)}
            {selectedFolders.map(f => <ContextMenuUnit key={f.id}>
              {f.name} <Spacer /> <MdFolder className="justify-self-end right-0 self-center ml-auto" />
            </ContextMenuUnit>)}
        </div>
      </animated.div>
    </div>
    <main className="px-10 grid" onContextMenu={handleContextMenu}>
      <Header>
        Foldery
      </Header>
      <Wrapper>
        {folders.map((folder, i) => <MiniWrapper key={folder.id}>
          <Folder files={files} folders={folders} handleDrag={dragHandler} handleDragEnd={dragEndHandler} handleDragStart={dragStartHandler} data-folder-id={folder.id} focused={focusedFolderList[i]} setFocused={(v,c) => setFocusedFolder(i,v,c)} folder={folder} />
        </MiniWrapper>)}
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
          <MenuItem onClick={handleNewFolder}>Nowy folder</MenuItem>
          <MenuItem onClick={handleDeleteSelected}>Usuń zaznaczone</MenuItem>
        </Menu>
      </Wrapper>
      <Header>
        Pliki
      </Header>
      <Wrapper>
        {files.map((file, i) => <MiniWrapper key={file.objectId}>
          <File files={files} folders={folders} handleDrag={dragHandler} handleDragEnd={dragEndHandler} handleDragStart={dragStartHandler} data-file-id={file.objectId} focused={focusedFileList[i]} setFocused={(v,c) => setFocusedFile(i,v,c)} file={file} />
        </MiniWrapper>)}
      </Wrapper>
      <Header>
        Artykuły
      </Header>
    </main>
  </div>;
};

const Spacer: FunctionComponent<PropsWithChildren> = (props) => <>
  <div className="
    w-5
  ">
    {props.children}
  </div>
</>;

const ContextMenuUnit: FunctionComponent<PropsWithChildren> = (props) => <>
  <div className="
    flex
    border-gray-600
    border-b-2
    p-2
  ">
    {props.children}
  </div>
</>;

const Wrapper: FunctionComponent<PropsWithChildren> = (props) => <>
  <div className="
    pb-5
    grid
    grid-cols-3
    max-w-full
  ">
    {props.children}
  </div>
</>;

const MiniWrapper: FunctionComponent<PropsWithChildren> = (props) => <>
  <div className="p-2">
    {props.children}
  </div>
</>;

const Header: FunctionComponent<PropsWithChildren> = (props) => <header className="
      text-left w-full justify-start
      text-white text-2xl font-medium
      opacity-30
      pb-5
      ml-0
      mr-auto
    ">
  {props.children}
</header>;

class FilesFolders {
  public folders: AccountsDataModelsDataModelsFolder[] = [];
  public files: AccountsDataModelsDataModelsFile[] = [];
}
