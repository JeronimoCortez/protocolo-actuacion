import ActionCard from "./ActionCard";
import ContactsCard from "./ContactsCard";
import RightRailActions from "./RightRailActions";

export default function ActionsSection({ actionCards, contacts }) {
  return (
    <section
      className="mx-auto grid w-full max-w-[1200px] grid-cols-1 items-start gap-6 px-4 pb-12 md:gap-10 md:px-6 lg:grid-cols-[1fr_380px]"
      aria-label="Acciones principales"
    >
      <div className="flex flex-col gap-4">
        {actionCards.map((card) => (
          <ActionCard key={card.id} card={card} />
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <RightRailActions />
        <ContactsCard contacts={contacts} />
      </div>
    </section>
  );
}