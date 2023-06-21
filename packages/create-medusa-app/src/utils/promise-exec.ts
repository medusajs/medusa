import { exec } from "child_process"
import util from "util"

const promiseExec = util.promisify(exec)

export default promiseExec
