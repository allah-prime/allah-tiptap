(globalThis.utooChunk__allahjs_tiptap||(globalThis.utooChunk__allahjs_tiptap=[])).push(["object"==typeof document?document.currentScript:void 0,12563,e=>{"use strict";var t=e.i(380447);e.i(583919);var i=e.i(999161),l=e.i(473228),o=e.i(507657);let a=`# 附件 / 音视频

输入 \`/\` 选择「视频」「音频」或「文件」，或使用工具栏回形针按钮。

文档只保存上传后的 **URL**，不会写入原始文件或 base64。

## 试试

1. 插入视频：默认 \`<video controls>\`
2. 插入音频：默认 \`<audio controls>\`
3. 插入 PDF / zip 等：附件卡片；PDF 本示例做了自定义渲染
`;e.s(["default",0,()=>{let[e,n]=(0,i.useState)(a),[s,r]=(0,i.useState)(null);return(0,t.jsxs)("div",{style:{padding:16,color:"rgba(0, 0, 0, 0.88)"},children:[(0,t.jsxs)("p",{style:{color:"rgba(0, 0, 0, 0.45)",marginBottom:12},children:["Demo 使用 ",(0,t.jsx)("code",{children:"mockFileUploader"})," 返回 object URL，业务侧应上传到 OSS/CDN 后回写真实 URL。"]}),s?(0,t.jsx)("pre",{style:{marginBottom:12,padding:12,background:"#f5f5f5",borderRadius:6,fontSize:12,overflow:"auto"},children:JSON.stringify(s,null,2)}):null,(0,t.jsx)(l.default,{value:e,onChange:n,showOutline:!1,imageUploader:o.mockImgUploader,fileUploader:o.mockFileUploader,onFileClick:(e,t)=>{t.preventDefault(),r(e)},fileRenderers:{file:e=>"application/pdf"===e.mime?(0,t.jsxs)("div",{className:"atiptap-notion-file",style:{padding:12},children:[(0,t.jsx)("div",{style:{marginBottom:8,color:"rgba(0,0,0,0.45)"},children:"PDF 自定义渲染示例"}),(0,t.jsx)("button",{type:"button",className:"atiptap-notion-file atiptap-notion-file--card",style:{border:"1px solid #1677ff",width:"100%"},onClick:t=>{t.preventDefault(),r(e),e.src&&window.open(e.src,"_blank","noopener,noreferrer")},children:(0,t.jsxs)("span",{className:"atiptap-notion-file__meta",children:[(0,t.jsx)("span",{className:"atiptap-notion-file__name",children:e.name}),(0,t.jsx)("span",{className:"atiptap-notion-file__sub",children:"点击打开 PDF"})]})})]}):e.defaultRender()},style:{height:420}})]})}])}]);