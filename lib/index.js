"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Core data
const emojis_json_1 = __importDefault(require("./data/emojis.json"));
const metadata_json_1 = __importDefault(require("./data/metadata.json"));
const categories_json_1 = __importDefault(require("./data/categories.json"));
const aliases_json_1 = __importDefault(require("./data/aliases.json"));
const skin_tones_json_1 = __importDefault(require("./data/skin-tones.json"));
// Features - re-export everything
__exportStar(require("./features/search"), exports);
__exportStar(require("./features/skin-tones"), exports);
__exportStar(require("./features/aliases"), exports);
__exportStar(require("./features/filters"), exports);
// Import functions for backward compatibility
const search_1 = require("./features/search");
const skin_tones_1 = require("./features/skin-tones");
const aliases_1 = require("./features/aliases");
// Utils
__exportStar(require("./utils/reverse-mapping"), exports);
__exportStar(require("./utils/validators"), exports);
// Types
__exportStar(require("./core/emoji"), exports);
// Helper function to define non-enumerable properties
function defineGetter(obj, name, getter) {
    Object.defineProperty(obj, name, {
        get: getter,
        enumerable: false
    });
}
// Helper function to define non-enumerable methods
function defineMethod(obj, name, method) {
    Object.defineProperty(obj, name, {
        value: method,
        enumerable: false
    });
}
// Create default export with backward compatibility
const emojis = {};
// Copy all emoji properties
Object.assign(emojis, emojis_json_1.default);
// Add getters for backward compatibility
defineGetter(emojis, 'metadata', () => metadata_json_1.default);
defineGetter(emojis, 'categories', () => {
    // Convert categories from arrays of names to objects of emojis
    const categoryObjects = {};
    Object.entries(categories_json_1.default).forEach(([category, names]) => {
        categoryObjects[category] = {};
        names.forEach((name) => {
            if (emojis_json_1.default[name]) {
                categoryObjects[category][name] = emojis_json_1.default[name];
            }
        });
    });
    return categoryObjects;
});
// For backward compatibility - add reverse mapping
let cachedReverseMapping = null;
defineGetter(emojis, 'emojiToName', () => {
    if (!cachedReverseMapping) {
        cachedReverseMapping = {};
        Object.entries(emojis_json_1.default).forEach(([name, emoji]) => {
            cachedReverseMapping[emoji] = name;
        });
    }
    return cachedReverseMapping;
});
defineGetter(emojis, 'reverseMapping', () => emojis.emojiToName);
// Add backward compatibility methods
defineMethod(emojis, 'searchByKeyword', (keyword) => {
    // Transform results for backward compatibility
    return (0, search_1.search)(keyword).map((result) => ({
        name: result.name,
        emoji: result.emoji,
        metadata: {
            keywords: result.keywords,
            category: result.category,
            unicodeVersion: metadata_json_1.default[result.name]?.unicodeVersion || '1.0'
        }
    }));
});
defineMethod(emojis, 'getByCategory', (category) => {
    // Transform results for backward compatibility
    return (0, search_1.getByCategory)(category).map((result) => ({
        name: result.name,
        emoji: result.emoji,
        metadata: {
            keywords: result.keywords,
            category: result.category,
            unicodeVersion: metadata_json_1.default[result.name]?.unicodeVersion || '1.0'
        }
    }));
});
defineMethod(emojis, 'getAllNames', () => Object.keys(emojis_json_1.default));
// Skin tone methods
defineMethod(emojis, 'applySkinTone', (emoji, tone) => {
    return (0, skin_tones_1.applySkinTone)(emoji, tone);
});
defineMethod(emojis, 'supportsSkinTone', (nameOrEmoji) => {
    return (0, skin_tones_1.supportsSkinTone)(nameOrEmoji);
});
defineMethod(emojis, 'getAllSkinToneVariations', (emoji) => {
    return (0, skin_tones_1.getAllSkinToneVariations)(emoji);
});
defineMethod(emojis, 'removeSkinTone', (emoji) => {
    return (0, skin_tones_1.removeSkinTone)(emoji);
});
// Alias methods
defineGetter(emojis, 'aliases', () => aliases_json_1.default);
defineMethod(emojis, 'getAliases', (name) => {
    return (0, aliases_1.getAliases)(name);
});
defineMethod(emojis, 'getPrimaryName', (name) => {
    return (0, aliases_1.getPrimaryName)(name);
});
defineMethod(emojis, 'isSameEmoji', (name1, name2) => {
    return (0, aliases_1.isSameEmoji)(name1, name2);
});
defineMethod(emojis, 'getAllNamesForEmoji', (name) => {
    return (0, aliases_1.getAllNames)(name);
});
// Add skin tone data for backward compatibility
defineGetter(emojis, 'skinTones', () => {
    const modifiers = skin_tones_json_1.default.modifiers;
    return {
        // Numeric aliases
        '1': modifiers.light,
        '2': modifiers['medium-light'],
        '3': modifiers.medium,
        '4': modifiers['medium-dark'],
        '5': modifiers.dark,
        // Named versions
        light: modifiers.light,
        'medium-light': modifiers['medium-light'],
        medium: modifiers.medium,
        'medium-dark': modifiers['medium-dark'],
        dark: modifiers.dark
    };
});
// Add skin tone constants - camelCase for backward compatibility
defineGetter(emojis, 'skinToneModifiers', () => skin_tones_json_1.default.modifiers);
// Add skin tone constants - original uppercase
defineGetter(emojis, 'SKIN_TONE_MODIFIERS', () => skin_tones_json_1.default.modifiers);
defineGetter(emojis, 'SKIN_TONES', () => ({
    '1': 'light',
    '2': 'medium-light',
    '3': 'medium',
    '4': 'medium-dark',
    '5': 'dark'
}));
// Support alias access
Object.entries(aliases_json_1.default).forEach(([primary, aliases]) => {
    aliases.forEach(alias => {
        if (!(alias in emojis)) {
            Object.defineProperty(emojis, alias, {
                get: () => emojis_json_1.default[primary],
                enumerable: true
            });
        }
    });
});
// For CommonJS compatibility, we need to export emojis as the module
module.exports = emojis;
// Also export as default for ES modules
module.exports.default = emojis;
// Export the type
exports.default = emojis;
// Re-export features for tree-shaking (these are already exported via __exportStar)
// The named data exports are already available via getters on the emojis object
//# sourceMappingURL=index.js.map