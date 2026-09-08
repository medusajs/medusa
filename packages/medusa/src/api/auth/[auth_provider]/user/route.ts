import {
  createUserAccountWorkflow,
  setAuthAppMetadataWorkflow,
} from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils"

const ACTOR_TYPE = "user"

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const { auth_provider: authProvider } = req.params
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  // If an actor is already linked to this auth identity, reject.
  if (req.auth_context.actor_id) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "The user is already registered and cannot create a new account."
    )
  }

  if (!req.auth_context.user_metadata?.email) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Email is required to create a user account."
    )
  }

  // Check that the auth identity was created by the provider named in the route.
  const providerIdentities = await query
    .graph({
      entity: "auth_identity",
      fields: ["id", "provider_identities.provider"],
      filters: {
        id: req.auth_context.auth_identity_id,
      },
    })
    .then((result) => result.data[0]?.provider_identities)
  if (
    providerIdentities?.length !== 1 ||
    providerIdentities[0].provider !== authProvider
  ) {
    throw new MedusaError(
      MedusaError.Types.UNAUTHORIZED,
      `Only ${authProvider} identities can create a user account for this authentication context`
    )
  }

  // Check if a user already exists for the identity-provider-verified email.
  const user = await query
    .graph({
      entity: "user",
      fields: ["id"],
      filters: {
        email: req.auth_context.user_metadata.email,
      },
    })
    .then((result) => result.data[0])

  // Link path: an existing user with a matching email is linked.
  if (user) {
    await setAuthAppMetadataWorkflow(req.scope).run({
      input: {
        authIdentityId: req.auth_context.auth_identity_id,
        actorType: ACTOR_TYPE,
        value: user.id,
      },
    })

    const updatedUser = await query
      .graph({
        entity: "user",
        fields: ["*"],
        filters: {
          id: user.id,
        },
      })
      .then((result) => result.data[0])

    res.status(200).json({ user: updatedUser })
    return
  }

  // Create path: no user with this email exists yet, so create one from the
  // identity-provider-verified claims.
  const { result: createdUser } = await createUserAccountWorkflow(
    req.scope
  ).run({
    input: {
      authIdentityId: req.auth_context.auth_identity_id,
      userData: {
        email: req.auth_context.user_metadata.email as string,
        // Note: in order to be able to do this, we should document we expect these keys to be set by the provider
        first_name: req.auth_context.user_metadata.given_name as string,
        last_name: req.auth_context.user_metadata.family_name as string,
      },
    },
  })

  res.status(200).json({ user: createdUser })
}
