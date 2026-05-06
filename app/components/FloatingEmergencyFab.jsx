"use client";

import { useState } from "react";
import { AlertCircleIcon, ChevronUpIcon, GlobeIcon, MedicalIcon, PhoneIcon, XIcon } from "./icons";

function QuickAccessIcon({ icon }) {
  if (icon === "medical") return <MedicalIcon className="h-4 w-4 text-white" />;
  if (icon === "phone") return <PhoneIcon className="h-4 w-4 text-white" />;
  if (icon === "globe") return <GlobeIcon className="h-4 w-4 text-white" />;
  return <AlertCircleIcon className="h-4 w-4 text-white" />;
}

export default function FloatingEmergencyFab({ quickAccess }) {
  const [isFabOpen, setIsFabOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3">
      {isFabOpen && (
        <div
          id="fab-menu"
          role="dialog"
          aria-label="Acceso rápido"
          aria-modal="true"
          className="flex w-[260px] animate-slide-up flex-col gap-2 rounded-2xl border border-[oklch(0.25_0.02_250)] bg-[oklch(0.15_0.02_250)] p-5 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5)]"
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[0.95rem] font-bold text-white">Acceso Rápido</span>
            <button
              className="flex h-6 w-6 items-center justify-center rounded bg-[oklch(0.25_0.02_250)] text-base font-light text-[oklch(0.7_0_0)] transition hover:bg-[oklch(0.3_0.02_250)] hover:text-white"
              aria-label="Cerrar"
              onClick={() => setIsFabOpen(false)}
              type="button"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>

          {quickAccess.map((item) => {
            if (item.disabled) {
              return (
                <button
                  key={item.label}
                  type="button"
                  title="Sección en desarrollo"
                  className={`flex w-full cursor-not-allowed items-center gap-3 rounded-[0.65rem] px-4 py-3 text-left text-sm font-semibold ${item.colorClass}`}
                >
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${item.iconBgClass}`}>
                    <QuickAccessIcon icon={item.icon} />
                  </span>
                  {item.label}
                </button>
              );
            }

            return (
              <a
                key={item.label}
                href={item.href}
                className={`flex w-full items-center gap-3 rounded-[0.65rem] px-4 py-3 text-left text-sm font-semibold transition hover:scale-[0.98] hover:opacity-85 ${item.colorClass}`}
              >
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${item.iconBgClass}`}>
                  <QuickAccessIcon icon={item.icon} />
                </span>
                {item.label}
              </a>
            );
          })}
        </div>
      )}

      <button
        className={`flex h-[58px] w-[58px] items-center justify-center rounded-full text-white transition hover:scale-105 ${
          isFabOpen
            ? "bg-[oklch(0.3_0.03_250)] shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
            : "animate-emergency-pulse bg-[oklch(0.5_0.25_25)] shadow-[0_4px_20px_oklch(0.5_0.25_25_/_0.5)]"
        }`}
        aria-label="Acceso rápido de emergencia"
        aria-expanded={isFabOpen}
        aria-controls="fab-menu"
        onClick={() => setIsFabOpen((prev) => !prev)}
        type="button"
      >
        {isFabOpen ? <ChevronUpIcon className="h-6 w-6" /> : <AlertCircleIcon className="h-6 w-6" />}
      </button>
    </div>
  );
}
