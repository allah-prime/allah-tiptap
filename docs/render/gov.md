---
title: 公文皮肤
order: 2
---

# 公文皮肤 `gov`

对应编辑器 `renderMode="gov"`。只读根节点是 `atiptap_main_gov`，套公文 CSS：宋体、正文首行缩进 2em、换行后再缩进、公文标题 / 文号 / 落款。

```tsx | pure
import { jsonToDom } from '@allahjs/tiptap';

jsonToDom(json, { renderMode: 'gov' });
```

公文专属节点：

| JSON `type`               | 说明                                 |
| ------------------------- | ------------------------------------ |
| `ATitle`                  | 公文标题，`attrs.level` 为 1 / 2 / 3 |
| `AWenHao`                 | 文号                                 |
| `ATail`                   | 落款（右对齐）                       |
| `paragraph` + `hardBreak` | 换行后下一段再缩进 2em               |

编辑时用 `ATiptap` 的公文皮肤产出 JSON，预览时不要漏传 `renderMode: 'gov'`，否则标题和缩进会对不上。

<code src="../../example/json-render-gov.tsx"></code>
