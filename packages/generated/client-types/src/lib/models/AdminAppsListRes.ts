/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { OAuth } from "./OAuth"

export interface AdminAppsListRes {
  apps: Array<OAuth>
}
