import { exec } from "child_process";
export default ({ directory, abortController }) => {
    const childProcess = exec(`npx @medusajs/medusa-cli@latest develop`, {
        cwd: directory,
        signal: abortController?.signal,
        env: {
            ...process.env,
            OPEN_BROWSER: "false",
            npm_config_yes: "yes",
        },
    });
    childProcess.stdout?.pipe(process.stdout);
    childProcess.stderr?.pipe(process.stderr);
};
