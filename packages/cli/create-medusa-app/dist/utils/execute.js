import { exec, spawnSync } from "child_process";
import util from "util";
import { getAbortError } from "./create-abort-controller.js";
const promiseExec = util.promisify(exec);
const execute = async (command, { verbose = false, needOutput = false }) => {
    if (verbose) {
        const [commandStr, options] = command;
        const childProcess = spawnSync(commandStr, {
            ...options,
            shell: true,
            stdio: needOutput
                ? "pipe"
                : [process.stdin, process.stdout, process.stderr],
        });
        if (childProcess.error) {
            throw childProcess.error;
        }
        if (childProcess.signal &&
            ["SIGINT", "SIGTERM"].includes(childProcess.signal)) {
            console.log("abortingggg");
            throw getAbortError();
        }
        if (needOutput) {
            console.log(childProcess.stdout?.toString() || childProcess.stderr?.toString());
        }
        return {
            stdout: childProcess.stdout?.toString() || "",
            stderr: childProcess.stderr?.toString() || "",
        };
    }
    else {
        const childProcess = await promiseExec(...command);
        return {
            stdout: childProcess.stdout,
            stderr: childProcess.stderr,
        };
    }
};
export default execute;
