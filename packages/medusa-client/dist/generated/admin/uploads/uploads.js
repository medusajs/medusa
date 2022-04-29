"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postUploads = void 0;
var custom_instance_1 = require("../../../src/custom-instance");
/**
 * Uploads an array of files to the specific fileservice that is installed in medusa.
 * @summary Uploads an array of files
 */
var postUploads = function (postUploadsBody) {
    var formData = new FormData();
    if (postUploadsBody.files !== undefined) {
        formData.append("files", JSON.stringify(postUploadsBody.files));
    }
    return (0, custom_instance_1.getClient)({
        url: "/admin/",
        method: "post",
        headers: { "Content-Type": "multipart/form-data" },
        data: formData,
    });
};
exports.postUploads = postUploads;
//# sourceMappingURL=uploads.js.map