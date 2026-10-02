---
title: ATiptap
hero:
  title: ATiptap
  description: 基于 Tiptap v3 的中文文章编辑器，内置公文 / Notion 两种皮肤，编辑、回显、只读渲染一站式解决
  actions:
    - text: 快速开始
      link: /example
    - text: 只读渲染
      link: /render
features:
  - title: 公文编辑器
    emoji: 📄
    description: 默认 gov 皮肤，宋体正文、首行缩进、公文标题 / 文号 / 落款，开箱即用
  - title: Notion 块编辑器
    emoji: 🧱
    description: ANotion 输入 / 唤起命令菜单，划词格式化，句柄拖拽重排，默认按 Markdown 读写
  - title: 三种数据格式
    emoji: 🔀
    description: mode 支持 html / md / json 赋值与回传，三种格式互转预览
  - title: 四种只读皮肤
    emoji: 🎨
    description: jsonToDom / TiptapRender 支持 gov、normal、custom、notion 只读渲染，详情页不必再挂编辑器实例
  - title: 自定义渲染
    emoji: 🛠️
    description: 继承 TiptapRender 覆盖节点 / 标记渲染，或用 nodeRenderers、linkRender 精细接管
  - title: 工厂模式多实例
    emoji: 🏭
    description: TiptapRenderFactory 单例管理多个渲染器，按业务主键隔离复用
---

## 快速开始

```bash
pnpm add @allahjs/tiptap
```

```tsx | pure
import ATiptap from '@allahjs/tiptap';

<ATiptap mode="md" renderMode="gov" onChange={doc => console.log(doc)} />;
```

只读渲染一行代码：

```tsx | pure
import { jsonToDom } from '@allahjs/tiptap';

jsonToDom(json, { renderMode: 'gov' });
```

## 下一步

- [完整编辑器](/example)：所有能力在线演示，含 Notion 块编辑器、表单联动、附件上传
- [高级用法](/max/plus)：继承渲染类深度定制节点与标记
- [自定义渲染](/render)：四种只读皮肤对照与配置项
