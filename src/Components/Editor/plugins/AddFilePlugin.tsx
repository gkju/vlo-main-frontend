import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {$insertNodes, COMMAND_PRIORITY_EDITOR, createCommand, LexicalCommand} from 'lexical';
import {useEffect} from 'react';

import {$createFileNode, FileNode} from "../nodes/FileNode";
import {$insertNodeToNearestRoot} from "@lexical/utils";

export const INSERT_FILE_COMMAND: LexicalCommand<string> = createCommand();

export default function FilePlugin(): JSX.Element | null {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        if (!editor.hasNodes([FileNode])) {
            throw new Error('FilePlugin: FileNode not registered on editor');
        }

        return editor.registerCommand<string>(
            INSERT_FILE_COMMAND,
            (payload) => {
                const fileNode = $createFileNode(payload);
                $insertNodeToNearestRoot(fileNode);

                return true;
            },
            COMMAND_PRIORITY_EDITOR,
        );
    }, [editor]);

    return null;
}
