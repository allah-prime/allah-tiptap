import { Select, Space, Typography } from 'antd';
import React, { useMemo, useState } from 'react';
import ATiptap, {
  ANotion,
  jsonToDom,
  mockFileUploader,
  mockImgUploader,
  type IATiptapProps,
  type MentionSuggestionItem
} from '../src';

export const SAMPLE_IMG = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="120"><rect width="100%" height="100%" fill="#1677ff"/><text x="50%" y="54%" fill="white" font-size="16" font-family="sans-serif" text-anchor="middle">图片块</text></svg>'
)}`;

const MENTION_USERS: MentionSuggestionItem[] = [
  { id: '1001', label: '张三', subtext: '研发中心' },
  { id: '1002', label: '李四', subtext: '产品中心' }
];

export const ARTICLE_JSON = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 1 },
      content: [{ type: 'text', text: 'JSON 只读渲染' }]
    },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: '把编辑器 JSON 交给 ' },
        { type: 'text', marks: [{ type: 'code' }], text: 'jsonToDom' },
        { type: 'text', text: ' 即可得到可读文档。支持 ' },
        { type: 'text', marks: [{ type: 'bold' }], text: '加粗' },
        { type: 'text', text: '、' },
        { type: 'text', marks: [{ type: 'italic' }], text: '斜体' },
        { type: 'text', text: '、' },
        { type: 'text', marks: [{ type: 'strike' }], text: '删除线' },
        { type: 'text', text: '、' },
        { type: 'text', marks: [{ type: 'underline' }], text: '下划线' },
        { type: 'text', text: ' 与 ' },
        {
          type: 'text',
          marks: [{ type: 'highlight', attrs: { color: '#ffe58f' } }],
          text: '高亮'
        },
        { type: 'text', text: '。' }
      ]
    },
    {
      type: 'bulletList',
      content: [
        {
          type: 'listItem',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: '无序列表' }] }]
        },
        {
          type: 'listItem',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: '与编辑器同一套节点' }] }]
        }
      ]
    },
    {
      type: 'orderedList',
      content: [
        {
          type: 'listItem',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: '有序列表' }] }]
        }
      ]
    },
    {
      type: 'taskList',
      content: [
        {
          type: 'taskItem',
          attrs: { checked: true },
          content: [{ type: 'paragraph', content: [{ type: 'text', text: '已完成任务' }] }]
        },
        {
          type: 'taskItem',
          attrs: { checked: false },
          content: [{ type: 'paragraph', content: [{ type: 'text', text: '未完成任务' }] }]
        }
      ]
    },
    {
      type: 'blockquote',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: '引用块与编辑器共用 markdown-body 样式。' }]
        }
      ]
    },
    {
      type: 'codeBlock',
      attrs: { language: 'javascript' },
      content: [
        {
          type: 'text',
          text: `import { jsonToDom } from '@allahbin/tiptap';

jsonToDom(json, { renderMode: 'custom' });`
        }
      ]
    },
    {
      type: 'table',
      content: [
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableHeader',
              attrs: { colspan: 1, rowspan: 1, colwidth: [120] },
              content: [{ type: 'paragraph', content: [{ type: 'text', text: '节点' }] }]
            },
            {
              type: 'tableHeader',
              attrs: { colspan: 1, rowspan: 1, colwidth: [220] },
              content: [{ type: 'paragraph', content: [{ type: 'text', text: '只读表现' }] }]
            }
          ]
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              attrs: { colspan: 1, rowspan: 1, colwidth: [120] },
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'table' }] }]
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: [220],
                backgroundColor: '#e6f4ff'
              },
              content: [
                { type: 'paragraph', content: [{ type: 'text', text: '表头、单元格背景' }] }
              ]
            }
          ]
        }
      ]
    },
    {
      type: 'image',
      attrs: {
        src: SAMPLE_IMG,
        alt: '示例图',
        'data-align': 'center',
        width: '240'
      }
    },
    {
      type: 'file',
      attrs: {
        src: 'https://example.com/brief.pdf',
        name: '说明.pdf',
        mime: 'application/pdf',
        size: 128000
      }
    },
    { type: 'horizontalRule' },
    {
      type: 'paragraph',
      attrs: { textAlign: 'center' },
      content: [{ type: 'text', text: '段落可居中对齐' }]
    }
  ]
};

export const GOV_JSON = {
  type: 'doc',
  content: [
    {
      type: 'ATitle',
      attrs: { level: 1 },
      content: [{ type: 'text', text: '关于进一步加强消防安全工作的通知' }]
    },
    {
      type: 'AWenHao',
      content: [{ type: 'text', text: '消发〔2024〕12号' }]
    },
    {
      type: 'paragraph',
      content: [{ type: 'text', text: '各有关单位：' }]
    },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: '为切实做好消防安全工作，现将有关事项通知如下。' },
        { type: 'hardBreak' },
        { type: 'text', text: '请结合实际抓好落实，并于月底前将进展情况书面报送。' }
      ]
    },
    {
      type: 'bulletList',
      content: [
        {
          type: 'listItem',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: '开展隐患排查' }] }]
        },
        {
          type: 'listItem',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: '完善应急预案' }] }]
        }
      ]
    },
    {
      type: 'ATail',
      content: [{ type: 'text', text: 'XX市消防救援支队' }]
    }
  ]
};

export const NOTION_JSON = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 1 },
      content: [{ type: 'text', text: '块编辑器只读预览' }]
    },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: '请 ' },
        { type: 'mention', attrs: { id: '1001', label: '张三' } },
        { type: 'text', text: ' 查收附件，并对照下方任务清单。' }
      ]
    },
    ...ARTICLE_JSON.content.slice(2)
  ]
};

const panelStyle: React.CSSProperties = {
  minWidth: 0,
  border: '1px solid #d9d9d9',
  borderRadius: 6,
  overflow: 'hidden',
  background: '#fff'
};

const panelHeadStyle: React.CSSProperties = {
  padding: '8px 12px',
  borderBottom: '1px solid #f0f0f0',
  color: 'rgba(0, 0, 0, 0.45)',
  fontSize: 13
};

const MODE_OPTIONS: { value: NonNullable<IATiptapProps['renderMode']>; label: string }[] = [
  { value: 'gov', label: '公文 gov' },
  { value: 'normal', label: '普通 normal' },
  { value: 'custom', label: '自定义 custom' },
  { value: 'notion', label: '块编辑器 notion' }
];

export type JsonRenderModeDemoProps = {
  renderMode?: NonNullable<IATiptapProps['renderMode']>;
  initialJson?: { type: string; content: unknown[] };
  hint?: string;
  switchable?: boolean;
};

export function JsonRenderModeDemo({
  renderMode: renderModeProp = 'custom',
  initialJson = ARTICLE_JSON,
  hint,
  switchable = false
}: JsonRenderModeDemoProps) {
  const [json, setJson] = useState(initialJson);
  const [renderMode, setRenderMode] = useState(renderModeProp);
  const readonly = useMemo(() => jsonToDom(json, { renderMode }), [json, renderMode]);
  const editor =
    renderMode === 'notion' ? (
      <ANotion
        mode="json"
        value={json}
        onChange={setJson}
        imageUploader={mockImgUploader}
        fileUploader={mockFileUploader}
        mentionItems={MENTION_USERS}
        bordered={false}
        showOutline={false}
        height={520}
      />
    ) : (
      <ATiptap
        mode="json"
        value={json}
        onChange={setJson}
        renderMode={renderMode}
        imageUploader={mockImgUploader}
        fileUploader={mockFileUploader}
        bordered={false}
        showOutline={false}
        height={520}
      />
    );

  return (
    <div style={{ color: 'rgba(0, 0, 0, 0.88)' }}>
      {hint ? (
        <Typography.Paragraph type="secondary" style={{ marginBottom: 12 }}>
          {hint}
        </Typography.Paragraph>
      ) : null}
      {switchable ? (
        <Space wrap size={8} style={{ marginBottom: 12 }}>
          <Select
            value={renderMode}
            style={{ width: 180 }}
            onChange={v => setRenderMode(v)}
            options={MODE_OPTIONS}
          />
        </Space>
      ) : null}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
          gap: 16
        }}
      >
        <div style={panelStyle}>
          <div style={panelHeadStyle}>编辑器 · {renderMode}</div>
          {editor}
        </div>
        <div style={panelStyle}>
          <div style={panelHeadStyle}>jsonToDom({`{ renderMode: '${renderMode}' }`})</div>
          <div style={{ padding: 12, maxHeight: 520, overflow: 'auto' }}>{readonly}</div>
        </div>
      </div>
    </div>
  );
}
