import { RemoteQueryFilters } from "../to-remote-query"

/**
 * Compile-time regression checks for RemoteQueryFilters against entity shapes
 * as emitted by the types generator (`gqlSchemaToTypes` / graphql-codegen):
 * optional `__typename` and `Maybe<>` (nullable) to-one relations. The other
 * remote-query fixture declares `__typename` as required, which is not what
 * generated application types look like.
 *
 * This file is validated by `tsc --build`; it is not a runtime test.
 */

type Maybe<T> = T | null

type GeneratedPlan = {
  __typename?: "GeneratedPlan"
  id: string
  handle: string
  metadata: Maybe<Record<string, unknown>>
}

type GeneratedSubscription = {
  __typename?: "GeneratedSubscription"
  id: string
  is_active: boolean
  plan: Maybe<GeneratedPlan>
}

type GeneratedOrganization = {
  __typename?: "GeneratedOrganization"
  id: string
  name: string
  status: string
  subscription: Maybe<GeneratedSubscription>
  subscriptions: Array<GeneratedSubscription>
}

type EntryPoints = {
  generated_organization: GeneratedOrganization[]
}

type OrganizationFilters = RemoteQueryFilters<
  "generated_organization",
  EntryPoints
>

/**
 * Operators must be accepted on scalar fields at every nesting level,
 * including through nullable to-one relations.
 *
 * @since 2.18.0
 */
export const operatorsThroughToOneRelations: OrganizationFilters = {
  status: "active",
  name: { $ne: "excluded" },
  subscription: {
    is_active: true,
    plan: {
      handle: { $ne: "free" },
      id: { $in: ["plan_1", "plan_2"] },
    },
  },
}

/**
 * To-many relations resolve through the same machinery.
 */
export const operatorsThroughToManyRelations: OrganizationFilters = {
  subscriptions: {
    is_active: true,
    plan: {
      handle: { $ne: "free" },
    },
  },
}

/**
 * Nested relation filters stay strictly typed: unknown properties and wrong
 * value types must be rejected (guards against regressions that degrade
 * relations to `Record<string, any>`).
 */
export const rejectsUnknownNestedProperties: OrganizationFilters = {
  subscription: {
    // @ts-expect-error - unknown property on the relation filter
    unknown_property: true,
  },
}

export const rejectsWrongNestedValueTypes: OrganizationFilters = {
  subscription: {
    plan: {
      // @ts-expect-error - handle is a string field
      handle: 123,
    },
  },
}
