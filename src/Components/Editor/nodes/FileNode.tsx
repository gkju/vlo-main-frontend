/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
    EditorConfig,
    ElementFormatType,
    LexicalEditor,
    LexicalNode,
    NodeKey,
    Spread,
} from 'lexical';

import {BlockWithAlignableContents} from '@lexical/react/LexicalBlockWithAlignableContents';
import {
    DecoratorBlockNode,
    SerializedDecoratorBlockNode,
} from '@lexical/react/LexicalDecoratorBlockNode';
import * as React from 'react';
import {useFile, useFileDetails} from "../../../Pages/Me/Queries";
import { VLoader } from '@gkju/vlo-ui';
import {FunctionComponent} from "react";
import {file_t} from "../../../Pages/Me/Me";
import {isDevelopment} from "../../../Config";
import {AiOutlineDownload} from "react-icons/ai";

type FileComponentProps = Readonly<{
    className: Readonly<{
        base: string;
        focus: string;
    }>;
    format: ElementFormatType | null;
    nodeKey: NodeKey;
    fileID: string;
}>;

function FileComponent({
                              className,
                              format,
                              nodeKey,
                              fileID,
                          }: FileComponentProps) {

    const fileDetails = useFileDetails(fileID ?? '');
    const details = fileDetails.data?.data;

    if (fileDetails.isLoading) {
        return <><VLoader /></>;
    }

    return (
        <BlockWithAlignableContents
            className={className}
            format={format}
            nodeKey={nodeKey}>
            <FileRenderer file={details} />
        </BlockWithAlignableContents>
    );
}

const FileRenderer: FunctionComponent<{file?: file_t}> = (props) => {
    const {file} = props;
    const {data, isLoading, error} = useFile(file?.objectId ?? '');
    let url: string = data?.data ?? '';

    if(isDevelopment) {
        url = url.replace("https://", "http://");
    }

    if(file?.contentType?.startsWith("image")) {
        return <img src={url} />
    }

    return (
        <div className="p-4 bg-[#171720] rounded-xl flex items-center">
            {file?.fileName}
            <a download href={url} onClick={() => window.open(url)} className="ml-auto mr-0">
                <AiOutlineDownload />
            </a>
        </div>
    );
}

export type SerializedFileNode = Spread<
    {
        fileID: string;
        type: 'vlo-file';
        version: 1;
    },
    SerializedDecoratorBlockNode
    >;

export class FileNode extends DecoratorBlockNode {
    __id: string;

    static getType(): string {
        return 'vlo-file';
    }

    static clone(node: FileNode): FileNode {
        return new FileNode(node.__id, node.__format, node.__key);
    }

    static importJSON(serializedNode: SerializedFileNode): FileNode {
        const node = $createFileNode(serializedNode.fileID);
        node.setFormat(serializedNode.format);
        return node;
    }

    exportJSON(): SerializedFileNode {
        return {
            ...super.exportJSON(),
            type: 'vlo-file',
            version: 1,
            fileID: this.__id,
        };
    }

    constructor(id: string, format?: ElementFormatType, key?: NodeKey) {
        super(format, key);
        this.__id = id;
    }

    updateDOM(): false {
        return false;
    }

    getId(): string {
        return this.__id;
    }

    getTextContent(
        _includeInert?: boolean | undefined,
        _includeDirectionless?: false | undefined,
    ): string {
        return `https://suvlo.pl/files/${this.__id}`;
    }

    decorate(_editor: LexicalEditor, config: EditorConfig): JSX.Element {
        const embedBlockTheme = config.theme.embedBlock || {};
        const className = {
            base: embedBlockTheme.base || '',
            focus: embedBlockTheme.focus || '',
        };
        return (
            <FileComponent
                className={className}
                format={this.__format}
                nodeKey={this.getKey()}
                fileID={this.__id}
            />
        );
    }

    isTopLevel(): true {
        return true;
    }
}

export function $createFileNode(fileID: string): FileNode {
    return new FileNode(fileID);
}

export function $isFileNode(
    node: FileNode | LexicalNode | null | undefined,
): node is FileNode {
    return node instanceof FileNode;
}
