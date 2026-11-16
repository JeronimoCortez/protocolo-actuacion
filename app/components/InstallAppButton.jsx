"use client";

import { Download, EllipsisVertical, MonitorDown, Share, SquarePlus, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

// El navegador dispara "beforeinstallprompt" una sola vez por carga: se guarda a nivel de módulo
// para que cualquier instancia del botón (header o home) pueda usarlo.
let deferredPrompt = null;
const listeners = new Set();

function notify() {
  listeners.forEach((listener) => listener());
}

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
    notify();
  });
  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    notify();
  });
}

function detectPlatform() {
  const ua = window.navigator.userAgent;
  const isIos = /iPad|iPhone|iPod/.test(ua) || (ua.includes("Macintosh") && window.navigator.maxTouchPoints > 1);
  if (isIos) return "ios";
  const isSafari = /Safari/.test(ua) && !/Chrome|Chromium|CriOS|Edg|OPR|Firefox|FxiOS/.test(ua);
  if (isSafari) return "safari-mac";
  if (/Firefox/.test(ua)) return "firefox";
  if (/Android/.test(ua)) return "android";
  return "desktop";
}

function isStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

const INSTRUCTIONS = {
  ios: {
    title: "Agregar a la pantalla de inicio",
    intro: "En iPhone y iPad el acceso directo se agrega desde el menú Compartir:",
    steps: [
      { icon: Share, text: <>Tocá el botón <strong>Compartir</strong> en la barra del navegador.</> },
      { icon: SquarePlus, text: <>Deslizá y elegí <strong>Agregar a inicio</strong> (o “Agregar a pantalla de inicio”).</> },
      { icon: null, text: <>Confirmá con <strong>Agregar</strong>. El icono del Protocolo quedará en tu pantalla de inicio.</> },
    ],
  },
  "safari-mac": {
    title: "Agregar al Dock",
    intro: "En Safari para Mac el acceso directo se agrega desde el menú:",
    steps: [
      { icon: Share, text: <>Abrí el menú <strong>Archivo</strong> (o el botón Compartir).</> },
      { icon: SquarePlus, text: <>Elegí <strong>Agregar al Dock</strong> y confirmá.</> },
    ],
  },
  android: {
    title: "Agregar a la pantalla de inicio",
    intro: "Si no apareció el aviso de instalación, podés hacerlo desde el menú del navegador:",
    steps: [
      { icon: EllipsisVertical, text: <>Tocá el menú <strong>⋮</strong> del navegador.</> },
      { icon: SquarePlus, text: <>Elegí <strong>Instalar app</strong> o <strong>Agregar a pantalla de inicio</strong>.</> },
    ],
  },
  firefox: {
    title: "Crear acceso directo",
    intro: "Firefox para escritorio no permite instalar la app. Podés abrirla desde Chrome o Edge para instalarla, o guardarla en marcadores con Ctrl + D.",
    steps: [],
  },
  desktop: {
    title: "Instalar la app",
    intro: "Si no apareció el aviso de instalación, podés hacerlo desde el navegador:",
    steps: [
      { icon: MonitorDown, text: <>Hacé clic en el icono <strong>Instalar</strong> en la barra de direcciones.</> },
      { icon: EllipsisVertical, text: <>O abrí el menú <strong>⋮</strong> y elegí <strong>Instalar Protocolo DAE</strong>.</> },
    ],
  },
};

function InstructionsModal({ platform, onClose }) {
  const content = INSTRUCTIONS[platform] ?? INSTRUCTIONS.desktop;

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/50 p-4 sm:items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="install-modal-title"
        className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <img src="/icons/icon-192.png" alt="" className="h-12 w-12 rounded-xl border border-slate-200" />
            <h2 id="install-modal-title" className="section-title text-lg">
              {content.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--heading)] transition hover:bg-slate-50"
            autoFocus
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="supporting-copy mt-4">{content.intro}</p>

        {content.steps.length ? (
          <ol className="mt-4 space-y-3">
            {content.steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <p className="control-text flex-1 pt-1 text-slate-700">
                    {step.text}
                    {Icon ? <Icon className="ml-1.5 inline h-4 w-4 align-[-2px] text-[var(--primary)]" aria-hidden="true" /> : null}
                  </p>
                </li>
              );
            })}
          </ol>
        ) : null}

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Entendido
        </button>
      </div>
    </div>,
    document.body
  );
}

export default function InstallAppButton({ variant = "header", className = "" }) {
  const [mounted, setMounted] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [platform, setPlatform] = useState("desktop");
  const [, forceUpdate] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  useEffect(() => {
    setMounted(true);
    setPlatform(detectPlatform());
    setInstalled(isStandalone());

    const listener = () => {
      forceUpdate((value) => value + 1);
      setInstalled(isStandalone());
    };
    listeners.add(listener);
    return () => listeners.delete(listener);
  }, []);

  // Evita diferencias de hidratación y oculta el botón si ya se abre como app instalada.
  if (!mounted || installed) return null;

  const handleClick = async () => {
    if (deferredPrompt) {
      const promptEvent = deferredPrompt;
      deferredPrompt = null;
      promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      if (outcome === "accepted") setInstalled(true);
      notify();
      return;
    }
    setIsModalOpen(true);
  };

  const label = "Instalar app";

  const styles =
    variant === "home"
      ? "flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-[var(--primary)] bg-white px-4 py-3 text-sm font-semibold text-[var(--primary)] shadow-sm transition hover:bg-[oklch(0.97_0.01_250)]"
      : "inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg border border-[var(--border)] bg-[var(--secondary)] px-3 py-1.5 text-sm font-medium text-[var(--heading)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]";

  return (
    <>
      <button type="button" onClick={handleClick} aria-label={label} title={label} className={`${styles} ${className}`.trim()}>
        <Download className={variant === "home" ? "h-5 w-5" : "h-4 w-4"} aria-hidden="true" />
        {/* En el header el texto se oculta en anchos intermedios para no romper la barra */}
        <span className={variant === "home" ? "" : "hidden xl:inline"}>{label}</span>
      </button>
      {isModalOpen ? <InstructionsModal platform={platform} onClose={closeModal} /> : null}
    </>
  );
}
