"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface AccessibilitySettings {
  highContrast: boolean
  largeText: boolean
  reducedMotion: boolean
  darkMode: boolean
}

interface AccessibilityContextType {
  settings: AccessibilitySettings
  toggleHighContrast: () => void
  toggleLargeText: () => void
  toggleReducedMotion: () => void
  toggleDarkMode: () => void
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    darkMode: false,
  })

  useEffect(() => {
    // Load saved preferences
    const saved = localStorage.getItem("accessibility-settings")
    if (saved) {
      setSettings(JSON.parse(saved))
    }

    // Check system preferences
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSettings((prev) => ({ ...prev, reducedMotion: true }))
    }
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setSettings((prev) => ({ ...prev, darkMode: true }))
    }
  }, [])

  useEffect(() => {
    // Apply settings to document
    const html = document.documentElement

    html.classList.toggle("dark", settings.darkMode)
    html.classList.toggle("high-contrast", settings.highContrast)
    html.classList.toggle("large-text", settings.largeText)

    if (settings.reducedMotion) {
      html.style.setProperty("--animation-duration", "0s")
    } else {
      html.style.removeProperty("--animation-duration")
    }

    // Save preferences
    localStorage.setItem("accessibility-settings", JSON.stringify(settings))
  }, [settings])

  const toggleHighContrast = () => setSettings((prev) => ({ ...prev, highContrast: !prev.highContrast }))
  const toggleLargeText = () => setSettings((prev) => ({ ...prev, largeText: !prev.largeText }))
  const toggleReducedMotion = () => setSettings((prev) => ({ ...prev, reducedMotion: !prev.reducedMotion }))
  const toggleDarkMode = () => setSettings((prev) => ({ ...prev, darkMode: !prev.darkMode }))

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        toggleHighContrast,
        toggleLargeText,
        toggleReducedMotion,
        toggleDarkMode,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error("useAccessibility must be used within AccessibilityProvider")
  }
  return context
}
