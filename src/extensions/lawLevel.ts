export type LawLevel =
  'juan' | 'bu' | 'bian' | 'fenbian' | 'zhang' | 'jie' | 'tiao' | 'kuan' | 'xiang' | 'mu';

export type LawMark = {
  lawLevel: LawLevel;
  /** 行首标记，不含末尾空格 */
  md: string;
  className: string;
  label: string;
  /** 目录层级，越小越靠外。款、项、目不进目录 */
  directoryRank: number | null;
  /** 与旧 ATitle level 对齐：章=2，节=3，其余不用数字层级 */
  legacyLevel: 1 | 2 | 3;
};

export const LAW_MARKS: LawMark[] = [
  {
    lawLevel: 'juan',
    md: '!卷',
    className: 'a-tiptap-juan',
    label: '卷',
    directoryRank: 1,
    legacyLevel: 1
  },
  {
    lawLevel: 'bu',
    md: '!部',
    className: 'a-tiptap-bu',
    label: '部',
    directoryRank: 2,
    legacyLevel: 1
  },
  {
    lawLevel: 'bian',
    md: '!编',
    className: 'a-tiptap-bian',
    label: '编',
    directoryRank: 3,
    legacyLevel: 1
  },
  {
    lawLevel: 'fenbian',
    md: '!分编',
    className: 'a-tiptap-fenbian',
    label: '分编',
    directoryRank: 4,
    legacyLevel: 1
  },
  {
    lawLevel: 'zhang',
    md: '!章',
    className: 'a-tiptap-zhang',
    label: '章',
    directoryRank: 5,
    legacyLevel: 2
  },
  {
    lawLevel: 'jie',
    md: '!节',
    className: 'a-tiptap-jie',
    label: '节',
    directoryRank: 6,
    legacyLevel: 3
  },
  {
    lawLevel: 'tiao',
    md: '!条',
    className: 'a-tiptap-tiao',
    label: '条',
    directoryRank: 7,
    legacyLevel: 1
  },
  {
    lawLevel: 'kuan',
    md: '!款',
    className: 'a-tiptap-kuan',
    label: '款',
    directoryRank: null,
    legacyLevel: 1
  },
  {
    lawLevel: 'xiang',
    md: '!项',
    className: 'a-tiptap-xiang',
    label: '项',
    directoryRank: null,
    legacyLevel: 1
  },
  {
    lawLevel: 'mu',
    md: '!目',
    className: 'a-tiptap-mu',
    label: '目',
    directoryRank: null,
    legacyLevel: 1
  }
];

const LAW_MARK_BY_LEVEL = new Map(LAW_MARKS.map(mark => [mark.lawLevel, mark]));
const LAW_MARK_BY_CLASS = new Map(LAW_MARKS.map(mark => [mark.className, mark]));

/** 文书大标题在目录里比卷更靠外 */
export const DOCUMENT_TITLE_RANK = 0;

export function lawMarkOf(lawLevel?: string | null): LawMark | undefined {
  if (!lawLevel) {
    return undefined;
  }
  return LAW_MARK_BY_LEVEL.get(lawLevel as LawLevel);
}

export function lawMarkByClass(className?: string | null): LawMark | undefined {
  if (!className) {
    return undefined;
  }
  return LAW_MARK_BY_CLASS.get(className);
}

export function lawClassName(lawLevel?: string | null, level?: number | null): string {
  const mark = lawMarkOf(lawLevel);
  if (mark) {
    return mark.className;
  }
  return `a-tiptap-title${level || 1}`;
}

/** 旧 level 2/3 没有 lawLevel 时，仍是章、节 */
export function directoryRankOf(lawLevel?: string | null, level?: number | null): number | null {
  const mark = lawMarkOf(lawLevel);
  if (mark) {
    return mark.directoryRank;
  }
  if (level === 1) {
    return DOCUMENT_TITLE_RANK;
  }
  if (level === 2) {
    return lawMarkOf('zhang')?.directoryRank ?? null;
  }
  if (level === 3) {
    return lawMarkOf('jie')?.directoryRank ?? null;
  }
  return null;
}
