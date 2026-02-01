import {Node, mergeAttributes} from "@tiptap/core";

export const DivBlock = Node.create({
  name: "divBlock",
  group: "block",
  content: "block+",

  addAttributes() {
    return {
      class: {
        default: null,
        parseHTML: el => el.getAttribute("class"),
        renderHTML: attrs => attrs.class ? { class: attrs.class } : {},
      },
    };
  },

  parseHTML() {
    return [{ tag: "div" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes), 0];
  },
});
