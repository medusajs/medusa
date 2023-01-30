"use strict";
exports.__esModule = true;
var create_cli_1 = require("./create-cli");
(0, create_cli_1.createCli)()
    .then(function (cli) { return cli.parseAsync(process.argv); })["catch"](function (err) {
    console.error(err);
    process.exit(1);
});
