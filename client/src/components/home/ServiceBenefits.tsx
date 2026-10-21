import Icon from "../ui/Icon";
import { SERVICE_BENEFITS } from "../../config/site";
import Reveal from "../ui/Reveal";

export default function ServiceBenefits() {
  return (
    <section className="bg-off-white text-ink">
      <div className="container-luxe py-10 md:py-12">
        <ul className="grid grid-cols-2 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
          {SERVICE_BENEFITS.map((benefit, index) => (
            <Reveal
              key={benefit.title}
              delay={index * 70}
              className="flex items-center justify-center gap-3 px-2 text-center lg:px-4"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold-dark">
                <Icon name={benefit.icon} size={18} />
              </span>
              <span className="text-left">
                <span className="block text-[11px] font-medium uppercase tracking-[0.16em] text-ink">
                  {benefit.title}
                </span>
                <span className="mt-0.5 block text-[11px] text-neutral-500">{benefit.detail}</span>
              </span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
