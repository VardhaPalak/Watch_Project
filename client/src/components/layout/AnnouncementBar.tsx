import Icon from "../ui/Icon";
import { ANNOUNCEMENTS } from "../../config/site";

export default function AnnouncementBar() {
  return (
    <div className="relative z-[60] hidden border-b border-white/10 bg-black md:block">
      <div className="container-luxe flex h-10 items-center justify-between">
        <ul className="flex w-full items-center justify-between gap-4">
          {ANNOUNCEMENTS.map((item) => (
            <li key={item.title} className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-ash">
              <Icon name={item.icon} size={14} className="text-gold" />
              <span className="text-warm-white/90">{item.title}</span>
              <span className="text-white/25">|</span>
              <span>{item.detail}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
