import { defineConfig } from 'dumi';

export default defineConfig({
  outputPath: 'docs-dist',
  title: 'ATiptap',
  themeConfig: {
    name: 'ATiptap',
    nav: [
      { title: '首页', link: '/' },
      { title: '完整编辑器', link: '/example' },
      { title: '高级用法', link: '/max/plus' },
      { title: '自定义渲染', link: '/render' }
    ]
  },
  base: '/allah-tiptap/',
  publicPath: '/allah-tiptap/',
  utoopack: {}
});
