import ActionsSection from "./components/ActionsSection";
import FloatingEmergencyFab from "./components/FloatingEmergencyFab";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import { actionCards, contacts, navItems, quickAccess } from "./data/home";

export default function HomePage() {
  return (
    <>

      <Header navItems={navItems} />

      <main id="main">
        <HeroSection />
        <ActionsSection actionCards={actionCards} contacts={contacts} />
      </main>

      <FloatingEmergencyFab quickAccess={quickAccess} />
    </>
  );
}