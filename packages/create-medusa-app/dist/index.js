var require$$0 = require('events');
var childProcess = require('child_process');
var path = require('path');
var fs = require('fs');
var os = require('os');
var tty = require('tty');
var assert = require('assert');
var require$$0$1 = require('buffer');
var Stream$1 = require('stream');
var util$1 = require('util');
var constants = require('constants');
var url = require('url');
var http = require('http');
var https = require('https');
var zlib = require('zlib');
var crypto = require('crypto');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var require$$0__default = /*#__PURE__*/_interopDefaultLegacy(require$$0);
var childProcess__default = /*#__PURE__*/_interopDefaultLegacy(childProcess);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var os__default = /*#__PURE__*/_interopDefaultLegacy(os);
var tty__default = /*#__PURE__*/_interopDefaultLegacy(tty);
var assert__default = /*#__PURE__*/_interopDefaultLegacy(assert);
var require$$0__default$1 = /*#__PURE__*/_interopDefaultLegacy(require$$0$1);
var Stream__default = /*#__PURE__*/_interopDefaultLegacy(Stream$1);
var util__default = /*#__PURE__*/_interopDefaultLegacy(util$1);
var constants__default = /*#__PURE__*/_interopDefaultLegacy(constants);
var url__default = /*#__PURE__*/_interopDefaultLegacy(url);
var http__default = /*#__PURE__*/_interopDefaultLegacy(http);
var https__default = /*#__PURE__*/_interopDefaultLegacy(https);
var zlib__default = /*#__PURE__*/_interopDefaultLegacy(zlib);
var crypto__default = /*#__PURE__*/_interopDefaultLegacy(crypto);

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn) {
  var module = { exports: {} };
	return fn(module, module.exports), module.exports;
}

// @ts-check

/**
 * CommanderError class
 * @class
 */
class CommanderError$1 extends Error {
  /**
   * Constructs the CommanderError class
   * @param {number} exitCode suggested exit code which could be used with process.exit
   * @param {string} code an id string representing the error
   * @param {string} message human-readable description of the error
   * @constructor
   */
  constructor(exitCode, code, message) {
    super(message);
    // properly capture stack trace in Node.js
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.code = code;
    this.exitCode = exitCode;
    this.nestedError = undefined;
  }
}

/**
 * InvalidArgumentError class
 * @class
 */
class InvalidArgumentError$2 extends CommanderError$1 {
  /**
   * Constructs the InvalidArgumentError class
   * @param {string} [message] explanation of why argument is invalid
   * @constructor
   */
  constructor(message) {
    super(1, 'commander.invalidArgument', message);
    // properly capture stack trace in Node.js
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
  }
}

var CommanderError_1 = CommanderError$1;
var InvalidArgumentError_1 = InvalidArgumentError$2;

var error$1 = {
	CommanderError: CommanderError_1,
	InvalidArgumentError: InvalidArgumentError_1
};

const { InvalidArgumentError: InvalidArgumentError$1 } = error$1;

// @ts-check

class Argument$1 {
  /**
   * Initialize a new command argument with the given name and description.
   * The default is that the argument is required, and you can explicitly
   * indicate this with <> around the name. Put [] around the name for an optional argument.
   *
   * @param {string} name
   * @param {string} [description]
   */

  constructor(name, description) {
    this.description = description || '';
    this.variadic = false;
    this.parseArg = undefined;
    this.defaultValue = undefined;
    this.defaultValueDescription = undefined;
    this.argChoices = undefined;

    switch (name[0]) {
      case '<': // e.g. <required>
        this.required = true;
        this._name = name.slice(1, -1);
        break;
      case '[': // e.g. [optional]
        this.required = false;
        this._name = name.slice(1, -1);
        break;
      default:
        this.required = true;
        this._name = name;
        break;
    }

    if (this._name.length > 3 && this._name.slice(-3) === '...') {
      this.variadic = true;
      this._name = this._name.slice(0, -3);
    }
  }

  /**
   * Return argument name.
   *
   * @return {string}
   */

  name() {
    return this._name;
  };

  /**
   * @api private
   */

  _concatValue(value, previous) {
    if (previous === this.defaultValue || !Array.isArray(previous)) {
      return [value];
    }

    return previous.concat(value);
  }

  /**
   * Set the default value, and optionally supply the description to be displayed in the help.
   *
   * @param {any} value
   * @param {string} [description]
   * @return {Argument}
   */

  default(value, description) {
    this.defaultValue = value;
    this.defaultValueDescription = description;
    return this;
  };

  /**
   * Set the custom handler for processing CLI command arguments into argument values.
   *
   * @param {Function} [fn]
   * @return {Argument}
   */

  argParser(fn) {
    this.parseArg = fn;
    return this;
  };

  /**
   * Only allow option value to be one of choices.
   *
   * @param {string[]} values
   * @return {Argument}
   */

  choices(values) {
    this.argChoices = values;
    this.parseArg = (arg, previous) => {
      if (!values.includes(arg)) {
        throw new InvalidArgumentError$1(`Allowed choices are ${values.join(', ')}.`);
      }
      if (this.variadic) {
        return this._concatValue(arg, previous);
      }
      return arg;
    };
    return this;
  };

  /**
   * Make option-argument required.
   */
  argRequired() {
    this.required = true;
    return this;
  }

  /**
   * Make option-argument optional.
   */
  argOptional() {
    this.required = false;
    return this;
  }
}

/**
 * Takes an argument and returns its human readable equivalent for help usage.
 *
 * @param {Argument} arg
 * @return {string}
 * @api private
 */

function humanReadableArgName$2(arg) {
  const nameOutput = arg.name() + (arg.variadic === true ? '...' : '');

  return arg.required
    ? '<' + nameOutput + '>'
    : '[' + nameOutput + ']';
}

var Argument_1 = Argument$1;
var humanReadableArgName_1 = humanReadableArgName$2;

var argument$1 = {
	Argument: Argument_1,
	humanReadableArgName: humanReadableArgName_1
};

const { humanReadableArgName: humanReadableArgName$1 } = argument$1;

/**
 * TypeScript import types for JSDoc, used by Visual Studio Code IntelliSense and `npm run typescript-checkJS`
 * https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html#import-types
 * @typedef { import("./argument.js").Argument } Argument
 * @typedef { import("./command.js").Command } Command
 * @typedef { import("./option.js").Option } Option
 */

// @ts-check

// Although this is a class, methods are static in style to allow override using subclass or just functions.
class Help$1 {
  constructor() {
    this.helpWidth = undefined;
    this.sortSubcommands = false;
    this.sortOptions = false;
  }

  /**
   * Get an array of the visible subcommands. Includes a placeholder for the implicit help command, if there is one.
   *
   * @param {Command} cmd
   * @returns {Command[]}
   */

  visibleCommands(cmd) {
    const visibleCommands = cmd.commands.filter(cmd => !cmd._hidden);
    if (cmd._hasImplicitHelpCommand()) {
      // Create a command matching the implicit help command.
      const [, helpName, helpArgs] = cmd._helpCommandnameAndArgs.match(/([^ ]+) *(.*)/);
      const helpCommand = cmd.createCommand(helpName)
        .helpOption(false);
      helpCommand.description(cmd._helpCommandDescription);
      if (helpArgs) helpCommand.arguments(helpArgs);
      visibleCommands.push(helpCommand);
    }
    if (this.sortSubcommands) {
      visibleCommands.sort((a, b) => {
        // @ts-ignore: overloaded return type
        return a.name().localeCompare(b.name());
      });
    }
    return visibleCommands;
  }

  /**
   * Get an array of the visible options. Includes a placeholder for the implicit help option, if there is one.
   *
   * @param {Command} cmd
   * @returns {Option[]}
   */

  visibleOptions(cmd) {
    const visibleOptions = cmd.options.filter((option) => !option.hidden);
    // Implicit help
    const showShortHelpFlag = cmd._hasHelpOption && cmd._helpShortFlag && !cmd._findOption(cmd._helpShortFlag);
    const showLongHelpFlag = cmd._hasHelpOption && !cmd._findOption(cmd._helpLongFlag);
    if (showShortHelpFlag || showLongHelpFlag) {
      let helpOption;
      if (!showShortHelpFlag) {
        helpOption = cmd.createOption(cmd._helpLongFlag, cmd._helpDescription);
      } else if (!showLongHelpFlag) {
        helpOption = cmd.createOption(cmd._helpShortFlag, cmd._helpDescription);
      } else {
        helpOption = cmd.createOption(cmd._helpFlags, cmd._helpDescription);
      }
      visibleOptions.push(helpOption);
    }
    if (this.sortOptions) {
      const getSortKey = (option) => {
        // WYSIWYG for order displayed in help with short before long, no special handling for negated.
        return option.short ? option.short.replace(/^-/, '') : option.long.replace(/^--/, '');
      };
      visibleOptions.sort((a, b) => {
        return getSortKey(a).localeCompare(getSortKey(b));
      });
    }
    return visibleOptions;
  }

  /**
   * Get an array of the arguments if any have a description.
   *
   * @param {Command} cmd
   * @returns {Argument[]}
   */

  visibleArguments(cmd) {
    // Side effect! Apply the legacy descriptions before the arguments are displayed.
    if (cmd._argsDescription) {
      cmd._args.forEach(argument => {
        argument.description = argument.description || cmd._argsDescription[argument.name()] || '';
      });
    }

    // If there are any arguments with a description then return all the arguments.
    if (cmd._args.find(argument => argument.description)) {
      return cmd._args;
    }    return [];
  }

  /**
   * Get the command term to show in the list of subcommands.
   *
   * @param {Command} cmd
   * @returns {string}
   */

  subcommandTerm(cmd) {
    // Legacy. Ignores custom usage string, and nested commands.
    const args = cmd._args.map(arg => humanReadableArgName$1(arg)).join(' ');
    return cmd._name +
      (cmd._aliases[0] ? '|' + cmd._aliases[0] : '') +
      (cmd.options.length ? ' [options]' : '') + // simplistic check for non-help option
      (args ? ' ' + args : '');
  }

  /**
   * Get the option term to show in the list of options.
   *
   * @param {Option} option
   * @returns {string}
   */

  optionTerm(option) {
    return option.flags;
  }

  /**
   * Get the argument term to show in the list of arguments.
   *
   * @param {Argument} argument
   * @returns {string}
   */

  argumentTerm(argument) {
    return argument.name();
  }

  /**
   * Get the longest command term length.
   *
   * @param {Command} cmd
   * @param {Help} helper
   * @returns {number}
   */

  longestSubcommandTermLength(cmd, helper) {
    return helper.visibleCommands(cmd).reduce((max, command) => {
      return Math.max(max, helper.subcommandTerm(command).length);
    }, 0);
  };

  /**
   * Get the longest option term length.
   *
   * @param {Command} cmd
   * @param {Help} helper
   * @returns {number}
   */

  longestOptionTermLength(cmd, helper) {
    return helper.visibleOptions(cmd).reduce((max, option) => {
      return Math.max(max, helper.optionTerm(option).length);
    }, 0);
  };

  /**
   * Get the longest argument term length.
   *
   * @param {Command} cmd
   * @param {Help} helper
   * @returns {number}
   */

  longestArgumentTermLength(cmd, helper) {
    return helper.visibleArguments(cmd).reduce((max, argument) => {
      return Math.max(max, helper.argumentTerm(argument).length);
    }, 0);
  };

  /**
   * Get the command usage to be displayed at the top of the built-in help.
   *
   * @param {Command} cmd
   * @returns {string}
   */

  commandUsage(cmd) {
    // Usage
    let cmdName = cmd._name;
    if (cmd._aliases[0]) {
      cmdName = cmdName + '|' + cmd._aliases[0];
    }
    let parentCmdNames = '';
    for (let parentCmd = cmd.parent; parentCmd; parentCmd = parentCmd.parent) {
      parentCmdNames = parentCmd.name() + ' ' + parentCmdNames;
    }
    return parentCmdNames + cmdName + ' ' + cmd.usage();
  }

  /**
   * Get the description for the command.
   *
   * @param {Command} cmd
   * @returns {string}
   */

  commandDescription(cmd) {
    // @ts-ignore: overloaded return type
    return cmd.description();
  }

  /**
   * Get the command description to show in the list of subcommands.
   *
   * @param {Command} cmd
   * @returns {string}
   */

  subcommandDescription(cmd) {
    // @ts-ignore: overloaded return type
    return cmd.description();
  }

  /**
   * Get the option description to show in the list of options.
   *
   * @param {Option} option
   * @return {string}
   */

  optionDescription(option) {
    if (option.negate) {
      return option.description;
    }
    const extraInfo = [];
    if (option.argChoices) {
      extraInfo.push(
        // use stringify to match the display of the default value
        `choices: ${option.argChoices.map((choice) => JSON.stringify(choice)).join(', ')}`);
    }
    if (option.defaultValue !== undefined) {
      extraInfo.push(`default: ${option.defaultValueDescription || JSON.stringify(option.defaultValue)}`);
    }
    if (extraInfo.length > 0) {
      return `${option.description} (${extraInfo.join(', ')})`;
    }
    return option.description;
  };

  /**
   * Get the argument description to show in the list of arguments.
   *
   * @param {Argument} argument
   * @return {string}
   */

  argumentDescription(argument) {
    const extraInfo = [];
    if (argument.argChoices) {
      extraInfo.push(
        // use stringify to match the display of the default value
        `choices: ${argument.argChoices.map((choice) => JSON.stringify(choice)).join(', ')}`);
    }
    if (argument.defaultValue !== undefined) {
      extraInfo.push(`default: ${argument.defaultValueDescription || JSON.stringify(argument.defaultValue)}`);
    }
    if (extraInfo.length > 0) {
      const extraDescripton = `(${extraInfo.join(', ')})`;
      if (argument.description) {
        return `${argument.description} ${extraDescripton}`;
      }
      return extraDescripton;
    }
    return argument.description;
  }

  /**
   * Generate the built-in help text.
   *
   * @param {Command} cmd
   * @param {Help} helper
   * @returns {string}
   */

  formatHelp(cmd, helper) {
    const termWidth = helper.padWidth(cmd, helper);
    const helpWidth = helper.helpWidth || 80;
    const itemIndentWidth = 2;
    const itemSeparatorWidth = 2; // between term and description
    function formatItem(term, description) {
      if (description) {
        const fullText = `${term.padEnd(termWidth + itemSeparatorWidth)}${description}`;
        return helper.wrap(fullText, helpWidth - itemIndentWidth, termWidth + itemSeparatorWidth);
      }
      return term;
    }    function formatList(textArray) {
      return textArray.join('\n').replace(/^/gm, ' '.repeat(itemIndentWidth));
    }

    // Usage
    let output = [`Usage: ${helper.commandUsage(cmd)}`, ''];

    // Description
    const commandDescription = helper.commandDescription(cmd);
    if (commandDescription.length > 0) {
      output = output.concat([commandDescription, '']);
    }

    // Arguments
    const argumentList = helper.visibleArguments(cmd).map((argument) => {
      return formatItem(helper.argumentTerm(argument), helper.argumentDescription(argument));
    });
    if (argumentList.length > 0) {
      output = output.concat(['Arguments:', formatList(argumentList), '']);
    }

    // Options
    const optionList = helper.visibleOptions(cmd).map((option) => {
      return formatItem(helper.optionTerm(option), helper.optionDescription(option));
    });
    if (optionList.length > 0) {
      output = output.concat(['Options:', formatList(optionList), '']);
    }

    // Commands
    const commandList = helper.visibleCommands(cmd).map((cmd) => {
      return formatItem(helper.subcommandTerm(cmd), helper.subcommandDescription(cmd));
    });
    if (commandList.length > 0) {
      output = output.concat(['Commands:', formatList(commandList), '']);
    }

    return output.join('\n');
  }

  /**
   * Calculate the pad width from the maximum term length.
   *
   * @param {Command} cmd
   * @param {Help} helper
   * @returns {number}
   */

  padWidth(cmd, helper) {
    return Math.max(
      helper.longestOptionTermLength(cmd, helper),
      helper.longestSubcommandTermLength(cmd, helper),
      helper.longestArgumentTermLength(cmd, helper)
    );
  };

  /**
   * Wrap the given string to width characters per line, with lines after the first indented.
   * Do not wrap if insufficient room for wrapping (minColumnWidth), or string is manually formatted.
   *
   * @param {string} str
   * @param {number} width
   * @param {number} indent
   * @param {number} [minColumnWidth=40]
   * @return {string}
   *
   */

  wrap(str, width, indent, minColumnWidth = 40) {
    // Detect manually wrapped and indented strings by searching for line breaks
    // followed by multiple spaces/tabs.
    if (str.match(/[\n]\s+/)) return str;
    // Do not wrap if not enough room for a wrapped column of text (as could end up with a word per line).
    const columnWidth = width - indent;
    if (columnWidth < minColumnWidth) return str;

    const leadingStr = str.substr(0, indent);
    const columnText = str.substr(indent);

    const indentString = ' '.repeat(indent);
    const regex = new RegExp('.{1,' + (columnWidth - 1) + '}([\\s\u200B]|$)|[^\\s\u200B]+?([\\s\u200B]|$)', 'g');
    const lines = columnText.match(regex) || [];
    return leadingStr + lines.map((line, i) => {
      if (line.slice(-1) === '\n') {
        line = line.slice(0, line.length - 1);
      }
      return ((i > 0) ? indentString : '') + line.trimRight();
    }).join('\n');
  }
}

var Help_1 = Help$1;

var help = {
	Help: Help_1
};

const { InvalidArgumentError } = error$1;

// @ts-check

class Option$1 {
  /**
   * Initialize a new `Option` with the given `flags` and `description`.
   *
   * @param {string} flags
   * @param {string} [description]
   */

  constructor(flags, description) {
    this.flags = flags;
    this.description = description || '';

    this.required = flags.includes('<'); // A value must be supplied when the option is specified.
    this.optional = flags.includes('['); // A value is optional when the option is specified.
    // variadic test ignores <value,...> et al which might be used to describe custom splitting of single argument
    this.variadic = /\w\.\.\.[>\]]$/.test(flags); // The option can take multiple values.
    this.mandatory = false; // The option must have a value after parsing, which usually means it must be specified on command line.
    const optionFlags = splitOptionFlags$1(flags);
    this.short = optionFlags.shortFlag;
    this.long = optionFlags.longFlag;
    this.negate = false;
    if (this.long) {
      this.negate = this.long.startsWith('--no-');
    }
    this.defaultValue = undefined;
    this.defaultValueDescription = undefined;
    this.parseArg = undefined;
    this.hidden = false;
    this.argChoices = undefined;
  }

  /**
   * Set the default value, and optionally supply the description to be displayed in the help.
   *
   * @param {any} value
   * @param {string} [description]
   * @return {Option}
   */

  default(value, description) {
    this.defaultValue = value;
    this.defaultValueDescription = description;
    return this;
  };

  /**
   * Set the custom handler for processing CLI option arguments into option values.
   *
   * @param {Function} [fn]
   * @return {Option}
   */

  argParser(fn) {
    this.parseArg = fn;
    return this;
  };

  /**
   * Whether the option is mandatory and must have a value after parsing.
   *
   * @param {boolean} [mandatory=true]
   * @return {Option}
   */

  makeOptionMandatory(mandatory = true) {
    this.mandatory = !!mandatory;
    return this;
  };

  /**
   * Hide option in help.
   *
   * @param {boolean} [hide=true]
   * @return {Option}
   */

  hideHelp(hide = true) {
    this.hidden = !!hide;
    return this;
  };

  /**
   * @api private
   */

  _concatValue(value, previous) {
    if (previous === this.defaultValue || !Array.isArray(previous)) {
      return [value];
    }

    return previous.concat(value);
  }

  /**
   * Only allow option value to be one of choices.
   *
   * @param {string[]} values
   * @return {Option}
   */

  choices(values) {
    this.argChoices = values;
    this.parseArg = (arg, previous) => {
      if (!values.includes(arg)) {
        throw new InvalidArgumentError(`Allowed choices are ${values.join(', ')}.`);
      }
      if (this.variadic) {
        return this._concatValue(arg, previous);
      }
      return arg;
    };
    return this;
  };

  /**
   * Return option name.
   *
   * @return {string}
   */

  name() {
    if (this.long) {
      return this.long.replace(/^--/, '');
    }
    return this.short.replace(/^-/, '');
  };

  /**
   * Return option name, in a camelcase format that can be used
   * as a object attribute key.
   *
   * @return {string}
   * @api private
   */

  attributeName() {
    return camelcase(this.name().replace(/^no-/, ''));
  };

  /**
   * Check if `arg` matches the short or long flag.
   *
   * @param {string} arg
   * @return {boolean}
   * @api private
   */

  is(arg) {
    return this.short === arg || this.long === arg;
  };
}

/**
 * Convert string from kebab-case to camelCase.
 *
 * @param {string} str
 * @return {string}
 * @api private
 */

function camelcase(str) {
  return str.split('-').reduce((str, word) => {
    return str + word[0].toUpperCase() + word.slice(1);
  });
}

/**
 * Split the short and long flag out of something like '-m,--mixed <value>'
 *
 * @api private
 */

function splitOptionFlags$1(flags) {
  let shortFlag;
  let longFlag;
  // Use original very loose parsing to maintain backwards compatibility for now,
  // which allowed for example unintended `-sw, --short-word` [sic].
  const flagParts = flags.split(/[ |,]+/);
  if (flagParts.length > 1 && !/^[[<]/.test(flagParts[1])) shortFlag = flagParts.shift();
  longFlag = flagParts.shift();
  // Add support for lone short flag without significantly changing parsing!
  if (!shortFlag && /^-[^-]$/.test(longFlag)) {
    shortFlag = longFlag;
    longFlag = undefined;
  }
  return { shortFlag, longFlag };
}

var Option_1 = Option$1;
var splitOptionFlags_1 = splitOptionFlags$1;

var option = {
	Option: Option_1,
	splitOptionFlags: splitOptionFlags_1
};

const EventEmitter = require$$0__default['default'].EventEmitter;




const { Argument, humanReadableArgName } = argument$1;
const { CommanderError } = error$1;
const { Help } = help;
const { Option, splitOptionFlags } = option;

// @ts-check

class Command extends EventEmitter {
  /**
   * Initialize a new `Command`.
   *
   * @param {string} [name]
   */

  constructor(name) {
    super();
    /** @type {Command[]} */
    this.commands = [];
    /** @type {Option[]} */
    this.options = [];
    this.parent = null;
    this._allowUnknownOption = false;
    this._allowExcessArguments = true;
    /** @type {Argument[]} */
    this._args = [];
    /** @type {string[]} */
    this.args = []; // cli args with options removed
    this.rawArgs = [];
    this.processedArgs = []; // like .args but after custom processing and collecting variadic
    this._scriptPath = null;
    this._name = name || '';
    this._optionValues = {};
    this._storeOptionsAsProperties = false;
    this._actionHandler = null;
    this._executableHandler = false;
    this._executableFile = null; // custom name for executable
    this._defaultCommandName = null;
    this._exitCallback = null;
    this._aliases = [];
    this._combineFlagAndOptionalValue = true;
    this._description = '';
    this._argsDescription = undefined; // legacy
    this._enablePositionalOptions = false;
    this._passThroughOptions = false;
    this._lifeCycleHooks = {}; // a hash of arrays
    /** @type {boolean | string} */
    this._showHelpAfterError = false;

    // see .configureOutput() for docs
    this._outputConfiguration = {
      writeOut: (str) => process.stdout.write(str),
      writeErr: (str) => process.stderr.write(str),
      getOutHelpWidth: () => process.stdout.isTTY ? process.stdout.columns : undefined,
      getErrHelpWidth: () => process.stderr.isTTY ? process.stderr.columns : undefined,
      outputError: (str, write) => write(str)
    };

    this._hidden = false;
    this._hasHelpOption = true;
    this._helpFlags = '-h, --help';
    this._helpDescription = 'display help for command';
    this._helpShortFlag = '-h';
    this._helpLongFlag = '--help';
    this._addImplicitHelpCommand = undefined; // Deliberately undefined, not decided whether true or false
    this._helpCommandName = 'help';
    this._helpCommandnameAndArgs = 'help [command]';
    this._helpCommandDescription = 'display help for command';
    this._helpConfiguration = {};
  }

  /**
   * Copy settings that are useful to have in common across root command and subcommands.
   *
   * (Used internally when adding a command using `.command()` so subcommands inherit parent settings.)
   *
   * @param {Command} sourceCommand
   * @return {Command} returns `this` for executable command
   */
  copyInheritedSettings(sourceCommand) {
    this._outputConfiguration = sourceCommand._outputConfiguration;
    this._hasHelpOption = sourceCommand._hasHelpOption;
    this._helpFlags = sourceCommand._helpFlags;
    this._helpDescription = sourceCommand._helpDescription;
    this._helpShortFlag = sourceCommand._helpShortFlag;
    this._helpLongFlag = sourceCommand._helpLongFlag;
    this._helpCommandName = sourceCommand._helpCommandName;
    this._helpCommandnameAndArgs = sourceCommand._helpCommandnameAndArgs;
    this._helpCommandDescription = sourceCommand._helpCommandDescription;
    this._helpConfiguration = sourceCommand._helpConfiguration;
    this._exitCallback = sourceCommand._exitCallback;
    this._storeOptionsAsProperties = sourceCommand._storeOptionsAsProperties;
    this._combineFlagAndOptionalValue = sourceCommand._combineFlagAndOptionalValue;
    this._allowExcessArguments = sourceCommand._allowExcessArguments;
    this._enablePositionalOptions = sourceCommand._enablePositionalOptions;
    this._showHelpAfterError = sourceCommand._showHelpAfterError;

    return this;
  }

  /**
   * Define a command.
   *
   * There are two styles of command: pay attention to where to put the description.
   *
   * @example
   * // Command implemented using action handler (description is supplied separately to `.command`)
   * program
   *   .command('clone <source> [destination]')
   *   .description('clone a repository into a newly created directory')
   *   .action((source, destination) => {
   *     console.log('clone command called');
   *   });
   *
   * // Command implemented using separate executable file (description is second parameter to `.command`)
   * program
   *   .command('start <service>', 'start named service')
   *   .command('stop [service]', 'stop named service, or all if no name supplied');
   *
   * @param {string} nameAndArgs - command name and arguments, args are `<required>` or `[optional]` and last may also be `variadic...`
   * @param {Object|string} [actionOptsOrExecDesc] - configuration options (for action), or description (for executable)
   * @param {Object} [execOpts] - configuration options (for executable)
   * @return {Command} returns new command for action handler, or `this` for executable command
   */

  command(nameAndArgs, actionOptsOrExecDesc, execOpts) {
    let desc = actionOptsOrExecDesc;
    let opts = execOpts;
    if (typeof desc === 'object' && desc !== null) {
      opts = desc;
      desc = null;
    }
    opts = opts || {};
    const [, name, args] = nameAndArgs.match(/([^ ]+) *(.*)/);

    const cmd = this.createCommand(name);
    if (desc) {
      cmd.description(desc);
      cmd._executableHandler = true;
    }
    if (opts.isDefault) this._defaultCommandName = cmd._name;
    cmd._hidden = !!(opts.noHelp || opts.hidden); // noHelp is deprecated old name for hidden
    cmd._executableFile = opts.executableFile || null; // Custom name for executable file, set missing to null to match constructor
    if (args) cmd.arguments(args);
    this.commands.push(cmd);
    cmd.parent = this;
    cmd.copyInheritedSettings(this);

    if (desc) return this;
    return cmd;
  };

  /**
   * Factory routine to create a new unattached command.
   *
   * See .command() for creating an attached subcommand, which uses this routine to
   * create the command. You can override createCommand to customise subcommands.
   *
   * @param {string} [name]
   * @return {Command} new command
   */

  createCommand(name) {
    return new Command(name);
  };

  /**
   * You can customise the help with a subclass of Help by overriding createHelp,
   * or by overriding Help properties using configureHelp().
   *
   * @return {Help}
   */

  createHelp() {
    return Object.assign(new Help(), this.configureHelp());
  };

  /**
   * You can customise the help by overriding Help properties using configureHelp(),
   * or with a subclass of Help by overriding createHelp().
   *
   * @param {Object} [configuration] - configuration options
   * @return {Command|Object} `this` command for chaining, or stored configuration
   */

  configureHelp(configuration) {
    if (configuration === undefined) return this._helpConfiguration;

    this._helpConfiguration = configuration;
    return this;
  }

  /**
   * The default output goes to stdout and stderr. You can customise this for special
   * applications. You can also customise the display of errors by overriding outputError.
   *
   * The configuration properties are all functions:
   *
   *     // functions to change where being written, stdout and stderr
   *     writeOut(str)
   *     writeErr(str)
   *     // matching functions to specify width for wrapping help
   *     getOutHelpWidth()
   *     getErrHelpWidth()
   *     // functions based on what is being written out
   *     outputError(str, write) // used for displaying errors, and not used for displaying help
   *
   * @param {Object} [configuration] - configuration options
   * @return {Command|Object} `this` command for chaining, or stored configuration
   */

  configureOutput(configuration) {
    if (configuration === undefined) return this._outputConfiguration;

    Object.assign(this._outputConfiguration, configuration);
    return this;
  }

  /**
   * Display the help or a custom message after an error occurs.
   *
   * @param {boolean|string} [displayHelp]
   * @return {Command} `this` command for chaining
   */
  showHelpAfterError(displayHelp = true) {
    if (typeof displayHelp !== 'string') displayHelp = !!displayHelp;
    this._showHelpAfterError = displayHelp;
    return this;
  }

  /**
   * Add a prepared subcommand.
   *
   * See .command() for creating an attached subcommand which inherits settings from its parent.
   *
   * @param {Command} cmd - new subcommand
   * @param {Object} [opts] - configuration options
   * @return {Command} `this` command for chaining
   */

  addCommand(cmd, opts) {
    if (!cmd._name) throw new Error('Command passed to .addCommand() must have a name');

    // To keep things simple, block automatic name generation for deeply nested executables.
    // Fail fast and detect when adding rather than later when parsing.
    function checkExplicitNames(commandArray) {
      commandArray.forEach((cmd) => {
        if (cmd._executableHandler && !cmd._executableFile) {
          throw new Error(`Must specify executableFile for deeply nested executable: ${cmd.name()}`);
        }
        checkExplicitNames(cmd.commands);
      });
    }
    checkExplicitNames(cmd.commands);

    opts = opts || {};
    if (opts.isDefault) this._defaultCommandName = cmd._name;
    if (opts.noHelp || opts.hidden) cmd._hidden = true; // modifying passed command due to existing implementation

    this.commands.push(cmd);
    cmd.parent = this;
    return this;
  };

  /**
   * Factory routine to create a new unattached argument.
   *
   * See .argument() for creating an attached argument, which uses this routine to
   * create the argument. You can override createArgument to return a custom argument.
   *
   * @param {string} name
   * @param {string} [description]
   * @return {Argument} new argument
   */

  createArgument(name, description) {
    return new Argument(name, description);
  };

  /**
   * Define argument syntax for command.
   *
   * The default is that the argument is required, and you can explicitly
   * indicate this with <> around the name. Put [] around the name for an optional argument.
   *
   * @example
   * program.argument('<input-file>');
   * program.argument('[output-file]');
   *
   * @param {string} name
   * @param {string} [description]
   * @param {Function|*} [fn] - custom argument processing function
   * @param {*} [defaultValue]
   * @return {Command} `this` command for chaining
   */
  argument(name, description, fn, defaultValue) {
    const argument = this.createArgument(name, description);
    if (typeof fn === 'function') {
      argument.default(defaultValue).argParser(fn);
    } else {
      argument.default(fn);
    }
    this.addArgument(argument);
    return this;
  }

  /**
   * Define argument syntax for command, adding multiple at once (without descriptions).
   *
   * See also .argument().
   *
   * @example
   * program.arguments('<cmd> [env]');
   *
   * @param {string} names
   * @return {Command} `this` command for chaining
   */

  arguments(names) {
    names.split(/ +/).forEach((detail) => {
      this.argument(detail);
    });
    return this;
  };

  /**
   * Define argument syntax for command, adding a prepared argument.
   *
   * @param {Argument} argument
   * @return {Command} `this` command for chaining
   */
  addArgument(argument) {
    const previousArgument = this._args.slice(-1)[0];
    if (previousArgument && previousArgument.variadic) {
      throw new Error(`only the last argument can be variadic '${previousArgument.name()}'`);
    }
    if (argument.required && argument.defaultValue !== undefined && argument.parseArg === undefined) {
      throw new Error(`a default value for a required argument is never used: '${argument.name()}'`);
    }
    this._args.push(argument);
    return this;
  }

  /**
   * Override default decision whether to add implicit help command.
   *
   *    addHelpCommand() // force on
   *    addHelpCommand(false); // force off
   *    addHelpCommand('help [cmd]', 'display help for [cmd]'); // force on with custom details
   *
   * @return {Command} `this` command for chaining
   */

  addHelpCommand(enableOrNameAndArgs, description) {
    if (enableOrNameAndArgs === false) {
      this._addImplicitHelpCommand = false;
    } else {
      this._addImplicitHelpCommand = true;
      if (typeof enableOrNameAndArgs === 'string') {
        this._helpCommandName = enableOrNameAndArgs.split(' ')[0];
        this._helpCommandnameAndArgs = enableOrNameAndArgs;
      }
      this._helpCommandDescription = description || this._helpCommandDescription;
    }
    return this;
  };

  /**
   * @return {boolean}
   * @api private
   */

  _hasImplicitHelpCommand() {
    if (this._addImplicitHelpCommand === undefined) {
      return this.commands.length && !this._actionHandler && !this._findCommand('help');
    }
    return this._addImplicitHelpCommand;
  };

  /**
   * Add hook for life cycle event.
   *
   * @param {string} event
   * @param {Function} listener
   * @return {Command} `this` command for chaining
   */

  hook(event, listener) {
    const allowedValues = ['preAction', 'postAction'];
    if (!allowedValues.includes(event)) {
      throw new Error(`Unexpected value for event passed to hook : '${event}'.
Expecting one of '${allowedValues.join("', '")}'`);
    }
    if (this._lifeCycleHooks[event]) {
      this._lifeCycleHooks[event].push(listener);
    } else {
      this._lifeCycleHooks[event] = [listener];
    }
    return this;
  }

  /**
   * Register callback to use as replacement for calling process.exit.
   *
   * @param {Function} [fn] optional callback which will be passed a CommanderError, defaults to throwing
   * @return {Command} `this` command for chaining
   */

  exitOverride(fn) {
    if (fn) {
      this._exitCallback = fn;
    } else {
      this._exitCallback = (err) => {
        if (err.code !== 'commander.executeSubCommandAsync') {
          throw err;
        }
      };
    }
    return this;
  };

  /**
   * Call process.exit, and _exitCallback if defined.
   *
   * @param {number} exitCode exit code for using with process.exit
   * @param {string} code an id string representing the error
   * @param {string} message human-readable description of the error
   * @return never
   * @api private
   */

  _exit(exitCode, code, message) {
    if (this._exitCallback) {
      this._exitCallback(new CommanderError(exitCode, code, message));
      // Expecting this line is not reached.
    }
    process.exit(exitCode);
  };

  /**
   * Register callback `fn` for the command.
   *
   * @example
   * program
   *   .command('help')
   *   .description('display verbose help')
   *   .action(function() {
   *      // output help here
   *   });
   *
   * @param {Function} fn
   * @return {Command} `this` command for chaining
   */

  action(fn) {
    const listener = (args) => {
      // The .action callback takes an extra parameter which is the command or options.
      const expectedArgsCount = this._args.length;
      const actionArgs = args.slice(0, expectedArgsCount);
      if (this._storeOptionsAsProperties) {
        actionArgs[expectedArgsCount] = this; // backwards compatible "options"
      } else {
        actionArgs[expectedArgsCount] = this.opts();
      }
      actionArgs.push(this);

      return fn.apply(this, actionArgs);
    };
    this._actionHandler = listener;
    return this;
  };

  /**
   * Factory routine to create a new unattached option.
   *
   * See .option() for creating an attached option, which uses this routine to
   * create the option. You can override createOption to return a custom option.
   *
   * @param {string} flags
   * @param {string} [description]
   * @return {Option} new option
   */

  createOption(flags, description) {
    return new Option(flags, description);
  };

  /**
   * Add an option.
   *
   * @param {Option} option
   * @return {Command} `this` command for chaining
   */
  addOption(option) {
    const oname = option.name();
    const name = option.attributeName();

    let defaultValue = option.defaultValue;

    // preassign default value for --no-*, [optional], <required>, or plain flag if boolean value
    if (option.negate || option.optional || option.required || typeof defaultValue === 'boolean') {
      // when --no-foo we make sure default is true, unless a --foo option is already defined
      if (option.negate) {
        const positiveLongFlag = option.long.replace(/^--no-/, '--');
        defaultValue = this._findOption(positiveLongFlag) ? this.getOptionValue(name) : true;
      }
      // preassign only if we have a default
      if (defaultValue !== undefined) {
        this.setOptionValue(name, defaultValue);
      }
    }

    // register the option
    this.options.push(option);

    // when it's passed assign the value
    // and conditionally invoke the callback
    this.on('option:' + oname, (val) => {
      const oldValue = this.getOptionValue(name);

      // custom processing
      if (val !== null && option.parseArg) {
        try {
          val = option.parseArg(val, oldValue === undefined ? defaultValue : oldValue);
        } catch (err) {
          if (err.code === 'commander.invalidArgument') {
            const message = `error: option '${option.flags}' argument '${val}' is invalid. ${err.message}`;
            this._displayError(err.exitCode, err.code, message);
          }
          throw err;
        }
      } else if (val !== null && option.variadic) {
        val = option._concatValue(val, oldValue);
      }

      // unassigned or boolean value
      if (typeof oldValue === 'boolean' || typeof oldValue === 'undefined') {
        // if no value, negate false, and we have a default, then use it!
        if (val == null) {
          this.setOptionValue(name, option.negate
            ? false
            : defaultValue || true);
        } else {
          this.setOptionValue(name, val);
        }
      } else if (val !== null) {
        // reassign
        this.setOptionValue(name, option.negate ? false : val);
      }
    });

    return this;
  }

  /**
   * Internal implementation shared by .option() and .requiredOption()
   *
   * @api private
   */
  _optionEx(config, flags, description, fn, defaultValue) {
    const option = this.createOption(flags, description);
    option.makeOptionMandatory(!!config.mandatory);
    if (typeof fn === 'function') {
      option.default(defaultValue).argParser(fn);
    } else if (fn instanceof RegExp) {
      // deprecated
      const regex = fn;
      fn = (val, def) => {
        const m = regex.exec(val);
        return m ? m[0] : def;
      };
      option.default(defaultValue).argParser(fn);
    } else {
      option.default(fn);
    }

    return this.addOption(option);
  }

  /**
   * Define option with `flags`, `description` and optional
   * coercion `fn`.
   *
   * The `flags` string contains the short and/or long flags,
   * separated by comma, a pipe or space. The following are all valid
   * all will output this way when `--help` is used.
   *
   *     "-p, --pepper"
   *     "-p|--pepper"
   *     "-p --pepper"
   *
   * @example
   * // simple boolean defaulting to undefined
   * program.option('-p, --pepper', 'add pepper');
   *
   * program.pepper
   * // => undefined
   *
   * --pepper
   * program.pepper
   * // => true
   *
   * // simple boolean defaulting to true (unless non-negated option is also defined)
   * program.option('-C, --no-cheese', 'remove cheese');
   *
   * program.cheese
   * // => true
   *
   * --no-cheese
   * program.cheese
   * // => false
   *
   * // required argument
   * program.option('-C, --chdir <path>', 'change the working directory');
   *
   * --chdir /tmp
   * program.chdir
   * // => "/tmp"
   *
   * // optional argument
   * program.option('-c, --cheese [type]', 'add cheese [marble]');
   *
   * @param {string} flags
   * @param {string} [description]
   * @param {Function|*} [fn] - custom option processing function or default value
   * @param {*} [defaultValue]
   * @return {Command} `this` command for chaining
   */

  option(flags, description, fn, defaultValue) {
    return this._optionEx({}, flags, description, fn, defaultValue);
  };

  /**
  * Add a required option which must have a value after parsing. This usually means
  * the option must be specified on the command line. (Otherwise the same as .option().)
  *
  * The `flags` string contains the short and/or long flags, separated by comma, a pipe or space.
  *
  * @param {string} flags
  * @param {string} [description]
  * @param {Function|*} [fn] - custom option processing function or default value
  * @param {*} [defaultValue]
  * @return {Command} `this` command for chaining
  */

  requiredOption(flags, description, fn, defaultValue) {
    return this._optionEx({ mandatory: true }, flags, description, fn, defaultValue);
  };

  /**
   * Alter parsing of short flags with optional values.
   *
   * @example
   * // for `.option('-f,--flag [value]'):
   * program.combineFlagAndOptionalValue(true);  // `-f80` is treated like `--flag=80`, this is the default behaviour
   * program.combineFlagAndOptionalValue(false) // `-fb` is treated like `-f -b`
   *
   * @param {Boolean} [combine=true] - if `true` or omitted, an optional value can be specified directly after the flag.
   */
  combineFlagAndOptionalValue(combine = true) {
    this._combineFlagAndOptionalValue = !!combine;
    return this;
  };

  /**
   * Allow unknown options on the command line.
   *
   * @param {Boolean} [allowUnknown=true] - if `true` or omitted, no error will be thrown
   * for unknown options.
   */
  allowUnknownOption(allowUnknown = true) {
    this._allowUnknownOption = !!allowUnknown;
    return this;
  };

  /**
   * Allow excess command-arguments on the command line. Pass false to make excess arguments an error.
   *
   * @param {Boolean} [allowExcess=true] - if `true` or omitted, no error will be thrown
   * for excess arguments.
   */
  allowExcessArguments(allowExcess = true) {
    this._allowExcessArguments = !!allowExcess;
    return this;
  };

  /**
   * Enable positional options. Positional means global options are specified before subcommands which lets
   * subcommands reuse the same option names, and also enables subcommands to turn on passThroughOptions.
   * The default behaviour is non-positional and global options may appear anywhere on the command line.
   *
   * @param {Boolean} [positional=true]
   */
  enablePositionalOptions(positional = true) {
    this._enablePositionalOptions = !!positional;
    return this;
  };

  /**
   * Pass through options that come after command-arguments rather than treat them as command-options,
   * so actual command-options come before command-arguments. Turning this on for a subcommand requires
   * positional options to have been enabled on the program (parent commands).
   * The default behaviour is non-positional and options may appear before or after command-arguments.
   *
   * @param {Boolean} [passThrough=true]
   * for unknown options.
   */
  passThroughOptions(passThrough = true) {
    this._passThroughOptions = !!passThrough;
    if (!!this.parent && passThrough && !this.parent._enablePositionalOptions) {
      throw new Error('passThroughOptions can not be used without turning on enablePositionalOptions for parent command(s)');
    }
    return this;
  };

  /**
    * Whether to store option values as properties on command object,
    * or store separately (specify false). In both cases the option values can be accessed using .opts().
    *
    * @param {boolean} [storeAsProperties=true]
    * @return {Command} `this` command for chaining
    */

  storeOptionsAsProperties(storeAsProperties = true) {
    this._storeOptionsAsProperties = !!storeAsProperties;
    if (this.options.length) {
      throw new Error('call .storeOptionsAsProperties() before adding options');
    }
    return this;
  };

  /**
   * Retrieve option value.
   *
   * @param {string} key
   * @return {Object} value
   */

  getOptionValue(key) {
    if (this._storeOptionsAsProperties) {
      return this[key];
    }
    return this._optionValues[key];
  };

  /**
   * Store option value.
   *
   * @param {string} key
   * @param {Object} value
   * @return {Command} `this` command for chaining
   */

  setOptionValue(key, value) {
    if (this._storeOptionsAsProperties) {
      this[key] = value;
    } else {
      this._optionValues[key] = value;
    }
    return this;
  };

  /**
   * Get user arguments implied or explicit arguments.
   * Side-effects: set _scriptPath if args included application, and use that to set implicit command name.
   *
   * @api private
   */

  _prepareUserArgs(argv, parseOptions) {
    if (argv !== undefined && !Array.isArray(argv)) {
      throw new Error('first parameter to parse must be array or undefined');
    }
    parseOptions = parseOptions || {};

    // Default to using process.argv
    if (argv === undefined) {
      argv = process.argv;
      // @ts-ignore: unknown property
      if (process.versions && process.versions.electron) {
        parseOptions.from = 'electron';
      }
    }
    this.rawArgs = argv.slice();

    // make it a little easier for callers by supporting various argv conventions
    let userArgs;
    switch (parseOptions.from) {
      case undefined:
      case 'node':
        this._scriptPath = argv[1];
        userArgs = argv.slice(2);
        break;
      case 'electron':
        // @ts-ignore: unknown property
        if (process.defaultApp) {
          this._scriptPath = argv[1];
          userArgs = argv.slice(2);
        } else {
          userArgs = argv.slice(1);
        }
        break;
      case 'user':
        userArgs = argv.slice(0);
        break;
      default:
        throw new Error(`unexpected parse option { from: '${parseOptions.from}' }`);
    }
    if (!this._scriptPath && require.main) {
      this._scriptPath = require.main.filename;
    }

    // Guess name, used in usage in help.
    this._name = this._name || (this._scriptPath && path__default['default'].basename(this._scriptPath, path__default['default'].extname(this._scriptPath)));

    return userArgs;
  }

  /**
   * Parse `argv`, setting options and invoking commands when defined.
   *
   * The default expectation is that the arguments are from node and have the application as argv[0]
   * and the script being run in argv[1], with user parameters after that.
   *
   * @example
   * program.parse(process.argv);
   * program.parse(); // implicitly use process.argv and auto-detect node vs electron conventions
   * program.parse(my-args, { from: 'user' }); // just user supplied arguments, nothing special about argv[0]
   *
   * @param {string[]} [argv] - optional, defaults to process.argv
   * @param {Object} [parseOptions] - optionally specify style of options with from: node/user/electron
   * @param {string} [parseOptions.from] - where the args are from: 'node', 'user', 'electron'
   * @return {Command} `this` command for chaining
   */

  parse(argv, parseOptions) {
    const userArgs = this._prepareUserArgs(argv, parseOptions);
    this._parseCommand([], userArgs);

    return this;
  };

  /**
   * Parse `argv`, setting options and invoking commands when defined.
   *
   * Use parseAsync instead of parse if any of your action handlers are async. Returns a Promise.
   *
   * The default expectation is that the arguments are from node and have the application as argv[0]
   * and the script being run in argv[1], with user parameters after that.
   *
   * @example
   * await program.parseAsync(process.argv);
   * await program.parseAsync(); // implicitly use process.argv and auto-detect node vs electron conventions
   * await program.parseAsync(my-args, { from: 'user' }); // just user supplied arguments, nothing special about argv[0]
   *
   * @param {string[]} [argv]
   * @param {Object} [parseOptions]
   * @param {string} parseOptions.from - where the args are from: 'node', 'user', 'electron'
   * @return {Promise}
   */

  async parseAsync(argv, parseOptions) {
    const userArgs = this._prepareUserArgs(argv, parseOptions);
    await this._parseCommand([], userArgs);

    return this;
  };

  /**
   * Execute a sub-command executable.
   *
   * @api private
   */

  _executeSubCommand(subcommand, args) {
    args = args.slice();
    let launchWithNode = false; // Use node for source targets so do not need to get permissions correct, and on Windows.
    const sourceExt = ['.js', '.ts', '.tsx', '.mjs', '.cjs'];

    // Not checking for help first. Unlikely to have mandatory and executable, and can't robustly test for help flags in external command.
    this._checkForMissingMandatoryOptions();

    // Want the entry script as the reference for command name and directory for searching for other files.
    let scriptPath = this._scriptPath;
    // Fallback in case not set, due to how Command created or called.
    if (!scriptPath && require.main) {
      scriptPath = require.main.filename;
    }

    let baseDir;
    try {
      const resolvedLink = fs__default['default'].realpathSync(scriptPath);
      baseDir = path__default['default'].dirname(resolvedLink);
    } catch (e) {
      baseDir = '.'; // dummy, probably not going to find executable!
    }

    // name of the subcommand, like `pm-install`
    let bin = path__default['default'].basename(scriptPath, path__default['default'].extname(scriptPath)) + '-' + subcommand._name;
    if (subcommand._executableFile) {
      bin = subcommand._executableFile;
    }

    const localBin = path__default['default'].join(baseDir, bin);
    if (fs__default['default'].existsSync(localBin)) {
      // prefer local `./<bin>` to bin in the $PATH
      bin = localBin;
    } else {
      // Look for source files.
      sourceExt.forEach((ext) => {
        if (fs__default['default'].existsSync(`${localBin}${ext}`)) {
          bin = `${localBin}${ext}`;
        }
      });
    }
    launchWithNode = sourceExt.includes(path__default['default'].extname(bin));

    let proc;
    if (process.platform !== 'win32') {
      if (launchWithNode) {
        args.unshift(bin);
        // add executable arguments to spawn
        args = incrementNodeInspectorPort(process.execArgv).concat(args);

        proc = childProcess__default['default'].spawn(process.argv[0], args, { stdio: 'inherit' });
      } else {
        proc = childProcess__default['default'].spawn(bin, args, { stdio: 'inherit' });
      }
    } else {
      args.unshift(bin);
      // add executable arguments to spawn
      args = incrementNodeInspectorPort(process.execArgv).concat(args);
      proc = childProcess__default['default'].spawn(process.execPath, args, { stdio: 'inherit' });
    }

    const signals = ['SIGUSR1', 'SIGUSR2', 'SIGTERM', 'SIGINT', 'SIGHUP'];
    signals.forEach((signal) => {
      // @ts-ignore
      process.on(signal, () => {
        if (proc.killed === false && proc.exitCode === null) {
          proc.kill(signal);
        }
      });
    });

    // By default terminate process when spawned process terminates.
    // Suppressing the exit if exitCallback defined is a bit messy and of limited use, but does allow process to stay running!
    const exitCallback = this._exitCallback;
    if (!exitCallback) {
      proc.on('close', process.exit.bind(process));
    } else {
      proc.on('close', () => {
        exitCallback(new CommanderError(process.exitCode || 0, 'commander.executeSubCommandAsync', '(close)'));
      });
    }
    proc.on('error', (err) => {
      // @ts-ignore
      if (err.code === 'ENOENT') {
        const executableMissing = `'${bin}' does not exist
 - if '${subcommand._name}' is not meant to be an executable command, remove description parameter from '.command()' and use '.description()' instead
 - if the default executable name is not suitable, use the executableFile option to supply a custom name`;
        throw new Error(executableMissing);
      // @ts-ignore
      } else if (err.code === 'EACCES') {
        throw new Error(`'${bin}' not executable`);
      }
      if (!exitCallback) {
        process.exit(1);
      } else {
        const wrappedError = new CommanderError(1, 'commander.executeSubCommandAsync', '(error)');
        wrappedError.nestedError = err;
        exitCallback(wrappedError);
      }
    });

    // Store the reference to the child process
    this.runningCommand = proc;
  };

  /**
   * @api private
   */

  _dispatchSubcommand(commandName, operands, unknown) {
    const subCommand = this._findCommand(commandName);
    if (!subCommand) this.help({ error: true });

    if (subCommand._executableHandler) {
      this._executeSubCommand(subCommand, operands.concat(unknown));
    } else {
      return subCommand._parseCommand(operands, unknown);
    }
  };

  /**
   * Check this.args against expected this._args.
   *
   * @api private
   */

  _checkNumberOfArguments() {
    // too few
    this._args.forEach((arg, i) => {
      if (arg.required && this.args[i] == null) {
        this.missingArgument(arg.name());
      }
    });
    // too many
    if (this._args.length > 0 && this._args[this._args.length - 1].variadic) {
      return;
    }
    if (this.args.length > this._args.length) {
      this._excessArguments(this.args);
    }
  };

  /**
   * Process this.args using this._args and save as this.processedArgs!
   *
   * @api private
   */

  _processArguments() {
    const myParseArg = (argument, value, previous) => {
      // Extra processing for nice error message on parsing failure.
      let parsedValue = value;
      if (value !== null && argument.parseArg) {
        try {
          parsedValue = argument.parseArg(value, previous);
        } catch (err) {
          if (err.code === 'commander.invalidArgument') {
            const message = `error: command-argument value '${value}' is invalid for argument '${argument.name()}'. ${err.message}`;
            this._displayError(err.exitCode, err.code, message);
          }
          throw err;
        }
      }
      return parsedValue;
    };

    this._checkNumberOfArguments();

    const processedArgs = [];
    this._args.forEach((declaredArg, index) => {
      let value = declaredArg.defaultValue;
      if (declaredArg.variadic) {
        // Collect together remaining arguments for passing together as an array.
        if (index < this.args.length) {
          value = this.args.slice(index);
          if (declaredArg.parseArg) {
            value = value.reduce((processed, v) => {
              return myParseArg(declaredArg, v, processed);
            }, declaredArg.defaultValue);
          }
        } else if (value === undefined) {
          value = [];
        }
      } else if (index < this.args.length) {
        value = this.args[index];
        if (declaredArg.parseArg) {
          value = myParseArg(declaredArg, value, declaredArg.defaultValue);
        }
      }
      processedArgs[index] = value;
    });
    this.processedArgs = processedArgs;
  }

  /**
   * Once we have a promise we chain, but call synchronously until then.
   *
   * @param {Promise|undefined} promise
   * @param {Function} fn
   * @return {Promise|undefined}
   */

  _chainOrCall(promise, fn) {
    // thenable
    if (promise && promise.then && typeof promise.then === 'function') {
      // already have a promise, chain callback
      return promise.then(() => fn());
    }
    // callback might return a promise
    return fn();
  }

  /**
   *
   * @param {Promise|undefined} promise
   * @param {string} event
   * @return {Promise|undefined}
   * @api private
   */

  _chainOrCallHooks(promise, event) {
    let result = promise;
    const hooks = [];
    getCommandAndParents(this)
      .reverse()
      .filter(cmd => cmd._lifeCycleHooks[event] !== undefined)
      .forEach(hookedCommand => {
        hookedCommand._lifeCycleHooks[event].forEach((callback) => {
          hooks.push({ hookedCommand, callback });
        });
      });
    if (event === 'postAction') {
      hooks.reverse();
    }

    hooks.forEach((hookDetail) => {
      result = this._chainOrCall(result, () => {
        return hookDetail.callback(hookDetail.hookedCommand, this);
      });
    });
    return result;
  }

  /**
   * Process arguments in context of this command.
   * Returns action result, in case it is a promise.
   *
   * @api private
   */

  _parseCommand(operands, unknown) {
    const parsed = this.parseOptions(unknown);
    operands = operands.concat(parsed.operands);
    unknown = parsed.unknown;
    this.args = operands.concat(unknown);

    if (operands && this._findCommand(operands[0])) {
      return this._dispatchSubcommand(operands[0], operands.slice(1), unknown);
    }
    if (this._hasImplicitHelpCommand() && operands[0] === this._helpCommandName) {
      if (operands.length === 1) {
        this.help();
      }
      return this._dispatchSubcommand(operands[1], [], [this._helpLongFlag]);
    }
    if (this._defaultCommandName) {
      outputHelpIfRequested(this, unknown); // Run the help for default command from parent rather than passing to default command
      return this._dispatchSubcommand(this._defaultCommandName, operands, unknown);
    }
    if (this.commands.length && this.args.length === 0 && !this._actionHandler && !this._defaultCommandName) {
      // probably missing subcommand and no handler, user needs help (and exit)
      this.help({ error: true });
    }

    outputHelpIfRequested(this, parsed.unknown);
    this._checkForMissingMandatoryOptions();

    // We do not always call this check to avoid masking a "better" error, like unknown command.
    const checkForUnknownOptions = () => {
      if (parsed.unknown.length > 0) {
        this.unknownOption(parsed.unknown[0]);
      }
    };

    const commandEvent = `command:${this.name()}`;
    if (this._actionHandler) {
      checkForUnknownOptions();
      this._processArguments();

      let actionResult;
      actionResult = this._chainOrCallHooks(actionResult, 'preAction');
      actionResult = this._chainOrCall(actionResult, () => this._actionHandler(this.processedArgs));
      if (this.parent) this.parent.emit(commandEvent, operands, unknown); // legacy
      actionResult = this._chainOrCallHooks(actionResult, 'postAction');
      return actionResult;
    }
    if (this.parent && this.parent.listenerCount(commandEvent)) {
      checkForUnknownOptions();
      this._processArguments();
      this.parent.emit(commandEvent, operands, unknown); // legacy
    } else if (operands.length) {
      if (this._findCommand('*')) { // legacy default command
        return this._dispatchSubcommand('*', operands, unknown);
      }
      if (this.listenerCount('command:*')) {
        // skip option check, emit event for possible misspelling suggestion
        this.emit('command:*', operands, unknown);
      } else if (this.commands.length) {
        this.unknownCommand();
      } else {
        checkForUnknownOptions();
        this._processArguments();
      }
    } else if (this.commands.length) {
      // This command has subcommands and nothing hooked up at this level, so display help (and exit).
      this.help({ error: true });
    } else {
      checkForUnknownOptions();
      this._processArguments();
      // fall through for caller to handle after calling .parse()
    }
  };

  /**
   * Find matching command.
   *
   * @api private
   */
  _findCommand(name) {
    if (!name) return undefined;
    return this.commands.find(cmd => cmd._name === name || cmd._aliases.includes(name));
  };

  /**
   * Return an option matching `arg` if any.
   *
   * @param {string} arg
   * @return {Option}
   * @api private
   */

  _findOption(arg) {
    return this.options.find(option => option.is(arg));
  };

  /**
   * Display an error message if a mandatory option does not have a value.
   * Lazy calling after checking for help flags from leaf subcommand.
   *
   * @api private
   */

  _checkForMissingMandatoryOptions() {
    // Walk up hierarchy so can call in subcommand after checking for displaying help.
    for (let cmd = this; cmd; cmd = cmd.parent) {
      cmd.options.forEach((anOption) => {
        if (anOption.mandatory && (cmd.getOptionValue(anOption.attributeName()) === undefined)) {
          cmd.missingMandatoryOptionValue(anOption);
        }
      });
    }
  };

  /**
   * Parse options from `argv` removing known options,
   * and return argv split into operands and unknown arguments.
   *
   * Examples:
   *
   *     argv => operands, unknown
   *     --known kkk op => [op], []
   *     op --known kkk => [op], []
   *     sub --unknown uuu op => [sub], [--unknown uuu op]
   *     sub -- --unknown uuu op => [sub --unknown uuu op], []
   *
   * @param {String[]} argv
   * @return {{operands: String[], unknown: String[]}}
   */

  parseOptions(argv) {
    const operands = []; // operands, not options or values
    const unknown = []; // first unknown option and remaining unknown args
    let dest = operands;
    const args = argv.slice();

    function maybeOption(arg) {
      return arg.length > 1 && arg[0] === '-';
    }

    // parse options
    let activeVariadicOption = null;
    while (args.length) {
      const arg = args.shift();

      // literal
      if (arg === '--') {
        if (dest === unknown) dest.push(arg);
        dest.push(...args);
        break;
      }

      if (activeVariadicOption && !maybeOption(arg)) {
        this.emit(`option:${activeVariadicOption.name()}`, arg);
        continue;
      }
      activeVariadicOption = null;

      if (maybeOption(arg)) {
        const option = this._findOption(arg);
        // recognised option, call listener to assign value with possible custom processing
        if (option) {
          if (option.required) {
            const value = args.shift();
            if (value === undefined) this.optionMissingArgument(option);
            this.emit(`option:${option.name()}`, value);
          } else if (option.optional) {
            let value = null;
            // historical behaviour is optional value is following arg unless an option
            if (args.length > 0 && !maybeOption(args[0])) {
              value = args.shift();
            }
            this.emit(`option:${option.name()}`, value);
          } else { // boolean flag
            this.emit(`option:${option.name()}`);
          }
          activeVariadicOption = option.variadic ? option : null;
          continue;
        }
      }

      // Look for combo options following single dash, eat first one if known.
      if (arg.length > 2 && arg[0] === '-' && arg[1] !== '-') {
        const option = this._findOption(`-${arg[1]}`);
        if (option) {
          if (option.required || (option.optional && this._combineFlagAndOptionalValue)) {
            // option with value following in same argument
            this.emit(`option:${option.name()}`, arg.slice(2));
          } else {
            // boolean option, emit and put back remainder of arg for further processing
            this.emit(`option:${option.name()}`);
            args.unshift(`-${arg.slice(2)}`);
          }
          continue;
        }
      }

      // Look for known long flag with value, like --foo=bar
      if (/^--[^=]+=/.test(arg)) {
        const index = arg.indexOf('=');
        const option = this._findOption(arg.slice(0, index));
        if (option && (option.required || option.optional)) {
          this.emit(`option:${option.name()}`, arg.slice(index + 1));
          continue;
        }
      }

      // Not a recognised option by this command.
      // Might be a command-argument, or subcommand option, or unknown option, or help command or option.

      // An unknown option means further arguments also classified as unknown so can be reprocessed by subcommands.
      if (maybeOption(arg)) {
        dest = unknown;
      }

      // If using positionalOptions, stop processing our options at subcommand.
      if ((this._enablePositionalOptions || this._passThroughOptions) && operands.length === 0 && unknown.length === 0) {
        if (this._findCommand(arg)) {
          operands.push(arg);
          if (args.length > 0) unknown.push(...args);
          break;
        } else if (arg === this._helpCommandName && this._hasImplicitHelpCommand()) {
          operands.push(arg);
          if (args.length > 0) operands.push(...args);
          break;
        } else if (this._defaultCommandName) {
          unknown.push(arg);
          if (args.length > 0) unknown.push(...args);
          break;
        }
      }

      // If using passThroughOptions, stop processing options at first command-argument.
      if (this._passThroughOptions) {
        dest.push(arg);
        if (args.length > 0) dest.push(...args);
        break;
      }

      // add arg
      dest.push(arg);
    }

    return { operands, unknown };
  };

  /**
   * Return an object containing options as key-value pairs
   *
   * @return {Object}
   */
  opts() {
    if (this._storeOptionsAsProperties) {
      // Preserve original behaviour so backwards compatible when still using properties
      const result = {};
      const len = this.options.length;

      for (let i = 0; i < len; i++) {
        const key = this.options[i].attributeName();
        result[key] = key === this._versionOptionName ? this._version : this[key];
      }
      return result;
    }

    return this._optionValues;
  };

  /**
   * Internal bottleneck for handling of parsing errors.
   *
   * @api private
   */
  _displayError(exitCode, code, message) {
    this._outputConfiguration.outputError(`${message}\n`, this._outputConfiguration.writeErr);
    if (typeof this._showHelpAfterError === 'string') {
      this._outputConfiguration.writeErr(`${this._showHelpAfterError}\n`);
    } else if (this._showHelpAfterError) {
      this._outputConfiguration.writeErr('\n');
      this.outputHelp({ error: true });
    }
    this._exit(exitCode, code, message);
  }

  /**
   * Argument `name` is missing.
   *
   * @param {string} name
   * @api private
   */

  missingArgument(name) {
    const message = `error: missing required argument '${name}'`;
    this._displayError(1, 'commander.missingArgument', message);
  };

  /**
   * `Option` is missing an argument.
   *
   * @param {Option} option
   * @api private
   */

  optionMissingArgument(option) {
    const message = `error: option '${option.flags}' argument missing`;
    this._displayError(1, 'commander.optionMissingArgument', message);
  };

  /**
   * `Option` does not have a value, and is a mandatory option.
   *
   * @param {Option} option
   * @api private
   */

  missingMandatoryOptionValue(option) {
    const message = `error: required option '${option.flags}' not specified`;
    this._displayError(1, 'commander.missingMandatoryOptionValue', message);
  };

  /**
   * Unknown option `flag`.
   *
   * @param {string} flag
   * @api private
   */

  unknownOption(flag) {
    if (this._allowUnknownOption) return;
    const message = `error: unknown option '${flag}'`;
    this._displayError(1, 'commander.unknownOption', message);
  };

  /**
   * Excess arguments, more than expected.
   *
   * @param {string[]} receivedArgs
   * @api private
   */

  _excessArguments(receivedArgs) {
    if (this._allowExcessArguments) return;

    const expected = this._args.length;
    const s = (expected === 1) ? '' : 's';
    const forSubcommand = this.parent ? ` for '${this.name()}'` : '';
    const message = `error: too many arguments${forSubcommand}. Expected ${expected} argument${s} but got ${receivedArgs.length}.`;
    this._displayError(1, 'commander.excessArguments', message);
  };

  /**
   * Unknown command.
   *
   * @api private
   */

  unknownCommand() {
    const message = `error: unknown command '${this.args[0]}'`;
    this._displayError(1, 'commander.unknownCommand', message);
  };

  /**
   * Set the program version to `str`.
   *
   * This method auto-registers the "-V, --version" flag
   * which will print the version number when passed.
   *
   * You can optionally supply the  flags and description to override the defaults.
   *
   * @param {string} str
   * @param {string} [flags]
   * @param {string} [description]
   * @return {this | string} `this` command for chaining, or version string if no arguments
   */

  version(str, flags, description) {
    if (str === undefined) return this._version;
    this._version = str;
    flags = flags || '-V, --version';
    description = description || 'output the version number';
    const versionOption = this.createOption(flags, description);
    this._versionOptionName = versionOption.attributeName();
    this.options.push(versionOption);
    this.on('option:' + versionOption.name(), () => {
      this._outputConfiguration.writeOut(`${str}\n`);
      this._exit(0, 'commander.version', str);
    });
    return this;
  };

  /**
   * Set the description to `str`.
   *
   * @param {string} [str]
   * @param {Object} [argsDescription]
   * @return {string|Command}
   */
  description(str, argsDescription) {
    if (str === undefined && argsDescription === undefined) return this._description;
    this._description = str;
    if (argsDescription) {
      this._argsDescription = argsDescription;
    }
    return this;
  };

  /**
   * Set an alias for the command.
   *
   * You may call more than once to add multiple aliases. Only the first alias is shown in the auto-generated help.
   *
   * @param {string} [alias]
   * @return {string|Command}
   */

  alias(alias) {
    if (alias === undefined) return this._aliases[0]; // just return first, for backwards compatibility

    /** @type {Command} */
    let command = this;
    if (this.commands.length !== 0 && this.commands[this.commands.length - 1]._executableHandler) {
      // assume adding alias for last added executable subcommand, rather than this
      command = this.commands[this.commands.length - 1];
    }

    if (alias === command._name) throw new Error('Command alias can\'t be the same as its name');

    command._aliases.push(alias);
    return this;
  };

  /**
   * Set aliases for the command.
   *
   * Only the first alias is shown in the auto-generated help.
   *
   * @param {string[]} [aliases]
   * @return {string[]|Command}
   */

  aliases(aliases) {
    // Getter for the array of aliases is the main reason for having aliases() in addition to alias().
    if (aliases === undefined) return this._aliases;

    aliases.forEach((alias) => this.alias(alias));
    return this;
  };

  /**
   * Set / get the command usage `str`.
   *
   * @param {string} [str]
   * @return {String|Command}
   */

  usage(str) {
    if (str === undefined) {
      if (this._usage) return this._usage;

      const args = this._args.map((arg) => {
        return humanReadableArgName(arg);
      });
      return [].concat(
        (this.options.length || this._hasHelpOption ? '[options]' : []),
        (this.commands.length ? '[command]' : []),
        (this._args.length ? args : [])
      ).join(' ');
    }

    this._usage = str;
    return this;
  };

  /**
   * Get or set the name of the command
   *
   * @param {string} [str]
   * @return {string|Command}
   */

  name(str) {
    if (str === undefined) return this._name;
    this._name = str;
    return this;
  };

  /**
   * Return program help documentation.
   *
   * @param {{ error: boolean }} [contextOptions] - pass {error:true} to wrap for stderr instead of stdout
   * @return {string}
   */

  helpInformation(contextOptions) {
    const helper = this.createHelp();
    if (helper.helpWidth === undefined) {
      helper.helpWidth = (contextOptions && contextOptions.error) ? this._outputConfiguration.getErrHelpWidth() : this._outputConfiguration.getOutHelpWidth();
    }
    return helper.formatHelp(this, helper);
  };

  /**
   * @api private
   */

  _getHelpContext(contextOptions) {
    contextOptions = contextOptions || {};
    const context = { error: !!contextOptions.error };
    let write;
    if (context.error) {
      write = (arg) => this._outputConfiguration.writeErr(arg);
    } else {
      write = (arg) => this._outputConfiguration.writeOut(arg);
    }
    context.write = contextOptions.write || write;
    context.command = this;
    return context;
  }

  /**
   * Output help information for this command.
   *
   * Outputs built-in help, and custom text added using `.addHelpText()`.
   *
   * @param {{ error: boolean } | Function} [contextOptions] - pass {error:true} to write to stderr instead of stdout
   */

  outputHelp(contextOptions) {
    let deprecatedCallback;
    if (typeof contextOptions === 'function') {
      deprecatedCallback = contextOptions;
      contextOptions = undefined;
    }
    const context = this._getHelpContext(contextOptions);

    getCommandAndParents(this).reverse().forEach(command => command.emit('beforeAllHelp', context));
    this.emit('beforeHelp', context);

    let helpInformation = this.helpInformation(context);
    if (deprecatedCallback) {
      helpInformation = deprecatedCallback(helpInformation);
      if (typeof helpInformation !== 'string' && !Buffer.isBuffer(helpInformation)) {
        throw new Error('outputHelp callback must return a string or a Buffer');
      }
    }
    context.write(helpInformation);

    this.emit(this._helpLongFlag); // deprecated
    this.emit('afterHelp', context);
    getCommandAndParents(this).forEach(command => command.emit('afterAllHelp', context));
  };

  /**
   * You can pass in flags and a description to override the help
   * flags and help description for your command. Pass in false to
   * disable the built-in help option.
   *
   * @param {string | boolean} [flags]
   * @param {string} [description]
   * @return {Command} `this` command for chaining
   */

  helpOption(flags, description) {
    if (typeof flags === 'boolean') {
      this._hasHelpOption = flags;
      return this;
    }
    this._helpFlags = flags || this._helpFlags;
    this._helpDescription = description || this._helpDescription;

    const helpFlags = splitOptionFlags(this._helpFlags);
    this._helpShortFlag = helpFlags.shortFlag;
    this._helpLongFlag = helpFlags.longFlag;

    return this;
  };

  /**
   * Output help information and exit.
   *
   * Outputs built-in help, and custom text added using `.addHelpText()`.
   *
   * @param {{ error: boolean }} [contextOptions] - pass {error:true} to write to stderr instead of stdout
   */

  help(contextOptions) {
    this.outputHelp(contextOptions);
    let exitCode = process.exitCode || 0;
    if (exitCode === 0 && contextOptions && typeof contextOptions !== 'function' && contextOptions.error) {
      exitCode = 1;
    }
    // message: do not have all displayed text available so only passing placeholder.
    this._exit(exitCode, 'commander.help', '(outputHelp)');
  };

  /**
   * Add additional text to be displayed with the built-in help.
   *
   * Position is 'before' or 'after' to affect just this command,
   * and 'beforeAll' or 'afterAll' to affect this command and all its subcommands.
   *
   * @param {string} position - before or after built-in help
   * @param {string | Function} text - string to add, or a function returning a string
   * @return {Command} `this` command for chaining
   */
  addHelpText(position, text) {
    const allowedValues = ['beforeAll', 'before', 'after', 'afterAll'];
    if (!allowedValues.includes(position)) {
      throw new Error(`Unexpected value for position to addHelpText.
Expecting one of '${allowedValues.join("', '")}'`);
    }
    const helpEvent = `${position}Help`;
    this.on(helpEvent, (context) => {
      let helpStr;
      if (typeof text === 'function') {
        helpStr = text({ error: context.error, command: context.command });
      } else {
        helpStr = text;
      }
      // Ignore falsy value when nothing to output.
      if (helpStr) {
        context.write(`${helpStr}\n`);
      }
    });
    return this;
  }
}
/**
 * Output help information if help flags specified
 *
 * @param {Command} cmd - command to output help for
 * @param {Array} args - array of options to search for help flags
 * @api private
 */

function outputHelpIfRequested(cmd, args) {
  const helpOption = cmd._hasHelpOption && args.find(arg => arg === cmd._helpLongFlag || arg === cmd._helpShortFlag);
  if (helpOption) {
    cmd.outputHelp();
    // (Do not have all displayed text available so only passing placeholder.)
    cmd._exit(0, 'commander.helpDisplayed', '(outputHelp)');
  }
}

/**
 * Scan arguments and increment port number for inspect calls (to avoid conflicts when spawning new command).
 *
 * @param {string[]} args - array of arguments from node.execArgv
 * @returns {string[]}
 * @api private
 */

function incrementNodeInspectorPort(args) {
  // Testing for these options:
  //  --inspect[=[host:]port]
  //  --inspect-brk[=[host:]port]
  //  --inspect-port=[host:]port
  return args.map((arg) => {
    if (!arg.startsWith('--inspect')) {
      return arg;
    }
    let debugOption;
    let debugHost = '127.0.0.1';
    let debugPort = '9229';
    let match;
    if ((match = arg.match(/^(--inspect(-brk)?)$/)) !== null) {
      // e.g. --inspect
      debugOption = match[1];
    } else if ((match = arg.match(/^(--inspect(-brk|-port)?)=([^:]+)$/)) !== null) {
      debugOption = match[1];
      if (/^\d+$/.test(match[3])) {
        // e.g. --inspect=1234
        debugPort = match[3];
      } else {
        // e.g. --inspect=localhost
        debugHost = match[3];
      }
    } else if ((match = arg.match(/^(--inspect(-brk|-port)?)=([^:]+):(\d+)$/)) !== null) {
      // e.g. --inspect=localhost:1234
      debugOption = match[1];
      debugHost = match[3];
      debugPort = match[4];
    }

    if (debugOption && debugPort !== '0') {
      return `${debugOption}=${debugHost}:${parseInt(debugPort) + 1}`;
    }
    return arg;
  });
}

/**
 * @param {Command} startCommand
 * @returns {Command[]}
 * @api private
 */

function getCommandAndParents(startCommand) {
  const result = [];
  for (let command = startCommand; command; command = command.parent) {
    result.push(command);
  }
  return result;
}

var Command_1 = Command;

var command$3 = {
	Command: Command_1
};

var commander = createCommonjsModule(function (module, exports) {
const { Argument } = argument$1;
const { Command } = command$3;
const { CommanderError, InvalidArgumentError } = error$1;
const { Help } = help;
const { Option } = option;

// @ts-check

/**
 * Expose the root command.
 */

exports = module.exports = new Command();
exports.program = exports; // More explicit access to global command.
// Implicit export of createArgument, createCommand, and createOption.

/**
 * Expose classes
 */

exports.Argument = Argument;
exports.Command = Command;
exports.CommanderError = CommanderError;
exports.Help = Help;
exports.InvalidArgumentError = InvalidArgumentError;
exports.InvalidOptionArgumentError = InvalidArgumentError; // Deprecated
exports.Option = Option;
});

var colorName = {
	"aliceblue": [240, 248, 255],
	"antiquewhite": [250, 235, 215],
	"aqua": [0, 255, 255],
	"aquamarine": [127, 255, 212],
	"azure": [240, 255, 255],
	"beige": [245, 245, 220],
	"bisque": [255, 228, 196],
	"black": [0, 0, 0],
	"blanchedalmond": [255, 235, 205],
	"blue": [0, 0, 255],
	"blueviolet": [138, 43, 226],
	"brown": [165, 42, 42],
	"burlywood": [222, 184, 135],
	"cadetblue": [95, 158, 160],
	"chartreuse": [127, 255, 0],
	"chocolate": [210, 105, 30],
	"coral": [255, 127, 80],
	"cornflowerblue": [100, 149, 237],
	"cornsilk": [255, 248, 220],
	"crimson": [220, 20, 60],
	"cyan": [0, 255, 255],
	"darkblue": [0, 0, 139],
	"darkcyan": [0, 139, 139],
	"darkgoldenrod": [184, 134, 11],
	"darkgray": [169, 169, 169],
	"darkgreen": [0, 100, 0],
	"darkgrey": [169, 169, 169],
	"darkkhaki": [189, 183, 107],
	"darkmagenta": [139, 0, 139],
	"darkolivegreen": [85, 107, 47],
	"darkorange": [255, 140, 0],
	"darkorchid": [153, 50, 204],
	"darkred": [139, 0, 0],
	"darksalmon": [233, 150, 122],
	"darkseagreen": [143, 188, 143],
	"darkslateblue": [72, 61, 139],
	"darkslategray": [47, 79, 79],
	"darkslategrey": [47, 79, 79],
	"darkturquoise": [0, 206, 209],
	"darkviolet": [148, 0, 211],
	"deeppink": [255, 20, 147],
	"deepskyblue": [0, 191, 255],
	"dimgray": [105, 105, 105],
	"dimgrey": [105, 105, 105],
	"dodgerblue": [30, 144, 255],
	"firebrick": [178, 34, 34],
	"floralwhite": [255, 250, 240],
	"forestgreen": [34, 139, 34],
	"fuchsia": [255, 0, 255],
	"gainsboro": [220, 220, 220],
	"ghostwhite": [248, 248, 255],
	"gold": [255, 215, 0],
	"goldenrod": [218, 165, 32],
	"gray": [128, 128, 128],
	"green": [0, 128, 0],
	"greenyellow": [173, 255, 47],
	"grey": [128, 128, 128],
	"honeydew": [240, 255, 240],
	"hotpink": [255, 105, 180],
	"indianred": [205, 92, 92],
	"indigo": [75, 0, 130],
	"ivory": [255, 255, 240],
	"khaki": [240, 230, 140],
	"lavender": [230, 230, 250],
	"lavenderblush": [255, 240, 245],
	"lawngreen": [124, 252, 0],
	"lemonchiffon": [255, 250, 205],
	"lightblue": [173, 216, 230],
	"lightcoral": [240, 128, 128],
	"lightcyan": [224, 255, 255],
	"lightgoldenrodyellow": [250, 250, 210],
	"lightgray": [211, 211, 211],
	"lightgreen": [144, 238, 144],
	"lightgrey": [211, 211, 211],
	"lightpink": [255, 182, 193],
	"lightsalmon": [255, 160, 122],
	"lightseagreen": [32, 178, 170],
	"lightskyblue": [135, 206, 250],
	"lightslategray": [119, 136, 153],
	"lightslategrey": [119, 136, 153],
	"lightsteelblue": [176, 196, 222],
	"lightyellow": [255, 255, 224],
	"lime": [0, 255, 0],
	"limegreen": [50, 205, 50],
	"linen": [250, 240, 230],
	"magenta": [255, 0, 255],
	"maroon": [128, 0, 0],
	"mediumaquamarine": [102, 205, 170],
	"mediumblue": [0, 0, 205],
	"mediumorchid": [186, 85, 211],
	"mediumpurple": [147, 112, 219],
	"mediumseagreen": [60, 179, 113],
	"mediumslateblue": [123, 104, 238],
	"mediumspringgreen": [0, 250, 154],
	"mediumturquoise": [72, 209, 204],
	"mediumvioletred": [199, 21, 133],
	"midnightblue": [25, 25, 112],
	"mintcream": [245, 255, 250],
	"mistyrose": [255, 228, 225],
	"moccasin": [255, 228, 181],
	"navajowhite": [255, 222, 173],
	"navy": [0, 0, 128],
	"oldlace": [253, 245, 230],
	"olive": [128, 128, 0],
	"olivedrab": [107, 142, 35],
	"orange": [255, 165, 0],
	"orangered": [255, 69, 0],
	"orchid": [218, 112, 214],
	"palegoldenrod": [238, 232, 170],
	"palegreen": [152, 251, 152],
	"paleturquoise": [175, 238, 238],
	"palevioletred": [219, 112, 147],
	"papayawhip": [255, 239, 213],
	"peachpuff": [255, 218, 185],
	"peru": [205, 133, 63],
	"pink": [255, 192, 203],
	"plum": [221, 160, 221],
	"powderblue": [176, 224, 230],
	"purple": [128, 0, 128],
	"rebeccapurple": [102, 51, 153],
	"red": [255, 0, 0],
	"rosybrown": [188, 143, 143],
	"royalblue": [65, 105, 225],
	"saddlebrown": [139, 69, 19],
	"salmon": [250, 128, 114],
	"sandybrown": [244, 164, 96],
	"seagreen": [46, 139, 87],
	"seashell": [255, 245, 238],
	"sienna": [160, 82, 45],
	"silver": [192, 192, 192],
	"skyblue": [135, 206, 235],
	"slateblue": [106, 90, 205],
	"slategray": [112, 128, 144],
	"slategrey": [112, 128, 144],
	"snow": [255, 250, 250],
	"springgreen": [0, 255, 127],
	"steelblue": [70, 130, 180],
	"tan": [210, 180, 140],
	"teal": [0, 128, 128],
	"thistle": [216, 191, 216],
	"tomato": [255, 99, 71],
	"turquoise": [64, 224, 208],
	"violet": [238, 130, 238],
	"wheat": [245, 222, 179],
	"white": [255, 255, 255],
	"whitesmoke": [245, 245, 245],
	"yellow": [255, 255, 0],
	"yellowgreen": [154, 205, 50]
};

/* MIT license */

/* eslint-disable no-mixed-operators */


// NOTE: conversions should only return primitive values (i.e. arrays, or
//       values that give correct `typeof` results).
//       do not use box values types (i.e. Number(), String(), etc.)

const reverseKeywords = {};
for (const key of Object.keys(colorName)) {
	reverseKeywords[colorName[key]] = key;
}

const convert$2 = {
	rgb: {channels: 3, labels: 'rgb'},
	hsl: {channels: 3, labels: 'hsl'},
	hsv: {channels: 3, labels: 'hsv'},
	hwb: {channels: 3, labels: 'hwb'},
	cmyk: {channels: 4, labels: 'cmyk'},
	xyz: {channels: 3, labels: 'xyz'},
	lab: {channels: 3, labels: 'lab'},
	lch: {channels: 3, labels: 'lch'},
	hex: {channels: 1, labels: ['hex']},
	keyword: {channels: 1, labels: ['keyword']},
	ansi16: {channels: 1, labels: ['ansi16']},
	ansi256: {channels: 1, labels: ['ansi256']},
	hcg: {channels: 3, labels: ['h', 'c', 'g']},
	apple: {channels: 3, labels: ['r16', 'g16', 'b16']},
	gray: {channels: 1, labels: ['gray']}
};

var conversions = convert$2;

// Hide .channels and .labels properties
for (const model of Object.keys(convert$2)) {
	if (!('channels' in convert$2[model])) {
		throw new Error('missing channels property: ' + model);
	}

	if (!('labels' in convert$2[model])) {
		throw new Error('missing channel labels property: ' + model);
	}

	if (convert$2[model].labels.length !== convert$2[model].channels) {
		throw new Error('channel and label counts mismatch: ' + model);
	}

	const {channels, labels} = convert$2[model];
	delete convert$2[model].channels;
	delete convert$2[model].labels;
	Object.defineProperty(convert$2[model], 'channels', {value: channels});
	Object.defineProperty(convert$2[model], 'labels', {value: labels});
}

convert$2.rgb.hsl = function (rgb) {
	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;
	const min = Math.min(r, g, b);
	const max = Math.max(r, g, b);
	const delta = max - min;
	let h;
	let s;

	if (max === min) {
		h = 0;
	} else if (r === max) {
		h = (g - b) / delta;
	} else if (g === max) {
		h = 2 + (b - r) / delta;
	} else if (b === max) {
		h = 4 + (r - g) / delta;
	}

	h = Math.min(h * 60, 360);

	if (h < 0) {
		h += 360;
	}

	const l = (min + max) / 2;

	if (max === min) {
		s = 0;
	} else if (l <= 0.5) {
		s = delta / (max + min);
	} else {
		s = delta / (2 - max - min);
	}

	return [h, s * 100, l * 100];
};

convert$2.rgb.hsv = function (rgb) {
	let rdif;
	let gdif;
	let bdif;
	let h;
	let s;

	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;
	const v = Math.max(r, g, b);
	const diff = v - Math.min(r, g, b);
	const diffc = function (c) {
		return (v - c) / 6 / diff + 1 / 2;
	};

	if (diff === 0) {
		h = 0;
		s = 0;
	} else {
		s = diff / v;
		rdif = diffc(r);
		gdif = diffc(g);
		bdif = diffc(b);

		if (r === v) {
			h = bdif - gdif;
		} else if (g === v) {
			h = (1 / 3) + rdif - bdif;
		} else if (b === v) {
			h = (2 / 3) + gdif - rdif;
		}

		if (h < 0) {
			h += 1;
		} else if (h > 1) {
			h -= 1;
		}
	}

	return [
		h * 360,
		s * 100,
		v * 100
	];
};

convert$2.rgb.hwb = function (rgb) {
	const r = rgb[0];
	const g = rgb[1];
	let b = rgb[2];
	const h = convert$2.rgb.hsl(rgb)[0];
	const w = 1 / 255 * Math.min(r, Math.min(g, b));

	b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));

	return [h, w * 100, b * 100];
};

convert$2.rgb.cmyk = function (rgb) {
	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;

	const k = Math.min(1 - r, 1 - g, 1 - b);
	const c = (1 - r - k) / (1 - k) || 0;
	const m = (1 - g - k) / (1 - k) || 0;
	const y = (1 - b - k) / (1 - k) || 0;

	return [c * 100, m * 100, y * 100, k * 100];
};

function comparativeDistance(x, y) {
	/*
		See https://en.m.wikipedia.org/wiki/Euclidean_distance#Squared_Euclidean_distance
	*/
	return (
		((x[0] - y[0]) ** 2) +
		((x[1] - y[1]) ** 2) +
		((x[2] - y[2]) ** 2)
	);
}

convert$2.rgb.keyword = function (rgb) {
	const reversed = reverseKeywords[rgb];
	if (reversed) {
		return reversed;
	}

	let currentClosestDistance = Infinity;
	let currentClosestKeyword;

	for (const keyword of Object.keys(colorName)) {
		const value = colorName[keyword];

		// Compute comparative distance
		const distance = comparativeDistance(rgb, value);

		// Check if its less, if so set as closest
		if (distance < currentClosestDistance) {
			currentClosestDistance = distance;
			currentClosestKeyword = keyword;
		}
	}

	return currentClosestKeyword;
};

convert$2.keyword.rgb = function (keyword) {
	return colorName[keyword];
};

convert$2.rgb.xyz = function (rgb) {
	let r = rgb[0] / 255;
	let g = rgb[1] / 255;
	let b = rgb[2] / 255;

	// Assume sRGB
	r = r > 0.04045 ? (((r + 0.055) / 1.055) ** 2.4) : (r / 12.92);
	g = g > 0.04045 ? (((g + 0.055) / 1.055) ** 2.4) : (g / 12.92);
	b = b > 0.04045 ? (((b + 0.055) / 1.055) ** 2.4) : (b / 12.92);

	const x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
	const y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
	const z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);

	return [x * 100, y * 100, z * 100];
};

convert$2.rgb.lab = function (rgb) {
	const xyz = convert$2.rgb.xyz(rgb);
	let x = xyz[0];
	let y = xyz[1];
	let z = xyz[2];

	x /= 95.047;
	y /= 100;
	z /= 108.883;

	x = x > 0.008856 ? (x ** (1 / 3)) : (7.787 * x) + (16 / 116);
	y = y > 0.008856 ? (y ** (1 / 3)) : (7.787 * y) + (16 / 116);
	z = z > 0.008856 ? (z ** (1 / 3)) : (7.787 * z) + (16 / 116);

	const l = (116 * y) - 16;
	const a = 500 * (x - y);
	const b = 200 * (y - z);

	return [l, a, b];
};

convert$2.hsl.rgb = function (hsl) {
	const h = hsl[0] / 360;
	const s = hsl[1] / 100;
	const l = hsl[2] / 100;
	let t2;
	let t3;
	let val;

	if (s === 0) {
		val = l * 255;
		return [val, val, val];
	}

	if (l < 0.5) {
		t2 = l * (1 + s);
	} else {
		t2 = l + s - l * s;
	}

	const t1 = 2 * l - t2;

	const rgb = [0, 0, 0];
	for (let i = 0; i < 3; i++) {
		t3 = h + 1 / 3 * -(i - 1);
		if (t3 < 0) {
			t3++;
		}

		if (t3 > 1) {
			t3--;
		}

		if (6 * t3 < 1) {
			val = t1 + (t2 - t1) * 6 * t3;
		} else if (2 * t3 < 1) {
			val = t2;
		} else if (3 * t3 < 2) {
			val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
		} else {
			val = t1;
		}

		rgb[i] = val * 255;
	}

	return rgb;
};

convert$2.hsl.hsv = function (hsl) {
	const h = hsl[0];
	let s = hsl[1] / 100;
	let l = hsl[2] / 100;
	let smin = s;
	const lmin = Math.max(l, 0.01);

	l *= 2;
	s *= (l <= 1) ? l : 2 - l;
	smin *= lmin <= 1 ? lmin : 2 - lmin;
	const v = (l + s) / 2;
	const sv = l === 0 ? (2 * smin) / (lmin + smin) : (2 * s) / (l + s);

	return [h, sv * 100, v * 100];
};

convert$2.hsv.rgb = function (hsv) {
	const h = hsv[0] / 60;
	const s = hsv[1] / 100;
	let v = hsv[2] / 100;
	const hi = Math.floor(h) % 6;

	const f = h - Math.floor(h);
	const p = 255 * v * (1 - s);
	const q = 255 * v * (1 - (s * f));
	const t = 255 * v * (1 - (s * (1 - f)));
	v *= 255;

	switch (hi) {
		case 0:
			return [v, t, p];
		case 1:
			return [q, v, p];
		case 2:
			return [p, v, t];
		case 3:
			return [p, q, v];
		case 4:
			return [t, p, v];
		case 5:
			return [v, p, q];
	}
};

convert$2.hsv.hsl = function (hsv) {
	const h = hsv[0];
	const s = hsv[1] / 100;
	const v = hsv[2] / 100;
	const vmin = Math.max(v, 0.01);
	let sl;
	let l;

	l = (2 - s) * v;
	const lmin = (2 - s) * vmin;
	sl = s * vmin;
	sl /= (lmin <= 1) ? lmin : 2 - lmin;
	sl = sl || 0;
	l /= 2;

	return [h, sl * 100, l * 100];
};

// http://dev.w3.org/csswg/css-color/#hwb-to-rgb
convert$2.hwb.rgb = function (hwb) {
	const h = hwb[0] / 360;
	let wh = hwb[1] / 100;
	let bl = hwb[2] / 100;
	const ratio = wh + bl;
	let f;

	// Wh + bl cant be > 1
	if (ratio > 1) {
		wh /= ratio;
		bl /= ratio;
	}

	const i = Math.floor(6 * h);
	const v = 1 - bl;
	f = 6 * h - i;

	if ((i & 0x01) !== 0) {
		f = 1 - f;
	}

	const n = wh + f * (v - wh); // Linear interpolation

	let r;
	let g;
	let b;
	/* eslint-disable max-statements-per-line,no-multi-spaces */
	switch (i) {
		default:
		case 6:
		case 0: r = v;  g = n;  b = wh; break;
		case 1: r = n;  g = v;  b = wh; break;
		case 2: r = wh; g = v;  b = n; break;
		case 3: r = wh; g = n;  b = v; break;
		case 4: r = n;  g = wh; b = v; break;
		case 5: r = v;  g = wh; b = n; break;
	}
	/* eslint-enable max-statements-per-line,no-multi-spaces */

	return [r * 255, g * 255, b * 255];
};

convert$2.cmyk.rgb = function (cmyk) {
	const c = cmyk[0] / 100;
	const m = cmyk[1] / 100;
	const y = cmyk[2] / 100;
	const k = cmyk[3] / 100;

	const r = 1 - Math.min(1, c * (1 - k) + k);
	const g = 1 - Math.min(1, m * (1 - k) + k);
	const b = 1 - Math.min(1, y * (1 - k) + k);

	return [r * 255, g * 255, b * 255];
};

convert$2.xyz.rgb = function (xyz) {
	const x = xyz[0] / 100;
	const y = xyz[1] / 100;
	const z = xyz[2] / 100;
	let r;
	let g;
	let b;

	r = (x * 3.2406) + (y * -1.5372) + (z * -0.4986);
	g = (x * -0.9689) + (y * 1.8758) + (z * 0.0415);
	b = (x * 0.0557) + (y * -0.2040) + (z * 1.0570);

	// Assume sRGB
	r = r > 0.0031308
		? ((1.055 * (r ** (1.0 / 2.4))) - 0.055)
		: r * 12.92;

	g = g > 0.0031308
		? ((1.055 * (g ** (1.0 / 2.4))) - 0.055)
		: g * 12.92;

	b = b > 0.0031308
		? ((1.055 * (b ** (1.0 / 2.4))) - 0.055)
		: b * 12.92;

	r = Math.min(Math.max(0, r), 1);
	g = Math.min(Math.max(0, g), 1);
	b = Math.min(Math.max(0, b), 1);

	return [r * 255, g * 255, b * 255];
};

convert$2.xyz.lab = function (xyz) {
	let x = xyz[0];
	let y = xyz[1];
	let z = xyz[2];

	x /= 95.047;
	y /= 100;
	z /= 108.883;

	x = x > 0.008856 ? (x ** (1 / 3)) : (7.787 * x) + (16 / 116);
	y = y > 0.008856 ? (y ** (1 / 3)) : (7.787 * y) + (16 / 116);
	z = z > 0.008856 ? (z ** (1 / 3)) : (7.787 * z) + (16 / 116);

	const l = (116 * y) - 16;
	const a = 500 * (x - y);
	const b = 200 * (y - z);

	return [l, a, b];
};

convert$2.lab.xyz = function (lab) {
	const l = lab[0];
	const a = lab[1];
	const b = lab[2];
	let x;
	let y;
	let z;

	y = (l + 16) / 116;
	x = a / 500 + y;
	z = y - b / 200;

	const y2 = y ** 3;
	const x2 = x ** 3;
	const z2 = z ** 3;
	y = y2 > 0.008856 ? y2 : (y - 16 / 116) / 7.787;
	x = x2 > 0.008856 ? x2 : (x - 16 / 116) / 7.787;
	z = z2 > 0.008856 ? z2 : (z - 16 / 116) / 7.787;

	x *= 95.047;
	y *= 100;
	z *= 108.883;

	return [x, y, z];
};

convert$2.lab.lch = function (lab) {
	const l = lab[0];
	const a = lab[1];
	const b = lab[2];
	let h;

	const hr = Math.atan2(b, a);
	h = hr * 360 / 2 / Math.PI;

	if (h < 0) {
		h += 360;
	}

	const c = Math.sqrt(a * a + b * b);

	return [l, c, h];
};

convert$2.lch.lab = function (lch) {
	const l = lch[0];
	const c = lch[1];
	const h = lch[2];

	const hr = h / 360 * 2 * Math.PI;
	const a = c * Math.cos(hr);
	const b = c * Math.sin(hr);

	return [l, a, b];
};

convert$2.rgb.ansi16 = function (args, saturation = null) {
	const [r, g, b] = args;
	let value = saturation === null ? convert$2.rgb.hsv(args)[2] : saturation; // Hsv -> ansi16 optimization

	value = Math.round(value / 50);

	if (value === 0) {
		return 30;
	}

	let ansi = 30
		+ ((Math.round(b / 255) << 2)
		| (Math.round(g / 255) << 1)
		| Math.round(r / 255));

	if (value === 2) {
		ansi += 60;
	}

	return ansi;
};

convert$2.hsv.ansi16 = function (args) {
	// Optimization here; we already know the value and don't need to get
	// it converted for us.
	return convert$2.rgb.ansi16(convert$2.hsv.rgb(args), args[2]);
};

convert$2.rgb.ansi256 = function (args) {
	const r = args[0];
	const g = args[1];
	const b = args[2];

	// We use the extended greyscale palette here, with the exception of
	// black and white. normal palette only has 4 greyscale shades.
	if (r === g && g === b) {
		if (r < 8) {
			return 16;
		}

		if (r > 248) {
			return 231;
		}

		return Math.round(((r - 8) / 247) * 24) + 232;
	}

	const ansi = 16
		+ (36 * Math.round(r / 255 * 5))
		+ (6 * Math.round(g / 255 * 5))
		+ Math.round(b / 255 * 5);

	return ansi;
};

convert$2.ansi16.rgb = function (args) {
	let color = args % 10;

	// Handle greyscale
	if (color === 0 || color === 7) {
		if (args > 50) {
			color += 3.5;
		}

		color = color / 10.5 * 255;

		return [color, color, color];
	}

	const mult = (~~(args > 50) + 1) * 0.5;
	const r = ((color & 1) * mult) * 255;
	const g = (((color >> 1) & 1) * mult) * 255;
	const b = (((color >> 2) & 1) * mult) * 255;

	return [r, g, b];
};

convert$2.ansi256.rgb = function (args) {
	// Handle greyscale
	if (args >= 232) {
		const c = (args - 232) * 10 + 8;
		return [c, c, c];
	}

	args -= 16;

	let rem;
	const r = Math.floor(args / 36) / 5 * 255;
	const g = Math.floor((rem = args % 36) / 6) / 5 * 255;
	const b = (rem % 6) / 5 * 255;

	return [r, g, b];
};

convert$2.rgb.hex = function (args) {
	const integer = ((Math.round(args[0]) & 0xFF) << 16)
		+ ((Math.round(args[1]) & 0xFF) << 8)
		+ (Math.round(args[2]) & 0xFF);

	const string = integer.toString(16).toUpperCase();
	return '000000'.substring(string.length) + string;
};

convert$2.hex.rgb = function (args) {
	const match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
	if (!match) {
		return [0, 0, 0];
	}

	let colorString = match[0];

	if (match[0].length === 3) {
		colorString = colorString.split('').map(char => {
			return char + char;
		}).join('');
	}

	const integer = parseInt(colorString, 16);
	const r = (integer >> 16) & 0xFF;
	const g = (integer >> 8) & 0xFF;
	const b = integer & 0xFF;

	return [r, g, b];
};

convert$2.rgb.hcg = function (rgb) {
	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;
	const max = Math.max(Math.max(r, g), b);
	const min = Math.min(Math.min(r, g), b);
	const chroma = (max - min);
	let grayscale;
	let hue;

	if (chroma < 1) {
		grayscale = min / (1 - chroma);
	} else {
		grayscale = 0;
	}

	if (chroma <= 0) {
		hue = 0;
	} else
	if (max === r) {
		hue = ((g - b) / chroma) % 6;
	} else
	if (max === g) {
		hue = 2 + (b - r) / chroma;
	} else {
		hue = 4 + (r - g) / chroma;
	}

	hue /= 6;
	hue %= 1;

	return [hue * 360, chroma * 100, grayscale * 100];
};

convert$2.hsl.hcg = function (hsl) {
	const s = hsl[1] / 100;
	const l = hsl[2] / 100;

	const c = l < 0.5 ? (2.0 * s * l) : (2.0 * s * (1.0 - l));

	let f = 0;
	if (c < 1.0) {
		f = (l - 0.5 * c) / (1.0 - c);
	}

	return [hsl[0], c * 100, f * 100];
};

convert$2.hsv.hcg = function (hsv) {
	const s = hsv[1] / 100;
	const v = hsv[2] / 100;

	const c = s * v;
	let f = 0;

	if (c < 1.0) {
		f = (v - c) / (1 - c);
	}

	return [hsv[0], c * 100, f * 100];
};

convert$2.hcg.rgb = function (hcg) {
	const h = hcg[0] / 360;
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;

	if (c === 0.0) {
		return [g * 255, g * 255, g * 255];
	}

	const pure = [0, 0, 0];
	const hi = (h % 1) * 6;
	const v = hi % 1;
	const w = 1 - v;
	let mg = 0;

	/* eslint-disable max-statements-per-line */
	switch (Math.floor(hi)) {
		case 0:
			pure[0] = 1; pure[1] = v; pure[2] = 0; break;
		case 1:
			pure[0] = w; pure[1] = 1; pure[2] = 0; break;
		case 2:
			pure[0] = 0; pure[1] = 1; pure[2] = v; break;
		case 3:
			pure[0] = 0; pure[1] = w; pure[2] = 1; break;
		case 4:
			pure[0] = v; pure[1] = 0; pure[2] = 1; break;
		default:
			pure[0] = 1; pure[1] = 0; pure[2] = w;
	}
	/* eslint-enable max-statements-per-line */

	mg = (1.0 - c) * g;

	return [
		(c * pure[0] + mg) * 255,
		(c * pure[1] + mg) * 255,
		(c * pure[2] + mg) * 255
	];
};

convert$2.hcg.hsv = function (hcg) {
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;

	const v = c + g * (1.0 - c);
	let f = 0;

	if (v > 0.0) {
		f = c / v;
	}

	return [hcg[0], f * 100, v * 100];
};

convert$2.hcg.hsl = function (hcg) {
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;

	const l = g * (1.0 - c) + 0.5 * c;
	let s = 0;

	if (l > 0.0 && l < 0.5) {
		s = c / (2 * l);
	} else
	if (l >= 0.5 && l < 1.0) {
		s = c / (2 * (1 - l));
	}

	return [hcg[0], s * 100, l * 100];
};

convert$2.hcg.hwb = function (hcg) {
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;
	const v = c + g * (1.0 - c);
	return [hcg[0], (v - c) * 100, (1 - v) * 100];
};

convert$2.hwb.hcg = function (hwb) {
	const w = hwb[1] / 100;
	const b = hwb[2] / 100;
	const v = 1 - b;
	const c = v - w;
	let g = 0;

	if (c < 1) {
		g = (v - c) / (1 - c);
	}

	return [hwb[0], c * 100, g * 100];
};

convert$2.apple.rgb = function (apple) {
	return [(apple[0] / 65535) * 255, (apple[1] / 65535) * 255, (apple[2] / 65535) * 255];
};

convert$2.rgb.apple = function (rgb) {
	return [(rgb[0] / 255) * 65535, (rgb[1] / 255) * 65535, (rgb[2] / 255) * 65535];
};

convert$2.gray.rgb = function (args) {
	return [args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255];
};

convert$2.gray.hsl = function (args) {
	return [0, 0, args[0]];
};

convert$2.gray.hsv = convert$2.gray.hsl;

convert$2.gray.hwb = function (gray) {
	return [0, 100, gray[0]];
};

convert$2.gray.cmyk = function (gray) {
	return [0, 0, 0, gray[0]];
};

convert$2.gray.lab = function (gray) {
	return [gray[0], 0, 0];
};

convert$2.gray.hex = function (gray) {
	const val = Math.round(gray[0] / 100 * 255) & 0xFF;
	const integer = (val << 16) + (val << 8) + val;

	const string = integer.toString(16).toUpperCase();
	return '000000'.substring(string.length) + string;
};

convert$2.rgb.gray = function (rgb) {
	const val = (rgb[0] + rgb[1] + rgb[2]) / 3;
	return [val / 255 * 100];
};

/*
	This function routes a model to all other models.

	all functions that are routed have a property `.conversion` attached
	to the returned synthetic function. This property is an array
	of strings, each with the steps in between the 'from' and 'to'
	color models (inclusive).

	conversions that are not possible simply are not included.
*/

function buildGraph() {
	const graph = {};
	// https://jsperf.com/object-keys-vs-for-in-with-closure/3
	const models = Object.keys(conversions);

	for (let len = models.length, i = 0; i < len; i++) {
		graph[models[i]] = {
			// http://jsperf.com/1-vs-infinity
			// micro-opt, but this is simple.
			distance: -1,
			parent: null
		};
	}

	return graph;
}

// https://en.wikipedia.org/wiki/Breadth-first_search
function deriveBFS(fromModel) {
	const graph = buildGraph();
	const queue = [fromModel]; // Unshift -> queue -> pop

	graph[fromModel].distance = 0;

	while (queue.length) {
		const current = queue.pop();
		const adjacents = Object.keys(conversions[current]);

		for (let len = adjacents.length, i = 0; i < len; i++) {
			const adjacent = adjacents[i];
			const node = graph[adjacent];

			if (node.distance === -1) {
				node.distance = graph[current].distance + 1;
				node.parent = current;
				queue.unshift(adjacent);
			}
		}
	}

	return graph;
}

function link$1(from, to) {
	return function (args) {
		return to(from(args));
	};
}

function wrapConversion(toModel, graph) {
	const path = [graph[toModel].parent, toModel];
	let fn = conversions[graph[toModel].parent][toModel];

	let cur = graph[toModel].parent;
	while (graph[cur].parent) {
		path.unshift(graph[cur].parent);
		fn = link$1(conversions[graph[cur].parent][cur], fn);
		cur = graph[cur].parent;
	}

	fn.conversion = path;
	return fn;
}

var route = function (fromModel) {
	const graph = deriveBFS(fromModel);
	const conversion = {};

	const models = Object.keys(graph);
	for (let len = models.length, i = 0; i < len; i++) {
		const toModel = models[i];
		const node = graph[toModel];

		if (node.parent === null) {
			// No possible conversion, or this node is the source model.
			continue;
		}

		conversion[toModel] = wrapConversion(toModel, graph);
	}

	return conversion;
};

const convert$1 = {};

const models = Object.keys(conversions);

function wrapRaw(fn) {
	const wrappedFn = function (...args) {
		const arg0 = args[0];
		if (arg0 === undefined || arg0 === null) {
			return arg0;
		}

		if (arg0.length > 1) {
			args = arg0;
		}

		return fn(args);
	};

	// Preserve .conversion property if there is one
	if ('conversion' in fn) {
		wrappedFn.conversion = fn.conversion;
	}

	return wrappedFn;
}

function wrapRounded(fn) {
	const wrappedFn = function (...args) {
		const arg0 = args[0];

		if (arg0 === undefined || arg0 === null) {
			return arg0;
		}

		if (arg0.length > 1) {
			args = arg0;
		}

		const result = fn(args);

		// We're assuming the result is an array here.
		// see notice in conversions.js; don't use box types
		// in conversion functions.
		if (typeof result === 'object') {
			for (let len = result.length, i = 0; i < len; i++) {
				result[i] = Math.round(result[i]);
			}
		}

		return result;
	};

	// Preserve .conversion property if there is one
	if ('conversion' in fn) {
		wrappedFn.conversion = fn.conversion;
	}

	return wrappedFn;
}

models.forEach(fromModel => {
	convert$1[fromModel] = {};

	Object.defineProperty(convert$1[fromModel], 'channels', {value: conversions[fromModel].channels});
	Object.defineProperty(convert$1[fromModel], 'labels', {value: conversions[fromModel].labels});

	const routes = route(fromModel);
	const routeModels = Object.keys(routes);

	routeModels.forEach(toModel => {
		const fn = routes[toModel];

		convert$1[fromModel][toModel] = wrapRounded(fn);
		convert$1[fromModel][toModel].raw = wrapRaw(fn);
	});
});

var colorConvert = convert$1;

var ansiStyles = createCommonjsModule(function (module) {

const wrapAnsi16 = (fn, offset) => (...args) => {
	const code = fn(...args);
	return `\u001B[${code + offset}m`;
};

const wrapAnsi256 = (fn, offset) => (...args) => {
	const code = fn(...args);
	return `\u001B[${38 + offset};5;${code}m`;
};

const wrapAnsi16m = (fn, offset) => (...args) => {
	const rgb = fn(...args);
	return `\u001B[${38 + offset};2;${rgb[0]};${rgb[1]};${rgb[2]}m`;
};

const ansi2ansi = n => n;
const rgb2rgb = (r, g, b) => [r, g, b];

const setLazyProperty = (object, property, get) => {
	Object.defineProperty(object, property, {
		get: () => {
			const value = get();

			Object.defineProperty(object, property, {
				value,
				enumerable: true,
				configurable: true
			});

			return value;
		},
		enumerable: true,
		configurable: true
	});
};

/** @type {typeof import('color-convert')} */
let colorConvert$1;
const makeDynamicStyles = (wrap, targetSpace, identity, isBackground) => {
	if (colorConvert$1 === undefined) {
		colorConvert$1 = colorConvert;
	}

	const offset = isBackground ? 10 : 0;
	const styles = {};

	for (const [sourceSpace, suite] of Object.entries(colorConvert$1)) {
		const name = sourceSpace === 'ansi16' ? 'ansi' : sourceSpace;
		if (sourceSpace === targetSpace) {
			styles[name] = wrap(identity, offset);
		} else if (typeof suite === 'object') {
			styles[name] = wrap(suite[targetSpace], offset);
		}
	}

	return styles;
};

function assembleStyles() {
	const codes = new Map();
	const styles = {
		modifier: {
			reset: [0, 0],
			// 21 isn't widely supported and 22 does the same thing
			bold: [1, 22],
			dim: [2, 22],
			italic: [3, 23],
			underline: [4, 24],
			inverse: [7, 27],
			hidden: [8, 28],
			strikethrough: [9, 29]
		},
		color: {
			black: [30, 39],
			red: [31, 39],
			green: [32, 39],
			yellow: [33, 39],
			blue: [34, 39],
			magenta: [35, 39],
			cyan: [36, 39],
			white: [37, 39],

			// Bright color
			blackBright: [90, 39],
			redBright: [91, 39],
			greenBright: [92, 39],
			yellowBright: [93, 39],
			blueBright: [94, 39],
			magentaBright: [95, 39],
			cyanBright: [96, 39],
			whiteBright: [97, 39]
		},
		bgColor: {
			bgBlack: [40, 49],
			bgRed: [41, 49],
			bgGreen: [42, 49],
			bgYellow: [43, 49],
			bgBlue: [44, 49],
			bgMagenta: [45, 49],
			bgCyan: [46, 49],
			bgWhite: [47, 49],

			// Bright color
			bgBlackBright: [100, 49],
			bgRedBright: [101, 49],
			bgGreenBright: [102, 49],
			bgYellowBright: [103, 49],
			bgBlueBright: [104, 49],
			bgMagentaBright: [105, 49],
			bgCyanBright: [106, 49],
			bgWhiteBright: [107, 49]
		}
	};

	// Alias bright black as gray (and grey)
	styles.color.gray = styles.color.blackBright;
	styles.bgColor.bgGray = styles.bgColor.bgBlackBright;
	styles.color.grey = styles.color.blackBright;
	styles.bgColor.bgGrey = styles.bgColor.bgBlackBright;

	for (const [groupName, group] of Object.entries(styles)) {
		for (const [styleName, style] of Object.entries(group)) {
			styles[styleName] = {
				open: `\u001B[${style[0]}m`,
				close: `\u001B[${style[1]}m`
			};

			group[styleName] = styles[styleName];

			codes.set(style[0], style[1]);
		}

		Object.defineProperty(styles, groupName, {
			value: group,
			enumerable: false
		});
	}

	Object.defineProperty(styles, 'codes', {
		value: codes,
		enumerable: false
	});

	styles.color.close = '\u001B[39m';
	styles.bgColor.close = '\u001B[49m';

	setLazyProperty(styles.color, 'ansi', () => makeDynamicStyles(wrapAnsi16, 'ansi16', ansi2ansi, false));
	setLazyProperty(styles.color, 'ansi256', () => makeDynamicStyles(wrapAnsi256, 'ansi256', ansi2ansi, false));
	setLazyProperty(styles.color, 'ansi16m', () => makeDynamicStyles(wrapAnsi16m, 'rgb', rgb2rgb, false));
	setLazyProperty(styles.bgColor, 'ansi', () => makeDynamicStyles(wrapAnsi16, 'ansi16', ansi2ansi, true));
	setLazyProperty(styles.bgColor, 'ansi256', () => makeDynamicStyles(wrapAnsi256, 'ansi256', ansi2ansi, true));
	setLazyProperty(styles.bgColor, 'ansi16m', () => makeDynamicStyles(wrapAnsi16m, 'rgb', rgb2rgb, true));

	return styles;
}

// Make the export immutable
Object.defineProperty(module, 'exports', {
	enumerable: true,
	get: assembleStyles
});
});

var hasFlag = (flag, argv = process.argv) => {
	const prefix = flag.startsWith('-') ? '' : (flag.length === 1 ? '-' : '--');
	const position = argv.indexOf(prefix + flag);
	const terminatorPosition = argv.indexOf('--');
	return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
};

const {env: env$1} = process;

let forceColor;
if (hasFlag('no-color') ||
	hasFlag('no-colors') ||
	hasFlag('color=false') ||
	hasFlag('color=never')) {
	forceColor = 0;
} else if (hasFlag('color') ||
	hasFlag('colors') ||
	hasFlag('color=true') ||
	hasFlag('color=always')) {
	forceColor = 1;
}

if ('FORCE_COLOR' in env$1) {
	if (env$1.FORCE_COLOR === 'true') {
		forceColor = 1;
	} else if (env$1.FORCE_COLOR === 'false') {
		forceColor = 0;
	} else {
		forceColor = env$1.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env$1.FORCE_COLOR, 10), 3);
	}
}

function translateLevel(level) {
	if (level === 0) {
		return false;
	}

	return {
		level,
		hasBasic: true,
		has256: level >= 2,
		has16m: level >= 3
	};
}

function supportsColor(haveStream, streamIsTTY) {
	if (forceColor === 0) {
		return 0;
	}

	if (hasFlag('color=16m') ||
		hasFlag('color=full') ||
		hasFlag('color=truecolor')) {
		return 3;
	}

	if (hasFlag('color=256')) {
		return 2;
	}

	if (haveStream && !streamIsTTY && forceColor === undefined) {
		return 0;
	}

	const min = forceColor || 0;

	if (env$1.TERM === 'dumb') {
		return min;
	}

	if (process.platform === 'win32') {
		// Windows 10 build 10586 is the first Windows release that supports 256 colors.
		// Windows 10 build 14931 is the first release that supports 16m/TrueColor.
		const osRelease = os__default['default'].release().split('.');
		if (
			Number(osRelease[0]) >= 10 &&
			Number(osRelease[2]) >= 10586
		) {
			return Number(osRelease[2]) >= 14931 ? 3 : 2;
		}

		return 1;
	}

	if ('CI' in env$1) {
		if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI', 'GITHUB_ACTIONS', 'BUILDKITE'].some(sign => sign in env$1) || env$1.CI_NAME === 'codeship') {
			return 1;
		}

		return min;
	}

	if ('TEAMCITY_VERSION' in env$1) {
		return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env$1.TEAMCITY_VERSION) ? 1 : 0;
	}

	if (env$1.COLORTERM === 'truecolor') {
		return 3;
	}

	if ('TERM_PROGRAM' in env$1) {
		const version = parseInt((env$1.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

		switch (env$1.TERM_PROGRAM) {
			case 'iTerm.app':
				return version >= 3 ? 3 : 2;
			case 'Apple_Terminal':
				return 2;
			// No default
		}
	}

	if (/-256(color)?$/i.test(env$1.TERM)) {
		return 2;
	}

	if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env$1.TERM)) {
		return 1;
	}

	if ('COLORTERM' in env$1) {
		return 1;
	}

	return min;
}

function getSupportLevel(stream) {
	const level = supportsColor(stream, stream && stream.isTTY);
	return translateLevel(level);
}

var supportsColor_1 = {
	supportsColor: getSupportLevel,
	stdout: translateLevel(supportsColor(true, tty__default['default'].isatty(1))),
	stderr: translateLevel(supportsColor(true, tty__default['default'].isatty(2)))
};

const stringReplaceAll$1 = (string, substring, replacer) => {
	let index = string.indexOf(substring);
	if (index === -1) {
		return string;
	}

	const substringLength = substring.length;
	let endIndex = 0;
	let returnValue = '';
	do {
		returnValue += string.substr(endIndex, index - endIndex) + substring + replacer;
		endIndex = index + substringLength;
		index = string.indexOf(substring, endIndex);
	} while (index !== -1);

	returnValue += string.substr(endIndex);
	return returnValue;
};

const stringEncaseCRLFWithFirstIndex$1 = (string, prefix, postfix, index) => {
	let endIndex = 0;
	let returnValue = '';
	do {
		const gotCR = string[index - 1] === '\r';
		returnValue += string.substr(endIndex, (gotCR ? index - 1 : index) - endIndex) + prefix + (gotCR ? '\r\n' : '\n') + postfix;
		endIndex = index + 1;
		index = string.indexOf('\n', endIndex);
	} while (index !== -1);

	returnValue += string.substr(endIndex);
	return returnValue;
};

var util = {
	stringReplaceAll: stringReplaceAll$1,
	stringEncaseCRLFWithFirstIndex: stringEncaseCRLFWithFirstIndex$1
};

const TEMPLATE_REGEX = /(?:\\(u(?:[a-f\d]{4}|\{[a-f\d]{1,6}\})|x[a-f\d]{2}|.))|(?:\{(~)?(\w+(?:\([^)]*\))?(?:\.\w+(?:\([^)]*\))?)*)(?:[ \t]|(?=\r?\n)))|(\})|((?:.|[\r\n\f])+?)/gi;
const STYLE_REGEX = /(?:^|\.)(\w+)(?:\(([^)]*)\))?/g;
const STRING_REGEX = /^(['"])((?:\\.|(?!\1)[^\\])*)\1$/;
const ESCAPE_REGEX = /\\(u(?:[a-f\d]{4}|{[a-f\d]{1,6}})|x[a-f\d]{2}|.)|([^\\])/gi;

const ESCAPES = new Map([
	['n', '\n'],
	['r', '\r'],
	['t', '\t'],
	['b', '\b'],
	['f', '\f'],
	['v', '\v'],
	['0', '\0'],
	['\\', '\\'],
	['e', '\u001B'],
	['a', '\u0007']
]);

function unescape(c) {
	const u = c[0] === 'u';
	const bracket = c[1] === '{';

	if ((u && !bracket && c.length === 5) || (c[0] === 'x' && c.length === 3)) {
		return String.fromCharCode(parseInt(c.slice(1), 16));
	}

	if (u && bracket) {
		return String.fromCodePoint(parseInt(c.slice(2, -1), 16));
	}

	return ESCAPES.get(c) || c;
}

function parseArguments(name, arguments_) {
	const results = [];
	const chunks = arguments_.trim().split(/\s*,\s*/g);
	let matches;

	for (const chunk of chunks) {
		const number = Number(chunk);
		if (!Number.isNaN(number)) {
			results.push(number);
		} else if ((matches = chunk.match(STRING_REGEX))) {
			results.push(matches[2].replace(ESCAPE_REGEX, (m, escape, character) => escape ? unescape(escape) : character));
		} else {
			throw new Error(`Invalid Chalk template style argument: ${chunk} (in style '${name}')`);
		}
	}

	return results;
}

function parseStyle(style) {
	STYLE_REGEX.lastIndex = 0;

	const results = [];
	let matches;

	while ((matches = STYLE_REGEX.exec(style)) !== null) {
		const name = matches[1];

		if (matches[2]) {
			const args = parseArguments(name, matches[2]);
			results.push([name].concat(args));
		} else {
			results.push([name]);
		}
	}

	return results;
}

function buildStyle(chalk, styles) {
	const enabled = {};

	for (const layer of styles) {
		for (const style of layer.styles) {
			enabled[style[0]] = layer.inverse ? null : style.slice(1);
		}
	}

	let current = chalk;
	for (const [styleName, styles] of Object.entries(enabled)) {
		if (!Array.isArray(styles)) {
			continue;
		}

		if (!(styleName in current)) {
			throw new Error(`Unknown Chalk style: ${styleName}`);
		}

		current = styles.length > 0 ? current[styleName](...styles) : current[styleName];
	}

	return current;
}

var templates = (chalk, temporary) => {
	const styles = [];
	const chunks = [];
	let chunk = [];

	// eslint-disable-next-line max-params
	temporary.replace(TEMPLATE_REGEX, (m, escapeCharacter, inverse, style, close, character) => {
		if (escapeCharacter) {
			chunk.push(unescape(escapeCharacter));
		} else if (style) {
			const string = chunk.join('');
			chunk = [];
			chunks.push(styles.length === 0 ? string : buildStyle(chalk, styles)(string));
			styles.push({inverse, styles: parseStyle(style)});
		} else if (close) {
			if (styles.length === 0) {
				throw new Error('Found extraneous } in Chalk template literal');
			}

			chunks.push(buildStyle(chalk, styles)(chunk.join('')));
			chunk = [];
			styles.pop();
		} else {
			chunk.push(character);
		}
	});

	chunks.push(chunk.join(''));

	if (styles.length > 0) {
		const errMessage = `Chalk template literal is missing ${styles.length} closing bracket${styles.length === 1 ? '' : 's'} (\`}\`)`;
		throw new Error(errMessage);
	}

	return chunks.join('');
};

const {stdout: stdoutColor, stderr: stderrColor} = supportsColor_1;
const {
	stringReplaceAll,
	stringEncaseCRLFWithFirstIndex
} = util;

const {isArray} = Array;

// `supportsColor.level` → `ansiStyles.color[name]` mapping
const levelMapping = [
	'ansi',
	'ansi',
	'ansi256',
	'ansi16m'
];

const styles = Object.create(null);

const applyOptions = (object, options = {}) => {
	if (options.level && !(Number.isInteger(options.level) && options.level >= 0 && options.level <= 3)) {
		throw new Error('The `level` option should be an integer from 0 to 3');
	}

	// Detect level if not set manually
	const colorLevel = stdoutColor ? stdoutColor.level : 0;
	object.level = options.level === undefined ? colorLevel : options.level;
};

class ChalkClass {
	constructor(options) {
		// eslint-disable-next-line no-constructor-return
		return chalkFactory(options);
	}
}

const chalkFactory = options => {
	const chalk = {};
	applyOptions(chalk, options);

	chalk.template = (...arguments_) => chalkTag(chalk.template, ...arguments_);

	Object.setPrototypeOf(chalk, Chalk.prototype);
	Object.setPrototypeOf(chalk.template, chalk);

	chalk.template.constructor = () => {
		throw new Error('`chalk.constructor()` is deprecated. Use `new chalk.Instance()` instead.');
	};

	chalk.template.Instance = ChalkClass;

	return chalk.template;
};

function Chalk(options) {
	return chalkFactory(options);
}

for (const [styleName, style] of Object.entries(ansiStyles)) {
	styles[styleName] = {
		get() {
			const builder = createBuilder(this, createStyler(style.open, style.close, this._styler), this._isEmpty);
			Object.defineProperty(this, styleName, {value: builder});
			return builder;
		}
	};
}

styles.visible = {
	get() {
		const builder = createBuilder(this, this._styler, true);
		Object.defineProperty(this, 'visible', {value: builder});
		return builder;
	}
};

const usedModels = ['rgb', 'hex', 'keyword', 'hsl', 'hsv', 'hwb', 'ansi', 'ansi256'];

for (const model of usedModels) {
	styles[model] = {
		get() {
			const {level} = this;
			return function (...arguments_) {
				const styler = createStyler(ansiStyles.color[levelMapping[level]][model](...arguments_), ansiStyles.color.close, this._styler);
				return createBuilder(this, styler, this._isEmpty);
			};
		}
	};
}

for (const model of usedModels) {
	const bgModel = 'bg' + model[0].toUpperCase() + model.slice(1);
	styles[bgModel] = {
		get() {
			const {level} = this;
			return function (...arguments_) {
				const styler = createStyler(ansiStyles.bgColor[levelMapping[level]][model](...arguments_), ansiStyles.bgColor.close, this._styler);
				return createBuilder(this, styler, this._isEmpty);
			};
		}
	};
}

const proto = Object.defineProperties(() => {}, {
	...styles,
	level: {
		enumerable: true,
		get() {
			return this._generator.level;
		},
		set(level) {
			this._generator.level = level;
		}
	}
});

const createStyler = (open, close, parent) => {
	let openAll;
	let closeAll;
	if (parent === undefined) {
		openAll = open;
		closeAll = close;
	} else {
		openAll = parent.openAll + open;
		closeAll = close + parent.closeAll;
	}

	return {
		open,
		close,
		openAll,
		closeAll,
		parent
	};
};

const createBuilder = (self, _styler, _isEmpty) => {
	const builder = (...arguments_) => {
		if (isArray(arguments_[0]) && isArray(arguments_[0].raw)) {
			// Called as a template literal, for example: chalk.red`2 + 3 = {bold ${2+3}}`
			return applyStyle(builder, chalkTag(builder, ...arguments_));
		}

		// Single argument is hot path, implicit coercion is faster than anything
		// eslint-disable-next-line no-implicit-coercion
		return applyStyle(builder, (arguments_.length === 1) ? ('' + arguments_[0]) : arguments_.join(' '));
	};

	// We alter the prototype because we must return a function, but there is
	// no way to create a function with a different prototype
	Object.setPrototypeOf(builder, proto);

	builder._generator = self;
	builder._styler = _styler;
	builder._isEmpty = _isEmpty;

	return builder;
};

const applyStyle = (self, string) => {
	if (self.level <= 0 || !string) {
		return self._isEmpty ? '' : string;
	}

	let styler = self._styler;

	if (styler === undefined) {
		return string;
	}

	const {openAll, closeAll} = styler;
	if (string.indexOf('\u001B') !== -1) {
		while (styler !== undefined) {
			// Replace any instances already present with a re-opening code
			// otherwise only the part of the string until said closing code
			// will be colored, and the rest will simply be 'plain'.
			string = stringReplaceAll(string, styler.close, styler.open);

			styler = styler.parent;
		}
	}

	// We can move both next actions out of loop, because remaining actions in loop won't have
	// any/visible effect on parts we add here. Close the styling before a linebreak and reopen
	// after next line to fix a bleed issue on macOS: https://github.com/chalk/chalk/pull/92
	const lfIndex = string.indexOf('\n');
	if (lfIndex !== -1) {
		string = stringEncaseCRLFWithFirstIndex(string, closeAll, openAll, lfIndex);
	}

	return openAll + string + closeAll;
};

let template;
const chalkTag = (chalk, ...strings) => {
	const [firstString] = strings;

	if (!isArray(firstString) || !isArray(firstString.raw)) {
		// If chalk() was called by itself or with a string,
		// return the string itself as a string.
		return strings.join(' ');
	}

	const arguments_ = strings.slice(1);
	const parts = [firstString.raw[0]];

	for (let i = 1; i < firstString.length; i++) {
		parts.push(
			String(arguments_[i - 1]).replace(/[{}\\]/g, '\\$&'),
			String(firstString.raw[i])
		);
	}

	if (template === undefined) {
		template = templates;
	}

	return template(chalk, parts.join(''));
};

Object.defineProperties(Chalk.prototype, styles);

const chalk = Chalk(); // eslint-disable-line new-cap
chalk.supportsColor = stdoutColor;
chalk.stderr = Chalk({level: stderrColor ? stderrColor.level : 0}); // eslint-disable-line new-cap
chalk.stderr.supportsColor = stderrColor;

var source = chalk;

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

var windows = isexe$2;
isexe$2.sync = sync$6;



function checkPathExt (path, options) {
  var pathext = options.pathExt !== undefined ?
    options.pathExt : process.env.PATHEXT;

  if (!pathext) {
    return true
  }

  pathext = pathext.split(';');
  if (pathext.indexOf('') !== -1) {
    return true
  }
  for (var i = 0; i < pathext.length; i++) {
    var p = pathext[i].toLowerCase();
    if (p && path.substr(-p.length).toLowerCase() === p) {
      return true
    }
  }
  return false
}

function checkStat$1 (stat, path, options) {
  if (!stat.isSymbolicLink() && !stat.isFile()) {
    return false
  }
  return checkPathExt(path, options)
}

function isexe$2 (path, options, cb) {
  fs__default['default'].stat(path, function (er, stat) {
    cb(er, er ? false : checkStat$1(stat, path, options));
  });
}

function sync$6 (path, options) {
  return checkStat$1(fs__default['default'].statSync(path), path, options)
}

var mode = isexe$1;
isexe$1.sync = sync$5;



function isexe$1 (path, options, cb) {
  fs__default['default'].stat(path, function (er, stat) {
    cb(er, er ? false : checkStat(stat, options));
  });
}

function sync$5 (path, options) {
  return checkStat(fs__default['default'].statSync(path), options)
}

function checkStat (stat, options) {
  return stat.isFile() && checkMode(stat, options)
}

function checkMode (stat, options) {
  var mod = stat.mode;
  var uid = stat.uid;
  var gid = stat.gid;

  var myUid = options.uid !== undefined ?
    options.uid : process.getuid && process.getuid();
  var myGid = options.gid !== undefined ?
    options.gid : process.getgid && process.getgid();

  var u = parseInt('100', 8);
  var g = parseInt('010', 8);
  var o = parseInt('001', 8);
  var ug = u | g;

  var ret = (mod & o) ||
    (mod & g) && gid === myGid ||
    (mod & u) && uid === myUid ||
    (mod & ug) && myUid === 0;

  return ret
}

var core$1;
if (process.platform === 'win32' || commonjsGlobal.TESTING_WINDOWS) {
  core$1 = windows;
} else {
  core$1 = mode;
}

var isexe_1 = isexe;
isexe.sync = sync$4;

function isexe (path, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  if (!cb) {
    if (typeof Promise !== 'function') {
      throw new TypeError('callback not provided')
    }

    return new Promise(function (resolve, reject) {
      isexe(path, options || {}, function (er, is) {
        if (er) {
          reject(er);
        } else {
          resolve(is);
        }
      });
    })
  }

  core$1(path, options || {}, function (er, is) {
    // ignore EACCES because that just means we aren't allowed to run it
    if (er) {
      if (er.code === 'EACCES' || options && options.ignoreErrors) {
        er = null;
        is = false;
      }
    }
    cb(er, is);
  });
}

function sync$4 (path, options) {
  // my kingdom for a filtered catch
  try {
    return core$1.sync(path, options || {})
  } catch (er) {
    if (options && options.ignoreErrors || er.code === 'EACCES') {
      return false
    } else {
      throw er
    }
  }
}

const isWindows$1 = process.platform === 'win32' ||
    process.env.OSTYPE === 'cygwin' ||
    process.env.OSTYPE === 'msys';


const COLON = isWindows$1 ? ';' : ':';


const getNotFoundError = (cmd) =>
  Object.assign(new Error(`not found: ${cmd}`), { code: 'ENOENT' });

const getPathInfo = (cmd, opt) => {
  const colon = opt.colon || COLON;

  // If it has a slash, then we don't bother searching the pathenv.
  // just check the file itself, and that's it.
  const pathEnv = cmd.match(/\//) || isWindows$1 && cmd.match(/\\/) ? ['']
    : (
      [
        // windows always checks the cwd first
        ...(isWindows$1 ? [process.cwd()] : []),
        ...(opt.path || process.env.PATH ||
          /* istanbul ignore next: very unusual */ '').split(colon),
      ]
    );
  const pathExtExe = isWindows$1
    ? opt.pathExt || process.env.PATHEXT || '.EXE;.CMD;.BAT;.COM'
    : '';
  const pathExt = isWindows$1 ? pathExtExe.split(colon) : [''];

  if (isWindows$1) {
    if (cmd.indexOf('.') !== -1 && pathExt[0] !== '')
      pathExt.unshift('');
  }

  return {
    pathEnv,
    pathExt,
    pathExtExe,
  }
};

const which = (cmd, opt, cb) => {
  if (typeof opt === 'function') {
    cb = opt;
    opt = {};
  }
  if (!opt)
    opt = {};

  const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt);
  const found = [];

  const step = i => new Promise((resolve, reject) => {
    if (i === pathEnv.length)
      return opt.all && found.length ? resolve(found)
        : reject(getNotFoundError(cmd))

    const ppRaw = pathEnv[i];
    const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw;

    const pCmd = path__default['default'].join(pathPart, cmd);
    const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd
      : pCmd;

    resolve(subStep(p, i, 0));
  });

  const subStep = (p, i, ii) => new Promise((resolve, reject) => {
    if (ii === pathExt.length)
      return resolve(step(i + 1))
    const ext = pathExt[ii];
    isexe_1(p + ext, { pathExt: pathExtExe }, (er, is) => {
      if (!er && is) {
        if (opt.all)
          found.push(p + ext);
        else
          return resolve(p + ext)
      }
      return resolve(subStep(p, i, ii + 1))
    });
  });

  return cb ? step(0).then(res => cb(null, res), cb) : step(0)
};

const whichSync = (cmd, opt) => {
  opt = opt || {};

  const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt);
  const found = [];

  for (let i = 0; i < pathEnv.length; i ++) {
    const ppRaw = pathEnv[i];
    const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw;

    const pCmd = path__default['default'].join(pathPart, cmd);
    const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd
      : pCmd;

    for (let j = 0; j < pathExt.length; j ++) {
      const cur = p + pathExt[j];
      try {
        const is = isexe_1.sync(cur, { pathExt: pathExtExe });
        if (is) {
          if (opt.all)
            found.push(cur);
          else
            return cur
        }
      } catch (ex) {}
    }
  }

  if (opt.all && found.length)
    return found

  if (opt.nothrow)
    return null

  throw getNotFoundError(cmd)
};

var which_1 = which;
which.sync = whichSync;

const pathKey = (options = {}) => {
	const environment = options.env || process.env;
	const platform = options.platform || process.platform;

	if (platform !== 'win32') {
		return 'PATH';
	}

	return Object.keys(environment).reverse().find(key => key.toUpperCase() === 'PATH') || 'Path';
};

var pathKey_1 = pathKey;
// TODO: Remove this for the next major release
var _default$2 = pathKey;
pathKey_1.default = _default$2;

function resolveCommandAttempt(parsed, withoutPathExt) {
    const env = parsed.options.env || process.env;
    const cwd = process.cwd();
    const hasCustomCwd = parsed.options.cwd != null;
    // Worker threads do not have process.chdir()
    const shouldSwitchCwd = hasCustomCwd && process.chdir !== undefined && !process.chdir.disabled;

    // If a custom `cwd` was specified, we need to change the process cwd
    // because `which` will do stat calls but does not support a custom cwd
    if (shouldSwitchCwd) {
        try {
            process.chdir(parsed.options.cwd);
        } catch (err) {
            /* Empty */
        }
    }

    let resolved;

    try {
        resolved = which_1.sync(parsed.command, {
            path: env[pathKey_1({ env })],
            pathExt: withoutPathExt ? path__default['default'].delimiter : undefined,
        });
    } catch (e) {
        /* Empty */
    } finally {
        if (shouldSwitchCwd) {
            process.chdir(cwd);
        }
    }

    // If we successfully resolved, ensure that an absolute path is returned
    // Note that when a custom `cwd` was used, we need to resolve to an absolute path based on it
    if (resolved) {
        resolved = path__default['default'].resolve(hasCustomCwd ? parsed.options.cwd : '', resolved);
    }

    return resolved;
}

function resolveCommand(parsed) {
    return resolveCommandAttempt(parsed) || resolveCommandAttempt(parsed, true);
}

var resolveCommand_1 = resolveCommand;

// See http://www.robvanderwoude.com/escapechars.php
const metaCharsRegExp = /([()\][%!^"`<>&|;, *?])/g;

function escapeCommand(arg) {
    // Escape meta chars
    arg = arg.replace(metaCharsRegExp, '^$1');

    return arg;
}

function escapeArgument(arg, doubleEscapeMetaChars) {
    // Convert to string
    arg = `${arg}`;

    // Algorithm below is based on https://qntm.org/cmd

    // Sequence of backslashes followed by a double quote:
    // double up all the backslashes and escape the double quote
    arg = arg.replace(/(\\*)"/g, '$1$1\\"');

    // Sequence of backslashes followed by the end of the string
    // (which will become a double quote later):
    // double up all the backslashes
    arg = arg.replace(/(\\*)$/, '$1$1');

    // All other backslashes occur literally

    // Quote the whole thing:
    arg = `"${arg}"`;

    // Escape meta chars
    arg = arg.replace(metaCharsRegExp, '^$1');

    // Double escape meta chars if necessary
    if (doubleEscapeMetaChars) {
        arg = arg.replace(metaCharsRegExp, '^$1');
    }

    return arg;
}

var command$2 = escapeCommand;
var argument = escapeArgument;

var _escape = {
	command: command$2,
	argument: argument
};

var shebangRegex = /^#!(.*)/;

var shebangCommand = (string = '') => {
	const match = string.match(shebangRegex);

	if (!match) {
		return null;
	}

	const [path, argument] = match[0].replace(/#! ?/, '').split(' ');
	const binary = path.split('/').pop();

	if (binary === 'env') {
		return argument;
	}

	return argument ? `${binary} ${argument}` : binary;
};

function readShebang(command) {
    // Read the first 150 bytes from the file
    const size = 150;
    const buffer = Buffer.alloc(size);

    let fd;

    try {
        fd = fs__default['default'].openSync(command, 'r');
        fs__default['default'].readSync(fd, buffer, 0, size, 0);
        fs__default['default'].closeSync(fd);
    } catch (e) { /* Empty */ }

    // Attempt to extract shebang (null is returned if not a shebang)
    return shebangCommand(buffer.toString());
}

var readShebang_1 = readShebang;

const isWin$2 = process.platform === 'win32';
const isExecutableRegExp = /\.(?:com|exe)$/i;
const isCmdShimRegExp = /node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;

function detectShebang(parsed) {
    parsed.file = resolveCommand_1(parsed);

    const shebang = parsed.file && readShebang_1(parsed.file);

    if (shebang) {
        parsed.args.unshift(parsed.file);
        parsed.command = shebang;

        return resolveCommand_1(parsed);
    }

    return parsed.file;
}

function parseNonShell(parsed) {
    if (!isWin$2) {
        return parsed;
    }

    // Detect & add support for shebangs
    const commandFile = detectShebang(parsed);

    // We don't need a shell if the command filename is an executable
    const needsShell = !isExecutableRegExp.test(commandFile);

    // If a shell is required, use cmd.exe and take care of escaping everything correctly
    // Note that `forceShell` is an hidden option used only in tests
    if (parsed.options.forceShell || needsShell) {
        // Need to double escape meta chars if the command is a cmd-shim located in `node_modules/.bin/`
        // The cmd-shim simply calls execute the package bin file with NodeJS, proxying any argument
        // Because the escape of metachars with ^ gets interpreted when the cmd.exe is first called,
        // we need to double escape them
        const needsDoubleEscapeMetaChars = isCmdShimRegExp.test(commandFile);

        // Normalize posix paths into OS compatible paths (e.g.: foo/bar -> foo\bar)
        // This is necessary otherwise it will always fail with ENOENT in those cases
        parsed.command = path__default['default'].normalize(parsed.command);

        // Escape command & arguments
        parsed.command = _escape.command(parsed.command);
        parsed.args = parsed.args.map((arg) => _escape.argument(arg, needsDoubleEscapeMetaChars));

        const shellCommand = [parsed.command].concat(parsed.args).join(' ');

        parsed.args = ['/d', '/s', '/c', `"${shellCommand}"`];
        parsed.command = process.env.comspec || 'cmd.exe';
        parsed.options.windowsVerbatimArguments = true; // Tell node's spawn that the arguments are already escaped
    }

    return parsed;
}

function parse(command, args, options) {
    // Normalize arguments, similar to nodejs
    if (args && !Array.isArray(args)) {
        options = args;
        args = null;
    }

    args = args ? args.slice(0) : []; // Clone array to avoid changing the original
    options = Object.assign({}, options); // Clone object to avoid changing the original

    // Build our parsed object
    const parsed = {
        command,
        args,
        options,
        file: undefined,
        original: {
            command,
            args,
        },
    };

    // Delegate further parsing to shell or non-shell
    return options.shell ? parsed : parseNonShell(parsed);
}

var parse_1 = parse;

const isWin$1 = process.platform === 'win32';

function notFoundError(original, syscall) {
    return Object.assign(new Error(`${syscall} ${original.command} ENOENT`), {
        code: 'ENOENT',
        errno: 'ENOENT',
        syscall: `${syscall} ${original.command}`,
        path: original.command,
        spawnargs: original.args,
    });
}

function hookChildProcess(cp, parsed) {
    if (!isWin$1) {
        return;
    }

    const originalEmit = cp.emit;

    cp.emit = function (name, arg1) {
        // If emitting "exit" event and exit code is 1, we need to check if
        // the command exists and emit an "error" instead
        // See https://github.com/IndigoUnited/node-cross-spawn/issues/16
        if (name === 'exit') {
            const err = verifyENOENT(arg1, parsed);

            if (err) {
                return originalEmit.call(cp, 'error', err);
            }
        }

        return originalEmit.apply(cp, arguments); // eslint-disable-line prefer-rest-params
    };
}

function verifyENOENT(status, parsed) {
    if (isWin$1 && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, 'spawn');
    }

    return null;
}

function verifyENOENTSync(status, parsed) {
    if (isWin$1 && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, 'spawnSync');
    }

    return null;
}

var enoent = {
    hookChildProcess,
    verifyENOENT,
    verifyENOENTSync,
    notFoundError,
};

function spawn$1(command, args, options) {
    // Parse the arguments
    const parsed = parse_1(command, args, options);

    // Spawn the child process
    const spawned = childProcess__default['default'].spawn(parsed.command, parsed.args, parsed.options);

    // Hook into child process "exit" event to emit an error if the command
    // does not exists, see: https://github.com/IndigoUnited/node-cross-spawn/issues/16
    enoent.hookChildProcess(spawned, parsed);

    return spawned;
}

function spawnSync(command, args, options) {
    // Parse the arguments
    const parsed = parse_1(command, args, options);

    // Spawn the child process
    const result = childProcess__default['default'].spawnSync(parsed.command, parsed.args, parsed.options);

    // Analyze if the command does not exist, see: https://github.com/IndigoUnited/node-cross-spawn/issues/16
    result.error = result.error || enoent.verifyENOENTSync(result.status, parsed);

    return result;
}

var crossSpawn = spawn$1;
var spawn_1 = spawn$1;
var sync$3 = spawnSync;

var _parse = parse_1;
var _enoent = enoent;
crossSpawn.spawn = spawn_1;
crossSpawn.sync = sync$3;
crossSpawn._parse = _parse;
crossSpawn._enoent = _enoent;

var stripFinalNewline = input => {
	const LF = typeof input === 'string' ? '\n' : '\n'.charCodeAt();
	const CR = typeof input === 'string' ? '\r' : '\r'.charCodeAt();

	if (input[input.length - 1] === LF) {
		input = input.slice(0, input.length - 1);
	}

	if (input[input.length - 1] === CR) {
		input = input.slice(0, input.length - 1);
	}

	return input;
};

var npmRunPath_1 = createCommonjsModule(function (module) {



const npmRunPath = options => {
	options = {
		cwd: process.cwd(),
		path: process.env[pathKey_1()],
		execPath: process.execPath,
		...options
	};

	let previous;
	let cwdPath = path__default['default'].resolve(options.cwd);
	const result = [];

	while (previous !== cwdPath) {
		result.push(path__default['default'].join(cwdPath, 'node_modules/.bin'));
		previous = cwdPath;
		cwdPath = path__default['default'].resolve(cwdPath, '..');
	}

	// Ensure the running `node` binary is used
	const execPathDir = path__default['default'].resolve(options.cwd, options.execPath, '..');
	result.push(execPathDir);

	return result.concat(options.path).join(path__default['default'].delimiter);
};

module.exports = npmRunPath;
// TODO: Remove this for the next major release
module.exports.default = npmRunPath;

module.exports.env = options => {
	options = {
		env: process.env,
		...options
	};

	const env = {...options.env};
	const path = pathKey_1({env});

	options.path = env[path];
	env[path] = module.exports(options);

	return env;
};
});

const mimicFn = (to, from) => {
	for (const prop of Reflect.ownKeys(from)) {
		Object.defineProperty(to, prop, Object.getOwnPropertyDescriptor(from, prop));
	}

	return to;
};

var mimicFn_1 = mimicFn;
// TODO: Remove this for the next major release
var _default$1 = mimicFn;
mimicFn_1.default = _default$1;

const calledFunctions = new WeakMap();

const onetime = (function_, options = {}) => {
	if (typeof function_ !== 'function') {
		throw new TypeError('Expected a function');
	}

	let returnValue;
	let callCount = 0;
	const functionName = function_.displayName || function_.name || '<anonymous>';

	const onetime = function (...arguments_) {
		calledFunctions.set(onetime, ++callCount);

		if (callCount === 1) {
			returnValue = function_.apply(this, arguments_);
			function_ = null;
		} else if (options.throw === true) {
			throw new Error(`Function \`${functionName}\` can only be called once`);
		}

		return returnValue;
	};

	mimicFn_1(onetime, function_);
	calledFunctions.set(onetime, callCount);

	return onetime;
};

var onetime_1 = onetime;
// TODO: Remove this for the next major release
var _default = onetime;

var callCount = function_ => {
	if (!calledFunctions.has(function_)) {
		throw new Error(`The given function \`${function_.name}\` is not wrapped by the \`onetime\` package`);
	}

	return calledFunctions.get(function_);
};
onetime_1.default = _default;
onetime_1.callCount = callCount;

var core = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:true});exports.SIGNALS=void 0;

const SIGNALS=[
{
name:"SIGHUP",
number:1,
action:"terminate",
description:"Terminal closed",
standard:"posix"},

{
name:"SIGINT",
number:2,
action:"terminate",
description:"User interruption with CTRL-C",
standard:"ansi"},

{
name:"SIGQUIT",
number:3,
action:"core",
description:"User interruption with CTRL-\\",
standard:"posix"},

{
name:"SIGILL",
number:4,
action:"core",
description:"Invalid machine instruction",
standard:"ansi"},

{
name:"SIGTRAP",
number:5,
action:"core",
description:"Debugger breakpoint",
standard:"posix"},

{
name:"SIGABRT",
number:6,
action:"core",
description:"Aborted",
standard:"ansi"},

{
name:"SIGIOT",
number:6,
action:"core",
description:"Aborted",
standard:"bsd"},

{
name:"SIGBUS",
number:7,
action:"core",
description:
"Bus error due to misaligned, non-existing address or paging error",
standard:"bsd"},

{
name:"SIGEMT",
number:7,
action:"terminate",
description:"Command should be emulated but is not implemented",
standard:"other"},

{
name:"SIGFPE",
number:8,
action:"core",
description:"Floating point arithmetic error",
standard:"ansi"},

{
name:"SIGKILL",
number:9,
action:"terminate",
description:"Forced termination",
standard:"posix",
forced:true},

{
name:"SIGUSR1",
number:10,
action:"terminate",
description:"Application-specific signal",
standard:"posix"},

{
name:"SIGSEGV",
number:11,
action:"core",
description:"Segmentation fault",
standard:"ansi"},

{
name:"SIGUSR2",
number:12,
action:"terminate",
description:"Application-specific signal",
standard:"posix"},

{
name:"SIGPIPE",
number:13,
action:"terminate",
description:"Broken pipe or socket",
standard:"posix"},

{
name:"SIGALRM",
number:14,
action:"terminate",
description:"Timeout or timer",
standard:"posix"},

{
name:"SIGTERM",
number:15,
action:"terminate",
description:"Termination",
standard:"ansi"},

{
name:"SIGSTKFLT",
number:16,
action:"terminate",
description:"Stack is empty or overflowed",
standard:"other"},

{
name:"SIGCHLD",
number:17,
action:"ignore",
description:"Child process terminated, paused or unpaused",
standard:"posix"},

{
name:"SIGCLD",
number:17,
action:"ignore",
description:"Child process terminated, paused or unpaused",
standard:"other"},

{
name:"SIGCONT",
number:18,
action:"unpause",
description:"Unpaused",
standard:"posix",
forced:true},

{
name:"SIGSTOP",
number:19,
action:"pause",
description:"Paused",
standard:"posix",
forced:true},

{
name:"SIGTSTP",
number:20,
action:"pause",
description:"Paused using CTRL-Z or \"suspend\"",
standard:"posix"},

{
name:"SIGTTIN",
number:21,
action:"pause",
description:"Background process cannot read terminal input",
standard:"posix"},

{
name:"SIGBREAK",
number:21,
action:"terminate",
description:"User interruption with CTRL-BREAK",
standard:"other"},

{
name:"SIGTTOU",
number:22,
action:"pause",
description:"Background process cannot write to terminal output",
standard:"posix"},

{
name:"SIGURG",
number:23,
action:"ignore",
description:"Socket received out-of-band data",
standard:"bsd"},

{
name:"SIGXCPU",
number:24,
action:"core",
description:"Process timed out",
standard:"bsd"},

{
name:"SIGXFSZ",
number:25,
action:"core",
description:"File too big",
standard:"bsd"},

{
name:"SIGVTALRM",
number:26,
action:"terminate",
description:"Timeout or timer",
standard:"bsd"},

{
name:"SIGPROF",
number:27,
action:"terminate",
description:"Timeout or timer",
standard:"bsd"},

{
name:"SIGWINCH",
number:28,
action:"ignore",
description:"Terminal window size changed",
standard:"bsd"},

{
name:"SIGIO",
number:29,
action:"terminate",
description:"I/O is available",
standard:"other"},

{
name:"SIGPOLL",
number:29,
action:"terminate",
description:"Watched event",
standard:"other"},

{
name:"SIGINFO",
number:29,
action:"ignore",
description:"Request for process information",
standard:"other"},

{
name:"SIGPWR",
number:30,
action:"terminate",
description:"Device running out of power",
standard:"systemv"},

{
name:"SIGSYS",
number:31,
action:"core",
description:"Invalid system call",
standard:"other"},

{
name:"SIGUNUSED",
number:31,
action:"terminate",
description:"Invalid system call",
standard:"other"}];exports.SIGNALS=SIGNALS;

});

var realtime = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:true});exports.SIGRTMAX=exports.getRealtimeSignals=void 0;
const getRealtimeSignals=function(){
const length=SIGRTMAX-SIGRTMIN+1;
return Array.from({length},getRealtimeSignal);
};exports.getRealtimeSignals=getRealtimeSignals;

const getRealtimeSignal=function(value,index){
return {
name:`SIGRT${index+1}`,
number:SIGRTMIN+index,
action:"terminate",
description:"Application-specific signal (realtime)",
standard:"posix"};

};

const SIGRTMIN=34;
const SIGRTMAX=64;exports.SIGRTMAX=SIGRTMAX;

});

var signals$2 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:true});exports.getSignals=void 0;






const getSignals=function(){
const realtimeSignals=(0, realtime.getRealtimeSignals)();
const signals=[...core.SIGNALS,...realtimeSignals].map(normalizeSignal);
return signals;
};exports.getSignals=getSignals;







const normalizeSignal=function({
name,
number:defaultNumber,
description,
action,
forced=false,
standard})
{
const{
signals:{[name]:constantSignal}}=
os__default['default'].constants;
const supported=constantSignal!==undefined;
const number=supported?constantSignal:defaultNumber;
return {name,number,description,supported,action,forced,standard};
};

});

var main$1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:true});exports.signalsByNumber=exports.signalsByName=void 0;






const getSignalsByName=function(){
const signals=(0, signals$2.getSignals)();
return signals.reduce(getSignalByName,{});
};

const getSignalByName=function(
signalByNameMemo,
{name,number,description,supported,action,forced,standard})
{
return {
...signalByNameMemo,
[name]:{name,number,description,supported,action,forced,standard}};

};

const signalsByName=getSignalsByName();exports.signalsByName=signalsByName;




const getSignalsByNumber=function(){
const signals=(0, signals$2.getSignals)();
const length=realtime.SIGRTMAX+1;
const signalsA=Array.from({length},(value,number)=>
getSignalByNumber(number,signals));

return Object.assign({},...signalsA);
};

const getSignalByNumber=function(number,signals){
const signal=findSignalByNumber(number,signals);

if(signal===undefined){
return {};
}

const{name,description,supported,action,forced,standard}=signal;
return {
[number]:{
name,
number,
description,
supported,
action,
forced,
standard}};


};



const findSignalByNumber=function(number,signals){
const signal=signals.find(({name})=>os__default['default'].constants.signals[name]===number);

if(signal!==undefined){
return signal;
}

return signals.find(signalA=>signalA.number===number);
};

const signalsByNumber=getSignalsByNumber();exports.signalsByNumber=signalsByNumber;

});

const {signalsByName} = main$1;

const getErrorPrefix = ({timedOut, timeout, errorCode, signal, signalDescription, exitCode, isCanceled}) => {
	if (timedOut) {
		return `timed out after ${timeout} milliseconds`;
	}

	if (isCanceled) {
		return 'was canceled';
	}

	if (errorCode !== undefined) {
		return `failed with ${errorCode}`;
	}

	if (signal !== undefined) {
		return `was killed with ${signal} (${signalDescription})`;
	}

	if (exitCode !== undefined) {
		return `failed with exit code ${exitCode}`;
	}

	return 'failed';
};

const makeError = ({
	stdout,
	stderr,
	all,
	error,
	signal,
	exitCode,
	command,
	escapedCommand,
	timedOut,
	isCanceled,
	killed,
	parsed: {options: {timeout}}
}) => {
	// `signal` and `exitCode` emitted on `spawned.on('exit')` event can be `null`.
	// We normalize them to `undefined`
	exitCode = exitCode === null ? undefined : exitCode;
	signal = signal === null ? undefined : signal;
	const signalDescription = signal === undefined ? undefined : signalsByName[signal].description;

	const errorCode = error && error.code;

	const prefix = getErrorPrefix({timedOut, timeout, errorCode, signal, signalDescription, exitCode, isCanceled});
	const execaMessage = `Command ${prefix}: ${command}`;
	const isError = Object.prototype.toString.call(error) === '[object Error]';
	const shortMessage = isError ? `${execaMessage}\n${error.message}` : execaMessage;
	const message = [shortMessage, stderr, stdout].filter(Boolean).join('\n');

	if (isError) {
		error.originalMessage = error.message;
		error.message = message;
	} else {
		error = new Error(message);
	}

	error.shortMessage = shortMessage;
	error.command = command;
	error.escapedCommand = escapedCommand;
	error.exitCode = exitCode;
	error.signal = signal;
	error.signalDescription = signalDescription;
	error.stdout = stdout;
	error.stderr = stderr;

	if (all !== undefined) {
		error.all = all;
	}

	if ('bufferedData' in error) {
		delete error.bufferedData;
	}

	error.failed = true;
	error.timedOut = Boolean(timedOut);
	error.isCanceled = isCanceled;
	error.killed = killed && !timedOut;

	return error;
};

var error = makeError;

const aliases = ['stdin', 'stdout', 'stderr'];

const hasAlias = options => aliases.some(alias => options[alias] !== undefined);

const normalizeStdio = options => {
	if (!options) {
		return;
	}

	const {stdio} = options;

	if (stdio === undefined) {
		return aliases.map(alias => options[alias]);
	}

	if (hasAlias(options)) {
		throw new Error(`It's not possible to provide \`stdio\` in combination with one of ${aliases.map(alias => `\`${alias}\``).join(', ')}`);
	}

	if (typeof stdio === 'string') {
		return stdio;
	}

	if (!Array.isArray(stdio)) {
		throw new TypeError(`Expected \`stdio\` to be of type \`string\` or \`Array\`, got \`${typeof stdio}\``);
	}

	const length = Math.max(stdio.length, aliases.length);
	return Array.from({length}, (value, index) => stdio[index]);
};

var stdio = normalizeStdio;

// `ipc` is pushed unless it is already present
var node$1 = options => {
	const stdio = normalizeStdio(options);

	if (stdio === 'ipc') {
		return 'ipc';
	}

	if (stdio === undefined || typeof stdio === 'string') {
		return [stdio, stdio, stdio, 'ipc'];
	}

	if (stdio.includes('ipc')) {
		return stdio;
	}

	return [...stdio, 'ipc'];
};
stdio.node = node$1;

var signals$1 = createCommonjsModule(function (module) {
// This is not the set of all possible signals.
//
// It IS, however, the set of all signals that trigger
// an exit on either Linux or BSD systems.  Linux is a
// superset of the signal names supported on BSD, and
// the unknown signals just fail to register, so we can
// catch that easily enough.
//
// Don't bother with SIGKILL.  It's uncatchable, which
// means that we can't fire any callbacks anyway.
//
// If a user does happen to register a handler on a non-
// fatal signal like SIGWINCH or something, and then
// exit, it'll end up firing `process.emit('exit')`, so
// the handler will be fired anyway.
//
// SIGBUS, SIGFPE, SIGSEGV and SIGILL, when not raised
// artificially, inherently leave the process in a
// state from which it is not safe to try and enter JS
// listeners.
module.exports = [
  'SIGABRT',
  'SIGALRM',
  'SIGHUP',
  'SIGINT',
  'SIGTERM'
];

if (process.platform !== 'win32') {
  module.exports.push(
    'SIGVTALRM',
    'SIGXCPU',
    'SIGXFSZ',
    'SIGUSR2',
    'SIGTRAP',
    'SIGSYS',
    'SIGQUIT',
    'SIGIOT'
    // should detect profiler and enable/disable accordingly.
    // see #21
    // 'SIGPROF'
  );
}

if (process.platform === 'linux') {
  module.exports.push(
    'SIGIO',
    'SIGPOLL',
    'SIGPWR',
    'SIGSTKFLT',
    'SIGUNUSED'
  );
}
});

// Note: since nyc uses this module to output coverage, any lines
// that are in the direct sync flow of nyc's outputCoverage are
// ignored, since we can never get coverage for them.

var signals = signals$1;
var isWin = /^win/i.test(process.platform);

var EE = require$$0__default['default'];
/* istanbul ignore if */
if (typeof EE !== 'function') {
  EE = EE.EventEmitter;
}

var emitter;
if (process.__signal_exit_emitter__) {
  emitter = process.__signal_exit_emitter__;
} else {
  emitter = process.__signal_exit_emitter__ = new EE();
  emitter.count = 0;
  emitter.emitted = {};
}

// Because this emitter is a global, we have to check to see if a
// previous version of this library failed to enable infinite listeners.
// I know what you're about to say.  But literally everything about
// signal-exit is a compromise with evil.  Get used to it.
if (!emitter.infinite) {
  emitter.setMaxListeners(Infinity);
  emitter.infinite = true;
}

var signalExit = function (cb, opts) {
  assert__default['default'].equal(typeof cb, 'function', 'a callback must be provided for exit handler');

  if (loaded === false) {
    load();
  }

  var ev = 'exit';
  if (opts && opts.alwaysLast) {
    ev = 'afterexit';
  }

  var remove = function () {
    emitter.removeListener(ev, cb);
    if (emitter.listeners('exit').length === 0 &&
        emitter.listeners('afterexit').length === 0) {
      unload();
    }
  };
  emitter.on(ev, cb);

  return remove
};

var unload_1 = unload;
function unload () {
  if (!loaded) {
    return
  }
  loaded = false;

  signals.forEach(function (sig) {
    try {
      process.removeListener(sig, sigListeners[sig]);
    } catch (er) {}
  });
  process.emit = originalProcessEmit;
  process.reallyExit = originalProcessReallyExit;
  emitter.count -= 1;
}

function emit (event, code, signal) {
  if (emitter.emitted[event]) {
    return
  }
  emitter.emitted[event] = true;
  emitter.emit(event, code, signal);
}

// { <signal>: <listener fn>, ... }
var sigListeners = {};
signals.forEach(function (sig) {
  sigListeners[sig] = function listener () {
    // If there are no other listeners, an exit is coming!
    // Simplest way: remove us and then re-send the signal.
    // We know that this will kill the process, so we can
    // safely emit now.
    var listeners = process.listeners(sig);
    if (listeners.length === emitter.count) {
      unload();
      emit('exit', null, sig);
      /* istanbul ignore next */
      emit('afterexit', null, sig);
      /* istanbul ignore next */
      if (isWin && sig === 'SIGHUP') {
        // "SIGHUP" throws an `ENOSYS` error on Windows,
        // so use a supported signal instead
        sig = 'SIGINT';
      }
      process.kill(process.pid, sig);
    }
  };
});

var signals_1 = function () {
  return signals
};

var load_1 = load;

var loaded = false;

function load () {
  if (loaded) {
    return
  }
  loaded = true;

  // This is the number of onSignalExit's that are in play.
  // It's important so that we can count the correct number of
  // listeners on signals, and don't wait for the other one to
  // handle it instead of us.
  emitter.count += 1;

  signals = signals.filter(function (sig) {
    try {
      process.on(sig, sigListeners[sig]);
      return true
    } catch (er) {
      return false
    }
  });

  process.emit = processEmit;
  process.reallyExit = processReallyExit;
}

var originalProcessReallyExit = process.reallyExit;
function processReallyExit (code) {
  process.exitCode = code || 0;
  emit('exit', process.exitCode, null);
  /* istanbul ignore next */
  emit('afterexit', process.exitCode, null);
  /* istanbul ignore next */
  originalProcessReallyExit.call(process, process.exitCode);
}

var originalProcessEmit = process.emit;
function processEmit (ev, arg) {
  if (ev === 'exit') {
    if (arg !== undefined) {
      process.exitCode = arg;
    }
    var ret = originalProcessEmit.apply(this, arguments);
    emit('exit', process.exitCode, null);
    /* istanbul ignore next */
    emit('afterexit', process.exitCode, null);
    return ret
  } else {
    return originalProcessEmit.apply(this, arguments)
  }
}
signalExit.unload = unload_1;
signalExit.signals = signals_1;
signalExit.load = load_1;

const DEFAULT_FORCE_KILL_TIMEOUT = 1000 * 5;

// Monkey-patches `childProcess.kill()` to add `forceKillAfterTimeout` behavior
const spawnedKill$1 = (kill, signal = 'SIGTERM', options = {}) => {
	const killResult = kill(signal);
	setKillTimeout(kill, signal, options, killResult);
	return killResult;
};

const setKillTimeout = (kill, signal, options, killResult) => {
	if (!shouldForceKill(signal, options, killResult)) {
		return;
	}

	const timeout = getForceKillAfterTimeout(options);
	const t = setTimeout(() => {
		kill('SIGKILL');
	}, timeout);

	// Guarded because there's no `.unref()` when `execa` is used in the renderer
	// process in Electron. This cannot be tested since we don't run tests in
	// Electron.
	// istanbul ignore else
	if (t.unref) {
		t.unref();
	}
};

const shouldForceKill = (signal, {forceKillAfterTimeout}, killResult) => {
	return isSigterm(signal) && forceKillAfterTimeout !== false && killResult;
};

const isSigterm = signal => {
	return signal === os__default['default'].constants.signals.SIGTERM ||
		(typeof signal === 'string' && signal.toUpperCase() === 'SIGTERM');
};

const getForceKillAfterTimeout = ({forceKillAfterTimeout = true}) => {
	if (forceKillAfterTimeout === true) {
		return DEFAULT_FORCE_KILL_TIMEOUT;
	}

	if (!Number.isFinite(forceKillAfterTimeout) || forceKillAfterTimeout < 0) {
		throw new TypeError(`Expected the \`forceKillAfterTimeout\` option to be a non-negative integer, got \`${forceKillAfterTimeout}\` (${typeof forceKillAfterTimeout})`);
	}

	return forceKillAfterTimeout;
};

// `childProcess.cancel()`
const spawnedCancel$1 = (spawned, context) => {
	const killResult = spawned.kill();

	if (killResult) {
		context.isCanceled = true;
	}
};

const timeoutKill = (spawned, signal, reject) => {
	spawned.kill(signal);
	reject(Object.assign(new Error('Timed out'), {timedOut: true, signal}));
};

// `timeout` option handling
const setupTimeout$1 = (spawned, {timeout, killSignal = 'SIGTERM'}, spawnedPromise) => {
	if (timeout === 0 || timeout === undefined) {
		return spawnedPromise;
	}

	let timeoutId;
	const timeoutPromise = new Promise((resolve, reject) => {
		timeoutId = setTimeout(() => {
			timeoutKill(spawned, killSignal, reject);
		}, timeout);
	});

	const safeSpawnedPromise = spawnedPromise.finally(() => {
		clearTimeout(timeoutId);
	});

	return Promise.race([timeoutPromise, safeSpawnedPromise]);
};

const validateTimeout$1 = ({timeout}) => {
	if (timeout !== undefined && (!Number.isFinite(timeout) || timeout < 0)) {
		throw new TypeError(`Expected the \`timeout\` option to be a non-negative integer, got \`${timeout}\` (${typeof timeout})`);
	}
};

// `cleanup` option handling
const setExitHandler$1 = async (spawned, {cleanup, detached}, timedPromise) => {
	if (!cleanup || detached) {
		return timedPromise;
	}

	const removeExitHandler = signalExit(() => {
		spawned.kill();
	});

	return timedPromise.finally(() => {
		removeExitHandler();
	});
};

var kill = {
	spawnedKill: spawnedKill$1,
	spawnedCancel: spawnedCancel$1,
	setupTimeout: setupTimeout$1,
	validateTimeout: validateTimeout$1,
	setExitHandler: setExitHandler$1
};

const isStream = stream =>
	stream !== null &&
	typeof stream === 'object' &&
	typeof stream.pipe === 'function';

isStream.writable = stream =>
	isStream(stream) &&
	stream.writable !== false &&
	typeof stream._write === 'function' &&
	typeof stream._writableState === 'object';

isStream.readable = stream =>
	isStream(stream) &&
	stream.readable !== false &&
	typeof stream._read === 'function' &&
	typeof stream._readableState === 'object';

isStream.duplex = stream =>
	isStream.writable(stream) &&
	isStream.readable(stream);

isStream.transform = stream =>
	isStream.duplex(stream) &&
	typeof stream._transform === 'function';

var isStream_1 = isStream;

const {PassThrough: PassThroughStream} = Stream__default['default'];

var bufferStream = options => {
	options = {...options};

	const {array} = options;
	let {encoding} = options;
	const isBuffer = encoding === 'buffer';
	let objectMode = false;

	if (array) {
		objectMode = !(encoding || isBuffer);
	} else {
		encoding = encoding || 'utf8';
	}

	if (isBuffer) {
		encoding = null;
	}

	const stream = new PassThroughStream({objectMode});

	if (encoding) {
		stream.setEncoding(encoding);
	}

	let length = 0;
	const chunks = [];

	stream.on('data', chunk => {
		chunks.push(chunk);

		if (objectMode) {
			length = chunks.length;
		} else {
			length += chunk.length;
		}
	});

	stream.getBufferedValue = () => {
		if (array) {
			return chunks;
		}

		return isBuffer ? Buffer.concat(chunks, length) : chunks.join('');
	};

	stream.getBufferedLength = () => length;

	return stream;
};

const {constants: BufferConstants} = require$$0__default$1['default'];

const {promisify: promisify$1} = util__default['default'];


const streamPipelinePromisified = promisify$1(Stream__default['default'].pipeline);

class MaxBufferError extends Error {
	constructor() {
		super('maxBuffer exceeded');
		this.name = 'MaxBufferError';
	}
}

async function getStream(inputStream, options) {
	if (!inputStream) {
		throw new Error('Expected a stream');
	}

	options = {
		maxBuffer: Infinity,
		...options
	};

	const {maxBuffer} = options;
	const stream = bufferStream(options);

	await new Promise((resolve, reject) => {
		const rejectPromise = error => {
			// Don't retrieve an oversized buffer.
			if (error && stream.getBufferedLength() <= BufferConstants.MAX_LENGTH) {
				error.bufferedData = stream.getBufferedValue();
			}

			reject(error);
		};

		(async () => {
			try {
				await streamPipelinePromisified(inputStream, stream);
				resolve();
			} catch (error) {
				rejectPromise(error);
			}
		})();

		stream.on('data', () => {
			if (stream.getBufferedLength() > maxBuffer) {
				rejectPromise(new MaxBufferError());
			}
		});
	});

	return stream.getBufferedValue();
}

var getStream_1 = getStream;
var buffer = (stream, options) => getStream(stream, {...options, encoding: 'buffer'});
var array = (stream, options) => getStream(stream, {...options, array: true});
var MaxBufferError_1 = MaxBufferError;
getStream_1.buffer = buffer;
getStream_1.array = array;
getStream_1.MaxBufferError = MaxBufferError_1;

const { PassThrough: PassThrough$2 } = Stream__default['default'];

var mergeStream = function (/*streams...*/) {
  var sources = [];
  var output  = new PassThrough$2({objectMode: true});

  output.setMaxListeners(0);

  output.add = add;
  output.isEmpty = isEmpty;

  output.on('unpipe', remove);

  Array.prototype.slice.call(arguments).forEach(add);

  return output

  function add (source) {
    if (Array.isArray(source)) {
      source.forEach(add);
      return this
    }

    sources.push(source);
    source.once('end', remove.bind(null, source));
    source.once('error', output.emit.bind(output, 'error'));
    source.pipe(output, {end: false});
    return this
  }

  function isEmpty () {
    return sources.length == 0;
  }

  function remove (source) {
    sources = sources.filter(function (it) { return it !== source });
    if (!sources.length && output.readable) { output.end(); }
  }
};

// `input` option
const handleInput$1 = (spawned, input) => {
	// Checking for stdin is workaround for https://github.com/nodejs/node/issues/26852
	// @todo remove `|| spawned.stdin === undefined` once we drop support for Node.js <=12.2.0
	if (input === undefined || spawned.stdin === undefined) {
		return;
	}

	if (isStream_1(input)) {
		input.pipe(spawned.stdin);
	} else {
		spawned.stdin.end(input);
	}
};

// `all` interleaves `stdout` and `stderr`
const makeAllStream$1 = (spawned, {all}) => {
	if (!all || (!spawned.stdout && !spawned.stderr)) {
		return;
	}

	const mixed = mergeStream();

	if (spawned.stdout) {
		mixed.add(spawned.stdout);
	}

	if (spawned.stderr) {
		mixed.add(spawned.stderr);
	}

	return mixed;
};

// On failure, `result.stdout|stderr|all` should contain the currently buffered stream
const getBufferedData = async (stream, streamPromise) => {
	if (!stream) {
		return;
	}

	stream.destroy();

	try {
		return await streamPromise;
	} catch (error) {
		return error.bufferedData;
	}
};

const getStreamPromise = (stream, {encoding, buffer, maxBuffer}) => {
	if (!stream || !buffer) {
		return;
	}

	if (encoding) {
		return getStream_1(stream, {encoding, maxBuffer});
	}

	return getStream_1.buffer(stream, {maxBuffer});
};

// Retrieve result of child process: exit code, signal, error, streams (stdout/stderr/all)
const getSpawnedResult$1 = async ({stdout, stderr, all}, {encoding, buffer, maxBuffer}, processDone) => {
	const stdoutPromise = getStreamPromise(stdout, {encoding, buffer, maxBuffer});
	const stderrPromise = getStreamPromise(stderr, {encoding, buffer, maxBuffer});
	const allPromise = getStreamPromise(all, {encoding, buffer, maxBuffer: maxBuffer * 2});

	try {
		return await Promise.all([processDone, stdoutPromise, stderrPromise, allPromise]);
	} catch (error) {
		return Promise.all([
			{error, signal: error.signal, timedOut: error.timedOut},
			getBufferedData(stdout, stdoutPromise),
			getBufferedData(stderr, stderrPromise),
			getBufferedData(all, allPromise)
		]);
	}
};

const validateInputSync$1 = ({input}) => {
	if (isStream_1(input)) {
		throw new TypeError('The `input` option cannot be a stream in sync mode');
	}
};

var stream = {
	handleInput: handleInput$1,
	makeAllStream: makeAllStream$1,
	getSpawnedResult: getSpawnedResult$1,
	validateInputSync: validateInputSync$1
};

const nativePromisePrototype = (async () => {})().constructor.prototype;
const descriptors = ['then', 'catch', 'finally'].map(property => [
	property,
	Reflect.getOwnPropertyDescriptor(nativePromisePrototype, property)
]);

// The return value is a mixin of `childProcess` and `Promise`
const mergePromise$1 = (spawned, promise) => {
	for (const [property, descriptor] of descriptors) {
		// Starting the main `promise` is deferred to avoid consuming streams
		const value = typeof promise === 'function' ?
			(...args) => Reflect.apply(descriptor.value, promise(), args) :
			descriptor.value.bind(promise);

		Reflect.defineProperty(spawned, property, {...descriptor, value});
	}

	return spawned;
};

// Use promises instead of `child_process` events
const getSpawnedPromise$1 = spawned => {
	return new Promise((resolve, reject) => {
		spawned.on('exit', (exitCode, signal) => {
			resolve({exitCode, signal});
		});

		spawned.on('error', error => {
			reject(error);
		});

		if (spawned.stdin) {
			spawned.stdin.on('error', error => {
				reject(error);
			});
		}
	});
};

var promise = {
	mergePromise: mergePromise$1,
	getSpawnedPromise: getSpawnedPromise$1
};

const normalizeArgs = (file, args = []) => {
	if (!Array.isArray(args)) {
		return [file];
	}

	return [file, ...args];
};

const NO_ESCAPE_REGEXP = /^[\w.-]+$/;
const DOUBLE_QUOTES_REGEXP = /"/g;

const escapeArg = arg => {
	if (typeof arg !== 'string' || NO_ESCAPE_REGEXP.test(arg)) {
		return arg;
	}

	return `"${arg.replace(DOUBLE_QUOTES_REGEXP, '\\"')}"`;
};

const joinCommand$1 = (file, args) => {
	return normalizeArgs(file, args).join(' ');
};

const getEscapedCommand$1 = (file, args) => {
	return normalizeArgs(file, args).map(arg => escapeArg(arg)).join(' ');
};

const SPACES_REGEXP = / +/g;

// Handle `execa.command()`
const parseCommand$1 = command => {
	const tokens = [];
	for (const token of command.trim().split(SPACES_REGEXP)) {
		// Allow spaces to be escaped by a backslash if not meant as a delimiter
		const previousToken = tokens[tokens.length - 1];
		if (previousToken && previousToken.endsWith('\\')) {
			// Merge previous token with current one
			tokens[tokens.length - 1] = `${previousToken.slice(0, -1)} ${token}`;
		} else {
			tokens.push(token);
		}
	}

	return tokens;
};

var command$1 = {
	joinCommand: joinCommand$1,
	getEscapedCommand: getEscapedCommand$1,
	parseCommand: parseCommand$1
};

const {spawnedKill, spawnedCancel, setupTimeout, validateTimeout, setExitHandler} = kill;
const {handleInput, getSpawnedResult, makeAllStream, validateInputSync} = stream;
const {mergePromise, getSpawnedPromise} = promise;
const {joinCommand, parseCommand, getEscapedCommand} = command$1;

const DEFAULT_MAX_BUFFER = 1000 * 1000 * 100;

const getEnv = ({env: envOption, extendEnv, preferLocal, localDir, execPath}) => {
	const env = extendEnv ? {...process.env, ...envOption} : envOption;

	if (preferLocal) {
		return npmRunPath_1.env({env, cwd: localDir, execPath});
	}

	return env;
};

const handleArguments = (file, args, options = {}) => {
	const parsed = crossSpawn._parse(file, args, options);
	file = parsed.command;
	args = parsed.args;
	options = parsed.options;

	options = {
		maxBuffer: DEFAULT_MAX_BUFFER,
		buffer: true,
		stripFinalNewline: true,
		extendEnv: true,
		preferLocal: false,
		localDir: options.cwd || process.cwd(),
		execPath: process.execPath,
		encoding: 'utf8',
		reject: true,
		cleanup: true,
		all: false,
		windowsHide: true,
		...options
	};

	options.env = getEnv(options);

	options.stdio = stdio(options);

	if (process.platform === 'win32' && path__default['default'].basename(file, '.exe') === 'cmd') {
		// #116
		args.unshift('/q');
	}

	return {file, args, options, parsed};
};

const handleOutput = (options, value, error) => {
	if (typeof value !== 'string' && !Buffer.isBuffer(value)) {
		// When `execa.sync()` errors, we normalize it to '' to mimic `execa()`
		return error === undefined ? undefined : '';
	}

	if (options.stripFinalNewline) {
		return stripFinalNewline(value);
	}

	return value;
};

const execa = (file, args, options) => {
	const parsed = handleArguments(file, args, options);
	const command = joinCommand(file, args);
	const escapedCommand = getEscapedCommand(file, args);

	validateTimeout(parsed.options);

	let spawned;
	try {
		spawned = childProcess__default['default'].spawn(parsed.file, parsed.args, parsed.options);
	} catch (error$1) {
		// Ensure the returned error is always both a promise and a child process
		const dummySpawned = new childProcess__default['default'].ChildProcess();
		const errorPromise = Promise.reject(error({
			error: error$1,
			stdout: '',
			stderr: '',
			all: '',
			command,
			escapedCommand,
			parsed,
			timedOut: false,
			isCanceled: false,
			killed: false
		}));
		return mergePromise(dummySpawned, errorPromise);
	}

	const spawnedPromise = getSpawnedPromise(spawned);
	const timedPromise = setupTimeout(spawned, parsed.options, spawnedPromise);
	const processDone = setExitHandler(spawned, parsed.options, timedPromise);

	const context = {isCanceled: false};

	spawned.kill = spawnedKill.bind(null, spawned.kill.bind(spawned));
	spawned.cancel = spawnedCancel.bind(null, spawned, context);

	const handlePromise = async () => {
		const [{error: error$1, exitCode, signal, timedOut}, stdoutResult, stderrResult, allResult] = await getSpawnedResult(spawned, parsed.options, processDone);
		const stdout = handleOutput(parsed.options, stdoutResult);
		const stderr = handleOutput(parsed.options, stderrResult);
		const all = handleOutput(parsed.options, allResult);

		if (error$1 || exitCode !== 0 || signal !== null) {
			const returnedError = error({
				error: error$1,
				exitCode,
				signal,
				stdout,
				stderr,
				all,
				command,
				escapedCommand,
				parsed,
				timedOut,
				isCanceled: context.isCanceled,
				killed: spawned.killed
			});

			if (!parsed.options.reject) {
				return returnedError;
			}

			throw returnedError;
		}

		return {
			command,
			escapedCommand,
			exitCode: 0,
			stdout,
			stderr,
			all,
			failed: false,
			timedOut: false,
			isCanceled: false,
			killed: false
		};
	};

	const handlePromiseOnce = onetime_1(handlePromise);

	handleInput(spawned, parsed.options.input);

	spawned.all = makeAllStream(spawned, parsed.options);

	return mergePromise(spawned, handlePromiseOnce);
};

var execa_1 = execa;

var sync$2 = (file, args, options) => {
	const parsed = handleArguments(file, args, options);
	const command = joinCommand(file, args);
	const escapedCommand = getEscapedCommand(file, args);

	validateInputSync(parsed.options);

	let result;
	try {
		result = childProcess__default['default'].spawnSync(parsed.file, parsed.args, parsed.options);
	} catch (error$1) {
		throw error({
			error: error$1,
			stdout: '',
			stderr: '',
			all: '',
			command,
			escapedCommand,
			parsed,
			timedOut: false,
			isCanceled: false,
			killed: false
		});
	}

	const stdout = handleOutput(parsed.options, result.stdout, result.error);
	const stderr = handleOutput(parsed.options, result.stderr, result.error);

	if (result.error || result.status !== 0 || result.signal !== null) {
		const error$1 = error({
			stdout,
			stderr,
			error: result.error,
			signal: result.signal,
			exitCode: result.status,
			command,
			escapedCommand,
			parsed,
			timedOut: result.error && result.error.code === 'ETIMEDOUT',
			isCanceled: false,
			killed: result.signal !== null
		});

		if (!parsed.options.reject) {
			return error$1;
		}

		throw error$1;
	}

	return {
		command,
		escapedCommand,
		exitCode: 0,
		stdout,
		stderr,
		failed: false,
		timedOut: false,
		isCanceled: false,
		killed: false
	};
};

var command = (command, options) => {
	const [file, ...args] = parseCommand(command);
	return execa(file, args, options);
};

var commandSync = (command, options) => {
	const [file, ...args] = parseCommand(command);
	return execa.sync(file, args, options);
};

var node = (scriptPath, args, options = {}) => {
	if (args && !Array.isArray(args) && typeof args === 'object') {
		options = args;
		args = [];
	}

	const stdio$1 = stdio.node(options);
	const defaultExecArgv = process.execArgv.filter(arg => !arg.startsWith('--inspect'));

	const {
		nodePath = process.execPath,
		nodeOptions = defaultExecArgv
	} = options;

	return execa(
		nodePath,
		[
			...nodeOptions,
			scriptPath,
			...(Array.isArray(args) ? args : [])
		],
		{
			...options,
			stdin: undefined,
			stdout: undefined,
			stderr: undefined,
			stdio: stdio$1,
			shell: false
		}
	);
};
execa_1.sync = sync$2;
execa_1.command = command;
execa_1.commandSync = commandSync;
execa_1.node = node;

var fsExistsCached = exists;
exists.sync = sync$1;

var existsCache = Object.create(null);

function exists (file, cb) {
  if (file in existsCache)
    return process.nextTick(cb.bind(null, existsCache[file]))
  fs__default['default'].lstat(file, function (er) {
    cb(existsCache[file] = !er);
  });
}

function sync$1 (file) {
  if (file in existsCache)
    return existsCache[file]
  try {
    fs__default['default'].lstatSync(file);
    existsCache[file] = true;
  } catch (er) {
    existsCache[file] = false;
  }
  return existsCache[file]
}

var fromCallback = function (fn) {
  return Object.defineProperty(function (...args) {
    if (typeof args[args.length - 1] === 'function') fn.apply(this, args);
    else {
      return new Promise((resolve, reject) => {
        fn.call(
          this,
          ...args,
          (err, res) => (err != null) ? reject(err) : resolve(res)
        );
      })
    }
  }, 'name', { value: fn.name })
};

var fromPromise = function (fn) {
  return Object.defineProperty(function (...args) {
    const cb = args[args.length - 1];
    if (typeof cb !== 'function') return fn.apply(this, args)
    else fn.apply(this, args.slice(0, -1)).then(r => cb(null, r), cb);
  }, 'name', { value: fn.name })
};

var universalify = {
	fromCallback: fromCallback,
	fromPromise: fromPromise
};

var origCwd = process.cwd;
var cwd = null;

var platform = process.env.GRACEFUL_FS_PLATFORM || process.platform;

process.cwd = function() {
  if (!cwd)
    cwd = origCwd.call(process);
  return cwd
};
try {
  process.cwd();
} catch (er) {}

// This check is needed until node.js 12 is required
if (typeof process.chdir === 'function') {
  var chdir = process.chdir;
  process.chdir = function (d) {
    cwd = null;
    chdir.call(process, d);
  };
  if (Object.setPrototypeOf) Object.setPrototypeOf(process.chdir, chdir);
}

var polyfills = patch;

function patch (fs) {
  // (re-)implement some things that are known busted or missing.

  // lchmod, broken prior to 0.6.2
  // back-port the fix here.
  if (constants__default['default'].hasOwnProperty('O_SYMLINK') &&
      process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)) {
    patchLchmod(fs);
  }

  // lutimes implementation, or no-op
  if (!fs.lutimes) {
    patchLutimes(fs);
  }

  // https://github.com/isaacs/node-graceful-fs/issues/4
  // Chown should not fail on einval or eperm if non-root.
  // It should not fail on enosys ever, as this just indicates
  // that a fs doesn't support the intended operation.

  fs.chown = chownFix(fs.chown);
  fs.fchown = chownFix(fs.fchown);
  fs.lchown = chownFix(fs.lchown);

  fs.chmod = chmodFix(fs.chmod);
  fs.fchmod = chmodFix(fs.fchmod);
  fs.lchmod = chmodFix(fs.lchmod);

  fs.chownSync = chownFixSync(fs.chownSync);
  fs.fchownSync = chownFixSync(fs.fchownSync);
  fs.lchownSync = chownFixSync(fs.lchownSync);

  fs.chmodSync = chmodFixSync(fs.chmodSync);
  fs.fchmodSync = chmodFixSync(fs.fchmodSync);
  fs.lchmodSync = chmodFixSync(fs.lchmodSync);

  fs.stat = statFix(fs.stat);
  fs.fstat = statFix(fs.fstat);
  fs.lstat = statFix(fs.lstat);

  fs.statSync = statFixSync(fs.statSync);
  fs.fstatSync = statFixSync(fs.fstatSync);
  fs.lstatSync = statFixSync(fs.lstatSync);

  // if lchmod/lchown do not exist, then make them no-ops
  if (!fs.lchmod) {
    fs.lchmod = function (path, mode, cb) {
      if (cb) process.nextTick(cb);
    };
    fs.lchmodSync = function () {};
  }
  if (!fs.lchown) {
    fs.lchown = function (path, uid, gid, cb) {
      if (cb) process.nextTick(cb);
    };
    fs.lchownSync = function () {};
  }

  // on Windows, A/V software can lock the directory, causing this
  // to fail with an EACCES or EPERM if the directory contains newly
  // created files.  Try again on failure, for up to 60 seconds.

  // Set the timeout this long because some Windows Anti-Virus, such as Parity
  // bit9, may lock files for up to a minute, causing npm package install
  // failures. Also, take care to yield the scheduler. Windows scheduling gives
  // CPU to a busy looping process, which can cause the program causing the lock
  // contention to be starved of CPU by node, so the contention doesn't resolve.
  if (platform === "win32") {
    fs.rename = (function (fs$rename) { return function (from, to, cb) {
      var start = Date.now();
      var backoff = 0;
      fs$rename(from, to, function CB (er) {
        if (er
            && (er.code === "EACCES" || er.code === "EPERM")
            && Date.now() - start < 60000) {
          setTimeout(function() {
            fs.stat(to, function (stater, st) {
              if (stater && stater.code === "ENOENT")
                fs$rename(from, to, CB);
              else
                cb(er);
            });
          }, backoff);
          if (backoff < 100)
            backoff += 10;
          return;
        }
        if (cb) cb(er);
      });
    }})(fs.rename);
  }

  // if read() returns EAGAIN, then just try it again.
  fs.read = (function (fs$read) {
    function read (fd, buffer, offset, length, position, callback_) {
      var callback;
      if (callback_ && typeof callback_ === 'function') {
        var eagCounter = 0;
        callback = function (er, _, __) {
          if (er && er.code === 'EAGAIN' && eagCounter < 10) {
            eagCounter ++;
            return fs$read.call(fs, fd, buffer, offset, length, position, callback)
          }
          callback_.apply(this, arguments);
        };
      }
      return fs$read.call(fs, fd, buffer, offset, length, position, callback)
    }

    // This ensures `util.promisify` works as it does for native `fs.read`.
    if (Object.setPrototypeOf) Object.setPrototypeOf(read, fs$read);
    return read
  })(fs.read);

  fs.readSync = (function (fs$readSync) { return function (fd, buffer, offset, length, position) {
    var eagCounter = 0;
    while (true) {
      try {
        return fs$readSync.call(fs, fd, buffer, offset, length, position)
      } catch (er) {
        if (er.code === 'EAGAIN' && eagCounter < 10) {
          eagCounter ++;
          continue
        }
        throw er
      }
    }
  }})(fs.readSync);

  function patchLchmod (fs) {
    fs.lchmod = function (path, mode, callback) {
      fs.open( path
             , constants__default['default'].O_WRONLY | constants__default['default'].O_SYMLINK
             , mode
             , function (err, fd) {
        if (err) {
          if (callback) callback(err);
          return
        }
        // prefer to return the chmod error, if one occurs,
        // but still try to close, and report closing errors if they occur.
        fs.fchmod(fd, mode, function (err) {
          fs.close(fd, function(err2) {
            if (callback) callback(err || err2);
          });
        });
      });
    };

    fs.lchmodSync = function (path, mode) {
      var fd = fs.openSync(path, constants__default['default'].O_WRONLY | constants__default['default'].O_SYMLINK, mode);

      // prefer to return the chmod error, if one occurs,
      // but still try to close, and report closing errors if they occur.
      var threw = true;
      var ret;
      try {
        ret = fs.fchmodSync(fd, mode);
        threw = false;
      } finally {
        if (threw) {
          try {
            fs.closeSync(fd);
          } catch (er) {}
        } else {
          fs.closeSync(fd);
        }
      }
      return ret
    };
  }

  function patchLutimes (fs) {
    if (constants__default['default'].hasOwnProperty("O_SYMLINK")) {
      fs.lutimes = function (path, at, mt, cb) {
        fs.open(path, constants__default['default'].O_SYMLINK, function (er, fd) {
          if (er) {
            if (cb) cb(er);
            return
          }
          fs.futimes(fd, at, mt, function (er) {
            fs.close(fd, function (er2) {
              if (cb) cb(er || er2);
            });
          });
        });
      };

      fs.lutimesSync = function (path, at, mt) {
        var fd = fs.openSync(path, constants__default['default'].O_SYMLINK);
        var ret;
        var threw = true;
        try {
          ret = fs.futimesSync(fd, at, mt);
          threw = false;
        } finally {
          if (threw) {
            try {
              fs.closeSync(fd);
            } catch (er) {}
          } else {
            fs.closeSync(fd);
          }
        }
        return ret
      };

    } else {
      fs.lutimes = function (_a, _b, _c, cb) { if (cb) process.nextTick(cb); };
      fs.lutimesSync = function () {};
    }
  }

  function chmodFix (orig) {
    if (!orig) return orig
    return function (target, mode, cb) {
      return orig.call(fs, target, mode, function (er) {
        if (chownErOk(er)) er = null;
        if (cb) cb.apply(this, arguments);
      })
    }
  }

  function chmodFixSync (orig) {
    if (!orig) return orig
    return function (target, mode) {
      try {
        return orig.call(fs, target, mode)
      } catch (er) {
        if (!chownErOk(er)) throw er
      }
    }
  }


  function chownFix (orig) {
    if (!orig) return orig
    return function (target, uid, gid, cb) {
      return orig.call(fs, target, uid, gid, function (er) {
        if (chownErOk(er)) er = null;
        if (cb) cb.apply(this, arguments);
      })
    }
  }

  function chownFixSync (orig) {
    if (!orig) return orig
    return function (target, uid, gid) {
      try {
        return orig.call(fs, target, uid, gid)
      } catch (er) {
        if (!chownErOk(er)) throw er
      }
    }
  }

  function statFix (orig) {
    if (!orig) return orig
    // Older versions of Node erroneously returned signed integers for
    // uid + gid.
    return function (target, options, cb) {
      if (typeof options === 'function') {
        cb = options;
        options = null;
      }
      function callback (er, stats) {
        if (stats) {
          if (stats.uid < 0) stats.uid += 0x100000000;
          if (stats.gid < 0) stats.gid += 0x100000000;
        }
        if (cb) cb.apply(this, arguments);
      }
      return options ? orig.call(fs, target, options, callback)
        : orig.call(fs, target, callback)
    }
  }

  function statFixSync (orig) {
    if (!orig) return orig
    // Older versions of Node erroneously returned signed integers for
    // uid + gid.
    return function (target, options) {
      var stats = options ? orig.call(fs, target, options)
        : orig.call(fs, target);
      if (stats.uid < 0) stats.uid += 0x100000000;
      if (stats.gid < 0) stats.gid += 0x100000000;
      return stats;
    }
  }

  // ENOSYS means that the fs doesn't support the op. Just ignore
  // that, because it doesn't matter.
  //
  // if there's no getuid, or if getuid() is something other
  // than 0, and the error is EINVAL or EPERM, then just ignore
  // it.
  //
  // This specific case is a silent failure in cp, install, tar,
  // and most other unix tools that manage permissions.
  //
  // When running as root, or if other types of errors are
  // encountered, then it's strict.
  function chownErOk (er) {
    if (!er)
      return true

    if (er.code === "ENOSYS")
      return true

    var nonroot = !process.getuid || process.getuid() !== 0;
    if (nonroot) {
      if (er.code === "EINVAL" || er.code === "EPERM")
        return true
    }

    return false
  }
}

var Stream = Stream__default['default'].Stream;

var legacyStreams = legacy;

function legacy (fs) {
  return {
    ReadStream: ReadStream,
    WriteStream: WriteStream
  }

  function ReadStream (path, options) {
    if (!(this instanceof ReadStream)) return new ReadStream(path, options);

    Stream.call(this);

    var self = this;

    this.path = path;
    this.fd = null;
    this.readable = true;
    this.paused = false;

    this.flags = 'r';
    this.mode = 438; /*=0666*/
    this.bufferSize = 64 * 1024;

    options = options || {};

    // Mixin options into this
    var keys = Object.keys(options);
    for (var index = 0, length = keys.length; index < length; index++) {
      var key = keys[index];
      this[key] = options[key];
    }

    if (this.encoding) this.setEncoding(this.encoding);

    if (this.start !== undefined) {
      if ('number' !== typeof this.start) {
        throw TypeError('start must be a Number');
      }
      if (this.end === undefined) {
        this.end = Infinity;
      } else if ('number' !== typeof this.end) {
        throw TypeError('end must be a Number');
      }

      if (this.start > this.end) {
        throw new Error('start must be <= end');
      }

      this.pos = this.start;
    }

    if (this.fd !== null) {
      process.nextTick(function() {
        self._read();
      });
      return;
    }

    fs.open(this.path, this.flags, this.mode, function (err, fd) {
      if (err) {
        self.emit('error', err);
        self.readable = false;
        return;
      }

      self.fd = fd;
      self.emit('open', fd);
      self._read();
    });
  }

  function WriteStream (path, options) {
    if (!(this instanceof WriteStream)) return new WriteStream(path, options);

    Stream.call(this);

    this.path = path;
    this.fd = null;
    this.writable = true;

    this.flags = 'w';
    this.encoding = 'binary';
    this.mode = 438; /*=0666*/
    this.bytesWritten = 0;

    options = options || {};

    // Mixin options into this
    var keys = Object.keys(options);
    for (var index = 0, length = keys.length; index < length; index++) {
      var key = keys[index];
      this[key] = options[key];
    }

    if (this.start !== undefined) {
      if ('number' !== typeof this.start) {
        throw TypeError('start must be a Number');
      }
      if (this.start < 0) {
        throw new Error('start must be >= zero');
      }

      this.pos = this.start;
    }

    this.busy = false;
    this._queue = [];

    if (this.fd === null) {
      this._open = fs.open;
      this._queue.push([this._open, this.path, this.flags, this.mode, undefined]);
      this.flush();
    }
  }
}

var clone_1 = clone$2;

var getPrototypeOf = Object.getPrototypeOf || function (obj) {
  return obj.__proto__
};

function clone$2 (obj) {
  if (obj === null || typeof obj !== 'object')
    return obj

  if (obj instanceof Object)
    var copy = { __proto__: getPrototypeOf(obj) };
  else
    var copy = Object.create(null);

  Object.getOwnPropertyNames(obj).forEach(function (key) {
    Object.defineProperty(copy, key, Object.getOwnPropertyDescriptor(obj, key));
  });

  return copy
}

var gracefulFs = createCommonjsModule(function (module) {
/* istanbul ignore next - node 0.x polyfill */
var gracefulQueue;
var previousSymbol;

/* istanbul ignore else - node 0.x polyfill */
if (typeof Symbol === 'function' && typeof Symbol.for === 'function') {
  gracefulQueue = Symbol.for('graceful-fs.queue');
  // This is used in testing by future versions
  previousSymbol = Symbol.for('graceful-fs.previous');
} else {
  gracefulQueue = '___graceful-fs.queue';
  previousSymbol = '___graceful-fs.previous';
}

function noop () {}

function publishQueue(context, queue) {
  Object.defineProperty(context, gracefulQueue, {
    get: function() {
      return queue
    }
  });
}

var debug = noop;
if (util__default['default'].debuglog)
  debug = util__default['default'].debuglog('gfs4');
else if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || ''))
  debug = function() {
    var m = util__default['default'].format.apply(util__default['default'], arguments);
    m = 'GFS4: ' + m.split(/\n/).join('\nGFS4: ');
    console.error(m);
  };

// Once time initialization
if (!fs__default['default'][gracefulQueue]) {
  // This queue can be shared by multiple loaded instances
  var queue = commonjsGlobal[gracefulQueue] || [];
  publishQueue(fs__default['default'], queue);

  // Patch fs.close/closeSync to shared queue version, because we need
  // to retry() whenever a close happens *anywhere* in the program.
  // This is essential when multiple graceful-fs instances are
  // in play at the same time.
  fs__default['default'].close = (function (fs$close) {
    function close (fd, cb) {
      return fs$close.call(fs__default['default'], fd, function (err) {
        // This function uses the graceful-fs shared queue
        if (!err) {
          resetQueue();
        }

        if (typeof cb === 'function')
          cb.apply(this, arguments);
      })
    }

    Object.defineProperty(close, previousSymbol, {
      value: fs$close
    });
    return close
  })(fs__default['default'].close);

  fs__default['default'].closeSync = (function (fs$closeSync) {
    function closeSync (fd) {
      // This function uses the graceful-fs shared queue
      fs$closeSync.apply(fs__default['default'], arguments);
      resetQueue();
    }

    Object.defineProperty(closeSync, previousSymbol, {
      value: fs$closeSync
    });
    return closeSync
  })(fs__default['default'].closeSync);

  if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || '')) {
    process.on('exit', function() {
      debug(fs__default['default'][gracefulQueue]);
      assert__default['default'].equal(fs__default['default'][gracefulQueue].length, 0);
    });
  }
}

if (!commonjsGlobal[gracefulQueue]) {
  publishQueue(commonjsGlobal, fs__default['default'][gracefulQueue]);
}

module.exports = patch(clone_1(fs__default['default']));
if (process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !fs__default['default'].__patched) {
    module.exports = patch(fs__default['default']);
    fs__default['default'].__patched = true;
}

function patch (fs) {
  // Everything that references the open() function needs to be in here
  polyfills(fs);
  fs.gracefulify = patch;

  fs.createReadStream = createReadStream;
  fs.createWriteStream = createWriteStream;
  var fs$readFile = fs.readFile;
  fs.readFile = readFile;
  function readFile (path, options, cb) {
    if (typeof options === 'function')
      cb = options, options = null;

    return go$readFile(path, options, cb)

    function go$readFile (path, options, cb, startTime) {
      return fs$readFile(path, options, function (err) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$readFile, [path, options, cb], err, startTime || Date.now(), Date.now()]);
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments);
        }
      })
    }
  }

  var fs$writeFile = fs.writeFile;
  fs.writeFile = writeFile;
  function writeFile (path, data, options, cb) {
    if (typeof options === 'function')
      cb = options, options = null;

    return go$writeFile(path, data, options, cb)

    function go$writeFile (path, data, options, cb, startTime) {
      return fs$writeFile(path, data, options, function (err) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$writeFile, [path, data, options, cb], err, startTime || Date.now(), Date.now()]);
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments);
        }
      })
    }
  }

  var fs$appendFile = fs.appendFile;
  if (fs$appendFile)
    fs.appendFile = appendFile;
  function appendFile (path, data, options, cb) {
    if (typeof options === 'function')
      cb = options, options = null;

    return go$appendFile(path, data, options, cb)

    function go$appendFile (path, data, options, cb, startTime) {
      return fs$appendFile(path, data, options, function (err) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$appendFile, [path, data, options, cb], err, startTime || Date.now(), Date.now()]);
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments);
        }
      })
    }
  }

  var fs$copyFile = fs.copyFile;
  if (fs$copyFile)
    fs.copyFile = copyFile;
  function copyFile (src, dest, flags, cb) {
    if (typeof flags === 'function') {
      cb = flags;
      flags = 0;
    }
    return go$copyFile(src, dest, flags, cb)

    function go$copyFile (src, dest, flags, cb, startTime) {
      return fs$copyFile(src, dest, flags, function (err) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$copyFile, [src, dest, flags, cb], err, startTime || Date.now(), Date.now()]);
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments);
        }
      })
    }
  }

  var fs$readdir = fs.readdir;
  fs.readdir = readdir;
  function readdir (path, options, cb) {
    if (typeof options === 'function')
      cb = options, options = null;

    return go$readdir(path, options, cb)

    function go$readdir (path, options, cb, startTime) {
      return fs$readdir(path, options, function (err, files) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$readdir, [path, options, cb], err, startTime || Date.now(), Date.now()]);
        else {
          if (files && files.sort)
            files.sort();

          if (typeof cb === 'function')
            cb.call(this, err, files);
        }
      })
    }
  }

  if (process.version.substr(0, 4) === 'v0.8') {
    var legStreams = legacyStreams(fs);
    ReadStream = legStreams.ReadStream;
    WriteStream = legStreams.WriteStream;
  }

  var fs$ReadStream = fs.ReadStream;
  if (fs$ReadStream) {
    ReadStream.prototype = Object.create(fs$ReadStream.prototype);
    ReadStream.prototype.open = ReadStream$open;
  }

  var fs$WriteStream = fs.WriteStream;
  if (fs$WriteStream) {
    WriteStream.prototype = Object.create(fs$WriteStream.prototype);
    WriteStream.prototype.open = WriteStream$open;
  }

  Object.defineProperty(fs, 'ReadStream', {
    get: function () {
      return ReadStream
    },
    set: function (val) {
      ReadStream = val;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(fs, 'WriteStream', {
    get: function () {
      return WriteStream
    },
    set: function (val) {
      WriteStream = val;
    },
    enumerable: true,
    configurable: true
  });

  // legacy names
  var FileReadStream = ReadStream;
  Object.defineProperty(fs, 'FileReadStream', {
    get: function () {
      return FileReadStream
    },
    set: function (val) {
      FileReadStream = val;
    },
    enumerable: true,
    configurable: true
  });
  var FileWriteStream = WriteStream;
  Object.defineProperty(fs, 'FileWriteStream', {
    get: function () {
      return FileWriteStream
    },
    set: function (val) {
      FileWriteStream = val;
    },
    enumerable: true,
    configurable: true
  });

  function ReadStream (path, options) {
    if (this instanceof ReadStream)
      return fs$ReadStream.apply(this, arguments), this
    else
      return ReadStream.apply(Object.create(ReadStream.prototype), arguments)
  }

  function ReadStream$open () {
    var that = this;
    open(that.path, that.flags, that.mode, function (err, fd) {
      if (err) {
        if (that.autoClose)
          that.destroy();

        that.emit('error', err);
      } else {
        that.fd = fd;
        that.emit('open', fd);
        that.read();
      }
    });
  }

  function WriteStream (path, options) {
    if (this instanceof WriteStream)
      return fs$WriteStream.apply(this, arguments), this
    else
      return WriteStream.apply(Object.create(WriteStream.prototype), arguments)
  }

  function WriteStream$open () {
    var that = this;
    open(that.path, that.flags, that.mode, function (err, fd) {
      if (err) {
        that.destroy();
        that.emit('error', err);
      } else {
        that.fd = fd;
        that.emit('open', fd);
      }
    });
  }

  function createReadStream (path, options) {
    return new fs.ReadStream(path, options)
  }

  function createWriteStream (path, options) {
    return new fs.WriteStream(path, options)
  }

  var fs$open = fs.open;
  fs.open = open;
  function open (path, flags, mode, cb) {
    if (typeof mode === 'function')
      cb = mode, mode = null;

    return go$open(path, flags, mode, cb)

    function go$open (path, flags, mode, cb, startTime) {
      return fs$open(path, flags, mode, function (err, fd) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$open, [path, flags, mode, cb], err, startTime || Date.now(), Date.now()]);
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments);
        }
      })
    }
  }

  return fs
}

function enqueue (elem) {
  debug('ENQUEUE', elem[0].name, elem[1]);
  fs__default['default'][gracefulQueue].push(elem);
  retry();
}

// keep track of the timeout between retry() calls
var retryTimer;

// reset the startTime and lastTime to now
// this resets the start of the 60 second overall timeout as well as the
// delay between attempts so that we'll retry these jobs sooner
function resetQueue () {
  var now = Date.now();
  for (var i = 0; i < fs__default['default'][gracefulQueue].length; ++i) {
    // entries that are only a length of 2 are from an older version, don't
    // bother modifying those since they'll be retried anyway.
    if (fs__default['default'][gracefulQueue][i].length > 2) {
      fs__default['default'][gracefulQueue][i][3] = now; // startTime
      fs__default['default'][gracefulQueue][i][4] = now; // lastTime
    }
  }
  // call retry to make sure we're actively processing the queue
  retry();
}

function retry () {
  // clear the timer and remove it to help prevent unintended concurrency
  clearTimeout(retryTimer);
  retryTimer = undefined;

  if (fs__default['default'][gracefulQueue].length === 0)
    return

  var elem = fs__default['default'][gracefulQueue].shift();
  var fn = elem[0];
  var args = elem[1];
  // these items may be unset if they were added by an older graceful-fs
  var err = elem[2];
  var startTime = elem[3];
  var lastTime = elem[4];

  // if we don't have a startTime we have no way of knowing if we've waited
  // long enough, so go ahead and retry this item now
  if (startTime === undefined) {
    debug('RETRY', fn.name, args);
    fn.apply(null, args);
  } else if (Date.now() - startTime >= 60000) {
    // it's been more than 60 seconds total, bail now
    debug('TIMEOUT', fn.name, args);
    var cb = args.pop();
    if (typeof cb === 'function')
      cb.call(null, err);
  } else {
    // the amount of time between the last attempt and right now
    var sinceAttempt = Date.now() - lastTime;
    // the amount of time between when we first tried, and when we last tried
    // rounded up to at least 1
    var sinceStart = Math.max(lastTime - startTime, 1);
    // backoff. wait longer than the total time we've been retrying, but only
    // up to a maximum of 100ms
    var desiredDelay = Math.min(sinceStart * 1.2, 100);
    // it's been long enough since the last retry, do it again
    if (sinceAttempt >= desiredDelay) {
      debug('RETRY', fn.name, args);
      fn.apply(null, args.concat([startTime]));
    } else {
      // if we can't do this job yet, push it to the end of the queue
      // and let the next iteration check again
      fs__default['default'][gracefulQueue].push(elem);
    }
  }

  // schedule our next run if one isn't already scheduled
  if (retryTimer === undefined) {
    retryTimer = setTimeout(retry, 0);
  }
}
});

var fs_1 = createCommonjsModule(function (module, exports) {
// This is adapted from https://github.com/normalize/mz
// Copyright (c) 2014-2016 Jonathan Ong me@jongleberry.com and Contributors
const u = universalify.fromCallback;


const api = [
  'access',
  'appendFile',
  'chmod',
  'chown',
  'close',
  'copyFile',
  'fchmod',
  'fchown',
  'fdatasync',
  'fstat',
  'fsync',
  'ftruncate',
  'futimes',
  'lchmod',
  'lchown',
  'link',
  'lstat',
  'mkdir',
  'mkdtemp',
  'open',
  'opendir',
  'readdir',
  'readFile',
  'readlink',
  'realpath',
  'rename',
  'rm',
  'rmdir',
  'stat',
  'symlink',
  'truncate',
  'unlink',
  'utimes',
  'writeFile'
].filter(key => {
  // Some commands are not available on some systems. Ex:
  // fs.opendir was added in Node.js v12.12.0
  // fs.rm was added in Node.js v14.14.0
  // fs.lchown is not available on at least some Linux
  return typeof gracefulFs[key] === 'function'
});

// Export cloned fs:
Object.assign(exports, gracefulFs);

// Universalify async methods:
api.forEach(method => {
  exports[method] = u(gracefulFs[method]);
});
exports.realpath.native = u(gracefulFs.realpath.native);

// We differ from mz/fs in that we still ship the old, broken, fs.exists()
// since we are a drop-in replacement for the native module
exports.exists = function (filename, callback) {
  if (typeof callback === 'function') {
    return gracefulFs.exists(filename, callback)
  }
  return new Promise(resolve => {
    return gracefulFs.exists(filename, resolve)
  })
};

// fs.read(), fs.write(), & fs.writev() need special treatment due to multiple callback args

exports.read = function (fd, buffer, offset, length, position, callback) {
  if (typeof callback === 'function') {
    return gracefulFs.read(fd, buffer, offset, length, position, callback)
  }
  return new Promise((resolve, reject) => {
    gracefulFs.read(fd, buffer, offset, length, position, (err, bytesRead, buffer) => {
      if (err) return reject(err)
      resolve({ bytesRead, buffer });
    });
  })
};

// Function signature can be
// fs.write(fd, buffer[, offset[, length[, position]]], callback)
// OR
// fs.write(fd, string[, position[, encoding]], callback)
// We need to handle both cases, so we use ...args
exports.write = function (fd, buffer, ...args) {
  if (typeof args[args.length - 1] === 'function') {
    return gracefulFs.write(fd, buffer, ...args)
  }

  return new Promise((resolve, reject) => {
    gracefulFs.write(fd, buffer, ...args, (err, bytesWritten, buffer) => {
      if (err) return reject(err)
      resolve({ bytesWritten, buffer });
    });
  })
};

// fs.writev only available in Node v12.9.0+
if (typeof gracefulFs.writev === 'function') {
  // Function signature is
  // s.writev(fd, buffers[, position], callback)
  // We need to handle the optional arg, so we use ...args
  exports.writev = function (fd, buffers, ...args) {
    if (typeof args[args.length - 1] === 'function') {
      return gracefulFs.writev(fd, buffers, ...args)
    }

    return new Promise((resolve, reject) => {
      gracefulFs.writev(fd, buffers, ...args, (err, bytesWritten, buffers) => {
        if (err) return reject(err)
        resolve({ bytesWritten, buffers });
      });
    })
  };
}
});

// https://github.com/nodejs/node/issues/8987
// https://github.com/libuv/libuv/pull/1088
var checkPath$1 = function checkPath (pth) {
  if (process.platform === 'win32') {
    const pathHasInvalidWinCharacters = /[<>:"|?*]/.test(pth.replace(path__default['default'].parse(pth).root, ''));

    if (pathHasInvalidWinCharacters) {
      const error = new Error(`Path contains invalid characters: ${pth}`);
      error.code = 'EINVAL';
      throw error
    }
  }
};

var utils$1 = {
	checkPath: checkPath$1
};

const { checkPath } = utils$1;

const getMode = options => {
  const defaults = { mode: 0o777 };
  if (typeof options === 'number') return options
  return ({ ...defaults, ...options }).mode
};

var makeDir_1 = async (dir, options) => {
  checkPath(dir);

  return fs_1.mkdir(dir, {
    mode: getMode(options),
    recursive: true
  })
};

var makeDirSync$1 = (dir, options) => {
  checkPath(dir);

  return fs_1.mkdirSync(dir, {
    mode: getMode(options),
    recursive: true
  })
};

var makeDir$1 = {
	makeDir: makeDir_1,
	makeDirSync: makeDirSync$1
};

const u$a = universalify.fromPromise;
const { makeDir: _makeDir, makeDirSync } = makeDir$1;
const makeDir = u$a(_makeDir);

var mkdirs$2 = {
  mkdirs: makeDir,
  mkdirsSync: makeDirSync,
  // alias
  mkdirp: makeDir,
  mkdirpSync: makeDirSync,
  ensureDir: makeDir,
  ensureDirSync: makeDirSync
};

function utimesMillis$1 (path, atime, mtime, callback) {
  // if (!HAS_MILLIS_RES) return fs.utimes(path, atime, mtime, callback)
  gracefulFs.open(path, 'r+', (err, fd) => {
    if (err) return callback(err)
    gracefulFs.futimes(fd, atime, mtime, futimesErr => {
      gracefulFs.close(fd, closeErr => {
        if (callback) callback(futimesErr || closeErr);
      });
    });
  });
}

function utimesMillisSync$1 (path, atime, mtime) {
  const fd = gracefulFs.openSync(path, 'r+');
  gracefulFs.futimesSync(fd, atime, mtime);
  return gracefulFs.closeSync(fd)
}

var utimes = {
  utimesMillis: utimesMillis$1,
  utimesMillisSync: utimesMillisSync$1
};

function getStats$2 (src, dest, opts) {
  const statFunc = opts.dereference
    ? (file) => fs_1.stat(file, { bigint: true })
    : (file) => fs_1.lstat(file, { bigint: true });
  return Promise.all([
    statFunc(src),
    statFunc(dest).catch(err => {
      if (err.code === 'ENOENT') return null
      throw err
    })
  ]).then(([srcStat, destStat]) => ({ srcStat, destStat }))
}

function getStatsSync (src, dest, opts) {
  let destStat;
  const statFunc = opts.dereference
    ? (file) => fs_1.statSync(file, { bigint: true })
    : (file) => fs_1.lstatSync(file, { bigint: true });
  const srcStat = statFunc(src);
  try {
    destStat = statFunc(dest);
  } catch (err) {
    if (err.code === 'ENOENT') return { srcStat, destStat: null }
    throw err
  }
  return { srcStat, destStat }
}

function checkPaths (src, dest, funcName, opts, cb) {
  util__default['default'].callbackify(getStats$2)(src, dest, opts, (err, stats) => {
    if (err) return cb(err)
    const { srcStat, destStat } = stats;

    if (destStat) {
      if (areIdentical$2(srcStat, destStat)) {
        const srcBaseName = path__default['default'].basename(src);
        const destBaseName = path__default['default'].basename(dest);
        if (funcName === 'move' &&
          srcBaseName !== destBaseName &&
          srcBaseName.toLowerCase() === destBaseName.toLowerCase()) {
          return cb(null, { srcStat, destStat, isChangingCase: true })
        }
        return cb(new Error('Source and destination must not be the same.'))
      }
      if (srcStat.isDirectory() && !destStat.isDirectory()) {
        return cb(new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`))
      }
      if (!srcStat.isDirectory() && destStat.isDirectory()) {
        return cb(new Error(`Cannot overwrite directory '${dest}' with non-directory '${src}'.`))
      }
    }

    if (srcStat.isDirectory() && isSrcSubdir(src, dest)) {
      return cb(new Error(errMsg(src, dest, funcName)))
    }
    return cb(null, { srcStat, destStat })
  });
}

function checkPathsSync (src, dest, funcName, opts) {
  const { srcStat, destStat } = getStatsSync(src, dest, opts);

  if (destStat) {
    if (areIdentical$2(srcStat, destStat)) {
      const srcBaseName = path__default['default'].basename(src);
      const destBaseName = path__default['default'].basename(dest);
      if (funcName === 'move' &&
        srcBaseName !== destBaseName &&
        srcBaseName.toLowerCase() === destBaseName.toLowerCase()) {
        return { srcStat, destStat, isChangingCase: true }
      }
      throw new Error('Source and destination must not be the same.')
    }
    if (srcStat.isDirectory() && !destStat.isDirectory()) {
      throw new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`)
    }
    if (!srcStat.isDirectory() && destStat.isDirectory()) {
      throw new Error(`Cannot overwrite directory '${dest}' with non-directory '${src}'.`)
    }
  }

  if (srcStat.isDirectory() && isSrcSubdir(src, dest)) {
    throw new Error(errMsg(src, dest, funcName))
  }
  return { srcStat, destStat }
}

// recursively check if dest parent is a subdirectory of src.
// It works for all file types including symlinks since it
// checks the src and dest inodes. It starts from the deepest
// parent and stops once it reaches the src parent or the root path.
function checkParentPaths (src, srcStat, dest, funcName, cb) {
  const srcParent = path__default['default'].resolve(path__default['default'].dirname(src));
  const destParent = path__default['default'].resolve(path__default['default'].dirname(dest));
  if (destParent === srcParent || destParent === path__default['default'].parse(destParent).root) return cb()
  fs_1.stat(destParent, { bigint: true }, (err, destStat) => {
    if (err) {
      if (err.code === 'ENOENT') return cb()
      return cb(err)
    }
    if (areIdentical$2(srcStat, destStat)) {
      return cb(new Error(errMsg(src, dest, funcName)))
    }
    return checkParentPaths(src, srcStat, destParent, funcName, cb)
  });
}

function checkParentPathsSync (src, srcStat, dest, funcName) {
  const srcParent = path__default['default'].resolve(path__default['default'].dirname(src));
  const destParent = path__default['default'].resolve(path__default['default'].dirname(dest));
  if (destParent === srcParent || destParent === path__default['default'].parse(destParent).root) return
  let destStat;
  try {
    destStat = fs_1.statSync(destParent, { bigint: true });
  } catch (err) {
    if (err.code === 'ENOENT') return
    throw err
  }
  if (areIdentical$2(srcStat, destStat)) {
    throw new Error(errMsg(src, dest, funcName))
  }
  return checkParentPathsSync(src, srcStat, destParent, funcName)
}

function areIdentical$2 (srcStat, destStat) {
  return destStat.ino && destStat.dev && destStat.ino === srcStat.ino && destStat.dev === srcStat.dev
}

// return true if dest is a subdir of src, otherwise false.
// It only checks the path strings.
function isSrcSubdir (src, dest) {
  const srcArr = path__default['default'].resolve(src).split(path__default['default'].sep).filter(i => i);
  const destArr = path__default['default'].resolve(dest).split(path__default['default'].sep).filter(i => i);
  return srcArr.reduce((acc, cur, i) => acc && destArr[i] === cur, true)
}

function errMsg (src, dest, funcName) {
  return `Cannot ${funcName} '${src}' to a subdirectory of itself, '${dest}'.`
}

var stat = {
  checkPaths,
  checkPathsSync,
  checkParentPaths,
  checkParentPathsSync,
  isSrcSubdir,
  areIdentical: areIdentical$2
};

const mkdirsSync$1 = mkdirs$2.mkdirsSync;
const utimesMillisSync = utimes.utimesMillisSync;


function copySync$2 (src, dest, opts) {
  if (typeof opts === 'function') {
    opts = { filter: opts };
  }

  opts = opts || {};
  opts.clobber = 'clobber' in opts ? !!opts.clobber : true; // default to true for now
  opts.overwrite = 'overwrite' in opts ? !!opts.overwrite : opts.clobber; // overwrite falls back to clobber

  // Warn about using preserveTimestamps on 32-bit node
  if (opts.preserveTimestamps && process.arch === 'ia32') {
    console.warn(`fs-extra: Using the preserveTimestamps option in 32-bit node is not recommended;\n
    see https://github.com/jprichardson/node-fs-extra/issues/269`);
  }

  const { srcStat, destStat } = stat.checkPathsSync(src, dest, 'copy', opts);
  stat.checkParentPathsSync(src, srcStat, dest, 'copy');
  return handleFilterAndCopy(destStat, src, dest, opts)
}

function handleFilterAndCopy (destStat, src, dest, opts) {
  if (opts.filter && !opts.filter(src, dest)) return
  const destParent = path__default['default'].dirname(dest);
  if (!gracefulFs.existsSync(destParent)) mkdirsSync$1(destParent);
  return getStats$1(destStat, src, dest, opts)
}

function startCopy$1 (destStat, src, dest, opts) {
  if (opts.filter && !opts.filter(src, dest)) return
  return getStats$1(destStat, src, dest, opts)
}

function getStats$1 (destStat, src, dest, opts) {
  const statSync = opts.dereference ? gracefulFs.statSync : gracefulFs.lstatSync;
  const srcStat = statSync(src);

  if (srcStat.isDirectory()) return onDir$1(srcStat, destStat, src, dest, opts)
  else if (srcStat.isFile() ||
           srcStat.isCharacterDevice() ||
           srcStat.isBlockDevice()) return onFile$1(srcStat, destStat, src, dest, opts)
  else if (srcStat.isSymbolicLink()) return onLink$1(destStat, src, dest, opts)
  else if (srcStat.isSocket()) throw new Error(`Cannot copy a socket file: ${src}`)
  else if (srcStat.isFIFO()) throw new Error(`Cannot copy a FIFO pipe: ${src}`)
  throw new Error(`Unknown file: ${src}`)
}

function onFile$1 (srcStat, destStat, src, dest, opts) {
  if (!destStat) return copyFile$1(srcStat, src, dest, opts)
  return mayCopyFile$1(srcStat, src, dest, opts)
}

function mayCopyFile$1 (srcStat, src, dest, opts) {
  if (opts.overwrite) {
    gracefulFs.unlinkSync(dest);
    return copyFile$1(srcStat, src, dest, opts)
  } else if (opts.errorOnExist) {
    throw new Error(`'${dest}' already exists`)
  }
}

function copyFile$1 (srcStat, src, dest, opts) {
  gracefulFs.copyFileSync(src, dest);
  if (opts.preserveTimestamps) handleTimestamps(srcStat.mode, src, dest);
  return setDestMode$1(dest, srcStat.mode)
}

function handleTimestamps (srcMode, src, dest) {
  // Make sure the file is writable before setting the timestamp
  // otherwise open fails with EPERM when invoked with 'r+'
  // (through utimes call)
  if (fileIsNotWritable$1(srcMode)) makeFileWritable$1(dest, srcMode);
  return setDestTimestamps$1(src, dest)
}

function fileIsNotWritable$1 (srcMode) {
  return (srcMode & 0o200) === 0
}

function makeFileWritable$1 (dest, srcMode) {
  return setDestMode$1(dest, srcMode | 0o200)
}

function setDestMode$1 (dest, srcMode) {
  return gracefulFs.chmodSync(dest, srcMode)
}

function setDestTimestamps$1 (src, dest) {
  // The initial srcStat.atime cannot be trusted
  // because it is modified by the read(2) system call
  // (See https://nodejs.org/api/fs.html#fs_stat_time_values)
  const updatedSrcStat = gracefulFs.statSync(src);
  return utimesMillisSync(dest, updatedSrcStat.atime, updatedSrcStat.mtime)
}

function onDir$1 (srcStat, destStat, src, dest, opts) {
  if (!destStat) return mkDirAndCopy$1(srcStat.mode, src, dest, opts)
  return copyDir$1(src, dest, opts)
}

function mkDirAndCopy$1 (srcMode, src, dest, opts) {
  gracefulFs.mkdirSync(dest);
  copyDir$1(src, dest, opts);
  return setDestMode$1(dest, srcMode)
}

function copyDir$1 (src, dest, opts) {
  gracefulFs.readdirSync(src).forEach(item => copyDirItem$1(item, src, dest, opts));
}

function copyDirItem$1 (item, src, dest, opts) {
  const srcItem = path__default['default'].join(src, item);
  const destItem = path__default['default'].join(dest, item);
  const { destStat } = stat.checkPathsSync(srcItem, destItem, 'copy', opts);
  return startCopy$1(destStat, srcItem, destItem, opts)
}

function onLink$1 (destStat, src, dest, opts) {
  let resolvedSrc = gracefulFs.readlinkSync(src);
  if (opts.dereference) {
    resolvedSrc = path__default['default'].resolve(process.cwd(), resolvedSrc);
  }

  if (!destStat) {
    return gracefulFs.symlinkSync(resolvedSrc, dest)
  } else {
    let resolvedDest;
    try {
      resolvedDest = gracefulFs.readlinkSync(dest);
    } catch (err) {
      // dest exists and is a regular file or directory,
      // Windows may throw UNKNOWN error. If dest already exists,
      // fs throws error anyway, so no need to guard against it here.
      if (err.code === 'EINVAL' || err.code === 'UNKNOWN') return gracefulFs.symlinkSync(resolvedSrc, dest)
      throw err
    }
    if (opts.dereference) {
      resolvedDest = path__default['default'].resolve(process.cwd(), resolvedDest);
    }
    if (stat.isSrcSubdir(resolvedSrc, resolvedDest)) {
      throw new Error(`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`)
    }

    // prevent copy if src is a subdir of dest since unlinking
    // dest in this case would result in removing src contents
    // and therefore a broken symlink would be created.
    if (gracefulFs.statSync(dest).isDirectory() && stat.isSrcSubdir(resolvedDest, resolvedSrc)) {
      throw new Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`)
    }
    return copyLink$1(resolvedSrc, dest)
  }
}

function copyLink$1 (resolvedSrc, dest) {
  gracefulFs.unlinkSync(dest);
  return gracefulFs.symlinkSync(resolvedSrc, dest)
}

var copySync_1 = copySync$2;

var copySync$1 = {
  copySync: copySync_1
};

const u$9 = universalify.fromPromise;


function pathExists$6 (path) {
  return fs_1.access(path).then(() => true).catch(() => false)
}

var pathExists_1 = {
  pathExists: u$9(pathExists$6),
  pathExistsSync: fs_1.existsSync
};

const mkdirs$1 = mkdirs$2.mkdirs;
const pathExists$5 = pathExists_1.pathExists;
const utimesMillis = utimes.utimesMillis;


function copy$3 (src, dest, opts, cb) {
  if (typeof opts === 'function' && !cb) {
    cb = opts;
    opts = {};
  } else if (typeof opts === 'function') {
    opts = { filter: opts };
  }

  cb = cb || function () {};
  opts = opts || {};

  opts.clobber = 'clobber' in opts ? !!opts.clobber : true; // default to true for now
  opts.overwrite = 'overwrite' in opts ? !!opts.overwrite : opts.clobber; // overwrite falls back to clobber

  // Warn about using preserveTimestamps on 32-bit node
  if (opts.preserveTimestamps && process.arch === 'ia32') {
    console.warn(`fs-extra: Using the preserveTimestamps option in 32-bit node is not recommended;\n
    see https://github.com/jprichardson/node-fs-extra/issues/269`);
  }

  stat.checkPaths(src, dest, 'copy', opts, (err, stats) => {
    if (err) return cb(err)
    const { srcStat, destStat } = stats;
    stat.checkParentPaths(src, srcStat, dest, 'copy', err => {
      if (err) return cb(err)
      if (opts.filter) return handleFilter(checkParentDir, destStat, src, dest, opts, cb)
      return checkParentDir(destStat, src, dest, opts, cb)
    });
  });
}

function checkParentDir (destStat, src, dest, opts, cb) {
  const destParent = path__default['default'].dirname(dest);
  pathExists$5(destParent, (err, dirExists) => {
    if (err) return cb(err)
    if (dirExists) return getStats(destStat, src, dest, opts, cb)
    mkdirs$1(destParent, err => {
      if (err) return cb(err)
      return getStats(destStat, src, dest, opts, cb)
    });
  });
}

function handleFilter (onInclude, destStat, src, dest, opts, cb) {
  Promise.resolve(opts.filter(src, dest)).then(include => {
    if (include) return onInclude(destStat, src, dest, opts, cb)
    return cb()
  }, error => cb(error));
}

function startCopy (destStat, src, dest, opts, cb) {
  if (opts.filter) return handleFilter(getStats, destStat, src, dest, opts, cb)
  return getStats(destStat, src, dest, opts, cb)
}

function getStats (destStat, src, dest, opts, cb) {
  const stat = opts.dereference ? gracefulFs.stat : gracefulFs.lstat;
  stat(src, (err, srcStat) => {
    if (err) return cb(err)

    if (srcStat.isDirectory()) return onDir(srcStat, destStat, src, dest, opts, cb)
    else if (srcStat.isFile() ||
             srcStat.isCharacterDevice() ||
             srcStat.isBlockDevice()) return onFile(srcStat, destStat, src, dest, opts, cb)
    else if (srcStat.isSymbolicLink()) return onLink(destStat, src, dest, opts, cb)
    else if (srcStat.isSocket()) return cb(new Error(`Cannot copy a socket file: ${src}`))
    else if (srcStat.isFIFO()) return cb(new Error(`Cannot copy a FIFO pipe: ${src}`))
    return cb(new Error(`Unknown file: ${src}`))
  });
}

function onFile (srcStat, destStat, src, dest, opts, cb) {
  if (!destStat) return copyFile(srcStat, src, dest, opts, cb)
  return mayCopyFile(srcStat, src, dest, opts, cb)
}

function mayCopyFile (srcStat, src, dest, opts, cb) {
  if (opts.overwrite) {
    gracefulFs.unlink(dest, err => {
      if (err) return cb(err)
      return copyFile(srcStat, src, dest, opts, cb)
    });
  } else if (opts.errorOnExist) {
    return cb(new Error(`'${dest}' already exists`))
  } else return cb()
}

function copyFile (srcStat, src, dest, opts, cb) {
  gracefulFs.copyFile(src, dest, err => {
    if (err) return cb(err)
    if (opts.preserveTimestamps) return handleTimestampsAndMode(srcStat.mode, src, dest, cb)
    return setDestMode(dest, srcStat.mode, cb)
  });
}

function handleTimestampsAndMode (srcMode, src, dest, cb) {
  // Make sure the file is writable before setting the timestamp
  // otherwise open fails with EPERM when invoked with 'r+'
  // (through utimes call)
  if (fileIsNotWritable(srcMode)) {
    return makeFileWritable(dest, srcMode, err => {
      if (err) return cb(err)
      return setDestTimestampsAndMode(srcMode, src, dest, cb)
    })
  }
  return setDestTimestampsAndMode(srcMode, src, dest, cb)
}

function fileIsNotWritable (srcMode) {
  return (srcMode & 0o200) === 0
}

function makeFileWritable (dest, srcMode, cb) {
  return setDestMode(dest, srcMode | 0o200, cb)
}

function setDestTimestampsAndMode (srcMode, src, dest, cb) {
  setDestTimestamps(src, dest, err => {
    if (err) return cb(err)
    return setDestMode(dest, srcMode, cb)
  });
}

function setDestMode (dest, srcMode, cb) {
  return gracefulFs.chmod(dest, srcMode, cb)
}

function setDestTimestamps (src, dest, cb) {
  // The initial srcStat.atime cannot be trusted
  // because it is modified by the read(2) system call
  // (See https://nodejs.org/api/fs.html#fs_stat_time_values)
  gracefulFs.stat(src, (err, updatedSrcStat) => {
    if (err) return cb(err)
    return utimesMillis(dest, updatedSrcStat.atime, updatedSrcStat.mtime, cb)
  });
}

function onDir (srcStat, destStat, src, dest, opts, cb) {
  if (!destStat) return mkDirAndCopy(srcStat.mode, src, dest, opts, cb)
  return copyDir(src, dest, opts, cb)
}

function mkDirAndCopy (srcMode, src, dest, opts, cb) {
  gracefulFs.mkdir(dest, err => {
    if (err) return cb(err)
    copyDir(src, dest, opts, err => {
      if (err) return cb(err)
      return setDestMode(dest, srcMode, cb)
    });
  });
}

function copyDir (src, dest, opts, cb) {
  gracefulFs.readdir(src, (err, items) => {
    if (err) return cb(err)
    return copyDirItems(items, src, dest, opts, cb)
  });
}

function copyDirItems (items, src, dest, opts, cb) {
  const item = items.pop();
  if (!item) return cb()
  return copyDirItem(items, item, src, dest, opts, cb)
}

function copyDirItem (items, item, src, dest, opts, cb) {
  const srcItem = path__default['default'].join(src, item);
  const destItem = path__default['default'].join(dest, item);
  stat.checkPaths(srcItem, destItem, 'copy', opts, (err, stats) => {
    if (err) return cb(err)
    const { destStat } = stats;
    startCopy(destStat, srcItem, destItem, opts, err => {
      if (err) return cb(err)
      return copyDirItems(items, src, dest, opts, cb)
    });
  });
}

function onLink (destStat, src, dest, opts, cb) {
  gracefulFs.readlink(src, (err, resolvedSrc) => {
    if (err) return cb(err)
    if (opts.dereference) {
      resolvedSrc = path__default['default'].resolve(process.cwd(), resolvedSrc);
    }

    if (!destStat) {
      return gracefulFs.symlink(resolvedSrc, dest, cb)
    } else {
      gracefulFs.readlink(dest, (err, resolvedDest) => {
        if (err) {
          // dest exists and is a regular file or directory,
          // Windows may throw UNKNOWN error. If dest already exists,
          // fs throws error anyway, so no need to guard against it here.
          if (err.code === 'EINVAL' || err.code === 'UNKNOWN') return gracefulFs.symlink(resolvedSrc, dest, cb)
          return cb(err)
        }
        if (opts.dereference) {
          resolvedDest = path__default['default'].resolve(process.cwd(), resolvedDest);
        }
        if (stat.isSrcSubdir(resolvedSrc, resolvedDest)) {
          return cb(new Error(`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`))
        }

        // do not copy if src is a subdir of dest since unlinking
        // dest in this case would result in removing src contents
        // and therefore a broken symlink would be created.
        if (destStat.isDirectory() && stat.isSrcSubdir(resolvedDest, resolvedSrc)) {
          return cb(new Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`))
        }
        return copyLink(resolvedSrc, dest, cb)
      });
    }
  });
}

function copyLink (resolvedSrc, dest, cb) {
  gracefulFs.unlink(dest, err => {
    if (err) return cb(err)
    return gracefulFs.symlink(resolvedSrc, dest, cb)
  });
}

var copy_1 = copy$3;

const u$8 = universalify.fromCallback;
var copy$2 = {
  copy: u$8(copy_1)
};

const isWindows = (process.platform === 'win32');

function defaults$1 (options) {
  const methods = [
    'unlink',
    'chmod',
    'stat',
    'lstat',
    'rmdir',
    'readdir'
  ];
  methods.forEach(m => {
    options[m] = options[m] || gracefulFs[m];
    m = m + 'Sync';
    options[m] = options[m] || gracefulFs[m];
  });

  options.maxBusyTries = options.maxBusyTries || 3;
}

function rimraf (p, options, cb) {
  let busyTries = 0;

  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  assert__default['default'](p, 'rimraf: missing path');
  assert__default['default'].strictEqual(typeof p, 'string', 'rimraf: path should be a string');
  assert__default['default'].strictEqual(typeof cb, 'function', 'rimraf: callback function required');
  assert__default['default'](options, 'rimraf: invalid options argument provided');
  assert__default['default'].strictEqual(typeof options, 'object', 'rimraf: options should be object');

  defaults$1(options);

  rimraf_(p, options, function CB (er) {
    if (er) {
      if ((er.code === 'EBUSY' || er.code === 'ENOTEMPTY' || er.code === 'EPERM') &&
          busyTries < options.maxBusyTries) {
        busyTries++;
        const time = busyTries * 100;
        // try again, with the same exact callback as this one.
        return setTimeout(() => rimraf_(p, options, CB), time)
      }

      // already gone
      if (er.code === 'ENOENT') er = null;
    }

    cb(er);
  });
}

// Two possible strategies.
// 1. Assume it's a file.  unlink it, then do the dir stuff on EPERM or EISDIR
// 2. Assume it's a directory.  readdir, then do the file stuff on ENOTDIR
//
// Both result in an extra syscall when you guess wrong.  However, there
// are likely far more normal files in the world than directories.  This
// is based on the assumption that a the average number of files per
// directory is >= 1.
//
// If anyone ever complains about this, then I guess the strategy could
// be made configurable somehow.  But until then, YAGNI.
function rimraf_ (p, options, cb) {
  assert__default['default'](p);
  assert__default['default'](options);
  assert__default['default'](typeof cb === 'function');

  // sunos lets the root user unlink directories, which is... weird.
  // so we have to lstat here and make sure it's not a dir.
  options.lstat(p, (er, st) => {
    if (er && er.code === 'ENOENT') {
      return cb(null)
    }

    // Windows can EPERM on stat.  Life is suffering.
    if (er && er.code === 'EPERM' && isWindows) {
      return fixWinEPERM(p, options, er, cb)
    }

    if (st && st.isDirectory()) {
      return rmdir(p, options, er, cb)
    }

    options.unlink(p, er => {
      if (er) {
        if (er.code === 'ENOENT') {
          return cb(null)
        }
        if (er.code === 'EPERM') {
          return (isWindows)
            ? fixWinEPERM(p, options, er, cb)
            : rmdir(p, options, er, cb)
        }
        if (er.code === 'EISDIR') {
          return rmdir(p, options, er, cb)
        }
      }
      return cb(er)
    });
  });
}

function fixWinEPERM (p, options, er, cb) {
  assert__default['default'](p);
  assert__default['default'](options);
  assert__default['default'](typeof cb === 'function');

  options.chmod(p, 0o666, er2 => {
    if (er2) {
      cb(er2.code === 'ENOENT' ? null : er);
    } else {
      options.stat(p, (er3, stats) => {
        if (er3) {
          cb(er3.code === 'ENOENT' ? null : er);
        } else if (stats.isDirectory()) {
          rmdir(p, options, er, cb);
        } else {
          options.unlink(p, cb);
        }
      });
    }
  });
}

function fixWinEPERMSync (p, options, er) {
  let stats;

  assert__default['default'](p);
  assert__default['default'](options);

  try {
    options.chmodSync(p, 0o666);
  } catch (er2) {
    if (er2.code === 'ENOENT') {
      return
    } else {
      throw er
    }
  }

  try {
    stats = options.statSync(p);
  } catch (er3) {
    if (er3.code === 'ENOENT') {
      return
    } else {
      throw er
    }
  }

  if (stats.isDirectory()) {
    rmdirSync(p, options, er);
  } else {
    options.unlinkSync(p);
  }
}

function rmdir (p, options, originalEr, cb) {
  assert__default['default'](p);
  assert__default['default'](options);
  assert__default['default'](typeof cb === 'function');

  // try to rmdir first, and only readdir on ENOTEMPTY or EEXIST (SunOS)
  // if we guessed wrong, and it's not a directory, then
  // raise the original error.
  options.rmdir(p, er => {
    if (er && (er.code === 'ENOTEMPTY' || er.code === 'EEXIST' || er.code === 'EPERM')) {
      rmkids(p, options, cb);
    } else if (er && er.code === 'ENOTDIR') {
      cb(originalEr);
    } else {
      cb(er);
    }
  });
}

function rmkids (p, options, cb) {
  assert__default['default'](p);
  assert__default['default'](options);
  assert__default['default'](typeof cb === 'function');

  options.readdir(p, (er, files) => {
    if (er) return cb(er)

    let n = files.length;
    let errState;

    if (n === 0) return options.rmdir(p, cb)

    files.forEach(f => {
      rimraf(path__default['default'].join(p, f), options, er => {
        if (errState) {
          return
        }
        if (er) return cb(errState = er)
        if (--n === 0) {
          options.rmdir(p, cb);
        }
      });
    });
  });
}

// this looks simpler, and is strictly *faster*, but will
// tie up the JavaScript thread and fail on excessively
// deep directory trees.
function rimrafSync (p, options) {
  let st;

  options = options || {};
  defaults$1(options);

  assert__default['default'](p, 'rimraf: missing path');
  assert__default['default'].strictEqual(typeof p, 'string', 'rimraf: path should be a string');
  assert__default['default'](options, 'rimraf: missing options');
  assert__default['default'].strictEqual(typeof options, 'object', 'rimraf: options should be object');

  try {
    st = options.lstatSync(p);
  } catch (er) {
    if (er.code === 'ENOENT') {
      return
    }

    // Windows can EPERM on stat.  Life is suffering.
    if (er.code === 'EPERM' && isWindows) {
      fixWinEPERMSync(p, options, er);
    }
  }

  try {
    // sunos lets the root user unlink directories, which is... weird.
    if (st && st.isDirectory()) {
      rmdirSync(p, options, null);
    } else {
      options.unlinkSync(p);
    }
  } catch (er) {
    if (er.code === 'ENOENT') {
      return
    } else if (er.code === 'EPERM') {
      return isWindows ? fixWinEPERMSync(p, options, er) : rmdirSync(p, options, er)
    } else if (er.code !== 'EISDIR') {
      throw er
    }
    rmdirSync(p, options, er);
  }
}

function rmdirSync (p, options, originalEr) {
  assert__default['default'](p);
  assert__default['default'](options);

  try {
    options.rmdirSync(p);
  } catch (er) {
    if (er.code === 'ENOTDIR') {
      throw originalEr
    } else if (er.code === 'ENOTEMPTY' || er.code === 'EEXIST' || er.code === 'EPERM') {
      rmkidsSync(p, options);
    } else if (er.code !== 'ENOENT') {
      throw er
    }
  }
}

function rmkidsSync (p, options) {
  assert__default['default'](p);
  assert__default['default'](options);
  options.readdirSync(p).forEach(f => rimrafSync(path__default['default'].join(p, f), options));

  if (isWindows) {
    // We only end up here once we got ENOTEMPTY at least once, and
    // at this point, we are guaranteed to have removed all the kids.
    // So, we know that it won't be ENOENT or ENOTDIR or anything else.
    // try really hard to delete stuff on windows, because it has a
    // PROFOUNDLY annoying habit of not closing handles promptly when
    // files are deleted, resulting in spurious ENOTEMPTY errors.
    const startTime = Date.now();
    do {
      try {
        const ret = options.rmdirSync(p, options);
        return ret
      } catch {}
    } while (Date.now() - startTime < 500) // give up after 500ms
  } else {
    const ret = options.rmdirSync(p, options);
    return ret
  }
}

var rimraf_1 = rimraf;
rimraf.sync = rimrafSync;

const u$7 = universalify.fromCallback;


function remove$1 (path, callback) {
  // Node 14.14.0+
  if (gracefulFs.rm) return gracefulFs.rm(path, { recursive: true, force: true }, callback)
  rimraf_1(path, callback);
}

function removeSync$1 (path) {
  // Node 14.14.0+
  if (gracefulFs.rmSync) return gracefulFs.rmSync(path, { recursive: true, force: true })
  rimraf_1.sync(path);
}

var remove_1 = {
  remove: u$7(remove$1),
  removeSync: removeSync$1
};

const u$6 = universalify.fromPromise;





const emptyDir = u$6(async function emptyDir (dir) {
  let items;
  try {
    items = await fs_1.readdir(dir);
  } catch {
    return mkdirs$2.mkdirs(dir)
  }

  return Promise.all(items.map(item => remove_1.remove(path__default['default'].join(dir, item))))
});

function emptyDirSync (dir) {
  let items;
  try {
    items = fs_1.readdirSync(dir);
  } catch {
    return mkdirs$2.mkdirsSync(dir)
  }

  items.forEach(item => {
    item = path__default['default'].join(dir, item);
    remove_1.removeSync(item);
  });
}

var empty = {
  emptyDirSync,
  emptydirSync: emptyDirSync,
  emptyDir,
  emptydir: emptyDir
};

const u$5 = universalify.fromCallback;




function createFile (file, callback) {
  function makeFile () {
    gracefulFs.writeFile(file, '', err => {
      if (err) return callback(err)
      callback();
    });
  }

  gracefulFs.stat(file, (err, stats) => { // eslint-disable-line handle-callback-err
    if (!err && stats.isFile()) return callback()
    const dir = path__default['default'].dirname(file);
    gracefulFs.stat(dir, (err, stats) => {
      if (err) {
        // if the directory doesn't exist, make it
        if (err.code === 'ENOENT') {
          return mkdirs$2.mkdirs(dir, err => {
            if (err) return callback(err)
            makeFile();
          })
        }
        return callback(err)
      }

      if (stats.isDirectory()) makeFile();
      else {
        // parent is not a directory
        // This is just to cause an internal ENOTDIR error to be thrown
        gracefulFs.readdir(dir, err => {
          if (err) return callback(err)
        });
      }
    });
  });
}

function createFileSync (file) {
  let stats;
  try {
    stats = gracefulFs.statSync(file);
  } catch {}
  if (stats && stats.isFile()) return

  const dir = path__default['default'].dirname(file);
  try {
    if (!gracefulFs.statSync(dir).isDirectory()) {
      // parent is not a directory
      // This is just to cause an internal ENOTDIR error to be thrown
      gracefulFs.readdirSync(dir);
    }
  } catch (err) {
    // If the stat call above failed because the directory doesn't exist, create it
    if (err && err.code === 'ENOENT') mkdirs$2.mkdirsSync(dir);
    else throw err
  }

  gracefulFs.writeFileSync(file, '');
}

var file = {
  createFile: u$5(createFile),
  createFileSync
};

const u$4 = universalify.fromCallback;



const pathExists$4 = pathExists_1.pathExists;
const { areIdentical: areIdentical$1 } = stat;

function createLink (srcpath, dstpath, callback) {
  function makeLink (srcpath, dstpath) {
    gracefulFs.link(srcpath, dstpath, err => {
      if (err) return callback(err)
      callback(null);
    });
  }

  gracefulFs.lstat(dstpath, (_, dstStat) => {
    gracefulFs.lstat(srcpath, (err, srcStat) => {
      if (err) {
        err.message = err.message.replace('lstat', 'ensureLink');
        return callback(err)
      }
      if (dstStat && areIdentical$1(srcStat, dstStat)) return callback(null)

      const dir = path__default['default'].dirname(dstpath);
      pathExists$4(dir, (err, dirExists) => {
        if (err) return callback(err)
        if (dirExists) return makeLink(srcpath, dstpath)
        mkdirs$2.mkdirs(dir, err => {
          if (err) return callback(err)
          makeLink(srcpath, dstpath);
        });
      });
    });
  });
}

function createLinkSync (srcpath, dstpath) {
  let dstStat;
  try {
    dstStat = gracefulFs.lstatSync(dstpath);
  } catch {}

  try {
    const srcStat = gracefulFs.lstatSync(srcpath);
    if (dstStat && areIdentical$1(srcStat, dstStat)) return
  } catch (err) {
    err.message = err.message.replace('lstat', 'ensureLink');
    throw err
  }

  const dir = path__default['default'].dirname(dstpath);
  const dirExists = gracefulFs.existsSync(dir);
  if (dirExists) return gracefulFs.linkSync(srcpath, dstpath)
  mkdirs$2.mkdirsSync(dir);

  return gracefulFs.linkSync(srcpath, dstpath)
}

var link = {
  createLink: u$4(createLink),
  createLinkSync
};

const pathExists$3 = pathExists_1.pathExists;

/**
 * Function that returns two types of paths, one relative to symlink, and one
 * relative to the current working directory. Checks if path is absolute or
 * relative. If the path is relative, this function checks if the path is
 * relative to symlink or relative to current working directory. This is an
 * initiative to find a smarter `srcpath` to supply when building symlinks.
 * This allows you to determine which path to use out of one of three possible
 * types of source paths. The first is an absolute path. This is detected by
 * `path.isAbsolute()`. When an absolute path is provided, it is checked to
 * see if it exists. If it does it's used, if not an error is returned
 * (callback)/ thrown (sync). The other two options for `srcpath` are a
 * relative url. By default Node's `fs.symlink` works by creating a symlink
 * using `dstpath` and expects the `srcpath` to be relative to the newly
 * created symlink. If you provide a `srcpath` that does not exist on the file
 * system it results in a broken symlink. To minimize this, the function
 * checks to see if the 'relative to symlink' source file exists, and if it
 * does it will use it. If it does not, it checks if there's a file that
 * exists that is relative to the current working directory, if does its used.
 * This preserves the expectations of the original fs.symlink spec and adds
 * the ability to pass in `relative to current working direcotry` paths.
 */

function symlinkPaths$1 (srcpath, dstpath, callback) {
  if (path__default['default'].isAbsolute(srcpath)) {
    return gracefulFs.lstat(srcpath, (err) => {
      if (err) {
        err.message = err.message.replace('lstat', 'ensureSymlink');
        return callback(err)
      }
      return callback(null, {
        toCwd: srcpath,
        toDst: srcpath
      })
    })
  } else {
    const dstdir = path__default['default'].dirname(dstpath);
    const relativeToDst = path__default['default'].join(dstdir, srcpath);
    return pathExists$3(relativeToDst, (err, exists) => {
      if (err) return callback(err)
      if (exists) {
        return callback(null, {
          toCwd: relativeToDst,
          toDst: srcpath
        })
      } else {
        return gracefulFs.lstat(srcpath, (err) => {
          if (err) {
            err.message = err.message.replace('lstat', 'ensureSymlink');
            return callback(err)
          }
          return callback(null, {
            toCwd: srcpath,
            toDst: path__default['default'].relative(dstdir, srcpath)
          })
        })
      }
    })
  }
}

function symlinkPathsSync$1 (srcpath, dstpath) {
  let exists;
  if (path__default['default'].isAbsolute(srcpath)) {
    exists = gracefulFs.existsSync(srcpath);
    if (!exists) throw new Error('absolute srcpath does not exist')
    return {
      toCwd: srcpath,
      toDst: srcpath
    }
  } else {
    const dstdir = path__default['default'].dirname(dstpath);
    const relativeToDst = path__default['default'].join(dstdir, srcpath);
    exists = gracefulFs.existsSync(relativeToDst);
    if (exists) {
      return {
        toCwd: relativeToDst,
        toDst: srcpath
      }
    } else {
      exists = gracefulFs.existsSync(srcpath);
      if (!exists) throw new Error('relative srcpath does not exist')
      return {
        toCwd: srcpath,
        toDst: path__default['default'].relative(dstdir, srcpath)
      }
    }
  }
}

var symlinkPaths_1 = {
  symlinkPaths: symlinkPaths$1,
  symlinkPathsSync: symlinkPathsSync$1
};

function symlinkType$1 (srcpath, type, callback) {
  callback = (typeof type === 'function') ? type : callback;
  type = (typeof type === 'function') ? false : type;
  if (type) return callback(null, type)
  gracefulFs.lstat(srcpath, (err, stats) => {
    if (err) return callback(null, 'file')
    type = (stats && stats.isDirectory()) ? 'dir' : 'file';
    callback(null, type);
  });
}

function symlinkTypeSync$1 (srcpath, type) {
  let stats;

  if (type) return type
  try {
    stats = gracefulFs.lstatSync(srcpath);
  } catch {
    return 'file'
  }
  return (stats && stats.isDirectory()) ? 'dir' : 'file'
}

var symlinkType_1 = {
  symlinkType: symlinkType$1,
  symlinkTypeSync: symlinkTypeSync$1
};

const u$3 = universalify.fromCallback;



const mkdirs = mkdirs$2.mkdirs;
const mkdirsSync = mkdirs$2.mkdirsSync;


const symlinkPaths = symlinkPaths_1.symlinkPaths;
const symlinkPathsSync = symlinkPaths_1.symlinkPathsSync;


const symlinkType = symlinkType_1.symlinkType;
const symlinkTypeSync = symlinkType_1.symlinkTypeSync;

const pathExists$2 = pathExists_1.pathExists;

const { areIdentical } = stat;

function createSymlink (srcpath, dstpath, type, callback) {
  callback = (typeof type === 'function') ? type : callback;
  type = (typeof type === 'function') ? false : type;

  fs_1.lstat(dstpath, (err, stats) => {
    if (!err && stats.isSymbolicLink()) {
      Promise.all([
        fs_1.stat(srcpath),
        fs_1.stat(dstpath)
      ]).then(([srcStat, dstStat]) => {
        if (areIdentical(srcStat, dstStat)) return callback(null)
        _createSymlink(srcpath, dstpath, type, callback);
      });
    } else _createSymlink(srcpath, dstpath, type, callback);
  });
}

function _createSymlink (srcpath, dstpath, type, callback) {
  symlinkPaths(srcpath, dstpath, (err, relative) => {
    if (err) return callback(err)
    srcpath = relative.toDst;
    symlinkType(relative.toCwd, type, (err, type) => {
      if (err) return callback(err)
      const dir = path__default['default'].dirname(dstpath);
      pathExists$2(dir, (err, dirExists) => {
        if (err) return callback(err)
        if (dirExists) return fs_1.symlink(srcpath, dstpath, type, callback)
        mkdirs(dir, err => {
          if (err) return callback(err)
          fs_1.symlink(srcpath, dstpath, type, callback);
        });
      });
    });
  });
}

function createSymlinkSync (srcpath, dstpath, type) {
  let stats;
  try {
    stats = fs_1.lstatSync(dstpath);
  } catch {}
  if (stats && stats.isSymbolicLink()) {
    const srcStat = fs_1.statSync(srcpath);
    const dstStat = fs_1.statSync(dstpath);
    if (areIdentical(srcStat, dstStat)) return
  }

  const relative = symlinkPathsSync(srcpath, dstpath);
  srcpath = relative.toDst;
  type = symlinkTypeSync(relative.toCwd, type);
  const dir = path__default['default'].dirname(dstpath);
  const exists = fs_1.existsSync(dir);
  if (exists) return fs_1.symlinkSync(srcpath, dstpath, type)
  mkdirsSync(dir);
  return fs_1.symlinkSync(srcpath, dstpath, type)
}

var symlink = {
  createSymlink: u$3(createSymlink),
  createSymlinkSync
};

var ensure = {
  // file
  createFile: file.createFile,
  createFileSync: file.createFileSync,
  ensureFile: file.createFile,
  ensureFileSync: file.createFileSync,
  // link
  createLink: link.createLink,
  createLinkSync: link.createLinkSync,
  ensureLink: link.createLink,
  ensureLinkSync: link.createLinkSync,
  // symlink
  createSymlink: symlink.createSymlink,
  createSymlinkSync: symlink.createSymlinkSync,
  ensureSymlink: symlink.createSymlink,
  ensureSymlinkSync: symlink.createSymlinkSync
};

function stringify$3 (obj, { EOL = '\n', finalEOL = true, replacer = null, spaces } = {}) {
  const EOF = finalEOL ? EOL : '';
  const str = JSON.stringify(obj, replacer, spaces);

  return str.replace(/\n/g, EOL) + EOF
}

function stripBom$1 (content) {
  // we do this because JSON.parse would convert it to a utf8 string if encoding wasn't specified
  if (Buffer.isBuffer(content)) content = content.toString('utf8');
  return content.replace(/^\uFEFF/, '')
}

var utils = { stringify: stringify$3, stripBom: stripBom$1 };

let _fs;
try {
  _fs = gracefulFs;
} catch (_) {
  _fs = fs__default['default'];
}

const { stringify: stringify$2, stripBom } = utils;

async function _readFile (file, options = {}) {
  if (typeof options === 'string') {
    options = { encoding: options };
  }

  const fs = options.fs || _fs;

  const shouldThrow = 'throws' in options ? options.throws : true;

  let data = await universalify.fromCallback(fs.readFile)(file, options);

  data = stripBom(data);

  let obj;
  try {
    obj = JSON.parse(data, options ? options.reviver : null);
  } catch (err) {
    if (shouldThrow) {
      err.message = `${file}: ${err.message}`;
      throw err
    } else {
      return null
    }
  }

  return obj
}

const readFile = universalify.fromPromise(_readFile);

function readFileSync (file, options = {}) {
  if (typeof options === 'string') {
    options = { encoding: options };
  }

  const fs = options.fs || _fs;

  const shouldThrow = 'throws' in options ? options.throws : true;

  try {
    let content = fs.readFileSync(file, options);
    content = stripBom(content);
    return JSON.parse(content, options.reviver)
  } catch (err) {
    if (shouldThrow) {
      err.message = `${file}: ${err.message}`;
      throw err
    } else {
      return null
    }
  }
}

async function _writeFile (file, obj, options = {}) {
  const fs = options.fs || _fs;

  const str = stringify$2(obj, options);

  await universalify.fromCallback(fs.writeFile)(file, str, options);
}

const writeFile$1 = universalify.fromPromise(_writeFile);

function writeFileSync$1 (file, obj, options = {}) {
  const fs = options.fs || _fs;

  const str = stringify$2(obj, options);
  // not sure if fs.writeFileSync returns anything, but just in case
  return fs.writeFileSync(file, str, options)
}

const jsonfile$1 = {
  readFile,
  readFileSync,
  writeFile: writeFile$1,
  writeFileSync: writeFileSync$1
};

var jsonfile_1 = jsonfile$1;

var jsonfile = {
  // jsonfile exports
  readJson: jsonfile_1.readFile,
  readJsonSync: jsonfile_1.readFileSync,
  writeJson: jsonfile_1.writeFile,
  writeJsonSync: jsonfile_1.writeFileSync
};

const u$2 = universalify.fromCallback;



const pathExists$1 = pathExists_1.pathExists;

function outputFile$1 (file, data, encoding, callback) {
  if (typeof encoding === 'function') {
    callback = encoding;
    encoding = 'utf8';
  }

  const dir = path__default['default'].dirname(file);
  pathExists$1(dir, (err, itDoes) => {
    if (err) return callback(err)
    if (itDoes) return gracefulFs.writeFile(file, data, encoding, callback)

    mkdirs$2.mkdirs(dir, err => {
      if (err) return callback(err)

      gracefulFs.writeFile(file, data, encoding, callback);
    });
  });
}

function outputFileSync$1 (file, ...args) {
  const dir = path__default['default'].dirname(file);
  if (gracefulFs.existsSync(dir)) {
    return gracefulFs.writeFileSync(file, ...args)
  }
  mkdirs$2.mkdirsSync(dir);
  gracefulFs.writeFileSync(file, ...args);
}

var output = {
  outputFile: u$2(outputFile$1),
  outputFileSync: outputFileSync$1
};

const { stringify: stringify$1 } = utils;
const { outputFile } = output;

async function outputJson (file, data, options = {}) {
  const str = stringify$1(data, options);

  await outputFile(file, str, options);
}

var outputJson_1 = outputJson;

const { stringify } = utils;
const { outputFileSync } = output;

function outputJsonSync (file, data, options) {
  const str = stringify(data, options);

  outputFileSync(file, str, options);
}

var outputJsonSync_1 = outputJsonSync;

const u$1 = universalify.fromPromise;


jsonfile.outputJson = u$1(outputJson_1);
jsonfile.outputJsonSync = outputJsonSync_1;
// aliases
jsonfile.outputJSON = jsonfile.outputJson;
jsonfile.outputJSONSync = jsonfile.outputJsonSync;
jsonfile.writeJSON = jsonfile.writeJson;
jsonfile.writeJSONSync = jsonfile.writeJsonSync;
jsonfile.readJSON = jsonfile.readJson;
jsonfile.readJSONSync = jsonfile.readJsonSync;

var json = jsonfile;

const copySync = copySync$1.copySync;
const removeSync = remove_1.removeSync;
const mkdirpSync = mkdirs$2.mkdirpSync;


function moveSync$1 (src, dest, opts) {
  opts = opts || {};
  const overwrite = opts.overwrite || opts.clobber || false;

  const { srcStat, isChangingCase = false } = stat.checkPathsSync(src, dest, 'move', opts);
  stat.checkParentPathsSync(src, srcStat, dest, 'move');
  if (!isParentRoot$1(dest)) mkdirpSync(path__default['default'].dirname(dest));
  return doRename$1(src, dest, overwrite, isChangingCase)
}

function isParentRoot$1 (dest) {
  const parent = path__default['default'].dirname(dest);
  const parsedPath = path__default['default'].parse(parent);
  return parsedPath.root === parent
}

function doRename$1 (src, dest, overwrite, isChangingCase) {
  if (isChangingCase) return rename$1(src, dest, overwrite)
  if (overwrite) {
    removeSync(dest);
    return rename$1(src, dest, overwrite)
  }
  if (gracefulFs.existsSync(dest)) throw new Error('dest already exists.')
  return rename$1(src, dest, overwrite)
}

function rename$1 (src, dest, overwrite) {
  try {
    gracefulFs.renameSync(src, dest);
  } catch (err) {
    if (err.code !== 'EXDEV') throw err
    return moveAcrossDevice$1(src, dest, overwrite)
  }
}

function moveAcrossDevice$1 (src, dest, overwrite) {
  const opts = {
    overwrite,
    errorOnExist: true
  };
  copySync(src, dest, opts);
  return removeSync(src)
}

var moveSync_1 = moveSync$1;

var moveSync = {
  moveSync: moveSync_1
};

const copy$1 = copy$2.copy;
const remove = remove_1.remove;
const mkdirp = mkdirs$2.mkdirp;
const pathExists = pathExists_1.pathExists;


function move$1 (src, dest, opts, cb) {
  if (typeof opts === 'function') {
    cb = opts;
    opts = {};
  }

  const overwrite = opts.overwrite || opts.clobber || false;

  stat.checkPaths(src, dest, 'move', opts, (err, stats) => {
    if (err) return cb(err)
    const { srcStat, isChangingCase = false } = stats;
    stat.checkParentPaths(src, srcStat, dest, 'move', err => {
      if (err) return cb(err)
      if (isParentRoot(dest)) return doRename(src, dest, overwrite, isChangingCase, cb)
      mkdirp(path__default['default'].dirname(dest), err => {
        if (err) return cb(err)
        return doRename(src, dest, overwrite, isChangingCase, cb)
      });
    });
  });
}

function isParentRoot (dest) {
  const parent = path__default['default'].dirname(dest);
  const parsedPath = path__default['default'].parse(parent);
  return parsedPath.root === parent
}

function doRename (src, dest, overwrite, isChangingCase, cb) {
  if (isChangingCase) return rename(src, dest, overwrite, cb)
  if (overwrite) {
    return remove(dest, err => {
      if (err) return cb(err)
      return rename(src, dest, overwrite, cb)
    })
  }
  pathExists(dest, (err, destExists) => {
    if (err) return cb(err)
    if (destExists) return cb(new Error('dest already exists.'))
    return rename(src, dest, overwrite, cb)
  });
}

function rename (src, dest, overwrite, cb) {
  gracefulFs.rename(src, dest, err => {
    if (!err) return cb()
    if (err.code !== 'EXDEV') return cb(err)
    return moveAcrossDevice(src, dest, overwrite, cb)
  });
}

function moveAcrossDevice (src, dest, overwrite, cb) {
  const opts = {
    overwrite,
    errorOnExist: true
  };
  copy$1(src, dest, opts, err => {
    if (err) return cb(err)
    return remove(src, cb)
  });
}

var move_1 = move$1;

const u = universalify.fromCallback;
var move = {
  move: u(move_1)
};

var lib = {
  // Export promiseified graceful-fs:
  ...fs_1,
  // Export extra methods:
  ...copySync$1,
  ...copy$2,
  ...empty,
  ...ensure,
  ...json,
  ...mkdirs$2,
  ...moveSync,
  ...move,
  ...output,
  ...pathExists_1,
  ...remove_1
};

const maybeJoin = (...args) => args.every(arg => arg) ? args.join('') : '';
const maybeEncode = (arg) => arg ? encodeURIComponent(arg) : '';

const defaults = {
  sshtemplate: ({ domain, user, project, committish }) => `git@${domain}:${user}/${project}.git${maybeJoin('#', committish)}`,
  sshurltemplate: ({ domain, user, project, committish }) => `git+ssh://git@${domain}/${user}/${project}.git${maybeJoin('#', committish)}`,
  browsetemplate: ({ domain, user, project, committish, treepath }) => `https://${domain}/${user}/${project}${maybeJoin('/', treepath, '/', maybeEncode(committish))}`,
  browsefiletemplate: ({ domain, user, project, committish, treepath, path, fragment, hashformat }) => `https://${domain}/${user}/${project}/${treepath}/${maybeEncode(committish || 'master')}/${path}${maybeJoin('#', hashformat(fragment || ''))}`,
  docstemplate: ({ domain, user, project, treepath, committish }) => `https://${domain}/${user}/${project}${maybeJoin('/', treepath, '/', maybeEncode(committish))}#readme`,
  httpstemplate: ({ auth, domain, user, project, committish }) => `git+https://${maybeJoin(auth, '@')}${domain}/${user}/${project}.git${maybeJoin('#', committish)}`,
  filetemplate: ({ domain, user, project, committish, path }) => `https://${domain}/${user}/${project}/raw/${maybeEncode(committish) || 'master'}/${path}`,
  shortcuttemplate: ({ type, user, project, committish }) => `${type}:${user}/${project}${maybeJoin('#', committish)}`,
  pathtemplate: ({ user, project, committish }) => `${user}/${project}${maybeJoin('#', committish)}`,
  bugstemplate: ({ domain, user, project }) => `https://${domain}/${user}/${project}/issues`,
  hashformat: formatHashFragment
};

const gitHosts = {};
gitHosts.github = Object.assign({}, defaults, {
  // First two are insecure and generally shouldn't be used any more, but
  // they are still supported.
  protocols: ['git:', 'http:', 'git+ssh:', 'git+https:', 'ssh:', 'https:'],
  domain: 'github.com',
  treepath: 'tree',
  filetemplate: ({ auth, user, project, committish, path }) => `https://${maybeJoin(auth, '@')}raw.githubusercontent.com/${user}/${project}/${maybeEncode(committish) || 'master'}/${path}`,
  gittemplate: ({ auth, domain, user, project, committish }) => `git://${maybeJoin(auth, '@')}${domain}/${user}/${project}.git${maybeJoin('#', committish)}`,
  tarballtemplate: ({ domain, user, project, committish }) => `https://codeload.${domain}/${user}/${project}/tar.gz/${maybeEncode(committish) || 'master'}`,
  extract: (url) => {
    let [, user, project, type, committish] = url.pathname.split('/', 5);
    if (type && type !== 'tree') {
      return
    }

    if (!type) {
      committish = url.hash.slice(1);
    }

    if (project && project.endsWith('.git')) {
      project = project.slice(0, -4);
    }

    if (!user || !project) {
      return
    }

    return { user, project, committish }
  }
});

gitHosts.bitbucket = Object.assign({}, defaults, {
  protocols: ['git+ssh:', 'git+https:', 'ssh:', 'https:'],
  domain: 'bitbucket.org',
  treepath: 'src',
  tarballtemplate: ({ domain, user, project, committish }) => `https://${domain}/${user}/${project}/get/${maybeEncode(committish) || 'master'}.tar.gz`,
  extract: (url) => {
    let [, user, project, aux] = url.pathname.split('/', 4);
    if (['get'].includes(aux)) {
      return
    }

    if (project && project.endsWith('.git')) {
      project = project.slice(0, -4);
    }

    if (!user || !project) {
      return
    }

    return { user, project, committish: url.hash.slice(1) }
  }
});

gitHosts.gitlab = Object.assign({}, defaults, {
  protocols: ['git+ssh:', 'git+https:', 'ssh:', 'https:'],
  domain: 'gitlab.com',
  treepath: 'tree',
  httpstemplate: ({ auth, domain, user, project, committish }) => `git+https://${maybeJoin(auth, '@')}${domain}/${user}/${project}.git${maybeJoin('#', committish)}`,
  tarballtemplate: ({ domain, user, project, committish }) => `https://${domain}/${user}/${project}/repository/archive.tar.gz?ref=${maybeEncode(committish) || 'master'}`,
  extract: (url) => {
    const path = url.pathname.slice(1);
    if (path.includes('/-/') || path.includes('/archive.tar.gz')) {
      return
    }

    const segments = path.split('/');
    let project = segments.pop();
    if (project.endsWith('.git')) {
      project = project.slice(0, -4);
    }

    const user = segments.join('/');
    if (!user || !project) {
      return
    }

    return { user, project, committish: url.hash.slice(1) }
  }
});

gitHosts.gist = Object.assign({}, defaults, {
  protocols: ['git:', 'git+ssh:', 'git+https:', 'ssh:', 'https:'],
  domain: 'gist.github.com',
  sshtemplate: ({ domain, project, committish }) => `git@${domain}:${project}.git${maybeJoin('#', committish)}`,
  sshurltemplate: ({ domain, project, committish }) => `git+ssh://git@${domain}/${project}.git${maybeJoin('#', committish)}`,
  browsetemplate: ({ domain, project, committish }) => `https://${domain}/${project}${maybeJoin('/', maybeEncode(committish))}`,
  browsefiletemplate: ({ domain, project, committish, path, hashformat }) => `https://${domain}/${project}${maybeJoin('/', maybeEncode(committish))}${maybeJoin('#', hashformat(path))}`,
  docstemplate: ({ domain, project, committish }) => `https://${domain}/${project}${maybeJoin('/', maybeEncode(committish))}`,
  httpstemplate: ({ domain, project, committish }) => `git+https://${domain}/${project}.git${maybeJoin('#', committish)}`,
  filetemplate: ({ user, project, committish, path }) => `https://gist.githubusercontent.com/${user}/${project}/raw${maybeJoin('/', maybeEncode(committish))}/${path}`,
  shortcuttemplate: ({ type, project, committish }) => `${type}:${project}${maybeJoin('#', committish)}`,
  pathtemplate: ({ project, committish }) => `${project}${maybeJoin('#', committish)}`,
  bugstemplate: ({ domain, project }) => `https://${domain}/${project}`,
  gittemplate: ({ domain, project, committish }) => `git://${domain}/${project}.git${maybeJoin('#', committish)}`,
  tarballtemplate: ({ project, committish }) => `https://codeload.github.com/gist/${project}/tar.gz/${maybeEncode(committish) || 'master'}`,
  extract: (url) => {
    let [, user, project, aux] = url.pathname.split('/', 4);
    if (aux === 'raw') {
      return
    }

    if (!project) {
      if (!user) {
        return
      }

      project = user;
      user = null;
    }

    if (project.endsWith('.git')) {
      project = project.slice(0, -4);
    }

    return { user, project, committish: url.hash.slice(1) }
  },
  hashformat: function (fragment) {
    return fragment && 'file-' + formatHashFragment(fragment)
  }
});

const names$1 = Object.keys(gitHosts);
gitHosts.byShortcut = {};
gitHosts.byDomain = {};
for (const name of names$1) {
  gitHosts.byShortcut[`${name}:`] = name;
  gitHosts.byDomain[gitHosts[name].domain] = name;
}

function formatHashFragment (fragment) {
  return fragment.toLowerCase().replace(/^\W+|\/|\W+$/g, '').replace(/\W+/g, '-')
}

var gitHostInfo = gitHosts;

class GitHost {
  constructor (type, user, auth, project, committish, defaultRepresentation, opts = {}) {
    Object.assign(this, gitHostInfo[type]);
    this.type = type;
    this.user = user;
    this.auth = auth;
    this.project = project;
    this.committish = committish;
    this.default = defaultRepresentation;
    this.opts = opts;
  }

  hash () {
    return this.committish ? `#${this.committish}` : ''
  }

  ssh (opts) {
    return this._fill(this.sshtemplate, opts)
  }

  _fill (template, opts) {
    if (typeof template === 'function') {
      const options = { ...this, ...this.opts, ...opts };

      // the path should always be set so we don't end up with 'undefined' in urls
      if (!options.path) {
        options.path = '';
      }

      // template functions will insert the leading slash themselves
      if (options.path.startsWith('/')) {
        options.path = options.path.slice(1);
      }

      if (options.noCommittish) {
        options.committish = null;
      }

      const result = template(options);
      return options.noGitPlus && result.startsWith('git+') ? result.slice(4) : result
    }

    return null
  }

  sshurl (opts) {
    return this._fill(this.sshurltemplate, opts)
  }

  browse (path, fragment, opts) {
    // not a string, treat path as opts
    if (typeof path !== 'string') {
      return this._fill(this.browsetemplate, path)
    }

    if (typeof fragment !== 'string') {
      opts = fragment;
      fragment = null;
    }
    return this._fill(this.browsefiletemplate, { ...opts, fragment, path })
  }

  docs (opts) {
    return this._fill(this.docstemplate, opts)
  }

  bugs (opts) {
    return this._fill(this.bugstemplate, opts)
  }

  https (opts) {
    return this._fill(this.httpstemplate, opts)
  }

  git (opts) {
    return this._fill(this.gittemplate, opts)
  }

  shortcut (opts) {
    return this._fill(this.shortcuttemplate, opts)
  }

  path (opts) {
    return this._fill(this.pathtemplate, opts)
  }

  tarball (opts) {
    return this._fill(this.tarballtemplate, { ...opts, noCommittish: false })
  }

  file (path, opts) {
    return this._fill(this.filetemplate, { ...opts, path })
  }

  getDefaultRepresentation () {
    return this.default
  }

  toString (opts) {
    if (this.default && typeof this[this.default] === 'function') {
      return this[this.default](opts)
    }

    return this.sshurl(opts)
  }
}
var gitHost = GitHost;

var iterator = function (Yallist) {
  Yallist.prototype[Symbol.iterator] = function* () {
    for (let walker = this.head; walker; walker = walker.next) {
      yield walker.value;
    }
  };
};

var yallist = Yallist;

Yallist.Node = Node;
Yallist.create = Yallist;

function Yallist (list) {
  var self = this;
  if (!(self instanceof Yallist)) {
    self = new Yallist();
  }

  self.tail = null;
  self.head = null;
  self.length = 0;

  if (list && typeof list.forEach === 'function') {
    list.forEach(function (item) {
      self.push(item);
    });
  } else if (arguments.length > 0) {
    for (var i = 0, l = arguments.length; i < l; i++) {
      self.push(arguments[i]);
    }
  }

  return self
}

Yallist.prototype.removeNode = function (node) {
  if (node.list !== this) {
    throw new Error('removing node which does not belong to this list')
  }

  var next = node.next;
  var prev = node.prev;

  if (next) {
    next.prev = prev;
  }

  if (prev) {
    prev.next = next;
  }

  if (node === this.head) {
    this.head = next;
  }
  if (node === this.tail) {
    this.tail = prev;
  }

  node.list.length--;
  node.next = null;
  node.prev = null;
  node.list = null;

  return next
};

Yallist.prototype.unshiftNode = function (node) {
  if (node === this.head) {
    return
  }

  if (node.list) {
    node.list.removeNode(node);
  }

  var head = this.head;
  node.list = this;
  node.next = head;
  if (head) {
    head.prev = node;
  }

  this.head = node;
  if (!this.tail) {
    this.tail = node;
  }
  this.length++;
};

Yallist.prototype.pushNode = function (node) {
  if (node === this.tail) {
    return
  }

  if (node.list) {
    node.list.removeNode(node);
  }

  var tail = this.tail;
  node.list = this;
  node.prev = tail;
  if (tail) {
    tail.next = node;
  }

  this.tail = node;
  if (!this.head) {
    this.head = node;
  }
  this.length++;
};

Yallist.prototype.push = function () {
  for (var i = 0, l = arguments.length; i < l; i++) {
    push(this, arguments[i]);
  }
  return this.length
};

Yallist.prototype.unshift = function () {
  for (var i = 0, l = arguments.length; i < l; i++) {
    unshift(this, arguments[i]);
  }
  return this.length
};

Yallist.prototype.pop = function () {
  if (!this.tail) {
    return undefined
  }

  var res = this.tail.value;
  this.tail = this.tail.prev;
  if (this.tail) {
    this.tail.next = null;
  } else {
    this.head = null;
  }
  this.length--;
  return res
};

Yallist.prototype.shift = function () {
  if (!this.head) {
    return undefined
  }

  var res = this.head.value;
  this.head = this.head.next;
  if (this.head) {
    this.head.prev = null;
  } else {
    this.tail = null;
  }
  this.length--;
  return res
};

Yallist.prototype.forEach = function (fn, thisp) {
  thisp = thisp || this;
  for (var walker = this.head, i = 0; walker !== null; i++) {
    fn.call(thisp, walker.value, i, this);
    walker = walker.next;
  }
};

Yallist.prototype.forEachReverse = function (fn, thisp) {
  thisp = thisp || this;
  for (var walker = this.tail, i = this.length - 1; walker !== null; i--) {
    fn.call(thisp, walker.value, i, this);
    walker = walker.prev;
  }
};

Yallist.prototype.get = function (n) {
  for (var i = 0, walker = this.head; walker !== null && i < n; i++) {
    // abort out of the list early if we hit a cycle
    walker = walker.next;
  }
  if (i === n && walker !== null) {
    return walker.value
  }
};

Yallist.prototype.getReverse = function (n) {
  for (var i = 0, walker = this.tail; walker !== null && i < n; i++) {
    // abort out of the list early if we hit a cycle
    walker = walker.prev;
  }
  if (i === n && walker !== null) {
    return walker.value
  }
};

Yallist.prototype.map = function (fn, thisp) {
  thisp = thisp || this;
  var res = new Yallist();
  for (var walker = this.head; walker !== null;) {
    res.push(fn.call(thisp, walker.value, this));
    walker = walker.next;
  }
  return res
};

Yallist.prototype.mapReverse = function (fn, thisp) {
  thisp = thisp || this;
  var res = new Yallist();
  for (var walker = this.tail; walker !== null;) {
    res.push(fn.call(thisp, walker.value, this));
    walker = walker.prev;
  }
  return res
};

Yallist.prototype.reduce = function (fn, initial) {
  var acc;
  var walker = this.head;
  if (arguments.length > 1) {
    acc = initial;
  } else if (this.head) {
    walker = this.head.next;
    acc = this.head.value;
  } else {
    throw new TypeError('Reduce of empty list with no initial value')
  }

  for (var i = 0; walker !== null; i++) {
    acc = fn(acc, walker.value, i);
    walker = walker.next;
  }

  return acc
};

Yallist.prototype.reduceReverse = function (fn, initial) {
  var acc;
  var walker = this.tail;
  if (arguments.length > 1) {
    acc = initial;
  } else if (this.tail) {
    walker = this.tail.prev;
    acc = this.tail.value;
  } else {
    throw new TypeError('Reduce of empty list with no initial value')
  }

  for (var i = this.length - 1; walker !== null; i--) {
    acc = fn(acc, walker.value, i);
    walker = walker.prev;
  }

  return acc
};

Yallist.prototype.toArray = function () {
  var arr = new Array(this.length);
  for (var i = 0, walker = this.head; walker !== null; i++) {
    arr[i] = walker.value;
    walker = walker.next;
  }
  return arr
};

Yallist.prototype.toArrayReverse = function () {
  var arr = new Array(this.length);
  for (var i = 0, walker = this.tail; walker !== null; i++) {
    arr[i] = walker.value;
    walker = walker.prev;
  }
  return arr
};

Yallist.prototype.slice = function (from, to) {
  to = to || this.length;
  if (to < 0) {
    to += this.length;
  }
  from = from || 0;
  if (from < 0) {
    from += this.length;
  }
  var ret = new Yallist();
  if (to < from || to < 0) {
    return ret
  }
  if (from < 0) {
    from = 0;
  }
  if (to > this.length) {
    to = this.length;
  }
  for (var i = 0, walker = this.head; walker !== null && i < from; i++) {
    walker = walker.next;
  }
  for (; walker !== null && i < to; i++, walker = walker.next) {
    ret.push(walker.value);
  }
  return ret
};

Yallist.prototype.sliceReverse = function (from, to) {
  to = to || this.length;
  if (to < 0) {
    to += this.length;
  }
  from = from || 0;
  if (from < 0) {
    from += this.length;
  }
  var ret = new Yallist();
  if (to < from || to < 0) {
    return ret
  }
  if (from < 0) {
    from = 0;
  }
  if (to > this.length) {
    to = this.length;
  }
  for (var i = this.length, walker = this.tail; walker !== null && i > to; i--) {
    walker = walker.prev;
  }
  for (; walker !== null && i > from; i--, walker = walker.prev) {
    ret.push(walker.value);
  }
  return ret
};

Yallist.prototype.splice = function (start, deleteCount, ...nodes) {
  if (start > this.length) {
    start = this.length - 1;
  }
  if (start < 0) {
    start = this.length + start;
  }

  for (var i = 0, walker = this.head; walker !== null && i < start; i++) {
    walker = walker.next;
  }

  var ret = [];
  for (var i = 0; walker && i < deleteCount; i++) {
    ret.push(walker.value);
    walker = this.removeNode(walker);
  }
  if (walker === null) {
    walker = this.tail;
  }

  if (walker !== this.head && walker !== this.tail) {
    walker = walker.prev;
  }

  for (var i = 0; i < nodes.length; i++) {
    walker = insert(this, walker, nodes[i]);
  }
  return ret;
};

Yallist.prototype.reverse = function () {
  var head = this.head;
  var tail = this.tail;
  for (var walker = head; walker !== null; walker = walker.prev) {
    var p = walker.prev;
    walker.prev = walker.next;
    walker.next = p;
  }
  this.head = tail;
  this.tail = head;
  return this
};

function insert (self, node, value) {
  var inserted = node === self.head ?
    new Node(value, null, node, self) :
    new Node(value, node, node.next, self);

  if (inserted.next === null) {
    self.tail = inserted;
  }
  if (inserted.prev === null) {
    self.head = inserted;
  }

  self.length++;

  return inserted
}

function push (self, item) {
  self.tail = new Node(item, self.tail, null, self);
  if (!self.head) {
    self.head = self.tail;
  }
  self.length++;
}

function unshift (self, item) {
  self.head = new Node(item, null, self.head, self);
  if (!self.tail) {
    self.tail = self.head;
  }
  self.length++;
}

function Node (value, prev, next, list) {
  if (!(this instanceof Node)) {
    return new Node(value, prev, next, list)
  }

  this.list = list;
  this.value = value;

  if (prev) {
    prev.next = this;
    this.prev = prev;
  } else {
    this.prev = null;
  }

  if (next) {
    next.prev = this;
    this.next = next;
  } else {
    this.next = null;
  }
}

try {
  // add if support for Symbol.iterator is present
  iterator(Yallist);
} catch (er) {}

// A linked list to keep track of recently-used-ness


const MAX = Symbol('max');
const LENGTH = Symbol('length');
const LENGTH_CALCULATOR = Symbol('lengthCalculator');
const ALLOW_STALE = Symbol('allowStale');
const MAX_AGE = Symbol('maxAge');
const DISPOSE = Symbol('dispose');
const NO_DISPOSE_ON_SET = Symbol('noDisposeOnSet');
const LRU_LIST = Symbol('lruList');
const CACHE = Symbol('cache');
const UPDATE_AGE_ON_GET = Symbol('updateAgeOnGet');

const naiveLength = () => 1;

// lruList is a yallist where the head is the youngest
// item, and the tail is the oldest.  the list contains the Hit
// objects as the entries.
// Each Hit object has a reference to its Yallist.Node.  This
// never changes.
//
// cache is a Map (or PseudoMap) that matches the keys to
// the Yallist.Node object.
class LRUCache {
  constructor (options) {
    if (typeof options === 'number')
      options = { max: options };

    if (!options)
      options = {};

    if (options.max && (typeof options.max !== 'number' || options.max < 0))
      throw new TypeError('max must be a non-negative number')
    // Kind of weird to have a default max of Infinity, but oh well.
    this[MAX] = options.max || Infinity;

    const lc = options.length || naiveLength;
    this[LENGTH_CALCULATOR] = (typeof lc !== 'function') ? naiveLength : lc;
    this[ALLOW_STALE] = options.stale || false;
    if (options.maxAge && typeof options.maxAge !== 'number')
      throw new TypeError('maxAge must be a number')
    this[MAX_AGE] = options.maxAge || 0;
    this[DISPOSE] = options.dispose;
    this[NO_DISPOSE_ON_SET] = options.noDisposeOnSet || false;
    this[UPDATE_AGE_ON_GET] = options.updateAgeOnGet || false;
    this.reset();
  }

  // resize the cache when the max changes.
  set max (mL) {
    if (typeof mL !== 'number' || mL < 0)
      throw new TypeError('max must be a non-negative number')

    this[MAX] = mL || Infinity;
    trim(this);
  }
  get max () {
    return this[MAX]
  }

  set allowStale (allowStale) {
    this[ALLOW_STALE] = !!allowStale;
  }
  get allowStale () {
    return this[ALLOW_STALE]
  }

  set maxAge (mA) {
    if (typeof mA !== 'number')
      throw new TypeError('maxAge must be a non-negative number')

    this[MAX_AGE] = mA;
    trim(this);
  }
  get maxAge () {
    return this[MAX_AGE]
  }

  // resize the cache when the lengthCalculator changes.
  set lengthCalculator (lC) {
    if (typeof lC !== 'function')
      lC = naiveLength;

    if (lC !== this[LENGTH_CALCULATOR]) {
      this[LENGTH_CALCULATOR] = lC;
      this[LENGTH] = 0;
      this[LRU_LIST].forEach(hit => {
        hit.length = this[LENGTH_CALCULATOR](hit.value, hit.key);
        this[LENGTH] += hit.length;
      });
    }
    trim(this);
  }
  get lengthCalculator () { return this[LENGTH_CALCULATOR] }

  get length () { return this[LENGTH] }
  get itemCount () { return this[LRU_LIST].length }

  rforEach (fn, thisp) {
    thisp = thisp || this;
    for (let walker = this[LRU_LIST].tail; walker !== null;) {
      const prev = walker.prev;
      forEachStep(this, fn, walker, thisp);
      walker = prev;
    }
  }

  forEach (fn, thisp) {
    thisp = thisp || this;
    for (let walker = this[LRU_LIST].head; walker !== null;) {
      const next = walker.next;
      forEachStep(this, fn, walker, thisp);
      walker = next;
    }
  }

  keys () {
    return this[LRU_LIST].toArray().map(k => k.key)
  }

  values () {
    return this[LRU_LIST].toArray().map(k => k.value)
  }

  reset () {
    if (this[DISPOSE] &&
        this[LRU_LIST] &&
        this[LRU_LIST].length) {
      this[LRU_LIST].forEach(hit => this[DISPOSE](hit.key, hit.value));
    }

    this[CACHE] = new Map(); // hash of items by key
    this[LRU_LIST] = new yallist(); // list of items in order of use recency
    this[LENGTH] = 0; // length of items in the list
  }

  dump () {
    return this[LRU_LIST].map(hit =>
      isStale(this, hit) ? false : {
        k: hit.key,
        v: hit.value,
        e: hit.now + (hit.maxAge || 0)
      }).toArray().filter(h => h)
  }

  dumpLru () {
    return this[LRU_LIST]
  }

  set (key, value, maxAge) {
    maxAge = maxAge || this[MAX_AGE];

    if (maxAge && typeof maxAge !== 'number')
      throw new TypeError('maxAge must be a number')

    const now = maxAge ? Date.now() : 0;
    const len = this[LENGTH_CALCULATOR](value, key);

    if (this[CACHE].has(key)) {
      if (len > this[MAX]) {
        del(this, this[CACHE].get(key));
        return false
      }

      const node = this[CACHE].get(key);
      const item = node.value;

      // dispose of the old one before overwriting
      // split out into 2 ifs for better coverage tracking
      if (this[DISPOSE]) {
        if (!this[NO_DISPOSE_ON_SET])
          this[DISPOSE](key, item.value);
      }

      item.now = now;
      item.maxAge = maxAge;
      item.value = value;
      this[LENGTH] += len - item.length;
      item.length = len;
      this.get(key);
      trim(this);
      return true
    }

    const hit = new Entry(key, value, len, now, maxAge);

    // oversized objects fall out of cache automatically.
    if (hit.length > this[MAX]) {
      if (this[DISPOSE])
        this[DISPOSE](key, value);

      return false
    }

    this[LENGTH] += hit.length;
    this[LRU_LIST].unshift(hit);
    this[CACHE].set(key, this[LRU_LIST].head);
    trim(this);
    return true
  }

  has (key) {
    if (!this[CACHE].has(key)) return false
    const hit = this[CACHE].get(key).value;
    return !isStale(this, hit)
  }

  get (key) {
    return get(this, key, true)
  }

  peek (key) {
    return get(this, key, false)
  }

  pop () {
    const node = this[LRU_LIST].tail;
    if (!node)
      return null

    del(this, node);
    return node.value
  }

  del (key) {
    del(this, this[CACHE].get(key));
  }

  load (arr) {
    // reset the cache
    this.reset();

    const now = Date.now();
    // A previous serialized cache has the most recent items first
    for (let l = arr.length - 1; l >= 0; l--) {
      const hit = arr[l];
      const expiresAt = hit.e || 0;
      if (expiresAt === 0)
        // the item was created without expiration in a non aged cache
        this.set(hit.k, hit.v);
      else {
        const maxAge = expiresAt - now;
        // dont add already expired items
        if (maxAge > 0) {
          this.set(hit.k, hit.v, maxAge);
        }
      }
    }
  }

  prune () {
    this[CACHE].forEach((value, key) => get(this, key, false));
  }
}

const get = (self, key, doUse) => {
  const node = self[CACHE].get(key);
  if (node) {
    const hit = node.value;
    if (isStale(self, hit)) {
      del(self, node);
      if (!self[ALLOW_STALE])
        return undefined
    } else {
      if (doUse) {
        if (self[UPDATE_AGE_ON_GET])
          node.value.now = Date.now();
        self[LRU_LIST].unshiftNode(node);
      }
    }
    return hit.value
  }
};

const isStale = (self, hit) => {
  if (!hit || (!hit.maxAge && !self[MAX_AGE]))
    return false

  const diff = Date.now() - hit.now;
  return hit.maxAge ? diff > hit.maxAge
    : self[MAX_AGE] && (diff > self[MAX_AGE])
};

const trim = self => {
  if (self[LENGTH] > self[MAX]) {
    for (let walker = self[LRU_LIST].tail;
      self[LENGTH] > self[MAX] && walker !== null;) {
      // We know that we're about to delete this one, and also
      // what the next least recently used key will be, so just
      // go ahead and set it now.
      const prev = walker.prev;
      del(self, walker);
      walker = prev;
    }
  }
};

const del = (self, node) => {
  if (node) {
    const hit = node.value;
    if (self[DISPOSE])
      self[DISPOSE](hit.key, hit.value);

    self[LENGTH] -= hit.length;
    self[CACHE].delete(hit.key);
    self[LRU_LIST].removeNode(node);
  }
};

class Entry {
  constructor (key, value, length, now, maxAge) {
    this.key = key;
    this.value = value;
    this.length = length;
    this.now = now;
    this.maxAge = maxAge || 0;
  }
}

const forEachStep = (self, fn, node, thisp) => {
  let hit = node.value;
  if (isStale(self, hit)) {
    del(self, node);
    if (!self[ALLOW_STALE])
      hit = undefined;
  }
  if (hit)
    fn.call(thisp, hit.value, hit.key, self);
};

var lruCache = LRUCache;

var hostedGitInfo = createCommonjsModule(function (module) {


const GitHost = module.exports = gitHost;

const cache = new lruCache({ max: 1000 });

const protocolToRepresentationMap = {
  'git+ssh:': 'sshurl',
  'git+https:': 'https',
  'ssh:': 'sshurl',
  'git:': 'git'
};

function protocolToRepresentation (protocol) {
  return protocolToRepresentationMap[protocol] || protocol.slice(0, -1)
}

const authProtocols = {
  'git:': true,
  'https:': true,
  'git+https:': true,
  'http:': true,
  'git+http:': true
};

const knownProtocols = Object.keys(gitHostInfo.byShortcut).concat(['http:', 'https:', 'git:', 'git+ssh:', 'git+https:', 'ssh:']);

module.exports.fromUrl = function (giturl, opts) {
  if (typeof giturl !== 'string') {
    return
  }

  const key = giturl + JSON.stringify(opts || {});

  if (!cache.has(key)) {
    cache.set(key, fromUrl(giturl, opts));
  }

  return cache.get(key)
};

function fromUrl (giturl, opts) {
  if (!giturl) {
    return
  }

  const url = isGitHubShorthand(giturl) ? 'github:' + giturl : correctProtocol(giturl);
  const parsed = parseGitUrl(url);
  if (!parsed) {
    return parsed
  }

  const gitHostShortcut = gitHostInfo.byShortcut[parsed.protocol];
  const gitHostDomain = gitHostInfo.byDomain[parsed.hostname.startsWith('www.') ? parsed.hostname.slice(4) : parsed.hostname];
  const gitHostName = gitHostShortcut || gitHostDomain;
  if (!gitHostName) {
    return
  }

  const gitHostInfo$1 = gitHostInfo[gitHostShortcut || gitHostDomain];
  let auth = null;
  if (authProtocols[parsed.protocol] && (parsed.username || parsed.password)) {
    auth = `${parsed.username}${parsed.password ? ':' + parsed.password : ''}`;
  }

  let committish = null;
  let user = null;
  let project = null;
  let defaultRepresentation = null;

  try {
    if (gitHostShortcut) {
      let pathname = parsed.pathname.startsWith('/') ? parsed.pathname.slice(1) : parsed.pathname;
      const firstAt = pathname.indexOf('@');
      // we ignore auth for shortcuts, so just trim it out
      if (firstAt > -1) {
        pathname = pathname.slice(firstAt + 1);
      }

      const lastSlash = pathname.lastIndexOf('/');
      if (lastSlash > -1) {
        user = decodeURIComponent(pathname.slice(0, lastSlash));
        // we want nulls only, never empty strings
        if (!user) {
          user = null;
        }
        project = decodeURIComponent(pathname.slice(lastSlash + 1));
      } else {
        project = decodeURIComponent(pathname);
      }

      if (project.endsWith('.git')) {
        project = project.slice(0, -4);
      }

      if (parsed.hash) {
        committish = decodeURIComponent(parsed.hash.slice(1));
      }

      defaultRepresentation = 'shortcut';
    } else {
      if (!gitHostInfo$1.protocols.includes(parsed.protocol)) {
        return
      }

      const segments = gitHostInfo$1.extract(parsed);
      if (!segments) {
        return
      }

      user = segments.user && decodeURIComponent(segments.user);
      project = decodeURIComponent(segments.project);
      committish = decodeURIComponent(segments.committish);
      defaultRepresentation = protocolToRepresentation(parsed.protocol);
    }
  } catch (err) {
    /* istanbul ignore else */
    if (err instanceof URIError) {
      return
    } else {
      throw err
    }
  }

  return new GitHost(gitHostName, user, auth, project, committish, defaultRepresentation, opts)
}

// accepts input like git:github.com:user/repo and inserts the // after the first :
const correctProtocol = (arg) => {
  const firstColon = arg.indexOf(':');
  const proto = arg.slice(0, firstColon + 1);
  if (knownProtocols.includes(proto)) {
    return arg
  }

  const firstAt = arg.indexOf('@');
  if (firstAt > -1) {
    if (firstAt > firstColon) {
      return `git+ssh://${arg}`
    } else {
      return arg
    }
  }

  const doubleSlash = arg.indexOf('//');
  if (doubleSlash === firstColon + 1) {
    return arg
  }

  return arg.slice(0, firstColon + 1) + '//' + arg.slice(firstColon + 1)
};

// look for github shorthand inputs, such as npm/cli
const isGitHubShorthand = (arg) => {
  // it cannot contain whitespace before the first #
  // it cannot start with a / because that's probably an absolute file path
  // but it must include a slash since repos are username/repository
  // it cannot start with a . because that's probably a relative file path
  // it cannot start with an @ because that's a scoped package if it passes the other tests
  // it cannot contain a : before a # because that tells us that there's a protocol
  // a second / may not exist before a #
  const firstHash = arg.indexOf('#');
  const firstSlash = arg.indexOf('/');
  const secondSlash = arg.indexOf('/', firstSlash + 1);
  const firstColon = arg.indexOf(':');
  const firstSpace = /\s/.exec(arg);
  const firstAt = arg.indexOf('@');

  const spaceOnlyAfterHash = !firstSpace || (firstHash > -1 && firstSpace.index > firstHash);
  const atOnlyAfterHash = firstAt === -1 || (firstHash > -1 && firstAt > firstHash);
  const colonOnlyAfterHash = firstColon === -1 || (firstHash > -1 && firstColon > firstHash);
  const secondSlashOnlyAfterHash = secondSlash === -1 || (firstHash > -1 && secondSlash > firstHash);
  const hasSlash = firstSlash > 0;
  // if a # is found, what we really want to know is that the character immediately before # is not a /
  const doesNotEndWithSlash = firstHash > -1 ? arg[firstHash - 1] !== '/' : !arg.endsWith('/');
  const doesNotStartWithDot = !arg.startsWith('.');

  return spaceOnlyAfterHash && hasSlash && doesNotEndWithSlash && doesNotStartWithDot && atOnlyAfterHash && colonOnlyAfterHash && secondSlashOnlyAfterHash
};

// attempt to correct an scp style url so that it will parse with `new URL()`
const correctUrl = (giturl) => {
  const firstAt = giturl.indexOf('@');
  const lastHash = giturl.lastIndexOf('#');
  let firstColon = giturl.indexOf(':');
  let lastColon = giturl.lastIndexOf(':', lastHash > -1 ? lastHash : Infinity);

  let corrected;
  if (lastColon > firstAt) {
    // the last : comes after the first @ (or there is no @)
    // like it would in:
    // proto://hostname.com:user/repo
    // username@hostname.com:user/repo
    // :password@hostname.com:user/repo
    // username:password@hostname.com:user/repo
    // proto://username@hostname.com:user/repo
    // proto://:password@hostname.com:user/repo
    // proto://username:password@hostname.com:user/repo
    // then we replace the last : with a / to create a valid path
    corrected = giturl.slice(0, lastColon) + '/' + giturl.slice(lastColon + 1);
    // // and we find our new : positions
    firstColon = corrected.indexOf(':');
    lastColon = corrected.lastIndexOf(':');
  }

  if (firstColon === -1 && giturl.indexOf('//') === -1) {
    // we have no : at all
    // as it would be in:
    // username@hostname.com/user/repo
    // then we prepend a protocol
    corrected = `git+ssh://${corrected}`;
  }

  return corrected
};

// try to parse the url as its given to us, if that throws
// then we try to clean the url and parse that result instead
// THIS FUNCTION SHOULD NEVER THROW
const parseGitUrl = (giturl) => {
  let result;
  try {
    result = new url__default['default'].URL(giturl);
  } catch (err) {}

  if (result) {
    return result
  }

  const correctedUrl = correctUrl(giturl);
  try {
    result = new url__default['default'].URL(correctedUrl);
  } catch (err) {}

  return result
};
});

/*!
 * is-extglob <https://github.com/jonschlinkert/is-extglob>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */
var isExtglob = function isExtglob(str) {
  return typeof str === 'string'
    && /[@?!+*]\(/.test(str);
};

/*!
 * is-glob <https://github.com/jonschlinkert/is-glob>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

var isGlob = function isGlob(str) {
  return typeof str === 'string'
    && (/[*!?{}(|)[\]]/.test(str)
     || isExtglob(str));
};

/*!
 * is-invalid-path <https://github.com/jonschlinkert/is-invalid-path>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */


var re = /[‘“!#$%&+^<=>`]/;

var isInvalidPath = function (str) {
  return (typeof str !== 'string') || isGlob(str) || re.test(str);
};

/*!
 * is-valid-path <https://github.com/jonschlinkert/is-valid-path>
 *
 * Copyright (c) 2015 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */



var isValidPath$1 = function (str) {
  return isInvalidPath(str) === false;
};

// Based on https://github.com/tmpvar/jsdom/blob/aa85b2abf07766ff7bf5c1f6daafb3726f2f2db5/lib/jsdom/living/blob.js

// fix for "Readable" isn't a named export issue
const Readable = Stream__default['default'].Readable;

const BUFFER = Symbol('buffer');
const TYPE = Symbol('type');

class Blob {
	constructor() {
		this[TYPE] = '';

		const blobParts = arguments[0];
		const options = arguments[1];

		const buffers = [];

		if (blobParts) {
			const a = blobParts;
			const length = Number(a.length);
			for (let i = 0; i < length; i++) {
				const element = a[i];
				let buffer;
				if (element instanceof Buffer) {
					buffer = element;
				} else if (ArrayBuffer.isView(element)) {
					buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
				} else if (element instanceof ArrayBuffer) {
					buffer = Buffer.from(element);
				} else if (element instanceof Blob) {
					buffer = element[BUFFER];
				} else {
					buffer = Buffer.from(typeof element === 'string' ? element : String(element));
				}
				buffers.push(buffer);
			}
		}

		this[BUFFER] = Buffer.concat(buffers);

		let type = options && options.type !== undefined && String(options.type).toLowerCase();
		if (type && !/[^\u0020-\u007E]/.test(type)) {
			this[TYPE] = type;
		}
	}
	get size() {
		return this[BUFFER].length;
	}
	get type() {
		return this[TYPE];
	}
	text() {
		return Promise.resolve(this[BUFFER].toString());
	}
	arrayBuffer() {
		const buf = this[BUFFER];
		const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		return Promise.resolve(ab);
	}
	stream() {
		const readable = new Readable();
		readable._read = function () {};
		readable.push(this[BUFFER]);
		readable.push(null);
		return readable;
	}
	toString() {
		return '[object Blob]';
	}
	slice() {
		const size = this.size;

		const start = arguments[0];
		const end = arguments[1];
		let relativeStart, relativeEnd;
		if (start === undefined) {
			relativeStart = 0;
		} else if (start < 0) {
			relativeStart = Math.max(size + start, 0);
		} else {
			relativeStart = Math.min(start, size);
		}
		if (end === undefined) {
			relativeEnd = size;
		} else if (end < 0) {
			relativeEnd = Math.max(size + end, 0);
		} else {
			relativeEnd = Math.min(end, size);
		}
		const span = Math.max(relativeEnd - relativeStart, 0);

		const buffer = this[BUFFER];
		const slicedBuffer = buffer.slice(relativeStart, relativeStart + span);
		const blob = new Blob([], { type: arguments[2] });
		blob[BUFFER] = slicedBuffer;
		return blob;
	}
}

Object.defineProperties(Blob.prototype, {
	size: { enumerable: true },
	type: { enumerable: true },
	slice: { enumerable: true }
});

Object.defineProperty(Blob.prototype, Symbol.toStringTag, {
	value: 'Blob',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * fetch-error.js
 *
 * FetchError interface for operational errors
 */

/**
 * Create FetchError instance
 *
 * @param   String      message      Error message for human
 * @param   String      type         Error type for machine
 * @param   String      systemError  For Node.js system error
 * @return  FetchError
 */
function FetchError(message, type, systemError) {
  Error.call(this, message);

  this.message = message;
  this.type = type;

  // when err.type is `system`, err.code contains system error code
  if (systemError) {
    this.code = this.errno = systemError.code;
  }

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

FetchError.prototype = Object.create(Error.prototype);
FetchError.prototype.constructor = FetchError;
FetchError.prototype.name = 'FetchError';

let convert;
try {
	convert = require('encoding').convert;
} catch (e) {}

const INTERNALS = Symbol('Body internals');

// fix an issue where "PassThrough" isn't a named export for node <10
const PassThrough = Stream__default['default'].PassThrough;

/**
 * Body mixin
 *
 * Ref: https://fetch.spec.whatwg.org/#body
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
function Body(body) {
	var _this = this;

	var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	    _ref$size = _ref.size;

	let size = _ref$size === undefined ? 0 : _ref$size;
	var _ref$timeout = _ref.timeout;
	let timeout = _ref$timeout === undefined ? 0 : _ref$timeout;

	if (body == null) {
		// body is undefined or null
		body = null;
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		body = Buffer.from(body.toString());
	} else if (isBlob(body)) ; else if (Buffer.isBuffer(body)) ; else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		body = Buffer.from(body);
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
	} else if (body instanceof Stream__default['default']) ; else {
		// none of the above
		// coerce to string then buffer
		body = Buffer.from(String(body));
	}
	this[INTERNALS] = {
		body,
		disturbed: false,
		error: null
	};
	this.size = size;
	this.timeout = timeout;

	if (body instanceof Stream__default['default']) {
		body.on('error', function (err) {
			const error = err.name === 'AbortError' ? err : new FetchError(`Invalid response body while trying to fetch ${_this.url}: ${err.message}`, 'system', err);
			_this[INTERNALS].error = error;
		});
	}
}

Body.prototype = {
	get body() {
		return this[INTERNALS].body;
	},

	get bodyUsed() {
		return this[INTERNALS].disturbed;
	},

	/**
  * Decode response as ArrayBuffer
  *
  * @return  Promise
  */
	arrayBuffer() {
		return consumeBody.call(this).then(function (buf) {
			return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		});
	},

	/**
  * Return raw response as Blob
  *
  * @return Promise
  */
	blob() {
		let ct = this.headers && this.headers.get('content-type') || '';
		return consumeBody.call(this).then(function (buf) {
			return Object.assign(
			// Prevent copying
			new Blob([], {
				type: ct.toLowerCase()
			}), {
				[BUFFER]: buf
			});
		});
	},

	/**
  * Decode response as json
  *
  * @return  Promise
  */
	json() {
		var _this2 = this;

		return consumeBody.call(this).then(function (buffer) {
			try {
				return JSON.parse(buffer.toString());
			} catch (err) {
				return Body.Promise.reject(new FetchError(`invalid json response body at ${_this2.url} reason: ${err.message}`, 'invalid-json'));
			}
		});
	},

	/**
  * Decode response as text
  *
  * @return  Promise
  */
	text() {
		return consumeBody.call(this).then(function (buffer) {
			return buffer.toString();
		});
	},

	/**
  * Decode response as buffer (non-spec api)
  *
  * @return  Promise
  */
	buffer() {
		return consumeBody.call(this);
	},

	/**
  * Decode response as text, while automatically detecting the encoding and
  * trying to decode to UTF-8 (non-spec api)
  *
  * @return  Promise
  */
	textConverted() {
		var _this3 = this;

		return consumeBody.call(this).then(function (buffer) {
			return convertBody(buffer, _this3.headers);
		});
	}
};

// In browsers, all properties are enumerable.
Object.defineProperties(Body.prototype, {
	body: { enumerable: true },
	bodyUsed: { enumerable: true },
	arrayBuffer: { enumerable: true },
	blob: { enumerable: true },
	json: { enumerable: true },
	text: { enumerable: true }
});

Body.mixIn = function (proto) {
	for (const name of Object.getOwnPropertyNames(Body.prototype)) {
		// istanbul ignore else: future proof
		if (!(name in proto)) {
			const desc = Object.getOwnPropertyDescriptor(Body.prototype, name);
			Object.defineProperty(proto, name, desc);
		}
	}
};

/**
 * Consume and convert an entire Body to a Buffer.
 *
 * Ref: https://fetch.spec.whatwg.org/#concept-body-consume-body
 *
 * @return  Promise
 */
function consumeBody() {
	var _this4 = this;

	if (this[INTERNALS].disturbed) {
		return Body.Promise.reject(new TypeError(`body used already for: ${this.url}`));
	}

	this[INTERNALS].disturbed = true;

	if (this[INTERNALS].error) {
		return Body.Promise.reject(this[INTERNALS].error);
	}

	let body = this.body;

	// body is null
	if (body === null) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is blob
	if (isBlob(body)) {
		body = body.stream();
	}

	// body is buffer
	if (Buffer.isBuffer(body)) {
		return Body.Promise.resolve(body);
	}

	// istanbul ignore if: should never happen
	if (!(body instanceof Stream__default['default'])) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is stream
	// get ready to actually consume the body
	let accum = [];
	let accumBytes = 0;
	let abort = false;

	return new Body.Promise(function (resolve, reject) {
		let resTimeout;

		// allow timeout on slow response body
		if (_this4.timeout) {
			resTimeout = setTimeout(function () {
				abort = true;
				reject(new FetchError(`Response timeout while trying to fetch ${_this4.url} (over ${_this4.timeout}ms)`, 'body-timeout'));
			}, _this4.timeout);
		}

		// handle stream errors
		body.on('error', function (err) {
			if (err.name === 'AbortError') {
				// if the request was aborted, reject with this Error
				abort = true;
				reject(err);
			} else {
				// other errors, such as incorrect content-encoding
				reject(new FetchError(`Invalid response body while trying to fetch ${_this4.url}: ${err.message}`, 'system', err));
			}
		});

		body.on('data', function (chunk) {
			if (abort || chunk === null) {
				return;
			}

			if (_this4.size && accumBytes + chunk.length > _this4.size) {
				abort = true;
				reject(new FetchError(`content size at ${_this4.url} over limit: ${_this4.size}`, 'max-size'));
				return;
			}

			accumBytes += chunk.length;
			accum.push(chunk);
		});

		body.on('end', function () {
			if (abort) {
				return;
			}

			clearTimeout(resTimeout);

			try {
				resolve(Buffer.concat(accum, accumBytes));
			} catch (err) {
				// handle streams that have accumulated too much data (issue #414)
				reject(new FetchError(`Could not create Buffer from response body for ${_this4.url}: ${err.message}`, 'system', err));
			}
		});
	});
}

/**
 * Detect buffer encoding and convert to target encoding
 * ref: http://www.w3.org/TR/2011/WD-html5-20110113/parsing.html#determining-the-character-encoding
 *
 * @param   Buffer  buffer    Incoming buffer
 * @param   String  encoding  Target encoding
 * @return  String
 */
function convertBody(buffer, headers) {
	if (typeof convert !== 'function') {
		throw new Error('The package `encoding` must be installed to use the textConverted() function');
	}

	const ct = headers.get('content-type');
	let charset = 'utf-8';
	let res, str;

	// header
	if (ct) {
		res = /charset=([^;]*)/i.exec(ct);
	}

	// no charset in content type, peek at response body for at most 1024 bytes
	str = buffer.slice(0, 1024).toString();

	// html5
	if (!res && str) {
		res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str);
	}

	// html4
	if (!res && str) {
		res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(str);
		if (!res) {
			res = /<meta[\s]+?content=(['"])(.+?)\1[\s]+?http-equiv=(['"])content-type\3/i.exec(str);
			if (res) {
				res.pop(); // drop last quote
			}
		}

		if (res) {
			res = /charset=(.*)/i.exec(res.pop());
		}
	}

	// xml
	if (!res && str) {
		res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str);
	}

	// found charset
	if (res) {
		charset = res.pop();

		// prevent decode issues when sites use incorrect encoding
		// ref: https://hsivonen.fi/encoding-menu/
		if (charset === 'gb2312' || charset === 'gbk') {
			charset = 'gb18030';
		}
	}

	// turn raw buffers into a single utf-8 buffer
	return convert(buffer, 'UTF-8', charset).toString();
}

/**
 * Detect a URLSearchParams object
 * ref: https://github.com/bitinn/node-fetch/issues/296#issuecomment-307598143
 *
 * @param   Object  obj     Object to detect by type or brand
 * @return  String
 */
function isURLSearchParams(obj) {
	// Duck-typing as a necessary condition.
	if (typeof obj !== 'object' || typeof obj.append !== 'function' || typeof obj.delete !== 'function' || typeof obj.get !== 'function' || typeof obj.getAll !== 'function' || typeof obj.has !== 'function' || typeof obj.set !== 'function') {
		return false;
	}

	// Brand-checking and more duck-typing as optional condition.
	return obj.constructor.name === 'URLSearchParams' || Object.prototype.toString.call(obj) === '[object URLSearchParams]' || typeof obj.sort === 'function';
}

/**
 * Check if `obj` is a W3C `Blob` object (which `File` inherits from)
 * @param  {*} obj
 * @return {boolean}
 */
function isBlob(obj) {
	return typeof obj === 'object' && typeof obj.arrayBuffer === 'function' && typeof obj.type === 'string' && typeof obj.stream === 'function' && typeof obj.constructor === 'function' && typeof obj.constructor.name === 'string' && /^(Blob|File)$/.test(obj.constructor.name) && /^(Blob|File)$/.test(obj[Symbol.toStringTag]);
}

/**
 * Clone body given Res/Req instance
 *
 * @param   Mixed  instance  Response or Request instance
 * @return  Mixed
 */
function clone$1(instance) {
	let p1, p2;
	let body = instance.body;

	// don't allow cloning a used body
	if (instance.bodyUsed) {
		throw new Error('cannot clone body after it is used');
	}

	// check that body is a stream and not form-data object
	// note: we can't clone the form-data object without having it as a dependency
	if (body instanceof Stream__default['default'] && typeof body.getBoundary !== 'function') {
		// tee instance body
		p1 = new PassThrough();
		p2 = new PassThrough();
		body.pipe(p1);
		body.pipe(p2);
		// set instance body to teed body and return the other teed body
		instance[INTERNALS].body = p1;
		body = p2;
	}

	return body;
}

/**
 * Performs the operation "extract a `Content-Type` value from |object|" as
 * specified in the specification:
 * https://fetch.spec.whatwg.org/#concept-bodyinit-extract
 *
 * This function assumes that instance.body is present.
 *
 * @param   Mixed  instance  Any options.body input
 */
function extractContentType(body) {
	if (body === null) {
		// body is null
		return null;
	} else if (typeof body === 'string') {
		// body is string
		return 'text/plain;charset=UTF-8';
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		return 'application/x-www-form-urlencoded;charset=UTF-8';
	} else if (isBlob(body)) {
		// body is blob
		return body.type || null;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return null;
	} else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		return null;
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		return null;
	} else if (typeof body.getBoundary === 'function') {
		// detect form data input from form-data module
		return `multipart/form-data;boundary=${body.getBoundary()}`;
	} else if (body instanceof Stream__default['default']) {
		// body is stream
		// can't really do much about this
		return null;
	} else {
		// Body constructor defaults other things to string
		return 'text/plain;charset=UTF-8';
	}
}

/**
 * The Fetch Standard treats this as if "total bytes" is a property on the body.
 * For us, we have to explicitly get it with a function.
 *
 * ref: https://fetch.spec.whatwg.org/#concept-body-total-bytes
 *
 * @param   Body    instance   Instance of Body
 * @return  Number?            Number of bytes, or null if not possible
 */
function getTotalBytes(instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		return 0;
	} else if (isBlob(body)) {
		return body.size;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return body.length;
	} else if (body && typeof body.getLengthSync === 'function') {
		// detect form data input from form-data module
		if (body._lengthRetrievers && body._lengthRetrievers.length == 0 || // 1.x
		body.hasKnownLength && body.hasKnownLength()) {
			// 2.x
			return body.getLengthSync();
		}
		return null;
	} else {
		// body is stream
		return null;
	}
}

/**
 * Write a Body to a Node.js WritableStream (e.g. http.Request) object.
 *
 * @param   Body    instance   Instance of Body
 * @return  Void
 */
function writeToStream(dest, instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		dest.end();
	} else if (isBlob(body)) {
		body.stream().pipe(dest);
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		dest.write(body);
		dest.end();
	} else {
		// body is stream
		body.pipe(dest);
	}
}

// expose Promise
Body.Promise = global.Promise;

/**
 * headers.js
 *
 * Headers class offers convenient helpers
 */

const invalidTokenRegex = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
const invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/;

function validateName(name) {
	name = `${name}`;
	if (invalidTokenRegex.test(name) || name === '') {
		throw new TypeError(`${name} is not a legal HTTP header name`);
	}
}

function validateValue(value) {
	value = `${value}`;
	if (invalidHeaderCharRegex.test(value)) {
		throw new TypeError(`${value} is not a legal HTTP header value`);
	}
}

/**
 * Find the key in the map object given a header name.
 *
 * Returns undefined if not found.
 *
 * @param   String  name  Header name
 * @return  String|Undefined
 */
function find(map, name) {
	name = name.toLowerCase();
	for (const key in map) {
		if (key.toLowerCase() === name) {
			return key;
		}
	}
	return undefined;
}

const MAP = Symbol('map');
class Headers {
	/**
  * Headers class
  *
  * @param   Object  headers  Response headers
  * @return  Void
  */
	constructor() {
		let init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

		this[MAP] = Object.create(null);

		if (init instanceof Headers) {
			const rawHeaders = init.raw();
			const headerNames = Object.keys(rawHeaders);

			for (const headerName of headerNames) {
				for (const value of rawHeaders[headerName]) {
					this.append(headerName, value);
				}
			}

			return;
		}

		// We don't worry about converting prop to ByteString here as append()
		// will handle it.
		if (init == null) ; else if (typeof init === 'object') {
			const method = init[Symbol.iterator];
			if (method != null) {
				if (typeof method !== 'function') {
					throw new TypeError('Header pairs must be iterable');
				}

				// sequence<sequence<ByteString>>
				// Note: per spec we have to first exhaust the lists then process them
				const pairs = [];
				for (const pair of init) {
					if (typeof pair !== 'object' || typeof pair[Symbol.iterator] !== 'function') {
						throw new TypeError('Each header pair must be iterable');
					}
					pairs.push(Array.from(pair));
				}

				for (const pair of pairs) {
					if (pair.length !== 2) {
						throw new TypeError('Each header pair must be a name/value tuple');
					}
					this.append(pair[0], pair[1]);
				}
			} else {
				// record<ByteString, ByteString>
				for (const key of Object.keys(init)) {
					const value = init[key];
					this.append(key, value);
				}
			}
		} else {
			throw new TypeError('Provided initializer must be an object');
		}
	}

	/**
  * Return combined header value given name
  *
  * @param   String  name  Header name
  * @return  Mixed
  */
	get(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key === undefined) {
			return null;
		}

		return this[MAP][key].join(', ');
	}

	/**
  * Iterate over all headers
  *
  * @param   Function  callback  Executed for each item with parameters (value, name, thisArg)
  * @param   Boolean   thisArg   `this` context for callback function
  * @return  Void
  */
	forEach(callback) {
		let thisArg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

		let pairs = getHeaders(this);
		let i = 0;
		while (i < pairs.length) {
			var _pairs$i = pairs[i];
			const name = _pairs$i[0],
			      value = _pairs$i[1];

			callback.call(thisArg, value, name, this);
			pairs = getHeaders(this);
			i++;
		}
	}

	/**
  * Overwrite header values given name
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	set(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		this[MAP][key !== undefined ? key : name] = [value];
	}

	/**
  * Append a value onto existing header
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	append(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			this[MAP][key].push(value);
		} else {
			this[MAP][name] = [value];
		}
	}

	/**
  * Check for header name existence
  *
  * @param   String   name  Header name
  * @return  Boolean
  */
	has(name) {
		name = `${name}`;
		validateName(name);
		return find(this[MAP], name) !== undefined;
	}

	/**
  * Delete all header values given name
  *
  * @param   String  name  Header name
  * @return  Void
  */
	delete(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			delete this[MAP][key];
		}
	}

	/**
  * Return raw headers (non-spec api)
  *
  * @return  Object
  */
	raw() {
		return this[MAP];
	}

	/**
  * Get an iterator on keys.
  *
  * @return  Iterator
  */
	keys() {
		return createHeadersIterator(this, 'key');
	}

	/**
  * Get an iterator on values.
  *
  * @return  Iterator
  */
	values() {
		return createHeadersIterator(this, 'value');
	}

	/**
  * Get an iterator on entries.
  *
  * This is the default iterator of the Headers object.
  *
  * @return  Iterator
  */
	[Symbol.iterator]() {
		return createHeadersIterator(this, 'key+value');
	}
}
Headers.prototype.entries = Headers.prototype[Symbol.iterator];

Object.defineProperty(Headers.prototype, Symbol.toStringTag, {
	value: 'Headers',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Headers.prototype, {
	get: { enumerable: true },
	forEach: { enumerable: true },
	set: { enumerable: true },
	append: { enumerable: true },
	has: { enumerable: true },
	delete: { enumerable: true },
	keys: { enumerable: true },
	values: { enumerable: true },
	entries: { enumerable: true }
});

function getHeaders(headers) {
	let kind = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'key+value';

	const keys = Object.keys(headers[MAP]).sort();
	return keys.map(kind === 'key' ? function (k) {
		return k.toLowerCase();
	} : kind === 'value' ? function (k) {
		return headers[MAP][k].join(', ');
	} : function (k) {
		return [k.toLowerCase(), headers[MAP][k].join(', ')];
	});
}

const INTERNAL = Symbol('internal');

function createHeadersIterator(target, kind) {
	const iterator = Object.create(HeadersIteratorPrototype);
	iterator[INTERNAL] = {
		target,
		kind,
		index: 0
	};
	return iterator;
}

const HeadersIteratorPrototype = Object.setPrototypeOf({
	next() {
		// istanbul ignore if
		if (!this || Object.getPrototypeOf(this) !== HeadersIteratorPrototype) {
			throw new TypeError('Value of `this` is not a HeadersIterator');
		}

		var _INTERNAL = this[INTERNAL];
		const target = _INTERNAL.target,
		      kind = _INTERNAL.kind,
		      index = _INTERNAL.index;

		const values = getHeaders(target, kind);
		const len = values.length;
		if (index >= len) {
			return {
				value: undefined,
				done: true
			};
		}

		this[INTERNAL].index = index + 1;

		return {
			value: values[index],
			done: false
		};
	}
}, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));

Object.defineProperty(HeadersIteratorPrototype, Symbol.toStringTag, {
	value: 'HeadersIterator',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * Export the Headers object in a form that Node.js can consume.
 *
 * @param   Headers  headers
 * @return  Object
 */
function exportNodeCompatibleHeaders(headers) {
	const obj = Object.assign({ __proto__: null }, headers[MAP]);

	// http.request() only supports string as Host header. This hack makes
	// specifying custom Host header possible.
	const hostHeaderKey = find(headers[MAP], 'Host');
	if (hostHeaderKey !== undefined) {
		obj[hostHeaderKey] = obj[hostHeaderKey][0];
	}

	return obj;
}

/**
 * Create a Headers object from an object of headers, ignoring those that do
 * not conform to HTTP grammar productions.
 *
 * @param   Object  obj  Object of headers
 * @return  Headers
 */
function createHeadersLenient(obj) {
	const headers = new Headers();
	for (const name of Object.keys(obj)) {
		if (invalidTokenRegex.test(name)) {
			continue;
		}
		if (Array.isArray(obj[name])) {
			for (const val of obj[name]) {
				if (invalidHeaderCharRegex.test(val)) {
					continue;
				}
				if (headers[MAP][name] === undefined) {
					headers[MAP][name] = [val];
				} else {
					headers[MAP][name].push(val);
				}
			}
		} else if (!invalidHeaderCharRegex.test(obj[name])) {
			headers[MAP][name] = [obj[name]];
		}
	}
	return headers;
}

const INTERNALS$1 = Symbol('Response internals');

// fix an issue where "STATUS_CODES" aren't a named export for node <10
const STATUS_CODES = http__default['default'].STATUS_CODES;

/**
 * Response class
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
class Response {
	constructor() {
		let body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
		let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		Body.call(this, body, opts);

		const status = opts.status || 200;
		const headers = new Headers(opts.headers);

		if (body != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(body);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		this[INTERNALS$1] = {
			url: opts.url,
			status,
			statusText: opts.statusText || STATUS_CODES[status],
			headers,
			counter: opts.counter
		};
	}

	get url() {
		return this[INTERNALS$1].url || '';
	}

	get status() {
		return this[INTERNALS$1].status;
	}

	/**
  * Convenience property representing if the request ended normally
  */
	get ok() {
		return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
	}

	get redirected() {
		return this[INTERNALS$1].counter > 0;
	}

	get statusText() {
		return this[INTERNALS$1].statusText;
	}

	get headers() {
		return this[INTERNALS$1].headers;
	}

	/**
  * Clone this response
  *
  * @return  Response
  */
	clone() {
		return new Response(clone$1(this), {
			url: this.url,
			status: this.status,
			statusText: this.statusText,
			headers: this.headers,
			ok: this.ok,
			redirected: this.redirected
		});
	}
}

Body.mixIn(Response.prototype);

Object.defineProperties(Response.prototype, {
	url: { enumerable: true },
	status: { enumerable: true },
	ok: { enumerable: true },
	redirected: { enumerable: true },
	statusText: { enumerable: true },
	headers: { enumerable: true },
	clone: { enumerable: true }
});

Object.defineProperty(Response.prototype, Symbol.toStringTag, {
	value: 'Response',
	writable: false,
	enumerable: false,
	configurable: true
});

const INTERNALS$2 = Symbol('Request internals');

// fix an issue where "format", "parse" aren't a named export for node <10
const parse_url = url__default['default'].parse;
const format_url = url__default['default'].format;

const streamDestructionSupported = 'destroy' in Stream__default['default'].Readable.prototype;

/**
 * Check if a value is an instance of Request.
 *
 * @param   Mixed   input
 * @return  Boolean
 */
function isRequest(input) {
	return typeof input === 'object' && typeof input[INTERNALS$2] === 'object';
}

function isAbortSignal(signal) {
	const proto = signal && typeof signal === 'object' && Object.getPrototypeOf(signal);
	return !!(proto && proto.constructor.name === 'AbortSignal');
}

/**
 * Request class
 *
 * @param   Mixed   input  Url or Request instance
 * @param   Object  init   Custom options
 * @return  Void
 */
class Request {
	constructor(input) {
		let init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		let parsedURL;

		// normalize input
		if (!isRequest(input)) {
			if (input && input.href) {
				// in order to support Node.js' Url objects; though WHATWG's URL objects
				// will fall into this branch also (since their `toString()` will return
				// `href` property anyway)
				parsedURL = parse_url(input.href);
			} else {
				// coerce input to a string before attempting to parse
				parsedURL = parse_url(`${input}`);
			}
			input = {};
		} else {
			parsedURL = parse_url(input.url);
		}

		let method = init.method || input.method || 'GET';
		method = method.toUpperCase();

		if ((init.body != null || isRequest(input) && input.body !== null) && (method === 'GET' || method === 'HEAD')) {
			throw new TypeError('Request with GET/HEAD method cannot have body');
		}

		let inputBody = init.body != null ? init.body : isRequest(input) && input.body !== null ? clone$1(input) : null;

		Body.call(this, inputBody, {
			timeout: init.timeout || input.timeout || 0,
			size: init.size || input.size || 0
		});

		const headers = new Headers(init.headers || input.headers || {});

		if (inputBody != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(inputBody);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		let signal = isRequest(input) ? input.signal : null;
		if ('signal' in init) signal = init.signal;

		if (signal != null && !isAbortSignal(signal)) {
			throw new TypeError('Expected signal to be an instanceof AbortSignal');
		}

		this[INTERNALS$2] = {
			method,
			redirect: init.redirect || input.redirect || 'follow',
			headers,
			parsedURL,
			signal
		};

		// node-fetch-only options
		this.follow = init.follow !== undefined ? init.follow : input.follow !== undefined ? input.follow : 20;
		this.compress = init.compress !== undefined ? init.compress : input.compress !== undefined ? input.compress : true;
		this.counter = init.counter || input.counter || 0;
		this.agent = init.agent || input.agent;
	}

	get method() {
		return this[INTERNALS$2].method;
	}

	get url() {
		return format_url(this[INTERNALS$2].parsedURL);
	}

	get headers() {
		return this[INTERNALS$2].headers;
	}

	get redirect() {
		return this[INTERNALS$2].redirect;
	}

	get signal() {
		return this[INTERNALS$2].signal;
	}

	/**
  * Clone this request
  *
  * @return  Request
  */
	clone() {
		return new Request(this);
	}
}

Body.mixIn(Request.prototype);

Object.defineProperty(Request.prototype, Symbol.toStringTag, {
	value: 'Request',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Request.prototype, {
	method: { enumerable: true },
	url: { enumerable: true },
	headers: { enumerable: true },
	redirect: { enumerable: true },
	clone: { enumerable: true },
	signal: { enumerable: true }
});

/**
 * Convert a Request to Node.js http request options.
 *
 * @param   Request  A Request instance
 * @return  Object   The options object to be passed to http.request
 */
function getNodeRequestOptions(request) {
	const parsedURL = request[INTERNALS$2].parsedURL;
	const headers = new Headers(request[INTERNALS$2].headers);

	// fetch step 1.3
	if (!headers.has('Accept')) {
		headers.set('Accept', '*/*');
	}

	// Basic fetch
	if (!parsedURL.protocol || !parsedURL.hostname) {
		throw new TypeError('Only absolute URLs are supported');
	}

	if (!/^https?:$/.test(parsedURL.protocol)) {
		throw new TypeError('Only HTTP(S) protocols are supported');
	}

	if (request.signal && request.body instanceof Stream__default['default'].Readable && !streamDestructionSupported) {
		throw new Error('Cancellation of streamed requests with AbortSignal is not supported in node < 8');
	}

	// HTTP-network-or-cache fetch steps 2.4-2.7
	let contentLengthValue = null;
	if (request.body == null && /^(POST|PUT)$/i.test(request.method)) {
		contentLengthValue = '0';
	}
	if (request.body != null) {
		const totalBytes = getTotalBytes(request);
		if (typeof totalBytes === 'number') {
			contentLengthValue = String(totalBytes);
		}
	}
	if (contentLengthValue) {
		headers.set('Content-Length', contentLengthValue);
	}

	// HTTP-network-or-cache fetch step 2.11
	if (!headers.has('User-Agent')) {
		headers.set('User-Agent', 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)');
	}

	// HTTP-network-or-cache fetch step 2.15
	if (request.compress && !headers.has('Accept-Encoding')) {
		headers.set('Accept-Encoding', 'gzip,deflate');
	}

	let agent = request.agent;
	if (typeof agent === 'function') {
		agent = agent(parsedURL);
	}

	if (!headers.has('Connection') && !agent) {
		headers.set('Connection', 'close');
	}

	// HTTP-network fetch step 4.2
	// chunked encoding is handled by Node.js

	return Object.assign({}, parsedURL, {
		method: request.method,
		headers: exportNodeCompatibleHeaders(headers),
		agent
	});
}

/**
 * abort-error.js
 *
 * AbortError interface for cancelled requests
 */

/**
 * Create AbortError instance
 *
 * @param   String      message      Error message for human
 * @return  AbortError
 */
function AbortError(message) {
  Error.call(this, message);

  this.type = 'aborted';
  this.message = message;

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

AbortError.prototype = Object.create(Error.prototype);
AbortError.prototype.constructor = AbortError;
AbortError.prototype.name = 'AbortError';

// fix an issue where "PassThrough", "resolve" aren't a named export for node <10
const PassThrough$1 = Stream__default['default'].PassThrough;
const resolve_url = url__default['default'].resolve;

/**
 * Fetch function
 *
 * @param   Mixed    url   Absolute url or Request instance
 * @param   Object   opts  Fetch options
 * @return  Promise
 */
function fetch(url, opts) {

	// allow custom promise
	if (!fetch.Promise) {
		throw new Error('native promise missing, set fetch.Promise to your favorite alternative');
	}

	Body.Promise = fetch.Promise;

	// wrap http.request into fetch
	return new fetch.Promise(function (resolve, reject) {
		// build request object
		const request = new Request(url, opts);
		const options = getNodeRequestOptions(request);

		const send = (options.protocol === 'https:' ? https__default['default'] : http__default['default']).request;
		const signal = request.signal;

		let response = null;

		const abort = function abort() {
			let error = new AbortError('The user aborted a request.');
			reject(error);
			if (request.body && request.body instanceof Stream__default['default'].Readable) {
				request.body.destroy(error);
			}
			if (!response || !response.body) return;
			response.body.emit('error', error);
		};

		if (signal && signal.aborted) {
			abort();
			return;
		}

		const abortAndFinalize = function abortAndFinalize() {
			abort();
			finalize();
		};

		// send request
		const req = send(options);
		let reqTimeout;

		if (signal) {
			signal.addEventListener('abort', abortAndFinalize);
		}

		function finalize() {
			req.abort();
			if (signal) signal.removeEventListener('abort', abortAndFinalize);
			clearTimeout(reqTimeout);
		}

		if (request.timeout) {
			req.once('socket', function (socket) {
				reqTimeout = setTimeout(function () {
					reject(new FetchError(`network timeout at: ${request.url}`, 'request-timeout'));
					finalize();
				}, request.timeout);
			});
		}

		req.on('error', function (err) {
			reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, 'system', err));
			finalize();
		});

		req.on('response', function (res) {
			clearTimeout(reqTimeout);

			const headers = createHeadersLenient(res.headers);

			// HTTP fetch step 5
			if (fetch.isRedirect(res.statusCode)) {
				// HTTP fetch step 5.2
				const location = headers.get('Location');

				// HTTP fetch step 5.3
				const locationURL = location === null ? null : resolve_url(request.url, location);

				// HTTP fetch step 5.5
				switch (request.redirect) {
					case 'error':
						reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, 'no-redirect'));
						finalize();
						return;
					case 'manual':
						// node-fetch-specific step: make manual redirect a bit easier to use by setting the Location header value to the resolved URL.
						if (locationURL !== null) {
							// handle corrupted header
							try {
								headers.set('Location', locationURL);
							} catch (err) {
								// istanbul ignore next: nodejs server prevent invalid response headers, we can't test this through normal request
								reject(err);
							}
						}
						break;
					case 'follow':
						// HTTP-redirect fetch step 2
						if (locationURL === null) {
							break;
						}

						// HTTP-redirect fetch step 5
						if (request.counter >= request.follow) {
							reject(new FetchError(`maximum redirect reached at: ${request.url}`, 'max-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 6 (counter increment)
						// Create a new Request object.
						const requestOpts = {
							headers: new Headers(request.headers),
							follow: request.follow,
							counter: request.counter + 1,
							agent: request.agent,
							compress: request.compress,
							method: request.method,
							body: request.body,
							signal: request.signal,
							timeout: request.timeout,
							size: request.size
						};

						// HTTP-redirect fetch step 9
						if (res.statusCode !== 303 && request.body && getTotalBytes(request) === null) {
							reject(new FetchError('Cannot follow redirect with body being a readable stream', 'unsupported-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 11
						if (res.statusCode === 303 || (res.statusCode === 301 || res.statusCode === 302) && request.method === 'POST') {
							requestOpts.method = 'GET';
							requestOpts.body = undefined;
							requestOpts.headers.delete('content-length');
						}

						// HTTP-redirect fetch step 15
						resolve(fetch(new Request(locationURL, requestOpts)));
						finalize();
						return;
				}
			}

			// prepare response
			res.once('end', function () {
				if (signal) signal.removeEventListener('abort', abortAndFinalize);
			});
			let body = res.pipe(new PassThrough$1());

			const response_options = {
				url: request.url,
				status: res.statusCode,
				statusText: res.statusMessage,
				headers: headers,
				size: request.size,
				timeout: request.timeout,
				counter: request.counter
			};

			// HTTP-network fetch step 12.1.1.3
			const codings = headers.get('Content-Encoding');

			// HTTP-network fetch step 12.1.1.4: handle content codings

			// in following scenarios we ignore compression support
			// 1. compression support is disabled
			// 2. HEAD request
			// 3. no Content-Encoding header
			// 4. no content response (204)
			// 5. content not modified response (304)
			if (!request.compress || request.method === 'HEAD' || codings === null || res.statusCode === 204 || res.statusCode === 304) {
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// For Node v6+
			// Be less strict when decoding compressed responses, since sometimes
			// servers send slightly invalid responses that are still accepted
			// by common browsers.
			// Always using Z_SYNC_FLUSH is what cURL does.
			const zlibOptions = {
				flush: zlib__default['default'].Z_SYNC_FLUSH,
				finishFlush: zlib__default['default'].Z_SYNC_FLUSH
			};

			// for gzip
			if (codings == 'gzip' || codings == 'x-gzip') {
				body = body.pipe(zlib__default['default'].createGunzip(zlibOptions));
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// for deflate
			if (codings == 'deflate' || codings == 'x-deflate') {
				// handle the infamous raw deflate response from old servers
				// a hack for old IIS and Apache servers
				const raw = res.pipe(new PassThrough$1());
				raw.once('data', function (chunk) {
					// see http://stackoverflow.com/questions/37519828
					if ((chunk[0] & 0x0F) === 0x08) {
						body = body.pipe(zlib__default['default'].createInflate());
					} else {
						body = body.pipe(zlib__default['default'].createInflateRaw());
					}
					response = new Response(body, response_options);
					resolve(response);
				});
				return;
			}

			// for br
			if (codings == 'br' && typeof zlib__default['default'].createBrotliDecompress === 'function') {
				body = body.pipe(zlib__default['default'].createBrotliDecompress());
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// otherwise, use response as-is
			response = new Response(body, response_options);
			resolve(response);
		});

		writeToStream(req, request);
	});
}
/**
 * Redirect code matching
 *
 * @param   Number   code  Status code
 * @return  Boolean
 */
fetch.isRedirect = function (code) {
	return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
};

// expose Promise
fetch.Promise = global.Promise;

// Unique ID creation requires a high quality random # generator.  In node.js
// this is pretty straight-forward - we use the crypto API.



var rng = function nodeRNG() {
  return crypto__default['default'].randomBytes(16);
};

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
  return ([
    bth[buf[i++]], bth[buf[i++]],
    bth[buf[i++]], bth[buf[i++]], '-',
    bth[buf[i++]], bth[buf[i++]], '-',
    bth[buf[i++]], bth[buf[i++]], '-',
    bth[buf[i++]], bth[buf[i++]], '-',
    bth[buf[i++]], bth[buf[i++]],
    bth[buf[i++]], bth[buf[i++]],
    bth[buf[i++]], bth[buf[i++]]
  ]).join('');
}

var bytesToUuid_1 = bytesToUuid;

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options === 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid_1(rnds);
}

var v4_1 = v4;

const homeDirectory = os__default['default'].homedir();
const {env} = process;

const xdgData = env.XDG_DATA_HOME ||
	(homeDirectory ? path__default['default'].join(homeDirectory, '.local', 'share') : undefined);

const xdgConfig = env.XDG_CONFIG_HOME ||
	(homeDirectory ? path__default['default'].join(homeDirectory, '.config') : undefined);

env.XDG_STATE_HOME ||
	(homeDirectory ? path__default['default'].join(homeDirectory, '.local', 'state') : undefined);

env.XDG_CACHE_HOME || (homeDirectory ? path__default['default'].join(homeDirectory, '.cache') : undefined);

const xdgDataDirectories = (env.XDG_DATA_DIRS || '/usr/local/share/:/usr/share/').split(':');

if (xdgData) {
	xdgDataDirectories.unshift(xdgData);
}

const xdgConfigDirectories = (env.XDG_CONFIG_DIRS || '/etc/xdg').split(':');

if (xdgConfig) {
	xdgConfigDirectories.unshift(xdgConfig);
}

/**
 * @preserve
 * JS Implementation of incremental MurmurHash3 (r150) (as of May 10, 2013)
 *
 * @author <a href="mailto:jensyt@gmail.com">Jens Taylor</a>
 * @see http://github.com/homebrewing/brauhaus-diff
 * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
 * @see http://github.com/garycourt/murmurhash-js
 * @author <a href="mailto:aappleby@gmail.com">Austin Appleby</a>
 * @see http://sites.google.com/site/murmurhash/
 */

var imurmurhash = createCommonjsModule(function (module) {
(function(){
    var cache;

    // Call this function without `new` to use the cached object (good for
    // single-threaded environments), or with `new` to create a new object.
    //
    // @param {string} key A UTF-16 or ASCII string
    // @param {number} seed An optional positive integer
    // @return {object} A MurmurHash3 object for incremental hashing
    function MurmurHash3(key, seed) {
        var m = this instanceof MurmurHash3 ? this : cache;
        m.reset(seed);
        if (typeof key === 'string' && key.length > 0) {
            m.hash(key);
        }

        if (m !== this) {
            return m;
        }
    }
    // Incrementally add a string to this hash
    //
    // @param {string} key A UTF-16 or ASCII string
    // @return {object} this
    MurmurHash3.prototype.hash = function(key) {
        var h1, k1, i, top, len;

        len = key.length;
        this.len += len;

        k1 = this.k1;
        i = 0;
        switch (this.rem) {
            case 0: k1 ^= len > i ? (key.charCodeAt(i++) & 0xffff) : 0;
            case 1: k1 ^= len > i ? (key.charCodeAt(i++) & 0xffff) << 8 : 0;
            case 2: k1 ^= len > i ? (key.charCodeAt(i++) & 0xffff) << 16 : 0;
            case 3:
                k1 ^= len > i ? (key.charCodeAt(i) & 0xff) << 24 : 0;
                k1 ^= len > i ? (key.charCodeAt(i++) & 0xff00) >> 8 : 0;
        }

        this.rem = (len + this.rem) & 3; // & 3 is same as % 4
        len -= this.rem;
        if (len > 0) {
            h1 = this.h1;
            while (1) {
                k1 = (k1 * 0x2d51 + (k1 & 0xffff) * 0xcc9e0000) & 0xffffffff;
                k1 = (k1 << 15) | (k1 >>> 17);
                k1 = (k1 * 0x3593 + (k1 & 0xffff) * 0x1b870000) & 0xffffffff;

                h1 ^= k1;
                h1 = (h1 << 13) | (h1 >>> 19);
                h1 = (h1 * 5 + 0xe6546b64) & 0xffffffff;

                if (i >= len) {
                    break;
                }

                k1 = ((key.charCodeAt(i++) & 0xffff)) ^
                     ((key.charCodeAt(i++) & 0xffff) << 8) ^
                     ((key.charCodeAt(i++) & 0xffff) << 16);
                top = key.charCodeAt(i++);
                k1 ^= ((top & 0xff) << 24) ^
                      ((top & 0xff00) >> 8);
            }

            k1 = 0;
            switch (this.rem) {
                case 3: k1 ^= (key.charCodeAt(i + 2) & 0xffff) << 16;
                case 2: k1 ^= (key.charCodeAt(i + 1) & 0xffff) << 8;
                case 1: k1 ^= (key.charCodeAt(i) & 0xffff);
            }

            this.h1 = h1;
        }

        this.k1 = k1;
        return this;
    };

    // Get the result of this hash
    //
    // @return {number} The 32-bit hash
    MurmurHash3.prototype.result = function() {
        var k1, h1;
        
        k1 = this.k1;
        h1 = this.h1;

        if (k1 > 0) {
            k1 = (k1 * 0x2d51 + (k1 & 0xffff) * 0xcc9e0000) & 0xffffffff;
            k1 = (k1 << 15) | (k1 >>> 17);
            k1 = (k1 * 0x3593 + (k1 & 0xffff) * 0x1b870000) & 0xffffffff;
            h1 ^= k1;
        }

        h1 ^= this.len;

        h1 ^= h1 >>> 16;
        h1 = (h1 * 0xca6b + (h1 & 0xffff) * 0x85eb0000) & 0xffffffff;
        h1 ^= h1 >>> 13;
        h1 = (h1 * 0xae35 + (h1 & 0xffff) * 0xc2b20000) & 0xffffffff;
        h1 ^= h1 >>> 16;

        return h1 >>> 0;
    };

    // Reset the hash object for reuse
    //
    // @param {number} seed An optional positive integer
    MurmurHash3.prototype.reset = function(seed) {
        this.h1 = typeof seed === 'number' ? seed : 0;
        this.rem = this.k1 = this.len = 0;
        return this;
    };

    // A cached object to use. This can be safely used if you're in a single-
    // threaded environment, otherwise you need to create new hashes to use.
    cache = new MurmurHash3();

    {
        module.exports = MurmurHash3;
    }
}());
});

var isTypedarray      = isTypedArray$1;
isTypedArray$1.strict = isStrictTypedArray;
isTypedArray$1.loose  = isLooseTypedArray;

var toString = Object.prototype.toString;
var names = {
    '[object Int8Array]': true
  , '[object Int16Array]': true
  , '[object Int32Array]': true
  , '[object Uint8Array]': true
  , '[object Uint8ClampedArray]': true
  , '[object Uint16Array]': true
  , '[object Uint32Array]': true
  , '[object Float32Array]': true
  , '[object Float64Array]': true
};

function isTypedArray$1(arr) {
  return (
       isStrictTypedArray(arr)
    || isLooseTypedArray(arr)
  )
}

function isStrictTypedArray(arr) {
  return (
       arr instanceof Int8Array
    || arr instanceof Int16Array
    || arr instanceof Int32Array
    || arr instanceof Uint8Array
    || arr instanceof Uint8ClampedArray
    || arr instanceof Uint16Array
    || arr instanceof Uint32Array
    || arr instanceof Float32Array
    || arr instanceof Float64Array
  )
}

function isLooseTypedArray(arr) {
  return names[toString.call(arr)]
}

/**
 * Convert a typed array to a Buffer without a copy
 *
 * Author:   Feross Aboukhadijeh <https://feross.org>
 * License:  MIT
 *
 * `npm install typedarray-to-buffer`
 */

var isTypedArray = isTypedarray.strict;

var typedarrayToBuffer = function typedarrayToBuffer (arr) {
  if (isTypedArray(arr)) {
    // To avoid a copy, use the typed array's underlying ArrayBuffer to back new Buffer
    var buf = Buffer.from(arr.buffer);
    if (arr.byteLength !== arr.buffer.byteLength) {
      // Respect the "view", i.e. byteOffset and byteLength, without doing a copy
      buf = buf.slice(arr.byteOffset, arr.byteOffset + arr.byteLength);
    }
    return buf
  } else {
    // Pass through all other types to `Buffer.from`
    return Buffer.from(arr)
  }
};

var threadId$1 = 0;

var workerThreadsShim = {
	threadId: threadId$1
};

var writeFileAtomic = writeFile;
var sync = writeFileSync;
var _getTmpname = getTmpname; // for testing
var _cleanupOnExit = cleanupOnExit;







const { promisify } = util__default['default'];
const activeFiles = {};

// if we run inside of a worker_thread, `process.pid` is not unique
/* istanbul ignore next */
const threadId = (function getId () {
  try {
    const workerThreads = workerThreadsShim;

    /// if we are in main thread, this is set to `0`
    return workerThreads.threadId
  } catch (e) {
    // worker_threads are not available, fallback to 0
    return 0
  }
})();

let invocations = 0;
function getTmpname (filename) {
  return filename + '.' +
    imurmurhash(__filename)
      .hash(String(process.pid))
      .hash(String(threadId))
      .hash(String(++invocations))
      .result()
}

function cleanupOnExit (tmpfile) {
  return () => {
    try {
      fs__default['default'].unlinkSync(typeof tmpfile === 'function' ? tmpfile() : tmpfile);
    } catch (_) {}
  }
}

function serializeActiveFile (absoluteName) {
  return new Promise(resolve => {
    // make a queue if it doesn't already exist
    if (!activeFiles[absoluteName]) activeFiles[absoluteName] = [];

    activeFiles[absoluteName].push(resolve); // add this job to the queue
    if (activeFiles[absoluteName].length === 1) resolve(); // kick off the first one
  })
}

// https://github.com/isaacs/node-graceful-fs/blob/master/polyfills.js#L315-L342
function isChownErrOk (err) {
  if (err.code === 'ENOSYS') {
    return true
  }

  const nonroot = !process.getuid || process.getuid() !== 0;
  if (nonroot) {
    if (err.code === 'EINVAL' || err.code === 'EPERM') {
      return true
    }
  }

  return false
}

async function writeFileAsync (filename, data, options = {}) {
  if (typeof options === 'string') {
    options = { encoding: options };
  }

  let fd;
  let tmpfile;
  /* istanbul ignore next -- The closure only gets called when onExit triggers */
  const removeOnExitHandler = signalExit(cleanupOnExit(() => tmpfile));
  const absoluteName = path__default['default'].resolve(filename);

  try {
    await serializeActiveFile(absoluteName);
    const truename = await promisify(fs__default['default'].realpath)(filename).catch(() => filename);
    tmpfile = getTmpname(truename);

    if (!options.mode || !options.chown) {
      // Either mode or chown is not explicitly set
      // Default behavior is to copy it from original file
      const stats = await promisify(fs__default['default'].stat)(truename).catch(() => {});
      if (stats) {
        if (options.mode == null) {
          options.mode = stats.mode;
        }

        if (options.chown == null && process.getuid) {
          options.chown = { uid: stats.uid, gid: stats.gid };
        }
      }
    }

    fd = await promisify(fs__default['default'].open)(tmpfile, 'w', options.mode);
    if (options.tmpfileCreated) {
      await options.tmpfileCreated(tmpfile);
    }
    if (isTypedarray(data)) {
      data = typedarrayToBuffer(data);
    }
    if (Buffer.isBuffer(data)) {
      await promisify(fs__default['default'].write)(fd, data, 0, data.length, 0);
    } else if (data != null) {
      await promisify(fs__default['default'].write)(fd, String(data), 0, String(options.encoding || 'utf8'));
    }

    if (options.fsync !== false) {
      await promisify(fs__default['default'].fsync)(fd);
    }

    await promisify(fs__default['default'].close)(fd);
    fd = null;

    if (options.chown) {
      await promisify(fs__default['default'].chown)(tmpfile, options.chown.uid, options.chown.gid).catch(err => {
        if (!isChownErrOk(err)) {
          throw err
        }
      });
    }

    if (options.mode) {
      await promisify(fs__default['default'].chmod)(tmpfile, options.mode).catch(err => {
        if (!isChownErrOk(err)) {
          throw err
        }
      });
    }

    await promisify(fs__default['default'].rename)(tmpfile, truename);
  } finally {
    if (fd) {
      await promisify(fs__default['default'].close)(fd).catch(
        /* istanbul ignore next */
        () => {}
      );
    }
    removeOnExitHandler();
    await promisify(fs__default['default'].unlink)(tmpfile).catch(() => {});
    activeFiles[absoluteName].shift(); // remove the element added by serializeSameFile
    if (activeFiles[absoluteName].length > 0) {
      activeFiles[absoluteName][0](); // start next job if one is pending
    } else delete activeFiles[absoluteName];
  }
}

function writeFile (filename, data, options, callback) {
  if (options instanceof Function) {
    callback = options;
    options = {};
  }

  const promise = writeFileAsync(filename, data, options);
  if (callback) {
    promise.then(callback, callback);
  }

  return promise
}

function writeFileSync (filename, data, options) {
  if (typeof options === 'string') options = { encoding: options };
  else if (!options) options = {};
  try {
    filename = fs__default['default'].realpathSync(filename);
  } catch (ex) {
    // it's ok, it'll happen on a not yet existing file
  }
  const tmpfile = getTmpname(filename);

  if (!options.mode || !options.chown) {
    // Either mode or chown is not explicitly set
    // Default behavior is to copy it from original file
    try {
      const stats = fs__default['default'].statSync(filename);
      options = Object.assign({}, options);
      if (!options.mode) {
        options.mode = stats.mode;
      }
      if (!options.chown && process.getuid) {
        options.chown = { uid: stats.uid, gid: stats.gid };
      }
    } catch (ex) {
      // ignore stat errors
    }
  }

  let fd;
  const cleanup = cleanupOnExit(tmpfile);
  const removeOnExitHandler = signalExit(cleanup);

  let threw = true;
  try {
    fd = fs__default['default'].openSync(tmpfile, 'w', options.mode || 0o666);
    if (options.tmpfileCreated) {
      options.tmpfileCreated(tmpfile);
    }
    if (isTypedarray(data)) {
      data = typedarrayToBuffer(data);
    }
    if (Buffer.isBuffer(data)) {
      fs__default['default'].writeSync(fd, data, 0, data.length, 0);
    } else if (data != null) {
      fs__default['default'].writeSync(fd, String(data), 0, String(options.encoding || 'utf8'));
    }
    if (options.fsync !== false) {
      fs__default['default'].fsyncSync(fd);
    }

    fs__default['default'].closeSync(fd);
    fd = null;

    if (options.chown) {
      try {
        fs__default['default'].chownSync(tmpfile, options.chown.uid, options.chown.gid);
      } catch (err) {
        if (!isChownErrOk(err)) {
          throw err
        }
      }
    }

    if (options.mode) {
      try {
        fs__default['default'].chmodSync(tmpfile, options.mode);
      } catch (err) {
        if (!isChownErrOk(err)) {
          throw err
        }
      }
    }

    fs__default['default'].renameSync(tmpfile, filename);
    threw = false;
  } finally {
    if (fd) {
      try {
        fs__default['default'].closeSync(fd);
      } catch (ex) {
        // ignore close errors at this stage, error may have closed fd already.
      }
    }
    removeOnExitHandler();
    if (threw) {
      cleanup();
    }
  }
}
writeFileAtomic.sync = sync;
writeFileAtomic._getTmpname = _getTmpname;
writeFileAtomic._cleanupOnExit = _cleanupOnExit;

var isObj = value => {
	const type = typeof value;
	return value !== null && (type === 'object' || type === 'function');
};

const disallowedKeys = new Set([
	'__proto__',
	'prototype',
	'constructor'
]);

const isValidPath = pathSegments => !pathSegments.some(segment => disallowedKeys.has(segment));

function getPathSegments(path) {
	const pathArray = path.split('.');
	const parts = [];

	for (let i = 0; i < pathArray.length; i++) {
		let p = pathArray[i];

		while (p[p.length - 1] === '\\' && pathArray[i + 1] !== undefined) {
			p = p.slice(0, -1) + '.';
			p += pathArray[++i];
		}

		parts.push(p);
	}

	if (!isValidPath(parts)) {
		return [];
	}

	return parts;
}

var dotProp = {
	get(object, path, value) {
		if (!isObj(object) || typeof path !== 'string') {
			return value === undefined ? object : value;
		}

		const pathArray = getPathSegments(path);
		if (pathArray.length === 0) {
			return;
		}

		for (let i = 0; i < pathArray.length; i++) {
			object = object[pathArray[i]];

			if (object === undefined || object === null) {
				// `object` is either `undefined` or `null` so we want to stop the loop, and
				// if this is not the last bit of the path, and
				// if it did't return `undefined`
				// it would return `null` if `object` is `null`
				// but we want `get({foo: null}, 'foo.bar')` to equal `undefined`, or the supplied value, not `null`
				if (i !== pathArray.length - 1) {
					return value;
				}

				break;
			}
		}

		return object === undefined ? value : object;
	},

	set(object, path, value) {
		if (!isObj(object) || typeof path !== 'string') {
			return object;
		}

		const root = object;
		const pathArray = getPathSegments(path);

		for (let i = 0; i < pathArray.length; i++) {
			const p = pathArray[i];

			if (!isObj(object[p])) {
				object[p] = {};
			}

			if (i === pathArray.length - 1) {
				object[p] = value;
			}

			object = object[p];
		}

		return root;
	},

	delete(object, path) {
		if (!isObj(object) || typeof path !== 'string') {
			return false;
		}

		const pathArray = getPathSegments(path);

		for (let i = 0; i < pathArray.length; i++) {
			const p = pathArray[i];

			if (i === pathArray.length - 1) {
				delete object[p];
				return true;
			}

			object = object[p];

			if (!isObj(object)) {
				return false;
			}
		}
	},

	has(object, path) {
		if (!isObj(object) || typeof path !== 'string') {
			return false;
		}

		const pathArray = getPathSegments(path);
		if (pathArray.length === 0) {
			return false;
		}

		// eslint-disable-next-line unicorn/no-for-loop
		for (let i = 0; i < pathArray.length; i++) {
			if (isObj(object)) {
				if (!(pathArray[i] in object)) {
					return false;
				}

				object = object[pathArray[i]];
			} else {
				return false;
			}
		}

		return true;
	}
};

const randomBytesAsync = util$1.promisify(crypto__default['default'].randomBytes);

const urlSafeCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~'.split('');
const numericCharacters = '0123456789'.split('');
const distinguishableCharacters = 'CDEHKMPRTUWXY012458'.split('');
const asciiPrintableCharacters = '!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~'.split('');
const alphanumericCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('');

const generateForCustomCharacters = (length, characters) => {
	// Generating entropy is faster than complex math operations, so we use the simplest way
	const characterCount = characters.length;
	const maxValidSelector = (Math.floor(0x10000 / characterCount) * characterCount) - 1; // Using values above this will ruin distribution when using modular division
	const entropyLength = 2 * Math.ceil(1.1 * length); // Generating a bit more than required so chances we need more than one pass will be really low
	let string = '';
	let stringLength = 0;

	while (stringLength < length) { // In case we had many bad values, which may happen for character sets of size above 0x8000 but close to it
		const entropy = crypto__default['default'].randomBytes(entropyLength);
		let entropyPosition = 0;

		while (entropyPosition < entropyLength && stringLength < length) {
			const entropyValue = entropy.readUInt16LE(entropyPosition);
			entropyPosition += 2;
			if (entropyValue > maxValidSelector) { // Skip values which will ruin distribution when using modular division
				continue;
			}

			string += characters[entropyValue % characterCount];
			stringLength++;
		}
	}

	return string;
};

const generateForCustomCharactersAsync = async (length, characters) => {
	// Generating entropy is faster than complex math operations, so we use the simplest way
	const characterCount = characters.length;
	const maxValidSelector = (Math.floor(0x10000 / characterCount) * characterCount) - 1; // Using values above this will ruin distribution when using modular division
	const entropyLength = 2 * Math.ceil(1.1 * length); // Generating a bit more than required so chances we need more than one pass will be really low
	let string = '';
	let stringLength = 0;

	while (stringLength < length) { // In case we had many bad values, which may happen for character sets of size above 0x8000 but close to it
		const entropy = await randomBytesAsync(entropyLength); // eslint-disable-line no-await-in-loop
		let entropyPosition = 0;

		while (entropyPosition < entropyLength && stringLength < length) {
			const entropyValue = entropy.readUInt16LE(entropyPosition);
			entropyPosition += 2;
			if (entropyValue > maxValidSelector) { // Skip values which will ruin distribution when using modular division
				continue;
			}

			string += characters[entropyValue % characterCount];
			stringLength++;
		}
	}

	return string;
};

const generateRandomBytes = (byteLength, type, length) => crypto__default['default'].randomBytes(byteLength).toString(type).slice(0, length);

const generateRandomBytesAsync = async (byteLength, type, length) => {
	const buffer = await randomBytesAsync(byteLength);
	return buffer.toString(type).slice(0, length);
};

const allowedTypes = new Set([
	undefined,
	'hex',
	'base64',
	'url-safe',
	'numeric',
	'distinguishable',
	'ascii-printable',
	'alphanumeric'
]);

const createGenerator = (generateForCustomCharacters, generateRandomBytes) => ({length, type, characters}) => {
	if (!(length >= 0 && Number.isFinite(length))) {
		throw new TypeError('Expected a `length` to be a non-negative finite number');
	}

	if (type !== undefined && characters !== undefined) {
		throw new TypeError('Expected either `type` or `characters`');
	}

	if (characters !== undefined && typeof characters !== 'string') {
		throw new TypeError('Expected `characters` to be string');
	}

	if (!allowedTypes.has(type)) {
		throw new TypeError(`Unknown type: ${type}`);
	}

	if (type === undefined && characters === undefined) {
		type = 'hex';
	}

	if (type === 'hex' || (type === undefined && characters === undefined)) {
		return generateRandomBytes(Math.ceil(length * 0.5), 'hex', length); // Need 0.5 byte entropy per character
	}

	if (type === 'base64') {
		return generateRandomBytes(Math.ceil(length * 0.75), 'base64', length); // Need 0.75 byte of entropy per character
	}

	if (type === 'url-safe') {
		return generateForCustomCharacters(length, urlSafeCharacters);
	}

	if (type === 'numeric') {
		return generateForCustomCharacters(length, numericCharacters);
	}

	if (type === 'distinguishable') {
		return generateForCustomCharacters(length, distinguishableCharacters);
	}

	if (type === 'ascii-printable') {
		return generateForCustomCharacters(length, asciiPrintableCharacters);
	}

	if (type === 'alphanumeric') {
		return generateForCustomCharacters(length, alphanumericCharacters);
	}

	if (characters.length === 0) {
		throw new TypeError('Expected `characters` string length to be greater than or equal to 1');
	}

	if (characters.length > 0x10000) {
		throw new TypeError('Expected `characters` string length to be less or equal to 65536');
	}

	return generateForCustomCharacters(length, characters.split(''));
};

const cryptoRandomString = createGenerator(generateForCustomCharacters, generateRandomBytes);

cryptoRandomString.async = createGenerator(generateForCustomCharactersAsync, generateRandomBytesAsync);

function uniqueString() {
	return cryptoRandomString({length: 32});
}

const configDirectory = xdgConfig || path__default['default'].join(os__default['default'].tmpdir(), uniqueString());
const permissionError = 'You don\'t have access to this file.';
const mkdirOptions = {mode: 0o0700, recursive: true};
const writeFileOptions = {mode: 0o0600};

class Configstore {
	constructor(id, defaults, options = {}) {
		const pathPrefix = options.globalConfigPath ?
			path__default['default'].join(id, 'config.json') :
			path__default['default'].join('configstore', `${id}.json`);

		this._path = options.configPath || path__default['default'].join(configDirectory, pathPrefix);

		if (defaults) {
			this.all = {
				...defaults,
				...this.all
			};
		}
	}

	get all() {
		try {
			return JSON.parse(gracefulFs.readFileSync(this._path, 'utf8'));
		} catch (error) {
			// Create directory if it doesn't exist
			if (error.code === 'ENOENT') {
				return {};
			}

			// Improve the message of permission errors
			if (error.code === 'EACCES') {
				error.message = `${error.message}\n${permissionError}\n`;
			}

			// Empty the file if it encounters invalid JSON
			if (error.name === 'SyntaxError') {
				writeFileAtomic.sync(this._path, '', writeFileOptions);
				return {};
			}

			throw error;
		}
	}

	set all(value) {
		try {
			// Make sure the folder exists as it could have been deleted in the meantime
			gracefulFs.mkdirSync(path__default['default'].dirname(this._path), mkdirOptions);

			writeFileAtomic.sync(this._path, JSON.stringify(value, undefined, '\t'), writeFileOptions);
		} catch (error) {
			// Improve the message of permission errors
			if (error.code === 'EACCES') {
				error.message = `${error.message}\n${permissionError}\n`;
			}

			throw error;
		}
	}

	get size() {
		return Object.keys(this.all || {}).length;
	}

	get(key) {
		return dotProp.get(this.all, key);
	}

	set(key, value) {
		const config = this.all;

		if (arguments.length === 1) {
			for (const k of Object.keys(key)) {
				dotProp.set(config, k, key[k]);
			}
		} else {
			dotProp.set(config, key, value);
		}

		this.all = config;
	}

	has(key) {
		return dotProp.has(this.all, key);
	}

	delete(key) {
		const config = this.all;
		dotProp.delete(config, key);
		this.all = config;
	}

	clear() {
		this.all = {};
	}

	get path() {
		return this._path;
	}
}

let config;
const getConfigStore = () => {
  if (!config) {
    config = new Configstore(`medusa`, {}, {
      globalConfigPath: true
    });
  }

  return config;
};

const store = getConfigStore();

const medusaCliVersion = require(`../package.json`).version;

const analyticsApi = process.env.MEDUSA_TELEMETRY_API || `https://telemetry.medusa-commerce.com/batch`;

const getMachineId = () => {
  let machineId = store.get(`telemetry.machine_id`);

  if (typeof machineId !== `string`) {
    machineId = v4_1();
    store.set(`telemetry.machine_id`, machineId);
  }

  return machineId;
};

const sessionId = v4_1();
const track = (eventType, args) => {
  fetch(analyticsApi, {
    method: `POST`,
    headers: {
      "content-type": `application/json`,
      "user-agent": `create-medusa-app:${medusaCliVersion}`
    },
    body: JSON.stringify({
      timestamp: new Date(),
      batch: [{
        type: eventType,
        timestamp: new Date(),
        sessionId,
        machine_id: getMachineId(),
        component_id: `create-medusa-app`,
        cli_version: medusaCliVersion,
        properties: args
      }]
    })
  }).catch(() => {});
  /* do nothing, it's telemetry */
};

var symbols = createCommonjsModule(function (module) {

const isHyper = process.env.TERM_PROGRAM === 'Hyper';
const isWindows = process.platform === 'win32';
const isLinux = process.platform === 'linux';

const common = {
  ballotDisabled: '☒',
  ballotOff: '☐',
  ballotOn: '☑',
  bullet: '•',
  bulletWhite: '◦',
  fullBlock: '█',
  heart: '❤',
  identicalTo: '≡',
  line: '─',
  mark: '※',
  middot: '·',
  minus: '－',
  multiplication: '×',
  obelus: '÷',
  pencilDownRight: '✎',
  pencilRight: '✏',
  pencilUpRight: '✐',
  percent: '%',
  pilcrow2: '❡',
  pilcrow: '¶',
  plusMinus: '±',
  section: '§',
  starsOff: '☆',
  starsOn: '★',
  upDownArrow: '↕'
};

const windows = Object.assign({}, common, {
  check: '√',
  cross: '×',
  ellipsisLarge: '...',
  ellipsis: '...',
  info: 'i',
  question: '?',
  questionSmall: '?',
  pointer: '>',
  pointerSmall: '»',
  radioOff: '( )',
  radioOn: '(*)',
  warning: '‼'
});

const other = Object.assign({}, common, {
  ballotCross: '✘',
  check: '✔',
  cross: '✖',
  ellipsisLarge: '⋯',
  ellipsis: '…',
  info: 'ℹ',
  question: '?',
  questionFull: '？',
  questionSmall: '﹖',
  pointer: isLinux ? '▸' : '❯',
  pointerSmall: isLinux ? '‣' : '›',
  radioOff: '◯',
  radioOn: '◉',
  warning: '⚠'
});

module.exports = (isWindows && !isHyper) ? windows : other;
Reflect.defineProperty(module.exports, 'common', { enumerable: false, value: common });
Reflect.defineProperty(module.exports, 'windows', { enumerable: false, value: windows });
Reflect.defineProperty(module.exports, 'other', { enumerable: false, value: other });
});

const isObject = val => val !== null && typeof val === 'object' && !Array.isArray(val);

/* eslint-disable no-control-regex */
// this is a modified version of https://github.com/chalk/ansi-regex (MIT License)
const ANSI_REGEX = /[\u001b\u009b][[\]#;?()]*(?:(?:(?:[^\W_]*;?[^\W_]*)\u0007)|(?:(?:[0-9]{1,4}(;[0-9]{0,4})*)?[~0-9=<>cf-nqrtyA-PRZ]))/g;

const create = () => {
  const colors = { enabled: true, visible: true, styles: {}, keys: {} };

  if ('FORCE_COLOR' in process.env) {
    colors.enabled = process.env.FORCE_COLOR !== '0';
  }

  const ansi = style => {
    let open = style.open = `\u001b[${style.codes[0]}m`;
    let close = style.close = `\u001b[${style.codes[1]}m`;
    let regex = style.regex = new RegExp(`\\u001b\\[${style.codes[1]}m`, 'g');
    style.wrap = (input, newline) => {
      if (input.includes(close)) input = input.replace(regex, close + open);
      let output = open + input + close;
      // see https://github.com/chalk/chalk/pull/92, thanks to the
      // chalk contributors for this fix. However, we've confirmed that
      // this issue is also present in Windows terminals
      return newline ? output.replace(/\r*\n/g, `${close}$&${open}`) : output;
    };
    return style;
  };

  const wrap = (style, input, newline) => {
    return typeof style === 'function' ? style(input) : style.wrap(input, newline);
  };

  const style = (input, stack) => {
    if (input === '' || input == null) return '';
    if (colors.enabled === false) return input;
    if (colors.visible === false) return '';
    let str = '' + input;
    let nl = str.includes('\n');
    let n = stack.length;
    if (n > 0 && stack.includes('unstyle')) {
      stack = [...new Set(['unstyle', ...stack])].reverse();
    }
    while (n-- > 0) str = wrap(colors.styles[stack[n]], str, nl);
    return str;
  };

  const define = (name, codes, type) => {
    colors.styles[name] = ansi({ name, codes });
    let keys = colors.keys[type] || (colors.keys[type] = []);
    keys.push(name);

    Reflect.defineProperty(colors, name, {
      configurable: true,
      enumerable: true,
      set(value) {
        colors.alias(name, value);
      },
      get() {
        let color = input => style(input, color.stack);
        Reflect.setPrototypeOf(color, colors);
        color.stack = this.stack ? this.stack.concat(name) : [name];
        return color;
      }
    });
  };

  define('reset', [0, 0], 'modifier');
  define('bold', [1, 22], 'modifier');
  define('dim', [2, 22], 'modifier');
  define('italic', [3, 23], 'modifier');
  define('underline', [4, 24], 'modifier');
  define('inverse', [7, 27], 'modifier');
  define('hidden', [8, 28], 'modifier');
  define('strikethrough', [9, 29], 'modifier');

  define('black', [30, 39], 'color');
  define('red', [31, 39], 'color');
  define('green', [32, 39], 'color');
  define('yellow', [33, 39], 'color');
  define('blue', [34, 39], 'color');
  define('magenta', [35, 39], 'color');
  define('cyan', [36, 39], 'color');
  define('white', [37, 39], 'color');
  define('gray', [90, 39], 'color');
  define('grey', [90, 39], 'color');

  define('bgBlack', [40, 49], 'bg');
  define('bgRed', [41, 49], 'bg');
  define('bgGreen', [42, 49], 'bg');
  define('bgYellow', [43, 49], 'bg');
  define('bgBlue', [44, 49], 'bg');
  define('bgMagenta', [45, 49], 'bg');
  define('bgCyan', [46, 49], 'bg');
  define('bgWhite', [47, 49], 'bg');

  define('blackBright', [90, 39], 'bright');
  define('redBright', [91, 39], 'bright');
  define('greenBright', [92, 39], 'bright');
  define('yellowBright', [93, 39], 'bright');
  define('blueBright', [94, 39], 'bright');
  define('magentaBright', [95, 39], 'bright');
  define('cyanBright', [96, 39], 'bright');
  define('whiteBright', [97, 39], 'bright');

  define('bgBlackBright', [100, 49], 'bgBright');
  define('bgRedBright', [101, 49], 'bgBright');
  define('bgGreenBright', [102, 49], 'bgBright');
  define('bgYellowBright', [103, 49], 'bgBright');
  define('bgBlueBright', [104, 49], 'bgBright');
  define('bgMagentaBright', [105, 49], 'bgBright');
  define('bgCyanBright', [106, 49], 'bgBright');
  define('bgWhiteBright', [107, 49], 'bgBright');

  colors.ansiRegex = ANSI_REGEX;
  colors.hasColor = colors.hasAnsi = str => {
    colors.ansiRegex.lastIndex = 0;
    return typeof str === 'string' && str !== '' && colors.ansiRegex.test(str);
  };

  colors.alias = (name, color) => {
    let fn = typeof color === 'string' ? colors[color] : color;

    if (typeof fn !== 'function') {
      throw new TypeError('Expected alias to be the name of an existing color (string) or a function');
    }

    if (!fn.stack) {
      Reflect.defineProperty(fn, 'name', { value: name });
      colors.styles[name] = fn;
      fn.stack = [name];
    }

    Reflect.defineProperty(colors, name, {
      configurable: true,
      enumerable: true,
      set(value) {
        colors.alias(name, value);
      },
      get() {
        let color = input => style(input, color.stack);
        Reflect.setPrototypeOf(color, colors);
        color.stack = this.stack ? this.stack.concat(fn.stack) : fn.stack;
        return color;
      }
    });
  };

  colors.theme = custom => {
    if (!isObject(custom)) throw new TypeError('Expected theme to be an object');
    for (let name of Object.keys(custom)) {
      colors.alias(name, custom[name]);
    }
    return colors;
  };

  colors.alias('unstyle', str => {
    if (typeof str === 'string' && str !== '') {
      colors.ansiRegex.lastIndex = 0;
      return str.replace(colors.ansiRegex, '');
    }
    return '';
  });

  colors.alias('noop', str => str);
  colors.none = colors.clear = colors.noop;

  colors.stripColor = colors.unstyle;
  colors.symbols = symbols;
  colors.define = define;
  return colors;
};

var ansiColors = create();
var create_1 = create;
ansiColors.create = create_1;

const reporter = {
  info: message => console.log(message),
  verbose: message => console.log(message),
  log: message => console.log(message),
  success: message => console.log(ansiColors.green(ansiColors.symbols.check + ` `) + message),
  error: message => console.error(ansiColors.red(ansiColors.symbols.cross + ` `) + message),
  panic: message => {
    console.error(message);
    process.exit(1);
  },
  warn: message => console.warn(message)
};

const packageManagerConfigKey = `cli.packageManager`;
const getPackageManager = npmConfigUserAgent => {
  const configStore = getConfigStore();
  const actualPackageManager = configStore.get(packageManagerConfigKey);

  if (actualPackageManager) {
    return actualPackageManager;
  }

  if (npmConfigUserAgent != null && npmConfigUserAgent.includes(`yarn`)) {
    configStore.set(packageManagerConfigKey, `yarn`);
    return `yarn`;
  }

  configStore.set(packageManagerConfigKey, `npm`);
  return `npm`;
};

const spawnWithArgs = (file, args, options) => execa_1(file, args, _extends({
  stdio: `inherit`,
  preferLocal: false
}, options));

const spawn = (cmd, options) => {
  const [file, ...args] = cmd.split(/\s+/);
  return spawnWithArgs(file, args, options);
}; // Checks the existence of yarn package
// We use yarnpkg instead of yarn to avoid conflict with Hadoop yarn
// Refer to https://github.com/yarnpkg/yarn/issues/673


const checkForYarn = () => {
  try {
    childProcess.execSync(`yarnpkg --version`, {
      stdio: `ignore`
    });
    return true;
  } catch (e) {
    return false;
  }
};

const isAlreadyGitRepository = async () => {
  try {
    return await spawn(`git rev-parse --is-inside-work-tree`, {
      stdio: `pipe`
    }).then(output => output.stdout === `true`);
  } catch (err) {
    return false;
  }
}; // Initialize newly cloned directory as a git repo


const gitInit = async rootPath => {
  reporter.info(`Initialising git in ${rootPath}`);
  return await spawn(`git init`, {
    cwd: rootPath
  });
}; // Create a .gitignore file if it is missing in the new directory


const maybeCreateGitIgnore = async rootPath => {
  if (fsExistsCached.sync(path__default['default'].join(rootPath, `.gitignore`))) {
    return;
  }

  reporter.info(`Creating minimal .gitignore in ${rootPath}`);
  await lib.writeFile(path__default['default'].join(rootPath, `.gitignore`), `.cache\nnode_modules\npublic\n`);
  reporter.success(`Created .gitignore in ${rootPath}`);
}; // Create an initial git commit in the new directory


const createInitialGitCommit = async (rootPath, starterUrl) => {
  reporter.info(`Create initial git commit in ${rootPath}`);
  await spawn(`git add -A`, {
    cwd: rootPath
  }); // use execSync instead of spawn to handle git clients using
  // pgp signatures (with password)

  try {
    childProcess.execSync(`git commit -m "Initial commit from medusa: (${starterUrl})"`, {
      cwd: rootPath
    });
  } catch (_unused) {
    // Remove git support if initial commit fails
    reporter.warn(`Initial git commit failed - removing git support\n`);
    lib.removeSync(path__default['default'].join(rootPath, `.git`));
  }
}; // Executes `npm install` or `yarn install` in rootPath.


const install = async rootPath => {
  const prevDir = process.cwd();
  reporter.info(`Installing packages...`);
  console.log(); // Add some space

  process.chdir(rootPath);
  process.env.npm_config_user_agent;

  try {
    if (getPackageManager() === `yarn` && checkForYarn()) {
      await lib.remove(`package-lock.json`);
      await spawn(`yarnpkg`);
    } else {
      await lib.remove(`yarn.lock`);
      await spawn(`npm install`);
    }
  } finally {
    process.chdir(prevDir);
  }
};

const ignored = path => !/^\.(git|hg)$/.test(path__default['default'].basename(path)); // Copy starter from file system.


const copy = async (starterPath, rootPath) => {
  // Chmod with 755.
  // 493 = parseInt('755', 8)
  await lib.ensureDir(rootPath, {
    mode: 493
  });

  if (!fsExistsCached.sync(starterPath)) {
    throw new Error(`starter ${starterPath} doesn't exist`);
  }

  if (starterPath === `.`) {
    throw new Error(`You can't create a starter from the existing directory. If you want to
      create a new project in the current directory, the trailing dot isn't
      necessary. If you want to create a project from a local starter, run
      something like "medusa new my-medusa-store ../local-medusa-starter"`);
  }

  reporter.info(`Creating new site from local starter: ${starterPath}`);
  reporter.info(`Copying local starter to ${rootPath} ...`);
  await lib.copy(starterPath, rootPath, {
    filter: ignored
  });
  reporter.success(`Created starter directory layout`);
  console.log(); // Add some space

  await install(rootPath);
  return true;
}; // Clones starter from URI.


const clone = async (hostInfo, rootPath) => {
  let url; // Let people use private repos accessed over SSH.

  if (hostInfo.getDefaultRepresentation() === `sshurl`) {
    url = hostInfo.ssh({
      noCommittish: true
    }); // Otherwise default to normal git syntax.
  } else {
    url = hostInfo.https({
      noCommittish: true,
      noGitPlus: true
    });
  }

  const branch = hostInfo.committish ? [`-b`, hostInfo.committish] : [];
  reporter.info(`Creating new project from git: ${url}`);
  const args = [`clone`, ...branch, url, rootPath, `--recursive`, `--depth=1`].filter(arg => Boolean(arg));
  await execa_1(`git`, args, {}).then(() => {
    reporter.success(`Created starter directory layout`);
  }).catch(err => {
    reporter.error(`Failed to clone repository`);
    throw err;
  });
  await lib.remove(path__default['default'].join(rootPath, `.git`));
  await install(rootPath);
  const isGit = await isAlreadyGitRepository();
  if (!isGit) await gitInit(rootPath);
  await maybeCreateGitIgnore(rootPath);
  if (!isGit) await createInitialGitCommit(rootPath, url);
};

const getMedusaConfig = rootPath => {
  try {
    const configPath = path__default['default'].join(rootPath, "medusa-config.js");

    if (fsExistsCached.sync(configPath)) {
      const resolved = path__default['default'].resolve(configPath);

      const configModule = require(resolved);

      return configModule;
    }

    throw Error();
  } catch (err) {
    console.log(err);
    reporter.warn(`Couldn't find a medusa-config.js file; please double check that you have the correct starter installed`);
  }

  return {};
};

const getPaths = async (starterPath, rootPath) => {
  let selectedOtherStarter = false; // set defaults if no root or starter has been set yet

  rootPath = rootPath || process.cwd();
  starterPath = starterPath || `medusajs/medusa-starter-default`;
  return {
    starterPath,
    rootPath,
    selectedOtherStarter
  };
};

const successMessage = path => {
  reporter.info(`Your new Medusa project is ready for you! To start developing run:

  cd ${path}
  medusa develop
`);
};

const attemptSeed = async rootPath => {
  reporter.info("Seeding database");
  const pkgPath = path__default['default'].resolve(rootPath, "package.json");

  if (fsExistsCached.sync(pkgPath)) {
    const pkg = require(pkgPath);

    if (pkg.scripts && pkg.scripts.seed) {
      const proc = execa_1(getPackageManager(), [`run`, `seed`], {
        cwd: rootPath
      }); // Useful for development
      // proc.stdout.pipe(process.stdout)

      await proc.then(() => {
        reporter.success("Seed completed");
      }).catch(err => {
        reporter.error("Failed to complete seed; skipping");
        console.error(err);
      });
    } else {
      reporter.error("Starter doesn't provide a seed command; skipping.");
    }
  } else {
    reporter.error("Could not find package.json");
  }
};
/**
 * Main function that clones or copies the starter.
 */


const newStarter = async args => {
  track("CLI_NEW");
  const {
    starter,
    root,
    skipDb,
    skipMigrations,
    skipEnv,
    seed,
    dbHost
  } = args;
  const {
    starterPath,
    rootPath,
    selectedOtherStarter
  } = await getPaths(starter, root);
  const urlObject = url__default['default'].parse(rootPath);

  if (urlObject.protocol && urlObject.host) {
    const isStarterAUrl = starter && !url__default['default'].parse(starter).hostname && !url__default['default'].parse(starter).protocol;

    if (/medusa-starter/gi.test(rootPath) && isStarterAUrl) {
      reporter.panic({
        id: `10000`,
        context: {
          starter,
          rootPath
        }
      });
      return;
    }

    reporter.panic({
      id: `10001`,
      context: {
        rootPath
      }
    });
    return;
  }

  if (!isValidPath$1(rootPath)) {
    reporter.panic({
      id: `10002`,
      context: {
        path: path__default['default'].resolve(rootPath)
      }
    });
    return;
  }

  if (fsExistsCached.sync(path__default['default'].join(rootPath, `package.json`))) {
    reporter.panic({
      id: `10003`,
      context: {
        rootPath
      }
    });
    return;
  }

  const hostedInfo = hostedGitInfo.fromUrl(starterPath);

  if (hostedInfo) {
    await clone(hostedInfo, rootPath);
  } else {
    await copy(starterPath, rootPath);
  }

  const medusaConfig = getMedusaConfig(rootPath);
  let isPostgres = false;

  if (medusaConfig && medusaConfig.projectConfig) {
    const databaseType = medusaConfig.projectConfig.database_type;
    isPostgres = databaseType === "postgres";
  }

  track("CLI_NEW_LAYOUT_COMPLETED");

  if (!isPostgres && seed) {
    track("CLI_NEW_SEED_DB");
    await attemptSeed(rootPath);
  }

  successMessage(rootPath);
  track("CLI_NEW_SUCCEEDED");
};

var name = "create-medusa-app";
var version = "0.0.0";
var main = "dist/index.js";
var bin = "cli.js";
var license = "MIT";
var files = [
	"dist/index.js",
	"cli.js"
];
var scripts = {
	build: "microbundle -i src/index.ts --no-pkg-main --target=node -f=cjs --sourcemap=false --compress --alias worker_threads=@ascorbic/worker-threads-shim",
	watch: "microbundle -i src/index.ts --no-pkg-main --target=node -f=cjs --sourcemap=false --alias worker_threads=@ascorbic/worker-threads-shim --watch",
	prepare: "yarn build"
};
var dependencies = {
	"@babel/runtime": "^7.15.4"
};
var peerDependencies = {
};
var devDependencies = {
	"@ascorbic/worker-threads-shim": "^1.0.0",
	"@babel/runtime": "^7.15.4",
	"@types/chalk": "^2.2.0",
	"@types/commander": "^2.12.2",
	"@types/configstore": "^4.0.0",
	"@types/fs-extra": "^9.0.12",
	"@types/node": "^14.17.14",
	"ansi-wordwrap": "^1.0.2",
	chalk: "^4.1.2",
	commander: "^8.1.0",
	"common-tags": "^1.8.0",
	configstore: "^6.0.0",
	enquirer: "^2.3.6",
	eslint: "^7.32.0",
	execa: "^5.1.1",
	"fs-exists-cached": "^1.0.0",
	"fs-extra": "^10.0.0",
	"hosted-git-info": "^4.0.2",
	"is-valid-path": "^0.1.1",
	joi: "^17.4.2",
	microbundle: "^0.13.3",
	"node-fetch": "^2.6.1",
	prettier: "^2.3.2",
	prompts: "^2.4.1",
	"string-length": "^4.0.2",
	"terminal-link": "^2.1.1",
	"tiny-spin": "^1.0.2",
	url: "^0.11.0",
	uuid: "3.4.0"
};
var repository = {
	type: "git",
	url: "https://github.com/medusajs/medusa.git",
	directory: "packages/create-medusa-app"
};
var author = "Sebastian Rindom <seb@medusa-commerce.com>";
var publishConfig = {
	access: "public"
};
var pkg = {
	name: name,
	version: version,
	main: main,
	bin: bin,
	license: license,
	files: files,
	scripts: scripts,
	dependencies: dependencies,
	peerDependencies: peerDependencies,
	devDependencies: devDependencies,
	repository: repository,
	author: author,
	publishConfig: publishConfig
};

let projectPath = "";
const program = new commander.Command(pkg.name).version(pkg.version).arguments(`<directory>`).usage(`${source.green("<directory>")} [options]`).action(name => projectPath = name).option(`-s --starter-url`, `A GitHub URL to a repository that contains a Medusa starter project to bootstrap from`).option(`--seed`, `If run with the seed flag the script will automatically attempt to seed the database upon setup`).parse(process.argv);
const run = async () => {
  if (typeof projectPath === "string") {
    projectPath = projectPath.trim();
  }

  return await newStarter({
    starter: program.starterUrl,
    root: projectPath,
    seed: program.seed
  });
};

exports.run = run;
