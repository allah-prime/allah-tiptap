(globalThis.utooChunk__allahjs_tiptap||(globalThis.utooChunk__allahjs_tiptap=[])).push(["object"==typeof document?document.currentScript:void 0,659151,t=>{"use strict";var e=t.i(380447);t.i(826418);var a=t.i(168519),o=t.i(506276),n=t.i(235013),n=n,l=t.i(999161),i=t.i(473228),r=t.i(494053);function d({node:t,selected:a}){return(0,e.jsxs)(o.NodeViewWrapper,{className:"atiptap-callout-demo","data-selected":a?"true":"false","data-variant":t.attrs.variant||"info",children:[(0,e.jsxs)("div",{className:"atiptap-callout-demo__badge",contentEditable:!1,children:[(0,e.jsx)(n.default,{size:14}),"提示"]}),(0,e.jsx)(o.NodeViewContent,{className:"atiptap-callout-demo__body"})]})}let s=a.Node.create({name:"callout",group:"block",content:"block+",defining:!0,draggable:!0,selectable:!0,addAttributes:()=>({variant:{default:"info",parseHTML:t=>t.getAttribute("data-variant")||"info",renderHTML:t=>({"data-variant":t.variant||"info"})}}),parseHTML:()=>[{tag:"aside[data-callout]"}],renderHTML:({HTMLAttributes:t})=>["aside",(0,a.mergeAttributes)(t,{"data-callout":"",class:"atiptap-callout-demo"}),0],addCommands:()=>({insertCallout:()=>({commands:t})=>t.insertContent({type:"callout",attrs:{variant:"info"},content:[{type:"paragraph"}]})}),addNodeView:()=>(0,o.ReactNodeViewRenderer)(d)}),c={type:"doc",content:[{type:"heading",attrs:{level:1},content:[{type:"text",text:"自定义节点扩展"}]},{type:"paragraph",content:[{type:"text",text:'通过 extraExtensions 注入 callout，并用 slashItems / toolbarExtra / getBlockIcon 接到 UI。自定义块请优先使用 mode="json"。'}]},{type:"callout",attrs:{variant:"info"},content:[{type:"paragraph",content:[{type:"text",text:"这是业务自定义的提示块。可用斜杠「提示块」或工具栏按钮插入。"}]}]}]},p=`
.atiptap-callout-demo {
  margin: 8px 0;
  padding: 12px 14px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: #e6f4ff;
  border-left: 3px solid #1677ff;
}
.atiptap-callout-demo[data-variant='warning'] {
  background: #fff7e6;
  border-left-color: #fa8c16;
}
.atiptap-callout-demo[data-variant='warning'] .atiptap-callout-demo__badge {
  color: #fa8c16;
}
.atiptap-callout-demo[data-selected='true'] {
  outline: 2px solid #1677ff;
  outline-offset: 1px;
}
.atiptap-callout-demo__badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 6px;
  color: #1677ff;
  font-size: 12px;
  font-weight: 500;
}
.atiptap-callout-demo__body > *:first-child { margin-top: 0; }
.atiptap-callout-demo__body > *:last-child { margin-bottom: 0; }
.atiptap-callout-readonly {
  margin: 8px 0;
  padding: 12px 14px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: #e6f4ff;
  border-left: 3px solid #1677ff;
}
.atiptap-callout-readonly[data-variant='warning'] {
  background: #fff7e6;
  border-left-color: #fa8c16;
}
`;t.s(["default",0,()=>{let[t,a]=(0,l.useState)(c),o=(0,l.useMemo)(()=>[s],[]),d=(0,l.useMemo)(()=>[{title:"提示块",subtext:"自定义 callout 节点",keywords:["callout","提示","info"],badge:n.default,group:"自定义",onSelect:({editor:t,range:e})=>{t.chain().focus().deleteRange(e).insertCallout().run()}}],[]),u=(0,l.useMemo)(()=>new r.default(t,{renderMode:"notion",nodeRenderers:{callout:(t,{renderContent:a})=>(0,e.jsxs)("aside",{className:"atiptap-callout-readonly","data-variant":t.attrs?.variant||"info",children:[(0,e.jsx)("div",{style:{color:"#1677ff",fontSize:12,marginBottom:6},children:"提示（只读）"}),a(t.content)]},t.key)}}).render(),[t]);return(0,e.jsxs)("div",{style:{padding:16,color:"rgba(0, 0, 0, 0.88)"},children:[(0,e.jsx)("style",{children:p}),(0,e.jsxs)("p",{style:{color:"rgba(0, 0, 0, 0.45)",marginBottom:12},children:["输入 ",(0,e.jsx)("code",{children:"/"})," 选「提示块」，或点工具栏「提示」。左侧句柄会显示 Info 图标；块菜单有「切换为警告色」。 下方是 ",(0,e.jsx)("code",{children:"TiptapRender"})," + ",(0,e.jsx)("code",{children:"nodeRenderers"})," 只读预览。"]}),(0,e.jsx)(i.default,{mode:"json",value:t,onChange:a,showOutline:!1,extraExtensions:o,slashItems:d,toolbarExtra:t=>(0,e.jsx)("button",{type:"button",title:"提示块",className:"atiptap-notion-toolbar__btn",onMouseDown:t=>t.preventDefault(),onClick:()=>{t.chain().focus().insertCallout().run()},children:(0,e.jsx)(n.default,{size:16})}),getBlockIcon:t=>"callout"===t.type.name?n.default:null,blockMenuExtra:({editor:t,node:a,close:o})=>"callout"!==a.type.name?null:(0,e.jsxs)("button",{type:"button",className:"atiptap-notion-drag-menu__item",onClick:()=>{let e="warning"===a.attrs.variant?"info":"warning";t.chain().focus().updateAttributes("callout",{variant:e}).run(),o()},children:[(0,e.jsx)(n.default,{size:15}),"warning"===a.attrs.variant?"切回信息色":"切换为警告色"]}),style:{height:420}}),(0,e.jsx)("h3",{style:{marginTop:24,marginBottom:8,fontSize:14},children:"只读渲染（nodeRenderers）"}),(0,e.jsx)("div",{style:{border:"1px solid #d9d9d9",borderRadius:6,padding:12,minHeight:80},children:u})]})}],659151)}]);