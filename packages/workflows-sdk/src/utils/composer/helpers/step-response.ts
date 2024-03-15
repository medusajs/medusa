import { PermanentStepFailureError } from "@medusajs/orchestration"
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
   * @param message - An optional message to be logged.
   *
   * @example
   * import { Product } from "@medusajs/medusa"
   * import {
   *   createStep,
   *   StepResponse,
   *   createWorkflow
   * } from "@medusajs/workflows-sdk"
   *
   * interface CreateProductInput {
   *   title: string
   * }
   *
   * export const createProductStep = createStep(
   *   "createProductStep",
   *   async function (
   *     input: CreateProductInput,
   *     context
   *   ) {
   *     const productService = context.container.resolve(
   *       "productService"
   *     )
   *
   *     try {
   *       const product = await productService.create(input)
   *       return new StepResponse({
   *         product
   *       }, {
   *         product_id: product.id
   *       })
   *     } catch (e) {
   *       return StepResponse.permanentFailure(`Couldn't create the product: ${e}`)
   *     }
   *   }
   * )
   *
   * interface WorkflowInput {
   *  title: string
   * }
   *
   * const myWorkflow = createWorkflow<
   *     WorkflowInput,
   *     Product
   *   >("my-workflow", (input) => {
   *    // Everything here will be executed and resolved later
   *    // during the execution. Including the data access.
   *
   *     const product = createProductStep(input)
   *   }
   * )
   *
   * myWorkflow()
   *   .run({
   *     input: {
   *       title: "Shirt"
   *     }
   *   })
   *   .then(({ errors, result }) => {
   *     if (errors.length) {
   *       errors.forEach((err) => {
   *         if (typeof err.error === "object" && "message" in err.error) {
   *           console.error(err.error.message)
   *         } else {
   *           console.error(err.error)
   *         }
   *       })
   *     }
   *     console.log(result)
   *   })
   */
  static permanentFailure(message = "Permanent failure"): never {
    throw new PermanentStepFailureError(message)
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
