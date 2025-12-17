"use client";


export function ProceduresCards() {
  return (
    <div
      className="
  w-full
  mx-auto
  my-6
  px-4
  grid
  grid-cols-1
  sm:grid-cols-2
  lg:grid-cols-3
  gap-6
"
    >
      {/* Card Actas */}
      <div className="bg-gradient-to-br from-primary/15 to-primary/5 rounded-2xl border-2 border-primary/30 p-4 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between  ">
          <div>
            <h3 className="text-2xl font-bold text-primary mb-1">Actas</h3>
          </div>
        </div>
        <div className="pt-4 border-t border-primary/15 flex flex-col gap-2">
          <a className="flex items-center gap-4 p-4 bg-primary/10 rounded-xl hover:bg-primary/15 transition-colors focus-visible:ring-2 focus-visible:ring-ring">
            <div className="flex items-center gap-5 cursor-pointer">
              <p className="text-sm text-muted-foreground mb-1">
                Descargar Acta {"(Sin datos)"}
              </p>
              <p className="text-lg font-semibold text-primary">↗</p>
            </div>
          </a>
          <a className="flex items-center gap-4 p-4 bg-primary/10 rounded-xl hover:bg-primary/15 transition-colors focus-visible:ring-2 focus-visible:ring-ring">
            <div className="flex items-center gap-5 cursor-pointer">
              <p className="text-sm text-muted-foreground mb-1">
                Rellenar datos
              </p>
              <p className="text-lg font-semibold text-primary">↗</p>
            </div>
          </a>
        </div>
      </div>
      {/* Card Comunicacion institucional */}
      <div className="bg-gradient-to-br from-primary/15 to-primary/5 rounded-2xl border-2 border-primary/30 p-4  ">
        <div className="flex items-start justify-between w-[15rem]">
          <div>
            <h3 className="text-2xl font-bold text-primary mb-1">Comunicación institucional</h3>
          </div>
        </div>
        <div className="pt-4 border-t border-primary/15 flex flex-col gap-2">
          <a className="flex items-center gap-4 p-4 bg-primary/10 rounded-xl hover:bg-primary/15 transition-colors focus-visible:ring-2 focus-visible:ring-ring">
            <div className="flex items-center gap-5 cursor-pointer">
              <p className="text-sm text-muted-foreground mb-1">
                Ir a comunicacion institucional
              </p>
              <p className="text-lg font-semibold text-primary">↗</p>
            </div>
          </a>
        
        </div>
      </div>
      {/* Card procedimientos */}
      <div className="bg-gradient-to-br from-primary/15 to-primary/5 rounded-2xl border-2 border-primary/30 p-4 ">
        <div className="flex items-start justify-between w-[15rem]">
          <div>
            <h3 className="text-2xl font-bold text-primary mb-1">Todos los protocolos</h3>
          </div>
        </div>
        <div className="pt-4 border-t border-primary/15 flex flex-col gap-2">
          <a className="flex items-center gap-4 p-4 bg-primary/10 rounded-xl hover:bg-primary/15 transition-colors focus-visible:ring-2 focus-visible:ring-ring">
            <div className="flex items-center gap-5 cursor-pointer">
              <p className="text-sm text-muted-foreground mb-1">
                Ver todos los protocolos
              </p>
              <p className="text-lg font-semibold text-primary">↗</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
