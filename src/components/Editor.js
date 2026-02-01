import React, {useCallback, useEffect} from "react";
import {EditorContent, useEditor} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
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

import {
  TbDeviceFloppy,
  TbBold,
  TbItalic,
  TbUnderline,
  TbStrikethrough,
  TbCode,
  TbH1,
  TbH2,
  TbH3,
  TbH4,
  TbH5,
  TbH6,
  TbList,
  TbListNumbers,
  TbBlockquote,
  TbAlignLeft,
  TbAlignCenter,
  TbAlignRight,
  TbAlignJustified,
  TbPhoto,
  TbLink,
  TbUnlink,
  TbHighlight,
  TbArrowBackUp,
  TbArrowForwardUp
} from "react-icons/tb";

import {api} from "../api";

import "./editor.css";

export default function TipTapEditor({value, onChange, onSave}) {
  const uploadImageToStrapi = async (file) => {
    const formData = new FormData();
    formData.append("files", file);

    try {
      const res = await api.post("/upload", formData);
      console.log("UPLOAD SUCCESS:", res.data);

      return process.env.REACT_APP_API_URL + res.data[0].url;
    } catch (err) {
      console.error("UPLOAD ERROR:", err.response?.data || err);
      throw err;
    }
  };

  const editor = useEditor({
    content: value,
    extensions: [
      StarterKit,
      DivBlock,
      SlashCommands,
      Image.configure({
        inline: true,
        allowBase64: true
      }),
      Link.configure({
        openOnClick: false
      }),
      TextStyle,
      Color,
      Highlight,
      EditorFontSize,
      EditorImage,
      TextAlign.configure({
        types: ["heading", "paragraph", "image"]
      }),
      Placeholder.configure({
        placeholder: "New article..."
      })
    ],
    onUpdate({editor}) {
      onChange(editor.getHTML());
    }
  });

  const addLink = () => {
    const url = prompt("Введите URL");
    if (!url) return;
    editor.chain().focus().setLink({href: url}).run();
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
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="editor-wrapper">
      <div className="editor-container">
        <div className="editor-main">
          <div className="toolbar">
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

            <button onClick={() => editor.chain().focus().toggleHighlight().run()}>
              <TbHighlight></TbHighlight>
            </button>

            <button onClick={() => editor.chain().focus().toggleBold().run()}
                    className={editor.isActive("bold") ? "active" : ""}>
              <TbBold/>
            </button>

            <button onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={editor.isActive("italic") ? "active" : ""}>
              <TbItalic/>
            </button>

            <button onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={editor.isActive("underline") ? "active" : ""}>
              <TbUnderline/>
            </button>

            <button onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={editor.isActive("strike") ? "active" : ""}>
              <TbStrikethrough/>
            </button>

            {/* Заголовки */}
            <button onClick={() => editor.chain().focus().toggleHeading({level: 1}).run()}
                    className={editor.isActive("heading", {level: 1}) ? "active" : ""}>
              <TbH1/>
            </button>

            <button onClick={() => editor.chain().focus().toggleHeading({level: 2}).run()}
                    className={editor.isActive("heading", {level: 2}) ? "active" : ""}>
              <TbH2/>
            </button>

            <button onClick={() => editor.chain().focus().toggleHeading({level: 3}).run()}
                    className={editor.isActive("heading", {level: 3}) ? "active" : ""}>
              <TbH3/>
            </button>

            <button onClick={() => editor.chain().focus().toggleHeading({level: 4}).run()}
                    className={editor.isActive("heading", {level: 4}) ? "active" : ""}>
              <TbH4/>
            </button>

            <button onClick={() => editor.chain().focus().toggleHeading({level: 5}).run()}
                    className={editor.isActive("heading", {level: 5}) ? "active" : ""}>
              <TbH5/>
            </button>

            <button onClick={() => editor.chain().focus().toggleHeading({level: 6}).run()}
                    className={editor.isActive("heading", {level: 6}) ? "active" : ""}>
              <TbH6/>
            </button>

            {/* Списки */}
            <button onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={editor.isActive("bulletList") ? "active" : ""}>
              <TbList/>
            </button>

            <button onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={editor.isActive("orderedList") ? "active" : ""}>
              <TbListNumbers/>
            </button>

            {/* Цитата */}
            <button onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={editor.isActive("blockquote") ? "active" : ""}>
              <TbBlockquote/>
            </button>

            {/* Код */}
            <button onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={editor.isActive("codeBlock") ? "active" : ""}>
              <TbCode/>
            </button>

            {/* Выравнивание */}
            <button onClick={() => editor.chain().focus().setTextAlign("left").run()}
                    className={editor.isActive({textAlign: "left"}) ? "active" : ""}>
              <TbAlignLeft/>
            </button>

            <button onClick={() => editor.chain().focus().setTextAlign("center").run()}
                    className={editor.isActive({textAlign: "center"}) ? "active" : ""}>
              <TbAlignCenter/>
            </button>

            <button onClick={() => editor.chain().focus().setTextAlign("right").run()}
                    className={editor.isActive({textAlign: "right"}) ? "active" : ""}>
              <TbAlignRight/>
            </button>

            <button onClick={() => editor.chain().focus().setTextAlign("justify").run()}
                    className={editor.isActive({textAlign: "justify"}) ? "active" : ""}>
              <TbAlignJustified/>
            </button>

            {/* Картинка */}
            <button onClick={addImage}>
              <TbPhoto/>
            </button>

            {/* Ссылки */}
            <button onClick={addLink}>
              <TbLink/>
            </button>

            <button onClick={() => editor.chain().focus().unsetLink().run()}>
              <TbUnlink/>
            </button>

            {/* Undo / Redo */}
            <button onClick={() => editor.chain().focus().undo().run()}>
              <TbArrowBackUp/>
            </button>

            <button onClick={() => editor.chain().focus().redo().run()}>
              <TbArrowForwardUp/>
            </button>

            <button style={{marginLeft: 'auto'}} onClick={() => onSave()}>
              <TbDeviceFloppy/>
            </button>
          </div>
          <EditorContent editor={editor}/>
        </div>
        <ImageSidebar editor={editor}/>
      </div>
    </div>
  );
}
