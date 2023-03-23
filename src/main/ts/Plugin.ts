import { AstNode, Editor, TinyMCE, Ui } from 'tinymce';
// @ts-ignore
// import varsubIcon from '../assets/varsub.svg?source'
import { varsubIcon } from './varsubIcon'

declare const tinymce: TinyMCE;

type MenuItem = Ui.Menu.MenuItemSpec

type NestedMenuItem = Ui.Menu.NestedMenuItemSpec

export const DEFAULTS = {
  start: "{{",
  end: "}}",
}

function optionValidator(value: Root): boolean | { value: Root; message: string } {
  if (!value.start) {
    value.start = DEFAULTS.start;
  }
  if (!value.end) {
    value.end = DEFAULTS.end;
  }
  return true;
}

function getExample(example: any | any[]) {
  if (Array.isArray(example)) {
    return example[Math.floor(Math.random() * example.length)];
  }
  return example;

}

const setup = (editor: Editor, url: string): void => {
  if (!editor.options.isRegistered("varsub")) {
    editor.options.register('varsub', {
      // @ts-ignore
      processor: optionValidator,
      immutable: true,
      default: DEFAULTS,
    });
  }

  const varsubOptions: Root = editor.options.get("varsub");

  if (!varsubOptions?.variables?.length) {
    return
  }

  //To add a simple triangle icon:
  editor.ui.registry.addIcon('varsub', varsubIcon);

  const buildMenu = (items: Item[], options: { withSeparator?: boolean } = {}): (MenuItem | NestedMenuItem)[] => {
    const menu: (MenuItem | NestedMenuItem)[] = [];

    for (const item of items) {
      if (isSeparator(item)) {
        if (options.withSeparator) {
          menu.push({
            type: "menuitem",
            text: "-—-".repeat(5),
            enabled: false,
          });
        }
        continue;
      }

      let menuItem: MenuItem | NestedMenuItem = {
        type: 'menuitem',
        text: item.label || item.code as string,
        onAction: () => {
          const varNode = createVarNode(item.code, getExample(item.example));
          const serialized = serializeNodeToString(varNode);
          console.log(serialized)
          editor.insertContent(serialized);
        },
        enabled: true,
      };

      if (hasSubItems(item)) {
        menuItem = {
          ...menuItem,
          type: "nestedmenuitem",
          getSubmenuItems: () => buildMenu(item.items),
        }
      }

      menu.push(menuItem);
    }

    return menu;
  }

  const search = (pattern: string, items: Item[]): Item[] => {
    const filteredItems = [];
    for (const item of items) {
      if (isSeparator(item)) {
        continue;
      }

      if (hasSubItems(item)) {
        const subItems = search(pattern, item.items);
        if (subItems.length > 0) {
          filteredItems.push({
            ...item,
            items: subItems,
          })
        }
        continue;
      }

      if (
        (item as NonSeparatorItem).code?.toLowerCase?.()?.includes(pattern) ||
        (item as NonSeparatorItem).label?.toLowerCase?.()?.includes(pattern) ||
        String((item as NonSeparatorItem).example)?.toLowerCase?.()?.includes(pattern)
      ) {
        filteredItems.push(item);
        continue;
      }
    }
    return filteredItems;
  }

  const createVarNode = (varVal: string, example?: any) => {
    // <span class="varsub" data-varsub="1" contenteditorable="false" data-mce-cef-wrappable="true">
    // </span>
    const varWrapperNode = tinymce.html.Node.create("span", {
      class: "varsub",
      contenteditable: "false",
      "data-mce-cef-wrappable": "true",
      "data-varsub": "1",
      "data-varsub-example": String(example) || "",
    });

    //   <span data-varsub-start="{{" class="varsub-start">
    //   </span>
    const varStartNode = tinymce.html.Node.create("span", {
      class: "varsub-start",
      "data-varsub-start": varsubOptions.start,
    });

    // <span data-varsub-start="{{" class="varsub-start">{{</span>
    const varStartTextNode = tinymce.html.Node.create("#text")
    varStartTextNode.value = varsubOptions.start
    varStartNode.append(varStartTextNode)

    // <span data-varsub-end="}}" class="varsub-end">
    // </span>
    const varEndNode = tinymce.html.Node.create("span", {
      class: "varsub-end",
      "data-varsub-end": varsubOptions.end,
    })

    // <span data-varsub-end="}}" class="varsub-end">}}</span>
    const varEndTextNode = tinymce.html.Node.create("#text")
    varEndTextNode.value = varsubOptions.end
    varEndNode.append(varEndTextNode)

    // <span data-varsub-var="variableValue">varsub</span>
    const varNode = tinymce.html.Node.create("span", {
      class: "varsub-var",
      "data-varsub-var": varVal,
      "data-varsub-example": String(example) || "",
    })

    // <span data-varsub-var="variableValue">variableValue</span>
    const varTextNode = tinymce.html.Node.create("#text")
    varTextNode.value = varVal
    varNode.append(varTextNode)

    // <span class="varsub" data-varsub="1" contenteditorable="false" data-mce-cef-wrappable="true">
    //   <span data-varsub-start="{{" class="varsub-start">{{</span>
    //   <span data-varsub-var="variableValue">variableValue</span>
    //   <span data-varsub-end="}}" class="varsub-end">}}</span>
    // </span>

    varWrapperNode.append(varStartNode)
    varWrapperNode.append(varNode)
    varWrapperNode.append(varEndNode)

    return varWrapperNode;
  };

  const serializeNodeToString = (node: AstNode) => tinymce.html.Serializer().serialize(node);

  // Add a menu item to the insert menu
  editor.ui.registry.addMenuButton('varsub', {
    // text: 'Insert Variable',
    icon: 'varsub',
    tooltip: 'Insert Variable',
    search: {
      placeholder: "Filter variables",
    },
    fetch(cb, ctx) {
      if (!ctx.pattern) {
        cb(buildMenu(varsubOptions.variables, { withSeparator: true }))
        return;
      }

      const filteredItems = search(ctx.pattern, varsubOptions.variables)
      // This is a callback function can run when a search is made
      // that will be called when the menu is opened
      // It should be called with a list of menu items
      if (filteredItems.length === 0) {
        cb([{
          type: "menuitem",
          text: "No results",
          enabled: false,
        }])
        return;
      }
      cb(buildMenu(filteredItems))
    }
  });
};

export default (): void => {
  tinymce.PluginManager.add('varsub', setup);
};

export const SEPARATOR = Symbol("separator");

export function NewSeparator(label: string): SeparatorItem {
  return {
    code: SEPARATOR,
    label,
  };
}

export interface RawEditorOptions {
  varsub?: Root;
}

export interface Root {
  start?: string;
  end?: string;
  variables: Item[];
}

type ExampleValue = string | number | boolean

interface WithExample {
  example: ExampleValue | ExampleValue[];
}

interface WithLabel {
  label: string;
}

interface WithCode {
  code: string;
}

interface WithCodeSeparator {
  code: typeof SEPARATOR
}

type WithCodeLabelExample = (WithCode & Partial<WithLabel> & Partial<WithExample>)

interface WithItems {
  items: Item[];
}

type SeparatorItem = WithCodeSeparator & Partial<WithLabel>

type NonSeparatorItem = (Partial<WithItems> & WithCodeLabelExample)

export type Item = typeof SEPARATOR | "SEPARATOR" | SeparatorItem | NonSeparatorItem;

function isSeparator(item: Item): item is SeparatorItem | typeof SEPARATOR | "SEPARATOR" {
  return (item === SEPARATOR || item === "SEPARATOR" || String(item) === String(SEPARATOR)) ||
    item.code === SEPARATOR || String(item.code) === String(SEPARATOR) || item.code === "SEPARATOR";
}

function hasSubItems(item: Item): item is NonSeparatorItem {
  return typeof (item as WithItems).items !== "undefined";
}

// ------------------------------

const item: Item = {
  code: "Secondary Email",
  example: "secondaryEmail@example.com",
  items: [
    {
      example: 1,
      code: ".Number"
    },
    SEPARATOR,
    {
      code: ".FirstName",
      label: "First Name",
      example: ["Abhisek", "Ashik"]
    },
    {
      code: SEPARATOR,
      label: "First Name",
    },
  ],
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const response: Root = {
  start: "{{",
  end: "}}",
  variables: [
    item,
  ],
};