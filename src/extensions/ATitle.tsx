import { mergeAttributes, Node, textblockTypeInputRule } from '@tiptap/core';
import { LAW_MARKS, lawClassName, LawLevel } from './lawLevel';

export type Level = 1 | 2 | 3;

export type ATitleAttributes = {
  level?: Level;
  lawLevel?: LawLevel | null;
};

export interface HeadingOptions {
  levels: Level[];
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    ATitle: {
      /**
       * Set a heading node
       */
      setATitle: (attributes: ATitleAttributes) => ReturnType;
      /**
       * Toggle a heading node
       */
      toggleATitle: (attributes: ATitleAttributes) => ReturnType;
    };
  }
}

export const ATitle = Node.create<HeadingOptions>({
  name: 'ATitle',

  addOptions() {
    return {
      levels: [1, 2, 3],
      HTMLAttributes: {}
    };
  },

  content: 'inline*',

  group: 'block',

  defining: true,

  addAttributes() {
    return {
      level: {
        default: 1,
        rendered: false
      },
      lawLevel: {
        default: null,
        rendered: false
      }
    };
  },

  parseHTML() {
    const legacy = this.options.levels.map((level: Level) => ({
      tag: `div.a-tiptap-title${level}`,
      attrs: {
        level,
        lawLevel: level === 2 ? 'zhang' : level === 3 ? 'jie' : null
      }
    }));
    const lawMarks = LAW_MARKS.map(mark => ({
      tag: `div.${mark.className}`,
      attrs: { level: mark.legacyLevel, lawLevel: mark.lawLevel }
    }));
    return [...lawMarks, ...legacy];
  },

  renderHTML({ node, HTMLAttributes }) {
    const lawLevel = node.attrs.lawLevel as LawLevel | null;
    const hasLevel = this.options.levels.includes(node.attrs.level);
    const level = hasLevel ? node.attrs.level : this.options.levels[0];
    const attrs: Record<string, string> = {
      class: lawClassName(lawLevel, level)
    };
    if (lawLevel) {
      attrs['data-law-level'] = lawLevel;
    }
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, attrs), 0];
  },

  addCommands() {
    return {
      // 这个命令接受一个 attributes 参数，其包含了标题的级别（比如 h1, h2 等）。
      // 命令首先检查这个级别是否包含在允许的级别列表 this.options.levels 中。
      // 如果不包含，则返回 false 表示操作无效。
      // 如果包含，则使用 commands.setNode 方法将当前节点设置为指定的标题节点。
      setATitle:
        attributes =>
        ({ commands }) => {
          const next = resolveATitleAttributes(attributes);
          if (!next?.level || !this.options.levels.includes(next.level)) {
            return false;
          }
          return commands.setNode(this.name, next);
        },
      toggleATitle:
        attributes =>
        ({ commands }) => {
          const next = resolveATitleAttributes(attributes);
          if (!next?.level || !this.options.levels.includes(next.level)) {
            return false;
          }
          return commands.toggleNode(this.name, 'paragraph', next);
        }
    };
  },

  addInputRules() {
    const legacy = this.options.levels.map(level => {
      return textblockTypeInputRule({
        find: new RegExp(`^!{${level}}\\s$`),
        type: this.type,
        getAttributes: resolveATitleAttributes({ level }) || { level }
      });
    });
    const lawMarks = LAW_MARKS.map(mark => {
      return textblockTypeInputRule({
        find: new RegExp(`^${escapeRegExp(mark.md)}\\s$`),
        type: this.type,
        getAttributes: {
          level: mark.legacyLevel,
          lawLevel: mark.lawLevel
        }
      });
    });
    return [...lawMarks, ...legacy];
  }
});

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function resolveATitleAttributes(attributes: ATitleAttributes): ATitleAttributes | null {
  if (attributes.lawLevel) {
    const mark = LAW_MARKS.find(item => item.lawLevel === attributes.lawLevel);
    if (!mark) {
      return null;
    }
    return { level: mark.legacyLevel, lawLevel: mark.lawLevel };
  }
  if (!attributes.level) {
    return null;
  }
  if (attributes.level === 2) {
    return { level: 2, lawLevel: 'zhang' };
  }
  if (attributes.level === 3) {
    return { level: 3, lawLevel: 'jie' };
  }
  return { level: attributes.level, lawLevel: null };
}
