// Keeping this as an object in case we need to add any other properties.
export type Step = {
  name: string
}

export type Workflow = {
  name: string
  input: Record<string, unknown>
  output: Record<string, unknown>
  steps: Step[]
  code: string
}
