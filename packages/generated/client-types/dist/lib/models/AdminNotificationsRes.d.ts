import { SetRelation } from "../core/ModelUtils";
import type { Notification } from "./Notification";
/**
 * The notification's details.
 */
export interface AdminNotificationsRes {
    /**
     * Notification details
     */
    notification: SetRelation<Notification, "resends">;
}
