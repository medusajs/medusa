import {
  GraphResultSet,
  RemoteJoinerOptions,
  RemoteQueryFunction,
  RemoteQueryInput,
} from "@zjedene-medusa/framework/types"
import { createStep, StepFunction, StepResponse } from "@zjedene-medusa/workflows-sdk"
import { ContainerRegistrationKeys } from "@zjedene-medusa/utils"

export type UseQueryGraphStepInput<
  TEntry extends string,
  TIsList extends boolean = boolean
> = RemoteQueryInput<TEntry> & {
  options?: RemoteJoinerOptions & {
    isList?: TIsList
  }
}

export type UseQueryGraphStepOutput<
  TEntry extends string,
  TIsList extends boolean = boolean
> = ReturnType<
  StepFunction<
    any,
    true extends TIsList
      ? GraphResultSet<TEntry>
      : Omit<GraphResultSet<TEntry>, "data"> & {
          data: GraphResultSet<TEntry>["data"][number]
        }
  >
>

const useQueryGraphStepId = "use-query-graph-step"

const step = createStep(
  useQueryGraphStepId,
  async (input: UseQueryGraphStepInput<any>, { container }) => {
    const query = container.resolve<RemoteQueryFunction>(
      ContainerRegistrationKeys.QUERY
    )

    const isList = input.options?.isList ?? true
    delete input.options?.isList

    const { options, ...queryConfig } = input

    const result = await query.graph(queryConfig as any, options)

    if (!isList) {
      const data = result.data?.[0]
      result.data = data
      return new StepResponse(result)
    }

    return new StepResponse(result)
  }
)

/**
 * This step fetches data across modules using the Query.
 *
 * Learn more in the [Query documentation](https://docs.medusajs.com/learn/fundamentals/module-links/query).
 *
 * @example
 * To retrieve a list of records of a data model:
 *
 * ```ts
 * const { data: products } = useQueryGraphStep({
 *   entity: "product",
 *   fields: [
 *     "*",
 *     "variants.*"
 *   ]
 * })
 * ```
 *
 * To retrieve a single item instead of a an array:
 *
 * ```ts
 * const { data: products } = useQueryGraphStep({
 *   entity: "product",
 *   fields: [
 *     "*",
 *     "variants.*"
 *   ],
 *   filters: {
 *     id: "123"
 *   }
 * })
 * ```
 *
 * To throw an error if a record isn't found matching the specified ID:
 *
 * ```ts
 * const { data: products } = useQueryGraphStep({
 *   entity: "product",
 *   fields: [
 *     "*",
 *     "variants.*"
 *   ],
 *   filters: {
 *     id: "123"
 *   },
 *   options: {
 *     throwIfKeyNotFound: true
 *   }
 * })
 * ```
 *
 * To set pagination configurations:
 *
 * ```ts
 * const { data: products } = useQueryGraphStep({
 *   entity: "product",
 *   fields: [
 *     "*",
 *     "variants.*"
 *   ],
 *   filters: {
 *     id: "123"
 *   },
 *   pagination: {
 *     take: 10,
 *     skip: 10,
 *     order: {
 *       created_at: "DESC"
 *     }
 *   }
 * })
 * ```
 */
export const useQueryGraphStep = <
  const TEntry extends string,
  const TIsList extends boolean = boolean
>(
  input: UseQueryGraphStepInput<TEntry, TIsList>
): UseQueryGraphStepOutput<TEntry, TIsList> =>
  step(input as any) as unknown as UseQueryGraphStepOutput<TEntry, TIsList>
