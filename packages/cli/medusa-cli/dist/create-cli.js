"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_exists_cached_1 = require("fs-exists-cached");
const medusa_telemetry_1 = require("medusa-telemetry");
const path_1 = __importDefault(require("path"));
const resolve_cwd_1 = __importDefault(require("resolve-cwd"));
const did_you_mean_1 = require("./did-you-mean");
const version_1 = require("./util/version");
const new_1 = require("./commands/new");
const reporter_1 = __importDefault(require("./reporter"));
const yargs = require(`yargs`);
const handlerP = (fn) => (...args) => {
    Promise.resolve(fn(...args)).then(() => process.exit(0), (err) => console.log(err));
};
function buildLocalCommands(cli, isLocalProject) {
    const defaultHost = `localhost`;
    const defaultPort = `9000`;
    const directory = path_1.default.resolve(`.`);
    const projectInfo = { directory };
    const useYarn = (0, fs_exists_cached_1.sync)(path_1.default.join(directory, `yarn.lock`));
    if (isLocalProject) {
        projectInfo["sitePackageJson"] = require(path_1.default.join(directory, `package.json`));
    }
    function resolveLocalCommand(command) {
        if (!isLocalProject) {
            cli.showHelp();
        }
        try {
            const cmdPath = resolve_cwd_1.default.silent(`@medusajs/medusa/dist/commands/${command}`);
            return require(cmdPath).default;
        }
        catch (err) {
            if (!process.env.NODE_ENV?.startsWith("prod")) {
                console.log("--------------- ERROR ---------------------");
                console.log(err);
                console.log("-------------------------------------------");
            }
            cli.showHelp();
        }
    }
    function getCommandHandler(command, handler) {
        return (argv) => {
            const localCmd = resolveLocalCommand(command);
            const args = { ...argv, ...projectInfo, useYarn };
            return handler ? handler(args, localCmd) : localCmd(args);
        };
    }
    cli
        .command({
        command: `new [root] [starter]`,
        builder: (_) => _.option(`seed`, {
            type: `boolean`,
            describe: `If flag is set the command will attempt to seed the database after setup.`,
            default: false,
        })
            .option(`y`, {
            type: `boolean`,
            alias: "useDefaults",
            describe: `If flag is set the command will not interactively collect database credentials`,
            default: false,
        })
            .option(`skip-db`, {
            type: `boolean`,
            describe: `If flag is set the command will not attempt to complete database setup`,
            default: false,
        })
            .option(`skip-migrations`, {
            type: `boolean`,
            describe: `If flag is set the command will not attempt to complete database migration`,
            default: false,
        })
            .option(`skip-env`, {
            type: `boolean`,
            describe: `If flag is set the command will not attempt to populate .env`,
            default: false,
        })
            .option(`db-user`, {
            type: `string`,
            describe: `The database user to use for database setup and migrations.`,
        })
            .option(`db-database`, {
            type: `string`,
            describe: `The database use for database setup and migrations.`,
        })
            .option(`db-pass`, {
            type: `string`,
            describe: `The database password to use for database setup and migrations.`,
        })
            .option(`db-port`, {
            type: `number`,
            describe: `The database port to use for database setup and migrations.`,
        })
            .option(`db-host`, {
            type: `string`,
            describe: `The database host to use for database setup and migrations.`,
        })
            .option(`v2`, {
            type: `boolean`,
            describe: `Install Medusa with the V2 feature flag enabled. WARNING: Medusa V2 is still in development and shouldn't be used in production.`,
            default: false
        }),
        desc: `Create a new Medusa project.`,
        handler: handlerP(new_1.newStarter),
    })
        .command({
        command: `telemetry`,
        describe: `Enable or disable collection of anonymous usage data.`,
        builder: (yargs) => yargs
            .option(`enable`, {
            type: `boolean`,
            description: `Enable telemetry (default)`,
        })
            .option(`disable`, {
            type: `boolean`,
            description: `Disable telemetry`,
        }),
        handler: handlerP(({ enable, disable }) => {
            const enabled = Boolean(enable) || !disable;
            (0, medusa_telemetry_1.setTelemetryEnabled)(enabled);
            reporter_1.default.info(`Telemetry collection ${enabled ? `enabled` : `disabled`}`);
        }),
    })
        .command({
        command: `seed`,
        desc: `Migrates and populates the database with the provided file.`,
        builder: (_) => _.option(`f`, {
            alias: `seed-file`,
            type: `string`,
            describe: `Path to the file where the seed is defined.`,
            required: true,
        }).option(`m`, {
            alias: `migrate`,
            type: `boolean`,
            default: true,
            describe: `Flag to indicate if migrations should be run prior to seeding the database`,
        }),
        handler: handlerP(getCommandHandler(`seed`, (args, cmd) => {
            var _a;
            (_a = process.env).NODE_ENV ?? (_a.NODE_ENV = `development`);
            return cmd(args);
        })),
    })
        .command({
        command: `migrations [action]`,
        desc: `Manage migrations from the core and your own project`,
        builder: {
            action: {
                demand: true,
                choices: ["run", "revert", "show"],
            },
        },
        handler: handlerP(getCommandHandler(`migrate`, (args, cmd) => {
            process.env.NODE_ENV = process.env.NODE_ENV || `development`;
            return cmd(args);
        })),
    })
        .command({
        command: `develop`,
        desc: `Start development server. Watches file and rebuilds when something changes`,
        builder: (_) => _.option(`H`, {
            alias: `host`,
            type: `string`,
            default: defaultHost,
            describe: `Set host. Defaults to ${defaultHost}`,
        }).option(`p`, {
            alias: `port`,
            type: `string`,
            default: process.env.PORT || defaultPort,
            describe: process.env.PORT
                ? `Set port. Defaults to ${process.env.PORT} (set by env.PORT) (otherwise defaults ${defaultPort})`
                : `Set port. Defaults to ${defaultPort}`,
        }),
        handler: handlerP(getCommandHandler(`develop`, (args, cmd) => {
            process.env.NODE_ENV = process.env.NODE_ENV || `development`;
            cmd(args);
            // Return an empty promise to prevent handlerP from exiting early.
            // The development server shouldn't ever exit until the user directly
            // kills it so this is fine.
            return new Promise((resolve) => { });
        })),
    })
        .command({
        command: `start`,
        desc: `Start development server.`,
        builder: (_) => _.option(`H`, {
            alias: `host`,
            type: `string`,
            default: defaultHost,
            describe: `Set host. Defaults to ${defaultHost}`,
        }).option(`p`, {
            alias: `port`,
            type: `string`,
            default: process.env.PORT || defaultPort,
            describe: process.env.PORT
                ? `Set port. Defaults to ${process.env.PORT} (set by env.PORT) (otherwise defaults ${defaultPort})`
                : `Set port. Defaults to ${defaultPort}`,
        }),
        handler: handlerP(getCommandHandler(`start`, (args, cmd) => {
            process.env.NODE_ENV = process.env.NODE_ENV || `development`;
            cmd(args);
            // Return an empty promise to prevent handlerP from exiting early.
            // The development server shouldn't ever exit until the user directly
            // kills it so this is fine.
            return new Promise((resolve) => { });
        })),
    })
        .command({
        command: `start-cluster`,
        desc: `Start development server in cluster mode (beta).`,
        builder: (_) => _.option(`H`, {
            alias: `host`,
            type: `string`,
            default: defaultHost,
            describe: `Set host. Defaults to ${defaultHost}`,
        })
            .option(`p`, {
            alias: `port`,
            type: `string`,
            default: process.env.PORT || defaultPort,
            describe: process.env.PORT
                ? `Set port. Defaults to ${process.env.PORT} (set by env.PORT) (otherwise defaults ${defaultPort})`
                : `Set port. Defaults to ${defaultPort}`,
        })
            .option(`c`, {
            alias: `cpus`,
            type: `number`,
            default: process.env.CPUS,
            describe: "Set number of cpus to use. Defaults to max number of cpus available on the system (set by env.CPUS)",
        }),
        handler: handlerP(getCommandHandler(`start-cluster`, (args, cmd) => {
            process.env.NODE_ENV = process.env.NODE_ENV || `development`;
            cmd(args);
            // Return an empty promise to prevent handlerP from exiting early.
            // The development server shouldn't ever exit until the user directly
            // kills it so this is fine.
            return new Promise((resolve) => { });
        })),
    })
        .command({
        command: `user`,
        desc: `Create a user`,
        builder: (_) => _.option(`e`, {
            alias: `email`,
            type: `string`,
            describe: `User's email.`,
        })
            .option(`p`, {
            alias: `password`,
            type: `string`,
            describe: `User's password.`,
        })
            .option(`i`, {
            alias: `id`,
            type: `string`,
            describe: `User's id.`,
        })
            .option(`invite`, {
            type: `boolean`,
            describe: `If flag is set, an invitation will be created instead of a new user and the invite token will be returned.`,
            default: false,
        }),
        handler: handlerP(getCommandHandler(`user`, (args, cmd) => {
            cmd(args);
            // Return an empty promise to prevent handlerP from exiting early.
            // The development server shouldn't ever exit until the user directly
            // kills it so this is fine.
            return new Promise((resolve) => { });
        })),
    });
}
function isLocalMedusaProject() {
    let inMedusaProject = false;
    try {
        const { dependencies, devDependencies } = require(path_1.default.resolve(`./package.json`));
        inMedusaProject = !!((dependencies && dependencies["@medusajs/medusa"]) ||
            (devDependencies && devDependencies["@medusajs/medusa"]));
    }
    catch (err) {
        // ignore
    }
    return inMedusaProject;
}
function getVersionInfo() {
    const { version } = require(`../package.json`);
    const isMedusaProject = isLocalMedusaProject();
    if (isMedusaProject) {
        let medusaVersion = (0, version_1.getLocalMedusaVersion)();
        if (!medusaVersion) {
            medusaVersion = `unknown`;
        }
        return `Medusa CLI version: ${version}
Medusa version: ${medusaVersion}
  Note: this is the Medusa version for the site at: ${process.cwd()}`;
    }
    else {
        return `Medusa CLI version: ${version}`;
    }
}
exports.default = (argv) => {
    const cli = yargs();
    const isLocalProject = isLocalMedusaProject();
    cli
        .scriptName(`medusa`)
        .usage(`Usage: $0 <command> [options]`)
        .alias(`h`, `help`)
        .alias(`v`, `version`)
        .option(`verbose`, {
        default: false,
        type: `boolean`,
        describe: `Turn on verbose output`,
        global: true,
    })
        .option(`no-color`, {
        alias: `no-colors`,
        default: false,
        type: `boolean`,
        describe: `Turn off the color in output`,
        global: true,
    })
        .option(`json`, {
        describe: `Turn on the JSON logger`,
        default: false,
        type: `boolean`,
        global: true,
    });
    buildLocalCommands(cli, isLocalProject);
    try {
        cli.version(`version`, `Show the version of the Medusa CLI and the Medusa package in the current project`, getVersionInfo());
    }
    catch (e) {
        // ignore
    }
    return cli
        .wrap(cli.terminalWidth())
        .demandCommand(1, `Pass --help to see all available commands and options.`)
        .strict()
        .fail((msg, err, yargs) => {
        const availableCommands = yargs
            .getCommands()
            .map((commandDescription) => {
            const [command] = commandDescription;
            return command.split(` `)[0];
        });
        const arg = argv.slice(2)[0];
        const suggestion = arg ? (0, did_you_mean_1.didYouMean)(arg, availableCommands) : ``;
        if (!process.env.NODE_ENV?.startsWith("prod")) {
            console.log("--------------- ERROR ---------------------");
            console.log(err);
            console.log("-------------------------------------------");
        }
        cli.showHelp();
        reporter_1.default.info(suggestion);
        reporter_1.default.info(msg);
    })
        .parse(argv.slice(2));
};
//# sourceMappingURL=create-cli.js.map