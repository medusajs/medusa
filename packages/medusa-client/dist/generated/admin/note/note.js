"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postNotesNote = exports.getNotesNote = exports.deleteNotesNote = exports.getNotes = exports.postNotes = void 0;
var custom_instance_1 = require("../../../src/custom-instance");
/**
 * Creates a Note which can be associated with any resource as required.
 * @summary Creates a Note
 */
var postNotes = function (postNotesBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/notes",
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postNotesBody,
    });
};
exports.postNotes = postNotes;
/**
 * Retrieves a list of notes
 * @summary List Notes
 */
var getNotes = function () {
    return (0, custom_instance_1.getClient)({ url: "/admin/notes", method: "get" });
};
exports.getNotes = getNotes;
/**
 * Deletes a Note.
 * @summary Deletes a Note
 */
var deleteNotesNote = function (id) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/notes/".concat(id),
        method: "delete",
    });
};
exports.deleteNotesNote = deleteNotesNote;
/**
 * Retrieves a single note using its id
 * @summary Get Note
 */
var getNotesNote = function (id) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/notes/".concat(id),
        method: "get",
    });
};
exports.getNotesNote = getNotesNote;
/**
 * Updates a Note associated with some resource
 * @summary Updates a Note
 */
var postNotesNote = function (id, postNotesNoteBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/notes/".concat(id),
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postNotesNoteBody,
    });
};
exports.postNotesNote = postNotesNote;
//# sourceMappingURL=note.js.map