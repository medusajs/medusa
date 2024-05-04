import type { OAuth } from "./OAuth";
export interface AdminAppsListRes {
    /**
     * An array of app details.
     */
    apps: Array<OAuth>;
}
