import { ArrowRightIcon } from "./icons";

const cardStyles = {
  red: {
    container:
      "border-[oklch(0.88_0.05_25)] bg-[oklch(0.97_0.01_25)] hover:-translate-y-0.5 hover:border-[oklch(0.7_0.15_25)] hover:shadow-action-red",
    iconBg: "bg-[oklch(0.55_0.22_25)]",
    label: "text-[oklch(0.55_0.22_25)]",
  },
  blue: {
    container:
      "border-[oklch(0.88_0.04_250)] bg-[oklch(0.97_0.01_250)] hover:-translate-y-0.5 hover:border-[oklch(0.6_0.1_250)] hover:shadow-action-blue",
    iconBg: "bg-[var(--primary)]",
    label: "text-[var(--primary)]",
  },
  green: {
    container:
      "border-[oklch(0.88_0.05_150)] bg-[oklch(0.97_0.01_150)] hover:-translate-y-0.5 hover:border-[oklch(0.6_0.12_150)] hover:shadow-action-green",
    iconBg: "bg-[oklch(0.45_0.18_150)]",
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
      <span
        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${styles.iconBg}`}
      >
        <ArrowRightIcon className="h-6 w-6 text-white" />
      </span>
      <span>
        <span
          className={`label-text mb-1 block ${styles.label}`}
        >
          {card.label}
        </span>
        <span className="card-title mb-0.5 block">
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
