import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import React from 'react';
import type { IContent, ITiptapJson } from '../editor';
import { PreviewableImage, toCssSize } from '../image-preview';
import '../image-preview/image-preview.css';
import '../index.css';
import { renderDefaultFileView } from '../notion-like/file/DefaultFileViews';
import { getFileKind } from '../notion-like/file/file-kind';
import '../notion-like/notion-like.css';
import { NOTION_THEME_CLASS } from '../notion-like/notion-theme';

export type ILinkRender<T = any> = (node: React.ReactNode, mark: any, params: T) => React.ReactNode;

export type FileKind = 'video' | 'audio' | 'file';

export type FileNodeInfo = {
  kind: FileKind;
  src: string;
  name: string;
  mime: string;
  size?: number | null;
};

export type FileNodeRenderProps = FileNodeInfo & {
  selected: boolean;
  defaultRender: () => React.ReactNode;
};

export type FileRenderers = {
  video?: (props: FileNodeRenderProps) => React.ReactNode;
  audio?: (props: FileNodeRenderProps) => React.ReactNode;
  file?: (props: FileNodeRenderProps) => React.ReactNode;
};

export type IRenderMode = 'normal' | 'gov' | 'custom' | 'notion';

export type IRenderConfig = {
  onLinkClick?: (p: any) => void;
  /**
   * 自定义link的渲染
   */
  linkRender?: ILinkRender;
  /**
   * 自定义高亮的渲染
   */
  textRender?: (text: string) => React.ReactNode;
  /**
   * 渲染的模式 - 普通 还是 公文 自定义 - 默认是gov
   */
  renderMode?: IRenderMode;
  /** 文件块自定义渲染（只读 JSON 渲染） */
  fileRenderers?: FileRenderers;
  /** 文件块点击 */
  onFileClick?: (info: FileNodeInfo, event: React.MouseEvent) => void;
  /**
   * 图片点击。传入则覆盖内置大图预览。
   */
  onImageClick?: (src: string, event: React.MouseEvent) => void;
  /**
   * 按节点 type 自定义只读渲染（优先于内置分支）。
   * helpers.renderContent 可递归渲染子内容。
   */
  nodeRenderers?: Record<
    string,
    (
      item: IContent,
      helpers: { renderContent: (content: any[]) => React.ReactNode }
    ) => React.ReactNode
  >;
};

/**
 * 获取url的参数
 */
export function getUrlParams<T = any>(url: string): T {
  if (!url || !url.includes('?')) {
    return {} as T;
  }
  const theRequest: any = {};
  const queryString = url.split('?')[1] || '';
  queryString.split('&').forEach(param => {
    const [key, value] = param.split('=');
    theRequest[key] = value ? decodeURIComponent(value) : '';
  });
  return theRequest;
}

// 数组求和，接收一个数组，返回数组的和
export function sum(arr: number[]) {
  return arr.reduce((pre, cur) => pre + cur, 0);
}

function collectCodeText(content: any[] | undefined): string {
  if (!content || !Array.isArray(content)) {
    return '';
  }
  return content
    .map((node: any) => {
      if (node?.type === 'hardBreak') {
        return '\n';
      }
      return node?.text || '';
    })
    .join('');
}

function highlightCode(codeText: string, language?: string): string | null {
  if (!codeText) {
    return '';
  }
  try {
    if (language && hljs.getLanguage(language)) {
      return hljs.highlight(codeText, { language }).value;
    }
    return hljs.highlightAuto(codeText).value;
  } catch {
    return null;
  }
}

function collectColWidths(firstRow: any): number[] {
  const widths: number[] = [];
  firstRow?.content?.forEach((cell: any) => {
    const colwidth = cell?.attrs?.colwidth;
    if (Array.isArray(colwidth) && colwidth.length) {
      widths.push(...colwidth.map((n: unknown) => Number(n) || 0));
      return;
    }
    const span = Number(cell?.attrs?.colspan) || 1;
    for (let i = 0; i < span; i += 1) {
      widths.push(0);
    }
  });
  return widths;
}

class TiptapRender {
  /**
   * 渲染器的配置
   */
  config: IRenderConfig;

  /**
   * 渲染的数据json
   */
  json: ITiptapJson | undefined;

  isAfterHardBreak = false;

  constructor(json?: ITiptapJson, config?: IRenderConfig) {
    this.config =
      config ||
      ({
        renderMode: 'custom'
      } as IRenderConfig);
    this.json = json;
  }

  /**
   * link的渲染
   */
  renderLink(mark: any, marks: any[], text: string) {
    let hrefParams: any = {};
    if (mark.type === 'link') {
      hrefParams = getUrlParams(mark.attrs?.href);
    }
    const dom =
      mark.type === 'link' ? (
        <a
          key={mark.key}
          title="链接"
          href={mark.attrs?.href}
          onClick={() => {
            this.config?.onLinkClick?.(hrefParams);
          }}
          className=""
          target={mark.attrs.target}
        >
          {this.applyMarks({ marks, text })}
        </a>
      ) : null;
    if (this.config.linkRender) {
      return this.config.linkRender(dom, mark, hrefParams);
    }
    return dom;
  }

  /**
   * 自定义标记的渲染
   * @param params
   */
  applyMarks(params: { marks: any[]; text: string }): any {
    const { marks, text } = params;
    if (!marks || marks.length === 0) return this.config.textRender?.(text) || text;

    const [mark, ...remainingMarks] = marks;
    if (!mark) return text;
    switch (mark.type) {
      case 'link':
        return this.renderLink(mark, remainingMarks, text);
      case 'bold':
        return this.renderBold(mark.key, remainingMarks, text);
      case 'italic':
        return this.renderItalic(mark.key, remainingMarks, text);
      case 'strike':
        return this.renderStrike(mark.key, remainingMarks, text);
      case 'underline':
        return this.renderUnderline(mark.key, remainingMarks, text);
      case 'code':
        return this.renderInlineCode(mark.key, remainingMarks, text);
      case 'highlight':
        return this.renderHighlight(mark.key, remainingMarks, text, mark.attrs?.color);
      default:
        return this.applyMarks({ marks: remainingMarks, text });
    }
  }

  renderBold(key: string, marks: any[], text: string) {
    return <strong key={key}>{this.applyMarks({ marks, text })}</strong>;
  }

  renderItalic(key: string, marks: any[], text: string) {
    return <em key={key}>{this.applyMarks({ marks, text })}</em>;
  }

  renderStrike(key: string, marks: any[], text: string) {
    return <s key={key}>{this.applyMarks({ marks, text })}</s>;
  }

  renderUnderline(key: string, marks: any[], text: string) {
    return <u key={key}>{this.applyMarks({ marks, text })}</u>;
  }

  renderInlineCode(key: string, marks: any[], text: string) {
    return <code key={key}>{this.applyMarks({ marks, text })}</code>;
  }

  renderHighlight(key: string, marks: any[], text: string, color?: string) {
    return (
      <mark key={key} style={color ? { backgroundColor: color } : undefined}>
        {this.applyMarks({ marks, text })}
      </mark>
    );
  }

  /**
   * 渲染文本
   * @param item 数据
   * @param style 样式
   */
  renderText(item: any, style?: React.CSSProperties) {
    return (
      <span key={item.key} style={style}>
        {this.applyMarks({
          marks: item.marks,
          text: item.text
        })}
      </span>
    );
  }

  /**
   * 渲染标题
   * @param item
   */
  renderHeading(item: any) {
    const level = Math.min(Math.max(Number(item.attrs?.level) || 1, 1), 6);
    const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    const textAlign = item.attrs?.textAlign;
    return (
      <Tag key={item.key} id={item.key} style={textAlign ? { textAlign } : undefined}>
        {this.renderContent(item.content)}
      </Tag>
    );
  }

  renderHardBreak(item: any) {
    this.isAfterHardBreak = true;
    return <br key={item.key} />;
  }

  /**
   * 渲染ATitle
   */
  renderATitle(item: any) {
    return (
      <div id={item.key} key={item.key} className={`a-tiptap-title${item.attrs.level}`}>
        {this.renderContent(item.content)}
      </div>
    );
  }

  /**
   * 渲染ATail
   */
  renderATail(item: any) {
    return (
      <div key={item.key} className="a-tiptap-tail">
        {this.renderContent(item.content)}
      </div>
    );
  }

  /**
   * 渲染AWenHao
   */
  renderAWenHao(item: any) {
    return (
      <div key={item.key} className="a-tiptap-wenhao">
        {this.renderContent(item.content)}
      </div>
    );
  }

  /**
   * 渲染paragraph
   */
  renderParagraph(item: any) {
    const textAlign = item.attrs?.textAlign;
    const hasContent = Array.isArray(item.content) && item.content.length > 0;
    return (
      <p key={item.key} style={textAlign ? { textAlign } : undefined}>
        {hasContent ? (
          this.renderContent(item.content)
        ) : (
          <br className="ProseMirror-trailingBreak" />
        )}
      </p>
    );
  }

  /**
   * 渲染horizontalRule
   */
  renderHorizontalRule(item: any) {
    return <hr key={item.key} contentEditable="false" />;
  }

  renderBlockquote(item: any) {
    return <blockquote key={item.key}>{this.renderContent(item.content)}</blockquote>;
  }

  renderBulletList(item: any) {
    return <ul key={item.key}>{this.renderContent(item.content)}</ul>;
  }

  renderOrderedList(item: any) {
    const start = Number(item.attrs?.start);
    return (
      <ol key={item.key} start={start > 1 ? start : undefined}>
        {this.renderContent(item.content)}
      </ol>
    );
  }

  renderListItem(item: any) {
    return <li key={item.key}>{this.renderContent(item.content)}</li>;
  }

  renderTaskList(item: any) {
    return (
      <ul key={item.key} data-type="taskList">
        {this.renderContent(item.content)}
      </ul>
    );
  }

  renderTaskItem(item: any) {
    const checked = Boolean(item.attrs?.checked);
    return (
      <li key={item.key} data-type="taskItem" data-checked={checked ? 'true' : 'false'}>
        <label contentEditable={false}>
          <input type="checkbox" checked={checked} disabled readOnly />
          <span />
        </label>
        <div>{this.renderContent(item.content)}</div>
      </li>
    );
  }

  /**
   * 渲染codeBlock
   */
  renderCodeBlock(item: any) {
    const language = item?.attrs?.language;
    const codeText = collectCodeText(item.content);
    const highlighted = highlightCode(codeText, language);
    const className = ['hljs', language ? `language-${language}` : ''].filter(Boolean).join(' ');
    return (
      <pre key={item.key}>
        <code className={className}>
          {highlighted !== null ? (
            <span dangerouslySetInnerHTML={{ __html: highlighted }} />
          ) : (
            codeText
          )}
        </code>
      </pre>
    );
  }

  renderTableCell(cell: any, cellIndex: number) {
    const attrs = cell?.attrs || {};
    const Tag = cell?.type === 'tableHeader' ? 'th' : 'td';
    const colwidth = Array.isArray(attrs.colwidth) ? attrs.colwidth : [];
    const numericWidths = colwidth
      .map((n: unknown) => Number(n))
      .filter((n: number) => Number.isFinite(n) && n > 0);
    const width = numericWidths.length ? `${sum(numericWidths)}px` : undefined;
    const style: React.CSSProperties = {};
    if (width) {
      style.width = width;
    }
    if (attrs.backgroundColor) {
      style.backgroundColor = attrs.backgroundColor;
    }
    if (attrs.nodeTextAlign) {
      style.textAlign = attrs.nodeTextAlign;
    }
    if (attrs.nodeVerticalAlign) {
      style.verticalAlign = attrs.nodeVerticalAlign;
    }
    const extra: React.TdHTMLAttributes<HTMLTableCellElement> = {};
    if (Number(attrs.colspan) > 1) {
      extra.colSpan = Number(attrs.colspan);
    }
    if (Number(attrs.rowspan) > 1) {
      extra.rowSpan = Number(attrs.rowspan);
    }
    return (
      <Tag
        key={cell?.key || cellIndex}
        {...extra}
        style={Object.keys(style).length ? style : undefined}
      >
        {this.renderContent(cell?.content)}
      </Tag>
    );
  }

  renderRow(row: any, index: number) {
    return (
      <tr key={row?.key || index}>
        {(row?.content || []).map((cell: any, cellIndex: number) =>
          this.renderTableCell(cell, cellIndex)
        )}
      </tr>
    );
  }

  /**
   * 渲染表格
   */
  renderTable(item: IContent) {
    if (!item.content || item.content.length === 0) return null;
    const attrs = (item.attrs || {}) as IContent['attrs'] & { 'data-align'?: string };
    const align = attrs['data-align'] || attrs.align;
    const colWidths = collectColWidths(item.content[0]);
    const totalColSpanWidth = sum(colWidths.filter(n => n > 0));
    return (
      <div key={item.key} data-content-type="table" data-align={align || undefined}>
        <div className="tableWrapper">
          <div className="table-container">
            <table
              style={
                totalColSpanWidth > 0
                  ? { width: `${totalColSpanWidth}px`, tableLayout: 'fixed' }
                  : { tableLayout: 'fixed' }
              }
            >
              {colWidths.length > 0 ? (
                <colgroup>
                  {/* eslint-disable react/no-array-index-key */}
                  {colWidths.map((w, colIndex) => (
                    <col key={colIndex} style={w > 0 ? { width: `${w}px` } : undefined} />
                  ))}
                  {/* eslint-enable react/no-array-index-key */}
                </colgroup>
              ) : null}
              <tbody>{item.content.map((row, index) => this.renderRow(row, index))}</tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  /**
   * 渲染图片
   */
  renderImage(item: IContent) {
    const attrs = (item.attrs || {}) as IContent['attrs'] & {
      alt?: string;
      'data-align'?: string;
    };
    const align = attrs['data-align'] || attrs.align || 'center';
    const width = toCssSize(attrs.width);
    const src = String(attrs.src || '');
    const alt = attrs.alt || '';
    const caption = item.content?.length ? this.renderContent(item.content) : null;
    const onPreviewClick = this.config.onImageClick
      ? (imageSrc: string, event: React.MouseEvent) => {
          this.config.onImageClick?.(imageSrc, event);
        }
      : undefined;
    return (
      <div className="react-renderer node-image" contentEditable={false} key={item.key}>
        <div className="atiptap-notion-image" data-align={align}>
          <div
            className="atiptap-notion-image__container"
            style={{ width: width || 'fit-content' }}
          >
            <div className="atiptap-notion-image__content">
              <PreviewableImage
                src={src}
                alt={alt}
                width="100%"
                className="atiptap-notion-image__img"
                onPreviewClick={onPreviewClick}
              />
            </div>
            {caption ? <div className="atiptap-notion-image__caption">{caption}</div> : null}
          </div>
        </div>
      </div>
    );
  }

  /**
   * 渲染文件块（视频 / 音频 / 附件）
   */
  renderFile(item: IContent) {
    const src = String(item.attrs?.src || '');
    const name = String(item.attrs?.name || '');
    const mime = String(item.attrs?.mime || '');
    const size =
      typeof item.attrs?.size === 'number'
        ? item.attrs.size
        : item.attrs?.size === undefined || item.attrs?.size === null
          ? null
          : Number(item.attrs.size);
    const kind: FileKind = getFileKind(mime, name);
    const info: FileNodeInfo = {
      kind,
      src,
      name,
      mime,
      size: Number.isFinite(size as number) ? (size as number) : null
    };

    const handleActivate = (event: React.MouseEvent) => {
      if (this.config.onFileClick) {
        this.config.onFileClick(info, event);
        return;
      }
      if (kind === 'file' && src) {
        window.open(src, '_blank', 'noopener,noreferrer');
      }
    };

    const defaultRender = () =>
      renderDefaultFileView({
        ...info,
        onActivate: handleActivate
      });

    const custom = this.config.fileRenderers?.[kind];
    const content = custom
      ? custom({
          ...info,
          selected: false,
          defaultRender
        })
      : defaultRender();

    return (
      <div className="react-renderer node-file" contentEditable={false} key={item.key}>
        <div className="atiptap-notion-file-node">{content}</div>
      </div>
    );
  }

  /**
   * 默认的渲染
   */
  renderDefault(item: any, key: number) {
    if (!item.content) {
      return <p key={item.key || item.type + key}></p>;
    }
    return <p key={item.key || item.type + key}>{this.renderContent(item.content)}</p>;
  }

  renderContent(content: any[]): React.ReactNode {
    if (!content || !Array.isArray(content)) {
      return null;
    }

    return content.map((item, index) => {
      if (!item.key) {
        item.key = item.type + index;
      }

      if (item.type === 'text') {
        const style =
          this.isAfterHardBreak && this.config.renderMode === 'gov'
            ? { paddingLeft: '2em' }
            : undefined;
        this.isAfterHardBreak = false;
        return this.renderText(item, style);
      }

      if (item.type === 'hardBreak') {
        this.isAfterHardBreak = true;
        return <br key={item.key} />;
      }

      return this.renderType(item, index);
    });
  }

  /** 只读渲染 @提及芯片 */
  renderMention(item: IContent): React.ReactNode {
    const attrs = (item as any).attrs || {};
    const label = attrs.label || attrs.id || '';
    return (
      <span
        key={item.key}
        className="atiptap-notion-mention"
        data-mention=""
        data-id={attrs.id || ''}
        data-label={label}
      >
        @{label}
      </span>
    );
  }

  renderType(item: IContent, index: number): React.ReactNode {
    const customRenderer = this.config.nodeRenderers?.[item.type];
    if (customRenderer) {
      return customRenderer(item, {
        renderContent: (content: any[]) => this.renderContent(content)
      });
    }
    if (item.type === 'hardBreak') {
      return this.renderHardBreak(item);
    }
    if (item.type === 'mention') {
      return this.renderMention(item);
    }
    if (item.type === 'ATitle') {
      return this.renderATitle(item);
    }
    if (item.type === 'ATail') {
      return this.renderATail(item);
    }
    if (item.type === 'AWenHao') {
      return this.renderAWenHao(item);
    }
    if (item.type === 'paragraph') {
      return this.renderParagraph(item);
    }
    if (item.type === 'blockquote') {
      return this.renderBlockquote(item);
    }
    if (item.type === 'bulletList') {
      return this.renderBulletList(item);
    }
    if (item.type === 'orderedList') {
      return this.renderOrderedList(item);
    }
    if (item.type === 'listItem') {
      return this.renderListItem(item);
    }
    if (item.type === 'taskList') {
      return this.renderTaskList(item);
    }
    if (item.type === 'taskItem') {
      return this.renderTaskItem(item);
    }
    if (item.type === 'horizontalRule') {
      return this.renderHorizontalRule(item);
    }
    if (item.type === 'codeBlock') {
      return this.renderCodeBlock(item);
    }
    if (item.type === 'heading') {
      return this.renderHeading(item);
    }
    if (item.type === 'table') {
      return this.renderTable(item);
    }
    if (item.type === 'image') {
      return this.renderImage(item);
    }
    if (item.type === 'file') {
      return this.renderFile(item);
    }
    if (item.type === 'imageUpload' || item.type === 'fileUpload') {
      return null;
    }
    return this.renderDefault(item, index);
  }

  render(json?: ITiptapJson, config?: IRenderConfig) {
    if (json) {
      this.json = json;
    }
    if (config) {
      this.config = config;
    }
    if (!this.json) {
      return <></>;
    }
    if (!this.json.content) {
      return <></>;
    }

    this.isAfterHardBreak = false;

    // 循环补充下key
    this.json.content.forEach((item, index) => {
      if (!item.key) {
        item.key = item.type + index;
      }
    });

    const renderMode = this.config.renderMode || 'custom';
    const isNotion = renderMode === 'notion';
    const nodes = this.json.content.map((item, index) => this.renderType(item, index));

    if (isNotion) {
      return (
        <div className={`atiptap-notion ${NOTION_THEME_CLASS}`}>
          <div className="atiptap-content">
            <div
              className="atiptap-notion-prosemirror ProseMirror markdown-body"
              contentEditable={false}
            >
              {nodes}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={`atiptap_main_${renderMode}`}>
        <div className="atiptap-content">
          <div className="tiptap ProseMirror markdown-body" contentEditable={false}>
            {nodes}
          </div>
        </div>
      </div>
    );
  }

  // 设置config
  setConfig(config?: IRenderConfig) {
    if (config) {
      this.config = config;
    }
  }

  // 设置json
  setJson(json: ITiptapJson) {
    this.json = json;
  }
}

export default TiptapRender;
