import { NextRequest, NextResponse } from "next/server"
import {
  complementaryProtocolGroups,
  procedureCatalog,
  thematicAxisGroups,
} from "@/lib/thematic-protocols"
import { protocolsCatalog } from "@/lib/protocols-data"

type SearchResultType = "eje" | "procedimiento" | "protocolo"

interface SearchEntry {
  id: string
  title: string
  type: SearchResultType
  href: string
  subtitle?: string
  normalizedTitle: string
}

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()

const axisEntries: SearchEntry[] = [...thematicAxisGroups, ...complementaryProtocolGroups].map((axis) => ({
  id: axis.id,
  title: axis.displayTitle,
  type: "eje",
  href: `/protocolos#${axis.id}`,
  subtitle: "Ir al eje en Protocolos",
  normalizedTitle: normalizeText(axis.displayTitle),
}))

const procedureEntries: SearchEntry[] = procedureCatalog.map((procedure) => ({
  id: procedure.id,
  title: procedure.title,
  type: "procedimiento",
  href: `/procedimientos/${encodeURIComponent(procedure.id)}`,
  subtitle: procedure.axisTitle,
  normalizedTitle: normalizeText(procedure.title),
}))

const protocolEntries: SearchEntry[] = protocolsCatalog.map((protocol) => ({
  id: protocol.id,
  title: protocol.title,
  type: "protocolo",
  href: protocol.href,
  subtitle: protocol.status === "available" ? "Protocolo disponible" : "Protocolo en desarrollo",
  normalizedTitle: normalizeText(protocol.title),
}))

const searchEntries: SearchEntry[] = [...axisEntries, ...procedureEntries, ...protocolEntries]

const getScore = (entry: SearchEntry, normalizedQuery: string) => {
  if (entry.normalizedTitle === normalizedQuery) {
    return 120
  }

  if (entry.normalizedTitle.startsWith(normalizedQuery)) {
    return 95
  }

  if (entry.normalizedTitle.includes(normalizedQuery)) {
    return 70
  }

  return 0
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? ""
  const normalizedQuery = normalizeText(query)

  if (normalizedQuery.length < 2) {
    return NextResponse.json({ results: [] })
  }

  const results = searchEntries
    .map((entry) => ({
      ...entry,
      score: getScore(entry, normalizedQuery),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score
      }

      if (a.type === "eje" && b.type !== "eje") {
        return -1
      }

      if (b.type === "eje" && a.type !== "eje") {
        return 1
      }

      return a.title.localeCompare(b.title)
    })
    .slice(0, 8)
    .map(({ normalizedTitle: _normalizedTitle, score: _score, ...entry }) => entry)

  return NextResponse.json({ results })
}
