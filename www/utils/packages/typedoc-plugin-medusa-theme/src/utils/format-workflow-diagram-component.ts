export function formatWorkflowDiagramComponent({
  component,
  componentItem,
}: {
  component: string | undefined
  componentItem: Record<string, unknown>
}): string {
  return `<${component} workflow={${JSON.stringify(componentItem)}} />`
}
