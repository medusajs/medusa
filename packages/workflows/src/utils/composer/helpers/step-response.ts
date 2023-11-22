import { SymbolWorkflowStepResponse } from "./symbol"

export class StepResponse<TOutput, TCompensateInput = TOutput> {
  readonly #__type = SymbolWorkflowStepResponse
  readonly #output: TOutput
  readonly #compensateInput?: TCompensateInput

  constructor(output: TOutput, compensateInput?: TCompensateInput) {
    this.#output = output
    this.#compensateInput = (compensateInput ?? output) as TCompensateInput
  }

  get __type() {
    return this.#__type
  }

  get output(): TOutput {
    return this.#output
  }

  get compensateInput(): TCompensateInput {
    return this.#compensateInput as TCompensateInput
  }

  toJSON() {
    return {
      __type: this.#__type,
      output: this.#output,
      compensateInput: this.#compensateInput,
    }
  }
}
