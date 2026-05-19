import ActionCard from "./ActionCard";
import ContactsCard from "./ContactsCard";
import DaeCentralCard from "./DaeCentralCard";
import RightRailActions from "./RightRailActions";

export default function ActionsSection({ actionCards, contacts }) {
  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 pb-12 md:px-6" aria-label="Acciones principales">
      <div className="grid grid-cols-1 items-start gap-6 md:gap-10 lg:hidden">
        <div className="flex flex-col gap-4 md:gap-5">
          {actionCards.map((card) => (
            <ActionCard key={card.id} card={card} />
          ))}
        </div>

        <div className="flex flex-col gap-4 md:gap-5">
          <RightRailActions />
          <ContactsCard contacts={contacts} />
        </div>
      </div>

      <div className="hidden gap-6 lg:flex lg:flex-col">
        <div className="grid items-start gap-6 lg:grid-cols-[1fr_380px]">
          <div className="flex flex-col gap-4 md:gap-5 lg:self-center">
            {actionCards.map((card) => (
              <ActionCard key={`desktop-${card.id}`} card={card} />
            ))}
          </div>

          <div className="flex flex-col gap-4 md:gap-5">
            <DaeCentralCard />
            <RightRailActions />
          </div>
        </div>

        <ContactsCard contacts={contacts} />
      </div>
    </section>
  );
}
