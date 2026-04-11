// TODO: Comment temporarely and we will re enable it in the near future #14478
// import { EventOptions } from "@medusajs/types"
import { buildEventNamesFromEntityName } from "../event-bus"
import { Modules } from "../modules-sdk"

const eventBaseNames: ["user", "invite"] = ["user", "invite"]

export const UserEvents = {
  ...buildEventNamesFromEntityName(eventBaseNames, Modules.USER),
  INVITE_TOKEN_GENERATED: `${Modules.USER}.user.invite.token_generated`,
} as const

// TODO: Comment temporarely and we will re enable it in the near future #14478
// declare module "@medusajs/types" {
//   export interface EventBusEventsOptions {
//     // User events
//     [UserEvents.USER_CREATED]?: EventOptions
//     [UserEvents.USER_UPDATED]?: EventOptions
//     [UserEvents.USER_DELETED]?: EventOptions
//     [UserEvents.USER_RESTORED]?: EventOptions
//     [UserEvents.USER_ATTACHED]?: EventOptions
//     [UserEvents.USER_DETACHED]?: EventOptions

//     // Invite events
//     [UserEvents.INVITE_CREATED]?: EventOptions
//     [UserEvents.INVITE_UPDATED]?: EventOptions
//     [UserEvents.INVITE_DELETED]?: EventOptions
//     [UserEvents.INVITE_RESTORED]?: EventOptions
//     [UserEvents.INVITE_ATTACHED]?: EventOptions
//     [UserEvents.INVITE_DETACHED]?: EventOptions

//     // Custom events
//     [UserEvents.INVITE_TOKEN_GENERATED]?: EventOptions
//   }
// }
