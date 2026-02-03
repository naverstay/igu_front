import {useState} from "react";

export function PopupImageInsert({editor, savedSelection, onClose}) {
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");
  const [caption, setCaption] = useState("");

  const insertImage = () => {
    if (!editor || !url) return;

    const imageNode = {
      type: "figure",
      content: [
        {
          type: "image",
          attrs: {src: url, alt}
        },
        {
          type: "figcaption",
          content: caption ? [{type: "text", text: caption}] : []
        }
      ]
    };

    if (savedSelection) {
      editor.commands.setTextSelection(savedSelection);
    }

    editor
      .chain()
      .focus()
      .insertContent(imageNode)
      .run();

    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "20%",
        left: "50%",
        transform: "translateX(-50%)",
        background: "white",
        padding: 20,
        borderRadius: 8,
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        width: 340,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: 12
      }}
    >
      <h3 style={{margin: 0}}>Insert image</h3>

      <input
        type="text"
        placeholder="Image URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{padding: 8, borderRadius: 6, border: "1px solid #ccc"}}
      />

      <input
        type="text"
        placeholder="Alt text"
        value={alt}
        onChange={(e) => setAlt(e.target.value)}
        style={{padding: 8, borderRadius: 6, border: "1px solid #ccc"}}
      />

      <input
        type="text"
        placeholder="Caption"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        style={{padding: 8, borderRadius: 6, border: "1px solid #ccc"}}
      />

      <button
        onClick={insertImage}
        style={{
          padding: "8px 12px",
          borderRadius: 6,
          border: "none",
          background: "#4a8ef0",
          color: "white",
          cursor: "pointer"
        }}
      >
        Insert
      </button>

      <button
        onClick={onClose}
        style={{
          padding: "6px 12px",
          borderRadius: 6,
          border: "1px solid #ccc",
          background: "#f5f5f5",
          cursor: "pointer"
        }}
      >
        Cancel
      </button>
    </div>
  );
}
