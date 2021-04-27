'use strict';

var obsidian = require('obsidian');
var electron = require('electron');
var path_1 = require('path');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var path_1__default = /*#__PURE__*/_interopDefaultLegacy(path_1);

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

/**
 * File URI to Path function.
 *
 * @param {String} uri
 * @return {String} path
 * @api public
 */
function fileUriToPath(uri) {
    if (typeof uri !== 'string' ||
        uri.length <= 7 ||
        uri.substring(0, 7) !== 'file://') {
        throw new TypeError('must pass in a file:// URI to convert to a file path');
    }
    const rest = decodeURI(uri.substring(7));
    const firstSlash = rest.indexOf('/');
    let host = rest.substring(0, firstSlash);
    let path = rest.substring(firstSlash + 1);
    // 2.  Scheme Definition
    // As a special case, <host> can be the string "localhost" or the empty
    // string; this is interpreted as "the machine from which the URL is
    // being interpreted".
    if (host === 'localhost') {
        host = '';
    }
    if (host) {
        host = path_1__default['default'].sep + path_1__default['default'].sep + host;
    }
    // 3.2  Drives, drive letters, mount points, file system root
    // Drive letters are mapped into the top of a file URI in various ways,
    // depending on the implementation; some applications substitute
    // vertical bar ("|") for the colon after the drive letter, yielding
    // "file:///c|/tmp/test.txt".  In some cases, the colon is left
    // unchanged, as in "file:///c:/tmp/test.txt".  In other cases, the
    // colon is simply omitted, as in "file:///c/tmp/test.txt".
    path = path.replace(/^(.+)\|/, '$1:');
    // for Windows, we need to invert the path separators from what a URI uses
    if (path_1__default['default'].sep === '\\') {
        path = path.replace(/\//g, '\\');
    }
    if (/^.+:/.test(path)) ;
    else {
        // unix path…
        path = path_1__default['default'].sep + path;
    }
    return host + path;
}
var src = fileUriToPath;

var FilePathToUri = /** @class */ (function (_super) {
    __extends(FilePathToUri, _super);
    function FilePathToUri() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FilePathToUri.prototype.onload = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                console.log('Loading plugin FilePathToUri...');
                this.addCommand({
                    id: 'toggle-file-path-to-uri',
                    name: 'Toggle selected file path to URI and back',
                    checkCallback: function (checking) {
                        if (_this.getEditor() === null) {
                            return;
                        }
                        if (!checking) {
                            _this.toggleLink();
                        }
                        return true;
                    },
                    hotkeys: [
                        {
                            modifiers: ['Mod', 'Alt'],
                            key: 'L',
                        },
                    ],
                });
                this.addCommand({
                    id: 'paste-file-path-as-file-uri',
                    name: 'Paste file path as file uri',
                    checkCallback: function (checking) {
                        if (_this.getEditor() === null) {
                            return;
                        }
                        if (!checking) {
                            _this.pasteAsUri();
                        }
                        return true;
                    },
                    hotkeys: [
                        {
                            modifiers: ['Mod', 'Alt', 'Shift'],
                            key: 'L',
                        },
                    ],
                });
                return [2 /*return*/];
            });
        });
    };
    FilePathToUri.prototype.getEditor = function () {
        var view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
        if (!view || view.getMode() !== 'source') {
            return null;
        }
        return view.sourceMode.cmEditor;
    };
    FilePathToUri.prototype.pasteAsUri = function () {
        var editor = this.getEditor();
        if (editor == null) {
            return;
        }
        var clipboardText = electron.clipboard.readText('clipboard');
        if (!clipboardText) {
            return;
        }
        clipboardText = this.cleanupText(clipboardText);
        // Paste the text as usual if it's not file path
        if (clipboardText.startsWith('file:') || !this.hasSlashes(clipboardText)) {
            editor.replaceSelection(clipboardText, 'around');
        }
        // network path '\\path'
        if (clipboardText.startsWith('\\\\')) {
            var endsWithSlash = clipboardText.endsWith('\\') || clipboardText.endsWith('/');
            // URL throws error on invalid url
            try {
                var url = new URL(clipboardText);
                var link = url.href.replace('file://', 'file:///%5C%5C');
                if (link.endsWith('/') && !endsWithSlash) {
                    link = link.slice(0, -1);
                }
                editor.replaceSelection(link, 'around');
            }
            catch (e) {
                return;
            }
        }
        // path C:\Users\ or \System\etc
        else {
            if (!this.hasSlashes(clipboardText)) {
                return;
            }
            // URL throws error on invalid url
            try {
                var url = new URL('file://' + clipboardText);
                editor.replaceSelection(url.href, 'around');
            }
            catch (e) {
                return;
            }
        }
    };
    /**
     * Does the text have any '\' or '/'?
     */
    FilePathToUri.prototype.hasSlashes = function (text) {
        // Does it have any '\' or '/'?
        var regexHasAnySlash = /.*([\\\/]).*/g;
        if (typeof text !== 'string') {
            return false;
        }
        var matches = text.match(regexHasAnySlash);
        return !!matches;
    };
    /**
     * Trim whitespace and remove surrounding "
     */
    FilePathToUri.prototype.cleanupText = function (text) {
        if (typeof text !== 'string') {
            return '';
        }
        text = text.trim();
        // Remove surrounding "
        if (text.startsWith('"')) {
            text = text.substr(1);
        }
        if (text.endsWith('"')) {
            text = text.substr(0, text.length - 1);
        }
        return text;
    };
    FilePathToUri.prototype.toggleLink = function () {
        var editor = this.getEditor();
        if (editor == null || !editor.somethingSelected()) {
            return;
        }
        var selectedText = editor.getSelection();
        selectedText = this.cleanupText(selectedText);
        // file url for network location file://\\location
        // Works for both 'file:///\\path' and 'file:///%5C%5Cpath'
        // Obsidian uses escape chars in link so `file:///\\location` will try to open `file:///\location instead
        // But the selected text we get contains the full string, thus the test for both 2 and 4 '\' chars
        if (selectedText.startsWith('file:///\\\\') ||
            selectedText.startsWith('file:///\\\\\\\\') ||
            selectedText.startsWith('file:///%5C%5C')) {
            // normalize to 'file:///'
            selectedText = selectedText.replace('file:///\\\\\\\\', 'file:///');
            selectedText = selectedText.replace('file:///\\\\', 'file:///');
            selectedText = selectedText.replace('file:///%5C%5C', 'file:///');
            var url = src(selectedText);
            if (url) {
                // fileUriToPath returns only single leading '\' so we need to add the second one
                editor.replaceSelection('\\' + url, 'around');
            }
        }
        // file link file:///C:/Users
        else if (selectedText.startsWith('file:///')) {
            var url = src(selectedText);
            if (url) {
                editor.replaceSelection(url, 'around');
            }
        }
        // network path '\\path'
        else if (selectedText.startsWith('\\\\')) {
            var endsWithSlash = selectedText.endsWith('\\') || selectedText.endsWith('/');
            // URL throws error on invalid url
            try {
                var url = new URL(selectedText);
                var link = url.href.replace('file://', 'file:///%5C%5C');
                if (link.endsWith('/') && !endsWithSlash) {
                    link = link.slice(0, -1);
                }
                editor.replaceSelection(link, 'around');
            }
            catch (e) {
                return;
            }
        }
        // path C:\Users\ or \System\etc
        else {
            if (!this.hasSlashes(selectedText)) {
                return;
            }
            // URL throws error on invalid url
            try {
                var url = new URL('file://' + selectedText);
                editor.replaceSelection(url.href, 'around');
            }
            catch (e) {
                return;
            }
        }
    };
    FilePathToUri.prototype.onunload = function () {
        console.log('Unloading plugin FilePathToUri...');
    };
    return FilePathToUri;
}(obsidian.Plugin));

module.exports = FilePathToUri;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiLi4vbm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsIi4uL25vZGVfbW9kdWxlcy9maWxlLXVyaS10by1wYXRoL2Rpc3Qvc3JjL2luZGV4LmpzIiwiLi4vbWFpbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiEgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uXHJcblxyXG5QZXJtaXNzaW9uIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBhbmQvb3IgZGlzdHJpYnV0ZSB0aGlzIHNvZnR3YXJlIGZvciBhbnlcclxucHVycG9zZSB3aXRoIG9yIHdpdGhvdXQgZmVlIGlzIGhlcmVieSBncmFudGVkLlxyXG5cclxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiBBTkQgVEhFIEFVVEhPUiBESVNDTEFJTVMgQUxMIFdBUlJBTlRJRVMgV0lUSFxyXG5SRUdBUkQgVE8gVEhJUyBTT0ZUV0FSRSBJTkNMVURJTkcgQUxMIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFlcclxuQU5EIEZJVE5FU1MuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1IgQkUgTElBQkxFIEZPUiBBTlkgU1BFQ0lBTCwgRElSRUNULFxyXG5JTkRJUkVDVCwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIE9SIEFOWSBEQU1BR0VTIFdIQVRTT0VWRVIgUkVTVUxUSU5HIEZST01cclxuTE9TUyBPRiBVU0UsIERBVEEgT1IgUFJPRklUUywgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIE5FR0xJR0VOQ0UgT1JcclxuT1RIRVIgVE9SVElPVVMgQUNUSU9OLCBBUklTSU5HIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFVTRSBPUlxyXG5QRVJGT1JNQU5DRSBPRiBUSElTIFNPRlRXQVJFLlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG4vKiBnbG9iYWwgUmVmbGVjdCwgUHJvbWlzZSAqL1xyXG5cclxudmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbihkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChiLCBwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4dGVuZHMoZCwgYikge1xyXG4gICAgaWYgKHR5cGVvZiBiICE9PSBcImZ1bmN0aW9uXCIgJiYgYiAhPT0gbnVsbClcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2xhc3MgZXh0ZW5kcyB2YWx1ZSBcIiArIFN0cmluZyhiKSArIFwiIGlzIG5vdCBhIGNvbnN0cnVjdG9yIG9yIG51bGxcIik7XHJcbiAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19hc3NpZ24gPSBmdW5jdGlvbigpIHtcclxuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbih0KSB7XHJcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSkgdFtwXSA9IHNbcF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3Jlc3QocywgZSkge1xyXG4gICAgdmFyIHQgPSB7fTtcclxuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxyXG4gICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGUuaW5kZXhPZihwW2ldKSA8IDAgJiYgT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHMsIHBbaV0pKVxyXG4gICAgICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XHJcbiAgICAgICAgfVxyXG4gICAgcmV0dXJuIHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2RlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XHJcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcclxuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XHJcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19wYXJhbShwYXJhbUluZGV4LCBkZWNvcmF0b3IpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBrZXkpIHsgZGVjb3JhdG9yKHRhcmdldCwga2V5LCBwYXJhbUluZGV4KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSkge1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0Lm1ldGFkYXRhID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBSZWZsZWN0Lm1ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXRlcih0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2dlbmVyYXRvcih0aGlzQXJnLCBib2R5KSB7XHJcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xyXG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcclxuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XHJcbiAgICAgICAgd2hpbGUgKF8pIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcclxuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XHJcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcclxuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cclxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2NyZWF0ZUJpbmRpbmcgPSBPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH0pO1xyXG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIG9bazJdID0gbVtrXTtcclxufSk7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHBvcnRTdGFyKG0sIG8pIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKHAgIT09IFwiZGVmYXVsdFwiICYmICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobywgcCkpIF9fY3JlYXRlQmluZGluZyhvLCBtLCBwKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fdmFsdWVzKG8pIHtcclxuICAgIHZhciBzID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIFN5bWJvbC5pdGVyYXRvciwgbSA9IHMgJiYgb1tzXSwgaSA9IDA7XHJcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcclxuICAgIGlmIChvICYmIHR5cGVvZiBvLmxlbmd0aCA9PT0gXCJudW1iZXJcIikgcmV0dXJuIHtcclxuICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChvICYmIGkgPj0gby5sZW5ndGgpIG8gPSB2b2lkIDA7XHJcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihzID8gXCJPYmplY3QgaXMgbm90IGl0ZXJhYmxlLlwiIDogXCJTeW1ib2wuaXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZWFkKG8sIG4pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXTtcclxuICAgIGlmICghbSkgcmV0dXJuIG87XHJcbiAgICB2YXIgaSA9IG0uY2FsbChvKSwgciwgYXIgPSBbXSwgZTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgd2hpbGUgKChuID09PSB2b2lkIDAgfHwgbi0tID4gMCkgJiYgIShyID0gaS5uZXh0KCkpLmRvbmUpIGFyLnB1c2goci52YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZXJyb3IpIHsgZSA9IHsgZXJyb3I6IGVycm9yIH07IH1cclxuICAgIGZpbmFsbHkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChyICYmICFyLmRvbmUgJiYgKG0gPSBpW1wicmV0dXJuXCJdKSkgbS5jYWxsKGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHsgaWYgKGUpIHRocm93IGUuZXJyb3I7IH1cclxuICAgIH1cclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuLyoqIEBkZXByZWNhdGVkICovXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZCgpIHtcclxuICAgIGZvciAodmFyIGFyID0gW10sIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIGFyID0gYXIuY29uY2F0KF9fcmVhZChhcmd1bWVudHNbaV0pKTtcclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuLyoqIEBkZXByZWNhdGVkICovXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZEFycmF5cygpIHtcclxuICAgIGZvciAodmFyIHMgPSAwLCBpID0gMCwgaWwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgaWw7IGkrKykgcyArPSBhcmd1bWVudHNbaV0ubGVuZ3RoO1xyXG4gICAgZm9yICh2YXIgciA9IEFycmF5KHMpLCBrID0gMCwgaSA9IDA7IGkgPCBpbDsgaSsrKVxyXG4gICAgICAgIGZvciAodmFyIGEgPSBhcmd1bWVudHNbaV0sIGogPSAwLCBqbCA9IGEubGVuZ3RoOyBqIDwgamw7IGorKywgaysrKVxyXG4gICAgICAgICAgICByW2tdID0gYVtqXTtcclxuICAgIHJldHVybiByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWRBcnJheSh0bywgZnJvbSkge1xyXG4gICAgZm9yICh2YXIgaSA9IDAsIGlsID0gZnJvbS5sZW5ndGgsIGogPSB0by5sZW5ndGg7IGkgPCBpbDsgaSsrLCBqKyspXHJcbiAgICAgICAgdG9bal0gPSBmcm9tW2ldO1xyXG4gICAgcmV0dXJuIHRvO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdCh2KSB7XHJcbiAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIF9fYXdhaXQgPyAodGhpcy52ID0gdiwgdGhpcykgOiBuZXcgX19hd2FpdCh2KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNHZW5lcmF0b3IodGhpc0FyZywgX2FyZ3VtZW50cywgZ2VuZXJhdG9yKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIGcgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSksIGksIHEgPSBbXTtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpZiAoZ1tuXSkgaVtuXSA9IGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAoYSwgYikgeyBxLnB1c2goW24sIHYsIGEsIGJdKSA+IDEgfHwgcmVzdW1lKG4sIHYpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gcmVzdW1lKG4sIHYpIHsgdHJ5IHsgc3RlcChnW25dKHYpKTsgfSBjYXRjaCAoZSkgeyBzZXR0bGUocVswXVszXSwgZSk7IH0gfVxyXG4gICAgZnVuY3Rpb24gc3RlcChyKSB7IHIudmFsdWUgaW5zdGFuY2VvZiBfX2F3YWl0ID8gUHJvbWlzZS5yZXNvbHZlKHIudmFsdWUudikudGhlbihmdWxmaWxsLCByZWplY3QpIDogc2V0dGxlKHFbMF1bMl0sIHIpOyB9XHJcbiAgICBmdW5jdGlvbiBmdWxmaWxsKHZhbHVlKSB7IHJlc3VtZShcIm5leHRcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiByZWplY3QodmFsdWUpIHsgcmVzdW1lKFwidGhyb3dcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUoZiwgdikgeyBpZiAoZih2KSwgcS5zaGlmdCgpLCBxLmxlbmd0aCkgcmVzdW1lKHFbMF1bMF0sIHFbMF1bMV0pOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jRGVsZWdhdG9yKG8pIHtcclxuICAgIHZhciBpLCBwO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiLCBmdW5jdGlvbiAoZSkgeyB0aHJvdyBlOyB9KSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobiwgZikgeyBpW25dID0gb1tuXSA/IGZ1bmN0aW9uICh2KSB7IHJldHVybiAocCA9ICFwKSA/IHsgdmFsdWU6IF9fYXdhaXQob1tuXSh2KSksIGRvbmU6IG4gPT09IFwicmV0dXJuXCIgfSA6IGYgPyBmKHYpIDogdjsgfSA6IGY7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNWYWx1ZXMobykge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBtID0gb1tTeW1ib2wuYXN5bmNJdGVyYXRvcl0sIGk7XHJcbiAgICByZXR1cm4gbSA/IG0uY2FsbChvKSA6IChvID0gdHlwZW9mIF9fdmFsdWVzID09PSBcImZ1bmN0aW9uXCIgPyBfX3ZhbHVlcyhvKSA6IG9bU3ltYm9sLml0ZXJhdG9yXSgpLCBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaSk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaVtuXSA9IG9bbl0gJiYgZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHsgdiA9IG9bbl0odiksIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHYuZG9uZSwgdi52YWx1ZSk7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCBkLCB2KSB7IFByb21pc2UucmVzb2x2ZSh2KS50aGVuKGZ1bmN0aW9uKHYpIHsgcmVzb2x2ZSh7IHZhbHVlOiB2LCBkb25lOiBkIH0pOyB9LCByZWplY3QpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ha2VUZW1wbGF0ZU9iamVjdChjb29rZWQsIHJhdykge1xyXG4gICAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29va2VkLCBcInJhd1wiLCB7IHZhbHVlOiByYXcgfSk7IH0gZWxzZSB7IGNvb2tlZC5yYXcgPSByYXc7IH1cclxuICAgIHJldHVybiBjb29rZWQ7XHJcbn07XHJcblxyXG52YXIgX19zZXRNb2R1bGVEZWZhdWx0ID0gT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCB2KSB7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgXCJkZWZhdWx0XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHYgfSk7XHJcbn0pIDogZnVuY3Rpb24obywgdikge1xyXG4gICAgb1tcImRlZmF1bHRcIl0gPSB2O1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0U3Rhcihtb2QpIHtcclxuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XHJcbiAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoayAhPT0gXCJkZWZhdWx0XCIgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIF9fY3JlYXRlQmluZGluZyhyZXN1bHQsIG1vZCwgayk7XHJcbiAgICBfX3NldE1vZHVsZURlZmF1bHQocmVzdWx0LCBtb2QpO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0RGVmYXVsdChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgZGVmYXVsdDogbW9kIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkR2V0KHJlY2VpdmVyLCBwcml2YXRlTWFwKSB7XHJcbiAgICBpZiAoIXByaXZhdGVNYXAuaGFzKHJlY2VpdmVyKSkge1xyXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJhdHRlbXB0ZWQgdG8gZ2V0IHByaXZhdGUgZmllbGQgb24gbm9uLWluc3RhbmNlXCIpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHByaXZhdGVNYXAuZ2V0KHJlY2VpdmVyKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fY2xhc3NQcml2YXRlRmllbGRTZXQocmVjZWl2ZXIsIHByaXZhdGVNYXAsIHZhbHVlKSB7XHJcbiAgICBpZiAoIXByaXZhdGVNYXAuaGFzKHJlY2VpdmVyKSkge1xyXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJhdHRlbXB0ZWQgdG8gc2V0IHByaXZhdGUgZmllbGQgb24gbm9uLWluc3RhbmNlXCIpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZU1hcC5zZXQocmVjZWl2ZXIsIHZhbHVlKTtcclxuICAgIHJldHVybiB2YWx1ZTtcclxufVxyXG4iLCJcInVzZSBzdHJpY3RcIjtcbmNvbnN0IHBhdGhfMSA9IHJlcXVpcmUoXCJwYXRoXCIpO1xuLyoqXG4gKiBGaWxlIFVSSSB0byBQYXRoIGZ1bmN0aW9uLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmlcbiAqIEByZXR1cm4ge1N0cmluZ30gcGF0aFxuICogQGFwaSBwdWJsaWNcbiAqL1xuZnVuY3Rpb24gZmlsZVVyaVRvUGF0aCh1cmkpIHtcbiAgICBpZiAodHlwZW9mIHVyaSAhPT0gJ3N0cmluZycgfHxcbiAgICAgICAgdXJpLmxlbmd0aCA8PSA3IHx8XG4gICAgICAgIHVyaS5zdWJzdHJpbmcoMCwgNykgIT09ICdmaWxlOi8vJykge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdtdXN0IHBhc3MgaW4gYSBmaWxlOi8vIFVSSSB0byBjb252ZXJ0IHRvIGEgZmlsZSBwYXRoJyk7XG4gICAgfVxuICAgIGNvbnN0IHJlc3QgPSBkZWNvZGVVUkkodXJpLnN1YnN0cmluZyg3KSk7XG4gICAgY29uc3QgZmlyc3RTbGFzaCA9IHJlc3QuaW5kZXhPZignLycpO1xuICAgIGxldCBob3N0ID0gcmVzdC5zdWJzdHJpbmcoMCwgZmlyc3RTbGFzaCk7XG4gICAgbGV0IHBhdGggPSByZXN0LnN1YnN0cmluZyhmaXJzdFNsYXNoICsgMSk7XG4gICAgLy8gMi4gIFNjaGVtZSBEZWZpbml0aW9uXG4gICAgLy8gQXMgYSBzcGVjaWFsIGNhc2UsIDxob3N0PiBjYW4gYmUgdGhlIHN0cmluZyBcImxvY2FsaG9zdFwiIG9yIHRoZSBlbXB0eVxuICAgIC8vIHN0cmluZzsgdGhpcyBpcyBpbnRlcnByZXRlZCBhcyBcInRoZSBtYWNoaW5lIGZyb20gd2hpY2ggdGhlIFVSTCBpc1xuICAgIC8vIGJlaW5nIGludGVycHJldGVkXCIuXG4gICAgaWYgKGhvc3QgPT09ICdsb2NhbGhvc3QnKSB7XG4gICAgICAgIGhvc3QgPSAnJztcbiAgICB9XG4gICAgaWYgKGhvc3QpIHtcbiAgICAgICAgaG9zdCA9IHBhdGhfMS5zZXAgKyBwYXRoXzEuc2VwICsgaG9zdDtcbiAgICB9XG4gICAgLy8gMy4yICBEcml2ZXMsIGRyaXZlIGxldHRlcnMsIG1vdW50IHBvaW50cywgZmlsZSBzeXN0ZW0gcm9vdFxuICAgIC8vIERyaXZlIGxldHRlcnMgYXJlIG1hcHBlZCBpbnRvIHRoZSB0b3Agb2YgYSBmaWxlIFVSSSBpbiB2YXJpb3VzIHdheXMsXG4gICAgLy8gZGVwZW5kaW5nIG9uIHRoZSBpbXBsZW1lbnRhdGlvbjsgc29tZSBhcHBsaWNhdGlvbnMgc3Vic3RpdHV0ZVxuICAgIC8vIHZlcnRpY2FsIGJhciAoXCJ8XCIpIGZvciB0aGUgY29sb24gYWZ0ZXIgdGhlIGRyaXZlIGxldHRlciwgeWllbGRpbmdcbiAgICAvLyBcImZpbGU6Ly8vY3wvdG1wL3Rlc3QudHh0XCIuICBJbiBzb21lIGNhc2VzLCB0aGUgY29sb24gaXMgbGVmdFxuICAgIC8vIHVuY2hhbmdlZCwgYXMgaW4gXCJmaWxlOi8vL2M6L3RtcC90ZXN0LnR4dFwiLiAgSW4gb3RoZXIgY2FzZXMsIHRoZVxuICAgIC8vIGNvbG9uIGlzIHNpbXBseSBvbWl0dGVkLCBhcyBpbiBcImZpbGU6Ly8vYy90bXAvdGVzdC50eHRcIi5cbiAgICBwYXRoID0gcGF0aC5yZXBsYWNlKC9eKC4rKVxcfC8sICckMTonKTtcbiAgICAvLyBmb3IgV2luZG93cywgd2UgbmVlZCB0byBpbnZlcnQgdGhlIHBhdGggc2VwYXJhdG9ycyBmcm9tIHdoYXQgYSBVUkkgdXNlc1xuICAgIGlmIChwYXRoXzEuc2VwID09PSAnXFxcXCcpIHtcbiAgICAgICAgcGF0aCA9IHBhdGgucmVwbGFjZSgvXFwvL2csICdcXFxcJyk7XG4gICAgfVxuICAgIGlmICgvXi4rOi8udGVzdChwYXRoKSkge1xuICAgICAgICAvLyBoYXMgV2luZG93cyBkcml2ZSBhdCBiZWdpbm5pbmcgb2YgcGF0aFxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgLy8gdW5peCBwYXRo4oCmXG4gICAgICAgIHBhdGggPSBwYXRoXzEuc2VwICsgcGF0aDtcbiAgICB9XG4gICAgcmV0dXJuIGhvc3QgKyBwYXRoO1xufVxubW9kdWxlLmV4cG9ydHMgPSBmaWxlVXJpVG9QYXRoO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiaW1wb3J0IHsgUGx1Z2luLCBNYXJrZG93blZpZXcgfSBmcm9tICdvYnNpZGlhbic7XG5pbXBvcnQgeyBjbGlwYm9hcmQgfSBmcm9tICdlbGVjdHJvbic7XG5pbXBvcnQgZmlsZVVyaVRvUGF0aCBmcm9tICdmaWxlLXVyaS10by1wYXRoJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmlsZVBhdGhUb1VyaSBleHRlbmRzIFBsdWdpbiB7XG5cdGFzeW5jIG9ubG9hZCgpIHtcblx0XHRjb25zb2xlLmxvZygnTG9hZGluZyBwbHVnaW4gRmlsZVBhdGhUb1VyaS4uLicpO1xuXG5cdFx0dGhpcy5hZGRDb21tYW5kKHtcblx0XHRcdGlkOiAndG9nZ2xlLWZpbGUtcGF0aC10by11cmknLFxuXHRcdFx0bmFtZTogJ1RvZ2dsZSBzZWxlY3RlZCBmaWxlIHBhdGggdG8gVVJJIGFuZCBiYWNrJyxcblx0XHRcdGNoZWNrQ2FsbGJhY2s6IChjaGVja2luZzogYm9vbGVhbikgPT4ge1xuXHRcdFx0XHRpZiAodGhpcy5nZXRFZGl0b3IoKSA9PT0gbnVsbCkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICghY2hlY2tpbmcpIHtcblx0XHRcdFx0XHR0aGlzLnRvZ2dsZUxpbmsoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fSxcblx0XHRcdGhvdGtleXM6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdG1vZGlmaWVyczogWydNb2QnLCAnQWx0J10sXG5cdFx0XHRcdFx0a2V5OiAnTCcsXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0pO1xuXG5cdFx0dGhpcy5hZGRDb21tYW5kKHtcblx0XHRcdGlkOiAncGFzdGUtZmlsZS1wYXRoLWFzLWZpbGUtdXJpJyxcblx0XHRcdG5hbWU6ICdQYXN0ZSBmaWxlIHBhdGggYXMgZmlsZSB1cmknLFxuXHRcdFx0Y2hlY2tDYWxsYmFjazogKGNoZWNraW5nOiBib29sZWFuKSA9PiB7XG5cdFx0XHRcdGlmICh0aGlzLmdldEVkaXRvcigpID09PSBudWxsKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCFjaGVja2luZykge1xuXHRcdFx0XHRcdHRoaXMucGFzdGVBc1VyaSgpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9LFxuXHRcdFx0aG90a2V5czogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0bW9kaWZpZXJzOiBbJ01vZCcsICdBbHQnLCAnU2hpZnQnXSxcblx0XHRcdFx0XHRrZXk6ICdMJyxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSk7XG5cdH1cblxuXHRnZXRFZGl0b3IoKSB7XG5cdFx0Y29uc3QgdmlldyA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG5cdFx0aWYgKCF2aWV3IHx8IHZpZXcuZ2V0TW9kZSgpICE9PSAnc291cmNlJykge1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHZpZXcuc291cmNlTW9kZS5jbUVkaXRvcjtcblx0fVxuXG5cdHBhc3RlQXNVcmkoKSB7XG5cdFx0bGV0IGVkaXRvciA9IHRoaXMuZ2V0RWRpdG9yKCk7XG5cdFx0aWYgKGVkaXRvciA9PSBudWxsKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0bGV0IGNsaXBib2FyZFRleHQgPSBjbGlwYm9hcmQucmVhZFRleHQoJ2NsaXBib2FyZCcpO1xuXHRcdGlmICghY2xpcGJvYXJkVGV4dCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNsaXBib2FyZFRleHQgPSB0aGlzLmNsZWFudXBUZXh0KGNsaXBib2FyZFRleHQpO1xuXG5cdFx0Ly8gUGFzdGUgdGhlIHRleHQgYXMgdXN1YWwgaWYgaXQncyBub3QgZmlsZSBwYXRoXG5cdFx0aWYgKGNsaXBib2FyZFRleHQuc3RhcnRzV2l0aCgnZmlsZTonKSB8fCAhdGhpcy5oYXNTbGFzaGVzKGNsaXBib2FyZFRleHQpKSB7XG5cdFx0XHRlZGl0b3IucmVwbGFjZVNlbGVjdGlvbihjbGlwYm9hcmRUZXh0LCAnYXJvdW5kJyk7XG5cdFx0fVxuXG5cdFx0Ly8gbmV0d29yayBwYXRoICdcXFxccGF0aCdcblx0XHRpZiAoY2xpcGJvYXJkVGV4dC5zdGFydHNXaXRoKCdcXFxcXFxcXCcpKSB7XG5cdFx0XHRsZXQgZW5kc1dpdGhTbGFzaCA9XG5cdFx0XHRcdGNsaXBib2FyZFRleHQuZW5kc1dpdGgoJ1xcXFwnKSB8fCBjbGlwYm9hcmRUZXh0LmVuZHNXaXRoKCcvJyk7XG5cdFx0XHQvLyBVUkwgdGhyb3dzIGVycm9yIG9uIGludmFsaWQgdXJsXG5cdFx0XHR0cnkge1xuXHRcdFx0XHRsZXQgdXJsID0gbmV3IFVSTChjbGlwYm9hcmRUZXh0KTtcblxuXHRcdFx0XHRsZXQgbGluayA9IHVybC5ocmVmLnJlcGxhY2UoJ2ZpbGU6Ly8nLCAnZmlsZTovLy8lNUMlNUMnKTtcblx0XHRcdFx0aWYgKGxpbmsuZW5kc1dpdGgoJy8nKSAmJiAhZW5kc1dpdGhTbGFzaCkge1xuXHRcdFx0XHRcdGxpbmsgPSBsaW5rLnNsaWNlKDAsIC0xKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGVkaXRvci5yZXBsYWNlU2VsZWN0aW9uKGxpbmssICdhcm91bmQnKTtcblx0XHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdH1cblx0XHQvLyBwYXRoIEM6XFxVc2Vyc1xcIG9yIFxcU3lzdGVtXFxldGNcblx0XHRlbHNlIHtcblx0XHRcdGlmICghdGhpcy5oYXNTbGFzaGVzKGNsaXBib2FyZFRleHQpKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gVVJMIHRocm93cyBlcnJvciBvbiBpbnZhbGlkIHVybFxuXHRcdFx0dHJ5IHtcblx0XHRcdFx0bGV0IHVybCA9IG5ldyBVUkwoJ2ZpbGU6Ly8nICsgY2xpcGJvYXJkVGV4dCk7XG5cdFx0XHRcdGVkaXRvci5yZXBsYWNlU2VsZWN0aW9uKHVybC5ocmVmLCAnYXJvdW5kJyk7XG5cdFx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogRG9lcyB0aGUgdGV4dCBoYXZlIGFueSAnXFwnIG9yICcvJz9cblx0ICovXG5cdGhhc1NsYXNoZXModGV4dDogc3RyaW5nKSB7XG5cdFx0Ly8gRG9lcyBpdCBoYXZlIGFueSAnXFwnIG9yICcvJz9cblx0XHRjb25zdCByZWdleEhhc0FueVNsYXNoID0gLy4qKFtcXFxcXFwvXSkuKi9nO1xuXG5cdFx0aWYgKHR5cGVvZiB0ZXh0ICE9PSAnc3RyaW5nJykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdGxldCBtYXRjaGVzID0gdGV4dC5tYXRjaChyZWdleEhhc0FueVNsYXNoKTtcblx0XHRyZXR1cm4gISFtYXRjaGVzO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRyaW0gd2hpdGVzcGFjZSBhbmQgcmVtb3ZlIHN1cnJvdW5kaW5nIFwiXG5cdCAqL1xuXHRjbGVhbnVwVGV4dCh0ZXh0OiBzdHJpbmcpIHtcblx0XHRpZiAodHlwZW9mIHRleHQgIT09ICdzdHJpbmcnKSB7XG5cdFx0XHRyZXR1cm4gJyc7XG5cdFx0fVxuXG5cdFx0dGV4dCA9IHRleHQudHJpbSgpO1xuXG5cdFx0Ly8gUmVtb3ZlIHN1cnJvdW5kaW5nIFwiXG5cdFx0aWYgKHRleHQuc3RhcnRzV2l0aCgnXCInKSkge1xuXHRcdFx0dGV4dCA9IHRleHQuc3Vic3RyKDEpO1xuXHRcdH1cblx0XHRpZiAodGV4dC5lbmRzV2l0aCgnXCInKSkge1xuXHRcdFx0dGV4dCA9IHRleHQuc3Vic3RyKDAsIHRleHQubGVuZ3RoIC0gMSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRleHQ7XG5cdH1cblxuXHR0b2dnbGVMaW5rKCkge1xuXHRcdGxldCBlZGl0b3IgPSB0aGlzLmdldEVkaXRvcigpO1xuXHRcdGlmIChlZGl0b3IgPT0gbnVsbCB8fCAhZWRpdG9yLnNvbWV0aGluZ1NlbGVjdGVkKCkpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRsZXQgc2VsZWN0ZWRUZXh0ID0gZWRpdG9yLmdldFNlbGVjdGlvbigpO1xuXHRcdHNlbGVjdGVkVGV4dCA9IHRoaXMuY2xlYW51cFRleHQoc2VsZWN0ZWRUZXh0KTtcblxuXHRcdC8vIGZpbGUgdXJsIGZvciBuZXR3b3JrIGxvY2F0aW9uIGZpbGU6Ly9cXFxcbG9jYXRpb25cblx0XHQvLyBXb3JrcyBmb3IgYm90aCAnZmlsZTovLy9cXFxccGF0aCcgYW5kICdmaWxlOi8vLyU1QyU1Q3BhdGgnXG5cdFx0Ly8gT2JzaWRpYW4gdXNlcyBlc2NhcGUgY2hhcnMgaW4gbGluayBzbyBgZmlsZTovLy9cXFxcbG9jYXRpb25gIHdpbGwgdHJ5IHRvIG9wZW4gYGZpbGU6Ly8vXFxsb2NhdGlvbiBpbnN0ZWFkXG5cdFx0Ly8gQnV0IHRoZSBzZWxlY3RlZCB0ZXh0IHdlIGdldCBjb250YWlucyB0aGUgZnVsbCBzdHJpbmcsIHRodXMgdGhlIHRlc3QgZm9yIGJvdGggMiBhbmQgNCAnXFwnIGNoYXJzXG5cdFx0aWYgKFxuXHRcdFx0c2VsZWN0ZWRUZXh0LnN0YXJ0c1dpdGgoJ2ZpbGU6Ly8vXFxcXFxcXFwnKSB8fFxuXHRcdFx0c2VsZWN0ZWRUZXh0LnN0YXJ0c1dpdGgoJ2ZpbGU6Ly8vXFxcXFxcXFxcXFxcXFxcXCcpIHx8XG5cdFx0XHRzZWxlY3RlZFRleHQuc3RhcnRzV2l0aCgnZmlsZTovLy8lNUMlNUMnKVxuXHRcdCkge1xuXHRcdFx0Ly8gbm9ybWFsaXplIHRvICdmaWxlOi8vLydcblx0XHRcdHNlbGVjdGVkVGV4dCA9IHNlbGVjdGVkVGV4dC5yZXBsYWNlKCdmaWxlOi8vL1xcXFxcXFxcXFxcXFxcXFwnLCAnZmlsZTovLy8nKTtcblx0XHRcdHNlbGVjdGVkVGV4dCA9IHNlbGVjdGVkVGV4dC5yZXBsYWNlKCdmaWxlOi8vL1xcXFxcXFxcJywgJ2ZpbGU6Ly8vJyk7XG5cdFx0XHRzZWxlY3RlZFRleHQgPSBzZWxlY3RlZFRleHQucmVwbGFjZSgnZmlsZTovLy8lNUMlNUMnLCAnZmlsZTovLy8nKTtcblxuXHRcdFx0bGV0IHVybCA9IGZpbGVVcmlUb1BhdGgoc2VsZWN0ZWRUZXh0KTtcblxuXHRcdFx0aWYgKHVybCkge1xuXHRcdFx0XHQvLyBmaWxlVXJpVG9QYXRoIHJldHVybnMgb25seSBzaW5nbGUgbGVhZGluZyAnXFwnIHNvIHdlIG5lZWQgdG8gYWRkIHRoZSBzZWNvbmQgb25lXG5cdFx0XHRcdGVkaXRvci5yZXBsYWNlU2VsZWN0aW9uKCdcXFxcJyArIHVybCwgJ2Fyb3VuZCcpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHQvLyBmaWxlIGxpbmsgZmlsZTovLy9DOi9Vc2Vyc1xuXHRcdGVsc2UgaWYgKHNlbGVjdGVkVGV4dC5zdGFydHNXaXRoKCdmaWxlOi8vLycpKSB7XG5cdFx0XHRsZXQgdXJsID0gZmlsZVVyaVRvUGF0aChzZWxlY3RlZFRleHQpO1xuXG5cdFx0XHRpZiAodXJsKSB7XG5cdFx0XHRcdGVkaXRvci5yZXBsYWNlU2VsZWN0aW9uKHVybCwgJ2Fyb3VuZCcpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHQvLyBuZXR3b3JrIHBhdGggJ1xcXFxwYXRoJ1xuXHRcdGVsc2UgaWYgKHNlbGVjdGVkVGV4dC5zdGFydHNXaXRoKCdcXFxcXFxcXCcpKSB7XG5cdFx0XHRsZXQgZW5kc1dpdGhTbGFzaCA9XG5cdFx0XHRcdHNlbGVjdGVkVGV4dC5lbmRzV2l0aCgnXFxcXCcpIHx8IHNlbGVjdGVkVGV4dC5lbmRzV2l0aCgnLycpO1xuXHRcdFx0Ly8gVVJMIHRocm93cyBlcnJvciBvbiBpbnZhbGlkIHVybFxuXHRcdFx0dHJ5IHtcblx0XHRcdFx0bGV0IHVybCA9IG5ldyBVUkwoc2VsZWN0ZWRUZXh0KTtcblxuXHRcdFx0XHRsZXQgbGluayA9IHVybC5ocmVmLnJlcGxhY2UoJ2ZpbGU6Ly8nLCAnZmlsZTovLy8lNUMlNUMnKTtcblx0XHRcdFx0aWYgKGxpbmsuZW5kc1dpdGgoJy8nKSAmJiAhZW5kc1dpdGhTbGFzaCkge1xuXHRcdFx0XHRcdGxpbmsgPSBsaW5rLnNsaWNlKDAsIC0xKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGVkaXRvci5yZXBsYWNlU2VsZWN0aW9uKGxpbmssICdhcm91bmQnKTtcblx0XHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdH1cblx0XHQvLyBwYXRoIEM6XFxVc2Vyc1xcIG9yIFxcU3lzdGVtXFxldGNcblx0XHRlbHNlIHtcblx0XHRcdGlmICghdGhpcy5oYXNTbGFzaGVzKHNlbGVjdGVkVGV4dCkpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBVUkwgdGhyb3dzIGVycm9yIG9uIGludmFsaWQgdXJsXG5cdFx0XHR0cnkge1xuXHRcdFx0XHRsZXQgdXJsID0gbmV3IFVSTCgnZmlsZTovLycgKyBzZWxlY3RlZFRleHQpO1xuXHRcdFx0XHRlZGl0b3IucmVwbGFjZVNlbGVjdGlvbih1cmwuaHJlZiwgJ2Fyb3VuZCcpO1xuXHRcdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0b251bmxvYWQoKSB7XG5cdFx0Y29uc29sZS5sb2coJ1VubG9hZGluZyBwbHVnaW4gRmlsZVBhdGhUb1VyaS4uLicpO1xuXHR9XG59XG4iXSwibmFtZXMiOlsicGF0aF8xIiwiTWFya2Rvd25WaWV3IiwiY2xpcGJvYXJkIiwiZmlsZVVyaVRvUGF0aCIsIlBsdWdpbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxhQUFhLEdBQUcsU0FBUyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ25DLElBQUksYUFBYSxHQUFHLE1BQU0sQ0FBQyxjQUFjO0FBQ3pDLFNBQVMsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFLFlBQVksS0FBSyxJQUFJLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUNwRixRQUFRLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUMxRyxJQUFJLE9BQU8sYUFBYSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUMvQixDQUFDLENBQUM7QUFDRjtBQUNPLFNBQVMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDaEMsSUFBSSxJQUFJLE9BQU8sQ0FBQyxLQUFLLFVBQVUsSUFBSSxDQUFDLEtBQUssSUFBSTtBQUM3QyxRQUFRLE1BQU0sSUFBSSxTQUFTLENBQUMsc0JBQXNCLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLCtCQUErQixDQUFDLENBQUM7QUFDbEcsSUFBSSxhQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3hCLElBQUksU0FBUyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxFQUFFO0FBQzNDLElBQUksQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLEtBQUssSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztBQUN6RixDQUFDO0FBdUNEO0FBQ08sU0FBUyxTQUFTLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFO0FBQzdELElBQUksU0FBUyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsT0FBTyxLQUFLLFlBQVksQ0FBQyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxVQUFVLE9BQU8sRUFBRSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFO0FBQ2hILElBQUksT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsT0FBTyxDQUFDLEVBQUUsVUFBVSxPQUFPLEVBQUUsTUFBTSxFQUFFO0FBQy9ELFFBQVEsU0FBUyxTQUFTLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtBQUNuRyxRQUFRLFNBQVMsUUFBUSxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtBQUN0RyxRQUFRLFNBQVMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLE1BQU0sQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFBRTtBQUN0SCxRQUFRLElBQUksQ0FBQyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxVQUFVLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUM5RSxLQUFLLENBQUMsQ0FBQztBQUNQLENBQUM7QUFDRDtBQUNPLFNBQVMsV0FBVyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUU7QUFDM0MsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3JILElBQUksT0FBTyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLE9BQU8sTUFBTSxLQUFLLFVBQVUsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLFdBQVcsRUFBRSxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDN0osSUFBSSxTQUFTLElBQUksQ0FBQyxDQUFDLEVBQUUsRUFBRSxPQUFPLFVBQVUsQ0FBQyxFQUFFLEVBQUUsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUN0RSxJQUFJLFNBQVMsSUFBSSxDQUFDLEVBQUUsRUFBRTtBQUN0QixRQUFRLElBQUksQ0FBQyxFQUFFLE1BQU0sSUFBSSxTQUFTLENBQUMsaUNBQWlDLENBQUMsQ0FBQztBQUN0RSxRQUFRLE9BQU8sQ0FBQyxFQUFFLElBQUk7QUFDdEIsWUFBWSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztBQUN6SyxZQUFZLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDcEQsWUFBWSxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDekIsZ0JBQWdCLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLE1BQU07QUFDOUMsZ0JBQWdCLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQztBQUN4RSxnQkFBZ0IsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUztBQUNqRSxnQkFBZ0IsS0FBSyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsU0FBUztBQUNqRSxnQkFBZ0I7QUFDaEIsb0JBQW9CLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUU7QUFDaEksb0JBQW9CLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUU7QUFDMUcsb0JBQW9CLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRTtBQUN6RixvQkFBb0IsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFO0FBQ3ZGLG9CQUFvQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFDLG9CQUFvQixDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsU0FBUztBQUMzQyxhQUFhO0FBQ2IsWUFBWSxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdkMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO0FBQ2xFLFFBQVEsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQztBQUN6RixLQUFLO0FBQ0w7O0FDdkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxhQUFhLENBQUMsR0FBRyxFQUFFO0FBQzVCLElBQUksSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRO0FBQy9CLFFBQVEsR0FBRyxDQUFDLE1BQU0sSUFBSSxDQUFDO0FBQ3ZCLFFBQVEsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssU0FBUyxFQUFFO0FBQzNDLFFBQVEsTUFBTSxJQUFJLFNBQVMsQ0FBQyxzREFBc0QsQ0FBQyxDQUFDO0FBQ3BGLEtBQUs7QUFDTCxJQUFJLE1BQU0sSUFBSSxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDN0MsSUFBSSxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3pDLElBQUksSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDN0MsSUFBSSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksSUFBSSxJQUFJLEtBQUssV0FBVyxFQUFFO0FBQzlCLFFBQVEsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNsQixLQUFLO0FBQ0wsSUFBSSxJQUFJLElBQUksRUFBRTtBQUNkLFFBQVEsSUFBSSxHQUFHQSwwQkFBTSxDQUFDLEdBQUcsR0FBR0EsMEJBQU0sQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDO0FBQzlDLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzFDO0FBQ0EsSUFBSSxJQUFJQSwwQkFBTSxDQUFDLEdBQUcsS0FBSyxJQUFJLEVBQUU7QUFDN0IsUUFBUSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDekMsS0FBSztBQUNMLElBQUksSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBRXRCO0FBQ0wsU0FBUztBQUNUO0FBQ0EsUUFBUSxJQUFJLEdBQUdBLDBCQUFNLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQztBQUNqQyxLQUFLO0FBQ0wsSUFBSSxPQUFPLElBQUksR0FBRyxJQUFJLENBQUM7QUFDdkIsQ0FBQztBQUNELE9BQWMsR0FBRyxhQUFhOzs7SUM5Q2EsaUNBQU07SUFBakQ7O0tBNk5DO0lBNU5NLDhCQUFNLEdBQVo7Ozs7Z0JBQ0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO2dCQUUvQyxJQUFJLENBQUMsVUFBVSxDQUFDO29CQUNmLEVBQUUsRUFBRSx5QkFBeUI7b0JBQzdCLElBQUksRUFBRSwyQ0FBMkM7b0JBQ2pELGFBQWEsRUFBRSxVQUFDLFFBQWlCO3dCQUNoQyxJQUFJLEtBQUksQ0FBQyxTQUFTLEVBQUUsS0FBSyxJQUFJLEVBQUU7NEJBQzlCLE9BQU87eUJBQ1A7d0JBRUQsSUFBSSxDQUFDLFFBQVEsRUFBRTs0QkFDZCxLQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7eUJBQ2xCO3dCQUVELE9BQU8sSUFBSSxDQUFDO3FCQUNaO29CQUNELE9BQU8sRUFBRTt3QkFDUjs0QkFDQyxTQUFTLEVBQUUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDOzRCQUN6QixHQUFHLEVBQUUsR0FBRzt5QkFDUjtxQkFDRDtpQkFDRCxDQUFDLENBQUM7Z0JBRUgsSUFBSSxDQUFDLFVBQVUsQ0FBQztvQkFDZixFQUFFLEVBQUUsNkJBQTZCO29CQUNqQyxJQUFJLEVBQUUsNkJBQTZCO29CQUNuQyxhQUFhLEVBQUUsVUFBQyxRQUFpQjt3QkFDaEMsSUFBSSxLQUFJLENBQUMsU0FBUyxFQUFFLEtBQUssSUFBSSxFQUFFOzRCQUM5QixPQUFPO3lCQUNQO3dCQUVELElBQUksQ0FBQyxRQUFRLEVBQUU7NEJBQ2QsS0FBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO3lCQUNsQjt3QkFFRCxPQUFPLElBQUksQ0FBQztxQkFDWjtvQkFDRCxPQUFPLEVBQUU7d0JBQ1I7NEJBQ0MsU0FBUyxFQUFFLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUM7NEJBQ2xDLEdBQUcsRUFBRSxHQUFHO3lCQUNSO3FCQUNEO2lCQUNELENBQUMsQ0FBQzs7OztLQUNIO0lBRUQsaUNBQVMsR0FBVDtRQUNDLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLG1CQUFtQixDQUFDQyxxQkFBWSxDQUFDLENBQUM7UUFDbEUsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFLEtBQUssUUFBUSxFQUFFO1lBQ3pDLE9BQU8sSUFBSSxDQUFDO1NBQ1o7UUFFRCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDO0tBQ2hDO0lBRUQsa0NBQVUsR0FBVjtRQUNDLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUM5QixJQUFJLE1BQU0sSUFBSSxJQUFJLEVBQUU7WUFDbkIsT0FBTztTQUNQO1FBRUQsSUFBSSxhQUFhLEdBQUdDLGtCQUFTLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3BELElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDbkIsT0FBTztTQUNQO1FBRUQsYUFBYSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7O1FBR2hELElBQUksYUFBYSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLEVBQUU7WUFDekUsTUFBTSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQztTQUNqRDs7UUFHRCxJQUFJLGFBQWEsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDckMsSUFBSSxhQUFhLEdBQ2hCLGFBQWEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksYUFBYSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7WUFFN0QsSUFBSTtnQkFDSCxJQUFJLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFFakMsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLGdCQUFnQixDQUFDLENBQUM7Z0JBQ3pELElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRTtvQkFDekMsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ3pCO2dCQUVELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7YUFDeEM7WUFBQyxPQUFPLENBQUMsRUFBRTtnQkFDWCxPQUFPO2FBQ1A7U0FDRDs7YUFFSTtZQUNKLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxFQUFFO2dCQUNwQyxPQUFPO2FBQ1A7O1lBR0QsSUFBSTtnQkFDSCxJQUFJLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxTQUFTLEdBQUcsYUFBYSxDQUFDLENBQUM7Z0JBQzdDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO2FBQzVDO1lBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ1gsT0FBTzthQUNQO1NBQ0Q7S0FDRDs7OztJQUtELGtDQUFVLEdBQVYsVUFBVyxJQUFZOztRQUV0QixJQUFNLGdCQUFnQixHQUFHLGVBQWUsQ0FBQztRQUV6QyxJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsRUFBRTtZQUM3QixPQUFPLEtBQUssQ0FBQztTQUNiO1FBRUQsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQzNDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQztLQUNqQjs7OztJQUtELG1DQUFXLEdBQVgsVUFBWSxJQUFZO1FBQ3ZCLElBQUksT0FBTyxJQUFJLEtBQUssUUFBUSxFQUFFO1lBQzdCLE9BQU8sRUFBRSxDQUFDO1NBQ1Y7UUFFRCxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDOztRQUduQixJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDekIsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDdEI7UUFDRCxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDdkIsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDdkM7UUFFRCxPQUFPLElBQUksQ0FBQztLQUNaO0lBRUQsa0NBQVUsR0FBVjtRQUNDLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUM5QixJQUFJLE1BQU0sSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsaUJBQWlCLEVBQUUsRUFBRTtZQUNsRCxPQUFPO1NBQ1A7UUFFRCxJQUFJLFlBQVksR0FBRyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDekMsWUFBWSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUM7Ozs7O1FBTTlDLElBQ0MsWUFBWSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUM7WUFDdkMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQztZQUMzQyxZQUFZLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLEVBQ3hDOztZQUVELFlBQVksR0FBRyxZQUFZLENBQUMsT0FBTyxDQUFDLGtCQUFrQixFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQ3BFLFlBQVksR0FBRyxZQUFZLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxVQUFVLENBQUMsQ0FBQztZQUNoRSxZQUFZLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxVQUFVLENBQUMsQ0FBQztZQUVsRSxJQUFJLEdBQUcsR0FBR0MsR0FBYSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBRXRDLElBQUksR0FBRyxFQUFFOztnQkFFUixNQUFNLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxHQUFHLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQzthQUM5QztTQUNEOzthQUVJLElBQUksWUFBWSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUM3QyxJQUFJLEdBQUcsR0FBR0EsR0FBYSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBRXRDLElBQUksR0FBRyxFQUFFO2dCQUNSLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7YUFDdkM7U0FDRDs7YUFFSSxJQUFJLFlBQVksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDekMsSUFBSSxhQUFhLEdBQ2hCLFlBQVksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksWUFBWSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7WUFFM0QsSUFBSTtnQkFDSCxJQUFJLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFFaEMsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLGdCQUFnQixDQUFDLENBQUM7Z0JBQ3pELElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRTtvQkFDekMsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ3pCO2dCQUVELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7YUFDeEM7WUFBQyxPQUFPLENBQUMsRUFBRTtnQkFDWCxPQUFPO2FBQ1A7U0FDRDs7YUFFSTtZQUNKLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxFQUFFO2dCQUNuQyxPQUFPO2FBQ1A7O1lBR0QsSUFBSTtnQkFDSCxJQUFJLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxTQUFTLEdBQUcsWUFBWSxDQUFDLENBQUM7Z0JBQzVDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO2FBQzVDO1lBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ1gsT0FBTzthQUNQO1NBQ0Q7S0FDRDtJQUVELGdDQUFRLEdBQVI7UUFDQyxPQUFPLENBQUMsR0FBRyxDQUFDLG1DQUFtQyxDQUFDLENBQUM7S0FDakQ7SUFDRixvQkFBQztBQUFELENBN05BLENBQTJDQyxlQUFNOzs7OyJ9
