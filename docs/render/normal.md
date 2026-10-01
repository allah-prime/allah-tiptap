---
title: 普通皮肤
order: 3
---

# 普通皮肤 `normal`

对应编辑器 `renderMode="normal"`。适合一般文章详情，没有公文缩进和公文标题节点。

```tsx | pure
import { jsonToDom } from '@allahjs/tiptap';

jsonToDom(json, { renderMode: 'normal' });
```

标题用 `heading`（h1–h6），列表、引用、任务、表格、图片、附件与其它皮肤共用同一套 JSON 节点，差别主要在外层 `atiptap_main_normal` 的排版。

<code src="../../example/json-render-normal.tsx"></code>
