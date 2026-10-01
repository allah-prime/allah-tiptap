---
title: 块编辑器皮肤
order: 5
---

# 块编辑器皮肤 `notion`

对应 `ANotion` / `renderMode="notion"`。只读根节点是 `atiptap-notion atiptap-theme`，走块编辑器主题变量、提及芯片和文件卡片。

```tsx | pure
import { jsonToDom } from '@allahjs/tiptap';

jsonToDom(json, { renderMode: 'notion' });
```

相对其它皮肤，这份 JSON 里更常见：

| JSON `type`             | 说明                                     |
| ----------------------- | ---------------------------------------- |
| `mention`               | `@张三` 芯片，`attrs.id` / `attrs.label` |
| `file`                  | 视频 / 音频 / 附件，按 `mime` 切换       |
| `image`                 | 对齐 `data-align`、宽度、图注            |
| `taskList` / `taskItem` | 待办，`attrs.checked`                    |

自定义块（如 callout）不会内置，请用 `nodeRenderers`，示例见 [自定义节点](/example/notion-extend)。

<code src="../../example/json-render-notion.tsx"></code>
