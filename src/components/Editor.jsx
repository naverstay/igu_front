import React, {useCallback, useEffect, useRef, useState} from "react";
import Editor from "@monaco-editor/react";
import {EditorContent, useEditor} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import {TextStyle} from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import {EditorFontSize} from "./EditorFontSize";
import {EditorImage} from "./EditorImage";
import ImageSidebar from "./ImageSidebar";
import {DivBlock} from "./DivBlock";
import {SlashCommands} from "./SlashCommands";
import {PopupImageInsert} from "./PopupImageInsert.jsx";
import {Figcaption, Figure} from "./Figure.jsx";

import {
  TbAlignCenter,
  TbAlignJustified,
  TbAlignLeft,
  TbAlignRight,
  TbArrowBackUp,
  TbArrowForwardUp,
  TbBlockquote,
  TbBold,
  TbCode,
  TbCopy,
  TbDeviceFloppy,
  TbH1,
  TbH2,
  TbH3,
  TbH4,
  TbH5,
  TbH6,
  TbHighlight,
  TbHtml,
  TbItalic,
  TbLink,
  TbList,
  TbListNumbers,
  TbPhoto,
  TbPhotoUp,
  TbSearch,
  TbStrikethrough,
  TbUnderline,
  TbUnlink
} from "react-icons/tb";

import {api, API_URL, DEV_MODE} from "../api";

import "./editor.css";

export default function TipTapEditor({value, onChange, onSave, onCopy}) {
  const [editorState, setEditorState] = useState({});
  const [showHtml, setShowHtml] = useState(false);
  const [htmlValue, setHtmlValue] = useState("");
  const editorRef = useRef(null);
  const [height, setHeight] = useState(500);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [savedPos, setSavedPos] = useState(null);
  const [savedSelection, setSavedSelection] = useState(null);

  const openImagePopup = () => {
    if (!editor) return;
    const {state} = editor;
    const selection = state.selection;
    setSavedSelection(selection.toJSON());
    setShowImagePopup(true);
  };

  const uploadImageToStrapi = async (file) => {
    const formData = new FormData();
    formData.append("files", file);

    try {
      const res = await api.post("/upload", formData);
      console.log("UPLOAD SUCCESS:", res.data);

      return (DEV_MODE ? API_URL : '') + res.data[0].url;
    } catch (err) {
      if (err.response?.status === 500) {
        console.warn("WEBP is there, but Strapi failed. Searching the last file…");
        const files = await api.get("/upload/files");

        return (DEV_MODE ? API_URL : '') + files.data.at(-1).url;
      } else {
        console.error("UPLOAD ERROR:", err.response?.data || err);
      }

      throw err;
    }
  };

  const editor = useEditor({
    content: value,
    extensions: [
      StarterKit.configure({link: false}),
      DivBlock,
      SlashCommands,
      Link.configure({
        openOnClick: false
      }),
      TextStyle,
      Color,
      Highlight,
      EditorFontSize,
      EditorImage,
      Figure,
      Figcaption,
      TextAlign.configure({
        types: ["heading", "paragraph", "image"]
      }),
      Placeholder.configure({
        placeholder: "New article..."
      })
    ],
    //onCreate({editor}) {
    //  console.log(editor.extensionManager.extensions.map(e => e.name));
    //},
    onUpdate({editor}) {
      onChange(editor.getHTML());
    }
  });

  const addLink = () => {
    const url = prompt("Введите URL");
    if (!url) return;
    editor.chain().focus().setLink({href: url}).run();
  };

  const handleHtmlChange = value => {
    setHtmlValue(value);
    onChange(value);
  };

  const handleEditorBeforeMount = (monaco) => {
    monaco.languages.registerHoverProvider("html", {
      provideHover(model, position) {
        const word = model.getWordAtPosition(position);
        if (!word) return;
        const text = word.word;
        if (!/^https?:\/\//.test(text)) return;
        return {contents: [{value: ` **Link:** ${text} [Copy URL](command:copyLink?${encodeURIComponent(JSON.stringify(text))}) `}]};
      }
    });

    monaco.editor.registerCommand("copyLink", (accessor, url) => {
      navigator.clipboard.writeText(url);
    });
  };

  const handleEditorMount = (editor, monaco) => {
    editorRef.current = editor;

    const updateHeight = () => {
      const contentHeight = editor.getContentHeight();
      setHeight(Math.max(500, Math.min(2000, contentHeight)));
    };
    editor.onDidContentSizeChange(updateHeight);
    updateHeight();
  };

  const runAction = (actionId) => {
    const editor = editorRef.current;
    if (!editor) return;
    const action = editor.getAction(actionId);
    if (action) action.run();
  };

  function handleEditorValidation(markers) {
    markers.forEach((marker) => console.log('onValidate:', marker.message));
  }

  const handleCopy = async () => {
    onCopy(value);
  };

  const addImage = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      const url = await uploadImageToStrapi(file);

      const hasSelection = editor.state.selection?.from !== editor.state.selection?.to || editor.state.selection?.from !== null;

      editor.chain().focus().setImage({src: url}).run();

      if (!hasSelection) {
        editor.chain().setTextSelection(editor.state.doc.content.size).setImage({src: url}).run();
      }
    };
  }, [editor]);

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
      setHtmlValue(value);
    }
  }, [value, editor]);

  useEffect(() => {
    if (!editor) return;

    const handler = () => {
      setEditorState(editor.getJSON());
    };

    editor.on("selectionUpdate", handler);
    editor.on("transaction", handler);

    return () => {
      editor.off("selectionUpdate", handler);
      editor.off("transaction", handler);
    };
  }, [editor]);

  useEffect(() => {
    if (editor && showHtml) {
      setHtmlValue(editor.getHTML());
    }
  }, [showHtml, editor]);

  if (!editor) return null;

  return (
    <div className="editor-wrapper">
      <div className="editor-container">
        <div className="editor-main">
          <div className="toolbar">
            <button onClick={() => setShowHtml(v => !v)}
                    className={showHtml ? "active" : ""}><TbHtml/></button>

            {showHtml ? <>
                <button onClick={() => runAction("editor.action.formatDocument")}><TbCode/></button>
                <button onClick={() => runAction("actions.find")}><TbSearch/></button>
                <button onClick={() => editorRef.current?.trigger("keyboard", "undo")}><TbArrowBackUp/>
                </button>
                <button onClick={() => editorRef.current?.trigger("keyboard", "redo")}><TbArrowForwardUp/>
                </button>
                <button style={{marginLeft: 'auto'}} onClick={() => onCopy(htmlValue)}><TbCopy/></button>
              </> :
              <>
                <select
                  id="editor-font-size"
                  className="editor-select"
                  onChange={(e) =>
                    editor.chain().focus().setFontSize(e.target.value).run()
                  }
                >
                  <option value="12px">12</option>
                  <option value="14px">14</option>
                  <option value="16px">16</option>
                  <option value="20px">20</option>
                  <option value="24px">24</option>
                  <option value="32px">32</option>
                </select>

                <input
                  className="editor-color"
                  type="color"
                  onInput={(e) =>
                    editor.chain().focus().setColor(e.target.value).run()
                  }
                />
                <button onClick={() => editor.chain().focus().toggleHighlight().run()}><TbHighlight/></button>
                <button onClick={() => editor.chain().focus().toggleBold().run()}
                        className={editor.isActive("bold") ? "active" : ""}><TbBold/></button>
                <button onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={editor.isActive("italic") ? "active" : ""}><TbItalic/></button>
                <button onClick={() => editor.chain().focus().toggleUnderline().run()}
                        className={editor.isActive("underline") ? "active" : ""}><TbUnderline/></button>
                <button onClick={() => editor.chain().focus().toggleStrike().run()}
                        className={editor.isActive("strike") ? "active" : ""}><TbStrikethrough/></button>
                <button onClick={() => editor.chain().focus().toggleHeading({level: 1}).run()}
                        className={editor.isActive("heading", {level: 1}) ? "active" : ""}><TbH1/></button>
                <button onClick={() => editor.chain().focus().toggleHeading({level: 2}).run()}
                        className={editor.isActive("heading", {level: 2}) ? "active" : ""}><TbH2/></button>
                <button onClick={() => editor.chain().focus().toggleHeading({level: 3}).run()}
                        className={editor.isActive("heading", {level: 3}) ? "active" : ""}><TbH3/></button>
                <button onClick={() => editor.chain().focus().toggleHeading({level: 4}).run()}
                        className={editor.isActive("heading", {level: 4}) ? "active" : ""}><TbH4/></button>
                <button onClick={() => editor.chain().focus().toggleHeading({level: 5}).run()}
                        className={editor.isActive("heading", {level: 5}) ? "active" : ""}><TbH5/></button>
                <button onClick={() => editor.chain().focus().toggleHeading({level: 6}).run()}
                        className={editor.isActive("heading", {level: 6}) ? "active" : ""}><TbH6/></button>
                <button onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={editor.isActive("bulletList") ? "active" : ""}><TbList/></button>
                <button onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={editor.isActive("orderedList") ? "active" : ""}><TbListNumbers/></button>
                <button onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        className={editor.isActive("blockquote") ? "active" : ""}><TbBlockquote/></button>
                <button onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        className={editor.isActive("codeBlock") ? "active" : ""}><TbCode/></button>
                <button onClick={() => editor.chain().focus().setTextAlign("left").run()}
                        className={editor.isActive({textAlign: "left"}) ? "active" : ""}><TbAlignLeft/></button>
                <button onClick={() => editor.chain().focus().setTextAlign("center").run()}
                        className={editor.isActive({textAlign: "center"}) ? "active" : ""}><TbAlignCenter/></button>
                <button onClick={() => editor.chain().focus().setTextAlign("right").run()}
                        className={editor.isActive({textAlign: "right"}) ? "active" : ""}><TbAlignRight/></button>
                <button onClick={() => editor.chain().focus().setTextAlign("justify").run()}
                        className={editor.isActive({textAlign: "justify"}) ? "active" : ""}><TbAlignJustified/>
                </button>

                {DEV_MODE ? <button onClick={addImage}><TbPhotoUp/></button> :
                  <>
                    <button onClick={openImagePopup}><TbPhoto/></button>

                    {showImagePopup && (
                      <PopupImageInsert
                        editor={editor}
                        onClose={() => setShowImagePopup(false)}
                      />
                    )}
                  </>
                }

                <button onClick={addLink}><TbLink/></button>
                <button onClick={() => editor.chain().focus().unsetLink().run()}><TbUnlink/></button>
                <button onClick={() => editor.chain().focus().undo().run()}><TbArrowBackUp/></button>
                <button onClick={() => editor.chain().focus().redo().run()}><TbArrowForwardUp/></button>
                <button style={{marginLeft: 'auto'}} onClick={handleCopy}><TbCopy/></button>
              </>
            }
            {DEV_MODE ? <button onClick={() => onSave()}><TbDeviceFloppy/></button> : null}
          </div>

          {showHtml ? <div style={{minHeight: '516px'}}>
              <Editor height={height}
                      defaultLanguage="html"
                      value={htmlValue}
                      defaultValue={""}
                      beforeMount={handleEditorBeforeMount}
                      onMount={handleEditorMount}
                      onChange={handleHtmlChange}
                      onValidate={handleEditorValidation}
                      options={{
                        minimap: {enabled: false},
                        scrollbar: {
                          useShadows: false,
                          alwaysConsumeMouseWheel: false,
                          verticalHasArrows: true,
                          horizontalHasArrows: true,
                          //vertical: 'hidden',
                          //horizontal: 'hidden',
                          verticalScrollbarSize: 8,
                          horizontalScrollbarSize: 8
                        },
                        fontSize: 14,
                        wordWrap: "on",
                        automaticLayout: true,
                        scrollBeyondLastLine: false
                      }}/>
            </div> :
            <EditorContent style={{minHeight: '516px'}} editor={editor}/>
          }
        </div>

        {showHtml ? null : <ImageSidebar editor={editor}/>}
      </div>
    </div>
  )
    ;
}
