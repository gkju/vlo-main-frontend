import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import {HeadingNode, InitialEditorStateType, QuoteNode} from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import "./index.css";
import "./Theme/CodeHighlighting.css";

import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import ListMaxIndentLevelPlugin from "./plugins/ListMaxIndentLevelPlugin";
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin";
import Theme from "./Theme/Theme";
import YouTubePlugin from "./plugins/YouTubePlugin";
import TwitterPlugin from "./plugins/TwitterPlugin";
import FigmaPlugin from "./plugins/FigmaPlugin";
import {YouTubeNode} from "./nodes/YouTubeNode";
import {TweetNode} from "./nodes/TweetNode";
import {FigmaNode} from "./nodes/FigmaNode";
import AutoEmbedPlugin from "./plugins/AutoEmbedPlugin";
import {TablePlugin} from "@lexical/react/LexicalTablePlugin";
import TableCellResizerPlugin from "./plugins/TableCellResizer";
import TableActionMenuPlugin from "./plugins/TableActionMenuPlugin";
import {OnChangePlugin} from "@lexical/react/LexicalOnChangePlugin";
import {EditorState, LexicalEditor} from "lexical";
import {HorizontalRuleNode} from "@lexical/react/LexicalHorizontalRuleNode";
import HorizontalRulePlugin from "./plugins/HorizontalRulePlugin";

function Placeholder() {
    return <div className="my-10 top-0 absolute pointer-events-none">Twój tekst...</div>;
}

export const editorConfig = {
    // The editor theme
    theme: Theme,
    // Handling of errors during update
    onError(error: any) {
        throw error;
    },
    // Any custom nodes go here
    nodes: [
        HeadingNode,
        ListNode,
        ListItemNode,
        QuoteNode,
        CodeNode,
        CodeHighlightNode,
        TableNode,
        TableCellNode,
        TableRowNode,
        AutoLinkNode,
        LinkNode,
        YouTubeNode,
        TweetNode,
        FigmaNode,
        CodeHighlightNode,
        TableNode,
        HorizontalRuleNode
    ],
    namespace: "editor",
    readOnly: false
};

interface EditorProps {
    onChange?: (editorState: EditorState, editor: LexicalEditor) => void,
    initialEditorState?: InitialEditorStateType
}

export default function Editor(props: EditorProps) {
    let editorState = props.initialEditorState;
    if(typeof props.initialEditorState == 'string' && props.initialEditorState.length < 3) {
        editorState = undefined;
    }

    return (
        <LexicalComposer initialConfig={{...editorConfig, editorState}}>
            <div className="fixed w-full z-10">
                <ToolbarPlugin />
            </div>
            <div className="editor-container h-[100vh] pt-5 grid grid-rows-[90fr_10fr]">
                <div className="editor-inner p-10 relative">
                    <RichTextPlugin
                        contentEditable={<ContentEditable className="editor-input" />}
                        placeholder={<Placeholder />}
                    />
                    <AutoFocusPlugin />
                    <OnChangePlugin onChange={props?.onChange ?? (() => 1)} />
                    <CodeHighlightPlugin />
                    <HistoryPlugin />
                    <AutoFocusPlugin />
                    <CodeHighlightPlugin />
                    <ListPlugin />
                    <LinkPlugin />
                    <AutoLinkPlugin />
                    <ListMaxIndentLevelPlugin maxDepth={7} />
                    <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
                    <YouTubePlugin />
                    <TwitterPlugin />
                    <FigmaPlugin />
                    <AutoEmbedPlugin />
                    <TablePlugin />
                    <HorizontalRulePlugin />
                    <TableCellResizerPlugin />
                    <TableActionMenuPlugin />
                </div>
            </div>
        </LexicalComposer>
    );
}
