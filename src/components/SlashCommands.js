import {Extension} from "@tiptap/core";
import Suggestion from "@tiptap/suggestion";

export const SlashCommands = Extension.create({
  name: "slashCommands",

  addOptions() {
    return {
      suggestion: {
        char: "/",
        command: ({editor, range, props}) => {
          if (props.type === "class") {
            editor
              .chain()
              .focus()
              .deleteRange(range)
              .insertContent({
                type: "divBlock",
                attrs: {class: props.value},
                content: [{type: "paragraph"}]
              })
              .run();
          }
        }
      }
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,

        items: ({query}) => {
          if (query.startsWith('class="')) {
            const value = query.replace('class="', "").replace('"', "");
            return [
              {
                title: `Press TAB to create div.${value}`,
                type: "class",
                value
              }
            ];
          }
          return [];
        },

        render: (dom, props) => ({
          onStart: e => {
            dom = document.createElement("div");
            dom.className = "slash-menu";
            dom.id = "slash-menu";
            dom.textContent = e.items[0]?.title || "";

            props = {
              type: "class",
              value: e.items[0]?.value ?? ""
            }
            document.body.appendChild(dom);
          },
          onUpdate: e => {
            dom.textContent = e.items[0]?.title || "";
            props.value = e.items[0]?.value ?? "";
          },
          onExit() {
            document.getElementById("slash-menu")?.remove();
          },
          onKeyDown: ({event, ...rest}) => {
            if (event.key === "Tab") {
              event.preventDefault();

              this.options.suggestion.command({
                editor: this.editor,
                range: rest.range,
                props
              });

              return true;
            }

            return false;
          }
        })
      })
    ];
  }
});
