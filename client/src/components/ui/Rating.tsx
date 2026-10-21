import Icon from "./Icon";

interface Props {
  value: number;
  count?: number;
  size?: number;
  tone?: "gold" | "dark";
  showCount?: boolean;
  className?: string;
}

export default function Rating({
  value,
  count,
  size = 13,
  tone = "gold",
  showCount = true,
  className = "",
}: Props) {
  const stars = [0, 1, 2, 3, 4];
  const color = tone === "gold" ? "text-gold" : "text-ink/70";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-0.5" aria-label={`Rated ${value} out of 5`}>
        {stars.map((index) => {
          const filled = value >= index + 0.75;
          const half = !filled && value >= index + 0.25;
          return (
            <span key={index} className={`relative ${color}`}>
              <Icon name="star" size={size} className={filled || half ? "" : "opacity-30"} />
            </span>
          );
        })}
      </div>
      {showCount && typeof count === "number" ? (
        <span className="text-[11px] tracking-wide text-ash">({count})</span>
      ) : null}
    </div>
  );
}
