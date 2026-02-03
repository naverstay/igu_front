import {Node} from "@tiptap/core";

export const Figure = Node.create({
  name: "figure",
  group: "block",
  content: "block+",
  parseHTML() {
    return [{tag: "figure"}];
  },
  renderHTML({HTMLAttributes}) {
    return ["figure", HTMLAttributes, 0];
  }
});

export const Figcaption = Node.create({
  name: "figcaption",
  group: "block",
  content: "inline*",
  parseHTML() {
    return [{tag: "figcaption"}];
  },
  renderHTML({HTMLAttributes}) {
    return ["figcaption", HTMLAttributes, 0];
  }
});
