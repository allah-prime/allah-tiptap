import { defineConfig } from 'dumi';

export default defineConfig({
  outputPath: 'docs-dist',
  themeConfig: {
    name: 'ATiptap',
    nav: [
      { title: '编辑器', link: '/components' },
      { title: '完整编辑器', link: '/example' },
      { title: '高级用法', link: '/max/plus' },
      { title: '自定义渲染', link: '/render' }
    ]
  },
  base: '/',
  publicPath: '/',
  utoopack: {},
});
