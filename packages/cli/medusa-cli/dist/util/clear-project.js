"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearProject = void 0;
const fs_1 = __importDefault(require("fs"));
const glob_1 = __importDefault(require("glob"));
const path_1 = __importDefault(require("path"));
function clearProject(directory) {
    const adminFiles = glob_1.default.sync(path_1.default.join(directory, `src`, `admin/**/*`));
    const onboardingFiles = glob_1.default.sync(path_1.default.join(directory, `src`, `**/onboarding/`));
    const typeFiles = glob_1.default.sync(path_1.default.join(directory, `src`, `types`));
    const srcFiles = glob_1.default.sync(path_1.default.join(directory, `src`, `**/*.{ts,tsx,js,jsx}`));
    const files = [...adminFiles, ...onboardingFiles, ...typeFiles, ...srcFiles];
    files.forEach((file) => fs_1.default.rmSync(file, {
        recursive: true,
        force: true,
    }));
    // add empty typescript file to avoid build errors
    fs_1.default.openSync(path_1.default.join(directory, "src", "index.ts"), "w");
}
exports.clearProject = clearProject;
//# sourceMappingURL=clear-project.js.map