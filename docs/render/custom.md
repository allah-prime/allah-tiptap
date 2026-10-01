---
title: 自定义皮肤
order: 4
---

# 自定义皮肤 `custom`

`jsonToDom` **不传 `renderMode` 时的默认值**。根节点是 `atiptap_main_custom`。

```tsx | pure
import { jsonToDom } from '@allahjs/tiptap';

jsonToDom(json);
// 等价于
jsonToDom(json, { renderMode: 'custom' });
```

适合业务自己套一层样式，或只需要 markdown-body 默认排版的详情页。链接、节点仍可通过 `linkRender` / `nodeRenderers` 覆盖。

<code src="../../example/json-render-custom.tsx"></code>
