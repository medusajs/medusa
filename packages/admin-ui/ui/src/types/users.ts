import { Invite, User } from "@medusajs/medusa"

export declare class UserWithRole extends User {
    role_id?: string | null
    teamRole?: any
    region_id?: any
    Region?: any
}

export declare class InvitwWithRole extends Invite {
    role_id?: string | null
    teamRole?: any
    region_id?: any
    Region?: any
}
