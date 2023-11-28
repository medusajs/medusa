import { OrchestrationUtils } from "@medusajs/utils"

/**
 * This class is used to create the response returned by a step. A step return its data by returning an instance of `StepResponse`.
 *
 * @typeParam TOutput - The type of the output of the step.
 * @typeParam TCompensateInput -
 * The type of the compensation input. If the step doesn't specify any compensation input, then the type of `TCompensateInput` is the same
 * as that of `TOutput`.
 */
export class StepResponse<TOutput, TCompensateInput = TOutput> {
  readonly #__type = OrchestrationUtils.SymbolWorkflowStepResponse
  readonly #output: TOutput
  readonly #compensateInput?: TCompensateInput

  /**
   * The constructor of the StepResponse
   *
   * @typeParam TOutput - The type of the output of the step.
   * @typeParam TCompensateInput -
   * The type of the compensation input. If the step doesn't specify any compensation input, then the type of `TCompensateInput` is the same
   * as that of `TOutput`.
   */
  constructor(
    /**
     * The output of the step.
     */
    output: TOutput,
    /**
     * The input to be passed as a parameter to the step's compensation function. If not provided, the `output` will be provided instead.
     */
    compensateInput?: TCompensateInput
  ) {
    this.#output = output
    this.#compensateInput = (compensateInput ?? output) as TCompensateInput
  }

  /**
   * Creates a StepResponse that indicates that the step has failed and the retry mechanism should not kick in anymore.
   *
   * @param message - An optional message to be logged. Default to `Permanent failure`.
   * @param endRetry - Whether the retry mechanism should be stopped or not. Defaults to `true`.
   * @param compensateInput - The input to be passed as a parameter to the step's compensation function. If not provided, the `output` will be provided instead.
   */
  static permanentFailure<TCompensateInput>({
    message = "Permanent failure",
    compensateInput,
  }: {
    message: string
    compensateInput?: TCompensateInput
  }) {
    return new StepResponse<
      {
        error: Error
        __type: Symbol
      },
      TCompensateInput
    >(
      {
        __type: OrchestrationUtils.SymbolWorkflowStepPermanentFailureResponse,
        error: new Error(message),
      },
      compensateInput as TCompensateInput
    )
  }

  /**
   * @internal
   */
  get __type() {
    return this.#__type
  }

  /**
   * @internal
   */
  get output(): TOutput {
    return this.#output
  }

  /**
   * @internal
   */
  get compensateInput(): TCompensateInput {
    return this.#compensateInput as TCompensateInput
  }

  /**
   * @internal
   */
  toJSON() {
    return {
      __type: this.#__type,
      output: this.#output,
      compensateInput: this.#compensateInput,
    }
  }
}
