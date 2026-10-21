import type { ReactNode } from "react";

interface Props {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "center" | "left";
  action?: ReactNode;
  tone?: "dark" | "light";
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  action,
  tone = "dark",
  className = "",
}: Props) {
  const isCenter = align === "center";
  const titleColor = tone === "dark" ? "text-white" : "text-ink";
  const subtitleColor = tone === "dark" ? "text-ash" : "text-neutral-600";

  return (
    <div
      className={`flex flex-col gap-4 ${
        isCenter ? "items-center text-center" : "items-start text-left"
      } ${className}`}
    >
      {eyebrow ? (
        <span className={`eyebrow ${tone === "dark" ? "text-gold" : "text-gold-dark"}`}>{eyebrow}</span>
      ) : null}
      <div className="flex w-full flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <h2
          className={`font-display text-3xl leading-tight tracking-wide sm:text-4xl lg:text-[42px] ${titleColor}`}
        >
          {title}
        </h2>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {subtitle ? (
        <p className={`max-w-2xl text-sm leading-relaxed ${subtitleColor}`}>{subtitle}</p>
      ) : null}
      <div
        className={`gold-rule mt-1 w-full ${isCenter ? "mx-auto max-w-[120px]" : "max-w-[120px]"}`}
      />
    </div>
  );
}
