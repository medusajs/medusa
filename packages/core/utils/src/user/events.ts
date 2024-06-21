import { buildEventNamesFromEntityName } from "../event-bus"
import { Modules } from "../modules-sdk"

const eventBaseNames: ["user", "invite"] = ["user", "invite"]

export const UserEvents = {
  ...buildEventNamesFromEntityName(eventBaseNames, Modules.USER),
  INVITE_TOKEN_GENERATED: `${Modules.USER}.user.invite.token_generated`,
}
