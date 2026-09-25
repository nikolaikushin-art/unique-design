type IconName =
  | "car" | "chevron" | "profile" | "swatch" | "shield" | "drop" | "wheel" | "glass" | "light" | "seat" | "sparkle" | "spec"
  | "rotate" | "compare" | "save" | "close" | "check" | "plus" | "history" | "club" | "settings" | "home" | "grid" | "user" | "share" | "copy" | "pin" | "route";

const paths: Record<IconName, JSX.Element> = {
  car: <path d="m3 13 1.7-4.2A2.8 2.8 0 0 1 7.3 7h9.4a2.8 2.8 0 0 1 2.6 1.8L21 13v5h-2v-2H5v2H3z" />,
  chevron: <path d="m7 10 5 5 5-5" />,
  profile: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20c.7-3.5 3.1-5.3 7-5.3s6.3 1.8 7 5.3" /></>,
  swatch: <><rect x="3" y="3" width="8" height="8" rx="2" /><rect x="13" y="3" width="8" height="8" rx="2" /><rect x="3" y="13" width="8" height="8" rx="2" /><rect x="13" y="13" width="8" height="8" rx="2" /></>,
  shield: <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" />,
  drop: <path d="M12 3s6 6.5 6 11a6 6 0 1 1-12 0c0-4.5 6-11 6-11Z" />,
  wheel: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="2.4" /><path d="M12 4v3.5M12 16.5V20M4 12h3.5M16.5 12H20" /></>,
  glass: <path d="M4 7h16l-2 8a3 3 0 0 1-3 2H9a3 3 0 0 1-3-2L4 7Z" />,
  light: <><circle cx="12" cy="12" r="4" /><path d="M12 2v3M12 19v3M4.2 4.2l2 2M17.8 17.8l2 2M2 12h3M19 12h3M4.2 19.8l2-2M17.8 6.2l2-2" /></>,
  seat: <path d="M7 4h6a2 2 0 0 1 2 2v6h2a2 2 0 0 1 2 2v6H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />,
  sparkle: <path d="M12 3l1.6 4.9L18 9.5l-4.4 1.6L12 16l-1.6-4.9L6 9.5l4.4-1.6L12 3Z" />,
  spec: <><path d="M4 5h16M4 12h16M4 19h10" /></>,
  rotate: <><path d="M20 11a8 8 0 0 0-14-5L4 8" /><path d="M4 4v4h4m-4 5a8 8 0 0 0 14 5l2-2" /><path d="M20 20v-4h-4" /></>,
  compare: <><path d="M12 3v18M4 7h5m6 0h5M4 17h5m6 0h5" /><circle cx="12" cy="12" r="9" /></>,
  save: <><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" /><path d="M17 21v-8H7v8M7 3v5h8" /></>,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  check: <path d="m5 13 4 4 10-10" />,
  plus: <path d="M12 5v14M5 12h14" />,
  history: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3.2 2" /></>,
  club: <><circle cx="8" cy="9" r="3" /><circle cx="16" cy="9" r="3" /><path d="M2.5 20c.6-3.4 2.7-5.2 5.5-5.2S13.4 16.6 14 20M9.5 20c.6-3.4 2.7-5.2 5.5-5.2S20.9 16.6 21.5 20" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 13a7.6 7.6 0 0 0 0-2l2-1.5-2-3.4-2.4.7a7.6 7.6 0 0 0-1.7-1L15 3h-4l-.3 2.8a7.6 7.6 0 0 0-1.7 1l-2.4-.7-2 3.4L6.6 11a7.6 7.6 0 0 0 0 2l-2 1.5 2 3.4 2.4-.7a7.6 7.6 0 0 0 1.7 1L11 21h4l.3-2.8a7.6 7.6 0 0 0 1.7-1l2.4.7 2-3.4-2-1.5Z" /></>,
  home: <><path d="M4 11 12 4l8 7" /><path d="M6 10v9a1 1 0 0 0 1 1h4v-6h2v6h4a1 1 0 0 0 1-1v-9" /></>,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
  user: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20c.7-3.5 3.1-5.3 7-5.3s6.3 1.8 7 5.3" /></>,
  share: <><circle cx="18" cy="5" r="2.4" /><circle cx="6" cy="12" r="2.4" /><circle cx="18" cy="19" r="2.4" /><path d="m8.2 10.8 7.6-4.2M8.2 13.2l7.6 4.2" /></>,
  copy: <><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V6a2 2 0 0 1 2-2h9" /></>,
  pin: <><path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.4" /></>,
  route: <><circle cx="6" cy="6" r="2.2" /><circle cx="18" cy="18" r="2.2" /><path d="M6 8.2V13a4 4 0 0 0 4 4h4.5" /><path d="m17 14 3 3-3 3" /></>,
};

export function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}
export type { IconName };
