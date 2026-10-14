import { isMarkActive, isNodeActive } from '@tiptap/core';
import { LAW_MARKS, lawMarkByClass, lawMarkOf } from '../extensions/lawLevel';

export const isInCode = (state: any): boolean => {
  return (
    (state.schema.nodes.codeBlock && isNodeActive(state, 'codeBlock')) ||
    (state.schema.marks.code && isMarkActive(state, 'code'))
  );
};

export const isMarkdown = (text: string): boolean => {
  // code-block-ish
  const fences = text.match(/^```/gm);
  if (fences && fences.length > 1) return true;

  // link-ish
  if (text.match(/\[[^]+]\(https?:\/\/\S+\)/gm)) return true;
  if (text.match(/\[[^]+]\(\/\S+\)/gm)) return true;

  // heading-ish
  if (text.match(/^#{1,6}\s+\S+/gm)) return true;

  // 法条层级：!卷 / !分编 / !章
  if (text.match(/^!(?:分编|[卷部编章节条款项目])\s+\S+/gm)) return true;

  // 旧写法：!! 章、!!! 节，以及 ! 大标题
  if (text.match(/^!{1,3}\s+\S+/gm)) return true;

  // tail
  if (text.match(/^!-\s+\S+$/gm)) return true;

  // wenhao
  if (text.match(/^!~\s+\S+$/gm)) return true;

  // list-ish
  const listItems = text.match(/^\s*[\d-*]\s+\S+/gm);
  if (listItems && listItems.length > 1) return true;

  // task-list-ish
  const taskListItems = text.match(/^\s*[-*]\s\[[ xX]\]\s+\S+/gm);
  if (taskListItems && taskListItems.length > 1) return true;

  // blockquote-ish
  if (text.match(/^>\s+\S+/gm)) return true;

  // hr-ish
  if (text.match(/^---/gm)) return true;

  // image-ish
  if (text.match(/^!\[[^]+]\(https?:\/\/\S+\)/gm)) return true;

  // table-ish
  if (text.match(/^\|.*\|$/gm)) return true;

  // strong-ish
  if (text.match(/\*\*[^]+?\*\*/gm)) return true;

  // em-ish
  if (text.match(/_[^]+?_/gm)) return true;

  // strikethrough-ish
  if (text.match(/~~[^]+?~~/gm)) return true;

  // inline code-ish
  if (text.match(/`[^]+?`/gm)) return true;

  return false;
};

// 自定义的一些html标签转md
export const aHeadingHtmlToMd = (htmlString: string) => {
  const regex = /<div class="a-tiptap-title(\d)">([\s\S]*?)<\/div>/g;
  const matches = htmlString.matchAll(regex);
  let result = htmlString;

  for (const match of matches) {
    const level = parseInt(match[1]);
    const text = match[2].trim();
    let heading = `${'!'.repeat(level)} ${text}`;
    if (level === 2) {
      heading = `!章 ${text}`;
    } else if (level === 3) {
      heading = `!节 ${text}`;
    }
    result = result.replace(match[0], heading);
  }

  return result;
};

// 处理wenhao的html
export const aWenHaoHtmlToMd = (htmlString: string) => {
  const regex = /<div class="a-tiptap-wenhao">([\s\S]*?)<\/div>/g;
  const matches = htmlString.matchAll(regex);
  let result = htmlString;

  for (const match of matches) {
    const level = match[1].trim().length;
    const text = match[1].trim();
    const heading = `${'!~'.repeat(level > 1 ? 1 : level)} ${text}`;
    result = result.replace(match[0], heading);
  }
  return result;
};

// 处理 a-tiptap-tail 的html
export const aTailHtmlToMd = (htmlString: string) => {
  const regex = /<div class="a-tiptap-tail">([\s\S]*?)<\/div>/g;
  const matches = htmlString.matchAll(regex);
  let result = htmlString;

  for (const match of matches) {
    const text = match[1].trim();
    const heading = `!- ${text}`;
    result = result.replace(match[0], heading);
  }
  return result;
};

const lawMarksByLength = [...LAW_MARKS].sort((left, right) => right.md.length - left.md.length);

/** 法条层级 HTML 导出为 !卷 / !章。属性顺序不固定。 */
export const aLawHtmlToMd = (htmlString: string) => {
  const regex = /<div\b([^>]*)>([\s\S]*?)<\/div>/g;
  let result = htmlString;
  for (const match of htmlString.matchAll(regex)) {
    const attrs = match[1];
    const lawLevel = readHtmlAttr(attrs, 'data-law-level');
    const className = readHtmlAttr(attrs, 'class')
      .split(/\s+/)
      .find(name => lawMarkByClass(name));
    const mark = lawMarkOf(lawLevel) || lawMarkByClass(className);
    if (!mark) {
      continue;
    }
    result = result.replace(match[0], `${mark.md} ${match[2].trim()}`);
  }
  return result;
};

function readHtmlAttr(source: string, name: string) {
  const found = source.match(new RegExp(`${name}="([^"]*)"`));
  return found ? found[1] : '';
}

/** 将 !卷 / !章 转成法条层级节点。分编先于编。 */
export const mdLawToHtml = (mdString: string) => {
  let result = mdString;
  for (const mark of lawMarksByLength) {
    const regex = new RegExp(
      `^${mark.md.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}\\s+(.*)$`,
      'gm'
    );
    result = result.replace(regex, (_full, text: string) => {
      return `<div class="${mark.className}" data-law-level="${mark.lawLevel}">${text.trim()}</div>`;
    });
  }
  return result;
};

// 将!- 转成 a-tiptap-tail
export const mdTailToHtml = (mdString: string) => {
  const regex = /^!-\s+(.*)$/gm;
  const matches = mdString.matchAll(regex);
  let result = mdString;

  for (const match of matches) {
    const text = match[1].trim();
    const heading = `<div class="a-tiptap-tail">${text}</div>`;
    result = result.replace(match[0], heading);
  }
  return result;
};

// 将!~ 转成 a-tiptap-wenhao
export const mdWenhaoToHtml = (mdString: string) => {
  const regex = /^!~\s+(.*)$/gm;
  const matches = mdString.matchAll(regex);
  let result = mdString;
  for (const match of matches) {
    const text = match[1].trim();
    const heading = `<div class="a-tiptap-wenhao">${text}</div>`;
    result = result.replace(match[0], heading);
  }
  return result;
};

// 将^(!{1,${level}})\\s$转成 a-tiptap-h${level}
export const mdTitleToHtml = (mdString: string) => {
  // Corrected regex to match Markdown headings (e.g., !! Heading 2)
  const regex = /^(!{1,3})\s+(.*)$/gm;
  let result = mdString;

  // Use matchAll to find all matches along with capturing groups
  const matches = mdString.matchAll(regex);
  for (const match of matches) {
    const hashes = match[1]; // e.g., "##"
    const level = hashes.length; // Number of '#' characters indicates the level
    const text = match[2].trim(); // The heading text after the hashes

    // Create an HTML string with a div element, using the level for the class
    const heading = `<div class="a-tiptap-title${level}">${text}</div>`;

    // Replace the original Markdown heading with the HTML string
    result = result.replace(match[0], heading);
  }

  return result;
};
