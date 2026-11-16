import { ArrowRightIcon } from "./icons";
import { PALABRA_COLORS, PalabraIcon } from "./brandIcons";

const cardStyles = {
  red: {
    container:
      "border-[oklch(0.88_0.05_25)] bg-[oklch(0.97_0.01_25)] hover:-translate-y-0.5 hover:border-[oklch(0.7_0.15_25)] hover:shadow-action-red",
    label: "text-[oklch(0.55_0.22_25)]",
  },
  yellow: {
    container:
      "border-[oklch(0.9_0.06_80)] bg-[oklch(0.98_0.02_85)] hover:-translate-y-0.5 hover:border-[oklch(0.8_0.15_75)] hover:shadow-action-yellow",
    label: "text-[oklch(0.6_0.14_70)]",
  },
  green: {
    container:
      "border-[oklch(0.88_0.05_150)] bg-[oklch(0.97_0.01_150)] hover:-translate-y-0.5 hover:border-[oklch(0.6_0.12_150)] hover:shadow-action-green",
    label: "text-[oklch(0.45_0.18_150)]",
  },
};

export default function ActionCard({ card }) {
  const styles = cardStyles[card.color];

  return (
    <a
      href={card.link}
      type="button"
      className={`group relative flex items-center gap-5 overflow-hidden rounded-2xl border-2 p-6 text-left transition duration-200 ${styles.container} ${
        card.disabled ? "cursor-not-allowed opacity-90" : "cursor-pointer"
      }`}
    >
      {card.icon && PALABRA_COLORS[card.icon] ? (
        <PalabraIcon letra={card.icon} className="h-14 w-14" />
      ) : (
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-700">
          <ArrowRightIcon className="h-6 w-6 text-white" />
        </span>
      )}
      <span>
        <span
          className={`label-text mb-1 block ${styles.label}`}
        >
          {card.label}
        </span>
        <span className="card-title mb-0.5 block text-lg italic">
          {card.title}
        </span>
        <span className="supporting-copy block">
          {card.description}
        </span>
      </span>
      <ArrowRightIcon className="ml-auto h-5 w-5 opacity-40 transition group-hover:translate-x-1 group-hover:opacity-100" />
    </a>
  );
}
