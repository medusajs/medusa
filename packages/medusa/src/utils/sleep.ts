import { promisify } from "util"

export const sleep = promisify(setTimeout)
