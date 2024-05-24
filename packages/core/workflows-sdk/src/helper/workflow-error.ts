export class WorkflowError extends Error {
  extra_message: string[]

  constructor(message: string, extraMessage?: string[]) {
    super(message)
    this.extra_message = extraMessage ?? []
  }
}
