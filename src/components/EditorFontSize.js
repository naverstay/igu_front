import {Mark, mergeAttributes} from '@tiptap/core'

export const EditorFontSize = Mark.create({
  name: 'fontSize',

  addAttributes() {
    return {
      size: {
        default: null,
        parseHTML: element => element.style.fontSize,
        renderHTML: attributes => {
          if (!attributes.size) return {}
          return {style: `font-size: ${attributes.size}`}
        }
      }
    }
  },

  parseHTML() {
    return [{tag: 'span[style]'}]
  },

  renderHTML({HTMLAttributes}) {
    return ['span', mergeAttributes(HTMLAttributes), 0]
  },

  addCommands() {
    return {
      setFontSize:
        size =>
          ({chain}) =>
            chain().setMark('fontSize', {size}).run(),
      unsetFontSize:
        () =>
          ({chain}) =>
            chain().unsetMark('fontSize').run()
    }
  }
})

export default EditorFontSize;
