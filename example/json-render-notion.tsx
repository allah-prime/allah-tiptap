import React from 'react';
import { JsonRenderModeDemo, NOTION_JSON } from './json-render-shared';

export default () => (
  <JsonRenderModeDemo
    renderMode="notion"
    initialJson={NOTION_JSON}
    hint="块编辑器皮肤：atiptap-notion 主题、提及芯片、文件卡片。传 renderMode: 'notion'。"
  />
);
