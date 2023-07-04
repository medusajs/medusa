import { Invite } from "../models/invite"

export type ListInvite = Omit<Invite, "beforeInsert"> & {
  token: string
}
