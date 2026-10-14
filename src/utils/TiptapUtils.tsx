import { ITiptapJson } from '../editor';
import { directoryRankOf } from '../extensions/lawLevel';
import TiptapRender, { IRenderConfig } from './TiptapRender';

// 定义段落的数组，也就是占一行的类型有哪些
export const paragraphTypes = [
  'paragraph',
  'ATitle',
  'ATail',
  'AWenHao',
  'heading',
  'codeBlock',
  'horizontalRule',
  'hardBreak',
  'blockquote',
  'bulletList',
  'orderedList',
  'taskList',
  'table',
  'image',
  'file'
];

// 渲染的对象池
let renderPool: TiptapRender | null = null;

// 将json数据转成dom
export const jsonToDom = (json: ITiptapJson, config?: IRenderConfig) => {
  if (renderPool) {
    renderPool.setJson(json);
    renderPool.setConfig(config);
  } else {
    renderPool = new TiptapRender(json, config);
  }
  return renderPool.render();
};

// 从blockJson中获取标题，挂到条为止。款、项、目不进目录。
export const generateDirectoryTree = (jsonData: ITiptapJson): any[] => {
  if (!jsonData?.content) {
    return [];
  }
  const directoryTree: any[] = [];
  const stack: Array<{ rank: number; node: any }> = [];
  let key = 1;

  jsonData.content.forEach(item => {
    if (item.type !== 'ATitle' && item.type !== 'heading') {
      return;
    }
    const rank = directoryRankOf(item.attrs?.lawLevel, item.attrs?.level);
    if (rank === null || rank === undefined) {
      return;
    }
    const title = blockText(item);
    if (!title) {
      return;
    }
    const node: any = {
      title,
      label: title,
      key: `${key}`,
      value: `${key}`,
      isLeaf: true,
      children: [],
      pcode: '-1'
    };
    key += 1;
    while (stack.length > 0 && stack[stack.length - 1].rank >= rank) {
      stack.pop();
    }
    const parent = stack[stack.length - 1];
    if (parent) {
      node.pcode = parent.node.value;
      parent.node.isLeaf = false;
      parent.node.children.push(node);
    } else {
      directoryTree.push(node);
    }
    if (rank < 7) {
      stack.push({ rank, node });
    }
  });
  return directoryTree;
};

function blockText(item: { content?: Array<{ text?: string }> }) {
  return (item.content || [])
    .map(child => child.text || '')
    .join('')
    .trim();
}
