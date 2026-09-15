import React from 'react';
import { GOV_JSON, JsonRenderModeDemo } from './json-render-shared';

export default () => (
  <JsonRenderModeDemo
    renderMode="gov"
    initialJson={GOV_JSON}
    hint="公文皮肤：宋体、首行缩进、公文标题 / 文号 / 落款。只读必须传 renderMode: 'gov'。"
  />
);
