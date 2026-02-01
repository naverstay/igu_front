import {mergeAttributes} from "@tiptap/core";
import Image from "@tiptap/extension-image";

export const EditorImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),

      class: {
        default: null,
        parseHTML: element => element.getAttribute("class"),
        renderHTML: attributes => {
          if (!attributes.class) return {};
          return {class: attributes.class};
        }
      },

      width: {
        default: null,
        parseHTML: element => element.getAttribute("width"),
        renderHTML: attributes => {
          if (!attributes.width) return {};
          return {width: attributes.width};
        }
      },

      height: {
        default: null,
        parseHTML: element => element.getAttribute("height"),
        renderHTML: attributes => {
          if (!attributes.height) return {};
          return {height: attributes.height};
        }
      },

      style: {
        default: null,
        parseHTML: element => element.getAttribute("style"),
        renderHTML: attributes => {
          if (!attributes.style) return {};
          return {style: attributes.style};
        }
      }
    };
  }
});
