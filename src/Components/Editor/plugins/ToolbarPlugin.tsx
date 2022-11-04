/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { LexicalEditor } from "lexical";

import "./index.css";

import {
  $createCodeNode,
  $isCodeNode,
  CODE_LANGUAGE_FRIENDLY_NAME_MAP,
  CODE_LANGUAGE_MAP,
  getLanguageFriendlyName,
} from "@lexical/code";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import {
  $isListNode,
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { INSERT_EMBED_COMMAND } from "@lexical/react/LexicalAutoEmbedPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $isDecoratorBlockNode } from "@lexical/react/LexicalDecoratorBlockNode";
import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode";
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  HeadingTagType,
} from "@lexical/rich-text";
import {
  $getSelectionStyleValueForProperty,
  $isParentElementRTL,
  $patchStyleText,
  $selectAll,
} from "@lexical/selection";
import {
  $getNearestBlockElementAncestorOrThrow,
  $getNearestNodeOfType,
  mergeRegister,
} from "@lexical/utils";
import {
  $createParagraphNode,
  $getNodeByKey,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  INDENT_CONTENT_COMMAND,
  NodeKey,
  OUTDENT_CONTENT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import * as React from "react";
import { useCallback, useEffect, useState } from "react";

import useModal from "../hooks/useModal";
import Button from "../ui/Button";
import ColorPicker from "../ui/ColorPicker";
import DropDown, { DropDownItem } from "../ui/DropDown";
import { getSelectedNode } from "../utils/getSelectedNode";
import { sanitizeUrl } from "../utils/sanitizeUrl";
import { isMacOs } from "react-device-detect";
import { EmbedConfigs } from "./AutoEmbedPlugin";
import {
  BlockFormatDropDown,
  blockTypeToBlockName,
  CODE_LANGUAGE_OPTIONS,
  Divider,
  dropDownActiveClass,
  FontDropDown, InsertEquationDialog,
  InsertTableDialog,
} from "./ToolbarEssentials";
import { INSERT_FILE_COMMAND } from "./AddFilePlugin";
import store from "../../../Redux/Store/Store";
import { queueModal } from "../../../Redux/Slices/Modal";
import { AiOutlineFileAdd } from "react-icons/ai";
import { Box, Modal, Paper } from "@mui/material";
import { AnimatePresence } from "framer-motion";
import { INSERT_TABLE_COMMAND as INSERT_NEW_TABLE_COMMAND } from "./TablePlugin";
import {file_api} from "../../../Pages/Me/Queries";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function ToolbarPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [blockType, setBlockType] =
    useState<keyof typeof blockTypeToBlockName>("paragraph");
  const [selectedElementKey, setSelectedElementKey] = useState<NodeKey | null>(
    null
  );
  const [fontSize, setFontSize] = useState<string>("15px");
  const [fontColor, setFontColor] = useState<string>("#fff");
  const [bgColor, setBgColor] = useState<string>("#1D1D28");
  const [fontFamily, setFontFamily] = useState<string>("Arial");
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [modal, showModal] = useModal();
  const [isRTL, setIsRTL] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState<string>("");
  const [showFileModal, setShowFileModal] = useState(false);
  const [fileId, setFileId] = useState<string>("");

  const handleFileDialog = () => {
    setShowFileModal(true);
  };

  const handleFileModalClick = async () => {

    let opts = {
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
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    let files = e.dataTransfer.files;
    for(let file of files) {
      return upload(file);
    }
  }

  const [isLocked, acquireLock] = useState(false);

  const upload = async (file: File) => {
    if(isLocked) return;
    acquireLock(true);
    console.log("droppity")
    const res = await file_api.apiFileManagementFileUploadFilePost(true, file);
    console.log(res);
    const id = res.data;
    finalizeFileModal(id);
  }

  const finalizeFileModal = (fileId: string) => {
    activeEditor.dispatchCommand(
            INSERT_FILE_COMMAND,
            fileId,
    );
    handleFileModalClose();
  }

  const handleFileModalClose = () => {
    acquireLock(false);
    setShowFileModal(false);
  };

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = activeEditor.getElementByKey(elementKey);

      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsSubscript(selection.hasFormat("subscript"));
      setIsSuperscript(selection.hasFormat("superscript"));
      setIsCode(selection.hasFormat("code"));
      setIsRTL($isParentElementRTL(selection));

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }

      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(
            anchorNode,
            ListNode
          );
          const type = parentList
            ? parentList.getListType()
            : element.getListType();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          if (type in blockTypeToBlockName) {
            setBlockType(type as keyof typeof blockTypeToBlockName);
          }
          if ($isCodeNode(element)) {
            const language =
              element.getLanguage() as keyof typeof CODE_LANGUAGE_MAP;
            setCodeLanguage(
              language ? CODE_LANGUAGE_MAP[language] || language : ""
            );
            return;
          }
        }
      }
      // Handle buttons
      setFontSize(
        $getSelectionStyleValueForProperty(selection, "font-size", "15px")
      );
      setFontColor(
        $getSelectionStyleValueForProperty(selection, "color", "#000")
      );
      setBgColor(
        $getSelectionStyleValueForProperty(
          selection,
          "background-color",
          "#fff"
        )
      );
      setFontFamily(
        $getSelectionStyleValueForProperty(selection, "font-family", "Arial")
      );
    }
  }, [activeEditor]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        updateToolbar();
        setActiveEditor(newEditor);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor, updateToolbar]);

  useEffect(() => {
    return mergeRegister(
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      activeEditor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      activeEditor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      )
    );
  }, [activeEditor, updateToolbar]);

  const applyStyleText = useCallback(
    (styles: Record<string, string>) => {
      activeEditor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $patchStyleText(selection, styles);
        }
      });
    },
    [activeEditor]
  );

  const clearFormatting = useCallback(() => {
    activeEditor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $selectAll(selection);
        selection.getNodes().forEach((node) => {
          if ($isTextNode(node)) {
            node.setFormat(0);
            node.setStyle("");
            $getNearestBlockElementAncestorOrThrow(node).setFormat("");
          }
          if ($isDecoratorBlockNode(node)) {
            node.setFormat("");
          }
        });
      }
    });
  }, [activeEditor]);

  const onFontColorSelect = useCallback(
    (value: string) => {
      applyStyleText({ color: value });
    },
    [applyStyleText]
  );

  const onBgColorSelect = useCallback(
    (value: string) => {
      applyStyleText({ "background-color": value });
    },
    [applyStyleText]
  );

  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl("https://"));
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  const onCodeLanguageSelect = useCallback(
    (value: string) => {
      activeEditor.update(() => {
        if (selectedElementKey !== null) {
          const node = $getNodeByKey(selectedElementKey);
          if ($isCodeNode(node)) {
            node.setLanguage(value);
          }
        }
      });
    },
    [activeEditor, selectedElementKey]
  );

  const IS_APPLE = isMacOs;

  return (
    <div className="toolbar">
      <button
        disabled={!canUndo}
        onClick={() => {
          activeEditor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        title={IS_APPLE ? "Undo (⌘Z)" : "Undo (Ctrl+Z)"}
        className="toolbar-item spaced"
        aria-label="Undo"
      >
        <i className="format undo" />
      </button>
      <button
        disabled={!canRedo}
        onClick={() => {
          activeEditor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        title={IS_APPLE ? "Redo (⌘Y)" : "Redo (Ctrl+Y)"}
        className="toolbar-item"
        aria-label="Redo"
      >
        <i className="format redo" />
      </button>
      <Divider />
      {blockType in blockTypeToBlockName && activeEditor === editor && (
        <>
          <BlockFormatDropDown blockType={blockType} editor={editor} />
          <Divider />
        </>
      )}
      {blockType === "code" ? (
        <>
          <DropDown
            buttonClassName="toolbar-item code-language"
            buttonLabel={getLanguageFriendlyName(codeLanguage)}
            buttonAriaLabel="Select language"
          >
            {CODE_LANGUAGE_OPTIONS.map(([value, name]) => {
              return (
                <DropDownItem
                  className={`item ${dropDownActiveClass(
                    value === codeLanguage
                  )}`}
                  onClick={() => onCodeLanguageSelect(value)}
                  key={value}
                >
                  <span className="text">{name}</span>
                </DropDownItem>
              );
            })}
          </DropDown>
        </>
      ) : (
        <>
          <FontDropDown
            style={"font-family"}
            value={fontFamily}
            editor={editor}
          />
          <FontDropDown style={"font-size"} value={fontSize} editor={editor} />
          <Divider />
          <button
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
            }}
            className={"toolbar-item spaced " + (isBold ? "active" : "")}
            title={IS_APPLE ? "Bold (⌘B)" : "Bold (Ctrl+B)"}
            aria-label={`Format text as bold. Shortcut: ${
              IS_APPLE ? "⌘B" : "Ctrl+B"
            }`}
          >
            <i className="format bold" />
          </button>
          <button
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
            }}
            className={"toolbar-item spaced " + (isItalic ? "active" : "")}
            title={IS_APPLE ? "Italic (⌘I)" : "Italic (Ctrl+I)"}
            aria-label={`Format text as italics. Shortcut: ${
              IS_APPLE ? "⌘I" : "Ctrl+I"
            }`}
          >
            <i className="format italic" />
          </button>
          <button
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
            }}
            className={"toolbar-item spaced " + (isUnderline ? "active" : "")}
            title={IS_APPLE ? "Underline (⌘U)" : "Underline (Ctrl+U)"}
            aria-label={`Format text to underlined. Shortcut: ${
              IS_APPLE ? "⌘U" : "Ctrl+U"
            }`}
          >
            <i className="format underline" />
          </button>
          <button
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
            }}
            className={"toolbar-item spaced " + (isCode ? "active" : "")}
            title="Insert code block"
            aria-label="Insert code block"
          >
            <i className="format code" />
          </button>
          <button
            onClick={insertLink}
            className={"toolbar-item spaced " + (isLink ? "active" : "")}
            aria-label="Insert link"
            title="Insert link"
          >
            <i className="format link" />
          </button>
          <ColorPicker
            buttonClassName="toolbar-item color-picker"
            buttonAriaLabel="Formatting text color"
            buttonIconClassName="icon font-color"
            color={fontColor}
            onChange={onFontColorSelect}
            title="text color"
          />
          <ColorPicker
            buttonClassName="toolbar-item color-picker"
            buttonAriaLabel="Formatting background color"
            buttonIconClassName="icon bg-color"
            color={bgColor}
            onChange={onBgColorSelect}
            title="bg color"
          />
          <DropDown
            buttonClassName="toolbar-item spaced"
            buttonLabel=""
            buttonAriaLabel="Formatting options for additional text styles"
            buttonIconClassName="icon dropdown-more"
          >
            <DropDownItem
              onClick={() => {
                activeEditor.dispatchCommand(
                  FORMAT_TEXT_COMMAND,
                  "strikethrough"
                );
              }}
              className={"item " + dropDownActiveClass(isStrikethrough)}
              title="Strikethrough"
              aria-label="Format text with a strikethrough"
            >
              <i className="icon strikethrough" />
              <span className="text">Strikethrough</span>
            </DropDownItem>
            <DropDownItem
              onClick={() => {
                activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "subscript");
              }}
              className={"item " + dropDownActiveClass(isSubscript)}
              title="Subscript"
              aria-label="Format text with a subscript"
            >
              <i className="icon subscript" />
              <span className="text">Subscript</span>
            </DropDownItem>
            <DropDownItem
              onClick={() => {
                activeEditor.dispatchCommand(
                  FORMAT_TEXT_COMMAND,
                  "superscript"
                );
              }}
              className={"item " + dropDownActiveClass(isSuperscript)}
              title="Superscript"
              aria-label="Format text with a superscript"
            >
              <i className="icon superscript" />
              <span className="text">Superscript</span>
            </DropDownItem>
            <DropDownItem
              onClick={clearFormatting}
              className="item"
              title="Clear text formatting"
              aria-label="Clear all text formatting"
            >
              <i className="icon clear" />
              <span className="text">Clear Formatting</span>
            </DropDownItem>
          </DropDown>
          <Divider />
          <DropDown
            buttonClassName="toolbar-item spaced"
            buttonLabel="Insert"
            buttonAriaLabel="Insert specialized editor node"
            buttonIconClassName="icon plus"
          >
            <DropDownItem
              onClick={() => {
                activeEditor.dispatchCommand(
                  INSERT_HORIZONTAL_RULE_COMMAND,
                  undefined
                );
              }}
              className="item"
            >
              <i className="icon horizontal-rule" />
              <span className="text">Horizontal Rule</span>
            </DropDownItem>
            <DropDownItem onClick={handleFileDialog} className="item">
              <AiOutlineFileAdd className="icon text-[rgba(255,255,255,0.6)]" />
              <span className="text">VLO File (image)</span>
            </DropDownItem>
            <DropDownItem
              onClick={() => {
                showModal("Insert Table", (onClose) => (
                  <InsertTableDialog
                    activeEditor={activeEditor}
                    onClose={onClose}
                  />
                ));
              }}
              className="item"
            >
              <i className="icon table" />
              <span className="text">Table</span>
            </DropDownItem>
            <DropDownItem
                onClick={() => {
                  showModal('Insert Equation', (onClose) => (
                      <InsertEquationDialog
                          activeEditor={activeEditor}
                          onClose={onClose}
                      />
                  ));
                }}
                className="item">
              <i className="icon equation" />
              <span className="text">Equation</span>
            </DropDownItem>
            {EmbedConfigs.map((embedConfig) => (
              <DropDownItem
                key={embedConfig.type}
                onClick={() => {
                  activeEditor.dispatchCommand(
                    INSERT_EMBED_COMMAND,
                    embedConfig.type
                  );
                }}
                className="item"
              >
                {embedConfig.icon}
                <span className="text">{embedConfig.contentName}</span>
              </DropDownItem>
            ))}
          </DropDown>
          <DropDown
            buttonLabel="Align"
            buttonIconClassName="icon left-align"
            buttonClassName="toolbar-item spaced alignment"
            buttonAriaLabel="Formatting options for text alignment"
          >
            <DropDownItem
              onClick={() => {
                activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
              }}
              className="item"
            >
              <i className="icon left-align" />
              <span className="text">Left Align</span>
            </DropDownItem>
            <DropDownItem
              onClick={() => {
                activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
              }}
              className="item"
            >
              <i className="icon center-align" />
              <span className="text">Center Align</span>
            </DropDownItem>
            <DropDownItem
              onClick={() => {
                activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
              }}
              className="item"
            >
              <i className="icon right-align" />
              <span className="text">Right Align</span>
            </DropDownItem>
            <DropDownItem
              onClick={() => {
                activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
              }}
              className="item"
            >
              <i className="icon justify-align" />
              <span className="text">Justify Align</span>
            </DropDownItem>
            <Divider />
            <DropDownItem
              onClick={() => {
                activeEditor.dispatchCommand(
                  OUTDENT_CONTENT_COMMAND,
                  undefined
                );
              }}
              className="item"
            >
              <i className={"icon " + (isRTL ? "indent" : "outdent")} />
              <span className="text">Outdent</span>
            </DropDownItem>
            <DropDownItem
              onClick={() => {
                activeEditor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
              }}
              className="item"
            >
              <i className={"icon " + (isRTL ? "outdent" : "indent")} />
              <span className="text">Indent</span>
            </DropDownItem>
          </DropDown>
        </>
      )}
      <Divider />

      {modal}
      <Modal
          open={showFileModal}
          onClose={handleFileModalClose}
          onDragOver={e => e.preventDefault()} onDrop={e => {e.preventDefault(); handleDrop(e)}}
          onDragEnter={(e) => {e.preventDefault()}} onDragLeave={(e) => {e.preventDefault();}}
      >
        <div onClick={handleFileModalClick} className={`${isLocked && "opacity-30"}`}>
          <Box sx={style}>
            Upuść plik lub kliknij, aby wybrać plik
          </Box>
        </div>
      </Modal>
    </div>
  );
}
