'use strict';

var obsidian = require('obsidian');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var BetterWordCountSettingsTab = /** @class */ (function (_super) {
    __extends(BetterWordCountSettingsTab, _super);
    function BetterWordCountSettingsTab() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BetterWordCountSettingsTab.prototype.display = function () {
        var containerEl = this.containerEl;
        var plugin = this.plugin;
        containerEl.empty();
        containerEl.createEl("h2", { text: "Better Word Count Settings" });
        // Word Count Settings
        containerEl.createEl("h3", { text: "Word Count Settings" });
        new obsidian.Setting(containerEl)
            .setName("Show Word Count")
            .setDesc("Enable this to show the word count.")
            .addToggle(function (boolean) {
            return boolean.setValue(plugin.settings.showWords).onChange(function (value) {
                plugin.settings.showWords = value;
                plugin.saveData(plugin.settings);
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Word Count Prefix")
            .setDesc("This changes the text in front of the word count number.")
            .addText(function (text) {
            return text.setValue(plugin.settings.wordsPrefix).onChange(function (value) {
                plugin.settings.wordsPrefix = value;
                plugin.saveData(plugin.settings);
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Word Count Suffix")
            .setDesc("This changes the text after of the word count number.")
            .addText(function (text) {
            return text.setValue(plugin.settings.wordsSuffix).onChange(function (value) {
                plugin.settings.wordsSuffix = value;
                plugin.saveData(plugin.settings);
            });
        });
        // Character Count Settings
        containerEl.createEl("h3", { text: "Character Count Settings" });
        new obsidian.Setting(containerEl)
            .setName("Show Character Count")
            .setDesc("Enable this to show the character count.")
            .addToggle(function (boolean) {
            return boolean.setValue(plugin.settings.showCharacters).onChange(function (value) {
                plugin.settings.showCharacters = value;
                plugin.saveData(plugin.settings);
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Character Count Prefix")
            .setDesc("This changes the text in front of the character count number.")
            .addText(function (text) {
            return text.setValue(plugin.settings.charactersPrefix).onChange(function (value) {
                plugin.settings.charactersPrefix = value;
                plugin.saveData(plugin.settings);
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Character Count Suffix")
            .setDesc("This changes the text after of the character count number.")
            .addText(function (text) {
            return text.setValue(plugin.settings.charactersSuffix).onChange(function (value) {
                plugin.settings.charactersSuffix = value;
                plugin.saveData(plugin.settings);
            });
        });
        // Sentence Count Settings
        containerEl.createEl("h3", { text: "Sentence Count Settings" });
        new obsidian.Setting(containerEl)
            .setName("Show Sentence Count")
            .setDesc("Enable this to show the sentence count.")
            .addToggle(function (boolean) {
            return boolean.setValue(plugin.settings.showSentences).onChange(function (value) {
                plugin.settings.showSentences = value;
                plugin.saveData(plugin.settings);
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Sentence Count Prefix")
            .setDesc("This changes the text in front of the sentence count number.")
            .addText(function (text) {
            return text.setValue(plugin.settings.sentencesPrefix).onChange(function (value) {
                plugin.settings.sentencesPrefix = value;
                plugin.saveData(plugin.settings);
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Sentence Count Suffix")
            .setDesc("This changes the text after of the sentence count number.")
            .addText(function (text) {
            return text.setValue(plugin.settings.sentencesSuffix).onChange(function (value) {
                plugin.settings.sentencesSuffix = value;
                plugin.saveData(plugin.settings);
            });
        });
    };
    return BetterWordCountSettingsTab;
}(obsidian.PluginSettingTab));

var BetterWordCountSettings = /** @class */ (function () {
    function BetterWordCountSettings() {
        this.showWords = true;
        this.wordsPrefix = "";
        this.wordsSuffix = " words ";
        this.showCharacters = true;
        this.charactersPrefix = "";
        this.charactersSuffix = " characters ";
        this.showSentences = false;
        this.sentencesPrefix = "";
        this.sentencesSuffix = " sentences";
    }
    return BetterWordCountSettings;
}());

// Count Stats
function getWordCount(text) {
    // Thanks to liamcane
    var spaceDelimitedChars = /A-Za-z\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC/
        .source;
    var nonSpaceDelimitedWords = /\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u4E00-\u9FD5/
        .source;
    var pattern = new RegExp([
        "(?:[0-9]+(?:(?:,|\\.)[0-9]+)*|[\\-" + spaceDelimitedChars + "])+",
        nonSpaceDelimitedWords,
    ].join("|"), "g");
    return (text.match(pattern) || []).length;
}
function getCharacterCount(text) {
    return text.length;
}
function getSentenceCount(text) {
    // Thanks to Extract Highlights plugin and AngelusDomini
    // Also https://stackoverflow.com/questions/5553410
    var sentences = ((text || "").match(/[^.!?\s][^.!?]*(?:[.!?](?!['"]?\s|$)[^.!?]*)*[.!?]?['"]?(?=\s|$)/gm) || []).length;
    return sentences;
}
// Alt Count Stats
// Thanks to Eleanor Konik for the alternate count idea.
function getFilesCount(files) {
    return files.length;
}

var StatusBar = /** @class */ (function () {
    function StatusBar(statusBarEl) {
        this.statusBarEl = statusBarEl;
    }
    StatusBar.prototype.displayText = function (text) {
        this.statusBarEl.setText(text);
    };
    return StatusBar;
}());

var BetterWordCount = /** @class */ (function (_super) {
    __extends(BetterWordCount, _super);
    function BetterWordCount() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BetterWordCount.prototype.onload = function () {
        return __awaiter(this, void 0, void 0, function () {
            var statusBarEl, _a, activeLeaf, files;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        statusBarEl = this.addStatusBarItem();
                        this.statusBar = new StatusBar(statusBarEl);
                        this.recentlyTyped = false;
                        _a = this;
                        return [4 /*yield*/, this.loadData()];
                    case 1:
                        _a.settings = (_b.sent()) || new BetterWordCountSettings();
                        this.addSettingTab(new BetterWordCountSettingsTab(this.app, this));
                        this.updateAltCount();
                        this.registerEvent(this.app.workspace.on("file-open", this.onFileOpen, this));
                        this.registerEvent(this.app.workspace.on("quick-preview", this.onQuickPreview, this));
                        this.registerInterval(window.setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                            var activeLeaf, editor, content, contents;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        activeLeaf = this.app.workspace.activeLeaf;
                                        if (!activeLeaf || !(activeLeaf.view instanceof obsidian.MarkdownView)) {
                                            return [2 /*return*/];
                                        }
                                        editor = activeLeaf.view.sourceMode.cmEditor;
                                        if (!editor.somethingSelected()) return [3 /*break*/, 1];
                                        content = editor.getSelection();
                                        this.updateWordCount(content);
                                        this.recentlyTyped = false;
                                        return [3 /*break*/, 4];
                                    case 1:
                                        if (!(this.currentFile &&
                                            this.currentFile.extension === "md" &&
                                            !this.recentlyTyped)) return [3 /*break*/, 3];
                                        return [4 /*yield*/, this.app.vault.cachedRead(this.currentFile)];
                                    case 2:
                                        contents = _a.sent();
                                        this.updateWordCount(contents);
                                        return [3 /*break*/, 4];
                                    case 3:
                                        if (!this.recentlyTyped) {
                                            this.updateWordCount("");
                                        }
                                        _a.label = 4;
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); }, 500));
                        activeLeaf = this.app.workspace.activeLeaf;
                        files = this.app.vault.getMarkdownFiles();
                        files.forEach(function (file) {
                            if (file.basename === activeLeaf.getDisplayText()) {
                                _this.onFileOpen(file);
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    BetterWordCount.prototype.onFileOpen = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var contents;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.currentFile = file;
                        if (!(file && file.extension === "md")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.app.vault.cachedRead(file)];
                    case 1:
                        contents = _a.sent();
                        this.recentlyTyped = true;
                        this.updateWordCount(contents);
                        return [3 /*break*/, 3];
                    case 2:
                        this.updateAltCount();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    BetterWordCount.prototype.onQuickPreview = function (file, contents) {
        this.currentFile = file;
        var leaf = this.app.workspace.activeLeaf;
        if (leaf && leaf.view.getViewType() === "markdown") {
            this.recentlyTyped = true;
            this.updateWordCount(contents);
        }
    };
    BetterWordCount.prototype.updateAltCount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var files, displayText, allWords, allCharacters, allSentences, _i, _a, f, fileContents;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        files = getFilesCount(this.app.vault.getFiles());
                        displayText = files + " files ";
                        allWords = 0;
                        allCharacters = 0;
                        allSentences = 0;
                        _i = 0, _a = this.app.vault.getMarkdownFiles();
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        f = _a[_i];
                        return [4 /*yield*/, this.app.vault.cachedRead(f)];
                    case 2:
                        fileContents = _b.sent();
                        allWords += getWordCount(fileContents);
                        allCharacters += getCharacterCount(fileContents);
                        allSentences += getSentenceCount(fileContents);
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        if (this.settings.showWords) {
                            displayText =
                                displayText +
                                    this.settings.wordsPrefix +
                                    allWords +
                                    this.settings.wordsSuffix;
                        }
                        if (this.settings.showCharacters) {
                            displayText =
                                displayText +
                                    this.settings.charactersPrefix +
                                    allCharacters +
                                    this.settings.charactersSuffix;
                        }
                        if (this.settings.showSentences) {
                            displayText =
                                displayText +
                                    this.settings.sentencesPrefix +
                                    allSentences +
                                    this.settings.sentencesSuffix;
                        }
                        this.statusBar.displayText(displayText);
                        return [2 /*return*/];
                }
            });
        });
    };
    BetterWordCount.prototype.updateWordCount = function (text) {
        var displayText = "";
        if (this.settings.showWords) {
            displayText =
                displayText +
                    this.settings.wordsPrefix +
                    getWordCount(text) +
                    this.settings.wordsSuffix;
        }
        if (this.settings.showCharacters) {
            displayText =
                displayText +
                    this.settings.charactersPrefix +
                    getCharacterCount(text) +
                    this.settings.charactersSuffix;
        }
        if (this.settings.showSentences) {
            displayText =
                displayText +
                    this.settings.sentencesPrefix +
                    getSentenceCount(text) +
                    this.settings.sentencesSuffix;
        }
        this.statusBar.displayText(displayText);
    };
    return BetterWordCount;
}(obsidian.Plugin));

module.exports = BetterWordCount;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiLi4vbm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsIi4uL3NyYy9zZXR0aW5ncy9zZXR0aW5ncy10YWIudHMiLCIuLi9zcmMvc2V0dGluZ3Mvc2V0dGluZ3MudHMiLCIuLi9zcmMvc3RhdHMudHMiLCIuLi9zcmMvc3RhdHVzLWJhci50cyIsIi4uL3NyYy9tYWluLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cclxuXHJcblBlcm1pc3Npb24gdG8gdXNlLCBjb3B5LCBtb2RpZnksIGFuZC9vciBkaXN0cmlidXRlIHRoaXMgc29mdHdhcmUgZm9yIGFueVxyXG5wdXJwb3NlIHdpdGggb3Igd2l0aG91dCBmZWUgaXMgaGVyZWJ5IGdyYW50ZWQuXHJcblxyXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiIEFORCBUSEUgQVVUSE9SIERJU0NMQUlNUyBBTEwgV0FSUkFOVElFUyBXSVRIXHJcblJFR0FSRCBUTyBUSElTIFNPRlRXQVJFIElOQ0xVRElORyBBTEwgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWVxyXG5BTkQgRklUTkVTUy4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUiBCRSBMSUFCTEUgRk9SIEFOWSBTUEVDSUFMLCBESVJFQ1QsXHJcbklORElSRUNULCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgT1IgQU5ZIERBTUFHRVMgV0hBVFNPRVZFUiBSRVNVTFRJTkcgRlJPTVxyXG5MT1NTIE9GIFVTRSwgREFUQSBPUiBQUk9GSVRTLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgTkVHTElHRU5DRSBPUlxyXG5PVEhFUiBUT1JUSU9VUyBBQ1RJT04sIEFSSVNJTkcgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgVVNFIE9SXHJcblBFUkZPUk1BTkNFIE9GIFRISVMgU09GVFdBUkUuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcbi8qIGdsb2JhbCBSZWZsZWN0LCBQcm9taXNlICovXHJcblxyXG52YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyhkLCBiKSB7XHJcbiAgICBpZiAodHlwZW9mIGIgIT09IFwiZnVuY3Rpb25cIiAmJiBiICE9PSBudWxsKVxyXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDbGFzcyBleHRlbmRzIHZhbHVlIFwiICsgU3RyaW5nKGIpICsgXCIgaXMgbm90IGEgY29uc3RydWN0b3Igb3IgbnVsbFwiKTtcclxuICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2Fzc2lnbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIF9fYXNzaWduKHQpIHtcclxuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKSB0W3BdID0gc1twXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVzdChzLCBlKSB7XHJcbiAgICB2YXIgdCA9IHt9O1xyXG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXHJcbiAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMCAmJiBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwocywgcFtpXSkpXHJcbiAgICAgICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgICAgICB9XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3BhcmFtKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdGVyKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZ2VuZXJhdG9yKHRoaXNBcmcsIGJvZHkpIHtcclxuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XHJcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xyXG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcclxuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fY3JlYXRlQmluZGluZyA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfSk7XHJcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgb1trMl0gPSBtW2tdO1xyXG59KTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4cG9ydFN0YXIobSwgbykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAocCAhPT0gXCJkZWZhdWx0XCIgJiYgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvLCBwKSkgX19jcmVhdGVCaW5kaW5nKG8sIG0sIHApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX192YWx1ZXMobykge1xyXG4gICAgdmFyIHMgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgU3ltYm9sLml0ZXJhdG9yLCBtID0gcyAmJiBvW3NdLCBpID0gMDtcclxuICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xyXG4gICAgaWYgKG8gJiYgdHlwZW9mIG8ubGVuZ3RoID09PSBcIm51bWJlclwiKSByZXR1cm4ge1xyXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcclxuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG8gJiYgb1tpKytdLCBkb25lOiAhbyB9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKHMgPyBcIk9iamVjdCBpcyBub3QgaXRlcmFibGUuXCIgOiBcIlN5bWJvbC5pdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3JlYWQobywgbikge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xyXG4gICAgaWYgKCFtKSByZXR1cm4gbztcclxuICAgIHZhciBpID0gbS5jYWxsKG8pLCByLCBhciA9IFtdLCBlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB3aGlsZSAoKG4gPT09IHZvaWQgMCB8fCBuLS0gPiAwKSAmJiAhKHIgPSBpLm5leHQoKSkuZG9uZSkgYXIucHVzaChyLnZhbHVlKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxyXG4gICAgZmluYWxseSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZSkgdGhyb3cgZS5lcnJvcjsgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG4vKiogQGRlcHJlY2F0ZWQgKi9cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkKCkge1xyXG4gICAgZm9yICh2YXIgYXIgPSBbXSwgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgYXIgPSBhci5jb25jYXQoX19yZWFkKGFyZ3VtZW50c1tpXSkpO1xyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG4vKiogQGRlcHJlY2F0ZWQgKi9cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkQXJyYXlzKCkge1xyXG4gICAgZm9yICh2YXIgcyA9IDAsIGkgPSAwLCBpbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSBzICs9IGFyZ3VtZW50c1tpXS5sZW5ndGg7XHJcbiAgICBmb3IgKHZhciByID0gQXJyYXkocyksIGsgPSAwLCBpID0gMDsgaSA8IGlsOyBpKyspXHJcbiAgICAgICAgZm9yICh2YXIgYSA9IGFyZ3VtZW50c1tpXSwgaiA9IDAsIGpsID0gYS5sZW5ndGg7IGogPCBqbDsgaisrLCBrKyspXHJcbiAgICAgICAgICAgIHJba10gPSBhW2pdO1xyXG4gICAgcmV0dXJuIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZEFycmF5KHRvLCBmcm9tKSB7XHJcbiAgICBmb3IgKHZhciBpID0gMCwgaWwgPSBmcm9tLmxlbmd0aCwgaiA9IHRvLmxlbmd0aDsgaSA8IGlsOyBpKyssIGorKylcclxuICAgICAgICB0b1tqXSA9IGZyb21baV07XHJcbiAgICByZXR1cm4gdG87XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0KHYpIHtcclxuICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgX19hd2FpdCA/ICh0aGlzLnYgPSB2LCB0aGlzKSA6IG5ldyBfX2F3YWl0KHYpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0dlbmVyYXRvcih0aGlzQXJnLCBfYXJndW1lbnRzLCBnZW5lcmF0b3IpIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgZyA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSwgaSwgcSA9IFtdO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlmIChnW25dKSBpW25dID0gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChhLCBiKSB7IHEucHVzaChbbiwgdiwgYSwgYl0pID4gMSB8fCByZXN1bWUobiwgdik7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiByZXN1bWUobiwgdikgeyB0cnkgeyBzdGVwKGdbbl0odikpOyB9IGNhdGNoIChlKSB7IHNldHRsZShxWzBdWzNdLCBlKTsgfSB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKHIpIHsgci52YWx1ZSBpbnN0YW5jZW9mIF9fYXdhaXQgPyBQcm9taXNlLnJlc29sdmUoci52YWx1ZS52KS50aGVuKGZ1bGZpbGwsIHJlamVjdCkgOiBzZXR0bGUocVswXVsyXSwgcik7IH1cclxuICAgIGZ1bmN0aW9uIGZ1bGZpbGwodmFsdWUpIHsgcmVzdW1lKFwibmV4dFwiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHJlamVjdCh2YWx1ZSkgeyByZXN1bWUoXCJ0aHJvd1wiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShmLCB2KSB7IGlmIChmKHYpLCBxLnNoaWZ0KCksIHEubGVuZ3RoKSByZXN1bWUocVswXVswXSwgcVswXVsxXSk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNEZWxlZ2F0b3Iobykge1xyXG4gICAgdmFyIGksIHA7XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIsIGZ1bmN0aW9uIChlKSB7IHRocm93IGU7IH0pLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuLCBmKSB7IGlbbl0gPSBvW25dID8gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIChwID0gIXApID8geyB2YWx1ZTogX19hd2FpdChvW25dKHYpKSwgZG9uZTogbiA9PT0gXCJyZXR1cm5cIiB9IDogZiA/IGYodikgOiB2OyB9IDogZjsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY1ZhbHVlcyhvKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIG0gPSBvW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSwgaTtcclxuICAgIHJldHVybiBtID8gbS5jYWxsKG8pIDogKG8gPSB0eXBlb2YgX192YWx1ZXMgPT09IFwiZnVuY3Rpb25cIiA/IF9fdmFsdWVzKG8pIDogb1tTeW1ib2wuaXRlcmF0b3JdKCksIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpKTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpW25dID0gb1tuXSAmJiBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkgeyB2ID0gb1tuXSh2KSwgc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgdi5kb25lLCB2LnZhbHVlKTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShyZXNvbHZlLCByZWplY3QsIGQsIHYpIHsgUHJvbWlzZS5yZXNvbHZlKHYpLnRoZW4oZnVuY3Rpb24odikgeyByZXNvbHZlKHsgdmFsdWU6IHYsIGRvbmU6IGQgfSk7IH0sIHJlamVjdCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWFrZVRlbXBsYXRlT2JqZWN0KGNvb2tlZCwgcmF3KSB7XHJcbiAgICBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb29rZWQsIFwicmF3XCIsIHsgdmFsdWU6IHJhdyB9KTsgfSBlbHNlIHsgY29va2VkLnJhdyA9IHJhdzsgfVxyXG4gICAgcmV0dXJuIGNvb2tlZDtcclxufTtcclxuXHJcbnZhciBfX3NldE1vZHVsZURlZmF1bHQgPSBPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBcImRlZmF1bHRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdiB9KTtcclxufSkgOiBmdW5jdGlvbihvLCB2KSB7XHJcbiAgICBvW1wiZGVmYXVsdFwiXSA9IHY7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnRTdGFyKG1vZCkge1xyXG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcclxuICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChrICE9PSBcImRlZmF1bHRcIiAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgX19jcmVhdGVCaW5kaW5nKHJlc3VsdCwgbW9kLCBrKTtcclxuICAgIF9fc2V0TW9kdWxlRGVmYXVsdChyZXN1bHQsIG1vZCk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnREZWZhdWx0KG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBkZWZhdWx0OiBtb2QgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fY2xhc3NQcml2YXRlRmllbGRHZXQocmVjZWl2ZXIsIHByaXZhdGVNYXApIHtcclxuICAgIGlmICghcHJpdmF0ZU1hcC5oYXMocmVjZWl2ZXIpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImF0dGVtcHRlZCB0byBnZXQgcHJpdmF0ZSBmaWVsZCBvbiBub24taW5zdGFuY2VcIik7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcHJpdmF0ZU1hcC5nZXQocmVjZWl2ZXIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZFNldChyZWNlaXZlciwgcHJpdmF0ZU1hcCwgdmFsdWUpIHtcclxuICAgIGlmICghcHJpdmF0ZU1hcC5oYXMocmVjZWl2ZXIpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImF0dGVtcHRlZCB0byBzZXQgcHJpdmF0ZSBmaWVsZCBvbiBub24taW5zdGFuY2VcIik7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlTWFwLnNldChyZWNlaXZlciwgdmFsdWUpO1xyXG4gICAgcmV0dXJuIHZhbHVlO1xyXG59XHJcbiIsImltcG9ydCB7IHNldHRpbmdzIH0gZnJvbSBcImNsdXN0ZXJcIjtcbmltcG9ydCB7IFBsdWdpblNldHRpbmdUYWIsIFNldHRpbmcgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCBCZXR0ZXJXb3JkQ291bnQgZnJvbSBcIi4uL21haW5cIjtcblxuZXhwb3J0IGNsYXNzIEJldHRlcldvcmRDb3VudFNldHRpbmdzVGFiIGV4dGVuZHMgUGx1Z2luU2V0dGluZ1RhYiB7XG4gIGRpc3BsYXkoKTogdm9pZCB7XG4gICAgbGV0IHsgY29udGFpbmVyRWwgfSA9IHRoaXM7XG4gICAgY29uc3QgcGx1Z2luOiBCZXR0ZXJXb3JkQ291bnQgPSAodGhpcyBhcyBhbnkpLnBsdWdpbjtcblxuICAgIGNvbnRhaW5lckVsLmVtcHR5KCk7XG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoMlwiLCB7IHRleHQ6IFwiQmV0dGVyIFdvcmQgQ291bnQgU2V0dGluZ3NcIiB9KTtcblxuICAgIC8vIFdvcmQgQ291bnQgU2V0dGluZ3NcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgzXCIsIHsgdGV4dDogXCJXb3JkIENvdW50IFNldHRpbmdzXCIgfSk7XG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIlNob3cgV29yZCBDb3VudFwiKVxuICAgICAgLnNldERlc2MoXCJFbmFibGUgdGhpcyB0byBzaG93IHRoZSB3b3JkIGNvdW50LlwiKVxuICAgICAgLmFkZFRvZ2dsZSgoYm9vbGVhbikgPT5cbiAgICAgICAgYm9vbGVhbi5zZXRWYWx1ZShwbHVnaW4uc2V0dGluZ3Muc2hvd1dvcmRzKS5vbkNoYW5nZSgodmFsdWUpID0+IHtcbiAgICAgICAgICBwbHVnaW4uc2V0dGluZ3Muc2hvd1dvcmRzID0gdmFsdWU7XG4gICAgICAgICAgcGx1Z2luLnNhdmVEYXRhKHBsdWdpbi5zZXR0aW5ncyk7XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJXb3JkIENvdW50IFByZWZpeFwiKVxuICAgICAgLnNldERlc2MoXCJUaGlzIGNoYW5nZXMgdGhlIHRleHQgaW4gZnJvbnQgb2YgdGhlIHdvcmQgY291bnQgbnVtYmVyLlwiKVxuICAgICAgLmFkZFRleHQoKHRleHQpID0+XG4gICAgICAgIHRleHQuc2V0VmFsdWUocGx1Z2luLnNldHRpbmdzLndvcmRzUHJlZml4KS5vbkNoYW5nZSgodmFsdWUpID0+IHtcbiAgICAgICAgICBwbHVnaW4uc2V0dGluZ3Mud29yZHNQcmVmaXggPSB2YWx1ZTtcbiAgICAgICAgICBwbHVnaW4uc2F2ZURhdGEocGx1Z2luLnNldHRpbmdzKTtcbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIldvcmQgQ291bnQgU3VmZml4XCIpXG4gICAgICAuc2V0RGVzYyhcIlRoaXMgY2hhbmdlcyB0aGUgdGV4dCBhZnRlciBvZiB0aGUgd29yZCBjb3VudCBudW1iZXIuXCIpXG4gICAgICAuYWRkVGV4dCgodGV4dCkgPT5cbiAgICAgICAgdGV4dC5zZXRWYWx1ZShwbHVnaW4uc2V0dGluZ3Mud29yZHNTdWZmaXgpLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHBsdWdpbi5zZXR0aW5ncy53b3Jkc1N1ZmZpeCA9IHZhbHVlO1xuICAgICAgICAgIHBsdWdpbi5zYXZlRGF0YShwbHVnaW4uc2V0dGluZ3MpO1xuICAgICAgICB9KVxuICAgICAgKTtcblxuICAgIC8vIENoYXJhY3RlciBDb3VudCBTZXR0aW5nc1xuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDNcIiwgeyB0ZXh0OiBcIkNoYXJhY3RlciBDb3VudCBTZXR0aW5nc1wiIH0pO1xuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJTaG93IENoYXJhY3RlciBDb3VudFwiKVxuICAgICAgLnNldERlc2MoXCJFbmFibGUgdGhpcyB0byBzaG93IHRoZSBjaGFyYWN0ZXIgY291bnQuXCIpXG4gICAgICAuYWRkVG9nZ2xlKChib29sZWFuKSA9PlxuICAgICAgICBib29sZWFuLnNldFZhbHVlKHBsdWdpbi5zZXR0aW5ncy5zaG93Q2hhcmFjdGVycykub25DaGFuZ2UoKHZhbHVlKSA9PiB7XG4gICAgICAgICAgcGx1Z2luLnNldHRpbmdzLnNob3dDaGFyYWN0ZXJzID0gdmFsdWU7XG4gICAgICAgICAgcGx1Z2luLnNhdmVEYXRhKHBsdWdpbi5zZXR0aW5ncyk7XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJDaGFyYWN0ZXIgQ291bnQgUHJlZml4XCIpXG4gICAgICAuc2V0RGVzYyhcIlRoaXMgY2hhbmdlcyB0aGUgdGV4dCBpbiBmcm9udCBvZiB0aGUgY2hhcmFjdGVyIGNvdW50IG51bWJlci5cIilcbiAgICAgIC5hZGRUZXh0KCh0ZXh0KSA9PlxuICAgICAgICB0ZXh0LnNldFZhbHVlKHBsdWdpbi5zZXR0aW5ncy5jaGFyYWN0ZXJzUHJlZml4KS5vbkNoYW5nZSgodmFsdWUpID0+IHtcbiAgICAgICAgICBwbHVnaW4uc2V0dGluZ3MuY2hhcmFjdGVyc1ByZWZpeCA9IHZhbHVlO1xuICAgICAgICAgIHBsdWdpbi5zYXZlRGF0YShwbHVnaW4uc2V0dGluZ3MpO1xuICAgICAgICB9KVxuICAgICAgKTtcbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiQ2hhcmFjdGVyIENvdW50IFN1ZmZpeFwiKVxuICAgICAgLnNldERlc2MoXCJUaGlzIGNoYW5nZXMgdGhlIHRleHQgYWZ0ZXIgb2YgdGhlIGNoYXJhY3RlciBjb3VudCBudW1iZXIuXCIpXG4gICAgICAuYWRkVGV4dCgodGV4dCkgPT5cbiAgICAgICAgdGV4dC5zZXRWYWx1ZShwbHVnaW4uc2V0dGluZ3MuY2hhcmFjdGVyc1N1ZmZpeCkub25DaGFuZ2UoKHZhbHVlKSA9PiB7XG4gICAgICAgICAgcGx1Z2luLnNldHRpbmdzLmNoYXJhY3RlcnNTdWZmaXggPSB2YWx1ZTtcbiAgICAgICAgICBwbHVnaW4uc2F2ZURhdGEocGx1Z2luLnNldHRpbmdzKTtcbiAgICAgICAgfSlcbiAgICAgICk7XG5cbiAgICAvLyBTZW50ZW5jZSBDb3VudCBTZXR0aW5nc1xuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDNcIiwgeyB0ZXh0OiBcIlNlbnRlbmNlIENvdW50IFNldHRpbmdzXCIgfSk7XG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIlNob3cgU2VudGVuY2UgQ291bnRcIilcbiAgICAgIC5zZXREZXNjKFwiRW5hYmxlIHRoaXMgdG8gc2hvdyB0aGUgc2VudGVuY2UgY291bnQuXCIpXG4gICAgICAuYWRkVG9nZ2xlKChib29sZWFuKSA9PlxuICAgICAgICBib29sZWFuLnNldFZhbHVlKHBsdWdpbi5zZXR0aW5ncy5zaG93U2VudGVuY2VzKS5vbkNoYW5nZSgodmFsdWUpID0+IHtcbiAgICAgICAgICBwbHVnaW4uc2V0dGluZ3Muc2hvd1NlbnRlbmNlcyA9IHZhbHVlO1xuICAgICAgICAgIHBsdWdpbi5zYXZlRGF0YShwbHVnaW4uc2V0dGluZ3MpO1xuICAgICAgICB9KVxuICAgICAgKTtcbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiU2VudGVuY2UgQ291bnQgUHJlZml4XCIpXG4gICAgICAuc2V0RGVzYyhcIlRoaXMgY2hhbmdlcyB0aGUgdGV4dCBpbiBmcm9udCBvZiB0aGUgc2VudGVuY2UgY291bnQgbnVtYmVyLlwiKVxuICAgICAgLmFkZFRleHQoKHRleHQpID0+XG4gICAgICAgIHRleHQuc2V0VmFsdWUocGx1Z2luLnNldHRpbmdzLnNlbnRlbmNlc1ByZWZpeCkub25DaGFuZ2UoKHZhbHVlKSA9PiB7XG4gICAgICAgICAgcGx1Z2luLnNldHRpbmdzLnNlbnRlbmNlc1ByZWZpeCA9IHZhbHVlO1xuICAgICAgICAgIHBsdWdpbi5zYXZlRGF0YShwbHVnaW4uc2V0dGluZ3MpO1xuICAgICAgICB9KVxuICAgICAgKTtcbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiU2VudGVuY2UgQ291bnQgU3VmZml4XCIpXG4gICAgICAuc2V0RGVzYyhcIlRoaXMgY2hhbmdlcyB0aGUgdGV4dCBhZnRlciBvZiB0aGUgc2VudGVuY2UgY291bnQgbnVtYmVyLlwiKVxuICAgICAgLmFkZFRleHQoKHRleHQpID0+XG4gICAgICAgIHRleHQuc2V0VmFsdWUocGx1Z2luLnNldHRpbmdzLnNlbnRlbmNlc1N1ZmZpeCkub25DaGFuZ2UoKHZhbHVlKSA9PiB7XG4gICAgICAgICAgcGx1Z2luLnNldHRpbmdzLnNlbnRlbmNlc1N1ZmZpeCA9IHZhbHVlO1xuICAgICAgICAgIHBsdWdpbi5zYXZlRGF0YShwbHVnaW4uc2V0dGluZ3MpO1xuICAgICAgICB9KVxuICAgICAgKTtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIEJldHRlcldvcmRDb3VudFNldHRpbmdzIHtcbiAgc2hvd1dvcmRzOiBib29sZWFuID0gdHJ1ZTtcbiAgd29yZHNQcmVmaXg6IHN0cmluZyA9IFwiXCI7XG4gIHdvcmRzU3VmZml4OiBzdHJpbmcgPSBcIiB3b3JkcyBcIjtcbiAgc2hvd0NoYXJhY3RlcnM6IGJvb2xlYW4gPSB0cnVlO1xuICBjaGFyYWN0ZXJzUHJlZml4OiBzdHJpbmcgPSBcIlwiO1xuICBjaGFyYWN0ZXJzU3VmZml4OiBzdHJpbmcgPSBcIiBjaGFyYWN0ZXJzIFwiO1xuICBzaG93U2VudGVuY2VzOiBib29sZWFuID0gZmFsc2U7XG4gIHNlbnRlbmNlc1ByZWZpeDogc3RyaW5nID0gXCJcIjtcbiAgc2VudGVuY2VzU3VmZml4OiBzdHJpbmcgPSBcIiBzZW50ZW5jZXNcIjtcbn1cbiIsImltcG9ydCB7IFRGaWxlIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbi8vIENvdW50IFN0YXRzXG5leHBvcnQgZnVuY3Rpb24gZ2V0V29yZENvdW50KHRleHQ6IHN0cmluZyk6IG51bWJlciB7XG4gIC8vIFRoYW5rcyB0byBsaWFtY2FuZVxuICBjb25zdCBzcGFjZURlbGltaXRlZENoYXJzID0gL0EtWmEtelxcdTAwQUFcXHUwMEI1XFx1MDBCQVxcdTAwQzAtXFx1MDBENlxcdTAwRDgtXFx1MDBGNlxcdTAwRjgtXFx1MDJDMVxcdTAyQzYtXFx1MDJEMVxcdTAyRTAtXFx1MDJFNFxcdTAyRUNcXHUwMkVFXFx1MDM3MC1cXHUwMzc0XFx1MDM3NlxcdTAzNzdcXHUwMzdBLVxcdTAzN0RcXHUwMzdGXFx1MDM4NlxcdTAzODgtXFx1MDM4QVxcdTAzOENcXHUwMzhFLVxcdTAzQTFcXHUwM0EzLVxcdTAzRjVcXHUwM0Y3LVxcdTA0ODFcXHUwNDhBLVxcdTA1MkZcXHUwNTMxLVxcdTA1NTZcXHUwNTU5XFx1MDU2MS1cXHUwNTg3XFx1MDVEMC1cXHUwNUVBXFx1MDVGMC1cXHUwNUYyXFx1MDYyMC1cXHUwNjRBXFx1MDY2RVxcdTA2NkZcXHUwNjcxLVxcdTA2RDNcXHUwNkQ1XFx1MDZFNVxcdTA2RTZcXHUwNkVFXFx1MDZFRlxcdTA2RkEtXFx1MDZGQ1xcdTA2RkZcXHUwNzEwXFx1MDcxMi1cXHUwNzJGXFx1MDc0RC1cXHUwN0E1XFx1MDdCMVxcdTA3Q0EtXFx1MDdFQVxcdTA3RjRcXHUwN0Y1XFx1MDdGQVxcdTA4MDAtXFx1MDgxNVxcdTA4MUFcXHUwODI0XFx1MDgyOFxcdTA4NDAtXFx1MDg1OFxcdTA4QTAtXFx1MDhCNFxcdTA5MDQtXFx1MDkzOVxcdTA5M0RcXHUwOTUwXFx1MDk1OC1cXHUwOTYxXFx1MDk3MS1cXHUwOTgwXFx1MDk4NS1cXHUwOThDXFx1MDk4RlxcdTA5OTBcXHUwOTkzLVxcdTA5QThcXHUwOUFBLVxcdTA5QjBcXHUwOUIyXFx1MDlCNi1cXHUwOUI5XFx1MDlCRFxcdTA5Q0VcXHUwOURDXFx1MDlERFxcdTA5REYtXFx1MDlFMVxcdTA5RjBcXHUwOUYxXFx1MEEwNS1cXHUwQTBBXFx1MEEwRlxcdTBBMTBcXHUwQTEzLVxcdTBBMjhcXHUwQTJBLVxcdTBBMzBcXHUwQTMyXFx1MEEzM1xcdTBBMzVcXHUwQTM2XFx1MEEzOFxcdTBBMzlcXHUwQTU5LVxcdTBBNUNcXHUwQTVFXFx1MEE3Mi1cXHUwQTc0XFx1MEE4NS1cXHUwQThEXFx1MEE4Ri1cXHUwQTkxXFx1MEE5My1cXHUwQUE4XFx1MEFBQS1cXHUwQUIwXFx1MEFCMlxcdTBBQjNcXHUwQUI1LVxcdTBBQjlcXHUwQUJEXFx1MEFEMFxcdTBBRTBcXHUwQUUxXFx1MEFGOVxcdTBCMDUtXFx1MEIwQ1xcdTBCMEZcXHUwQjEwXFx1MEIxMy1cXHUwQjI4XFx1MEIyQS1cXHUwQjMwXFx1MEIzMlxcdTBCMzNcXHUwQjM1LVxcdTBCMzlcXHUwQjNEXFx1MEI1Q1xcdTBCNURcXHUwQjVGLVxcdTBCNjFcXHUwQjcxXFx1MEI4M1xcdTBCODUtXFx1MEI4QVxcdTBCOEUtXFx1MEI5MFxcdTBCOTItXFx1MEI5NVxcdTBCOTlcXHUwQjlBXFx1MEI5Q1xcdTBCOUVcXHUwQjlGXFx1MEJBM1xcdTBCQTRcXHUwQkE4LVxcdTBCQUFcXHUwQkFFLVxcdTBCQjlcXHUwQkQwXFx1MEMwNS1cXHUwQzBDXFx1MEMwRS1cXHUwQzEwXFx1MEMxMi1cXHUwQzI4XFx1MEMyQS1cXHUwQzM5XFx1MEMzRFxcdTBDNTgtXFx1MEM1QVxcdTBDNjBcXHUwQzYxXFx1MEM4NS1cXHUwQzhDXFx1MEM4RS1cXHUwQzkwXFx1MEM5Mi1cXHUwQ0E4XFx1MENBQS1cXHUwQ0IzXFx1MENCNS1cXHUwQ0I5XFx1MENCRFxcdTBDREVcXHUwQ0UwXFx1MENFMVxcdTBDRjFcXHUwQ0YyXFx1MEQwNS1cXHUwRDBDXFx1MEQwRS1cXHUwRDEwXFx1MEQxMi1cXHUwRDNBXFx1MEQzRFxcdTBENEVcXHUwRDVGLVxcdTBENjFcXHUwRDdBLVxcdTBEN0ZcXHUwRDg1LVxcdTBEOTZcXHUwRDlBLVxcdTBEQjFcXHUwREIzLVxcdTBEQkJcXHUwREJEXFx1MERDMC1cXHUwREM2XFx1MEUwMS1cXHUwRTMwXFx1MEUzMlxcdTBFMzNcXHUwRTQwLVxcdTBFNDZcXHUwRTgxXFx1MEU4MlxcdTBFODRcXHUwRTg3XFx1MEU4OFxcdTBFOEFcXHUwRThEXFx1MEU5NC1cXHUwRTk3XFx1MEU5OS1cXHUwRTlGXFx1MEVBMS1cXHUwRUEzXFx1MEVBNVxcdTBFQTdcXHUwRUFBXFx1MEVBQlxcdTBFQUQtXFx1MEVCMFxcdTBFQjJcXHUwRUIzXFx1MEVCRFxcdTBFQzAtXFx1MEVDNFxcdTBFQzZcXHUwRURDLVxcdTBFREZcXHUwRjAwXFx1MEY0MC1cXHUwRjQ3XFx1MEY0OS1cXHUwRjZDXFx1MEY4OC1cXHUwRjhDXFx1MTAwMC1cXHUxMDJBXFx1MTAzRlxcdTEwNTAtXFx1MTA1NVxcdTEwNUEtXFx1MTA1RFxcdTEwNjFcXHUxMDY1XFx1MTA2NlxcdTEwNkUtXFx1MTA3MFxcdTEwNzUtXFx1MTA4MVxcdTEwOEVcXHUxMEEwLVxcdTEwQzVcXHUxMEM3XFx1MTBDRFxcdTEwRDAtXFx1MTBGQVxcdTEwRkMtXFx1MTI0OFxcdTEyNEEtXFx1MTI0RFxcdTEyNTAtXFx1MTI1NlxcdTEyNThcXHUxMjVBLVxcdTEyNURcXHUxMjYwLVxcdTEyODhcXHUxMjhBLVxcdTEyOERcXHUxMjkwLVxcdTEyQjBcXHUxMkIyLVxcdTEyQjVcXHUxMkI4LVxcdTEyQkVcXHUxMkMwXFx1MTJDMi1cXHUxMkM1XFx1MTJDOC1cXHUxMkQ2XFx1MTJEOC1cXHUxMzEwXFx1MTMxMi1cXHUxMzE1XFx1MTMxOC1cXHUxMzVBXFx1MTM4MC1cXHUxMzhGXFx1MTNBMC1cXHUxM0Y1XFx1MTNGOC1cXHUxM0ZEXFx1MTQwMS1cXHUxNjZDXFx1MTY2Ri1cXHUxNjdGXFx1MTY4MS1cXHUxNjlBXFx1MTZBMC1cXHUxNkVBXFx1MTZGMS1cXHUxNkY4XFx1MTcwMC1cXHUxNzBDXFx1MTcwRS1cXHUxNzExXFx1MTcyMC1cXHUxNzMxXFx1MTc0MC1cXHUxNzUxXFx1MTc2MC1cXHUxNzZDXFx1MTc2RS1cXHUxNzcwXFx1MTc4MC1cXHUxN0IzXFx1MTdEN1xcdTE3RENcXHUxODIwLVxcdTE4NzdcXHUxODgwLVxcdTE4QThcXHUxOEFBXFx1MThCMC1cXHUxOEY1XFx1MTkwMC1cXHUxOTFFXFx1MTk1MC1cXHUxOTZEXFx1MTk3MC1cXHUxOTc0XFx1MTk4MC1cXHUxOUFCXFx1MTlCMC1cXHUxOUM5XFx1MUEwMC1cXHUxQTE2XFx1MUEyMC1cXHUxQTU0XFx1MUFBN1xcdTFCMDUtXFx1MUIzM1xcdTFCNDUtXFx1MUI0QlxcdTFCODMtXFx1MUJBMFxcdTFCQUVcXHUxQkFGXFx1MUJCQS1cXHUxQkU1XFx1MUMwMC1cXHUxQzIzXFx1MUM0RC1cXHUxQzRGXFx1MUM1QS1cXHUxQzdEXFx1MUNFOS1cXHUxQ0VDXFx1MUNFRS1cXHUxQ0YxXFx1MUNGNVxcdTFDRjZcXHUxRDAwLVxcdTFEQkZcXHUxRTAwLVxcdTFGMTVcXHUxRjE4LVxcdTFGMURcXHUxRjIwLVxcdTFGNDVcXHUxRjQ4LVxcdTFGNERcXHUxRjUwLVxcdTFGNTdcXHUxRjU5XFx1MUY1QlxcdTFGNURcXHUxRjVGLVxcdTFGN0RcXHUxRjgwLVxcdTFGQjRcXHUxRkI2LVxcdTFGQkNcXHUxRkJFXFx1MUZDMi1cXHUxRkM0XFx1MUZDNi1cXHUxRkNDXFx1MUZEMC1cXHUxRkQzXFx1MUZENi1cXHUxRkRCXFx1MUZFMC1cXHUxRkVDXFx1MUZGMi1cXHUxRkY0XFx1MUZGNi1cXHUxRkZDXFx1MjA3MVxcdTIwN0ZcXHUyMDkwLVxcdTIwOUNcXHUyMTAyXFx1MjEwN1xcdTIxMEEtXFx1MjExM1xcdTIxMTVcXHUyMTE5LVxcdTIxMURcXHUyMTI0XFx1MjEyNlxcdTIxMjhcXHUyMTJBLVxcdTIxMkRcXHUyMTJGLVxcdTIxMzlcXHUyMTNDLVxcdTIxM0ZcXHUyMTQ1LVxcdTIxNDlcXHUyMTRFXFx1MjE4M1xcdTIxODRcXHUyQzAwLVxcdTJDMkVcXHUyQzMwLVxcdTJDNUVcXHUyQzYwLVxcdTJDRTRcXHUyQ0VCLVxcdTJDRUVcXHUyQ0YyXFx1MkNGM1xcdTJEMDAtXFx1MkQyNVxcdTJEMjdcXHUyRDJEXFx1MkQzMC1cXHUyRDY3XFx1MkQ2RlxcdTJEODAtXFx1MkQ5NlxcdTJEQTAtXFx1MkRBNlxcdTJEQTgtXFx1MkRBRVxcdTJEQjAtXFx1MkRCNlxcdTJEQjgtXFx1MkRCRVxcdTJEQzAtXFx1MkRDNlxcdTJEQzgtXFx1MkRDRVxcdTJERDAtXFx1MkRENlxcdTJERDgtXFx1MkRERVxcdTJFMkZcXHUzMDA1XFx1MzAwNlxcdTMwMzEtXFx1MzAzNVxcdTMwM0JcXHUzMDNDXFx1MzEwNS1cXHUzMTJEXFx1MzEzMS1cXHUzMThFXFx1MzFBMC1cXHUzMUJBXFx1MzFGMC1cXHUzMUZGXFx1MzQwMC1cXHU0REI1XFx1QTAwMC1cXHVBNDhDXFx1QTREMC1cXHVBNEZEXFx1QTUwMC1cXHVBNjBDXFx1QTYxMC1cXHVBNjFGXFx1QTYyQVxcdUE2MkJcXHVBNjQwLVxcdUE2NkVcXHVBNjdGLVxcdUE2OURcXHVBNkEwLVxcdUE2RTVcXHVBNzE3LVxcdUE3MUZcXHVBNzIyLVxcdUE3ODhcXHVBNzhCLVxcdUE3QURcXHVBN0IwLVxcdUE3QjdcXHVBN0Y3LVxcdUE4MDFcXHVBODAzLVxcdUE4MDVcXHVBODA3LVxcdUE4MEFcXHVBODBDLVxcdUE4MjJcXHVBODQwLVxcdUE4NzNcXHVBODgyLVxcdUE4QjNcXHVBOEYyLVxcdUE4RjdcXHVBOEZCXFx1QThGRFxcdUE5MEEtXFx1QTkyNVxcdUE5MzAtXFx1QTk0NlxcdUE5NjAtXFx1QTk3Q1xcdUE5ODQtXFx1QTlCMlxcdUE5Q0ZcXHVBOUUwLVxcdUE5RTRcXHVBOUU2LVxcdUE5RUZcXHVBOUZBLVxcdUE5RkVcXHVBQTAwLVxcdUFBMjhcXHVBQTQwLVxcdUFBNDJcXHVBQTQ0LVxcdUFBNEJcXHVBQTYwLVxcdUFBNzZcXHVBQTdBXFx1QUE3RS1cXHVBQUFGXFx1QUFCMVxcdUFBQjVcXHVBQUI2XFx1QUFCOS1cXHVBQUJEXFx1QUFDMFxcdUFBQzJcXHVBQURCLVxcdUFBRERcXHVBQUUwLVxcdUFBRUFcXHVBQUYyLVxcdUFBRjRcXHVBQjAxLVxcdUFCMDZcXHVBQjA5LVxcdUFCMEVcXHVBQjExLVxcdUFCMTZcXHVBQjIwLVxcdUFCMjZcXHVBQjI4LVxcdUFCMkVcXHVBQjMwLVxcdUFCNUFcXHVBQjVDLVxcdUFCNjVcXHVBQjcwLVxcdUFCRTJcXHVBQzAwLVxcdUQ3QTNcXHVEN0IwLVxcdUQ3QzZcXHVEN0NCLVxcdUQ3RkJcXHVGOTAwLVxcdUZBNkRcXHVGQTcwLVxcdUZBRDlcXHVGQjAwLVxcdUZCMDZcXHVGQjEzLVxcdUZCMTdcXHVGQjFEXFx1RkIxRi1cXHVGQjI4XFx1RkIyQS1cXHVGQjM2XFx1RkIzOC1cXHVGQjNDXFx1RkIzRVxcdUZCNDBcXHVGQjQxXFx1RkI0M1xcdUZCNDRcXHVGQjQ2LVxcdUZCQjFcXHVGQkQzLVxcdUZEM0RcXHVGRDUwLVxcdUZEOEZcXHVGRDkyLVxcdUZEQzdcXHVGREYwLVxcdUZERkJcXHVGRTcwLVxcdUZFNzRcXHVGRTc2LVxcdUZFRkNcXHVGRjIxLVxcdUZGM0FcXHVGRjQxLVxcdUZGNUFcXHVGRjY2LVxcdUZGQkVcXHVGRkMyLVxcdUZGQzdcXHVGRkNBLVxcdUZGQ0ZcXHVGRkQyLVxcdUZGRDdcXHVGRkRBLVxcdUZGREMvXG4gICAgLnNvdXJjZTtcbiAgY29uc3Qgbm9uU3BhY2VEZWxpbWl0ZWRXb3JkcyA9IC9cXHUzMDQxLVxcdTMwOTZcXHUzMDlELVxcdTMwOUZcXHUzMEExLVxcdTMwRkFcXHUzMEZDLVxcdTMwRkZcXHU0RTAwLVxcdTlGRDUvXG4gICAgLnNvdXJjZTtcblxuICBjb25zdCBwYXR0ZXJuID0gbmV3IFJlZ0V4cChcbiAgICBbXG4gICAgICBgKD86WzAtOV0rKD86KD86LHxcXFxcLilbMC05XSspKnxbXFxcXC0ke3NwYWNlRGVsaW1pdGVkQ2hhcnN9XSkrYCxcbiAgICAgIG5vblNwYWNlRGVsaW1pdGVkV29yZHMsXG4gICAgXS5qb2luKFwifFwiKSxcbiAgICBcImdcIlxuICApO1xuICByZXR1cm4gKHRleHQubWF0Y2gocGF0dGVybikgfHwgW10pLmxlbmd0aDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENoYXJhY3RlckNvdW50KHRleHQ6IHN0cmluZyk6IG51bWJlciB7XG4gIHJldHVybiB0ZXh0Lmxlbmd0aDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNlbnRlbmNlQ291bnQodGV4dDogc3RyaW5nKTogbnVtYmVyIHtcbiAgLy8gVGhhbmtzIHRvIEV4dHJhY3QgSGlnaGxpZ2h0cyBwbHVnaW4gYW5kIEFuZ2VsdXNEb21pbmlcbiAgLy8gQWxzbyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81NTUzNDEwXG4gIGNvbnN0IHNlbnRlbmNlczogbnVtYmVyID0gKFxuICAgICh0ZXh0IHx8IFwiXCIpLm1hdGNoKFxuICAgICAgL1teLiE/XFxzXVteLiE/XSooPzpbLiE/XSg/IVsnXCJdP1xcc3wkKVteLiE/XSopKlsuIT9dP1snXCJdPyg/PVxcc3wkKS9nbVxuICAgICkgfHwgW11cbiAgKS5sZW5ndGg7XG5cbiAgcmV0dXJuIHNlbnRlbmNlcztcbn1cblxuLy8gQWx0IENvdW50IFN0YXRzXG4vLyBUaGFua3MgdG8gRWxlYW5vciBLb25payBmb3IgdGhlIGFsdGVybmF0ZSBjb3VudCBpZGVhLlxuZXhwb3J0IGZ1bmN0aW9uIGdldEZpbGVzQ291bnQoZmlsZXM6IFRGaWxlW10pOiBudW1iZXIge1xuICByZXR1cm4gZmlsZXMubGVuZ3RoO1xufVxuIiwiZXhwb3J0IGNsYXNzIFN0YXR1c0JhciB7XG4gIHByaXZhdGUgc3RhdHVzQmFyRWw6IEhUTUxFbGVtZW50O1xuXG4gIGNvbnN0cnVjdG9yKHN0YXR1c0JhckVsOiBIVE1MRWxlbWVudCkge1xuICAgIHRoaXMuc3RhdHVzQmFyRWwgPSBzdGF0dXNCYXJFbDtcbiAgfVxuXG4gIGRpc3BsYXlUZXh0KHRleHQ6IHN0cmluZykge1xuICAgIHRoaXMuc3RhdHVzQmFyRWwuc2V0VGV4dCh0ZXh0KTtcbiAgfVxufVxuIiwiaW1wb3J0IHtcclxuICBNYXJrZG93blZpZXcsXHJcbiAgUGx1Z2luLFxyXG4gIFRGaWxlLFxyXG4gIE1ldGFkYXRhQ2FjaGUsXHJcbiAgZ2V0QWxsVGFncyxcclxufSBmcm9tIFwib2JzaWRpYW5cIjtcclxuaW1wb3J0IHsgQmV0dGVyV29yZENvdW50U2V0dGluZ3NUYWIgfSBmcm9tIFwiLi9zZXR0aW5ncy9zZXR0aW5ncy10YWJcIjtcclxuaW1wb3J0IHsgQmV0dGVyV29yZENvdW50U2V0dGluZ3MgfSBmcm9tIFwiLi9zZXR0aW5ncy9zZXR0aW5nc1wiO1xyXG5pbXBvcnQge1xyXG4gIGdldFdvcmRDb3VudCxcclxuICBnZXRDaGFyYWN0ZXJDb3VudCxcclxuICBnZXRTZW50ZW5jZUNvdW50LFxyXG4gIGdldEZpbGVzQ291bnQsXHJcbn0gZnJvbSBcIi4vc3RhdHNcIjtcclxuaW1wb3J0IHsgU3RhdHVzQmFyIH0gZnJvbSBcIi4vc3RhdHVzLWJhclwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmV0dGVyV29yZENvdW50IGV4dGVuZHMgUGx1Z2luIHtcclxuICBwdWJsaWMgcmVjZW50bHlUeXBlZDogYm9vbGVhbjtcclxuICBwdWJsaWMgc3RhdHVzQmFyOiBTdGF0dXNCYXI7XHJcbiAgcHVibGljIGN1cnJlbnRGaWxlOiBURmlsZTtcclxuICBwdWJsaWMgc2V0dGluZ3M6IEJldHRlcldvcmRDb3VudFNldHRpbmdzO1xyXG5cclxuICBhc3luYyBvbmxvYWQoKSB7XHJcbiAgICBsZXQgc3RhdHVzQmFyRWwgPSB0aGlzLmFkZFN0YXR1c0Jhckl0ZW0oKTtcclxuICAgIHRoaXMuc3RhdHVzQmFyID0gbmV3IFN0YXR1c0JhcihzdGF0dXNCYXJFbCk7XHJcblxyXG4gICAgdGhpcy5yZWNlbnRseVR5cGVkID0gZmFsc2U7XHJcblxyXG4gICAgdGhpcy5zZXR0aW5ncyA9IChhd2FpdCB0aGlzLmxvYWREYXRhKCkpIHx8IG5ldyBCZXR0ZXJXb3JkQ291bnRTZXR0aW5ncygpO1xyXG4gICAgdGhpcy5hZGRTZXR0aW5nVGFiKG5ldyBCZXR0ZXJXb3JkQ291bnRTZXR0aW5nc1RhYih0aGlzLmFwcCwgdGhpcykpO1xyXG5cclxuICAgIHRoaXMudXBkYXRlQWx0Q291bnQoKTtcclxuXHJcbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnQoXHJcbiAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5vbihcImZpbGUtb3BlblwiLCB0aGlzLm9uRmlsZU9wZW4sIHRoaXMpXHJcbiAgICApO1xyXG5cclxuICAgIHRoaXMucmVnaXN0ZXJFdmVudChcclxuICAgICAgdGhpcy5hcHAud29ya3NwYWNlLm9uKFwicXVpY2stcHJldmlld1wiLCB0aGlzLm9uUXVpY2tQcmV2aWV3LCB0aGlzKVxyXG4gICAgKTtcclxuXHJcbiAgICB0aGlzLnJlZ2lzdGVySW50ZXJ2YWwoXHJcbiAgICAgIHdpbmRvdy5zZXRJbnRlcnZhbChhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgbGV0IGFjdGl2ZUxlYWYgPSB0aGlzLmFwcC53b3Jrc3BhY2UuYWN0aXZlTGVhZjtcclxuXHJcbiAgICAgICAgaWYgKCFhY3RpdmVMZWFmIHx8ICEoYWN0aXZlTGVhZi52aWV3IGluc3RhbmNlb2YgTWFya2Rvd25WaWV3KSkge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGVkaXRvciA9IGFjdGl2ZUxlYWYudmlldy5zb3VyY2VNb2RlLmNtRWRpdG9yO1xyXG4gICAgICAgIGlmIChlZGl0b3Iuc29tZXRoaW5nU2VsZWN0ZWQoKSkge1xyXG4gICAgICAgICAgbGV0IGNvbnRlbnQ6IHN0cmluZyA9IGVkaXRvci5nZXRTZWxlY3Rpb24oKTtcclxuICAgICAgICAgIHRoaXMudXBkYXRlV29yZENvdW50KGNvbnRlbnQpO1xyXG4gICAgICAgICAgdGhpcy5yZWNlbnRseVR5cGVkID0gZmFsc2U7XHJcbiAgICAgICAgfSBlbHNlIGlmIChcclxuICAgICAgICAgIHRoaXMuY3VycmVudEZpbGUgJiZcclxuICAgICAgICAgIHRoaXMuY3VycmVudEZpbGUuZXh0ZW5zaW9uID09PSBcIm1kXCIgJiZcclxuICAgICAgICAgICF0aGlzLnJlY2VudGx5VHlwZWRcclxuICAgICAgICApIHtcclxuICAgICAgICAgIGNvbnN0IGNvbnRlbnRzID0gYXdhaXQgdGhpcy5hcHAudmF1bHQuY2FjaGVkUmVhZCh0aGlzLmN1cnJlbnRGaWxlKTtcclxuICAgICAgICAgIHRoaXMudXBkYXRlV29yZENvdW50KGNvbnRlbnRzKTtcclxuICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLnJlY2VudGx5VHlwZWQpIHtcclxuICAgICAgICAgIHRoaXMudXBkYXRlV29yZENvdW50KFwiXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSwgNTAwKVxyXG4gICAgKTtcclxuXHJcbiAgICBsZXQgYWN0aXZlTGVhZiA9IHRoaXMuYXBwLndvcmtzcGFjZS5hY3RpdmVMZWFmO1xyXG4gICAgbGV0IGZpbGVzOiBURmlsZVtdID0gdGhpcy5hcHAudmF1bHQuZ2V0TWFya2Rvd25GaWxlcygpO1xyXG5cclxuICAgIGZpbGVzLmZvckVhY2goKGZpbGUpID0+IHtcclxuICAgICAgaWYgKGZpbGUuYmFzZW5hbWUgPT09IGFjdGl2ZUxlYWYuZ2V0RGlzcGxheVRleHQoKSkge1xyXG4gICAgICAgIHRoaXMub25GaWxlT3BlbihmaWxlKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBhc3luYyBvbkZpbGVPcGVuKGZpbGU6IFRGaWxlKSB7XHJcbiAgICB0aGlzLmN1cnJlbnRGaWxlID0gZmlsZTtcclxuICAgIGlmIChmaWxlICYmIGZpbGUuZXh0ZW5zaW9uID09PSBcIm1kXCIpIHtcclxuICAgICAgY29uc3QgY29udGVudHMgPSBhd2FpdCB0aGlzLmFwcC52YXVsdC5jYWNoZWRSZWFkKGZpbGUpO1xyXG4gICAgICB0aGlzLnJlY2VudGx5VHlwZWQgPSB0cnVlO1xyXG4gICAgICB0aGlzLnVwZGF0ZVdvcmRDb3VudChjb250ZW50cyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnVwZGF0ZUFsdENvdW50KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBvblF1aWNrUHJldmlldyhmaWxlOiBURmlsZSwgY29udGVudHM6IHN0cmluZykge1xyXG4gICAgdGhpcy5jdXJyZW50RmlsZSA9IGZpbGU7XHJcbiAgICBjb25zdCBsZWFmID0gdGhpcy5hcHAud29ya3NwYWNlLmFjdGl2ZUxlYWY7XHJcblxyXG4gICAgaWYgKGxlYWYgJiYgbGVhZi52aWV3LmdldFZpZXdUeXBlKCkgPT09IFwibWFya2Rvd25cIikge1xyXG4gICAgICB0aGlzLnJlY2VudGx5VHlwZWQgPSB0cnVlO1xyXG4gICAgICB0aGlzLnVwZGF0ZVdvcmRDb3VudChjb250ZW50cyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhc3luYyB1cGRhdGVBbHRDb3VudCgpIHtcclxuICAgIGNvbnN0IGZpbGVzID0gZ2V0RmlsZXNDb3VudCh0aGlzLmFwcC52YXVsdC5nZXRGaWxlcygpKTtcclxuXHJcbiAgICBsZXQgZGlzcGxheVRleHQ6IHN0cmluZyA9IGAke2ZpbGVzfSBmaWxlcyBgO1xyXG4gICAgbGV0IGFsbFdvcmRzID0gMDtcclxuICAgIGxldCBhbGxDaGFyYWN0ZXJzID0gMDtcclxuICAgIGxldCBhbGxTZW50ZW5jZXMgPSAwO1xyXG5cclxuICAgIGZvcihjb25zdCBmIG9mIHRoaXMuYXBwLnZhdWx0LmdldE1hcmtkb3duRmlsZXMoKSl7XHJcbiAgICAgIGxldCBmaWxlQ29udGVudHMgPSBhd2FpdCB0aGlzLmFwcC52YXVsdC5jYWNoZWRSZWFkKGYpO1xyXG4gICAgICBhbGxXb3JkcyArPSBnZXRXb3JkQ291bnQoZmlsZUNvbnRlbnRzKTtcclxuICAgICAgYWxsQ2hhcmFjdGVycyArPSBnZXRDaGFyYWN0ZXJDb3VudChmaWxlQ29udGVudHMpO1xyXG4gICAgICBhbGxTZW50ZW5jZXMgKz0gZ2V0U2VudGVuY2VDb3VudChmaWxlQ29udGVudHMpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnNldHRpbmdzLnNob3dXb3Jkcykge1xyXG4gICAgICBkaXNwbGF5VGV4dCA9XHJcbiAgICAgICAgZGlzcGxheVRleHQgK1xyXG4gICAgICAgIHRoaXMuc2V0dGluZ3Mud29yZHNQcmVmaXggK1xyXG4gICAgICAgIGFsbFdvcmRzICtcclxuICAgICAgICB0aGlzLnNldHRpbmdzLndvcmRzU3VmZml4O1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMuc2V0dGluZ3Muc2hvd0NoYXJhY3RlcnMpIHtcclxuICAgICAgZGlzcGxheVRleHQgPVxyXG4gICAgICAgIGRpc3BsYXlUZXh0ICtcclxuICAgICAgICB0aGlzLnNldHRpbmdzLmNoYXJhY3RlcnNQcmVmaXggK1xyXG4gICAgICAgIGFsbENoYXJhY3RlcnMgK1xyXG4gICAgICAgIHRoaXMuc2V0dGluZ3MuY2hhcmFjdGVyc1N1ZmZpeDtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLnNldHRpbmdzLnNob3dTZW50ZW5jZXMpIHtcclxuICAgICAgZGlzcGxheVRleHQgPVxyXG4gICAgICAgIGRpc3BsYXlUZXh0ICtcclxuICAgICAgICB0aGlzLnNldHRpbmdzLnNlbnRlbmNlc1ByZWZpeCArXHJcbiAgICAgICAgYWxsU2VudGVuY2VzICtcclxuICAgICAgICB0aGlzLnNldHRpbmdzLnNlbnRlbmNlc1N1ZmZpeDtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnN0YXR1c0Jhci5kaXNwbGF5VGV4dChkaXNwbGF5VGV4dCk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVXb3JkQ291bnQodGV4dDogc3RyaW5nKSB7XHJcbiAgICBsZXQgZGlzcGxheVRleHQ6IHN0cmluZyA9IFwiXCI7XHJcbiAgICBpZiAodGhpcy5zZXR0aW5ncy5zaG93V29yZHMpIHtcclxuICAgICAgZGlzcGxheVRleHQgPVxyXG4gICAgICAgIGRpc3BsYXlUZXh0ICtcclxuICAgICAgICB0aGlzLnNldHRpbmdzLndvcmRzUHJlZml4ICtcclxuICAgICAgICBnZXRXb3JkQ291bnQodGV4dCkgK1xyXG4gICAgICAgIHRoaXMuc2V0dGluZ3Mud29yZHNTdWZmaXg7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5zZXR0aW5ncy5zaG93Q2hhcmFjdGVycykge1xyXG4gICAgICBkaXNwbGF5VGV4dCA9XHJcbiAgICAgICAgZGlzcGxheVRleHQgK1xyXG4gICAgICAgIHRoaXMuc2V0dGluZ3MuY2hhcmFjdGVyc1ByZWZpeCArXHJcbiAgICAgICAgZ2V0Q2hhcmFjdGVyQ291bnQodGV4dCkgK1xyXG4gICAgICAgIHRoaXMuc2V0dGluZ3MuY2hhcmFjdGVyc1N1ZmZpeDtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLnNldHRpbmdzLnNob3dTZW50ZW5jZXMpIHtcclxuICAgICAgZGlzcGxheVRleHQgPVxyXG4gICAgICAgIGRpc3BsYXlUZXh0ICtcclxuICAgICAgICB0aGlzLnNldHRpbmdzLnNlbnRlbmNlc1ByZWZpeCArXHJcbiAgICAgICAgZ2V0U2VudGVuY2VDb3VudCh0ZXh0KSArXHJcbiAgICAgICAgdGhpcy5zZXR0aW5ncy5zZW50ZW5jZXNTdWZmaXg7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5zdGF0dXNCYXIuZGlzcGxheVRleHQoZGlzcGxheVRleHQpO1xyXG4gIH1cclxufVxyXG4iXSwibmFtZXMiOlsiU2V0dGluZyIsIlBsdWdpblNldHRpbmdUYWIiLCJNYXJrZG93blZpZXciLCJQbHVnaW4iXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksYUFBYSxHQUFHLFNBQVMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNuQyxJQUFJLGFBQWEsR0FBRyxNQUFNLENBQUMsY0FBYztBQUN6QyxTQUFTLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxZQUFZLEtBQUssSUFBSSxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDcEYsUUFBUSxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDMUcsSUFBSSxPQUFPLGFBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDL0IsQ0FBQyxDQUFDO0FBQ0Y7QUFDTyxTQUFTLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ2hDLElBQUksSUFBSSxPQUFPLENBQUMsS0FBSyxVQUFVLElBQUksQ0FBQyxLQUFLLElBQUk7QUFDN0MsUUFBUSxNQUFNLElBQUksU0FBUyxDQUFDLHNCQUFzQixHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRywrQkFBK0IsQ0FBQyxDQUFDO0FBQ2xHLElBQUksYUFBYSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN4QixJQUFJLFNBQVMsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsRUFBRTtBQUMzQyxJQUFJLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxLQUFLLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDekYsQ0FBQztBQXVDRDtBQUNPLFNBQVMsU0FBUyxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRTtBQUM3RCxJQUFJLFNBQVMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLE9BQU8sS0FBSyxZQUFZLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsVUFBVSxPQUFPLEVBQUUsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRTtBQUNoSCxJQUFJLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxFQUFFLFVBQVUsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUMvRCxRQUFRLFNBQVMsU0FBUyxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDbkcsUUFBUSxTQUFTLFFBQVEsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDdEcsUUFBUSxTQUFTLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxNQUFNLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDLEVBQUU7QUFDdEgsUUFBUSxJQUFJLENBQUMsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsVUFBVSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDOUUsS0FBSyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBQ0Q7QUFDTyxTQUFTLFdBQVcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFO0FBQzNDLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNySCxJQUFJLE9BQU8sQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxPQUFPLE1BQU0sS0FBSyxVQUFVLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxXQUFXLEVBQUUsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzdKLElBQUksU0FBUyxJQUFJLENBQUMsQ0FBQyxFQUFFLEVBQUUsT0FBTyxVQUFVLENBQUMsRUFBRSxFQUFFLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDdEUsSUFBSSxTQUFTLElBQUksQ0FBQyxFQUFFLEVBQUU7QUFDdEIsUUFBUSxJQUFJLENBQUMsRUFBRSxNQUFNLElBQUksU0FBUyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7QUFDdEUsUUFBUSxPQUFPLENBQUMsRUFBRSxJQUFJO0FBQ3RCLFlBQVksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDekssWUFBWSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3BELFlBQVksUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3pCLGdCQUFnQixLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxNQUFNO0FBQzlDLGdCQUFnQixLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUM7QUFDeEUsZ0JBQWdCLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVM7QUFDakUsZ0JBQWdCLEtBQUssQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLFNBQVM7QUFDakUsZ0JBQWdCO0FB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
