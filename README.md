# @allahjs/tiptap

[![NPM version](https://img.shields.io/npm/v/@allahjs/tiptap.svg?style=flat)](https://npmjs.org/package/@allahjs/tiptap)
[![NPM downloads](http://img.shields.io/npm/dm/@allahjs/tiptap.svg?style=flat)](https://npmjs.org/package/@allahjs/tiptap)

基于tiptap的中文文章编辑器

**[在线文档](https://allah-prime.github.io/allah-tiptap/)**

## Usage

```tsx
import ATiptap from '@allahjs/tiptap';

<ATiptap mode="md" renderMode="gov" onChange={doc => console.log(doc)} />;
```

只读渲染（文章详情页，无需挂编辑器实例）：

```tsx
import { jsonToDom } from '@allahjs/tiptap';

jsonToDom(json, { renderMode: 'gov' });
```

## Options

| 属性                             | 类型                                        | 默认值  | 说明                            |
| -------------------------------- | ------------------------------------------- | ------- | ------------------------------- |
| `mode`                           | `'html' \| 'md' \| 'json'`                  | `'md'`  | 回传 / 赋值的数据格式           |
| `renderMode`                     | `'gov' \| 'normal' \| 'custom' \| 'notion'` | `'gov'` | 编辑器皮肤                      |
| `height`                         | `number \| 'auto'`                          | `500`   | 编辑器高度，`'auto'` 随内容撑开 |
| `bordered`                       | `boolean`                                   | `true`  | 是否显示边框                    |
| `imageUploader` / `fileUploader` | `UploaderFunc`                              | -       | 图片 / 附件上传                 |
| `onChange` / `onReady`           | function                                    | -       | 内容变化 / 编辑器就绪回调       |

完整 Props 与 Notion 块编辑器（`ANotion`）、只读渲染（`TiptapRender`）文档见 [在线文档](https://allah-prime.github.io/allah-tiptap/)。

## Development

```bash
# install dependencies
$ pnpm install

# develop library by docs demo
$ pnpm start

# build library source code
$ pnpm run build

# build library source code in watch mode
$ pnpm run build:watch

# build docs
$ pnpm run docs:build

# check your project for potential problems
$ pnpm run doctor
```

## LICENSE

MIT
