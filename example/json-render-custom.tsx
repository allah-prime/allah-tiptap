import React from 'react';
import { JsonRenderModeDemo } from './json-render-shared';

export default () => (
  <JsonRenderModeDemo
    renderMode="custom"
    hint="自定义皮肤是 jsonToDom 的默认值。不传 renderMode 时也走这一套。"
  />
);
