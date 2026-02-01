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

import {
  AiOutlineBold,
  AiOutlineItalic,
  AiOutlineUnderline,
  AiOutlineStrikethrough,
  AiOutlineOrderedList,
  AiOutlineUnorderedList,
  AiOutlinePicture,
  AiOutlineLink,
  AiOutlineUndo,
  AiOutlineRedo
} from "react-icons/ai";
import {
  BiCode,
  BiParagraph,
  BiImageAdd,
  BiAlignLeft,
  BiAlignRight,
  BiAlignMiddle,
  BiAlignJustify
} from "react-icons/bi";
import {FaHeading, FaQuoteLeft, FaListOl, FaListUl, FaHighlighter} from "react-icons/fa";
import {
  MdFormatBold,
  MdFormatItalic,
  MdFormatUnderlined,
  MdFormatStrikethrough,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdFormatQuote,
  MdFormatAlignLeft,
  MdFormatAlignRight,
  MdFormatAlignCenter,
  MdFormatAlignJustify,
  MdImage,
  MdLink,
  MdUndo,
  MdRedo
} from "react-icons/md";
import {RiCodeBoxLine, RiSeparator, RiText, RiImageAddFill} from "react-icons/ri";

import {
  TbBold,
  TbItalic,
  TbUnderline,
  TbStrikethrough,
  TbCode,
  TbH1,
  TbH2,
  TbH3,
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
  TbArrowBackUp,
  TbArrowForwardUp
} from "react-icons/tb";

import {api} from "../api";

import "./editor.css";

export default function TipTapEditor({value, onChange, token}) {
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
      <div className="toolbar">
        <button onClick={() => editor.chain().focus().toggleBold().run()}>
          <MdFormatBold></MdFormatBold>
        </button>

        <button onClick={() => editor.chain().focus().toggleItalic().run()}>
          <MdFormatItalic></MdFormatItalic>
        </button>

        <button onClick={() => editor.chain().focus().toggleHighlight().run()}>
          <FaHighlighter></FaHighlighter>
        </button>

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

        <button onClick={addImage}>
          <BiImageAdd></BiImageAdd>
        </button>

        <button onClick={() => editor.chain().focus().setTextAlign("left").run()}>
          <BiAlignLeft></BiAlignLeft>
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <BiAlignMiddle></BiAlignMiddle>
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <BiAlignRight></BiAlignRight>
        </button>
      </div>

      <EditorContent editor={editor}/>
    </div>
  );
}
