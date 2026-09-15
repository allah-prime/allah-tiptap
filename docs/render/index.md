---
title: 自定义渲染
nav: 自定义渲染
---

# 自定义渲染

`jsonToDom` 和 `TiptapRender` 把编辑器 JSON 转成只读 React 文档，节点结构与样式和当前编辑器对齐。适合文章详情、预览页，不必再挂一份可编辑实例。

```tsx | pure
import { jsonToDom } from '@allahbin/tiptap';

jsonToDom(json, { renderMode: 'custom' });
```

`renderMode` 与编辑器相同：`gov`（公文）、`normal`、`custom`、`notion`（块编辑器）。需要改链接或自定义节点时，可继承 `TiptapRender`，或传入 `nodeRenderers` / `fileRenderers`。

下方左侧可编辑，右侧即时预览。

<code src="../../example/json-render.tsx"></code>
