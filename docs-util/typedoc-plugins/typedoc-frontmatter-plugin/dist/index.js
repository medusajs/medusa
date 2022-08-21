"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.load = void 0;
const typedoc_1 = require("typedoc");
function load(app) {
    app.options.addDeclaration({
        name: "frontmatterData",
        help: "An object of key-value pairs to be added to frontmatter",
        type: typedoc_1.ParameterType.Mixed,
        defaultValue: {},
        validate: (value) => {
            if (typeof value === 'string') {
                //decode it with JSON to check if it's an object
                value = JSON.parse(value);
            }
            if (!(typeof value === 'object' &&
                !Array.isArray(value) &&
                value !== null)) {
                throw new Error("Value should be an object");
            }
        }
    });
    app.options.addDeclaration({
        name: "pagesPattern",
        help: "A string of pages pattern. The pattern will be tested using RegExp to determine whether the frontmatterData will be added or not.",
        type: typedoc_1.ParameterType.String,
        defaultValue: ""
    });
    app.renderer.on(typedoc_1.PageEvent.END, (page) => {
        const patternStr = app.options.getValue("pagesPattern");
        const pattern = new RegExp(patternStr);
        let frontmatterData = app.options.getValue("frontmatterData");
        if (typeof frontmatterData === 'string') {
            frontmatterData = JSON.parse(frontmatterData);
        }
        const frontmatterDataEntries = Object.entries(frontmatterData);
        if (!frontmatterDataEntries.length || !pattern.test(page.filename)) {
            return;
        }
        let frontmatterStr = `---\n`;
        for (const [key, value] of frontmatterDataEntries) {
            frontmatterStr += `${key}: ${value}\n`;
        }
        frontmatterStr += `---\n\n`;
        page.contents = frontmatterStr + page.contents;
    });
}
exports.load = load;
//# sourceMappingURL=index.js.map