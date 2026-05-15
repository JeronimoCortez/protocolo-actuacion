import { ArrowRightIcon, DeviceIcon, HouseIcon, MedicalIcon, PhoneIcon } from "./icons";

function ContactIcon({ icon, stroke }) {
  const iconProps = { className: "h-[18px] w-[18px]", style: { color: stroke } };

  if (icon === "medical") return <MedicalIcon {...iconProps} />;
  if (icon === "device") return <DeviceIcon {...iconProps} />;
  if (icon === "house") return <HouseIcon {...iconProps} />;
  return <PhoneIcon {...iconProps} />;
}

export default function ContactsCard({ contacts }) {
  return (
    <section className="surface-card rounded-[1.25rem] border border-[var(--border)] bg-[var(--card)] p-6" aria-labelledby="contacts-heading">
      <h2 id="contacts-heading" className="card-title mb-4 flex items-center gap-2">
        <PhoneIcon className="h-4 w-4 text-[oklch(0.55_0.22_25)]" />
        Contactos de Emergencia
      </h2>

      {contacts.map((contact, index) => (
        <div key={contact.name}>
          <a href={`tel:${contact.number}`} className="flex cursor-pointer items-center gap-3.5 rounded-[0.6rem] p-3 transition hover:bg-[var(--secondary)]">
            <span className={`flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-lg ${contact.iconBg}`}>
              <ContactIcon icon={contact.icon} stroke={contact.iconStroke} />
            </span>
            <span>
              <span className="block text-sm font-semibold text-[var(--heading)]">{contact.name}</span>
              <span className="block text-xs text-[var(--text-soft)]">{contact.number}</span>
            </span>
            <ArrowRightIcon className="ml-auto h-4 w-4 text-[var(--muted-foreground)]" />
          </a>
          {index < contacts.length - 1 && <div className="my-2 h-px bg-[var(--border)]" />}
        </div>
      ))}
    </section>
  );
}
