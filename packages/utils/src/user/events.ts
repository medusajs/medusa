import { CommonEvents } from "../event-bus"

export const UserEvents = {
  created: "user." + CommonEvents.CREATED,
  updated: "user." + CommonEvents.UPDATED,
  invite_created: "invite." + CommonEvents.CREATED,
  invite_updated: "invite." + CommonEvents.UPDATED,
  invite_token_generated: "invite.token_generated",
}
