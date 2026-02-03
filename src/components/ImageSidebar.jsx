import React from "react";
import {TbAlignCenter, TbAlignLeft, TbAlignRight} from "react-icons/tb";

export default function ImageSidebar({editor}) {
  const node = editor?.state?.selection?.node;

  if (!node || node.type.name !== "image") return null;

  const attrs = node.attrs;

  const update = (key, value) => {
    const pos = editor.state.selection.from;

    editor.chain().updateAttributes("image", {[key]: value}).run();

    editor.commands.setNodeSelection(pos);
    //editor.chain().focus().updateAttributes("image", {[key]: value}).setNodeSelection(pos).run();
  };

  return (
    <div className="image-sidebar">
      <div className="image-sidebar-row">
        <h3>Image settings</h3>
        <div className="float-buttons">
          <button onClick={() => update("class", "float-left")}>
            <TbAlignLeft></TbAlignLeft>
          </button>
          <button onClick={() => update("class", "center")}>
            <TbAlignCenter></TbAlignCenter>
          </button>
          <button onClick={() => update("class", "float-right")}>
            <TbAlignRight></TbAlignRight>
          </button>
        </div>
      </div>

      <div className="image-sidebar-row">
        <div className="image-sidebar-cell">
          <label>Width</label>
          <input
            type="text"
            value={attrs.width || ""}
            onChange={e => update("width", e.target.value)}
          />
        </div>

        <div className="image-sidebar-cell">
          <label>CSS Class</label>
          <input
            type="text"
            value={attrs.class || ""}
            onChange={e => update("class", e.target.value)}
          />
        </div>

        <div className="image-sidebar-cell">
          <label>Style</label>
          <input
            type="text"
            value={attrs.style || ""}
            onChange={e => update("style", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
