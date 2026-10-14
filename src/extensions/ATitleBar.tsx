import classNames from 'classnames';
import { ChevronDown } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { ATiptapEditor } from '../editor';
import { command, option } from '../menubar';
import TextButton from './TextButton';
import { LAW_MARKS, LawLevel, lawMarkOf } from './lawLevel';

function isLawLevelActive(editor: ATiptapEditor, lawLevel: LawLevel) {
  if (editor.isActive('ATitle', { lawLevel })) {
    return true;
  }
  const current = editor.getAttributes('ATitle').lawLevel;
  if (current) {
    return false;
  }
  if (lawLevel === 'zhang') {
    return editor.isActive('ATitle', { level: 2 });
  }
  if (lawLevel === 'jie') {
    return editor.isActive('ATitle', { level: 3 });
  }
  return false;
}

const numericHeadingLevels: Array<1 | 2 | 3> = [1, 2, 3];

type BlockMenuItem = {
  key: string;
  label: string;
  shortcut?: string;
  active: boolean;
  disabled: boolean;
  onSelect: () => void;
};

type ATitleBarProps = {
  editor: ATiptapEditor;
  /** 公文模式才展示落款 / 文号 */
  showGovBlocks?: boolean;
};

export const ATitleBar: React.FC<ATitleBarProps> = ({ editor, showGovBlocks = false }) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const hasATitle = !!editor.state.schema.nodes.ATitle;
  const hasATail = showGovBlocks && !!editor.state.schema.nodes.ATail;
  const hasAWenHao = showGovBlocks && !!editor.state.schema.nodes.AWenHao;
  const hasHeading = !!editor.state.schema.nodes.heading;

  const visibleHeadingLevels = numericHeadingLevels.filter(() => hasHeading);

  const apply = (runner: () => boolean) => {
    if (!runner()) {
      return;
    }
    setOpen(false);
  };

  const menuItems = useMemo<BlockMenuItem[]>(() => {
    const paragraphActive =
      editor.isActive('paragraph') && !editor.isActive('ATail') && !editor.isActive('AWenHao');

    const items: BlockMenuItem[] = [
      {
        key: 'paragraph',
        label: '正文',
        shortcut: `${command} + ${option} + 0`,
        active: paragraphActive,
        disabled: !editor.can().setParagraph(),
        onSelect: () => apply(() => editor.chain().focus().setParagraph().run())
      }
    ];

    if (hasATitle) {
      items.push({
        key: 'ATitle1',
        label: '大标题',
        active: editor.isActive('ATitle', { level: 1 }) && !editor.getAttributes('ATitle').lawLevel,
        disabled: !editor.can().setATitle({ level: 1 }),
        onSelect: () => apply(() => editor.chain().focus().setATitle({ level: 1 }).run())
      });
      LAW_MARKS.forEach(mark => {
        items.push({
          key: mark.lawLevel,
          label: mark.label,
          active: isLawLevelActive(editor, mark.lawLevel),
          disabled: !editor.can().setATitle({ lawLevel: mark.lawLevel }),
          onSelect: () =>
            apply(() => editor.chain().focus().setATitle({ lawLevel: mark.lawLevel }).run())
        });
      });
    }

    visibleHeadingLevels.forEach(level => {
      items.push({
        key: `heading-${level}`,
        label: `${level}级标题`,
        shortcut: `${command} + ${option} + ${level}`,
        active: editor.isActive('heading', { level }),
        disabled: !editor.can().setHeading({ level }),
        onSelect: () => apply(() => editor.chain().focus().setHeading({ level }).run())
      });
    });

    if (hasAWenHao) {
      items.push({
        key: 'wenhao',
        label: '文号',
        active: editor.isActive('AWenHao'),
        disabled: !editor.can().setWenHao(),
        onSelect: () => apply(() => editor.chain().focus().setWenHao().run())
      });
    }

    if (hasATail) {
      items.push({
        key: 'tail',
        label: '落款',
        active: editor.isActive('ATail'),
        disabled: !editor.can().setATail(),
        onSelect: () => apply(() => editor.chain().focus().setATail().run())
      });
    }

    return items;
  }, [
    editor,
    editor.state.doc,
    editor.state.selection,
    hasATitle,
    hasATail,
    hasAWenHao,
    visibleHeadingLevels
  ]);

  const currentLawLevel = editor.getAttributes('ATitle').lawLevel as LawLevel | undefined;
  const currentLabel =
    menuItems.find(item => item.active)?.label ??
    lawMarkOf(currentLawLevel)?.label ??
    (editor.isActive('ATail') ? '落款' : editor.isActive('AWenHao') ? '文号' : '正文');

  const triggerActive = menuItems.some(item => item.active && item.key !== 'paragraph');

  useEffect(() => {
    if (!open) {
      return;
    }
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current?.contains(event.target as Node)) {
        return;
      }
      setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    return () => document.removeEventListener('pointerdown', onPointerDown, true);
  }, [open]);

  return (
    <div className="atiptap-dropdown" ref={rootRef}>
      <TextButton
        className="atiptap-dropdown-trigger"
        title="段落样式"
        onClick={() => setOpen(current => !current)}
        isActive={triggerActive || open}
      >
        <span className="atiptap-dropdown-trigger__head-text">{currentLabel}</span>
        <ChevronDown className="atiptap-dropdown-trigger__head-icon" size={16} />
      </TextButton>
      {open ? (
        <div className="atiptap-dropdown__panel" role="menu" aria-label="段落样式">
          {menuItems.map(item => (
            <button
              key={item.key}
              type="button"
              role="menuitem"
              disabled={item.disabled}
              className={classNames('atiptap-dropdown-menu__item', {
                'atiptap-dropdown-menu__item--active': item.active,
                'atiptap-dropdown-menu__item--disabled': item.disabled
              })}
              onMouseDown={event => event.preventDefault()}
              onClick={() => {
                if (item.disabled) {
                  return;
                }
                item.onSelect();
              }}
            >
              <span className="atiptap-menu-head-row">
                <span
                  className={`atiptap-menu-head-row__title--level${item.key.replace('heading-', '')}`}
                >
                  {item.label}
                </span>
                {item.shortcut ? (
                  <span className="atiptap-menu-head-row__span">{item.shortcut}</span>
                ) : null}
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};
