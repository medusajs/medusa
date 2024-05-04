export function setDefaultSpawnStdio(stdio: any): void;
export function promisifiedSpawn([cmd, args, spawnArgs]: [any, (any[] | undefined)?, ({} | undefined)?]): Promise<execa.ExecaReturnValue<string> & execa.ExecaReturnValue<Buffer>>;
import execa = require("execa");
