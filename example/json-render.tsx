import { Select, Space, Typography } from 'antd';
import React, { useMemo, useState } from 'react';
import ATiptap, { jsonToDom, mockFileUploader, mockImgUploader, type IATiptapProps } from '../src';

const SAMPLE_IMG = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="120"><rect width="100%" height="100%" fill="#1677ff"/><text x="50%" y="54%" fill="white" font-size="16" font-family="sans-serif" text-anchor="middle">图片块</text></svg>'
)}`;

const SAMPLE_JSON = {
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

export default () => {
  const [json, setJson] = useState(SAMPLE_JSON);
  const [renderMode, setRenderMode] = useState<IATiptapProps['renderMode']>('custom');

  const readonly = useMemo(() => jsonToDom(json, { renderMode }), [json, renderMode]);

  return (
    <div style={{ color: 'rgba(0, 0, 0, 0.88)' }}>
      <Typography.Paragraph type="secondary" style={{ marginBottom: 12 }}>
        左侧编辑，右侧用 <Typography.Text code>jsonToDom</Typography.Text> 只读渲染同一份
        JSON。切换皮肤后两边会一起变化。
      </Typography.Paragraph>
      <Space wrap size={8} style={{ marginBottom: 12 }}>
        <Select
          value={renderMode}
          style={{ width: 140 }}
          onChange={v => setRenderMode(v)}
          options={[
            { value: 'gov', label: '公文皮肤' },
            { value: 'normal', label: '普通皮肤' },
            { value: 'custom', label: '自定义' },
            { value: 'notion', label: '块编辑器' }
          ]}
        />
      </Space>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
          gap: 16
        }}
      >
        <div style={panelStyle}>
          <div style={panelHeadStyle}>编辑器</div>
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
        </div>
        <div style={panelStyle}>
          <div style={panelHeadStyle}>jsonToDom 只读预览</div>
          <div style={{ padding: 12, maxHeight: 520, overflow: 'auto' }}>{readonly}</div>
        </div>
      </div>
    </div>
  );
};
