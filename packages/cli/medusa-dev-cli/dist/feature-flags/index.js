"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildFFCli = void 0;
const path_1 = __importDefault(require("path"));
const glob_1 = __importDefault(require("glob"));
const fs_1 = __importDefault(require("fs"));
const configstore_1 = __importDefault(require("configstore"));
const lodash_1 = require("lodash");
const template_1 = require("./template");
const package_json_1 = __importDefault(require("../../package.json"));
const buildFFCli = (cli) => {
    cli.command({
        command: `ff`,
        desc: "Manage Medusa feature flags",
        builder: (yargs) => {
            yargs
                .command({
                command: "create <name>",
                desc: "Create a new feature flag",
                builder: {
                    name: {
                        demandOption: true,
                        coerce: (name) => (0, lodash_1.kebabCase)(name),
                        description: "Name of the feature flag",
                        type: "string",
                    },
                    description: {
                        alias: "d",
                        demandOption: true,
                        description: "Description of the feature flag",
                        type: "string",
                    },
                },
                handler: (argv) => __awaiter(void 0, void 0, void 0, function* () {
                    const medusaLocation = getRepoRoot();
                    const featureFlagPath = buildPath(argv.name, medusaLocation);
                    if (fs_1.default.existsSync(featureFlagPath)) {
                        console.error(`Feature flag already exists: ${featureFlagPath}`);
                        return;
                    }
                    const flagSettings = collectSettings(argv.name, argv.description);
                    writeFeatureFlag(flagSettings, featureFlagPath);
                }),
            })
                .command({
                command: "list",
                desc: "List available feature flags",
                handler: () => __awaiter(void 0, void 0, void 0, function* () {
                    const medusaLocation = getRepoRoot();
                    const flagGlob = buildFlagsGlob(medusaLocation);
                    const featureFlags = glob_1.default.sync(flagGlob, {
                        ignore: ["**/index.*"],
                    });
                    const flagData = featureFlags.map((flag) => {
                        const flagSettings = readFeatureFlag(flag);
                        return Object.assign(Object.assign({}, flagSettings), { file_name: path_1.default.basename(flag, ".js") });
                    });
                    console.table(flagData);
                }),
            })
                .command({
                command: "delete <name>",
                desc: "Delete a feature flag",
                builder: {
                    name: {
                        demand: true,
                        coerce: (name) => (0, lodash_1.kebabCase)(name),
                        description: "Name of the feature flag",
                        type: "string",
                    },
                },
                handler: (argv) => __awaiter(void 0, void 0, void 0, function* () {
                    const medusaLocation = getRepoRoot();
                    const featureFlagPath = buildPath(argv.name, medusaLocation);
                    if (fs_1.default.existsSync(featureFlagPath)) {
                        fs_1.default.unlinkSync(featureFlagPath);
                    }
                    console.log(`Feature flag deleted: ${featureFlagPath}`);
                }),
            })
                .demandCommand(1, "Please specify an action");
        },
    });
};
exports.buildFFCli = buildFFCli;
const getRepoRoot = () => {
    const conf = new configstore_1.default(package_json_1.default.name);
    const medusaLocation = conf.get(`medusa-location`);
    if (!medusaLocation) {
        console.error(`
You haven't set the path yet to your cloned
version of medusa. Do so now by running:
medusa-dev --set-path-to-repo /path/to/my/cloned/version/medusa
`);
        process.exit();
    }
    return medusaLocation;
};
const readFeatureFlag = (flagPath) => {
    const flagSettings = require(flagPath).default;
    return flagSettings;
};
const buildFlagsGlob = (repoRoot) => {
    return path_1.default.join(repoRoot, "packages", "medusa", "dist", "loaders", "feature-flags", `*.js`);
};
const buildPath = (kebabCaseName, repoRoot) => {
    return path_1.default.join(repoRoot, "packages", "medusa", "src", "loaders", "feature-flags", `${kebabCaseName}.ts`);
};
const collectSettings = (name, description) => {
    const snakeCaseName = (0, lodash_1.snakeCase)(name);
    return {
        key: snakeCaseName,
        description: description,
        defaultValue: false,
        envKey: `MEDUSA_FF_${snakeCaseName.toUpperCase()}`,
    };
};
const writeFeatureFlag = (settings, featureFlagPath) => {
    const featureFlag = (0, template_1.featureFlagTemplate)(settings);
    fs_1.default.writeFileSync(featureFlagPath, featureFlag);
    logFeatureFlagUsage(featureFlagPath, settings);
};
const logFeatureFlagUsage = (flagPath, flagSettings) => {
    console.log(`Feature flag created: ${flagPath}`);
    console.log(`
To use this feature flag, add the following to your medusa-config.js:
  
  {
    ...,
    featureFlags: {
      ${flagSettings.key}: true
    }
  }

or set the environment variable:

  export ${flagSettings.envKey}=true

To add guarded code use the featureFlagRouter:

  if (featureFlagRouter.isEnabled("${flagSettings.key}")) {
    // do something
  }
  `);
};
//# sourceMappingURL=index.js.map