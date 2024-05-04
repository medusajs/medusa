"use strict";
/*
 * Adapted from https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-cli/src/init-starter.ts
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newStarter = void 0;
const child_process_1 = require("child_process");
const execa_1 = __importDefault(require("execa"));
const fs_exists_cached_1 = require("fs-exists-cached");
const fs_extra_1 = __importDefault(require("fs-extra"));
const hosted_git_info_1 = __importDefault(require("hosted-git-info"));
const is_valid_path_1 = __importDefault(require("is-valid-path"));
const path_1 = __importDefault(require("path"));
const prompts_1 = __importDefault(require("prompts"));
const pg_1 = require("pg");
const url_1 = __importDefault(require("url"));
const pg_god_1 = require("pg-god");
const medusa_telemetry_1 = require("medusa-telemetry");
const inquirer_1 = __importDefault(require("inquirer"));
const reporter_1 = __importDefault(require("../reporter"));
const package_manager_1 = require("../util/package-manager");
const panic_handler_1 = require("../reporter/panic-handler");
const clear_project_1 = require("../util/clear-project");
const path_2 = __importDefault(require("path"));
const removeUndefined = (obj) => {
    return Object.fromEntries(Object.entries(obj)
        .filter(([_, v]) => v != null)
        .map(([k, v]) => [k, v === Object(v) ? removeUndefined(v) : v]));
};
const spawnWithArgs = (file, args, options) => (0, execa_1.default)(file, args, { stdio: `inherit`, preferLocal: false, ...options });
const spawn = (cmd, options) => {
    const [file, ...args] = cmd.split(/\s+/);
    return spawnWithArgs(file, args, options);
};
// Checks the existence of yarn package
// We use yarnpkg instead of yarn to avoid conflict with Hadoop yarn
// Refer to https://github.com/yarnpkg/yarn/issues/673
const checkForYarn = () => {
    try {
        (0, child_process_1.execSync)(`yarnpkg --version`, { stdio: `ignore` });
        return true;
    }
    catch (e) {
        return false;
    }
};
const isAlreadyGitRepository = async () => {
    try {
        return await spawn(`git rev-parse --is-inside-work-tree`, {
            stdio: `pipe`,
        }).then((output) => output.stdout === `true`);
    }
    catch (err) {
        return false;
    }
};
// Initialize newly cloned directory as a git repo
const gitInit = async (rootPath) => {
    reporter_1.default.info(`Initialising git in ${rootPath}`);
    return await spawn(`git init`, { cwd: rootPath });
};
// Create a .gitignore file if it is missing in the new directory
const maybeCreateGitIgnore = async (rootPath) => {
    if ((0, fs_exists_cached_1.sync)(path_1.default.join(rootPath, `.gitignore`))) {
        return;
    }
    const gignore = reporter_1.default.activity(`Creating minimal .gitignore in ${rootPath}`);
    await fs_extra_1.default.writeFile(path_1.default.join(rootPath, `.gitignore`), `.cache\nnode_modules\npublic\n`);
    reporter_1.default.success(gignore, `Created .gitignore in ${rootPath}`);
};
// Create an initial git commit in the new directory
const createInitialGitCommit = async (rootPath, starterUrl) => {
    reporter_1.default.info(`Create initial git commit in ${rootPath}`);
    await spawn(`git add -A`, { cwd: rootPath });
    // use execSync instead of spawn to handle git clients using
    // pgp signatures (with password)
    try {
        (0, child_process_1.execSync)(`git commit -m "Initial commit from medusa: (${starterUrl})"`, {
            cwd: rootPath,
        });
    }
    catch {
        // Remove git support if initial commit fails
        reporter_1.default.warn(`Initial git commit failed - removing git support\n`);
        fs_extra_1.default.removeSync(path_1.default.join(rootPath, `.git`));
    }
};
// Executes `npm install` or `yarn install` in rootPath.
const install = async (rootPath) => {
    const prevDir = process.cwd();
    reporter_1.default.info(`Installing packages...`);
    console.log(); // Add some space
    process.chdir(rootPath);
    const npmConfigUserAgent = process.env.npm_config_user_agent;
    try {
        if (!(0, package_manager_1.getPackageManager)()) {
            if (npmConfigUserAgent?.includes(`yarn`)) {
                (0, package_manager_1.setPackageManager)(`yarn`);
            }
            else {
                (0, package_manager_1.setPackageManager)(`npm`);
            }
        }
        if ((0, package_manager_1.getPackageManager)() === `yarn` && checkForYarn()) {
            await fs_extra_1.default.remove(`package-lock.json`);
            await spawn(`yarnpkg`, {});
        }
        else {
            await fs_extra_1.default.remove(`yarn.lock`);
            await spawn(`npm install`, {});
        }
    }
    finally {
        process.chdir(prevDir);
    }
};
const ignored = (path) => !/^\.(git|hg)$/.test(path_1.default.basename(path));
// Copy starter from file system.
const copy = async (starterPath, rootPath) => {
    // Chmod with 755.
    // 493 = parseInt('755', 8)
    await fs_extra_1.default.ensureDir(rootPath, { mode: 493 });
    if (!(0, fs_exists_cached_1.sync)(starterPath)) {
        throw new Error(`starter ${starterPath} doesn't exist`);
    }
    if (starterPath === `.`) {
        throw new Error(`You can't create a starter from the existing directory. If you want to
      create a new project in the current directory, the trailing dot isn't
      necessary. If you want to create a project from a local starter, run
      something like "medusa new my-medusa-store ../local-medusa-starter"`);
    }
    reporter_1.default.info(`Creating new site from local starter: ${starterPath}`);
    const copyActivity = reporter_1.default.activity(`Copying local starter to ${rootPath} ...`);
    await fs_extra_1.default.copy(starterPath, rootPath, { filter: ignored });
    reporter_1.default.success(copyActivity, `Created starter directory layout`);
    console.log(); // Add some space
    await install(rootPath);
    return true;
};
// Clones starter from URI.
const clone = async (hostInfo, rootPath, v2 = false) => {
    let url;
    // Let people use private repos accessed over SSH.
    if (hostInfo.getDefaultRepresentation() === `sshurl`) {
        url = hostInfo.ssh({ noCommittish: true });
        // Otherwise default to normal git syntax.
    }
    else {
        url = hostInfo.https({ noCommittish: true, noGitPlus: true });
    }
    const branch = v2 ? [`-b`, "feat/v2"] :
        hostInfo.committish ? [`-b`, hostInfo.committish] : [];
    const createAct = reporter_1.default.activity(`Creating new project from git: ${url}`);
    const args = [
        `clone`,
        ...branch,
        url,
        rootPath,
        `--recursive`,
        `--depth=1`,
    ].filter((arg) => Boolean(arg));
    await (0, execa_1.default)(`git`, args, {})
        .then(() => {
        reporter_1.default.success(createAct, `Created starter directory layout`);
    })
        .catch((err) => {
        reporter_1.default.failure(createAct, `Failed to clone repository`);
        throw err;
    });
    await fs_extra_1.default.remove(path_1.default.join(rootPath, `.git`));
    await install(rootPath);
    const isGit = await isAlreadyGitRepository();
    if (!isGit)
        await gitInit(rootPath);
    await maybeCreateGitIgnore(rootPath);
    if (!isGit)
        await createInitialGitCommit(rootPath, url);
};
const getMedusaConfig = (rootPath) => {
    try {
        const configPath = path_1.default.join(rootPath, "medusa-config.js");
        if ((0, fs_exists_cached_1.sync)(configPath)) {
            const resolved = path_1.default.resolve(configPath);
            const configModule = require(resolved);
            return configModule;
        }
        throw Error();
    }
    catch (err) {
        console.log(err);
        reporter_1.default.warn(`Couldn't find a medusa-config.js file; please double check that you have the correct starter installed`);
    }
    return {};
};
const getPaths = async (starterPath, rootPath, v2 = false) => {
    let selectedOtherStarter = false;
    // if no args are passed, prompt user for path and starter
    if (!starterPath && !rootPath) {
        const response = await prompts_1.default.prompt([
            {
                type: `text`,
                name: `path`,
                message: `What is your project called?`,
                initial: `my-medusa-store`,
            },
            !v2 && {
                type: `select`,
                name: `starter`,
                message: `What starter would you like to use?`,
                choices: [
                    { title: `medusa-starter-default`, value: `medusa-starter-default` },
                    { title: `(Use a different starter)`, value: `different` },
                ],
                initial: 0,
            },
        ]);
        // exit gracefully if responses aren't provided
        if ((!v2 && !response.starter) || !response.path.trim()) {
            throw new Error(`Please mention both starter package and project name along with path(if its not in the root)`);
        }
        selectedOtherStarter = response.starter === `different`;
        starterPath = `medusajs/${v2 ? "medusa-starter-default" : response.starter}`;
        rootPath = response.path;
    }
    // set defaults if no root or starter has been set yet
    rootPath = rootPath || process.cwd();
    starterPath = starterPath || `medusajs/medusa-starter-default`;
    return { starterPath, rootPath, selectedOtherStarter };
};
const successMessage = (path) => {
    reporter_1.default.info(`Your new Medusa project is ready for you! To start developing run:

  cd ${path}
  medusa develop
`);
};
const defaultDBCreds = {
    user: process.env.USER || "postgres",
    database: "postgres",
    password: "",
    port: 5432,
    host: "localhost",
};
const verifyPgCreds = async (creds) => {
    const pool = new pg_1.Pool(creds);
    return new Promise((resolve, reject) => {
        pool.query("SELECT NOW()", (err, res) => {
            pool.end();
            if (err) {
                reject(err);
            }
            else {
                resolve(res);
            }
        });
    });
};
const interactiveDbCreds = async (dbName, dbCreds = {}) => {
    const credentials = Object.assign({}, defaultDBCreds, dbCreds);
    const collecting = true;
    while (collecting) {
        const result = await inquirer_1.default
            .prompt([
            {
                type: "list",
                name: "continueWithDefault",
                message: `

Will attempt to setup Postgres database "${dbName}" with credentials:
  user: ${credentials.user}
  password: ***
  port: ${credentials.port}
  host: ${credentials.host}
Do you wish to continue with these credentials?

          `,
                choices: [`Continue`, `Change credentials`, `Skip database setup`],
            },
            {
                type: "input",
                when: ({ continueWithDefault }) => continueWithDefault === `Change credentials`,
                name: "user",
                default: credentials.user,
                message: `DB user`,
            },
            {
                type: "password",
                when: ({ continueWithDefault }) => continueWithDefault === `Change credentials`,
                name: "password",
                default: credentials.password,
                message: `DB password`,
            },
            {
                type: "number",
                when: ({ continueWithDefault }) => continueWithDefault === `Change credentials`,
                name: "port",
                default: credentials.port,
                message: `DB port`,
            },
            {
                type: "input",
                when: ({ continueWithDefault }) => continueWithDefault === `Change credentials`,
                name: "host",
                default: credentials.host,
                message: `DB host`,
            },
        ])
            .then(async (answers) => {
            const collectedCreds = Object.assign({}, credentials, {
                user: answers.user,
                password: answers.password,
                host: answers.host,
                port: answers.port,
            });
            switch (answers.continueWithDefault) {
                case "Continue": {
                    const done = await verifyPgCreds(credentials).catch((_) => false);
                    if (done) {
                        return credentials;
                    }
                    return false;
                }
                case "Change credentials": {
                    const done = await verifyPgCreds(collectedCreds).catch((_) => false);
                    if (done) {
                        return collectedCreds;
                    }
                    return false;
                }
                default:
                    return null;
            }
        });
        if (result !== false) {
            return result;
        }
        console.log("\n\nCould not verify DB credentials - please try again\n\n");
    }
    return;
};
const setupDB = async (dbName, dbCreds = {}) => {
    const credentials = Object.assign({}, defaultDBCreds, dbCreds);
    const dbActivity = reporter_1.default.activity(`Setting up database "${dbName}"...`);
    await (0, pg_god_1.createDatabase)({
        databaseName: dbName,
        errorIfExist: true,
    }, credentials)
        .then(() => {
        reporter_1.default.success(dbActivity, `Created database "${dbName}"`);
    })
        .catch((err) => {
        if (err.name === "PDG_ERR::DuplicateDatabase") {
            reporter_1.default.success(dbActivity, `Database ${dbName} already exists; skipping setup`);
        }
        else {
            reporter_1.default.failure(dbActivity, `Skipping database setup.`);
            reporter_1.default.warn(`Failed to setup database; install PostgresQL or make sure to manage your database connection manually`);
            console.error(err);
        }
    });
};
const setupEnvVars = async (rootPath, dbName, dbCreds = {}) => {
    const templatePath = path_1.default.join(rootPath, ".env.template");
    const destination = path_1.default.join(rootPath, ".env");
    if ((0, fs_exists_cached_1.sync)(templatePath)) {
        fs_extra_1.default.renameSync(templatePath, destination);
    }
    const credentials = Object.assign({}, defaultDBCreds, dbCreds);
    let dbUrl = "";
    if (credentials.user !== defaultDBCreds.user ||
        credentials.password !== defaultDBCreds.password) {
        dbUrl = `postgres://${credentials.user}:${credentials.password}@${credentials.host}:${credentials.port}/${dbName}`;
    }
    else {
        dbUrl = `postgres://${credentials.host}:${credentials.port}/${dbName}`;
    }
    fs_extra_1.default.appendFileSync(destination, `DATABASE_URL=${dbUrl}\n`);
};
const runMigrations = async (rootPath) => {
    const migrationActivity = reporter_1.default.activity("Applying database migrations...");
    const cliPath = path_1.default.join(`node_modules`, `@medusajs`, `medusa-cli`, `cli.js`);
    return await (0, execa_1.default)(cliPath, [`migrations`, `run`], {
        cwd: rootPath,
    })
        .then(() => {
        reporter_1.default.success(migrationActivity, "Database migrations completed.");
    })
        .catch((err) => {
        reporter_1.default.failure(migrationActivity, "Failed to migrate database you must complete migration manually before starting your server.");
        console.error(err);
    });
};
const attemptSeed = async (rootPath) => {
    const seedActivity = reporter_1.default.activity("Seeding database");
    const pkgPath = path_1.default.resolve(rootPath, "package.json");
    if ((0, fs_exists_cached_1.sync)(pkgPath)) {
        const pkg = require(pkgPath);
        if (pkg.scripts && pkg.scripts.seed) {
            const proc = (0, execa_1.default)((0, package_manager_1.getPackageManager)(), [`run`, `seed`], {
                cwd: rootPath,
            });
            // Useful for development
            // proc.stdout.pipe(process.stdout)
            await proc
                .then(() => {
                reporter_1.default.success(seedActivity, "Seed completed");
            })
                .catch((err) => {
                reporter_1.default.failure(seedActivity, "Failed to complete seed; skipping");
                console.error(err);
            });
        }
        else {
            reporter_1.default.failure(seedActivity, "Starter doesn't provide a seed command; skipping.");
        }
    }
    else {
        reporter_1.default.failure(seedActivity, "Could not find package.json");
    }
};
/**
 * Main function that clones or copies the starter.
 */
const newStarter = async (args) => {
    (0, medusa_telemetry_1.track)("CLI_NEW");
    const { starter, root, skipDb, skipMigrations, skipEnv, seed, useDefaults, dbUser, dbDatabase, dbPass, dbPort, dbHost, v2 } = args;
    const dbCredentials = removeUndefined({
        user: dbUser,
        database: dbDatabase,
        password: dbPass,
        port: dbPort,
        host: dbHost,
    });
    const { starterPath, rootPath, selectedOtherStarter } = await getPaths(starter, root, v2);
    const urlObject = url_1.default.parse(rootPath);
    if (selectedOtherStarter) {
        reporter_1.default.info(`Find the url of the Medusa starter you wish to create and run:

medusa new ${rootPath} [url-to-starter]

`);
        return;
    }
    if (urlObject.protocol && urlObject.host) {
        const isStarterAUrl = starter && !url_1.default.parse(starter).hostname && !url_1.default.parse(starter).protocol;
        if (/medusa-starter/gi.test(rootPath) && isStarterAUrl) {
            reporter_1.default.panic({
                id: panic_handler_1.PanicId.InvalidProjectName,
                context: {
                    starter,
                    rootPath,
                },
            });
            return;
        }
        reporter_1.default.panic({
            id: panic_handler_1.PanicId.InvalidProjectName,
            context: {
                rootPath,
            },
        });
        return;
    }
    if (!(0, is_valid_path_1.default)(rootPath)) {
        reporter_1.default.panic({
            id: panic_handler_1.PanicId.InvalidPath,
            context: {
                path: path_1.default.resolve(rootPath),
            },
        });
        return;
    }
    if ((0, fs_exists_cached_1.sync)(path_1.default.join(rootPath, `package.json`))) {
        reporter_1.default.panic({
            id: panic_handler_1.PanicId.AlreadyNodeProject,
            context: {
                rootPath,
            },
        });
        return;
    }
    const hostedInfo = hosted_git_info_1.default.fromUrl(starterPath);
    if (hostedInfo) {
        await clone(hostedInfo, rootPath, v2);
    }
    else {
        await copy(starterPath, rootPath);
    }
    (0, medusa_telemetry_1.track)("CLI_NEW_LAYOUT_COMPLETED");
    let creds = dbCredentials;
    const dbName = `medusa-db-${Math.random().toString(36).substring(2, 7)}`; // generate random 5 character string
    if (!useDefaults && !skipDb && !skipEnv) {
        creds = await interactiveDbCreds(dbName, dbCredentials);
    }
    if (creds === null) {
        reporter_1.default.info("Skipping automatic database setup. Please note that you need to create a database and run migrations before you can run your Medusa backend");
    }
    else {
        if (!skipDb) {
            (0, medusa_telemetry_1.track)("CLI_NEW_SETUP_DB");
            await setupDB(dbName, creds);
        }
        if (!skipEnv) {
            (0, medusa_telemetry_1.track)("CLI_NEW_SETUP_ENV");
            await setupEnvVars(rootPath, dbName, creds);
        }
        if (!skipMigrations) {
            (0, medusa_telemetry_1.track)("CLI_NEW_RUN_MIGRATIONS");
            await runMigrations(rootPath);
        }
        if (seed) {
            (0, medusa_telemetry_1.track)("CLI_NEW_SEED_DB");
            await attemptSeed(rootPath);
        }
    }
    if (!selectedOtherStarter) {
        reporter_1.default.info("Final project preparations...");
        // remove demo files
        (0, clear_project_1.clearProject)(rootPath);
        // remove .git directory
        fs_extra_1.default.rmSync(path_2.default.join(rootPath, '.git'), {
            recursive: true,
            force: true,
        });
    }
    successMessage(rootPath);
    (0, medusa_telemetry_1.track)("CLI_NEW_SUCCEEDED");
};
exports.newStarter = newStarter;
//# sourceMappingURL=new.js.map