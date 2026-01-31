import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Heading from "@tiptap/extension-heading";

import "./editor.css";

export default function Editor({ value, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Heading.configure({
        levels: [1, 2],
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="editor-wrapper">
      <div className="toolbar">
        <button onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive("bold") ? "active" : ""}>
          B
        </button>

        <button onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive("italic") ? "active" : ""}>
          I
        </button>

        <button onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={editor.isActive("underline") ? "active" : ""}>
          U
        </button>

        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={editor.isActive("heading", { level: 1 }) ? "active" : ""}>
          H1
        </button>

        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={editor.isActive("heading", { level: 2 }) ? "active" : ""}>
          H2
        </button>

        <button onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive("bulletList") ? "active" : ""}>
          • List
        </button>

        <button onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={editor.isActive("orderedList") ? "active" : ""}>
          1. List
        </button>

        <button onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={editor.isActive("blockquote") ? "active" : ""}>
          ❝ Quote
        </button>

        <button onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={editor.isActive("codeBlock") ? "active" : ""}>
          {"</>"}
        </button>
      </div>

      <EditorContent editor={editor} className="editor-content" />
    </div>
  );
}
