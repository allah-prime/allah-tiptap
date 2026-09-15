---
title: 概览
order: 1
nav: 自定义渲染
---

# 自定义渲染

`jsonToDom` 和 `TiptapRender` 把编辑器 JSON 转成只读 React 文档。节点结构和样式与当前编辑器对齐，适合文章详情、预览页，不必再挂一份可编辑实例。

## 快速开始

```tsx | pure
import { jsonToDom } from '@allahbin/tiptap';

jsonToDom(json, { renderMode: 'custom' });
```

或直接实例化：

```tsx | pure
import { TiptapRender } from '@allahbin/tiptap';

new TiptapRender(json, { renderMode: 'gov' }).render();
```

`renderMode` 必须和当初编辑这份 JSON 的皮肤一致，只读页才会和编辑器长得一样。

## 渲染模式

| `renderMode` | 皮肤 | 说明 |
| --- | --- | --- |
| `gov` | [公文](/render/gov) | 宋体、首行缩进、公文标题 / 文号 / 落款 |
| `normal` | [普通](/render/normal) | 一般文章详情 |
| `custom` | [自定义](/render/custom) | **默认值**，不传 `renderMode` 时走这一套 |
| `notion` | [块编辑器](/render/notion) | `atiptap-notion` 主题、提及、文件卡片 |

## 配置项

```ts
type IRenderConfig = {
  renderMode?: 'gov' | 'normal' | 'custom' | 'notion';
  onLinkClick?: (params: any) => void;
  linkRender?: (node, mark, params) => React.ReactNode;
  textRender?: (text: string) => React.ReactNode;
  nodeRenderers?: Record<string, (item, helpers) => React.ReactNode>;
  fileRenderers?: { video?: Fn; audio?: Fn; file?: Fn };
  onFileClick?: (info, event) => void;
  onImageClick?: (src, event) => void;
};
```

| 配置 | 作用 |
| --- | --- |
| `renderMode` | 皮肤，默认 `custom` |
| `onLinkClick` | 链接点击，参数来自 URL query |
| `linkRender` | 完全接管链接 DOM |
| `nodeRenderers` | 按节点 `type` 自定义（如业务 callout） |
| `fileRenderers` | 视频 / 音频 / 附件卡片 |
| `onFileClick` | 附件点击 |
| `onImageClick` | 传入则覆盖内置大图预览 |

需要改某个标记或节点时，也可以继承 `TiptapRender` 覆盖 `renderLink` / `applyMarks` / `renderType`。多实例场景见 [工厂模式](/max/factory)。

## 对照预览

同一份 JSON，切换四种皮肤看只读结果。

<code src="../../example/json-render.tsx"></code>
