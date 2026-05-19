import DaeCentralCard from "./DaeCentralCard";

export default function HeroSection() {
  return (
    <section
      className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-6 px-4 pb-10 pt-8 md:gap-10 md:px-6 md:pb-10 md:pt-14"
      aria-label="Presentacion"
    >
      <div className="flex items-center">
        <h1 className="page-title max-w-[18ch] lg:max-w-none text-center">
          Protocolo de Actuacion ante situaciones emergentes en el ambito escolar
        </h1>
      </div>

      <DaeCentralCard className="lg:hidden" />
    </section>
  );
}
