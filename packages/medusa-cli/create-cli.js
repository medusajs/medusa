"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var path = require("path");

var resolveCwd = require("resolve-cwd");

var yargs = require("yargs");

var existsSync = require("fs-exists-cached").sync;

var _require = require("medusa-telemetry"),
    setTelemetryEnabled = _require.setTelemetryEnabled;

var _require2 = require("./util/version"),
    getLocalMedusaVersion = _require2.getLocalMedusaVersion;

var _require3 = require("./did-you-mean"),
    didYouMean = _require3.didYouMean;

var reporter = require("./reporter")["default"];

var _require4 = require("./commands/new"),
    newStarter = _require4.newStarter;

var _require5 = require("./commands/whoami"),
    whoami = _require5.whoami;

var _require6 = require("./commands/login"),
    login = _require6.login;

var _require7 = require("./commands/link"),
    link = _require7.link;

var handlerP = function handlerP(fn) {
  return function () {
    Promise.resolve(fn.apply(void 0, arguments)).then(function () {
      return process.exit(0);
    }, function (err) {
      return console.log(err);
    });
  };
};

function buildLocalCommands(cli, isLocalProject) {
  var defaultHost = "localhost";
  var defaultPort = "9000";
  var directory = path.resolve(".");
  var projectInfo = {
    directory: directory
  };
  var useYarn = existsSync(path.join(directory, "yarn.lock"));

  if (isLocalProject) {
    var json = require(path.join(directory, "package.json"));

    projectInfo.sitePackageJson = json;
  }

  function getLocalMedusaMajorVersion() {
    var version = getLocalMedusaVersion();

    if (version) {
      version = Number(version.split(".")[0]);
    }

    return version;
  }

  function resolveLocalCommand(command) {
    if (!isLocalProject) {
      cli.showHelp();
    }

    try {
      var cmdPath = resolveCwd.silent("@medusajs/medusa/dist/commands/".concat(command));
      return require(cmdPath)["default"];
    } catch (err) {
      cli.showHelp();
    }
  }

  function getCommandHandler(command, handler) {
    return function (argv) {
      var localCmd = resolveLocalCommand(command);

      var args = _objectSpread(_objectSpread(_objectSpread({}, argv), projectInfo), {}, {
        useYarn: useYarn
      });

      return handler ? handler(args, localCmd) : localCmd(args);
    };
  }

  cli.command({
    command: "new [root] [starter]",
    builder: function builder(_) {
      return _.option("seed", {
        type: "boolean",
        describe: "If flag is set the command will attempt to seed the database after setup.",
        "default": false
      }).option("y", {
        type: "boolean",
        alias: "useDefaults",
        describe: "If flag is set the command will not interactively collect database credentials",
        "default": false
      }).option("skip-db", {
        type: "boolean",
        describe: "If flag is set the command will not attempt to complete database setup",
        "default": false
      }).option("skip-migrations", {
        type: "boolean",
        describe: "If flag is set the command will not attempt to complete database migration",
        "default": false
      }).option("skip-env", {
        type: "boolean",
        describe: "If flag is set the command will not attempt to populate .env",
        "default": false
      }).option("db-user", {
        type: "string",
        describe: "The database user to use for database setup and migrations."
      }).option("db-database", {
        type: "string",
        describe: "The database use for database setup and migrations."
      }).option("db-pass", {
        type: "string",
        describe: "The database password to use for database setup and migrations."
      }).option("db-port", {
        type: "number",
        describe: "The database port to use for database setup and migrations."
      }).option("db-host", {
        type: "string",
        describe: "The database host to use for database setup and migrations."
      });
    },
    desc: "Create a new Medusa project.",
    handler: handlerP(newStarter)
  }).command({
    command: "telemetry",
    describe: "Enable or disable collection of anonymous usage data.",
    builder: function builder(yargs) {
      return yargs.option("enable", {
        type: "boolean",
        description: "Enable telemetry (default)"
      }).option("disable", {
        type: "boolean",
        description: "Disable telemetry"
      });
    },
    handler: handlerP(function (_ref) {
      var enable = _ref.enable,
          disable = _ref.disable;
      var enabled = Boolean(enable) || !disable;
      setTelemetryEnabled(enabled);
      reporter.info("Telemetry collection ".concat(enabled ? "enabled" : "disabled"));
    })
  }).command({
    command: "seed",
    desc: "Migrates and populates the database with the provided file.",
    builder: function builder(_) {
      return _.option("f", {
        alias: "seed-file",
        type: "string",
        describe: "Path to the file where the seed is defined.",
        required: true
      }).option("m", {
        alias: "migrate",
        type: "boolean",
        "default": true,
        describe: "Flag to indicate if migrations should be run prior to seeding the database"
      });
    },
    handler: handlerP(getCommandHandler("seed", function (args, cmd) {
      process.env.NODE_ENV = process.env.NODE_ENV || "development";
      return cmd(args);
    }))
  }).command({
    command: "migrations [action]",
    desc: "Manage migrations from the core and your own project",
    builder: {
      action: {
        demand: true,
        choices: ["run", "revert", "show"]
      }
    },
    handler: handlerP(getCommandHandler("migrate", function (args, cmd) {
      process.env.NODE_ENV = process.env.NODE_ENV || "development";
      return cmd(args);
    }))
  }).command({
    command: "whoami",
    desc: "View the details of the currently logged in user.",
    handler: handlerP(whoami)
  }).command({
    command: "link",
    desc: "Creates your Medusa Cloud user in your local database for local testing.",
    builder: function builder(_) {
      return _.option("su", {
        alias: "skip-local-user",
        type: "boolean",
        "default": false,
        describe: "If set a user will not be created in the database."
      }).option("develop", {
        type: "boolean",
        "default": false,
        describe: "If set medusa develop will be run after successful linking."
      });
    },
    handler: handlerP(function (argv) {
      if (!isLocalProject) {
        console.log("must be a local project");
        cli.showHelp();
      }

      var args = _objectSpread(_objectSpread(_objectSpread({}, argv), projectInfo), {}, {
        useYarn: useYarn
      });

      return link(args);
    })
  }).command({
    command: "login",
    desc: "Logs you into Medusa Cloud.",
    handler: handlerP(login)
  }).command({
    command: "develop",
    desc: "Start development server. Watches file and rebuilds when something changes",
    builder: function builder(_) {
      return _.option("H", {
        alias: "host",
        type: "string",
        "default": defaultHost,
        describe: "Set host. Defaults to ".concat(defaultHost)
      }).option("p", {
        alias: "port",
        type: "string",
        "default": process.env.PORT || defaultPort,
        describe: process.env.PORT ? "Set port. Defaults to ".concat(process.env.PORT, " (set by env.PORT) (otherwise defaults ").concat(defaultPort, ")") : "Set port. Defaults to ".concat(defaultPort)
      });
    },
    handler: handlerP(getCommandHandler("develop", function (args, cmd) {
      process.env.NODE_ENV = process.env.NODE_ENV || "development";
      cmd(args); // Return an empty promise to prevent handlerP from exiting early.
      // The development server shouldn't ever exit until the user directly
      // kills it so this is fine.

      return new Promise(function (resolve) {});
    }))
  }).command({
    command: "start",
    desc: "Start development server.",
    builder: function builder(_) {
      return _.option("H", {
        alias: "host",
        type: "string",
        "default": defaultHost,
        describe: "Set host. Defaults to ".concat(defaultHost)
      }).option("p", {
        alias: "port",
        type: "string",
        "default": process.env.PORT || defaultPort,
        describe: process.env.PORT ? "Set port. Defaults to ".concat(process.env.PORT, " (set by env.PORT) (otherwise defaults ").concat(defaultPort, ")") : "Set port. Defaults to ".concat(defaultPort)
      });
    },
    handler: handlerP(getCommandHandler("start", function (args, cmd) {
      process.env.NODE_ENV = process.env.NODE_ENV || "development";
      cmd(args); // Return an empty promise to prevent handlerP from exiting early.
      // The development server shouldn't ever exit until the user directly
      // kills it so this is fine.

      return new Promise(function (resolve) {});
    }))
  }).command({
    command: "user",
    desc: "Create a user",
    builder: function builder(_) {
      return _.option("e", {
        alias: "email",
        type: "string",
        describe: "User's email."
      }).option("p", {
        alias: "password",
        type: "string",
        describe: "User's password."
      }).option("i", {
        alias: "id",
        type: "string",
        describe: "User's id."
      });
    },
    handler: handlerP(getCommandHandler("user", function (args, cmd) {
      cmd(args); // Return an empty promise to prevent handlerP from exiting early.
      // The development server shouldn't ever exit until the user directly
      // kills it so this is fine.

      return new Promise(function (resolve) {});
    }))
  });
}

function isLocalMedusaProject() {
  var inMedusaProject = false;

  try {
    var _require8 = require(path.resolve("./package.json")),
        dependencies = _require8.dependencies,
        devDependencies = _require8.devDependencies;

    inMedusaProject = dependencies && dependencies["@medusajs/medusa"] || devDependencies && devDependencies["@medusajs/medusa"];
  } catch (err) {
    /* ignore */
  }

  return !!inMedusaProject;
}

function getVersionInfo() {
  var _require9 = require("../package.json"),
      version = _require9.version;

  var isMedusaProject = isLocalMedusaProject();

  if (isMedusaProject) {
    var medusaVersion = getLocalMedusaVersion();

    if (!medusaVersion) {
      medusaVersion = "unknown";
    }

    return "Medusa CLI version: ".concat(version, "\nMedusa version: ").concat(medusaVersion, "\n  Note: this is the Medusa version for the site at: ").concat(process.cwd());
  } else {
    return "Medusa CLI version: ".concat(version);
  }
}

module.exports = function (argv) {
  var cli = yargs();
  var isLocalProject = isLocalMedusaProject();
  cli.scriptName("medusa").usage("Usage: $0 <command> [options]").alias("h", "help").alias("v", "version").option("verbose", {
    "default": false,
    type: "boolean",
    describe: "Turn on verbose output",
    global: true
  }).option("no-color", {
    alias: "no-colors",
    "default": false,
    type: "boolean",
    describe: "Turn off the color in output",
    global: true
  }).option("json", {
    describe: "Turn on the JSON logger",
    "default": false,
    type: "boolean",
    global: true
  });
  buildLocalCommands(cli, isLocalProject);

  try {
    cli.version("version", "Show the version of the Medusa CLI and the Medusa package in the current project", getVersionInfo());
  } catch (e) {// ignore
  }

  return cli.wrap(cli.terminalWidth()).demandCommand(1, "Pass --help to see all available commands and options.").strict().fail(function (msg, err, yargs) {
    var availableCommands = yargs.getCommands().map(function (commandDescription) {
      var _commandDescription = _slicedToArray(commandDescription, 1),
          command = _commandDescription[0];

      return command.split(" ")[0];
    });
    var arg = argv.slice(2)[0];
    var suggestion = arg ? didYouMean(arg, availableCommands) : "";
    cli.showHelp();
    reporter.info(suggestion);
    reporter.info(msg);
  }).parse(argv.slice(2));
};