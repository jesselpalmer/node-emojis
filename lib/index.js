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
// Features - re-export everything
__exportStar(require("./features/search"), exports);
__exportStar(require("./features/skin-tones"), exports);
__exportStar(require("./features/aliases"), exports);
__exportStar(require("./features/filters"), exports);
// Utils
__exportStar(require("./utils/reverse-mapping"), exports);
__exportStar(require("./utils/validators"), exports);
// Types
__exportStar(require("./core/emoji"), exports);
// Create default export with backward compatibility
const emojis = {};
// Copy all emoji properties
Object.assign(emojis, emojis_json_1.default);
// Add getters for backward compatibility
Object.defineProperty(emojis, 'metadata', {
    get: () => metadata_json_1.default,
    enumerable: false
});
Object.defineProperty(emojis, 'categories', {
    get: () => {
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
    },
    enumerable: false
});
// For backward compatibility - add reverse mapping
let cachedReverseMapping = null;
Object.defineProperty(emojis, 'emojiToName', {
    get: () => {
        if (!cachedReverseMapping) {
            cachedReverseMapping = {};
            Object.entries(emojis_json_1.default).forEach(([name, emoji]) => {
                cachedReverseMapping[emoji] = name;
            });
        }
        return cachedReverseMapping;
    },
    enumerable: false
});
Object.defineProperty(emojis, 'reverseMapping', {
    get: () => emojis.emojiToName,
    enumerable: false
});
// Add backward compatibility methods
Object.defineProperty(emojis, 'searchByKeyword', {
    value: (keyword) => {
        const { search } = require('./features/search');
        // Transform results for backward compatibility
        return search(keyword).map((result) => ({
            name: result.name,
            emoji: result.emoji,
            metadata: {
                keywords: result.keywords,
                category: result.category,
                unicodeVersion: metadata_json_1.default[result.name]?.unicodeVersion || '1.0'
            }
        }));
    },
    enumerable: false
});
Object.defineProperty(emojis, 'getByCategory', {
    value: (category) => {
        const { getByCategory } = require('./features/search');
        // Transform results for backward compatibility
        return getByCategory(category).map((result) => ({
            name: result.name,
            emoji: result.emoji,
            metadata: {
                keywords: result.keywords,
                category: result.category,
                unicodeVersion: metadata_json_1.default[result.name]?.unicodeVersion || '1.0'
            }
        }));
    },
    enumerable: false
});
Object.defineProperty(emojis, 'getAllNames', {
    value: () => Object.keys(emojis_json_1.default),
    enumerable: false
});
// Skin tone methods
Object.defineProperty(emojis, 'applySkinTone', {
    value: (emoji, tone) => {
        const { applySkinTone } = require('./features/skin-tones');
        return applySkinTone(emoji, tone);
    },
    enumerable: false
});
Object.defineProperty(emojis, 'supportsSkinTone', {
    value: (nameOrEmoji) => {
        const { supportsSkinTone } = require('./features/skin-tones');
        return supportsSkinTone(nameOrEmoji);
    },
    enumerable: false
});
Object.defineProperty(emojis, 'getAllSkinToneVariations', {
    value: (emoji) => {
        const { getAllSkinToneVariations } = require('./features/skin-tones');
        return getAllSkinToneVariations(emoji);
    },
    enumerable: false
});
Object.defineProperty(emojis, 'removeSkinTone', {
    value: (emoji) => {
        const { removeSkinTone } = require('./features/skin-tones');
        return removeSkinTone(emoji);
    },
    enumerable: false
});
// Alias methods
Object.defineProperty(emojis, 'aliases', {
    get: () => require('./data/aliases.json'),
    enumerable: false
});
Object.defineProperty(emojis, 'getAliases', {
    value: (name) => {
        const { getAliases } = require('./features/aliases');
        return getAliases(name);
    },
    enumerable: false
});
Object.defineProperty(emojis, 'getPrimaryName', {
    value: (name) => {
        const { getPrimaryName } = require('./features/aliases');
        return getPrimaryName(name);
    },
    enumerable: false
});
Object.defineProperty(emojis, 'isSameEmoji', {
    value: (name1, name2) => {
        const { isSameEmoji } = require('./features/aliases');
        return isSameEmoji(name1, name2);
    },
    enumerable: false
});
Object.defineProperty(emojis, 'getAllNamesForEmoji', {
    value: (name) => {
        const { getAllNames } = require('./features/aliases');
        return getAllNames(name);
    },
    enumerable: false
});
// Add skin tone data for backward compatibility
Object.defineProperty(emojis, 'skinTones', {
    get: () => {
        const modifiers = require('./data/skin-tones.json').modifiers;
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
    },
    enumerable: false
});
// Add skin tone constants - camelCase for backward compatibility
Object.defineProperty(emojis, 'skinToneModifiers', {
    get: () => require('./data/skin-tones.json').modifiers,
    enumerable: false
});
// Add skin tone constants - original uppercase
Object.defineProperty(emojis, 'SKIN_TONE_MODIFIERS', {
    get: () => require('./data/skin-tones.json').modifiers,
    enumerable: false
});
Object.defineProperty(emojis, 'SKIN_TONES', {
    get: () => ({
        '1': 'light',
        '2': 'medium-light',
        '3': 'medium',
        '4': 'medium-dark',
        '5': 'dark'
    }),
    enumerable: false
});
// Support alias access
const aliasData = require('./data/aliases.json');
Object.entries(aliasData).forEach(([primary, aliases]) => {
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