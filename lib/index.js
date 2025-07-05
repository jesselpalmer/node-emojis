"use strict";
/**
 * node-emojis - Complete emoji library for Node.js
 *
 * This module provides both modern tree-shakeable exports and backward compatibility
 * with the v0.x API for smooth migration.
 *
 * Modern usage (tree-shakeable):
 * ```
 * import { search } from 'node-emojis'
 * import { applySkinTone } from 'node-emojis'
 * ```
 *
 * Legacy usage (backward compatible):
 * ```
 * const emojis = require('node-emojis')
 * console.log(emojis.fire) // 🔥
 * ```
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
// Re-export all modern features for tree-shaking
__exportStar(require("./features/search"), exports);
__exportStar(require("./features/skin-tones"), exports);
__exportStar(require("./features/aliases"), exports);
__exportStar(require("./features/filters"), exports);
// Re-export utilities
__exportStar(require("./utils/reverse-mapping"), exports);
__exportStar(require("./utils/validators"), exports);
// Re-export types
__exportStar(require("./core/emoji"), exports);
// Import backward compatibility API
const backward_compat_1 = require("./backward-compat");
// Create the default export with backward compatibility
const emojis = (0, backward_compat_1.createBackwardCompatibleAPI)();
// For CommonJS compatibility, we need to export emojis as the module
module.exports = emojis;
// Also export as default for ES modules
module.exports.default = emojis;
// Export the type
exports.default = emojis;
// Re-export features for tree-shaking (these are already exported via __exportStar)
// The named data exports are already available via getters on the emojis object
//# sourceMappingURL=index.js.map