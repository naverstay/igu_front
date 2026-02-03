import Image from "@tiptap/extension-image";

export const EditorImage = Image.configure({
  inline: true,
  allowBase64: true
}).extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: "auto",
        parseHTML: el => el.getAttribute("width") || "auto",
        renderHTML: attrs => ({width: attrs.width})
      },
      class: {
        default: null,
        parseHTML: el => el.getAttribute("class"),
        renderHTML: attrs => attrs.class ? {class: attrs.class} : {}
      },
      style: {
        default: null,
        parseHTML: el => el.getAttribute("style"),
        renderHTML: attrs => attrs.style ? {style: attrs.style} : {}
      }
    };
  },
  addNodeView() {
    return ({node, editor, getPos}) => {
      const wrapper = document.createElement("div");
      wrapper.style.position = "relative";
      wrapper.style.display = "inline-block";
      const img = document.createElement("img");
      img.src = node.attrs.src;
      img.style.width = node.attrs.width || "auto";
      img.className = node.attrs.class || "";
      if (node.attrs.style) img.setAttribute("style", node.attrs.style);
      const handle = document.createElement("div");
      handle.className = "editor-image-resizer";

      let startX, startWidth;
      handle.addEventListener("mousedown", e => {
        e.preventDefault();
        startX = e.clientX;
        startWidth = img.offsetWidth;
        const onMove = e => {
          const newWidth = startWidth + (e.clientX - startX);
          img.style.width = newWidth + "px";
          editor.commands.updateAttributes("image", {width: newWidth + "px"});
        };
        const onUp = () => {
          document.removeEventListener("mousemove", onMove);
          document.removeEventListener("mouseup", onUp);
        };
        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
      });
      wrapper.appendChild(img);
      wrapper.appendChild(handle);

      //wrapper.addEventListener("click", event => {
      //  event.preventDefault();
      //  event.stopPropagation();
      //
      //  const pos = getPos();
      //  editor.commands.setNodeSelection(pos);
      //});

      return {
        dom: wrapper,
        update: updatedNode => {
          if (updatedNode.type.name !== "image") return false;
          img.src = updatedNode.attrs.src;
          img.style.width = updatedNode.attrs.width;
          return true;
        }
      };
    };
  }
});
