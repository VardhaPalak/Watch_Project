import type { SVGProps } from "react";

export type IconName =
  | "truck"
  | "shield"
  | "refresh"
  | "headset"
  | "crown"
  | "search"
  | "user"
  | "cart"
  | "menu"
  | "close"
  | "chevronDown"
  | "chevronRight"
  | "chevronLeft"
  | "arrowRight"
  | "arrowLeft"
  | "star"
  | "heart"
  | "heartFill"
  | "plus"
  | "minus"
  | "trash"
  | "whatsapp"
  | "facebook"
  | "instagram"
  | "youtube"
  | "pinterest"
  | "mail"
  | "phone"
  | "pin"
  | "check"
  | "filter"
  | "grid"
  | "list"
  | "upload"
  | "download"
  | "logout"
  | "settings"
  | "box"
  | "users"
  | "chart"
  | "note"
  | "eye"
  | "clock"
  | "sparkle"
  | "tag"
  | "lock"
  | "play";

const paths: Record<IconName, string> = {
  truck: "M3 7h11v9H3zM14 10h4l3 3v3h-7zM6.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM17.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z",
  shield: "M12 3l7 3v5.5c0 4.3-2.9 7.7-7 9.5-4.1-1.8-7-5.2-7-9.5V6l7-3Zm-3 8.6l2.2 2.3 4.1-4.4",
  refresh: "M20 11a8 8 0 1 0-1.6 6M20 5v6h-6",
  headset: "M4 13v-1a8 8 0 0 1 16 0v1M4 13h2.5a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zm16 0h-2.5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1H19a1 1 0 0 0 1-1z",
  crown: "M3 17h18l-1.2-9-4.3 3.2L12 5 8.5 11.2 4.2 8 3 17Zm2.5 3h13",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm10 2-4.35-4.35",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0",
  cart: "M3 4h2l2.2 10.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L20.5 8H6M10 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
  menu: "M4 7h16M4 12h16M4 17h16",
  close: "M6 6l12 12M18 6L6 18",
  chevronDown: "M6 9l6 6 6-6",
  chevronRight: "M9 6l6 6-6 6",
  chevronLeft: "M15 6l-6 6 6 6",
  arrowRight: "M4 12h16m-6-6 6 6-6 6",
  arrowLeft: "M20 12H4m6-6-6 6 6 6",
  star: "M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1.1 5.9L12 16.9 6.7 19.7l1.1-5.9L3.5 9.7l5.9-.8L12 3.5Z",
  heart: "M12 20s-7.5-4.6-7.5-9.4A4.1 4.1 0 0 1 12 8a4.1 4.1 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20Z",
  heartFill: "M12 20s-7.5-4.6-7.5-9.4A4.1 4.1 0 0 1 12 8a4.1 4.1 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20Z",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  trash: "M4 7h16M9 7V5h6v2m-8 0 1 13h8l1-13",
  whatsapp:
    "M12 3a9 9 0 0 0-7.7 13.6L3 21l4.6-1.2A9 9 0 1 0 12 3Zm4.6 12.3c-.2.6-1.2 1.1-1.7 1.2-.4.1-1 .1-1.6-.1-.4-.1-.9-.3-1.5-.6-2.6-1.1-4.3-3.7-4.4-3.9-.1-.2-1-1.4-1-2.6s.6-1.8.9-2.1c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.9 2.2c.1.2.1.4 0 .5l-.3.5-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.1 1.1 2 1.4 2.3 1.6.3.1.5.1.6-.1l.8-1c.2-.2.4-.2.6-.1l2.1 1c.3.1.5.2.5.4.1.2.1.7-.1 1.2Z",
  facebook: "M14 8h2.5V4.5H14c-2.2 0-3.8 1.6-3.8 3.8V11H8v3.5h2.2V21H14v-6.5h2.6l.4-3.5H14V8.7c0-.5.3-.7 1-.7Z",
  instagram:
    "M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9A4.5 4.5 0 0 1 16.5 21h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3Zm4.5 5.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm5.2-.7h.01",
  youtube:
    "M21 12s0-3.4-.4-5a2.7 2.7 0 0 0-1.9-1.9C17 4.7 12 4.7 12 4.7s-5 0-6.7.4A2.7 2.7 0 0 0 3.4 7C3 8.6 3 12 3 12s0 3.4.4 5a2.7 2.7 0 0 0 1.9 1.9c1.7.4 6.7.4 6.7.4s5 0 6.7-.4a2.7 2.7 0 0 0 1.9-1.9C21 15.4 21 12 21 12ZM10 15V9l5 3-5 3Z",
  pinterest: "M12 3a9 9 0 0 0-3.6 17.2c-.1-.8-.2-2 0-2.9l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.4 1.8-2.4.9 0 1.3.6 1.3 1.4 0 .9-.6 2.2-.9 3.4-.2 1 .5 1.8 1.5 1.8 1.8 0 3.1-1.9 3.1-4.6 0-2.4-1.7-4.1-4.2-4.1a4.4 4.4 0 0 0-4.6 4.4c0 .9.3 1.8.8 2.3.1.1.1.2.1.3l-.3 1.1c0 .2-.2.3-.4.2-1.3-.6-2.1-2.5-2.1-4 0-3.2 2.4-6.2 6.8-6.2 3.6 0 6.4 2.6 6.4 6 0 3.6-2.2 6.5-5.4 6.5-1 0-2-.5-2.4-1.2l-.6 2.5c-.2.9-.8 2-1.2 2.6A9 9 0 1 0 12 3Z",
  mail: "M3 6h18v12H3z m0 .5 9 6.5 9-6.5",
  phone:
    "M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 6.5 6.5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.2 2 2 0 0 1 6.5 3Z",
  pin: "M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  check: "M5 12.5 9.5 17 19 7",
  filter: "M4 6h16M7 12h10m-7 6h4",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  list: "M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01",
  upload: "M12 16V4m0 0L7 9m5-5 5 5M4 17v3h16v-3",
  download: "M12 4v12m0 0 5-5m-5 5-5-5M4 17v3h16v-3",
  logout: "M15 12H4m0 0 4-4m-4 4 4 4M10 4h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-8",
  settings:
    "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8.4-3a8.4 8.4 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a8.5 8.5 0 0 0-2-1.2L15.5 3h-4l-.4 2.6a8.5 8.5 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6a8.4 8.4 0 0 0 0 2.4l-2 1.6 2 3.4 2.4-1a8.5 8.5 0 0 0 2 1.2l.4 2.6h4l.4-2.6a8.5 8.5 0 0 0 2-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2Z",
  box: "M12 3 3 7.5v9L12 21l9-4.5v-9L12 3Zm0 0v18M3 7.5 12 12l9-4.5",
  users:
    "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM2.5 20a6.5 6.5 0 0 1 13 0M16.5 11.5a3 3 0 1 0 0-6M18 20h3.5a5.5 5.5 0 0 0-3.5-5.1",
  chart: "M4 20V10m5 10V4m5 16v-7m5 7V8",
  note: "M5 4h14v12l-4 4H5zM15 20v-4h4",
  eye: "M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Zm9.5 2.8a2.8 2.8 0 1 0 0-5.6 2.8 2.8 0 0 0 0 5.6Z",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-14v5l3.5 2",
  sparkle: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z",
  tag: "M20 4h-7L3 14l7 7 10-10V4Zm-3.5 5.5h.01",
  lock: "M6 11h12v10H6zM9 11V8a3 3 0 0 1 6 0v3",
  play: "M8 5.5 18 12 8 18.5v-13Z",
};

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

export default function Icon({ name, size = 18, className, ...rest }: IconProps) {
  const isFilled = name === "heartFill" || name === "star" || name === "play" || name === "crown";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={isFilled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <path d={paths[name]} />
    </svg>
  );
}
