import { protocolos as rawProtocolGroups } from "@/app/protocolos"

export interface ProcedureNode {
  id: string
  titulo: string
  codigo?: string
  descripcion?: string
  pasos?: string[]
  contenido?: string[]
  secciones?: ProcedureNode[]
  subsecciones?: ProcedureNode[]
}

export interface ProtocolAxisGroup {
  id: string
  titulo: string
  protocolos: ProcedureNode[]
}

export interface ProtocolAxisGroupView extends ProtocolAxisGroup {
  displayTitle: string
  isThematicAxis: boolean
  axisNumber: number | null
  protocolCount: number
  actionCount: number
}

export interface ProcedureCatalogItem {
  id: string
  title: string
  code?: string
  summary: string
  axisId: string
  axisTitle: string
  actionCount: number
}

const AXIS_TITLE_REGEX = /^Eje\s+(\d+)\s*[:\-]/i

const protocolGroups = rawProtocolGroups as ProtocolAxisGroup[]

export const getNodeChildren = (node: ProcedureNode): ProcedureNode[] => [
  ...(node.secciones ?? []),
  ...(node.subsecciones ?? []),
]

export const countNodeActions = (node: ProcedureNode): number => {
  const directActions = (node.pasos?.length ?? 0) + (node.contenido?.length ?? 0)
  return directActions + getNodeChildren(node).reduce((sum, child) => sum + countNodeActions(child), 0)
}

const getAxisNumber = (group: ProtocolAxisGroup): number | null => {
  const titleMatch = group.titulo.match(AXIS_TITLE_REGEX)
  if (titleMatch?.[1]) {
    return Number(titleMatch[1])
  }

  const idMatch = group.id.match(/^eje-(\d+)/i)
  if (idMatch?.[1]) {
    return Number(idMatch[1])
  }

  return null
}

const getAxisDisplayTitle = (title: string) => title.replace(/^Eje\s+(\d+)\s*:/i, "Eje $1 -")

export const protocolAxisGroups: ProtocolAxisGroupView[] = protocolGroups.map((group) => {
  const axisNumber = getAxisNumber(group)
  const isThematicAxis = axisNumber !== null

  return {
    ...group,
    displayTitle: isThematicAxis ? getAxisDisplayTitle(group.titulo) : group.titulo,
    isThematicAxis,
    axisNumber,
    protocolCount: group.protocolos.length,
    actionCount: group.protocolos.reduce((sum, protocol) => sum + countNodeActions(protocol), 0),
  }
})

export const thematicAxisGroups = [...protocolAxisGroups]
  .filter((group) => group.isThematicAxis)
  .sort((a, b) => (a.axisNumber ?? Number.MAX_SAFE_INTEGER) - (b.axisNumber ?? Number.MAX_SAFE_INTEGER))

export const complementaryProtocolGroups = protocolAxisGroups.filter((group) => !group.isThematicAxis)

export const getProtocolSummary = (protocol: ProcedureNode): string => {
  if (protocol.descripcion) {
    return protocol.descripcion
  }

  const firstChildWithDescription = getNodeChildren(protocol).find((child) => child.descripcion)
  if (firstChildWithDescription?.descripcion) {
    return firstChildWithDescription.descripcion
  }

  const firstAction = protocol.pasos?.[0] ?? protocol.contenido?.[0]
  if (firstAction) {
    return firstAction
  }

  return "Abrir para ver el procedimiento completo."
}

const allAxisGroups = [...thematicAxisGroups, ...complementaryProtocolGroups]

export const procedureCatalog: ProcedureCatalogItem[] = allAxisGroups.flatMap((axis) =>
  axis.protocolos.map((protocol) => ({
    id: protocol.id,
    title: protocol.titulo,
    code: protocol.codigo,
    summary: getProtocolSummary(protocol),
    axisId: axis.id,
    axisTitle: axis.displayTitle,
    actionCount: countNodeActions(protocol),
  })),
)

export const getProcedureById = (id: string) => {
  for (const axis of allAxisGroups) {
    const procedure = axis.protocolos.find((protocol) => protocol.id === id)
    if (procedure) {
      return {
        axis,
        procedure,
      }
    }
  }

  return null
}
