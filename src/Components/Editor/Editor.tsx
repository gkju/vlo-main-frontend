import {
  InitialEditorStateType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
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
import { YouTubeNode } from "./nodes/YouTubeNode";
import { TweetNode } from "./nodes/TweetNode";
import { FigmaNode } from "./nodes/FigmaNode";
import AutoEmbedPlugin from "./plugins/AutoEmbedPlugin";
import TableCellResizerPlugin from "./plugins/TableCellResizer";
import TableActionMenuPlugin from "./plugins/TableActionMenuPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { EditorState, LexicalEditor } from "lexical";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import HorizontalRulePlugin from "./plugins/HorizontalRulePlugin";
import { useState } from "react";
import { SharedHistoryContext } from "./context/SharedHistoryContext";
import { SharedAutocompleteContext } from "./context/SharedAutocompleteContext";
import {
  TableContext,
  TablePlugin as NewTablePlugin,
} from "./plugins/TablePlugin";
import CodeActionMenuPlugin from "./plugins/CodeActionMenuPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import { TableNode as NewTableNode } from "./nodes/TableNode";
import { TableCellNode, TableRowNode, TableNode } from "@lexical/table";
import DraggableBlockPlugin from "./plugins/DraggableBlockPlugin";
import {EquationNode} from "./nodes/EquationNode";
import EquationsPlugin from "./plugins/EquationsPlugin";
import {FileNode} from "./nodes/FileNode";
import AddFilePlugin from "./plugins/AddFilePlugin";

function Placeholder() {
  return (
    <div className="top-0 absolute ml-10 pointer-events-none">
      Twój tekst...
    </div>
  );
}

const Nodes = [
  HeadingNode,
  ListNode,
  ListItemNode,
  QuoteNode,
  CodeNode,
  CodeHighlightNode,
  NewTableNode,
  AutoLinkNode,
  LinkNode,
  YouTubeNode,
  TweetNode,
  FigmaNode,
  CodeHighlightNode,
  HorizontalRuleNode,
  EquationNode,
  FileNode
];

const TableNodes = [
  HeadingNode,
  ListNode,
  ListItemNode,
  QuoteNode,
  CodeNode,
  CodeHighlightNode,
  AutoLinkNode,
  LinkNode,
];

export const editorConfig = {
  // The editor theme
  theme: Theme,
  // Handling of errors during update
  onError(error: any) {
    throw error;
  },
  // Any custom nodes go here
  nodes: Nodes,
  namespace: "editor",
  readOnly: false,
};

interface EditorProps {
  onChange?: (editorState: EditorState, editor: LexicalEditor) => void;
  initialEditorState?: InitialEditorStateType;
  extraConfig?: any;
  className?: string;
  style?: any;
  innerClassName?: string;
}

export default function Editor(props: EditorProps) {
  let editorState = props.initialEditorState;
  let extraConfig = props.extraConfig ?? {};
  if (
    typeof props.initialEditorState == "string" &&
    props.initialEditorState.length < 3
  ) {
    editorState = undefined;
  }

  const config = { ...editorConfig, editorState, ...extraConfig };

  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  const cellEditorConfig = {
    namespace: "editor-cell",
    nodes: [...TableNodes],
    onError: (error: Error) => {
      throw error;
    },
    theme: Theme,
  };

  return (
    <LexicalComposer initialConfig={{ ...config, editable: !config?.readOnly }}>
      {!config?.readOnly ? (
        <div className="fixed w-full z-10">
          <ToolbarPlugin />
        </div>
      ) : (
        <></>
      )}

      <SharedHistoryContext>
        <TableContext>
          <SharedAutocompleteContext>
            <div
              className={`editor-container h-[100vh] pt-5 ${props?.className}`}
              style={props?.style}
            >
              <div className={`editor-inner relative ${props?.innerClassName}`}>
                <RichTextPlugin
                  contentEditable={
                    <div className="editor" ref={onRef}>
                      <ContentEditable className="editor-input px-10" />
                    </div>
                  }
                  placeholder={<Placeholder />}
                />
                <AutoFocusPlugin />
                <OnChangePlugin onChange={props?.onChange ?? (() => 1)} />
                <HistoryPlugin />
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
                <AddFilePlugin />
                <NewTablePlugin cellEditorConfig={cellEditorConfig}>
                  <AutoFocusPlugin />
                  <RichTextPlugin
                    contentEditable={
                      <ContentEditable className="TableNode__contentEditable" />
                    }
                    placeholder={""}
                  />
                  <HistoryPlugin />
                  <LinkPlugin />
                </NewTablePlugin>
                <HorizontalRulePlugin />
                <TableCellResizerPlugin />
                {floatingAnchorElem && !config?.readOnly && (
                  <>
                    <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
                    <CodeActionMenuPlugin anchorElem={floatingAnchorElem} />
                    <TableActionMenuPlugin anchorElem={floatingAnchorElem} />
                  </>
                )}
                <EquationsPlugin />
              </div>
            </div>
          </SharedAutocompleteContext>
        </TableContext>
      </SharedHistoryContext>
    </LexicalComposer>
  );
}
