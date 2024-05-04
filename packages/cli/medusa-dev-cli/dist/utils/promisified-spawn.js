var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const execa = require(`execa`);
const defaultSpawnArgs = {
    cwd: process.cwd(),
    stdio: `inherit`,
};
exports.setDefaultSpawnStdio = stdio => {
    defaultSpawnArgs.stdio = stdio;
};
exports.promisifiedSpawn = ([cmd, args = [], spawnArgs = {}]) => __awaiter(this, void 0, void 0, function* () {
    const spawnOptions = Object.assign(Object.assign({}, defaultSpawnArgs), spawnArgs);
    try {
        return yield execa(cmd, args, spawnOptions);
    }
    catch (e) {
        if (spawnOptions.stdio === `ignore`) {
            console.log(`\nCommand "${cmd} ${args.join(` `)}" failed.\nTo see details of failed command, rerun "medusa-dev" without "--quiet" or "-q" switch\n`);
        }
        throw e;
    }
});
//# sourceMappingURL=promisified-spawn.js.map