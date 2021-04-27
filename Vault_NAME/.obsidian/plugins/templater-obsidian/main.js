'use strict';

var obsidian = require('obsidian');
var fs = require('fs');
var path = require('path');
var child_process = require('child_process');
var util = require('util');

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () {
                        return e[k];
                    }
                });
            }
        });
    }
    n['default'] = e;
    return Object.freeze(n);
}

var obsidian__namespace = /*#__PURE__*/_interopNamespace(obsidian);
var path__namespace = /*#__PURE__*/_interopNamespace(path);

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

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

const DEFAULT_SETTINGS = {
    command_timeout: 5,
    template_folder: "",
    templates_pairs: [["", ""]],
    trigger_on_file_creation: false,
    enable_system_commands: false,
    shell_path: "",
};
class TemplaterSettingTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.app = app;
        this.plugin = plugin;
    }
    display() {
        let { containerEl } = this;
        let desc;
        containerEl.empty();
        new obsidian.Setting(containerEl)
            .setName("Template folder location")
            .setDesc("Files in this folder will be available as templates.")
            .addText(text => {
            text.setPlaceholder("Example: folder 1/folder 2")
                .setValue(this.plugin.settings.template_folder)
                .onChange((new_folder) => {
                this.plugin.settings.template_folder = new_folder;
                this.plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Timeout")
            .setDesc("Maximum timeout in seconds for a system command.")
            .addText(text => {
            text.setPlaceholder("Timeout")
                .setValue(this.plugin.settings.command_timeout.toString())
                .onChange((new_value) => {
                let new_timeout = Number(new_value);
                if (isNaN(new_timeout)) {
                    this.plugin.log_error("Timeout must be a number");
                    return;
                }
                this.plugin.settings.command_timeout = new_timeout;
                this.plugin.saveSettings();
            });
        });
        desc = document.createDocumentFragment();
        desc.append("Templater provides multiples predefined variables / functions that you can use.", desc.createEl("br"), "Check the ", desc.createEl("a", {
            href: "https://silentvoid13.github.io/Templater/",
            text: "documentation"
        }), " to get a list of all the available internal variables / functions.");
        new obsidian.Setting(containerEl)
            .setName("Internal Variables and Functions")
            .setDesc(desc);
        desc = document.createDocumentFragment();
        desc.append("Templater will listen for the new file creation event, and replace every command it finds in the new file's content.", desc.createEl("br"), "This makes Templater compatible with other plugins like the Daily note core plugin, Calendar plugin, Review plugin, Note refactor plugin, ...", desc.createEl("br"), desc.createEl("b", {
            text: "Warning: ",
        }), "This can be dangerous if you create new files with unknown / unsafe content on creation. Make sure that every new file's content is safe on creation.");
        new obsidian.Setting(containerEl)
            .setName("Trigger Templater on new file creation")
            .setDesc(desc)
            .addToggle(toggle => {
            toggle
                .setValue(this.plugin.settings.trigger_on_file_creation)
                .onChange(trigger_on_file_creation => {
                this.plugin.settings.trigger_on_file_creation = trigger_on_file_creation;
                this.plugin.saveSettings();
                this.plugin.update_trigger_file_on_creation();
            });
        });
        desc = document.createDocumentFragment();
        desc.append("Allows you to create user functions linked to system commands.", desc.createEl("br"), desc.createEl("b", {
            text: "Warning: "
        }), "It can be dangerous to execute arbitrary system commands from untrusted sources. Only run system commands that you understand, from trusted sources.");
        new obsidian.Setting(containerEl)
            .setName("Enable System Commands")
            .setDesc(desc)
            .addToggle(toggle => {
            toggle
                .setValue(this.plugin.settings.enable_system_commands)
                .onChange(enable_system_commands => {
                this.plugin.settings.enable_system_commands = enable_system_commands;
                this.plugin.saveSettings();
                // Force refresh
                this.display();
            });
        });
        if (this.plugin.settings.enable_system_commands) {
            desc = document.createDocumentFragment();
            desc.append("Full path to the shell binary to execute the command with.", desc.createEl("br"), "This setting is optional and will default to the system's default shell if not specified.", desc.createEl("br"), "You can use forward slashes ('/') as path separators on all platforms if in doubt.");
            new obsidian.Setting(containerEl)
                .setName("Shell binary location")
                .setDesc(desc)
                .addText(text => {
                text.setPlaceholder("Example: /bin/bash, ...")
                    .setValue(this.plugin.settings.shell_path)
                    .onChange((shell_path) => {
                    this.plugin.settings.shell_path = shell_path;
                    this.plugin.saveSettings();
                });
            });
            let i = 1;
            this.plugin.settings.templates_pairs.forEach((template_pair) => {
                let div = containerEl.createEl('div');
                div.addClass("templater_div");
                let title = containerEl.createEl('h4', {
                    text: 'User Function n°' + i,
                });
                title.addClass("templater_title");
                let setting = new obsidian.Setting(containerEl)
                    .addExtraButton(extra => {
                    extra.setIcon("cross")
                        .setTooltip("Delete")
                        .onClick(() => {
                        let index = this.plugin.settings.templates_pairs.indexOf(template_pair);
                        if (index > -1) {
                            this.plugin.settings.templates_pairs.splice(index, 1);
                            // Force refresh
                            this.plugin.saveSettings();
                            this.display();
                        }
                    });
                })
                    .addText(text => {
                    let t = text.setPlaceholder('Function name')
                        .setValue(template_pair[0])
                        .onChange((new_value) => {
                        let index = this.plugin.settings.templates_pairs.indexOf(template_pair);
                        if (index > -1) {
                            this.plugin.settings.templates_pairs[index][0] = new_value;
                            this.plugin.saveSettings();
                        }
                    });
                    t.inputEl.addClass("templater_template");
                    return t;
                })
                    .addTextArea(text => {
                    let t = text.setPlaceholder('System Command')
                        .setValue(template_pair[1])
                        .onChange((new_cmd) => {
                        let index = this.plugin.settings.templates_pairs.indexOf(template_pair);
                        if (index > -1) {
                            this.plugin.settings.templates_pairs[index][1] = new_cmd;
                            this.plugin.saveSettings();
                        }
                    });
                    t.inputEl.setAttr("rows", 4);
                    t.inputEl.addClass("templater_cmd");
                    return t;
                });
                setting.infoEl.remove();
                div.appendChild(title);
                div.appendChild(containerEl.lastChild);
                i += 1;
            });
            let div = containerEl.createEl('div');
            div.addClass("templater_div2");
            let setting = new obsidian.Setting(containerEl)
                .addButton(button => {
                let b = button.setButtonText("Add New User Function").onClick(() => {
                    this.plugin.settings.templates_pairs.push(["", ""]);
                    // Force refresh
                    this.display();
                });
                b.buttonEl.addClass("templater_button");
                return b;
            });
            setting.infoEl.remove();
            div.appendChild(containerEl.lastChild);
        }
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function escapeRegExp$1(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
function getTFilesFromFolder(app, folder_str) {
    folder_str = obsidian.normalizePath(folder_str);
    let folder = app.vault.getAbstractFileByPath(folder_str);
    if (!folder) {
        throw new Error(`${folder_str} folder doesn't exist`);
    }
    if (!(folder instanceof obsidian.TFolder)) {
        throw new Error(`${folder_str} is a file, not a folder`);
    }
    let files = [];
    obsidian.Vault.recurseChildren(folder, (file) => {
        if (file instanceof obsidian.TFile) {
            files.push(file);
        }
    });
    files.sort((a, b) => {
        return a.basename.localeCompare(b.basename);
    });
    return files;
}

var OpenMode;
(function (OpenMode) {
    OpenMode[OpenMode["InsertTemplate"] = 0] = "InsertTemplate";
    OpenMode[OpenMode["CreateNoteTemplate"] = 1] = "CreateNoteTemplate";
})(OpenMode || (OpenMode = {}));
class TemplaterFuzzySuggestModal extends obsidian.FuzzySuggestModal {
    constructor(app, plugin) {
        super(app);
        this.app = app;
        this.plugin = plugin;
    }
    getItems() {
        let template_files = [];
        if (this.plugin.settings.template_folder === "") {
            template_files = this.app.vault.getMarkdownFiles();
        }
        else {
            template_files = getTFilesFromFolder(this.app, this.plugin.settings.template_folder);
        }
        return template_files;
    }
    getItemText(item) {
        return item.basename;
    }
    onChooseItem(item, _evt) {
        switch (this.open_mode) {
            case OpenMode.InsertTemplate:
                this.plugin.parser.replace_templates_and_append(item);
                break;
            case OpenMode.CreateNoteTemplate:
                this.plugin.parser.create_new_note_from_template(item, this.creation_folder);
                break;
        }
    }
    start() {
        try {
            let files = this.getItems();
            // If there is only one file in the templates directory, we don't open the modal
            if (files.length === 1) {
                this.onChooseItem(files[0], null);
            }
            else {
                this.open();
            }
        }
        catch (error) {
            this.plugin.log_error(error);
        }
    }
    insert_template() {
        this.open_mode = OpenMode.InsertTemplate;
        this.start();
    }
    create_new_note_from_template(folder) {
        this.creation_folder = folder;
        this.open_mode = OpenMode.CreateNoteTemplate;
        this.start();
    }
}

function setPrototypeOf(obj, proto) {
    // eslint-disable-line @typescript-eslint/no-explicit-any
    if (Object.setPrototypeOf) {
        Object.setPrototypeOf(obj, proto);
    }
    else {
        obj.__proto__ = proto;
    }
}
// This is pretty much the only way to get nice, extended Errors
// without using ES6
/**
 * This returns a new Error with a custom prototype. Note that it's _not_ a constructor
 *
 * @param message Error message
 *
 * **Example**
 *
 * ```js
 * throw EtaErr("template not found")
 * ```
 */
function EtaErr(message) {
    var err = new Error(message);
    setPrototypeOf(err, EtaErr.prototype);
    return err;
}
EtaErr.prototype = Object.create(Error.prototype, {
    name: { value: 'Eta Error', enumerable: false }
});
/**
 * Throws an EtaErr with a nicely formatted error and message showing where in the template the error occurred.
 */
function ParseErr(message, str, indx) {
    var whitespace = str.slice(0, indx).split(/\n/);
    var lineNo = whitespace.length;
    var colNo = whitespace[lineNo - 1].length + 1;
    message +=
        ' at line ' +
            lineNo +
            ' col ' +
            colNo +
            ':\n\n' +
            '  ' +
            str.split(/\n/)[lineNo - 1] +
            '\n' +
            '  ' +
            Array(colNo).join(' ') +
            '^';
    throw EtaErr(message);
}

/**
 * @returns The global Promise function
 */
var promiseImpl = new Function('return this')().Promise;
/**
 * @returns A new AsyncFunction constuctor
 */
function getAsyncFunctionConstructor() {
    try {
        return new Function('return (async function(){}).constructor')();
    }
    catch (e) {
        if (e instanceof SyntaxError) {
            throw EtaErr("This environment doesn't support async/await");
        }
        else {
            throw e;
        }
    }
}
/**
 * str.trimLeft polyfill
 *
 * @param str - Input string
 * @returns The string with left whitespace removed
 *
 */
function trimLeft(str) {
    // eslint-disable-next-line no-extra-boolean-cast
    if (!!String.prototype.trimLeft) {
        return str.trimLeft();
    }
    else {
        return str.replace(/^\s+/, '');
    }
}
/**
 * str.trimRight polyfill
 *
 * @param str - Input string
 * @returns The string with right whitespace removed
 *
 */
function trimRight(str) {
    // eslint-disable-next-line no-extra-boolean-cast
    if (!!String.prototype.trimRight) {
        return str.trimRight();
    }
    else {
        return str.replace(/\s+$/, ''); // TODO: do we really need to replace BOM's?
    }
}

// TODO: allow '-' to trim up until newline. Use [^\S\n\r] instead of \s
/* END TYPES */
function hasOwnProp(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
}
function copyProps(toObj, fromObj) {
    for (var key in fromObj) {
        if (hasOwnProp(fromObj, key)) {
            toObj[key] = fromObj[key];
        }
    }
    return toObj;
}
/**
 * Takes a string within a template and trims it, based on the preceding tag's whitespace control and `config.autoTrim`
 */
function trimWS(str, config, wsLeft, wsRight) {
    var leftTrim;
    var rightTrim;
    if (Array.isArray(config.autoTrim)) {
        // kinda confusing
        // but _}} will trim the left side of the following string
        leftTrim = config.autoTrim[1];
        rightTrim = config.autoTrim[0];
    }
    else {
        leftTrim = rightTrim = config.autoTrim;
    }
    if (wsLeft || wsLeft === false) {
        leftTrim = wsLeft;
    }
    if (wsRight || wsRight === false) {
        rightTrim = wsRight;
    }
    if (!rightTrim && !leftTrim) {
        return str;
    }
    if (leftTrim === 'slurp' && rightTrim === 'slurp') {
        return str.trim();
    }
    if (leftTrim === '_' || leftTrim === 'slurp') {
        // console.log('trimming left' + leftTrim)
        // full slurp
        str = trimLeft(str);
    }
    else if (leftTrim === '-' || leftTrim === 'nl') {
        // nl trim
        str = str.replace(/^(?:\r\n|\n|\r)/, '');
    }
    if (rightTrim === '_' || rightTrim === 'slurp') {
        // full slurp
        str = trimRight(str);
    }
    else if (rightTrim === '-' || rightTrim === 'nl') {
        // nl trim
        str = str.replace(/(?:\r\n|\n|\r)$/, ''); // TODO: make sure this gets \r\n
    }
    return str;
}
/**
 * A map of special HTML characters to their XML-escaped equivalents
 */
var escMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
};
function replaceChar(s) {
    return escMap[s];
}
/**
 * XML-escapes an input value after converting it to a string
 *
 * @param str - Input value (usually a string)
 * @returns XML-escaped string
 */
function XMLEscape(str) {
    // eslint-disable-line @typescript-eslint/no-explicit-any
    // To deal with XSS. Based on Escape implementations of Mustache.JS and Marko, then customized.
    var newStr = String(str);
    if (/[&<>"']/.test(newStr)) {
        return newStr.replace(/[&<>"']/g, replaceChar);
    }
    else {
        return newStr;
    }
}

/* END TYPES */
var templateLitReg = /`(?:\\[\s\S]|\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})*}|(?!\${)[^\\`])*`/g;
var singleQuoteReg = /'(?:\\[\s\w"'\\`]|[^\n\r'\\])*?'/g;
var doubleQuoteReg = /"(?:\\[\s\w"'\\`]|[^\n\r"\\])*?"/g;
/** Escape special regular expression characters inside a string */
function escapeRegExp(string) {
    // From MDN
    return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
function parse(str, config) {
    var buffer = [];
    var trimLeftOfNextStr = false;
    var lastIndex = 0;
    var parseOptions = config.parse;
    if (config.plugins) {
        for (var i = 0; i < config.plugins.length; i++) {
            var plugin = config.plugins[i];
            if (plugin.processTemplate) {
                str = plugin.processTemplate(str, config);
            }
        }
    }
    /* Adding for EJS compatibility */
    if (config.rmWhitespace) {
        // Code taken directly from EJS
        // Have to use two separate replaces here as `^` and `$` operators don't
        // work well with `\r` and empty lines don't work well with the `m` flag.
        // Essentially, this replaces the whitespace at the beginning and end of
        // each line and removes multiple newlines.
        str = str.replace(/[\r\n]+/g, '\n').replace(/^\s+|\s+$/gm, '');
    }
    /* End rmWhitespace option */
    templateLitReg.lastIndex = 0;
    singleQuoteReg.lastIndex = 0;
    doubleQuoteReg.lastIndex = 0;
    function pushString(strng, shouldTrimRightOfString) {
        if (strng) {
            // if string is truthy it must be of type 'string'
            strng = trimWS(strng, config, trimLeftOfNextStr, // this will only be false on the first str, the next ones will be null or undefined
            shouldTrimRightOfString);
            if (strng) {
                // replace \ with \\, ' with \'
                // we're going to convert all CRLF to LF so it doesn't take more than one replace
                strng = strng.replace(/\\|'/g, '\\$&').replace(/\r\n|\n|\r/g, '\\n');
                buffer.push(strng);
            }
        }
    }
    var prefixes = [parseOptions.exec, parseOptions.interpolate, parseOptions.raw].reduce(function (accumulator, prefix) {
        if (accumulator && prefix) {
            return accumulator + '|' + escapeRegExp(prefix);
        }
        else if (prefix) {
            // accumulator is falsy
            return escapeRegExp(prefix);
        }
        else {
            // prefix and accumulator are both falsy
            return accumulator;
        }
    }, '');
    var parseOpenReg = new RegExp('([^]*?)' + escapeRegExp(config.tags[0]) + '(-|_)?\\s*(' + prefixes + ')?\\s*', 'g');
    var parseCloseReg = new RegExp('\'|"|`|\\/\\*|(\\s*(-|_)?' + escapeRegExp(config.tags[1]) + ')', 'g');
    // TODO: benchmark having the \s* on either side vs using str.trim()
    var m;
    while ((m = parseOpenReg.exec(str))) {
        lastIndex = m[0].length + m.index;
        var precedingString = m[1];
        var wsLeft = m[2];
        var prefix = m[3] || ''; // by default either ~, =, or empty
        pushString(precedingString, wsLeft);
        parseCloseReg.lastIndex = lastIndex;
        var closeTag = void 0;
        var currentObj = false;
        while ((closeTag = parseCloseReg.exec(str))) {
            if (closeTag[1]) {
                var content = str.slice(lastIndex, closeTag.index);
                parseOpenReg.lastIndex = lastIndex = parseCloseReg.lastIndex;
                trimLeftOfNextStr = closeTag[2];
                var currentType = prefix === parseOptions.exec
                    ? 'e'
                    : prefix === parseOptions.raw
                        ? 'r'
                        : prefix === parseOptions.interpolate
                            ? 'i'
                            : '';
                currentObj = { t: currentType, val: content };
                break;
            }
            else {
                var char = closeTag[0];
                if (char === '/*') {
                    var commentCloseInd = str.indexOf('*/', parseCloseReg.lastIndex);
                    if (commentCloseInd === -1) {
                        ParseErr('unclosed comment', str, closeTag.index);
                    }
                    parseCloseReg.lastIndex = commentCloseInd;
                }
                else if (char === "'") {
                    singleQuoteReg.lastIndex = closeTag.index;
                    var singleQuoteMatch = singleQuoteReg.exec(str);
                    if (singleQuoteMatch) {
                        parseCloseReg.lastIndex = singleQuoteReg.lastIndex;
                    }
                    else {
                        ParseErr('unclosed string', str, closeTag.index);
                    }
                }
                else if (char === '"') {
                    doubleQuoteReg.lastIndex = closeTag.index;
                    var doubleQuoteMatch = doubleQuoteReg.exec(str);
                    if (doubleQuoteMatch) {
                        parseCloseReg.lastIndex = doubleQuoteReg.lastIndex;
                    }
                    else {
                        ParseErr('unclosed string', str, closeTag.index);
                    }
                }
                else if (char === '`') {
                    templateLitReg.lastIndex = closeTag.index;
                    var templateLitMatch = templateLitReg.exec(str);
                    if (templateLitMatch) {
                        parseCloseReg.lastIndex = templateLitReg.lastIndex;
                    }
                    else {
                        ParseErr('unclosed string', str, closeTag.index);
                    }
                }
            }
        }
        if (currentObj) {
            buffer.push(currentObj);
        }
        else {
            ParseErr('unclosed tag', str, m.index + precedingString.length);
        }
    }
    pushString(str.slice(lastIndex, str.length), false);
    if (config.plugins) {
        for (var i = 0; i < config.plugins.length; i++) {
            var plugin = config.plugins[i];
            if (plugin.processAST) {
                buffer = plugin.processAST(buffer, config);
            }
        }
    }
    return buffer;
}

/* END TYPES */
/**
 * Compiles a template string to a function string. Most often users just use `compile()`, which calls `compileToString` and creates a new function using the result
 *
 * **Example**
 *
 * ```js
 * compileToString("Hi <%= it.user %>", eta.config)
 * // "var tR='',include=E.include.bind(E),includeFile=E.includeFile.bind(E);tR+='Hi ';tR+=E.e(it.user);if(cb){cb(null,tR)} return tR"
 * ```
 */
function compileToString(str, config) {
    var buffer = parse(str, config);
    var res = "var tR='',__l,__lP" +
        (config.include ? ',include=E.include.bind(E)' : '') +
        (config.includeFile ? ',includeFile=E.includeFile.bind(E)' : '') +
        '\nfunction layout(p,d){__l=p;__lP=d}\n' +
        (config.globalAwait ? 'let _prs = [];\n' : '') +
        (config.useWith ? 'with(' + config.varName + '||{}){' : '') +
        compileScope(buffer, config) +
        (config.includeFile
            ? 'if(__l)tR=' +
                (config.async ? 'await ' : '') +
                ("includeFile(__l,Object.assign(" + config.varName + ",{body:tR},__lP))\n")
            : config.include
                ? 'if(__l)tR=' +
                    (config.async ? 'await ' : '') +
                    ("include(__l,Object.assign(" + config.varName + ",{body:tR},__lP))\n")
                : '') +
        'if(cb){cb(null,tR)} return tR' +
        (config.useWith ? '}' : '');
    if (config.plugins) {
        for (var i = 0; i < config.plugins.length; i++) {
            var plugin = config.plugins[i];
            if (plugin.processFnString) {
                res = plugin.processFnString(res, config);
            }
        }
    }
    return res;
}
/**
 * Loops through the AST generated by `parse` and transform each item into JS calls
 *
 * **Example**
 *
 * ```js
 * // AST version of 'Hi <%= it.user %>'
 * let templateAST = ['Hi ', { val: 'it.user', t: 'i' }]
 * compileScope(templateAST, eta.config)
 * // "tR+='Hi ';tR+=E.e(it.user);"
 * ```
 */
function compileScope(buff, config) {
    var i;
    var buffLength = buff.length;
    var returnStr = '';
    if (config.globalAwait) {
        for (i = 0; i < buffLength; i++) {
            var currentBlock = buff[i];
            if (typeof currentBlock !== 'string') {
                var type = currentBlock.t;
                if (type === 'r' || type === 'i') {
                    var content = currentBlock.val || '';
                    returnStr += "_prs.push(" + content + ");\n";
                }
            }
        }
        returnStr += 'let _rst = await Promise.all(_prs);\n';
    }
    var j = 0;
    for (i = 0; i < buffLength; i++) {
        var currentBlock = buff[i];
        if (typeof currentBlock === 'string') {
            var str = currentBlock;
            // we know string exists
            returnStr += "tR+='" + str + "'\n";
        }
        else {
            var type = currentBlock.t; // ~, s, !, ?, r
            var content = currentBlock.val || '';
            if (type === 'r') {
                // raw
                if (config.globalAwait) {
                    content = "_rst[" + j + "]";
                }
                if (config.filter) {
                    content = 'E.filter(' + content + ')';
                }
                returnStr += 'tR+=' + content + '\n';
                j++;
            }
            else if (type === 'i') {
                // interpolate
                if (config.globalAwait) {
                    content = "_rst[" + j + "]";
                }
                if (config.filter) {
                    content = 'E.filter(' + content + ')';
                }
                if (config.autoEscape) {
                    content = 'E.e(' + content + ')';
                }
                returnStr += 'tR+=' + content + '\n';
                j++;
                // reference
            }
            else if (type === 'e') {
                // execute
                returnStr += content + '\n'; // you need a \n in case you have <% } %>
            }
        }
    }
    return returnStr;
}

/**
 * Handles storage and accessing of values
 *
 * In this case, we use it to store compiled template functions
 * Indexed by their `name` or `filename`
 */
var Cacher = /** @class */ (function () {
    function Cacher(cache) {
        this.cache = cache;
    }
    Cacher.prototype.define = function (key, val) {
        this.cache[key] = val;
    };
    Cacher.prototype.get = function (key) {
        // string | array.
        // TODO: allow array of keys to look down
        // TODO: create plugin to allow referencing helpers, filters with dot notation
        return this.cache[key];
    };
    Cacher.prototype.remove = function (key) {
        delete this.cache[key];
    };
    Cacher.prototype.reset = function () {
        this.cache = {};
    };
    Cacher.prototype.load = function (cacheObj) {
        copyProps(this.cache, cacheObj);
    };
    return Cacher;
}());

/* END TYPES */
/**
 * Eta's template storage
 *
 * Stores partials and cached templates
 */
var templates = new Cacher({});

/* END TYPES */
/**
 * Include a template based on its name (or filepath, if it's already been cached).
 *
 * Called like `include(templateNameOrPath, data)`
 */
function includeHelper(templateNameOrPath, data) {
    var template = this.templates.get(templateNameOrPath);
    if (!template) {
        throw EtaErr('Could not fetch template "' + templateNameOrPath + '"');
    }
    return template(data, this);
}
/** Eta's base (global) configuration */
var config = {
    async: false,
    autoEscape: true,
    autoTrim: [false, 'nl'],
    cache: false,
    e: XMLEscape,
    include: includeHelper,
    parse: {
        exec: '',
        interpolate: '=',
        raw: '~'
    },
    plugins: [],
    rmWhitespace: false,
    tags: ['<%', '%>'],
    templates: templates,
    useWith: false,
    varName: 'it'
};
/**
 * Takes one or two partial (not necessarily complete) configuration objects, merges them 1 layer deep into eta.config, and returns the result
 *
 * @param override Partial configuration object
 * @param baseConfig Partial configuration object to merge before `override`
 *
 * **Example**
 *
 * ```js
 * let customConfig = getConfig({tags: ['!#', '#!']})
 * ```
 */
function getConfig(override, baseConfig) {
    // TODO: run more tests on this
    var res = {}; // Linked
    copyProps(res, config); // Creates deep clone of eta.config, 1 layer deep
    if (baseConfig) {
        copyProps(res, baseConfig);
    }
    if (override) {
        copyProps(res, override);
    }
    return res;
}

/* END TYPES */
/**
 * Takes a template string and returns a template function that can be called with (data, config, [cb])
 *
 * @param str - The template string
 * @param config - A custom configuration object (optional)
 *
 * **Example**
 *
 * ```js
 * let compiledFn = eta.compile("Hi <%= it.user %>")
 * // function anonymous()
 * let compiledFnStr = compiledFn.toString()
 * // "function anonymous(it,E,cb\n) {\nvar tR='',include=E.include.bind(E),includeFile=E.includeFile.bind(E);tR+='Hi ';tR+=E.e(it.user);if(cb){cb(null,tR)} return tR\n}"
 * ```
 */
function compile(str, config) {
    var options = getConfig(config || {});
    /* ASYNC HANDLING */
    // The below code is modified from mde/ejs. All credit should go to them.
    var ctor = options.async ? getAsyncFunctionConstructor() : Function;
    /* END ASYNC HANDLING */
    try {
        return new ctor(options.varName, 'E', // EtaConfig
        'cb', // optional callback
        compileToString(str, options)); // eslint-disable-line no-new-func
    }
    catch (e) {
        if (e instanceof SyntaxError) {
            throw EtaErr('Bad template syntax\n\n' +
                e.message +
                '\n' +
                Array(e.message.length + 1).join('=') +
                '\n' +
                compileToString(str, options) +
                '\n' // This will put an extra newline before the callstack for extra readability
            );
        }
        else {
            throw e;
        }
    }
}

var _BOM = /^\uFEFF/;
/* END TYPES */
/**
 * Get the path to the included file from the parent file path and the
 * specified path.
 *
 * If `name` does not have an extension, it will default to `.eta`
 *
 * @param name specified path
 * @param parentfile parent file path
 * @param isDirectory whether parentfile is a directory
 * @return absolute path to template
 */
function getWholeFilePath(name, parentfile, isDirectory) {
    var includePath = path__namespace.resolve(isDirectory ? parentfile : path__namespace.dirname(parentfile), // returns directory the parent file is in
    name // file
    ) + (path__namespace.extname(name) ? '' : '.eta');
    return includePath;
}
/**
 * Get the absolute path to an included template
 *
 * If this is called with an absolute path (for example, starting with '/' or 'C:\')
 * then Eta will attempt to resolve the absolute path within options.views. If it cannot,
 * Eta will fallback to options.root or '/'
 *
 * If this is called with a relative path, Eta will:
 * - Look relative to the current template (if the current template has the `filename` property)
 * - Look inside each directory in options.views
 *
 * Note: if Eta is unable to find a template using path and options, it will throw an error.
 *
 * @param path    specified path
 * @param options compilation options
 * @return absolute path to template
 */
function getPath(path, options) {
    var includePath = false;
    var views = options.views;
    var searchedPaths = [];
    // If these four values are the same,
    // getPath() will return the same result every time.
    // We can cache the result to avoid expensive
    // file operations.
    var pathOptions = JSON.stringify({
        filename: options.filename,
        path: path,
        root: options.root,
        views: options.views
    });
    if (options.cache && options.filepathCache && options.filepathCache[pathOptions]) {
        // Use the cached filepath
        return options.filepathCache[pathOptions];
    }
    /** Add a filepath to the list of paths we've checked for a template */
    function addPathToSearched(pathSearched) {
        if (!searchedPaths.includes(pathSearched)) {
            searchedPaths.push(pathSearched);
        }
    }
    /**
     * Take a filepath (like 'partials/mypartial.eta'). Attempt to find the template file inside `views`;
     * return the resulting template file path, or `false` to indicate that the template was not found.
     *
     * @param views the filepath that holds templates, or an array of filepaths that hold templates
     * @param path the path to the template
     */
    function searchViews(views, path) {
        var filePath;
        // If views is an array, then loop through each directory
        // And attempt to find the template
        if (Array.isArray(views) &&
            views.some(function (v) {
                filePath = getWholeFilePath(path, v, true);
                addPathToSearched(filePath);
                return fs.existsSync(filePath);
            })) {
            // If the above returned true, we know that the filePath was just set to a path
            // That exists (Array.some() returns as soon as it finds a valid element)
            return filePath;
        }
        else if (typeof views === 'string') {
            // Search for the file if views is a single directory
            filePath = getWholeFilePath(path, views, true);
            addPathToSearched(filePath);
            if (fs.existsSync(filePath)) {
                return filePath;
            }
        }
        // Unable to find a file
        return false;
    }
    // Path starts with '/', 'C:\', etc.
    var match = /^[A-Za-z]+:\\|^\//.exec(path);
    // Absolute path, like /partials/partial.eta
    if (match && match.length) {
        // We have to trim the beginning '/' off the path, or else
        // path.resolve(dir, path) will always resolve to just path
        var formattedPath = path.replace(/^\/*/, '');
        // First, try to resolve the path within options.views
        includePath = searchViews(views, formattedPath);
        if (!includePath) {
            // If that fails, searchViews will return false. Try to find the path
            // inside options.root (by default '/', the base of the filesystem)
            var pathFromRoot = getWholeFilePath(formattedPath, options.root || '/', true);
            addPathToSearched(pathFromRoot);
            includePath = pathFromRoot;
        }
    }
    else {
        // Relative paths
        // Look relative to a passed filename first
        if (options.filename) {
            var filePath = getWholeFilePath(path, options.filename);
            addPathToSearched(filePath);
            if (fs.existsSync(filePath)) {
                includePath = filePath;
            }
        }
        // Then look for the template in options.views
        if (!includePath) {
            includePath = searchViews(views, path);
        }
        if (!includePath) {
            throw EtaErr('Could not find the template "' + path + '". Paths tried: ' + searchedPaths);
        }
    }
    // If caching and filepathCache are enabled,
    // cache the input & output of this function.
    if (options.cache && options.filepathCache) {
        options.filepathCache[pathOptions] = includePath;
    }
    return includePath;
}
/**
 * Reads a file synchronously
 */
function readFile(filePath) {
    try {
        return fs.readFileSync(filePath).toString().replace(_BOM, ''); // TODO: is replacing BOM's necessary?
    }
    catch (_a) {
        throw EtaErr("Failed to read template at '" + filePath + "'");
    }
}

// express is set like: app.engine('html', require('eta').renderFile)
/* END TYPES */
/**
 * Reads a template, compiles it into a function, caches it if caching isn't disabled, returns the function
 *
 * @param filePath Absolute path to template file
 * @param options Eta configuration overrides
 * @param noCache Optionally, make Eta not cache the template
 */
function loadFile(filePath, options, noCache) {
    var config = getConfig(options);
    var template = readFile(filePath);
    try {
        var compiledTemplate = compile(template, config);
        if (!noCache) {
            config.templates.define(config.filename, compiledTemplate);
        }
        return compiledTemplate;
    }
    catch (e) {
        throw EtaErr('Loading file: ' + filePath + ' failed:\n\n' + e.message);
    }
}
/**
 * Get the template from a string or a file, either compiled on-the-fly or
 * read from cache (if enabled), and cache the template if needed.
 *
 * If `options.cache` is true, this function reads the file from
 * `options.filename` so it must be set prior to calling this function.
 *
 * @param options   compilation options
 * @return Eta template function
 */
function handleCache$1(options) {
    var filename = options.filename;
    if (options.cache) {
        var func = options.templates.get(filename);
        if (func) {
            return func;
        }
        return loadFile(filename, options);
    }
    // Caching is disabled, so pass noCache = true
    return loadFile(filename, options, true);
}
/**
 * Get the template function.
 *
 * If `options.cache` is `true`, then the template is cached.
 *
 * This returns a template function and the config object with which that template function should be called.
 *
 * @remarks
 *
 * It's important that this returns a config object with `filename` set.
 * Otherwise, the included file would not be able to use relative paths
 *
 * @param path path for the specified file (if relative, specify `views` on `options`)
 * @param options compilation options
 * @return [Eta template function, new config object]
 */
function includeFile(path, options) {
    // the below creates a new options object, using the parent filepath of the old options object and the path
    var newFileOptions = getConfig({ filename: getPath(path, options) }, options);
    // TODO: make sure properties are currectly copied over
    return [handleCache$1(newFileOptions), newFileOptions];
}

/* END TYPES */
/**
 * Called with `includeFile(path, data)`
 */
function includeFileHelper(path, data) {
    var templateAndConfig = includeFile(path, this);
    return templateAndConfig[0](data, templateAndConfig[1]);
}

/* END TYPES */
function handleCache(template, options) {
    if (options.cache && options.name && options.templates.get(options.name)) {
        return options.templates.get(options.name);
    }
    var templateFunc = typeof template === 'function' ? template : compile(template, options);
    // Note that we don't have to check if it already exists in the cache;
    // it would have returned earlier if it had
    if (options.cache && options.name) {
        options.templates.define(options.name, templateFunc);
    }
    return templateFunc;
}
/**
 * Render a template
 *
 * If `template` is a string, Eta will compile it to a function and then call it with the provided data.
 * If `template` is a template function, Eta will call it with the provided data.
 *
 * If `config.async` is `false`, Eta will return the rendered template.
 *
 * If `config.async` is `true` and there's a callback function, Eta will call the callback with `(err, renderedTemplate)`.
 * If `config.async` is `true` and there's not a callback function, Eta will return a Promise that resolves to the rendered template.
 *
 * If `config.cache` is `true` and `config` has a `name` or `filename` property, Eta will cache the template on the first render and use the cached template for all subsequent renders.
 *
 * @param template Template string or template function
 * @param data Data to render the template with
 * @param config Optional config options
 * @param cb Callback function
 */
function render(template, data, config, cb) {
    var options = getConfig(config || {});
    if (options.async) {
        if (cb) {
            // If user passes callback
            try {
                // Note: if there is an error while rendering the template,
                // It will bubble up and be caught here
                var templateFn = handleCache(template, options);
                templateFn(data, options, cb);
            }
            catch (err) {
                return cb(err);
            }
        }
        else {
            // No callback, try returning a promise
            if (typeof promiseImpl === 'function') {
                return new promiseImpl(function (resolve, reject) {
                    try {
                        resolve(handleCache(template, options)(data, options));
                    }
                    catch (err) {
                        reject(err);
                    }
                });
            }
            else {
                throw EtaErr("Please provide a callback function, this env doesn't support Promises");
            }
        }
    }
    else {
        return handleCache(template, options)(data, options);
    }
}
/**
 * Render a template asynchronously
 *
 * If `template` is a string, Eta will compile it to a function and call it with the provided data.
 * If `template` is a function, Eta will call it with the provided data.
 *
 * If there is a callback function, Eta will call it with `(err, renderedTemplate)`.
 * If there is not a callback function, Eta will return a Promise that resolves to the rendered template
 *
 * @param template Template string or template function
 * @param data Data to render the template with
 * @param config Optional config options
 * @param cb Callback function
 */
function renderAsync(template, data, config, cb) {
    // Using Object.assign to lower bundle size, using spread operator makes it larger because of typescript injected polyfills
    return render(template, data, Object.assign({}, config, { async: true }), cb);
}

// @denoify-ignore
config.includeFile = includeFileHelper;
config.filepathCache = {};

class TParser {
    constructor(app) {
        this.app = app;
    }
}

class InternalModule extends TParser {
    constructor(app, plugin) {
        super(app);
        this.plugin = plugin;
        this.static_templates = new Map();
        this.dynamic_templates = new Map();
    }
    getName() {
        return this.name;
    }
    generateContext(file) {
        return __awaiter(this, void 0, void 0, function* () {
            this.file = file;
            if (this.static_templates.size === 0) {
                yield this.createStaticTemplates();
            }
            yield this.updateTemplates();
            return Object.assign(Object.assign({}, Object.fromEntries(this.static_templates)), Object.fromEntries(this.dynamic_templates));
        });
    }
}

class InternalModuleDate extends InternalModule {
    constructor() {
        super(...arguments);
        this.name = "date";
    }
    createStaticTemplates() {
        return __awaiter(this, void 0, void 0, function* () {
            this.static_templates.set("now", this.generate_now());
            this.static_templates.set("tomorrow", this.generate_tomorrow());
            this.static_templates.set("weekday", this.generate_weekday());
            this.static_templates.set("yesterday", this.generate_yesterday());
        });
    }
    updateTemplates() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    generate_now() {
        return (format = "YYYY-MM-DD", offset, reference, reference_format) => {
            if (reference && !window.moment(reference, reference_format).isValid()) {
                throw new Error("Invalid reference date format, try specifying one with the argument 'reference_format'");
            }
            let duration;
            if (typeof offset === "string") {
                duration = window.moment.duration(offset);
            }
            else if (typeof offset === "number") {
                duration = window.moment.duration(offset, "days");
            }
            return window.moment(reference, reference_format).add(duration).format(format);
        };
    }
    generate_tomorrow() {
        return (format = "YYYY-MM-DD") => {
            return window.moment().add(1, 'days').format(format);
        };
    }
    generate_weekday() {
        return (format = "YYYY-MM-DD", weekday, reference, reference_format) => {
            if (reference && !window.moment(reference, reference_format).isValid()) {
                throw new Error("Invalid reference date format, try specifying one with the argument 'reference_format'");
            }
            return window.moment(reference, reference_format).weekday(weekday).format(format);
        };
    }
    generate_yesterday() {
        return (format = "YYYY-MM-DD") => {
            return window.moment().add(-1, 'days').format(format);
        };
    }
}

const UNSUPPORTED_MOBILE_TEMPLATE = "Error_MobileUnsupportedTemplate";
const ICON_DATA = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 51.1328 28.7"><path d="M0 15.14 0 10.15 18.67 1.51 18.67 6.03 4.72 12.33 4.72 12.76 18.67 19.22 18.67 23.74 0 15.14ZM33.6928 1.84C33.6928 1.84 33.9761 2.1467 34.5428 2.76C35.1094 3.38 35.3928 4.56 35.3928 6.3C35.3928 8.0466 34.8195 9.54 33.6728 10.78C32.5261 12.02 31.0995 12.64 29.3928 12.64C27.6862 12.64 26.2661 12.0267 25.1328 10.8C23.9928 9.5733 23.4228 8.0867 23.4228 6.34C23.4228 4.6 23.9995 3.1066 25.1528 1.86C26.2994.62 27.7261 0 29.4328 0C31.1395 0 32.5594.6133 33.6928 1.84M49.8228.67 29.5328 28.38 24.4128 28.38 44.7128.67 49.8228.67M31.0328 8.38C31.0328 8.38 31.1395 8.2467 31.3528 7.98C31.5662 7.7067 31.6728 7.1733 31.6728 6.38C31.6728 5.5867 31.4461 4.92 30.9928 4.38C30.5461 3.84 29.9995 3.57 29.3528 3.57C28.7061 3.57 28.1695 3.84 27.7428 4.38C27.3228 4.92 27.1128 5.5867 27.1128 6.38C27.1128 7.1733 27.3361 7.84 27.7828 8.38C28.2361 8.9267 28.7861 9.2 29.4328 9.2C30.0795 9.2 30.6128 8.9267 31.0328 8.38M49.4328 17.9C49.4328 17.9 49.7161 18.2067 50.2828 18.82C50.8495 19.4333 51.1328 20.6133 51.1328 22.36C51.1328 24.1 50.5594 25.59 49.4128 26.83C48.2595 28.0766 46.8295 28.7 45.1228 28.7C43.4228 28.7 42.0028 28.0833 40.8628 26.85C39.7295 25.6233 39.1628 24.1366 39.1628 22.39C39.1628 20.65 39.7361 19.16 40.8828 17.92C42.0361 16.6733 43.4628 16.05 45.1628 16.05C46.8694 16.05 48.2928 16.6667 49.4328 17.9M46.8528 24.52C46.8528 24.52 46.9595 24.3833 47.1728 24.11C47.3795 23.8367 47.4828 23.3033 47.4828 22.51C47.4828 21.7167 47.2595 21.05 46.8128 20.51C46.3661 19.97 45.8162 19.7 45.1628 19.7C44.5161 19.7 43.9828 19.97 43.5628 20.51C43.1428 21.05 42.9328 21.7167 42.9328 22.51C42.9328 23.3033 43.1561 23.9733 43.6028 24.52C44.0494 25.06 44.5961 25.33 45.2428 25.33C45.8895 25.33 46.4261 25.06 46.8528 24.52Z" fill="currentColor"/></svg>`;

const DEPTH_LIMIT = 10;
class InternalModuleFile extends InternalModule {
    constructor() {
        super(...arguments);
        this.name = "file";
        this.include_depth = 0;
        this.linkpath_regex = new RegExp("^\\[\\[(.*)\\]\\]$");
    }
    createStaticTemplates() {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Remove this
            this.static_templates.set("clipboard", this.generate_clipboard());
            this.static_templates.set("cursor", this.generate_cursor());
            this.static_templates.set("selection", this.generate_selection());
        });
    }
    updateTemplates() {
        return __awaiter(this, void 0, void 0, function* () {
            this.dynamic_templates.set("content", yield this.generate_content());
            this.dynamic_templates.set("creation_date", this.generate_creation_date());
            this.dynamic_templates.set("folder", this.generate_folder());
            this.dynamic_templates.set("include", this.generate_include());
            this.dynamic_templates.set("last_modified_date", this.generate_last_modified_date());
            this.dynamic_templates.set("path", this.generate_path());
            this.dynamic_templates.set("rename", this.generate_rename());
            this.dynamic_templates.set("tags", this.generate_tags());
            this.dynamic_templates.set("title", this.generate_title());
        });
    }
    generate_clipboard() {
        return () => {
            // TODO: Remove this
            this.plugin.log_update("tp.file.clipboard was moved to a new module: System Module!<br/> You must now use tp.system.clipboard()");
            return "";
        };
    }
    generate_cursor() {
        return (order) => {
            // Hack to prevent empty output
            return `<% tp.file.cursor(${order !== null && order !== void 0 ? order : ''}) %>`;
        };
    }
    generate_content() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.app.vault.read(this.file);
        });
    }
    generate_creation_date() {
        return (format = "YYYY-MM-DD HH:mm") => {
            return window.moment(this.file.stat.ctime).format(format);
        };
    }
    generate_folder() {
        return (relative = false) => {
            let parent = this.file.parent;
            let folder;
            if (relative) {
                folder = parent.path;
            }
            else {
                folder = parent.name;
            }
            return folder;
        };
    }
    generate_include() {
        return (include_link) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            // TODO: Add mutex for this, this may currently lead to a race condition. 
            // While not very impactful, that could still be annoying.
            this.include_depth += 1;
            if (this.include_depth > DEPTH_LIMIT) {
                this.include_depth = 0;
                throw new Error("Reached inclusion depth limit (max = 10)");
            }
            let match;
            if ((match = this.linkpath_regex.exec(include_link)) === null) {
                this.plugin.log_update("tp.file.include was updated! You must now provide the 'include_filename' parameter as an obsidian link in the form '[[MyFile]]'<br/><br/>This ensures that if you change a file name, tp.file.include isn't broken.<br/><br/>This also adds supports for sections and blocks inclusions!");
                return "";
            }
            const { path, subpath } = obsidian.parseLinktext(match[1]);
            let inc_file = this.app.metadataCache.getFirstLinkpathDest(path, "");
            if (!inc_file) {
                throw new Error(`File ${include_link} doesn't exist`);
            }
            if (!(inc_file instanceof obsidian.TFile)) {
                throw new Error(`${include_link} is a folder, not a file`);
            }
            let inc_file_content = yield this.app.vault.read(inc_file);
            if (subpath) {
                let cache = this.app.metadataCache.getFileCache(inc_file);
                if (cache) {
                    let result = obsidian.resolveSubpath(cache, subpath);
                    if (result) {
                        inc_file_content = inc_file_content.slice(result.start.offset, (_a = result.end) === null || _a === void 0 ? void 0 : _a.offset);
                    }
                }
            }
            let parsed_content = yield this.plugin.parser.parseTemplates(inc_file_content);
            this.include_depth -= 1;
            return parsed_content;
        });
    }
    generate_last_modified_date() {
        return (format = "YYYY-MM-DD HH:mm") => {
            return window.moment(this.file.stat.mtime).format(format);
        };
    }
    generate_path() {
        return (relative = false) => {
            // TODO: Add mobile support
            if (this.app.isMobile) {
                return UNSUPPORTED_MOBILE_TEMPLATE;
            }
            if (!(this.app.vault.adapter instanceof obsidian.FileSystemAdapter)) {
                throw new Error("app.vault is not a FileSystemAdapter instance");
            }
            let vault_path = this.app.vault.adapter.getBasePath();
            if (relative) {
                return this.file.path;
            }
            else {
                return `${vault_path}/${this.file.path}`;
            }
        };
    }
    generate_rename() {
        return (new_title) => __awaiter(this, void 0, void 0, function* () {
            let new_path = obsidian.normalizePath(`${this.file.parent.path}/${new_title}.${this.file.extension}`);
            yield this.app.fileManager.renameFile(this.file, new_path);
            return "";
        });
    }
    generate_selection() {
        return () => {
            let active_view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
            if (active_view == null) {
                throw new Error("Active view is null, can't read selection.");
            }
            let editor = active_view.editor;
            return editor.getSelection();
        };
    }
    generate_tags() {
        let cache = this.app.metadataCache.getFileCache(this.file);
        return obsidian.getAllTags(cache);
    }
    generate_title() {
        return this.file.basename;
    }
}

class InternalModuleWeb extends InternalModule {
    constructor() {
        super(...arguments);
        this.name = "web";
    }
    createStaticTemplates() {
        return __awaiter(this, void 0, void 0, function* () {
            this.static_templates.set("daily_quote", this.generate_daily_quote());
            this.static_templates.set("random_picture", this.generate_random_picture());
            //this.static_templates.set("get_request", this.generate_get_request());
        });
    }
    updateTemplates() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    getRequest(url) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield fetch(url);
            if (!response.ok) {
                throw new Error("Error performing GET request");
            }
            return response;
        });
    }
    generate_daily_quote() {
        return () => __awaiter(this, void 0, void 0, function* () {
            let response = yield this.getRequest("https://quotes.rest/qod");
            let json = yield response.json();
            let author = json.contents.quotes[0].author;
            let quote = json.contents.quotes[0].quote;
            let new_content = `> ${quote}\n> &mdash; <cite>${author}</cite>`;
            return new_content;
        });
    }
    generate_random_picture() {
        return (size, query) => __awaiter(this, void 0, void 0, function* () {
            let response = yield this.getRequest(`https://source.unsplash.com/random/${size !== null && size !== void 0 ? size : ''}?${query !== null && query !== void 0 ? query : ''}`);
            let url = response.url;
            return `![tp.web.random_picture](${url})`;
        });
    }
    // TODO
    generate_weather() {
        return (query) => __awaiter(this, void 0, void 0, function* () {
        });
    }
    generate_get_request() {
        return (url) => __awaiter(this, void 0, void 0, function* () {
            let response = yield this.getRequest(url);
            let json = yield response.json();
            return json;
        });
    }
}

class InternalModuleFrontmatter extends InternalModule {
    constructor() {
        super(...arguments);
        this.name = "frontmatter";
    }
    createStaticTemplates() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    updateTemplates() {
        return __awaiter(this, void 0, void 0, function* () {
            let cache = this.app.metadataCache.getFileCache(this.file);
            this.dynamic_templates = new Map(Object.entries((cache === null || cache === void 0 ? void 0 : cache.frontmatter) || {}));
        });
    }
}

class PromptModal extends obsidian.Modal {
    constructor(app, prompt_text, default_value) {
        super(app);
        this.prompt_text = prompt_text;
        this.default_value = default_value;
        this.submitted = false;
    }
    onOpen() {
        this.titleEl.setText(this.prompt_text);
        this.createForm();
    }
    onClose() {
        this.contentEl.empty();
        if (!this.submitted) {
            this.reject(new Error("Cancelled prompt"));
        }
    }
    createForm() {
        var _a;
        let div = this.contentEl.createDiv();
        div.addClass("templater-prompt-div");
        let form = div.createEl("form");
        form.addClass("templater-prompt-form");
        form.type = "submit";
        form.onsubmit = (e) => {
            this.submitted = true;
            e.preventDefault();
            this.resolve(this.promptEl.value);
            this.close();
        };
        this.promptEl = form.createEl("input");
        this.promptEl.type = "text";
        this.promptEl.placeholder = "Type text here...";
        this.promptEl.value = (_a = this.default_value) !== null && _a !== void 0 ? _a : "";
        this.promptEl.addClass("templater-prompt-input");
        this.promptEl.select();
    }
    openAndGetValue(resolve, reject) {
        return __awaiter(this, void 0, void 0, function* () {
            this.resolve = resolve;
            this.reject = reject;
            this.open();
        });
    }
}

class SuggesterModal extends obsidian.FuzzySuggestModal {
    constructor(app, text_items, items) {
        super(app);
        this.text_items = text_items;
        this.items = items;
        this.submitted = false;
    }
    getItems() {
        return this.items;
    }
    onClose() {
        if (!this.submitted) {
            this.reject(new Error("Cancelled prompt"));
        }
    }
    selectSuggestion(value, evt) {
        this.submitted = true;
        this.close();
        this.onChooseSuggestion(value, evt);
    }
    getItemText(item) {
        if (this.text_items instanceof Function) {
            return this.text_items(item);
        }
        return this.text_items[this.items.indexOf(item)] || "Undefined Text Item";
    }
    onChooseItem(item, _evt) {
        this.resolve(item);
    }
    openAndGetValue(resolve, reject) {
        return __awaiter(this, void 0, void 0, function* () {
            this.resolve = resolve;
            this.reject = reject;
            this.open();
        });
    }
}

class InternalModuleSystem extends InternalModule {
    constructor() {
        super(...arguments);
        this.name = "system";
    }
    createStaticTemplates() {
        return __awaiter(this, void 0, void 0, function* () {
            this.static_templates.set("clipboard", this.generate_clipboard());
            this.static_templates.set("prompt", this.generate_prompt());
            this.static_templates.set("suggester", this.generate_suggester());
        });
    }
    updateTemplates() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    generate_clipboard() {
        return () => __awaiter(this, void 0, void 0, function* () {
            // TODO: Add mobile support
            if (this.app.isMobile) {
                return UNSUPPORTED_MOBILE_TEMPLATE;
            }
            return yield navigator.clipboard.readText();
        });
    }
    generate_prompt() {
        return (prompt_text, default_value, throw_on_cancel = false) => __awaiter(this, void 0, void 0, function* () {
            let prompt = new PromptModal(this.app, prompt_text, default_value);
            let promise = new Promise((resolve, reject) => prompt.openAndGetValue(resolve, reject));
            try {
                return yield promise;
            }
            catch (error) {
                if (throw_on_cancel) {
                    throw error;
                }
                return null;
            }
        });
    }
    generate_suggester() {
        return (text_items, items, throw_on_cancel = false) => __awaiter(this, void 0, void 0, function* () {
            let suggester = new SuggesterModal(this.app, text_items, items);
            let promise = new Promise((resolve, reject) => suggester.openAndGetValue(resolve, reject));
            try {
                return yield promise;
            }
            catch (error) {
                if (throw_on_cancel) {
                    throw error;
                }
                return null;
            }
        });
    }
}

class InternalTemplateParser extends TParser {
    constructor(app, plugin) {
        super(app);
        this.plugin = plugin;
        this.modules_array = new Array();
        this.createModules();
    }
    createModules() {
        this.modules_array.push(new InternalModuleDate(this.app, this.plugin));
        this.modules_array.push(new InternalModuleFile(this.app, this.plugin));
        this.modules_array.push(new InternalModuleWeb(this.app, this.plugin));
        this.modules_array.push(new InternalModuleFrontmatter(this.app, this.plugin));
        this.modules_array.push(new InternalModuleSystem(this.app, this.plugin));
    }
    generateContext(f) {
        return __awaiter(this, void 0, void 0, function* () {
            let modules_context_map = new Map();
            for (let mod of this.modules_array) {
                modules_context_map.set(mod.getName(), yield mod.generateContext(f));
            }
            return Object.fromEntries(modules_context_map);
        });
    }
}

class UserTemplateParser extends TParser {
    constructor(app, plugin) {
        super(app);
        this.plugin = plugin;
        this.resolveCwd();
    }
    resolveCwd() {
        // TODO: Add mobile support
        if (this.app.isMobile || !(this.app.vault.adapter instanceof obsidian.FileSystemAdapter)) {
            this.cwd = "";
        }
        else {
            this.cwd = this.app.vault.adapter.getBasePath();
        }
    }
    generateUserTemplates(file) {
        return __awaiter(this, void 0, void 0, function* () {
            let user_templates = new Map();
            const exec_promise = util.promisify(child_process.exec);
            let context = yield this.plugin.parser.generateContext(file, ContextMode.INTERNAL);
            for (let [template, cmd] of this.plugin.settings.templates_pairs) {
                if (template === "" || cmd === "") {
                    continue;
                }
                if (this.app.isMobile) {
                    user_templates.set(template, (user_args) => {
                        return UNSUPPORTED_MOBILE_TEMPLATE;
                    });
                }
                else {
                    cmd = yield this.plugin.parser.parseTemplates(cmd, context);
                    user_templates.set(template, (user_args) => __awaiter(this, void 0, void 0, function* () {
                        try {
                            let process_env = Object.assign(Object.assign({}, process.env), user_args);
                            let cmd_options = Object.assign({ timeout: this.plugin.settings.command_timeout * 1000, cwd: this.cwd, env: process_env }, (this.plugin.settings.shell_path !== "" && { shell: this.plugin.settings.shell_path }));
                            let { stdout } = yield exec_promise(cmd, cmd_options);
                            return stdout.trimRight();
                        }
                        catch (error) {
                            this.plugin.log_error(`Error with User Template ${template}`, error);
                        }
                    }));
                }
            }
            return user_templates;
        });
    }
    generateContext(file) {
        return __awaiter(this, void 0, void 0, function* () {
            let user_templates = this.plugin.settings.enable_system_commands ? yield this.generateUserTemplates(file) : new Map();
            return Object.assign({}, Object.fromEntries(user_templates));
        });
    }
}

class CursorJumper {
    constructor(app) {
        this.app = app;
        this.cursor_regex = new RegExp("<%\\s*tp.file.cursor\\((?<order>[0-9]{0,2})\\)\\s*%>", "g");
    }
    get_editor_position_from_index(content, index) {
        let substr = content.substr(0, index);
        let l = 0;
        let offset = -1;
        let r = -1;
        for (; (r = substr.indexOf("\n", r + 1)) !== -1; l++, offset = r)
            ;
        offset += 1;
        let ch = content.substr(offset, index - offset).length;
        return { line: l, ch: ch };
    }
    jump_to_next_cursor_location() {
        return __awaiter(this, void 0, void 0, function* () {
            let active_view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
            if (active_view === null) {
                throw new Error("No active view, can't append templates.");
            }
            let active_file = active_view.file;
            yield active_view.save();
            let content = yield this.app.vault.read(active_file);
            const { new_content, positions } = this.replace_and_get_cursor_positions(content);
            if (positions) {
                yield this.app.vault.modify(active_file, new_content);
                this.set_cursor_location(positions);
            }
        });
    }
    replace_and_get_cursor_positions(content) {
        let cursor_matches = [];
        let match;
        while ((match = this.cursor_regex.exec(content)) != null) {
            cursor_matches.push(match);
        }
        if (cursor_matches.length === 0) {
            return {};
        }
        cursor_matches.sort((m1, m2) => {
            return Number(m1.groups["order"]) - Number(m2.groups["order"]);
        });
        let match_str = cursor_matches[0][0];
        cursor_matches = cursor_matches.filter(m => {
            return m[0] === match_str;
        });
        let positions = [];
        let index_offset = 0;
        for (let match of cursor_matches) {
            let index = match.index - index_offset;
            positions.push(this.get_editor_position_from_index(content, index));
            content = content.replace(new RegExp(escapeRegExp$1(match[0])), "");
            index_offset += match[0].length;
            // TODO: Remove this, breaking for now waiting for the new setSelections API
            break;
            /*
            // For tp.file.cursor(), we only find one
            if (match[1] === "") {
                break;
            }
            */
        }
        return { new_content: content, positions: positions };
    }
    set_cursor_location(positions) {
        let active_view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
        if (active_view === null) {
            return;
        }
        // TODO: Remove this
        let editor = active_view.editor;
        editor.focus();
        editor.setCursor(positions[0]);
        /*
        let selections = [];
        for (let pos of positions) {
            selections.push({anchor: pos, head: pos});
        }
        editor.focus();
        editor.setSelections(selections);
        */
        /*
        // Check https://github.com/obsidianmd/obsidian-api/issues/14

        let editor = active_view.editor;
        editor.focus();

        for (let pos of positions) {
            let transaction: EditorTransaction = {
                selection: {
                    from: pos
                }
            };
            editor.transaction(transaction);
        }
        */
    }
}

var ContextMode;
(function (ContextMode) {
    ContextMode[ContextMode["INTERNAL"] = 0] = "INTERNAL";
    ContextMode[ContextMode["USER_INTERNAL"] = 1] = "USER_INTERNAL";
    ContextMode[ContextMode["DYNAMIC"] = 2] = "DYNAMIC";
})(ContextMode || (ContextMode = {}));
class TemplateParser extends TParser {
    constructor(app, plugin) {
        super(app);
        this.plugin = plugin;
        this.userTemplateParser = null;
        this.cursor_jumper = new CursorJumper(this.app);
        this.internalTemplateParser = new InternalTemplateParser(this.app, this.plugin);
        this.userTemplateParser = new UserTemplateParser(this.app, this.plugin);
    }
    setCurrentContext(file, context_mode) {
        return __awaiter(this, void 0, void 0, function* () {
            this.current_context = yield this.generateContext(file, context_mode);
        });
    }
    additionalContext() {
        return {
            obsidian: obsidian__namespace,
        };
    }
    generateContext(file, context_mode = ContextMode.USER_INTERNAL) {
        return __awaiter(this, void 0, void 0, function* () {
            let context = {};
            let additional_context = this.additionalContext();
            let internal_context = yield this.internalTemplateParser.generateContext(file);
            let user_context = {};
            if (!this.current_context) {
                // If a user system command is using tp.file.include, we need the context to be set.
                this.current_context = internal_context;
            }
            Object.assign(context, additional_context);
            switch (context_mode) {
                case ContextMode.INTERNAL:
                    Object.assign(context, internal_context);
                    break;
                case ContextMode.DYNAMIC:
                    user_context = yield this.userTemplateParser.generateContext(file);
                    Object.assign(context, {
                        dynamic: Object.assign(Object.assign({}, internal_context), { user: user_context })
                    });
                    break;
                case ContextMode.USER_INTERNAL:
                    user_context = yield this.userTemplateParser.generateContext(file);
                    Object.assign(context, Object.assign(Object.assign({}, internal_context), { user: user_context }));
                    break;
            }
            return context;
        });
    }
    parseTemplates(content, context, throw_on_error = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!context) {
                context = this.current_context;
            }
            try {
                content = (yield renderAsync(content, context, {
                    varName: "tp",
                    parse: {
                        exec: "*",
                        interpolate: "~",
                        raw: "",
                    },
                    autoTrim: false,
                    globalAwait: true,
                }));
            }
            catch (error) {
                this.plugin.log_error("Template parsing error, aborting.", error);
                if (throw_on_error) {
                    throw error;
                }
            }
            return content;
        });
    }
    replace_in_active_file() {
        try {
            let active_view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
            if (active_view === null) {
                throw new Error("Active view is null");
            }
            this.replace_templates_and_overwrite_in_file(active_view.file);
        }
        catch (error) {
            this.plugin.log_error(error);
        }
    }
    create_new_note_from_template(template_file, folder) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let template_content = yield this.app.vault.read(template_file);
                if (!folder) {
                    folder = this.app.fileManager.getNewFileParent("");
                    //folder = this.app.vault.getConfig("newFileFolderPath");
                }
                // TODO: Change that, not stable atm
                // @ts-ignore
                let created_note = yield this.app.fileManager.createNewMarkdownFile(folder, "Untitled");
                yield this.setCurrentContext(created_note, ContextMode.USER_INTERNAL);
                let content;
                try {
                    content = yield this.plugin.parser.parseTemplates(template_content, undefined, true);
                }
                catch (error) {
                    yield this.app.vault.delete(created_note);
                    return;
                }
                yield this.app.vault.modify(created_note, content);
                let active_leaf = this.app.workspace.activeLeaf;
                if (!active_leaf) {
                    throw new Error("No active leaf");
                }
                yield active_leaf.openFile(created_note, { state: { mode: 'source' }, eState: { rename: 'all' } });
                yield this.cursor_jumper.jump_to_next_cursor_location();
            }
            catch (error) {
                this.plugin.log_error(error);
            }
        });
    }
    replace_templates_and_append(template_file) {
        return __awaiter(this, void 0, void 0, function* () {
            let active_view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
            if (active_view === null) {
                throw new Error("No active view, can't append templates.");
            }
            let editor = active_view.editor;
            let doc = editor.getDoc();
            let content = yield this.app.vault.read(template_file);
            yield this.setCurrentContext(active_view.file, ContextMode.USER_INTERNAL);
            content = yield this.parseTemplates(content);
            doc.replaceSelection(content);
            yield this.cursor_jumper.jump_to_next_cursor_location();
            editor.focus();
        });
    }
    replace_templates_and_overwrite_in_file(file) {
        return __awaiter(this, void 0, void 0, function* () {
            let content = yield this.app.vault.read(file);
            yield this.setCurrentContext(file, ContextMode.USER_INTERNAL);
            let new_content = yield this.parseTemplates(content);
            if (new_content !== content) {
                yield this.app.vault.modify(file, new_content);
                if (this.app.workspace.getActiveFile() === file) {
                    yield this.cursor_jumper.jump_to_next_cursor_location();
                }
            }
        });
    }
}

class TemplaterPlugin extends obsidian.Plugin {
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadSettings();
            this.fuzzySuggest = new TemplaterFuzzySuggestModal(this.app, this);
            this.parser = new TemplateParser(this.app, this);
            this.registerMarkdownPostProcessor((el, ctx) => this.dynamic_templates_processor(el, ctx));
            obsidian.addIcon("templater-icon", ICON_DATA);
            this.addRibbonIcon('templater-icon', 'Templater', () => __awaiter(this, void 0, void 0, function* () {
                this.fuzzySuggest.insert_template();
            }));
            this.addCommand({
                id: "insert-templater",
                name: "Insert Template",
                hotkeys: [
                    {
                        modifiers: ["Alt"],
                        key: 'e',
                    },
                ],
                callback: () => {
                    this.fuzzySuggest.insert_template();
                },
            });
            this.addCommand({
                id: "replace-in-file-templater",
                name: "Replace templates in the active file",
                hotkeys: [
                    {
                        modifiers: ["Alt"],
                        key: 'r',
                    },
                ],
                callback: () => {
                    this.parser.replace_in_active_file();
                },
            });
            this.addCommand({
                id: "jump-to-next-cursor-location",
                name: "Jump to next cursor location",
                hotkeys: [
                    {
                        modifiers: ["Alt"],
                        key: "Tab",
                    },
                ],
                callback: () => {
                    try {
                        this.parser.cursor_jumper.jump_to_next_cursor_location();
                    }
                    catch (error) {
                        this.log_error(error);
                    }
                }
            });
            this.addCommand({
                id: "create-new-note-from-template",
                name: "Create new note from template",
                hotkeys: [
                    {
                        modifiers: ["Alt"],
                        key: "n",
                    },
                ],
                callback: () => {
                    this.fuzzySuggest.create_new_note_from_template();
                }
            });
            this.app.workspace.onLayoutReady(() => {
                this.update_trigger_file_on_creation();
            });
            this.registerEvent(this.app.workspace.on("file-menu", (menu, file) => {
                if (file instanceof obsidian.TFolder) {
                    menu.addItem((item) => {
                        item.setTitle("Create new note from template")
                            .setIcon("templater-icon")
                            .onClick(evt => {
                            this.fuzzySuggest.create_new_note_from_template(file);
                        });
                    });
                }
            }));
            this.addSettingTab(new TemplaterSettingTab(this.app, this));
        });
    }
    saveSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.saveData(this.settings);
        });
    }
    loadSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            this.settings = Object.assign({}, DEFAULT_SETTINGS, yield this.loadData());
        });
    }
    update_trigger_file_on_creation() {
        if (this.settings.trigger_on_file_creation) {
            this.trigger_on_file_creation_event = this.app.vault.on("create", (file) => __awaiter(this, void 0, void 0, function* () {
                // TODO: Find a way to not trigger this on files copy
                // TODO: find a better way to do this
                // Currently, I have to wait for the daily note plugin to add the file content before replacing
                // Not a problem with Calendar however since it creates the file with the existing content
                yield delay(300);
                // ! This could corrupt binary files
                if (!(file instanceof obsidian.TFile) || file.extension !== "md") {
                    return;
                }
                this.parser.replace_templates_and_overwrite_in_file(file);
            }));
            this.registerEvent(this.trigger_on_file_creation_event);
        }
        else {
            if (this.trigger_on_file_creation_event) {
                this.app.vault.offref(this.trigger_on_file_creation_event);
                this.trigger_on_file_creation_event = undefined;
            }
        }
    }
    log_update(msg) {
        let notice = new obsidian.Notice("", 15000);
        // TODO: Find better way for this
        // @ts-ignore
        notice.noticeEl.innerHTML = `<b>Templater update</b>:<br/>${msg}`;
    }
    log_error(msg, error) {
        let notice = new obsidian.Notice("", 8000);
        if (error) {
            // TODO: Find a better way for this
            // @ts-ignore
            notice.noticeEl.innerHTML = `<b>Templater Error</b>:<br/>${msg}<br/>Check console for more informations`;
            console.error(msg, error);
        }
        else {
            // @ts-ignore
            notice.noticeEl.innerHTML = `<b>Templater Error</b>:<br/>${msg}`;
        }
    }
    dynamic_templates_processor(el, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            let content = el.innerText.trim();
            if (content.contains("tp.dynamic")) {
                let file = this.app.metadataCache.getFirstLinkpathDest("", ctx.sourcePath);
                if (!file || !(file instanceof obsidian.TFile)) {
                    return;
                }
                yield this.parser.setCurrentContext(file, ContextMode.DYNAMIC);
                let new_content = yield this.parser.parseTemplates(content);
                el.innerText = new_content;
            }
        });
    }
}

module.exports = TemplaterPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsInNyYy9TZXR0aW5ncy50cyIsInNyYy9VdGlscy50cyIsInNyYy9UZW1wbGF0ZXJGdXp6eVN1Z2dlc3QudHMiLCJub2RlX21vZHVsZXMvZXRhL2Rpc3QvZXRhLmVzLmpzIiwic3JjL1RQYXJzZXIudHMiLCJzcmMvSW50ZXJuYWxUZW1wbGF0ZXMvSW50ZXJuYWxNb2R1bGUudHMiLCJzcmMvSW50ZXJuYWxUZW1wbGF0ZXMvZGF0ZS9JbnRlcm5hbE1vZHVsZURhdGUudHMiLCJzcmMvQ29uc3RhbnRzLnRzIiwic3JjL0ludGVybmFsVGVtcGxhdGVzL2ZpbGUvSW50ZXJuYWxNb2R1bGVGaWxlLnRzIiwic3JjL0ludGVybmFsVGVtcGxhdGVzL3dlYi9JbnRlcm5hbE1vZHVsZVdlYi50cyIsInNyYy9JbnRlcm5hbFRlbXBsYXRlcy9mcm9udG1hdHRlci9JbnRlcm5hbE1vZHVsZUZyb250bWF0dGVyLnRzIiwic3JjL0ludGVybmFsVGVtcGxhdGVzL3N5c3RlbS9Qcm9tcHRNb2RhbC50cyIsInNyYy9JbnRlcm5hbFRlbXBsYXRlcy9zeXN0ZW0vU3VnZ2VzdGVyTW9kYWwudHMiLCJzcmMvSW50ZXJuYWxUZW1wbGF0ZXMvc3lzdGVtL0ludGVybmFsTW9kdWxlU3lzdGVtLnRzIiwic3JjL0ludGVybmFsVGVtcGxhdGVzL0ludGVybmFsVGVtcGxhdGVQYXJzZXIudHMiLCJzcmMvVXNlclRlbXBsYXRlcy9Vc2VyVGVtcGxhdGVQYXJzZXIudHMiLCJzcmMvQ3Vyc29ySnVtcGVyLnRzIiwic3JjL1RlbXBsYXRlUGFyc2VyLnRzIiwic3JjL21haW4udHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxyXG5cclxuUGVybWlzc2lvbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgYW5kL29yIGRpc3RyaWJ1dGUgdGhpcyBzb2Z0d2FyZSBmb3IgYW55XHJcbnB1cnBvc2Ugd2l0aCBvciB3aXRob3V0IGZlZSBpcyBoZXJlYnkgZ3JhbnRlZC5cclxuXHJcblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIgQU5EIFRIRSBBVVRIT1IgRElTQ0xBSU1TIEFMTCBXQVJSQU5USUVTIFdJVEhcclxuUkVHQVJEIFRPIFRISVMgU09GVFdBUkUgSU5DTFVESU5HIEFMTCBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZXHJcbkFORCBGSVRORVNTLiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SIEJFIExJQUJMRSBGT1IgQU5ZIFNQRUNJQUwsIERJUkVDVCxcclxuSU5ESVJFQ1QsIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyBPUiBBTlkgREFNQUdFUyBXSEFUU09FVkVSIFJFU1VMVElORyBGUk9NXHJcbkxPU1MgT0YgVVNFLCBEQVRBIE9SIFBST0ZJVFMsIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBORUdMSUdFTkNFIE9SXHJcbk9USEVSIFRPUlRJT1VTIEFDVElPTiwgQVJJU0lORyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBVU0UgT1JcclxuUEVSRk9STUFOQ0UgT0YgVEhJUyBTT0ZUV0FSRS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuLyogZ2xvYmFsIFJlZmxlY3QsIFByb21pc2UgKi9cclxuXHJcbnZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24oZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHRlbmRzKGQsIGIpIHtcclxuICAgIGlmICh0eXBlb2YgYiAhPT0gXCJmdW5jdGlvblwiICYmIGIgIT09IG51bGwpXHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xyXG4gICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fYXNzaWduID0gZnVuY3Rpb24oKSB7XHJcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24odCkge1xyXG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRbcF0gPSBzW3BdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdDtcclxuICAgIH1cclxuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZXN0KHMsIGUpIHtcclxuICAgIHZhciB0ID0ge307XHJcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcclxuICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChlLmluZGV4T2YocFtpXSkgPCAwICYmIE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChzLCBwW2ldKSlcclxuICAgICAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xyXG4gICAgICAgIH1cclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcGFyYW0ocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0ZXIodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19nZW5lcmF0b3IodGhpc0FyZywgYm9keSkge1xyXG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcclxuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XHJcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xyXG4gICAgICAgIHdoaWxlIChfKSB0cnkge1xyXG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XHJcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcclxuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XHJcbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19jcmVhdGVCaW5kaW5nID0gT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9KTtcclxufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBvW2syXSA9IG1ba107XHJcbn0pO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXhwb3J0U3RhcihtLCBvKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmIChwICE9PSBcImRlZmF1bHRcIiAmJiAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG8sIHApKSBfX2NyZWF0ZUJpbmRpbmcobywgbSwgcCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3ZhbHVlcyhvKSB7XHJcbiAgICB2YXIgcyA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBTeW1ib2wuaXRlcmF0b3IsIG0gPSBzICYmIG9bc10sIGkgPSAwO1xyXG4gICAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XHJcbiAgICBpZiAobyAmJiB0eXBlb2Ygby5sZW5ndGggPT09IFwibnVtYmVyXCIpIHJldHVybiB7XHJcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xyXG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IocyA/IFwiT2JqZWN0IGlzIG5vdCBpdGVyYWJsZS5cIiA6IFwiU3ltYm9sLml0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVhZChvLCBuKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XHJcbiAgICBpZiAoIW0pIHJldHVybiBvO1xyXG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbi8qKiBAZGVwcmVjYXRlZCAqL1xyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWQoKSB7XHJcbiAgICBmb3IgKHZhciBhciA9IFtdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcclxuICAgICAgICBhciA9IGFyLmNvbmNhdChfX3JlYWQoYXJndW1lbnRzW2ldKSk7XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbi8qKiBAZGVwcmVjYXRlZCAqL1xyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWRBcnJheXMoKSB7XHJcbiAgICBmb3IgKHZhciBzID0gMCwgaSA9IDAsIGlsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHMgKz0gYXJndW1lbnRzW2ldLmxlbmd0aDtcclxuICAgIGZvciAodmFyIHIgPSBBcnJheShzKSwgayA9IDAsIGkgPSAwOyBpIDwgaWw7IGkrKylcclxuICAgICAgICBmb3IgKHZhciBhID0gYXJndW1lbnRzW2ldLCBqID0gMCwgamwgPSBhLmxlbmd0aDsgaiA8IGpsOyBqKyssIGsrKylcclxuICAgICAgICAgICAgcltrXSA9IGFbal07XHJcbiAgICByZXR1cm4gcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkQXJyYXkodG8sIGZyb20pIHtcclxuICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IGZyb20ubGVuZ3RoLCBqID0gdG8ubGVuZ3RoOyBpIDwgaWw7IGkrKywgaisrKVxyXG4gICAgICAgIHRvW2pdID0gZnJvbVtpXTtcclxuICAgIHJldHVybiB0bztcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaVtuXSA9IG9bbl0gPyBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBuID09PSBcInJldHVyblwiIH0gOiBmID8gZih2KSA6IHY7IH0gOiBmOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdLCBpO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiAobyA9IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKSwgaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGkpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlbbl0gPSBvW25dICYmIGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHYgPSBvW25dKHYpLCBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCB2LmRvbmUsIHYudmFsdWUpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgZCwgdikgeyBQcm9taXNlLnJlc29sdmUodikudGhlbihmdW5jdGlvbih2KSB7IHJlc29sdmUoeyB2YWx1ZTogdiwgZG9uZTogZCB9KTsgfSwgcmVqZWN0KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cclxudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xyXG59KSA6IGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydFN0YXIobW9kKSB7XHJcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xyXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKGsgIT09IFwiZGVmYXVsdFwiICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSBfX2NyZWF0ZUJpbmRpbmcocmVzdWx0LCBtb2QsIGspO1xyXG4gICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydERlZmF1bHQobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IGRlZmF1bHQ6IG1vZCB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZEdldChyZWNlaXZlciwgc3RhdGUsIGtpbmQsIGYpIHtcclxuICAgIGlmIChraW5kID09PSBcImFcIiAmJiAhZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlByaXZhdGUgYWNjZXNzb3Igd2FzIGRlZmluZWQgd2l0aG91dCBhIGdldHRlclwiKTtcclxuICAgIGlmICh0eXBlb2Ygc3RhdGUgPT09IFwiZnVuY3Rpb25cIiA/IHJlY2VpdmVyICE9PSBzdGF0ZSB8fCAhZiA6ICFzdGF0ZS5oYXMocmVjZWl2ZXIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IHJlYWQgcHJpdmF0ZSBtZW1iZXIgZnJvbSBhbiBvYmplY3Qgd2hvc2UgY2xhc3MgZGlkIG5vdCBkZWNsYXJlIGl0XCIpO1xyXG4gICAgcmV0dXJuIGtpbmQgPT09IFwibVwiID8gZiA6IGtpbmQgPT09IFwiYVwiID8gZi5jYWxsKHJlY2VpdmVyKSA6IGYgPyBmLnZhbHVlIDogc3RhdGUuZ2V0KHJlY2VpdmVyKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fY2xhc3NQcml2YXRlRmllbGRTZXQocmVjZWl2ZXIsIHN0YXRlLCB2YWx1ZSwga2luZCwgZikge1xyXG4gICAgaWYgKGtpbmQgPT09IFwibVwiKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBtZXRob2QgaXMgbm90IHdyaXRhYmxlXCIpO1xyXG4gICAgaWYgKGtpbmQgPT09IFwiYVwiICYmICFmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBhY2Nlc3NvciB3YXMgZGVmaW5lZCB3aXRob3V0IGEgc2V0dGVyXCIpO1xyXG4gICAgaWYgKHR5cGVvZiBzdGF0ZSA9PT0gXCJmdW5jdGlvblwiID8gcmVjZWl2ZXIgIT09IHN0YXRlIHx8ICFmIDogIXN0YXRlLmhhcyhyZWNlaXZlcikpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3Qgd3JpdGUgcHJpdmF0ZSBtZW1iZXIgdG8gYW4gb2JqZWN0IHdob3NlIGNsYXNzIGRpZCBub3QgZGVjbGFyZSBpdFwiKTtcclxuICAgIHJldHVybiAoa2luZCA9PT0gXCJhXCIgPyBmLmNhbGwocmVjZWl2ZXIsIHZhbHVlKSA6IGYgPyBmLnZhbHVlID0gdmFsdWUgOiBzdGF0ZS5zZXQocmVjZWl2ZXIsIHZhbHVlKSksIHZhbHVlO1xyXG59XHJcbiIsImltcG9ydCB7IEFwcCwgUGx1Z2luU2V0dGluZ1RhYiwgU2V0dGluZyB9IGZyb20gXCJvYnNpZGlhblwiO1xuXG5pbXBvcnQgVGVtcGxhdGVyUGx1Z2luIGZyb20gJy4vbWFpbic7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX1NFVFRJTkdTOiBUZW1wbGF0ZXJTZXR0aW5ncyA9IHtcblx0Y29tbWFuZF90aW1lb3V0OiA1LFxuXHR0ZW1wbGF0ZV9mb2xkZXI6IFwiXCIsXG5cdHRlbXBsYXRlc19wYWlyczogW1tcIlwiLCBcIlwiXV0sXG5cdHRyaWdnZXJfb25fZmlsZV9jcmVhdGlvbjogZmFsc2UsXG5cdGVuYWJsZV9zeXN0ZW1fY29tbWFuZHM6IGZhbHNlLFxuXHRzaGVsbF9wYXRoOiBcIlwiLFxufTtcblxuZXhwb3J0IGludGVyZmFjZSBUZW1wbGF0ZXJTZXR0aW5ncyB7XG5cdGNvbW1hbmRfdGltZW91dDogbnVtYmVyO1xuXHR0ZW1wbGF0ZV9mb2xkZXI6IHN0cmluZztcblx0dGVtcGxhdGVzX3BhaXJzOiBBcnJheTxbc3RyaW5nLCBzdHJpbmddPjtcblx0dHJpZ2dlcl9vbl9maWxlX2NyZWF0aW9uOiBib29sZWFuO1xuXHRlbmFibGVfc3lzdGVtX2NvbW1hbmRzOiBib29sZWFuO1xuXHRzaGVsbF9wYXRoOiBzdHJpbmcsXG59XG5cbmV4cG9ydCBjbGFzcyBUZW1wbGF0ZXJTZXR0aW5nVGFiIGV4dGVuZHMgUGx1Z2luU2V0dGluZ1RhYiB7XG5cdGNvbnN0cnVjdG9yKHB1YmxpYyBhcHA6IEFwcCwgcHJpdmF0ZSBwbHVnaW46IFRlbXBsYXRlclBsdWdpbikge1xuXHRcdHN1cGVyKGFwcCwgcGx1Z2luKTtcblx0fVxuXG5cdGRpc3BsYXkoKTogdm9pZCB7XG5cdFx0bGV0IHtjb250YWluZXJFbH0gPSB0aGlzO1xuXHRcdGxldCBkZXNjOiBEb2N1bWVudEZyYWdtZW50O1xuXHRcdGNvbnRhaW5lckVsLmVtcHR5KCk7XG5cblx0XHRuZXcgU2V0dGluZyhjb250YWluZXJFbClcblx0XHRcdC5zZXROYW1lKFwiVGVtcGxhdGUgZm9sZGVyIGxvY2F0aW9uXCIpXG5cdFx0XHQuc2V0RGVzYyhcIkZpbGVzIGluIHRoaXMgZm9sZGVyIHdpbGwgYmUgYXZhaWxhYmxlIGFzIHRlbXBsYXRlcy5cIilcblx0XHRcdC5hZGRUZXh0KHRleHQgPT4ge1xuXHRcdFx0XHR0ZXh0LnNldFBsYWNlaG9sZGVyKFwiRXhhbXBsZTogZm9sZGVyIDEvZm9sZGVyIDJcIilcblx0XHRcdFx0XHQuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MudGVtcGxhdGVfZm9sZGVyKVxuXHRcdFx0XHRcdC5vbkNoYW5nZSgobmV3X2ZvbGRlcikgPT4ge1xuXHRcdFx0XHRcdFx0dGhpcy5wbHVnaW4uc2V0dGluZ3MudGVtcGxhdGVfZm9sZGVyID0gbmV3X2ZvbGRlcjtcblx0XHRcdFx0XHRcdHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHR9KTtcblxuXHRcdG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuXHRcdFx0LnNldE5hbWUoXCJUaW1lb3V0XCIpXG5cdFx0XHQuc2V0RGVzYyhcIk1heGltdW0gdGltZW91dCBpbiBzZWNvbmRzIGZvciBhIHN5c3RlbSBjb21tYW5kLlwiKVxuXHRcdFx0LmFkZFRleHQodGV4dCA9PiB7XG5cdFx0XHRcdHRleHQuc2V0UGxhY2Vob2xkZXIoXCJUaW1lb3V0XCIpXG5cdFx0XHRcdFx0LnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmNvbW1hbmRfdGltZW91dC50b1N0cmluZygpKVxuXHRcdFx0XHRcdC5vbkNoYW5nZSgobmV3X3ZhbHVlKSA9PiB7XG5cdFx0XHRcdFx0XHRsZXQgbmV3X3RpbWVvdXQgPSBOdW1iZXIobmV3X3ZhbHVlKTtcblx0XHRcdFx0XHRcdGlmIChpc05hTihuZXdfdGltZW91dCkpIHtcblx0XHRcdFx0XHRcdFx0dGhpcy5wbHVnaW4ubG9nX2Vycm9yKFwiVGltZW91dCBtdXN0IGJlIGEgbnVtYmVyXCIpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zZXR0aW5ncy5jb21tYW5kX3RpbWVvdXQgPSBuZXdfdGltZW91dDtcblx0XHRcdFx0XHRcdHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHR9KTtcblxuXHRcdGRlc2MgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cdFx0ZGVzYy5hcHBlbmQoXG5cdFx0XHRcIlRlbXBsYXRlciBwcm92aWRlcyBtdWx0aXBsZXMgcHJlZGVmaW5lZCB2YXJpYWJsZXMgLyBmdW5jdGlvbnMgdGhhdCB5b3UgY2FuIHVzZS5cIixcblx0XHRcdGRlc2MuY3JlYXRlRWwoXCJiclwiKSxcblx0XHRcdFwiQ2hlY2sgdGhlIFwiLFxuXHRcdFx0ZGVzYy5jcmVhdGVFbChcImFcIiwge1xuXHRcdFx0XHRocmVmOiBcImh0dHBzOi8vc2lsZW50dm9pZDEzLmdpdGh1Yi5pby9UZW1wbGF0ZXIvXCIsXG5cdFx0XHRcdHRleHQ6IFwiZG9jdW1lbnRhdGlvblwiXG5cdFx0XHR9KSxcblx0XHRcdFwiIHRvIGdldCBhIGxpc3Qgb2YgYWxsIHRoZSBhdmFpbGFibGUgaW50ZXJuYWwgdmFyaWFibGVzIC8gZnVuY3Rpb25zLlwiLFxuXHRcdCk7XG5cblx0XHRuZXcgU2V0dGluZyhjb250YWluZXJFbClcblx0XHRcdC5zZXROYW1lKFwiSW50ZXJuYWwgVmFyaWFibGVzIGFuZCBGdW5jdGlvbnNcIilcblx0XHRcdC5zZXREZXNjKGRlc2MpO1xuXG5cdFx0ZGVzYyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcblx0XHRkZXNjLmFwcGVuZChcblx0XHRcdFwiVGVtcGxhdGVyIHdpbGwgbGlzdGVuIGZvciB0aGUgbmV3IGZpbGUgY3JlYXRpb24gZXZlbnQsIGFuZCByZXBsYWNlIGV2ZXJ5IGNvbW1hbmQgaXQgZmluZHMgaW4gdGhlIG5ldyBmaWxlJ3MgY29udGVudC5cIixcblx0XHRcdGRlc2MuY3JlYXRlRWwoXCJiclwiKSxcblx0XHRcdFwiVGhpcyBtYWtlcyBUZW1wbGF0ZXIgY29tcGF0aWJsZSB3aXRoIG90aGVyIHBsdWdpbnMgbGlrZSB0aGUgRGFpbHkgbm90ZSBjb3JlIHBsdWdpbiwgQ2FsZW5kYXIgcGx1Z2luLCBSZXZpZXcgcGx1Z2luLCBOb3RlIHJlZmFjdG9yIHBsdWdpbiwgLi4uXCIsXG5cdFx0XHRkZXNjLmNyZWF0ZUVsKFwiYnJcIiksXG5cdFx0XHRkZXNjLmNyZWF0ZUVsKFwiYlwiLCB7XG5cdFx0XHRcdHRleHQ6IFwiV2FybmluZzogXCIsXG5cdFx0XHR9KSxcblx0XHRcdFwiVGhpcyBjYW4gYmUgZGFuZ2Vyb3VzIGlmIHlvdSBjcmVhdGUgbmV3IGZpbGVzIHdpdGggdW5rbm93biAvIHVuc2FmZSBjb250ZW50IG9uIGNyZWF0aW9uLiBNYWtlIHN1cmUgdGhhdCBldmVyeSBuZXcgZmlsZSdzIGNvbnRlbnQgaXMgc2FmZSBvbiBjcmVhdGlvbi5cIlxuXHRcdCk7XHRcblxuXHRcdG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuXHRcdFx0LnNldE5hbWUoXCJUcmlnZ2VyIFRlbXBsYXRlciBvbiBuZXcgZmlsZSBjcmVhdGlvblwiKVxuXHRcdFx0LnNldERlc2MoZGVzYylcblx0XHRcdC5hZGRUb2dnbGUodG9nZ2xlID0+IHtcblx0XHRcdFx0dG9nZ2xlXG5cdFx0XHRcdFx0LnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnRyaWdnZXJfb25fZmlsZV9jcmVhdGlvbilcblx0XHRcdFx0XHQub25DaGFuZ2UodHJpZ2dlcl9vbl9maWxlX2NyZWF0aW9uID0+IHtcblx0XHRcdFx0XHRcdHRoaXMucGx1Z2luLnNldHRpbmdzLnRyaWdnZXJfb25fZmlsZV9jcmVhdGlvbiA9IHRyaWdnZXJfb25fZmlsZV9jcmVhdGlvbjtcblx0XHRcdFx0XHRcdHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuXHRcdFx0XHRcdFx0dGhpcy5wbHVnaW4udXBkYXRlX3RyaWdnZXJfZmlsZV9vbl9jcmVhdGlvbigpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cblx0XHRkZXNjID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXHRcdGRlc2MuYXBwZW5kKFxuXHRcdFx0XCJBbGxvd3MgeW91IHRvIGNyZWF0ZSB1c2VyIGZ1bmN0aW9ucyBsaW5rZWQgdG8gc3lzdGVtIGNvbW1hbmRzLlwiLFxuXHRcdFx0ZGVzYy5jcmVhdGVFbChcImJyXCIpLFxuXHRcdFx0ZGVzYy5jcmVhdGVFbChcImJcIiwge1xuXHRcdFx0XHR0ZXh0OiBcIldhcm5pbmc6IFwiXG5cdFx0XHR9KSxcblx0XHRcdFwiSXQgY2FuIGJlIGRhbmdlcm91cyB0byBleGVjdXRlIGFyYml0cmFyeSBzeXN0ZW0gY29tbWFuZHMgZnJvbSB1bnRydXN0ZWQgc291cmNlcy4gT25seSBydW4gc3lzdGVtIGNvbW1hbmRzIHRoYXQgeW91IHVuZGVyc3RhbmQsIGZyb20gdHJ1c3RlZCBzb3VyY2VzLlwiLFxuXHRcdCk7XG5cblx0XHRuZXcgU2V0dGluZyhjb250YWluZXJFbClcblx0XHRcdC5zZXROYW1lKFwiRW5hYmxlIFN5c3RlbSBDb21tYW5kc1wiKVxuXHRcdFx0LnNldERlc2MoZGVzYylcblx0XHRcdC5hZGRUb2dnbGUodG9nZ2xlID0+IHtcblx0XHRcdFx0dG9nZ2xlXG5cdFx0XHRcdFx0LnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmVuYWJsZV9zeXN0ZW1fY29tbWFuZHMpXG5cdFx0XHRcdFx0Lm9uQ2hhbmdlKGVuYWJsZV9zeXN0ZW1fY29tbWFuZHMgPT4ge1xuXHRcdFx0XHRcdFx0dGhpcy5wbHVnaW4uc2V0dGluZ3MuZW5hYmxlX3N5c3RlbV9jb21tYW5kcyA9IGVuYWJsZV9zeXN0ZW1fY29tbWFuZHM7XG5cdFx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcblx0XHRcdFx0XHRcdC8vIEZvcmNlIHJlZnJlc2hcblx0XHRcdFx0XHRcdHRoaXMuZGlzcGxheSgpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cblx0XHRpZiAodGhpcy5wbHVnaW4uc2V0dGluZ3MuZW5hYmxlX3N5c3RlbV9jb21tYW5kcykge1x0XG5cdFx0XHRkZXNjID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXHRcdFx0ZGVzYy5hcHBlbmQoXG5cdFx0XHRcdFwiRnVsbCBwYXRoIHRvIHRoZSBzaGVsbCBiaW5hcnkgdG8gZXhlY3V0ZSB0aGUgY29tbWFuZCB3aXRoLlwiLFxuXHRcdFx0XHRkZXNjLmNyZWF0ZUVsKFwiYnJcIiksXG5cdFx0XHRcdFwiVGhpcyBzZXR0aW5nIGlzIG9wdGlvbmFsIGFuZCB3aWxsIGRlZmF1bHQgdG8gdGhlIHN5c3RlbSdzIGRlZmF1bHQgc2hlbGwgaWYgbm90IHNwZWNpZmllZC5cIixcblx0XHRcdFx0ZGVzYy5jcmVhdGVFbChcImJyXCIpLFxuXHRcdFx0XHRcIllvdSBjYW4gdXNlIGZvcndhcmQgc2xhc2hlcyAoJy8nKSBhcyBwYXRoIHNlcGFyYXRvcnMgb24gYWxsIHBsYXRmb3JtcyBpZiBpbiBkb3VidC5cIlxuXHRcdFx0KTtcblx0XHRcdG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuXHRcdFx0XHQuc2V0TmFtZShcIlNoZWxsIGJpbmFyeSBsb2NhdGlvblwiKVxuXHRcdFx0XHQuc2V0RGVzYyhkZXNjKVxuXHRcdFx0XHQuYWRkVGV4dCh0ZXh0ID0+IHtcblx0XHRcdFx0XHR0ZXh0LnNldFBsYWNlaG9sZGVyKFwiRXhhbXBsZTogL2Jpbi9iYXNoLCAuLi5cIilcblx0XHRcdFx0XHRcdC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5zaGVsbF9wYXRoKVxuXHRcdFx0XHRcdFx0Lm9uQ2hhbmdlKChzaGVsbF9wYXRoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdHRoaXMucGx1Z2luLnNldHRpbmdzLnNoZWxsX3BhdGggPSBzaGVsbF9wYXRoO1xuXHRcdFx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRsZXQgaSA9IDE7XG5cdFx0XHR0aGlzLnBsdWdpbi5zZXR0aW5ncy50ZW1wbGF0ZXNfcGFpcnMuZm9yRWFjaCgodGVtcGxhdGVfcGFpcikgPT4ge1xuXHRcdFx0XHRsZXQgZGl2ID0gY29udGFpbmVyRWwuY3JlYXRlRWwoJ2RpdicpO1xuXHRcdFx0XHRkaXYuYWRkQ2xhc3MoXCJ0ZW1wbGF0ZXJfZGl2XCIpO1xuXG5cdFx0XHRcdGxldCB0aXRsZSA9IGNvbnRhaW5lckVsLmNyZWF0ZUVsKCdoNCcsIHtcblx0XHRcdFx0XHR0ZXh0OiAnVXNlciBGdW5jdGlvbiBuwrAnICsgaSxcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHRpdGxlLmFkZENsYXNzKFwidGVtcGxhdGVyX3RpdGxlXCIpO1xuXG5cdFx0XHRcdGxldCBzZXR0aW5nID0gbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG5cdFx0XHRcdFx0LmFkZEV4dHJhQnV0dG9uKGV4dHJhID0+IHtcblx0XHRcdFx0XHRcdGV4dHJhLnNldEljb24oXCJjcm9zc1wiKVxuXHRcdFx0XHRcdFx0XHQuc2V0VG9vbHRpcChcIkRlbGV0ZVwiKVxuXHRcdFx0XHRcdFx0XHQub25DbGljaygoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0bGV0IGluZGV4ID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MudGVtcGxhdGVzX3BhaXJzLmluZGV4T2YodGVtcGxhdGVfcGFpcik7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGluZGV4ID4gLTEpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHRoaXMucGx1Z2luLnNldHRpbmdzLnRlbXBsYXRlc19wYWlycy5zcGxpY2UoaW5kZXgsIDEpO1xuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gRm9yY2UgcmVmcmVzaFxuXHRcdFx0XHRcdFx0XHRcdFx0dGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG5cdFx0XHRcdFx0XHRcdFx0XHR0aGlzLmRpc3BsYXkoKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuYWRkVGV4dCh0ZXh0ID0+IHtcblx0XHRcdFx0XHRcdFx0bGV0IHQgPSB0ZXh0LnNldFBsYWNlaG9sZGVyKCdGdW5jdGlvbiBuYW1lJylcblx0XHRcdFx0XHRcdFx0LnNldFZhbHVlKHRlbXBsYXRlX3BhaXJbMF0pXG5cdFx0XHRcdFx0XHRcdC5vbkNoYW5nZSgobmV3X3ZhbHVlKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0bGV0IGluZGV4ID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MudGVtcGxhdGVzX3BhaXJzLmluZGV4T2YodGVtcGxhdGVfcGFpcik7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGluZGV4ID4gLTEpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHRoaXMucGx1Z2luLnNldHRpbmdzLnRlbXBsYXRlc19wYWlyc1tpbmRleF1bMF0gPSBuZXdfdmFsdWU7XG5cdFx0XHRcdFx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHR0LmlucHV0RWwuYWRkQ2xhc3MoXCJ0ZW1wbGF0ZXJfdGVtcGxhdGVcIik7XG5cblx0XHRcdFx0XHRcdFx0cmV0dXJuIHQ7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0KVxuXHRcdFx0XHRcdC5hZGRUZXh0QXJlYSh0ZXh0ID0+IHtcblx0XHRcdFx0XHRcdGxldCB0ID0gdGV4dC5zZXRQbGFjZWhvbGRlcignU3lzdGVtIENvbW1hbmQnKVxuXHRcdFx0XHRcdFx0LnNldFZhbHVlKHRlbXBsYXRlX3BhaXJbMV0pXG5cdFx0XHRcdFx0XHQub25DaGFuZ2UoKG5ld19jbWQpID0+IHtcblx0XHRcdFx0XHRcdFx0bGV0IGluZGV4ID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MudGVtcGxhdGVzX3BhaXJzLmluZGV4T2YodGVtcGxhdGVfcGFpcik7XG5cdFx0XHRcdFx0XHRcdGlmIChpbmRleCA+IC0xKSB7XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5wbHVnaW4uc2V0dGluZ3MudGVtcGxhdGVzX3BhaXJzW2luZGV4XVsxXSA9IG5ld19jbWQ7XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHR0LmlucHV0RWwuc2V0QXR0cihcInJvd3NcIiwgNCk7XG5cdFx0XHRcdFx0XHR0LmlucHV0RWwuYWRkQ2xhc3MoXCJ0ZW1wbGF0ZXJfY21kXCIpO1xuXG5cdFx0XHRcdFx0XHRyZXR1cm4gdDtcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRzZXR0aW5nLmluZm9FbC5yZW1vdmUoKTtcblxuXHRcdFx0XHRkaXYuYXBwZW5kQ2hpbGQodGl0bGUpO1xuXHRcdFx0XHRkaXYuYXBwZW5kQ2hpbGQoY29udGFpbmVyRWwubGFzdENoaWxkKTtcblxuXHRcdFx0XHRpKz0xO1xuXHRcdFx0fSk7XG5cblx0XHRcdGxldCBkaXYgPSBjb250YWluZXJFbC5jcmVhdGVFbCgnZGl2Jyk7XG5cdFx0XHRkaXYuYWRkQ2xhc3MoXCJ0ZW1wbGF0ZXJfZGl2MlwiKTtcblxuXHRcdFx0bGV0IHNldHRpbmcgPSBuZXcgU2V0dGluZyhjb250YWluZXJFbClcblx0XHRcdFx0LmFkZEJ1dHRvbihidXR0b24gPT4ge1xuXHRcdFx0XHRcdGxldCBiID0gYnV0dG9uLnNldEJ1dHRvblRleHQoXCJBZGQgTmV3IFVzZXIgRnVuY3Rpb25cIikub25DbGljaygoKSA9PiB7XG5cdFx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zZXR0aW5ncy50ZW1wbGF0ZXNfcGFpcnMucHVzaChbXCJcIiwgXCJcIl0pO1xuXHRcdFx0XHRcdFx0Ly8gRm9yY2UgcmVmcmVzaFxuXHRcdFx0XHRcdFx0dGhpcy5kaXNwbGF5KCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0Yi5idXR0b25FbC5hZGRDbGFzcyhcInRlbXBsYXRlcl9idXR0b25cIik7XG5cblx0XHRcdFx0XHRyZXR1cm4gYjtcblx0XHRcdFx0fSk7XG5cdFx0XHRzZXR0aW5nLmluZm9FbC5yZW1vdmUoKTtcblxuXHRcdFx0ZGl2LmFwcGVuZENoaWxkKGNvbnRhaW5lckVsLmxhc3RDaGlsZCk7XG5cdFx0fVx0XG5cdH1cbn0iLCJpbXBvcnQgeyBBcHAsIG5vcm1hbGl6ZVBhdGgsIFRBYnN0cmFjdEZpbGUsIFRGaWxlLCBURm9sZGVyLCBWYXVsdCB9IGZyb20gXCJvYnNpZGlhblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gZGVsYXkobXM6IG51bWJlcikge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSggcmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIG1zKSApO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGVzY2FwZVJlZ0V4cChzdHI6IHN0cmluZykge1xuICAgIHJldHVybiBzdHIucmVwbGFjZSgvWy4qKz9eJHt9KCl8W1xcXVxcXFxdL2csICdcXFxcJCYnKTsgLy8gJCYgbWVhbnMgdGhlIHdob2xlIG1hdGNoZWQgc3RyaW5nXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRURmlsZXNGcm9tRm9sZGVyKGFwcDogQXBwLCBmb2xkZXJfc3RyOiBzdHJpbmcpOiBBcnJheTxURmlsZT4ge1xuICAgIGZvbGRlcl9zdHIgPSBub3JtYWxpemVQYXRoKGZvbGRlcl9zdHIpO1xuXG4gICAgbGV0IGZvbGRlciA9IGFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoZm9sZGVyX3N0cik7XG4gICAgaWYgKCFmb2xkZXIpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke2ZvbGRlcl9zdHJ9IGZvbGRlciBkb2Vzbid0IGV4aXN0YCk7XG4gICAgfVxuICAgIGlmICghKGZvbGRlciBpbnN0YW5jZW9mIFRGb2xkZXIpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtmb2xkZXJfc3RyfSBpcyBhIGZpbGUsIG5vdCBhIGZvbGRlcmApO1xuICAgIH1cblxuICAgIGxldCBmaWxlczogQXJyYXk8VEZpbGU+ID0gW107XG4gICAgVmF1bHQucmVjdXJzZUNoaWxkcmVuKGZvbGRlciwgKGZpbGU6IFRBYnN0cmFjdEZpbGUpID0+IHtcbiAgICAgICAgaWYgKGZpbGUgaW5zdGFuY2VvZiBURmlsZSkge1xuICAgICAgICAgICAgZmlsZXMucHVzaChmaWxlKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgZmlsZXMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICByZXR1cm4gYS5iYXNlbmFtZS5sb2NhbGVDb21wYXJlKGIuYmFzZW5hbWUpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGZpbGVzO1xufSIsImltcG9ydCB7IEFwcCwgRnV6enlTdWdnZXN0TW9kYWwsIFRGaWxlLCBURm9sZGVyLCBub3JtYWxpemVQYXRoLCBWYXVsdCwgVEFic3RyYWN0RmlsZSB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgZ2V0VEZpbGVzRnJvbUZvbGRlciB9IGZyb20gXCJVdGlsc1wiO1xuaW1wb3J0IFRlbXBsYXRlclBsdWdpbiBmcm9tICcuL21haW4nO1xuXG5leHBvcnQgZW51bSBPcGVuTW9kZSB7XG4gICAgSW5zZXJ0VGVtcGxhdGUsXG4gICAgQ3JlYXRlTm90ZVRlbXBsYXRlLFxufTtcblxuZXhwb3J0IGNsYXNzIFRlbXBsYXRlckZ1enp5U3VnZ2VzdE1vZGFsIGV4dGVuZHMgRnV6enlTdWdnZXN0TW9kYWw8VEZpbGU+IHtcbiAgICBwdWJsaWMgYXBwOiBBcHA7XG4gICAgcHJpdmF0ZSBwbHVnaW46IFRlbXBsYXRlclBsdWdpbjtcbiAgICBwcml2YXRlIG9wZW5fbW9kZTogT3Blbk1vZGU7XG4gICAgcHJpdmF0ZSBjcmVhdGlvbl9mb2xkZXI6IFRGb2xkZXI7XG5cbiAgICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgcGx1Z2luOiBUZW1wbGF0ZXJQbHVnaW4pIHtcbiAgICAgICAgc3VwZXIoYXBwKTtcbiAgICAgICAgdGhpcy5hcHAgPSBhcHA7XG4gICAgICAgIHRoaXMucGx1Z2luID0gcGx1Z2luO1xuICAgIH1cblxuICAgIGdldEl0ZW1zKCk6IFRGaWxlW10ge1xuICAgICAgICBsZXQgdGVtcGxhdGVfZmlsZXM6IFRGaWxlW10gPSBbXTtcblxuICAgICAgICBpZiAodGhpcy5wbHVnaW4uc2V0dGluZ3MudGVtcGxhdGVfZm9sZGVyID09PSBcIlwiKSB7XG4gICAgICAgICAgICB0ZW1wbGF0ZV9maWxlcyA9IHRoaXMuYXBwLnZhdWx0LmdldE1hcmtkb3duRmlsZXMoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRlbXBsYXRlX2ZpbGVzID0gZ2V0VEZpbGVzRnJvbUZvbGRlcih0aGlzLmFwcCwgdGhpcy5wbHVnaW4uc2V0dGluZ3MudGVtcGxhdGVfZm9sZGVyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGVtcGxhdGVfZmlsZXM7XG4gICAgfVxuXG4gICAgZ2V0SXRlbVRleHQoaXRlbTogVEZpbGUpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gaXRlbS5iYXNlbmFtZTtcbiAgICB9XG5cbiAgICBvbkNob29zZUl0ZW0oaXRlbTogVEZpbGUsIF9ldnQ6IE1vdXNlRXZlbnQgfCBLZXlib2FyZEV2ZW50KTogdm9pZCB7XG4gICAgICAgIHN3aXRjaCh0aGlzLm9wZW5fbW9kZSkge1xuICAgICAgICAgICAgY2FzZSBPcGVuTW9kZS5JbnNlcnRUZW1wbGF0ZTpcbiAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5wYXJzZXIucmVwbGFjZV90ZW1wbGF0ZXNfYW5kX2FwcGVuZChpdGVtKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgT3Blbk1vZGUuQ3JlYXRlTm90ZVRlbXBsYXRlOlxuICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnBhcnNlci5jcmVhdGVfbmV3X25vdGVfZnJvbV90ZW1wbGF0ZShpdGVtLCB0aGlzLmNyZWF0aW9uX2ZvbGRlcik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGFydCgpOiB2b2lkIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBmaWxlcyA9IHRoaXMuZ2V0SXRlbXMoKTtcbiAgICAgICAgICAgIC8vIElmIHRoZXJlIGlzIG9ubHkgb25lIGZpbGUgaW4gdGhlIHRlbXBsYXRlcyBkaXJlY3RvcnksIHdlIGRvbid0IG9wZW4gdGhlIG1vZGFsXG4gICAgICAgICAgICBpZiAoZmlsZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbkNob29zZUl0ZW0oZmlsZXNbMF0sIG51bGwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vcGVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLmxvZ19lcnJvcihlcnJvcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpbnNlcnRfdGVtcGxhdGUoKTogdm9pZCB7XG4gICAgICAgIHRoaXMub3Blbl9tb2RlID0gT3Blbk1vZGUuSW5zZXJ0VGVtcGxhdGU7XG4gICAgICAgIHRoaXMuc3RhcnQoKTtcbiAgICB9XG5cbiAgICBjcmVhdGVfbmV3X25vdGVfZnJvbV90ZW1wbGF0ZShmb2xkZXI/OiBURm9sZGVyKSB7XG4gICAgICAgIHRoaXMuY3JlYXRpb25fZm9sZGVyID0gZm9sZGVyO1xuICAgICAgICB0aGlzLm9wZW5fbW9kZSA9IE9wZW5Nb2RlLkNyZWF0ZU5vdGVUZW1wbGF0ZTtcbiAgICAgICAgdGhpcy5zdGFydCgpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IGV4aXN0c1N5bmMsIHJlYWRGaWxlU3luYyB9IGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5cbi8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cclxuXHJcblBlcm1pc3Npb24gdG8gdXNlLCBjb3B5LCBtb2RpZnksIGFuZC9vciBkaXN0cmlidXRlIHRoaXMgc29mdHdhcmUgZm9yIGFueVxyXG5wdXJwb3NlIHdpdGggb3Igd2l0aG91dCBmZWUgaXMgaGVyZWJ5IGdyYW50ZWQuXHJcblxyXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiIEFORCBUSEUgQVVUSE9SIERJU0NMQUlNUyBBTEwgV0FSUkFOVElFUyBXSVRIXHJcblJFR0FSRCBUTyBUSElTIFNPRlRXQVJFIElOQ0xVRElORyBBTEwgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWVxyXG5BTkQgRklUTkVTUy4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUiBCRSBMSUFCTEUgRk9SIEFOWSBTUEVDSUFMLCBESVJFQ1QsXHJcbklORElSRUNULCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgT1IgQU5ZIERBTUFHRVMgV0hBVFNPRVZFUiBSRVNVTFRJTkcgRlJPTVxyXG5MT1NTIE9GIFVTRSwgREFUQSBPUiBQUk9GSVRTLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgTkVHTElHRU5DRSBPUlxyXG5PVEhFUiBUT1JUSU9VUyBBQ1RJT04sIEFSSVNJTkcgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgVVNFIE9SXHJcblBFUkZPUk1BTkNFIE9GIFRISVMgU09GVFdBUkUuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcblxyXG52YXIgX19hc3NpZ24gPSBmdW5jdGlvbigpIHtcclxuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbih0KSB7XHJcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSkgdFtwXSA9IHNbcF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfTtcclxuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59O1xuXG5mdW5jdGlvbiBzZXRQcm90b3R5cGVPZihvYmosIHByb3RvKSB7XHJcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcclxuICAgIGlmIChPYmplY3Quc2V0UHJvdG90eXBlT2YpIHtcclxuICAgICAgICBPYmplY3Quc2V0UHJvdG90eXBlT2Yob2JqLCBwcm90byk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBvYmouX19wcm90b19fID0gcHJvdG87XHJcbiAgICB9XHJcbn1cclxuLy8gVGhpcyBpcyBwcmV0dHkgbXVjaCB0aGUgb25seSB3YXkgdG8gZ2V0IG5pY2UsIGV4dGVuZGVkIEVycm9yc1xyXG4vLyB3aXRob3V0IHVzaW5nIEVTNlxyXG4vKipcclxuICogVGhpcyByZXR1cm5zIGEgbmV3IEVycm9yIHdpdGggYSBjdXN0b20gcHJvdG90eXBlLiBOb3RlIHRoYXQgaXQncyBfbm90XyBhIGNvbnN0cnVjdG9yXHJcbiAqXHJcbiAqIEBwYXJhbSBtZXNzYWdlIEVycm9yIG1lc3NhZ2VcclxuICpcclxuICogKipFeGFtcGxlKipcclxuICpcclxuICogYGBganNcclxuICogdGhyb3cgRXRhRXJyKFwidGVtcGxhdGUgbm90IGZvdW5kXCIpXHJcbiAqIGBgYFxyXG4gKi9cclxuZnVuY3Rpb24gRXRhRXJyKG1lc3NhZ2UpIHtcclxuICAgIHZhciBlcnIgPSBuZXcgRXJyb3IobWVzc2FnZSk7XHJcbiAgICBzZXRQcm90b3R5cGVPZihlcnIsIEV0YUVyci5wcm90b3R5cGUpO1xyXG4gICAgcmV0dXJuIGVycjtcclxufVxyXG5FdGFFcnIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShFcnJvci5wcm90b3R5cGUsIHtcclxuICAgIG5hbWU6IHsgdmFsdWU6ICdFdGEgRXJyb3InLCBlbnVtZXJhYmxlOiBmYWxzZSB9XHJcbn0pO1xyXG4vKipcclxuICogVGhyb3dzIGFuIEV0YUVyciB3aXRoIGEgbmljZWx5IGZvcm1hdHRlZCBlcnJvciBhbmQgbWVzc2FnZSBzaG93aW5nIHdoZXJlIGluIHRoZSB0ZW1wbGF0ZSB0aGUgZXJyb3Igb2NjdXJyZWQuXHJcbiAqL1xyXG5mdW5jdGlvbiBQYXJzZUVycihtZXNzYWdlLCBzdHIsIGluZHgpIHtcclxuICAgIHZhciB3aGl0ZXNwYWNlID0gc3RyLnNsaWNlKDAsIGluZHgpLnNwbGl0KC9cXG4vKTtcclxuICAgIHZhciBsaW5lTm8gPSB3aGl0ZXNwYWNlLmxlbmd0aDtcclxuICAgIHZhciBjb2xObyA9IHdoaXRlc3BhY2VbbGluZU5vIC0gMV0ubGVuZ3RoICsgMTtcclxuICAgIG1lc3NhZ2UgKz1cclxuICAgICAgICAnIGF0IGxpbmUgJyArXHJcbiAgICAgICAgICAgIGxpbmVObyArXHJcbiAgICAgICAgICAgICcgY29sICcgK1xyXG4gICAgICAgICAgICBjb2xObyArXHJcbiAgICAgICAgICAgICc6XFxuXFxuJyArXHJcbiAgICAgICAgICAgICcgICcgK1xyXG4gICAgICAgICAgICBzdHIuc3BsaXQoL1xcbi8pW2xpbmVObyAtIDFdICtcclxuICAgICAgICAgICAgJ1xcbicgK1xyXG4gICAgICAgICAgICAnICAnICtcclxuICAgICAgICAgICAgQXJyYXkoY29sTm8pLmpvaW4oJyAnKSArXHJcbiAgICAgICAgICAgICdeJztcclxuICAgIHRocm93IEV0YUVycihtZXNzYWdlKTtcclxufVxuXG4vKipcclxuICogQHJldHVybnMgVGhlIGdsb2JhbCBQcm9taXNlIGZ1bmN0aW9uXHJcbiAqL1xyXG52YXIgcHJvbWlzZUltcGwgPSBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKS5Qcm9taXNlO1xyXG4vKipcclxuICogQHJldHVybnMgQSBuZXcgQXN5bmNGdW5jdGlvbiBjb25zdHVjdG9yXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRBc3luY0Z1bmN0aW9uQ29uc3RydWN0b3IoKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHJldHVybiBuZXcgRnVuY3Rpb24oJ3JldHVybiAoYXN5bmMgZnVuY3Rpb24oKXt9KS5jb25zdHJ1Y3RvcicpKCk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgIGlmIChlIGluc3RhbmNlb2YgU3ludGF4RXJyb3IpIHtcclxuICAgICAgICAgICAgdGhyb3cgRXRhRXJyKFwiVGhpcyBlbnZpcm9ubWVudCBkb2Vzbid0IHN1cHBvcnQgYXN5bmMvYXdhaXRcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4vKipcclxuICogc3RyLnRyaW1MZWZ0IHBvbHlmaWxsXHJcbiAqXHJcbiAqIEBwYXJhbSBzdHIgLSBJbnB1dCBzdHJpbmdcclxuICogQHJldHVybnMgVGhlIHN0cmluZyB3aXRoIGxlZnQgd2hpdGVzcGFjZSByZW1vdmVkXHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiB0cmltTGVmdChzdHIpIHtcclxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1leHRyYS1ib29sZWFuLWNhc3RcclxuICAgIGlmICghIVN0cmluZy5wcm90b3R5cGUudHJpbUxlZnQpIHtcclxuICAgICAgICByZXR1cm4gc3RyLnRyaW1MZWZ0KCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gc3RyLnJlcGxhY2UoL15cXHMrLywgJycpO1xyXG4gICAgfVxyXG59XHJcbi8qKlxyXG4gKiBzdHIudHJpbVJpZ2h0IHBvbHlmaWxsXHJcbiAqXHJcbiAqIEBwYXJhbSBzdHIgLSBJbnB1dCBzdHJpbmdcclxuICogQHJldHVybnMgVGhlIHN0cmluZyB3aXRoIHJpZ2h0IHdoaXRlc3BhY2UgcmVtb3ZlZFxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gdHJpbVJpZ2h0KHN0cikge1xyXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWV4dHJhLWJvb2xlYW4tY2FzdFxyXG4gICAgaWYgKCEhU3RyaW5nLnByb3RvdHlwZS50cmltUmlnaHQpIHtcclxuICAgICAgICByZXR1cm4gc3RyLnRyaW1SaWdodCgpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9cXHMrJC8sICcnKTsgLy8gVE9ETzogZG8gd2UgcmVhbGx5IG5lZWQgdG8gcmVwbGFjZSBCT00ncz9cclxuICAgIH1cclxufVxuXG4vLyBUT0RPOiBhbGxvdyAnLScgdG8gdHJpbSB1cCB1bnRpbCBuZXdsaW5lLiBVc2UgW15cXFNcXG5cXHJdIGluc3RlYWQgb2YgXFxzXHJcbi8qIEVORCBUWVBFUyAqL1xyXG5mdW5jdGlvbiBoYXNPd25Qcm9wKG9iaiwgcHJvcCkge1xyXG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApO1xyXG59XHJcbmZ1bmN0aW9uIGNvcHlQcm9wcyh0b09iaiwgZnJvbU9iaikge1xyXG4gICAgZm9yICh2YXIga2V5IGluIGZyb21PYmopIHtcclxuICAgICAgICBpZiAoaGFzT3duUHJvcChmcm9tT2JqLCBrZXkpKSB7XHJcbiAgICAgICAgICAgIHRvT2JqW2tleV0gPSBmcm9tT2JqW2tleV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRvT2JqO1xyXG59XHJcbi8qKlxyXG4gKiBUYWtlcyBhIHN0cmluZyB3aXRoaW4gYSB0ZW1wbGF0ZSBhbmQgdHJpbXMgaXQsIGJhc2VkIG9uIHRoZSBwcmVjZWRpbmcgdGFnJ3Mgd2hpdGVzcGFjZSBjb250cm9sIGFuZCBgY29uZmlnLmF1dG9UcmltYFxyXG4gKi9cclxuZnVuY3Rpb24gdHJpbVdTKHN0ciwgY29uZmlnLCB3c0xlZnQsIHdzUmlnaHQpIHtcclxuICAgIHZhciBsZWZ0VHJpbTtcclxuICAgIHZhciByaWdodFRyaW07XHJcbiAgICBpZiAoQXJyYXkuaXNBcnJheShjb25maWcuYXV0b1RyaW0pKSB7XHJcbiAgICAgICAgLy8ga2luZGEgY29uZnVzaW5nXHJcbiAgICAgICAgLy8gYnV0IF99fSB3aWxsIHRyaW0gdGhlIGxlZnQgc2lkZSBvZiB0aGUgZm9sbG93aW5nIHN0cmluZ1xyXG4gICAgICAgIGxlZnRUcmltID0gY29uZmlnLmF1dG9UcmltWzFdO1xyXG4gICAgICAgIHJpZ2h0VHJpbSA9IGNvbmZpZy5hdXRvVHJpbVswXTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGxlZnRUcmltID0gcmlnaHRUcmltID0gY29uZmlnLmF1dG9UcmltO1xyXG4gICAgfVxyXG4gICAgaWYgKHdzTGVmdCB8fCB3c0xlZnQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgbGVmdFRyaW0gPSB3c0xlZnQ7XHJcbiAgICB9XHJcbiAgICBpZiAod3NSaWdodCB8fCB3c1JpZ2h0ID09PSBmYWxzZSkge1xyXG4gICAgICAgIHJpZ2h0VHJpbSA9IHdzUmlnaHQ7XHJcbiAgICB9XHJcbiAgICBpZiAoIXJpZ2h0VHJpbSAmJiAhbGVmdFRyaW0pIHtcclxuICAgICAgICByZXR1cm4gc3RyO1xyXG4gICAgfVxyXG4gICAgaWYgKGxlZnRUcmltID09PSAnc2x1cnAnICYmIHJpZ2h0VHJpbSA9PT0gJ3NsdXJwJykge1xyXG4gICAgICAgIHJldHVybiBzdHIudHJpbSgpO1xyXG4gICAgfVxyXG4gICAgaWYgKGxlZnRUcmltID09PSAnXycgfHwgbGVmdFRyaW0gPT09ICdzbHVycCcpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygndHJpbW1pbmcgbGVmdCcgKyBsZWZ0VHJpbSlcclxuICAgICAgICAvLyBmdWxsIHNsdXJwXHJcbiAgICAgICAgc3RyID0gdHJpbUxlZnQoc3RyKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGxlZnRUcmltID09PSAnLScgfHwgbGVmdFRyaW0gPT09ICdubCcpIHtcclxuICAgICAgICAvLyBubCB0cmltXHJcbiAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UoL14oPzpcXHJcXG58XFxufFxccikvLCAnJyk7XHJcbiAgICB9XHJcbiAgICBpZiAocmlnaHRUcmltID09PSAnXycgfHwgcmlnaHRUcmltID09PSAnc2x1cnAnKSB7XHJcbiAgICAgICAgLy8gZnVsbCBzbHVycFxyXG4gICAgICAgIHN0ciA9IHRyaW1SaWdodChzdHIpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAocmlnaHRUcmltID09PSAnLScgfHwgcmlnaHRUcmltID09PSAnbmwnKSB7XHJcbiAgICAgICAgLy8gbmwgdHJpbVxyXG4gICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKC8oPzpcXHJcXG58XFxufFxccikkLywgJycpOyAvLyBUT0RPOiBtYWtlIHN1cmUgdGhpcyBnZXRzIFxcclxcblxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHN0cjtcclxufVxyXG4vKipcclxuICogQSBtYXAgb2Ygc3BlY2lhbCBIVE1MIGNoYXJhY3RlcnMgdG8gdGhlaXIgWE1MLWVzY2FwZWQgZXF1aXZhbGVudHNcclxuICovXHJcbnZhciBlc2NNYXAgPSB7XHJcbiAgICAnJic6ICcmYW1wOycsXHJcbiAgICAnPCc6ICcmbHQ7JyxcclxuICAgICc+JzogJyZndDsnLFxyXG4gICAgJ1wiJzogJyZxdW90OycsXHJcbiAgICBcIidcIjogJyYjMzk7J1xyXG59O1xyXG5mdW5jdGlvbiByZXBsYWNlQ2hhcihzKSB7XHJcbiAgICByZXR1cm4gZXNjTWFwW3NdO1xyXG59XHJcbi8qKlxyXG4gKiBYTUwtZXNjYXBlcyBhbiBpbnB1dCB2YWx1ZSBhZnRlciBjb252ZXJ0aW5nIGl0IHRvIGEgc3RyaW5nXHJcbiAqXHJcbiAqIEBwYXJhbSBzdHIgLSBJbnB1dCB2YWx1ZSAodXN1YWxseSBhIHN0cmluZylcclxuICogQHJldHVybnMgWE1MLWVzY2FwZWQgc3RyaW5nXHJcbiAqL1xyXG5mdW5jdGlvbiBYTUxFc2NhcGUoc3RyKSB7XHJcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcclxuICAgIC8vIFRvIGRlYWwgd2l0aCBYU1MuIEJhc2VkIG9uIEVzY2FwZSBpbXBsZW1lbnRhdGlvbnMgb2YgTXVzdGFjaGUuSlMgYW5kIE1hcmtvLCB0aGVuIGN1c3RvbWl6ZWQuXHJcbiAgICB2YXIgbmV3U3RyID0gU3RyaW5nKHN0cik7XHJcbiAgICBpZiAoL1smPD5cIiddLy50ZXN0KG5ld1N0cikpIHtcclxuICAgICAgICByZXR1cm4gbmV3U3RyLnJlcGxhY2UoL1smPD5cIiddL2csIHJlcGxhY2VDaGFyKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBuZXdTdHI7XHJcbiAgICB9XHJcbn1cblxuLyogRU5EIFRZUEVTICovXHJcbnZhciB0ZW1wbGF0ZUxpdFJlZyA9IC9gKD86XFxcXFtcXHNcXFNdfFxcJHsoPzpbXnt9XXx7KD86W157fV18e1tefV0qfSkqfSkqfXwoPyFcXCR7KVteXFxcXGBdKSpgL2c7XHJcbnZhciBzaW5nbGVRdW90ZVJlZyA9IC8nKD86XFxcXFtcXHNcXHdcIidcXFxcYF18W15cXG5cXHInXFxcXF0pKj8nL2c7XHJcbnZhciBkb3VibGVRdW90ZVJlZyA9IC9cIig/OlxcXFxbXFxzXFx3XCInXFxcXGBdfFteXFxuXFxyXCJcXFxcXSkqP1wiL2c7XHJcbi8qKiBFc2NhcGUgc3BlY2lhbCByZWd1bGFyIGV4cHJlc3Npb24gY2hhcmFjdGVycyBpbnNpZGUgYSBzdHJpbmcgKi9cclxuZnVuY3Rpb24gZXNjYXBlUmVnRXhwKHN0cmluZykge1xyXG4gICAgLy8gRnJvbSBNRE5cclxuICAgIHJldHVybiBzdHJpbmcucmVwbGFjZSgvWy4qK1xcLT9eJHt9KCl8W1xcXVxcXFxdL2csICdcXFxcJCYnKTsgLy8gJCYgbWVhbnMgdGhlIHdob2xlIG1hdGNoZWQgc3RyaW5nXHJcbn1cclxuZnVuY3Rpb24gcGFyc2Uoc3RyLCBjb25maWcpIHtcclxuICAgIHZhciBidWZmZXIgPSBbXTtcclxuICAgIHZhciB0cmltTGVmdE9mTmV4dFN0ciA9IGZhbHNlO1xyXG4gICAgdmFyIGxhc3RJbmRleCA9IDA7XHJcbiAgICB2YXIgcGFyc2VPcHRpb25zID0gY29uZmlnLnBhcnNlO1xyXG4gICAgaWYgKGNvbmZpZy5wbHVnaW5zKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb25maWcucGx1Z2lucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgcGx1Z2luID0gY29uZmlnLnBsdWdpbnNbaV07XHJcbiAgICAgICAgICAgIGlmIChwbHVnaW4ucHJvY2Vzc1RlbXBsYXRlKSB7XHJcbiAgICAgICAgICAgICAgICBzdHIgPSBwbHVnaW4ucHJvY2Vzc1RlbXBsYXRlKHN0ciwgY29uZmlnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qIEFkZGluZyBmb3IgRUpTIGNvbXBhdGliaWxpdHkgKi9cclxuICAgIGlmIChjb25maWcucm1XaGl0ZXNwYWNlKSB7XHJcbiAgICAgICAgLy8gQ29kZSB0YWtlbiBkaXJlY3RseSBmcm9tIEVKU1xyXG4gICAgICAgIC8vIEhhdmUgdG8gdXNlIHR3byBzZXBhcmF0ZSByZXBsYWNlcyBoZXJlIGFzIGBeYCBhbmQgYCRgIG9wZXJhdG9ycyBkb24ndFxyXG4gICAgICAgIC8vIHdvcmsgd2VsbCB3aXRoIGBcXHJgIGFuZCBlbXB0eSBsaW5lcyBkb24ndCB3b3JrIHdlbGwgd2l0aCB0aGUgYG1gIGZsYWcuXHJcbiAgICAgICAgLy8gRXNzZW50aWFsbHksIHRoaXMgcmVwbGFjZXMgdGhlIHdoaXRlc3BhY2UgYXQgdGhlIGJlZ2lubmluZyBhbmQgZW5kIG9mXHJcbiAgICAgICAgLy8gZWFjaCBsaW5lIGFuZCByZW1vdmVzIG11bHRpcGxlIG5ld2xpbmVzLlxyXG4gICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKC9bXFxyXFxuXSsvZywgJ1xcbicpLnJlcGxhY2UoL15cXHMrfFxccyskL2dtLCAnJyk7XHJcbiAgICB9XHJcbiAgICAvKiBFbmQgcm1XaGl0ZXNwYWNlIG9wdGlvbiAqL1xyXG4gICAgdGVtcGxhdGVMaXRSZWcubGFzdEluZGV4ID0gMDtcclxuICAgIHNpbmdsZVF1b3RlUmVnLmxhc3RJbmRleCA9IDA7XHJcbiAgICBkb3VibGVRdW90ZVJlZy5sYXN0SW5kZXggPSAwO1xyXG4gICAgZnVuY3Rpb24gcHVzaFN0cmluZyhzdHJuZywgc2hvdWxkVHJpbVJpZ2h0T2ZTdHJpbmcpIHtcclxuICAgICAgICBpZiAoc3RybmcpIHtcclxuICAgICAgICAgICAgLy8gaWYgc3RyaW5nIGlzIHRydXRoeSBpdCBtdXN0IGJlIG9mIHR5cGUgJ3N0cmluZydcclxuICAgICAgICAgICAgc3RybmcgPSB0cmltV1Moc3RybmcsIGNvbmZpZywgdHJpbUxlZnRPZk5leHRTdHIsIC8vIHRoaXMgd2lsbCBvbmx5IGJlIGZhbHNlIG9uIHRoZSBmaXJzdCBzdHIsIHRoZSBuZXh0IG9uZXMgd2lsbCBiZSBudWxsIG9yIHVuZGVmaW5lZFxyXG4gICAgICAgICAgICBzaG91bGRUcmltUmlnaHRPZlN0cmluZyk7XHJcbiAgICAgICAgICAgIGlmIChzdHJuZykge1xyXG4gICAgICAgICAgICAgICAgLy8gcmVwbGFjZSBcXCB3aXRoIFxcXFwsICcgd2l0aCBcXCdcclxuICAgICAgICAgICAgICAgIC8vIHdlJ3JlIGdvaW5nIHRvIGNvbnZlcnQgYWxsIENSTEYgdG8gTEYgc28gaXQgZG9lc24ndCB0YWtlIG1vcmUgdGhhbiBvbmUgcmVwbGFjZVxyXG4gICAgICAgICAgICAgICAgc3RybmcgPSBzdHJuZy5yZXBsYWNlKC9cXFxcfCcvZywgJ1xcXFwkJicpLnJlcGxhY2UoL1xcclxcbnxcXG58XFxyL2csICdcXFxcbicpO1xyXG4gICAgICAgICAgICAgICAgYnVmZmVyLnB1c2goc3RybmcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgdmFyIHByZWZpeGVzID0gW3BhcnNlT3B0aW9ucy5leGVjLCBwYXJzZU9wdGlvbnMuaW50ZXJwb2xhdGUsIHBhcnNlT3B0aW9ucy5yYXddLnJlZHVjZShmdW5jdGlvbiAoYWNjdW11bGF0b3IsIHByZWZpeCkge1xyXG4gICAgICAgIGlmIChhY2N1bXVsYXRvciAmJiBwcmVmaXgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGFjY3VtdWxhdG9yICsgJ3wnICsgZXNjYXBlUmVnRXhwKHByZWZpeCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHByZWZpeCkge1xyXG4gICAgICAgICAgICAvLyBhY2N1bXVsYXRvciBpcyBmYWxzeVxyXG4gICAgICAgICAgICByZXR1cm4gZXNjYXBlUmVnRXhwKHByZWZpeCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBwcmVmaXggYW5kIGFjY3VtdWxhdG9yIGFyZSBib3RoIGZhbHN5XHJcbiAgICAgICAgICAgIHJldHVybiBhY2N1bXVsYXRvcjtcclxuICAgICAgICB9XHJcbiAgICB9LCAnJyk7XHJcbiAgICB2YXIgcGFyc2VPcGVuUmVnID0gbmV3IFJlZ0V4cCgnKFteXSo/KScgKyBlc2NhcGVSZWdFeHAoY29uZmlnLnRhZ3NbMF0pICsgJygtfF8pP1xcXFxzKignICsgcHJlZml4ZXMgKyAnKT9cXFxccyonLCAnZycpO1xyXG4gICAgdmFyIHBhcnNlQ2xvc2VSZWcgPSBuZXcgUmVnRXhwKCdcXCd8XCJ8YHxcXFxcL1xcXFwqfChcXFxccyooLXxfKT8nICsgZXNjYXBlUmVnRXhwKGNvbmZpZy50YWdzWzFdKSArICcpJywgJ2cnKTtcclxuICAgIC8vIFRPRE86IGJlbmNobWFyayBoYXZpbmcgdGhlIFxccyogb24gZWl0aGVyIHNpZGUgdnMgdXNpbmcgc3RyLnRyaW0oKVxyXG4gICAgdmFyIG07XHJcbiAgICB3aGlsZSAoKG0gPSBwYXJzZU9wZW5SZWcuZXhlYyhzdHIpKSkge1xyXG4gICAgICAgIGxhc3RJbmRleCA9IG1bMF0ubGVuZ3RoICsgbS5pbmRleDtcclxuICAgICAgICB2YXIgcHJlY2VkaW5nU3RyaW5nID0gbVsxXTtcclxuICAgICAgICB2YXIgd3NMZWZ0ID0gbVsyXTtcclxuICAgICAgICB2YXIgcHJlZml4ID0gbVszXSB8fCAnJzsgLy8gYnkgZGVmYXVsdCBlaXRoZXIgfiwgPSwgb3IgZW1wdHlcclxuICAgICAgICBwdXNoU3RyaW5nKHByZWNlZGluZ1N0cmluZywgd3NMZWZ0KTtcclxuICAgICAgICBwYXJzZUNsb3NlUmVnLmxhc3RJbmRleCA9IGxhc3RJbmRleDtcclxuICAgICAgICB2YXIgY2xvc2VUYWcgPSB2b2lkIDA7XHJcbiAgICAgICAgdmFyIGN1cnJlbnRPYmogPSBmYWxzZTtcclxuICAgICAgICB3aGlsZSAoKGNsb3NlVGFnID0gcGFyc2VDbG9zZVJlZy5leGVjKHN0cikpKSB7XHJcbiAgICAgICAgICAgIGlmIChjbG9zZVRhZ1sxXSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSBzdHIuc2xpY2UobGFzdEluZGV4LCBjbG9zZVRhZy5pbmRleCk7XHJcbiAgICAgICAgICAgICAgICBwYXJzZU9wZW5SZWcubGFzdEluZGV4ID0gbGFzdEluZGV4ID0gcGFyc2VDbG9zZVJlZy5sYXN0SW5kZXg7XHJcbiAgICAgICAgICAgICAgICB0cmltTGVmdE9mTmV4dFN0ciA9IGNsb3NlVGFnWzJdO1xyXG4gICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRUeXBlID0gcHJlZml4ID09PSBwYXJzZU9wdGlvbnMuZXhlY1xyXG4gICAgICAgICAgICAgICAgICAgID8gJ2UnXHJcbiAgICAgICAgICAgICAgICAgICAgOiBwcmVmaXggPT09IHBhcnNlT3B0aW9ucy5yYXdcclxuICAgICAgICAgICAgICAgICAgICAgICAgPyAncidcclxuICAgICAgICAgICAgICAgICAgICAgICAgOiBwcmVmaXggPT09IHBhcnNlT3B0aW9ucy5pbnRlcnBvbGF0ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnaSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJyc7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50T2JqID0geyB0OiBjdXJyZW50VHlwZSwgdmFsOiBjb250ZW50IH07XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciBjaGFyID0gY2xvc2VUYWdbMF07XHJcbiAgICAgICAgICAgICAgICBpZiAoY2hhciA9PT0gJy8qJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjb21tZW50Q2xvc2VJbmQgPSBzdHIuaW5kZXhPZignKi8nLCBwYXJzZUNsb3NlUmVnLmxhc3RJbmRleCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbW1lbnRDbG9zZUluZCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgUGFyc2VFcnIoJ3VuY2xvc2VkIGNvbW1lbnQnLCBzdHIsIGNsb3NlVGFnLmluZGV4KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VDbG9zZVJlZy5sYXN0SW5kZXggPSBjb21tZW50Q2xvc2VJbmQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChjaGFyID09PSBcIidcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHNpbmdsZVF1b3RlUmVnLmxhc3RJbmRleCA9IGNsb3NlVGFnLmluZGV4O1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzaW5nbGVRdW90ZU1hdGNoID0gc2luZ2xlUXVvdGVSZWcuZXhlYyhzdHIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzaW5nbGVRdW90ZU1hdGNoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlQ2xvc2VSZWcubGFzdEluZGV4ID0gc2luZ2xlUXVvdGVSZWcubGFzdEluZGV4O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgUGFyc2VFcnIoJ3VuY2xvc2VkIHN0cmluZycsIHN0ciwgY2xvc2VUYWcuaW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGNoYXIgPT09ICdcIicpIHtcclxuICAgICAgICAgICAgICAgICAgICBkb3VibGVRdW90ZVJlZy5sYXN0SW5kZXggPSBjbG9zZVRhZy5pbmRleDtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZG91YmxlUXVvdGVNYXRjaCA9IGRvdWJsZVF1b3RlUmVnLmV4ZWMoc3RyKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZG91YmxlUXVvdGVNYXRjaCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUNsb3NlUmVnLmxhc3RJbmRleCA9IGRvdWJsZVF1b3RlUmVnLmxhc3RJbmRleDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFBhcnNlRXJyKCd1bmNsb3NlZCBzdHJpbmcnLCBzdHIsIGNsb3NlVGFnLmluZGV4KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChjaGFyID09PSAnYCcpIHtcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZUxpdFJlZy5sYXN0SW5kZXggPSBjbG9zZVRhZy5pbmRleDtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdGVtcGxhdGVMaXRNYXRjaCA9IHRlbXBsYXRlTGl0UmVnLmV4ZWMoc3RyKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGVtcGxhdGVMaXRNYXRjaCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUNsb3NlUmVnLmxhc3RJbmRleCA9IHRlbXBsYXRlTGl0UmVnLmxhc3RJbmRleDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFBhcnNlRXJyKCd1bmNsb3NlZCBzdHJpbmcnLCBzdHIsIGNsb3NlVGFnLmluZGV4KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGN1cnJlbnRPYmopIHtcclxuICAgICAgICAgICAgYnVmZmVyLnB1c2goY3VycmVudE9iaik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBQYXJzZUVycigndW5jbG9zZWQgdGFnJywgc3RyLCBtLmluZGV4ICsgcHJlY2VkaW5nU3RyaW5nLmxlbmd0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVzaFN0cmluZyhzdHIuc2xpY2UobGFzdEluZGV4LCBzdHIubGVuZ3RoKSwgZmFsc2UpO1xyXG4gICAgaWYgKGNvbmZpZy5wbHVnaW5zKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb25maWcucGx1Z2lucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgcGx1Z2luID0gY29uZmlnLnBsdWdpbnNbaV07XHJcbiAgICAgICAgICAgIGlmIChwbHVnaW4ucHJvY2Vzc0FTVCkge1xyXG4gICAgICAgICAgICAgICAgYnVmZmVyID0gcGx1Z2luLnByb2Nlc3NBU1QoYnVmZmVyLCBjb25maWcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGJ1ZmZlcjtcclxufVxuXG4vKiBFTkQgVFlQRVMgKi9cclxuLyoqXHJcbiAqIENvbXBpbGVzIGEgdGVtcGxhdGUgc3RyaW5nIHRvIGEgZnVuY3Rpb24gc3RyaW5nLiBNb3N0IG9mdGVuIHVzZXJzIGp1c3QgdXNlIGBjb21waWxlKClgLCB3aGljaCBjYWxscyBgY29tcGlsZVRvU3RyaW5nYCBhbmQgY3JlYXRlcyBhIG5ldyBmdW5jdGlvbiB1c2luZyB0aGUgcmVzdWx0XHJcbiAqXHJcbiAqICoqRXhhbXBsZSoqXHJcbiAqXHJcbiAqIGBgYGpzXHJcbiAqIGNvbXBpbGVUb1N0cmluZyhcIkhpIDwlPSBpdC51c2VyICU+XCIsIGV0YS5jb25maWcpXHJcbiAqIC8vIFwidmFyIHRSPScnLGluY2x1ZGU9RS5pbmNsdWRlLmJpbmQoRSksaW5jbHVkZUZpbGU9RS5pbmNsdWRlRmlsZS5iaW5kKEUpO3RSKz0nSGkgJzt0Uis9RS5lKGl0LnVzZXIpO2lmKGNiKXtjYihudWxsLHRSKX0gcmV0dXJuIHRSXCJcclxuICogYGBgXHJcbiAqL1xyXG5mdW5jdGlvbiBjb21waWxlVG9TdHJpbmcoc3RyLCBjb25maWcpIHtcclxuICAgIHZhciBidWZmZXIgPSBwYXJzZShzdHIsIGNvbmZpZyk7XHJcbiAgICB2YXIgcmVzID0gXCJ2YXIgdFI9JycsX19sLF9fbFBcIiArXHJcbiAgICAgICAgKGNvbmZpZy5pbmNsdWRlID8gJyxpbmNsdWRlPUUuaW5jbHVkZS5iaW5kKEUpJyA6ICcnKSArXHJcbiAgICAgICAgKGNvbmZpZy5pbmNsdWRlRmlsZSA/ICcsaW5jbHVkZUZpbGU9RS5pbmNsdWRlRmlsZS5iaW5kKEUpJyA6ICcnKSArXHJcbiAgICAgICAgJ1xcbmZ1bmN0aW9uIGxheW91dChwLGQpe19fbD1wO19fbFA9ZH1cXG4nICtcclxuICAgICAgICAoY29uZmlnLmdsb2JhbEF3YWl0ID8gJ2xldCBfcHJzID0gW107XFxuJyA6ICcnKSArXHJcbiAgICAgICAgKGNvbmZpZy51c2VXaXRoID8gJ3dpdGgoJyArIGNvbmZpZy52YXJOYW1lICsgJ3x8e30peycgOiAnJykgK1xyXG4gICAgICAgIGNvbXBpbGVTY29wZShidWZmZXIsIGNvbmZpZykgK1xyXG4gICAgICAgIChjb25maWcuaW5jbHVkZUZpbGVcclxuICAgICAgICAgICAgPyAnaWYoX19sKXRSPScgK1xyXG4gICAgICAgICAgICAgICAgKGNvbmZpZy5hc3luYyA/ICdhd2FpdCAnIDogJycpICtcclxuICAgICAgICAgICAgICAgIChcImluY2x1ZGVGaWxlKF9fbCxPYmplY3QuYXNzaWduKFwiICsgY29uZmlnLnZhck5hbWUgKyBcIix7Ym9keTp0Un0sX19sUCkpXFxuXCIpXHJcbiAgICAgICAgICAgIDogY29uZmlnLmluY2x1ZGVcclxuICAgICAgICAgICAgICAgID8gJ2lmKF9fbCl0Uj0nICtcclxuICAgICAgICAgICAgICAgICAgICAoY29uZmlnLmFzeW5jID8gJ2F3YWl0ICcgOiAnJykgK1xyXG4gICAgICAgICAgICAgICAgICAgIChcImluY2x1ZGUoX19sLE9iamVjdC5hc3NpZ24oXCIgKyBjb25maWcudmFyTmFtZSArIFwiLHtib2R5OnRSfSxfX2xQKSlcXG5cIilcclxuICAgICAgICAgICAgICAgIDogJycpICtcclxuICAgICAgICAnaWYoY2Ipe2NiKG51bGwsdFIpfSByZXR1cm4gdFInICtcclxuICAgICAgICAoY29uZmlnLnVzZVdpdGggPyAnfScgOiAnJyk7XHJcbiAgICBpZiAoY29uZmlnLnBsdWdpbnMpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbmZpZy5wbHVnaW5zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBwbHVnaW4gPSBjb25maWcucGx1Z2luc1tpXTtcclxuICAgICAgICAgICAgaWYgKHBsdWdpbi5wcm9jZXNzRm5TdHJpbmcpIHtcclxuICAgICAgICAgICAgICAgIHJlcyA9IHBsdWdpbi5wcm9jZXNzRm5TdHJpbmcocmVzLCBjb25maWcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlcztcclxufVxyXG4vKipcclxuICogTG9vcHMgdGhyb3VnaCB0aGUgQVNUIGdlbmVyYXRlZCBieSBgcGFyc2VgIGFuZCB0cmFuc2Zvcm0gZWFjaCBpdGVtIGludG8gSlMgY2FsbHNcclxuICpcclxuICogKipFeGFtcGxlKipcclxuICpcclxuICogYGBganNcclxuICogLy8gQVNUIHZlcnNpb24gb2YgJ0hpIDwlPSBpdC51c2VyICU+J1xyXG4gKiBsZXQgdGVtcGxhdGVBU1QgPSBbJ0hpICcsIHsgdmFsOiAnaXQudXNlcicsIHQ6ICdpJyB9XVxyXG4gKiBjb21waWxlU2NvcGUodGVtcGxhdGVBU1QsIGV0YS5jb25maWcpXHJcbiAqIC8vIFwidFIrPSdIaSAnO3RSKz1FLmUoaXQudXNlcik7XCJcclxuICogYGBgXHJcbiAqL1xyXG5mdW5jdGlvbiBjb21waWxlU2NvcGUoYnVmZiwgY29uZmlnKSB7XHJcbiAgICB2YXIgaTtcclxuICAgIHZhciBidWZmTGVuZ3RoID0gYnVmZi5sZW5ndGg7XHJcbiAgICB2YXIgcmV0dXJuU3RyID0gJyc7XHJcbiAgICBpZiAoY29uZmlnLmdsb2JhbEF3YWl0KSB7XHJcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGJ1ZmZMZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgY3VycmVudEJsb2NrID0gYnVmZltpXTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBjdXJyZW50QmxvY2sgIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdHlwZSA9IGN1cnJlbnRCbG9jay50O1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGUgPT09ICdyJyB8fCB0eXBlID09PSAnaScpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY29udGVudCA9IGN1cnJlbnRCbG9jay52YWwgfHwgJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuU3RyICs9IFwiX3Bycy5wdXNoKFwiICsgY29udGVudCArIFwiKTtcXG5cIjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm5TdHIgKz0gJ2xldCBfcnN0ID0gYXdhaXQgUHJvbWlzZS5hbGwoX3Bycyk7XFxuJztcclxuICAgIH1cclxuICAgIHZhciBqID0gMDtcclxuICAgIGZvciAoaSA9IDA7IGkgPCBidWZmTGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgY3VycmVudEJsb2NrID0gYnVmZltpXTtcclxuICAgICAgICBpZiAodHlwZW9mIGN1cnJlbnRCbG9jayA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgdmFyIHN0ciA9IGN1cnJlbnRCbG9jaztcclxuICAgICAgICAgICAgLy8gd2Uga25vdyBzdHJpbmcgZXhpc3RzXHJcbiAgICAgICAgICAgIHJldHVyblN0ciArPSBcInRSKz0nXCIgKyBzdHIgKyBcIidcXG5cIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciB0eXBlID0gY3VycmVudEJsb2NrLnQ7IC8vIH4sIHMsICEsID8sIHJcclxuICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSBjdXJyZW50QmxvY2sudmFsIHx8ICcnO1xyXG4gICAgICAgICAgICBpZiAodHlwZSA9PT0gJ3InKSB7XHJcbiAgICAgICAgICAgICAgICAvLyByYXdcclxuICAgICAgICAgICAgICAgIGlmIChjb25maWcuZ2xvYmFsQXdhaXQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50ID0gXCJfcnN0W1wiICsgaiArIFwiXVwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGNvbmZpZy5maWx0ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50ID0gJ0UuZmlsdGVyKCcgKyBjb250ZW50ICsgJyknO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuU3RyICs9ICd0Uis9JyArIGNvbnRlbnQgKyAnXFxuJztcclxuICAgICAgICAgICAgICAgIGorKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlID09PSAnaScpIHtcclxuICAgICAgICAgICAgICAgIC8vIGludGVycG9sYXRlXHJcbiAgICAgICAgICAgICAgICBpZiAoY29uZmlnLmdsb2JhbEF3YWl0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudCA9IFwiX3JzdFtcIiArIGogKyBcIl1cIjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChjb25maWcuZmlsdGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudCA9ICdFLmZpbHRlcignICsgY29udGVudCArICcpJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChjb25maWcuYXV0b0VzY2FwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQgPSAnRS5lKCcgKyBjb250ZW50ICsgJyknO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuU3RyICs9ICd0Uis9JyArIGNvbnRlbnQgKyAnXFxuJztcclxuICAgICAgICAgICAgICAgIGorKztcclxuICAgICAgICAgICAgICAgIC8vIHJlZmVyZW5jZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGUgPT09ICdlJykge1xyXG4gICAgICAgICAgICAgICAgLy8gZXhlY3V0ZVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuU3RyICs9IGNvbnRlbnQgKyAnXFxuJzsgLy8geW91IG5lZWQgYSBcXG4gaW4gY2FzZSB5b3UgaGF2ZSA8JSB9ICU+XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmV0dXJuU3RyO1xyXG59XG5cbi8qKlxyXG4gKiBIYW5kbGVzIHN0b3JhZ2UgYW5kIGFjY2Vzc2luZyBvZiB2YWx1ZXNcclxuICpcclxuICogSW4gdGhpcyBjYXNlLCB3ZSB1c2UgaXQgdG8gc3RvcmUgY29tcGlsZWQgdGVtcGxhdGUgZnVuY3Rpb25zXHJcbiAqIEluZGV4ZWQgYnkgdGhlaXIgYG5hbWVgIG9yIGBmaWxlbmFtZWBcclxuICovXHJcbnZhciBDYWNoZXIgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBDYWNoZXIoY2FjaGUpIHtcclxuICAgICAgICB0aGlzLmNhY2hlID0gY2FjaGU7XHJcbiAgICB9XHJcbiAgICBDYWNoZXIucHJvdG90eXBlLmRlZmluZSA9IGZ1bmN0aW9uIChrZXksIHZhbCkge1xyXG4gICAgICAgIHRoaXMuY2FjaGVba2V5XSA9IHZhbDtcclxuICAgIH07XHJcbiAgICBDYWNoZXIucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICAvLyBzdHJpbmcgfCBhcnJheS5cclxuICAgICAgICAvLyBUT0RPOiBhbGxvdyBhcnJheSBvZiBrZXlzIHRvIGxvb2sgZG93blxyXG4gICAgICAgIC8vIFRPRE86IGNyZWF0ZSBwbHVnaW4gdG8gYWxsb3cgcmVmZXJlbmNpbmcgaGVscGVycywgZmlsdGVycyB3aXRoIGRvdCBub3RhdGlvblxyXG4gICAgICAgIHJldHVybiB0aGlzLmNhY2hlW2tleV07XHJcbiAgICB9O1xyXG4gICAgQ2FjaGVyLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuY2FjaGVba2V5XTtcclxuICAgIH07XHJcbiAgICBDYWNoZXIucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuY2FjaGUgPSB7fTtcclxuICAgIH07XHJcbiAgICBDYWNoZXIucHJvdG90eXBlLmxvYWQgPSBmdW5jdGlvbiAoY2FjaGVPYmopIHtcclxuICAgICAgICBjb3B5UHJvcHModGhpcy5jYWNoZSwgY2FjaGVPYmopO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBDYWNoZXI7XHJcbn0oKSk7XG5cbi8qIEVORCBUWVBFUyAqL1xyXG4vKipcclxuICogRXRhJ3MgdGVtcGxhdGUgc3RvcmFnZVxyXG4gKlxyXG4gKiBTdG9yZXMgcGFydGlhbHMgYW5kIGNhY2hlZCB0ZW1wbGF0ZXNcclxuICovXHJcbnZhciB0ZW1wbGF0ZXMgPSBuZXcgQ2FjaGVyKHt9KTtcblxuLyogRU5EIFRZUEVTICovXHJcbi8qKlxyXG4gKiBJbmNsdWRlIGEgdGVtcGxhdGUgYmFzZWQgb24gaXRzIG5hbWUgKG9yIGZpbGVwYXRoLCBpZiBpdCdzIGFscmVhZHkgYmVlbiBjYWNoZWQpLlxyXG4gKlxyXG4gKiBDYWxsZWQgbGlrZSBgaW5jbHVkZSh0ZW1wbGF0ZU5hbWVPclBhdGgsIGRhdGEpYFxyXG4gKi9cclxuZnVuY3Rpb24gaW5jbHVkZUhlbHBlcih0ZW1wbGF0ZU5hbWVPclBhdGgsIGRhdGEpIHtcclxuICAgIHZhciB0ZW1wbGF0ZSA9IHRoaXMudGVtcGxhdGVzLmdldCh0ZW1wbGF0ZU5hbWVPclBhdGgpO1xyXG4gICAgaWYgKCF0ZW1wbGF0ZSkge1xyXG4gICAgICAgIHRocm93IEV0YUVycignQ291bGQgbm90IGZldGNoIHRlbXBsYXRlIFwiJyArIHRlbXBsYXRlTmFtZU9yUGF0aCArICdcIicpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRlbXBsYXRlKGRhdGEsIHRoaXMpO1xyXG59XHJcbi8qKiBFdGEncyBiYXNlIChnbG9iYWwpIGNvbmZpZ3VyYXRpb24gKi9cclxudmFyIGNvbmZpZyA9IHtcclxuICAgIGFzeW5jOiBmYWxzZSxcclxuICAgIGF1dG9Fc2NhcGU6IHRydWUsXHJcbiAgICBhdXRvVHJpbTogW2ZhbHNlLCAnbmwnXSxcclxuICAgIGNhY2hlOiBmYWxzZSxcclxuICAgIGU6IFhNTEVzY2FwZSxcclxuICAgIGluY2x1ZGU6IGluY2x1ZGVIZWxwZXIsXHJcbiAgICBwYXJzZToge1xyXG4gICAgICAgIGV4ZWM6ICcnLFxyXG4gICAgICAgIGludGVycG9sYXRlOiAnPScsXHJcbiAgICAgICAgcmF3OiAnfidcclxuICAgIH0sXHJcbiAgICBwbHVnaW5zOiBbXSxcclxuICAgIHJtV2hpdGVzcGFjZTogZmFsc2UsXHJcbiAgICB0YWdzOiBbJzwlJywgJyU+J10sXHJcbiAgICB0ZW1wbGF0ZXM6IHRlbXBsYXRlcyxcclxuICAgIHVzZVdpdGg6IGZhbHNlLFxyXG4gICAgdmFyTmFtZTogJ2l0J1xyXG59O1xyXG4vKipcclxuICogVGFrZXMgb25lIG9yIHR3byBwYXJ0aWFsIChub3QgbmVjZXNzYXJpbHkgY29tcGxldGUpIGNvbmZpZ3VyYXRpb24gb2JqZWN0cywgbWVyZ2VzIHRoZW0gMSBsYXllciBkZWVwIGludG8gZXRhLmNvbmZpZywgYW5kIHJldHVybnMgdGhlIHJlc3VsdFxyXG4gKlxyXG4gKiBAcGFyYW0gb3ZlcnJpZGUgUGFydGlhbCBjb25maWd1cmF0aW9uIG9iamVjdFxyXG4gKiBAcGFyYW0gYmFzZUNvbmZpZyBQYXJ0aWFsIGNvbmZpZ3VyYXRpb24gb2JqZWN0IHRvIG1lcmdlIGJlZm9yZSBgb3ZlcnJpZGVgXHJcbiAqXHJcbiAqICoqRXhhbXBsZSoqXHJcbiAqXHJcbiAqIGBgYGpzXHJcbiAqIGxldCBjdXN0b21Db25maWcgPSBnZXRDb25maWcoe3RhZ3M6IFsnISMnLCAnIyEnXX0pXHJcbiAqIGBgYFxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0Q29uZmlnKG92ZXJyaWRlLCBiYXNlQ29uZmlnKSB7XHJcbiAgICAvLyBUT0RPOiBydW4gbW9yZSB0ZXN0cyBvbiB0aGlzXHJcbiAgICB2YXIgcmVzID0ge307IC8vIExpbmtlZFxyXG4gICAgY29weVByb3BzKHJlcywgY29uZmlnKTsgLy8gQ3JlYXRlcyBkZWVwIGNsb25lIG9mIGV0YS5jb25maWcsIDEgbGF5ZXIgZGVlcFxyXG4gICAgaWYgKGJhc2VDb25maWcpIHtcclxuICAgICAgICBjb3B5UHJvcHMocmVzLCBiYXNlQ29uZmlnKTtcclxuICAgIH1cclxuICAgIGlmIChvdmVycmlkZSkge1xyXG4gICAgICAgIGNvcHlQcm9wcyhyZXMsIG92ZXJyaWRlKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXM7XHJcbn1cclxuLyoqIFVwZGF0ZSBFdGEncyBiYXNlIGNvbmZpZyAqL1xyXG5mdW5jdGlvbiBjb25maWd1cmUob3B0aW9ucykge1xyXG4gICAgcmV0dXJuIGNvcHlQcm9wcyhjb25maWcsIG9wdGlvbnMpO1xyXG59XG5cbi8qIEVORCBUWVBFUyAqL1xyXG4vKipcclxuICogVGFrZXMgYSB0ZW1wbGF0ZSBzdHJpbmcgYW5kIHJldHVybnMgYSB0ZW1wbGF0ZSBmdW5jdGlvbiB0aGF0IGNhbiBiZSBjYWxsZWQgd2l0aCAoZGF0YSwgY29uZmlnLCBbY2JdKVxyXG4gKlxyXG4gKiBAcGFyYW0gc3RyIC0gVGhlIHRlbXBsYXRlIHN0cmluZ1xyXG4gKiBAcGFyYW0gY29uZmlnIC0gQSBjdXN0b20gY29uZmlndXJhdGlvbiBvYmplY3QgKG9wdGlvbmFsKVxyXG4gKlxyXG4gKiAqKkV4YW1wbGUqKlxyXG4gKlxyXG4gKiBgYGBqc1xyXG4gKiBsZXQgY29tcGlsZWRGbiA9IGV0YS5jb21waWxlKFwiSGkgPCU9IGl0LnVzZXIgJT5cIilcclxuICogLy8gZnVuY3Rpb24gYW5vbnltb3VzKClcclxuICogbGV0IGNvbXBpbGVkRm5TdHIgPSBjb21waWxlZEZuLnRvU3RyaW5nKClcclxuICogLy8gXCJmdW5jdGlvbiBhbm9ueW1vdXMoaXQsRSxjYlxcbikge1xcbnZhciB0Uj0nJyxpbmNsdWRlPUUuaW5jbHVkZS5iaW5kKEUpLGluY2x1ZGVGaWxlPUUuaW5jbHVkZUZpbGUuYmluZChFKTt0Uis9J0hpICc7dFIrPUUuZShpdC51c2VyKTtpZihjYil7Y2IobnVsbCx0Uil9IHJldHVybiB0Ulxcbn1cIlxyXG4gKiBgYGBcclxuICovXHJcbmZ1bmN0aW9uIGNvbXBpbGUoc3RyLCBjb25maWcpIHtcclxuICAgIHZhciBvcHRpb25zID0gZ2V0Q29uZmlnKGNvbmZpZyB8fCB7fSk7XHJcbiAgICAvKiBBU1lOQyBIQU5ETElORyAqL1xyXG4gICAgLy8gVGhlIGJlbG93IGNvZGUgaXMgbW9kaWZpZWQgZnJvbSBtZGUvZWpzLiBBbGwgY3JlZGl0IHNob3VsZCBnbyB0byB0aGVtLlxyXG4gICAgdmFyIGN0b3IgPSBvcHRpb25zLmFzeW5jID8gZ2V0QXN5bmNGdW5jdGlvbkNvbnN0cnVjdG9yKCkgOiBGdW5jdGlvbjtcclxuICAgIC8qIEVORCBBU1lOQyBIQU5ETElORyAqL1xyXG4gICAgdHJ5IHtcclxuICAgICAgICByZXR1cm4gbmV3IGN0b3Iob3B0aW9ucy52YXJOYW1lLCAnRScsIC8vIEV0YUNvbmZpZ1xyXG4gICAgICAgICdjYicsIC8vIG9wdGlvbmFsIGNhbGxiYWNrXHJcbiAgICAgICAgY29tcGlsZVRvU3RyaW5nKHN0ciwgb3B0aW9ucykpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ldy1mdW5jXHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgIGlmIChlIGluc3RhbmNlb2YgU3ludGF4RXJyb3IpIHtcclxuICAgICAgICAgICAgdGhyb3cgRXRhRXJyKCdCYWQgdGVtcGxhdGUgc3ludGF4XFxuXFxuJyArXHJcbiAgICAgICAgICAgICAgICBlLm1lc3NhZ2UgK1xyXG4gICAgICAgICAgICAgICAgJ1xcbicgK1xyXG4gICAgICAgICAgICAgICAgQXJyYXkoZS5tZXNzYWdlLmxlbmd0aCArIDEpLmpvaW4oJz0nKSArXHJcbiAgICAgICAgICAgICAgICAnXFxuJyArXHJcbiAgICAgICAgICAgICAgICBjb21waWxlVG9TdHJpbmcoc3RyLCBvcHRpb25zKSArXHJcbiAgICAgICAgICAgICAgICAnXFxuJyAvLyBUaGlzIHdpbGwgcHV0IGFuIGV4dHJhIG5ld2xpbmUgYmVmb3JlIHRoZSBjYWxsc3RhY2sgZm9yIGV4dHJhIHJlYWRhYmlsaXR5XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxuXG52YXIgX0JPTSA9IC9eXFx1RkVGRi87XHJcbi8qIEVORCBUWVBFUyAqL1xyXG4vKipcclxuICogR2V0IHRoZSBwYXRoIHRvIHRoZSBpbmNsdWRlZCBmaWxlIGZyb20gdGhlIHBhcmVudCBmaWxlIHBhdGggYW5kIHRoZVxyXG4gKiBzcGVjaWZpZWQgcGF0aC5cclxuICpcclxuICogSWYgYG5hbWVgIGRvZXMgbm90IGhhdmUgYW4gZXh0ZW5zaW9uLCBpdCB3aWxsIGRlZmF1bHQgdG8gYC5ldGFgXHJcbiAqXHJcbiAqIEBwYXJhbSBuYW1lIHNwZWNpZmllZCBwYXRoXHJcbiAqIEBwYXJhbSBwYXJlbnRmaWxlIHBhcmVudCBmaWxlIHBhdGhcclxuICogQHBhcmFtIGlzRGlyZWN0b3J5IHdoZXRoZXIgcGFyZW50ZmlsZSBpcyBhIGRpcmVjdG9yeVxyXG4gKiBAcmV0dXJuIGFic29sdXRlIHBhdGggdG8gdGVtcGxhdGVcclxuICovXHJcbmZ1bmN0aW9uIGdldFdob2xlRmlsZVBhdGgobmFtZSwgcGFyZW50ZmlsZSwgaXNEaXJlY3RvcnkpIHtcclxuICAgIHZhciBpbmNsdWRlUGF0aCA9IHBhdGgucmVzb2x2ZShpc0RpcmVjdG9yeSA/IHBhcmVudGZpbGUgOiBwYXRoLmRpcm5hbWUocGFyZW50ZmlsZSksIC8vIHJldHVybnMgZGlyZWN0b3J5IHRoZSBwYXJlbnQgZmlsZSBpcyBpblxyXG4gICAgbmFtZSAvLyBmaWxlXHJcbiAgICApICsgKHBhdGguZXh0bmFtZShuYW1lKSA/ICcnIDogJy5ldGEnKTtcclxuICAgIHJldHVybiBpbmNsdWRlUGF0aDtcclxufVxyXG4vKipcclxuICogR2V0IHRoZSBhYnNvbHV0ZSBwYXRoIHRvIGFuIGluY2x1ZGVkIHRlbXBsYXRlXHJcbiAqXHJcbiAqIElmIHRoaXMgaXMgY2FsbGVkIHdpdGggYW4gYWJzb2x1dGUgcGF0aCAoZm9yIGV4YW1wbGUsIHN0YXJ0aW5nIHdpdGggJy8nIG9yICdDOlxcJylcclxuICogdGhlbiBFdGEgd2lsbCBhdHRlbXB0IHRvIHJlc29sdmUgdGhlIGFic29sdXRlIHBhdGggd2l0aGluIG9wdGlvbnMudmlld3MuIElmIGl0IGNhbm5vdCxcclxuICogRXRhIHdpbGwgZmFsbGJhY2sgdG8gb3B0aW9ucy5yb290IG9yICcvJ1xyXG4gKlxyXG4gKiBJZiB0aGlzIGlzIGNhbGxlZCB3aXRoIGEgcmVsYXRpdmUgcGF0aCwgRXRhIHdpbGw6XHJcbiAqIC0gTG9vayByZWxhdGl2ZSB0byB0aGUgY3VycmVudCB0ZW1wbGF0ZSAoaWYgdGhlIGN1cnJlbnQgdGVtcGxhdGUgaGFzIHRoZSBgZmlsZW5hbWVgIHByb3BlcnR5KVxyXG4gKiAtIExvb2sgaW5zaWRlIGVhY2ggZGlyZWN0b3J5IGluIG9wdGlvbnMudmlld3NcclxuICpcclxuICogTm90ZTogaWYgRXRhIGlzIHVuYWJsZSB0byBmaW5kIGEgdGVtcGxhdGUgdXNpbmcgcGF0aCBhbmQgb3B0aW9ucywgaXQgd2lsbCB0aHJvdyBhbiBlcnJvci5cclxuICpcclxuICogQHBhcmFtIHBhdGggICAgc3BlY2lmaWVkIHBhdGhcclxuICogQHBhcmFtIG9wdGlvbnMgY29tcGlsYXRpb24gb3B0aW9uc1xyXG4gKiBAcmV0dXJuIGFic29sdXRlIHBhdGggdG8gdGVtcGxhdGVcclxuICovXHJcbmZ1bmN0aW9uIGdldFBhdGgocGF0aCwgb3B0aW9ucykge1xyXG4gICAgdmFyIGluY2x1ZGVQYXRoID0gZmFsc2U7XHJcbiAgICB2YXIgdmlld3MgPSBvcHRpb25zLnZpZXdzO1xyXG4gICAgdmFyIHNlYXJjaGVkUGF0aHMgPSBbXTtcclxuICAgIC8vIElmIHRoZXNlIGZvdXIgdmFsdWVzIGFyZSB0aGUgc2FtZSxcclxuICAgIC8vIGdldFBhdGgoKSB3aWxsIHJldHVybiB0aGUgc2FtZSByZXN1bHQgZXZlcnkgdGltZS5cclxuICAgIC8vIFdlIGNhbiBjYWNoZSB0aGUgcmVzdWx0IHRvIGF2b2lkIGV4cGVuc2l2ZVxyXG4gICAgLy8gZmlsZSBvcGVyYXRpb25zLlxyXG4gICAgdmFyIHBhdGhPcHRpb25zID0gSlNPTi5zdHJpbmdpZnkoe1xyXG4gICAgICAgIGZpbGVuYW1lOiBvcHRpb25zLmZpbGVuYW1lLFxyXG4gICAgICAgIHBhdGg6IHBhdGgsXHJcbiAgICAgICAgcm9vdDogb3B0aW9ucy5yb290LFxyXG4gICAgICAgIHZpZXdzOiBvcHRpb25zLnZpZXdzXHJcbiAgICB9KTtcclxuICAgIGlmIChvcHRpb25zLmNhY2hlICYmIG9wdGlvbnMuZmlsZXBhdGhDYWNoZSAmJiBvcHRpb25zLmZpbGVwYXRoQ2FjaGVbcGF0aE9wdGlvbnNdKSB7XHJcbiAgICAgICAgLy8gVXNlIHRoZSBjYWNoZWQgZmlsZXBhdGhcclxuICAgICAgICByZXR1cm4gb3B0aW9ucy5maWxlcGF0aENhY2hlW3BhdGhPcHRpb25zXTtcclxuICAgIH1cclxuICAgIC8qKiBBZGQgYSBmaWxlcGF0aCB0byB0aGUgbGlzdCBvZiBwYXRocyB3ZSd2ZSBjaGVja2VkIGZvciBhIHRlbXBsYXRlICovXHJcbiAgICBmdW5jdGlvbiBhZGRQYXRoVG9TZWFyY2hlZChwYXRoU2VhcmNoZWQpIHtcclxuICAgICAgICBpZiAoIXNlYXJjaGVkUGF0aHMuaW5jbHVkZXMocGF0aFNlYXJjaGVkKSkge1xyXG4gICAgICAgICAgICBzZWFyY2hlZFBhdGhzLnB1c2gocGF0aFNlYXJjaGVkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFRha2UgYSBmaWxlcGF0aCAobGlrZSAncGFydGlhbHMvbXlwYXJ0aWFsLmV0YScpLiBBdHRlbXB0IHRvIGZpbmQgdGhlIHRlbXBsYXRlIGZpbGUgaW5zaWRlIGB2aWV3c2A7XHJcbiAgICAgKiByZXR1cm4gdGhlIHJlc3VsdGluZyB0ZW1wbGF0ZSBmaWxlIHBhdGgsIG9yIGBmYWxzZWAgdG8gaW5kaWNhdGUgdGhhdCB0aGUgdGVtcGxhdGUgd2FzIG5vdCBmb3VuZC5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gdmlld3MgdGhlIGZpbGVwYXRoIHRoYXQgaG9sZHMgdGVtcGxhdGVzLCBvciBhbiBhcnJheSBvZiBmaWxlcGF0aHMgdGhhdCBob2xkIHRlbXBsYXRlc1xyXG4gICAgICogQHBhcmFtIHBhdGggdGhlIHBhdGggdG8gdGhlIHRlbXBsYXRlXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHNlYXJjaFZpZXdzKHZpZXdzLCBwYXRoKSB7XHJcbiAgICAgICAgdmFyIGZpbGVQYXRoO1xyXG4gICAgICAgIC8vIElmIHZpZXdzIGlzIGFuIGFycmF5LCB0aGVuIGxvb3AgdGhyb3VnaCBlYWNoIGRpcmVjdG9yeVxyXG4gICAgICAgIC8vIEFuZCBhdHRlbXB0IHRvIGZpbmQgdGhlIHRlbXBsYXRlXHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmlld3MpICYmXHJcbiAgICAgICAgICAgIHZpZXdzLnNvbWUoZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICAgICAgICAgIGZpbGVQYXRoID0gZ2V0V2hvbGVGaWxlUGF0aChwYXRoLCB2LCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIGFkZFBhdGhUb1NlYXJjaGVkKGZpbGVQYXRoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBleGlzdHNTeW5jKGZpbGVQYXRoKTtcclxuICAgICAgICAgICAgfSkpIHtcclxuICAgICAgICAgICAgLy8gSWYgdGhlIGFib3ZlIHJldHVybmVkIHRydWUsIHdlIGtub3cgdGhhdCB0aGUgZmlsZVBhdGggd2FzIGp1c3Qgc2V0IHRvIGEgcGF0aFxyXG4gICAgICAgICAgICAvLyBUaGF0IGV4aXN0cyAoQXJyYXkuc29tZSgpIHJldHVybnMgYXMgc29vbiBhcyBpdCBmaW5kcyBhIHZhbGlkIGVsZW1lbnQpXHJcbiAgICAgICAgICAgIHJldHVybiBmaWxlUGF0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIHZpZXdzID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAvLyBTZWFyY2ggZm9yIHRoZSBmaWxlIGlmIHZpZXdzIGlzIGEgc2luZ2xlIGRpcmVjdG9yeVxyXG4gICAgICAgICAgICBmaWxlUGF0aCA9IGdldFdob2xlRmlsZVBhdGgocGF0aCwgdmlld3MsIHRydWUpO1xyXG4gICAgICAgICAgICBhZGRQYXRoVG9TZWFyY2hlZChmaWxlUGF0aCk7XHJcbiAgICAgICAgICAgIGlmIChleGlzdHNTeW5jKGZpbGVQYXRoKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZpbGVQYXRoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIFVuYWJsZSB0byBmaW5kIGEgZmlsZVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIC8vIFBhdGggc3RhcnRzIHdpdGggJy8nLCAnQzpcXCcsIGV0Yy5cclxuICAgIHZhciBtYXRjaCA9IC9eW0EtWmEtel0rOlxcXFx8XlxcLy8uZXhlYyhwYXRoKTtcclxuICAgIC8vIEFic29sdXRlIHBhdGgsIGxpa2UgL3BhcnRpYWxzL3BhcnRpYWwuZXRhXHJcbiAgICBpZiAobWF0Y2ggJiYgbWF0Y2gubGVuZ3RoKSB7XHJcbiAgICAgICAgLy8gV2UgaGF2ZSB0byB0cmltIHRoZSBiZWdpbm5pbmcgJy8nIG9mZiB0aGUgcGF0aCwgb3IgZWxzZVxyXG4gICAgICAgIC8vIHBhdGgucmVzb2x2ZShkaXIsIHBhdGgpIHdpbGwgYWx3YXlzIHJlc29sdmUgdG8ganVzdCBwYXRoXHJcbiAgICAgICAgdmFyIGZvcm1hdHRlZFBhdGggPSBwYXRoLnJlcGxhY2UoL15cXC8qLywgJycpO1xyXG4gICAgICAgIC8vIEZpcnN0LCB0cnkgdG8gcmVzb2x2ZSB0aGUgcGF0aCB3aXRoaW4gb3B0aW9ucy52aWV3c1xyXG4gICAgICAgIGluY2x1ZGVQYXRoID0gc2VhcmNoVmlld3Modmlld3MsIGZvcm1hdHRlZFBhdGgpO1xyXG4gICAgICAgIGlmICghaW5jbHVkZVBhdGgpIHtcclxuICAgICAgICAgICAgLy8gSWYgdGhhdCBmYWlscywgc2VhcmNoVmlld3Mgd2lsbCByZXR1cm4gZmFsc2UuIFRyeSB0byBmaW5kIHRoZSBwYXRoXHJcbiAgICAgICAgICAgIC8vIGluc2lkZSBvcHRpb25zLnJvb3QgKGJ5IGRlZmF1bHQgJy8nLCB0aGUgYmFzZSBvZiB0aGUgZmlsZXN5c3RlbSlcclxuICAgICAgICAgICAgdmFyIHBhdGhGcm9tUm9vdCA9IGdldFdob2xlRmlsZVBhdGgoZm9ybWF0dGVkUGF0aCwgb3B0aW9ucy5yb290IHx8ICcvJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgIGFkZFBhdGhUb1NlYXJjaGVkKHBhdGhGcm9tUm9vdCk7XHJcbiAgICAgICAgICAgIGluY2x1ZGVQYXRoID0gcGF0aEZyb21Sb290O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIC8vIFJlbGF0aXZlIHBhdGhzXHJcbiAgICAgICAgLy8gTG9vayByZWxhdGl2ZSB0byBhIHBhc3NlZCBmaWxlbmFtZSBmaXJzdFxyXG4gICAgICAgIGlmIChvcHRpb25zLmZpbGVuYW1lKSB7XHJcbiAgICAgICAgICAgIHZhciBmaWxlUGF0aCA9IGdldFdob2xlRmlsZVBhdGgocGF0aCwgb3B0aW9ucy5maWxlbmFtZSk7XHJcbiAgICAgICAgICAgIGFkZFBhdGhUb1NlYXJjaGVkKGZpbGVQYXRoKTtcclxuICAgICAgICAgICAgaWYgKGV4aXN0c1N5bmMoZmlsZVBhdGgpKSB7XHJcbiAgICAgICAgICAgICAgICBpbmNsdWRlUGF0aCA9IGZpbGVQYXRoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIFRoZW4gbG9vayBmb3IgdGhlIHRlbXBsYXRlIGluIG9wdGlvbnMudmlld3NcclxuICAgICAgICBpZiAoIWluY2x1ZGVQYXRoKSB7XHJcbiAgICAgICAgICAgIGluY2x1ZGVQYXRoID0gc2VhcmNoVmlld3Modmlld3MsIHBhdGgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIWluY2x1ZGVQYXRoKSB7XHJcbiAgICAgICAgICAgIHRocm93IEV0YUVycignQ291bGQgbm90IGZpbmQgdGhlIHRlbXBsYXRlIFwiJyArIHBhdGggKyAnXCIuIFBhdGhzIHRyaWVkOiAnICsgc2VhcmNoZWRQYXRocyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8gSWYgY2FjaGluZyBhbmQgZmlsZXBhdGhDYWNoZSBhcmUgZW5hYmxlZCxcclxuICAgIC8vIGNhY2hlIHRoZSBpbnB1dCAmIG91dHB1dCBvZiB0aGlzIGZ1bmN0aW9uLlxyXG4gICAgaWYgKG9wdGlvbnMuY2FjaGUgJiYgb3B0aW9ucy5maWxlcGF0aENhY2hlKSB7XHJcbiAgICAgICAgb3B0aW9ucy5maWxlcGF0aENhY2hlW3BhdGhPcHRpb25zXSA9IGluY2x1ZGVQYXRoO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGluY2x1ZGVQYXRoO1xyXG59XHJcbi8qKlxyXG4gKiBSZWFkcyBhIGZpbGUgc3luY2hyb25vdXNseVxyXG4gKi9cclxuZnVuY3Rpb24gcmVhZEZpbGUoZmlsZVBhdGgpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgcmV0dXJuIHJlYWRGaWxlU3luYyhmaWxlUGF0aCkudG9TdHJpbmcoKS5yZXBsYWNlKF9CT00sICcnKTsgLy8gVE9ETzogaXMgcmVwbGFjaW5nIEJPTSdzIG5lY2Vzc2FyeT9cclxuICAgIH1cclxuICAgIGNhdGNoIChfYSkge1xyXG4gICAgICAgIHRocm93IEV0YUVycihcIkZhaWxlZCB0byByZWFkIHRlbXBsYXRlIGF0ICdcIiArIGZpbGVQYXRoICsgXCInXCIpO1xyXG4gICAgfVxyXG59XG5cbi8vIGV4cHJlc3MgaXMgc2V0IGxpa2U6IGFwcC5lbmdpbmUoJ2h0bWwnLCByZXF1aXJlKCdldGEnKS5yZW5kZXJGaWxlKVxyXG4vKiBFTkQgVFlQRVMgKi9cclxuLyoqXHJcbiAqIFJlYWRzIGEgdGVtcGxhdGUsIGNvbXBpbGVzIGl0IGludG8gYSBmdW5jdGlvbiwgY2FjaGVzIGl0IGlmIGNhY2hpbmcgaXNuJ3QgZGlzYWJsZWQsIHJldHVybnMgdGhlIGZ1bmN0aW9uXHJcbiAqXHJcbiAqIEBwYXJhbSBmaWxlUGF0aCBBYnNvbHV0ZSBwYXRoIHRvIHRlbXBsYXRlIGZpbGVcclxuICogQHBhcmFtIG9wdGlvbnMgRXRhIGNvbmZpZ3VyYXRpb24gb3ZlcnJpZGVzXHJcbiAqIEBwYXJhbSBub0NhY2hlIE9wdGlvbmFsbHksIG1ha2UgRXRhIG5vdCBjYWNoZSB0aGUgdGVtcGxhdGVcclxuICovXHJcbmZ1bmN0aW9uIGxvYWRGaWxlKGZpbGVQYXRoLCBvcHRpb25zLCBub0NhY2hlKSB7XHJcbiAgICB2YXIgY29uZmlnID0gZ2V0Q29uZmlnKG9wdGlvbnMpO1xyXG4gICAgdmFyIHRlbXBsYXRlID0gcmVhZEZpbGUoZmlsZVBhdGgpO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB2YXIgY29tcGlsZWRUZW1wbGF0ZSA9IGNvbXBpbGUodGVtcGxhdGUsIGNvbmZpZyk7XHJcbiAgICAgICAgaWYgKCFub0NhY2hlKSB7XHJcbiAgICAgICAgICAgIGNvbmZpZy50ZW1wbGF0ZXMuZGVmaW5lKGNvbmZpZy5maWxlbmFtZSwgY29tcGlsZWRUZW1wbGF0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjb21waWxlZFRlbXBsYXRlO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICB0aHJvdyBFdGFFcnIoJ0xvYWRpbmcgZmlsZTogJyArIGZpbGVQYXRoICsgJyBmYWlsZWQ6XFxuXFxuJyArIGUubWVzc2FnZSk7XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIEdldCB0aGUgdGVtcGxhdGUgZnJvbSBhIHN0cmluZyBvciBhIGZpbGUsIGVpdGhlciBjb21waWxlZCBvbi10aGUtZmx5IG9yXHJcbiAqIHJlYWQgZnJvbSBjYWNoZSAoaWYgZW5hYmxlZCksIGFuZCBjYWNoZSB0aGUgdGVtcGxhdGUgaWYgbmVlZGVkLlxyXG4gKlxyXG4gKiBJZiBgb3B0aW9ucy5jYWNoZWAgaXMgdHJ1ZSwgdGhpcyBmdW5jdGlvbiByZWFkcyB0aGUgZmlsZSBmcm9tXHJcbiAqIGBvcHRpb25zLmZpbGVuYW1lYCBzbyBpdCBtdXN0IGJlIHNldCBwcmlvciB0byBjYWxsaW5nIHRoaXMgZnVuY3Rpb24uXHJcbiAqXHJcbiAqIEBwYXJhbSBvcHRpb25zICAgY29tcGlsYXRpb24gb3B0aW9uc1xyXG4gKiBAcmV0dXJuIEV0YSB0ZW1wbGF0ZSBmdW5jdGlvblxyXG4gKi9cclxuZnVuY3Rpb24gaGFuZGxlQ2FjaGUkMShvcHRpb25zKSB7XHJcbiAgICB2YXIgZmlsZW5hbWUgPSBvcHRpb25zLmZpbGVuYW1lO1xyXG4gICAgaWYgKG9wdGlvbnMuY2FjaGUpIHtcclxuICAgICAgICB2YXIgZnVuYyA9IG9wdGlvbnMudGVtcGxhdGVzLmdldChmaWxlbmFtZSk7XHJcbiAgICAgICAgaWYgKGZ1bmMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZ1bmM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBsb2FkRmlsZShmaWxlbmFtZSwgb3B0aW9ucyk7XHJcbiAgICB9XHJcbiAgICAvLyBDYWNoaW5nIGlzIGRpc2FibGVkLCBzbyBwYXNzIG5vQ2FjaGUgPSB0cnVlXHJcbiAgICByZXR1cm4gbG9hZEZpbGUoZmlsZW5hbWUsIG9wdGlvbnMsIHRydWUpO1xyXG59XHJcbi8qKlxyXG4gKiBUcnkgY2FsbGluZyBoYW5kbGVDYWNoZSB3aXRoIHRoZSBnaXZlbiBvcHRpb25zIGFuZCBkYXRhIGFuZCBjYWxsIHRoZVxyXG4gKiBjYWxsYmFjayB3aXRoIHRoZSByZXN1bHQuIElmIGFuIGVycm9yIG9jY3VycywgY2FsbCB0aGUgY2FsbGJhY2sgd2l0aFxyXG4gKiB0aGUgZXJyb3IuIFVzZWQgYnkgcmVuZGVyRmlsZSgpLlxyXG4gKlxyXG4gKiBAcGFyYW0gZGF0YSB0ZW1wbGF0ZSBkYXRhXHJcbiAqIEBwYXJhbSBvcHRpb25zIGNvbXBpbGF0aW9uIG9wdGlvbnNcclxuICogQHBhcmFtIGNiIGNhbGxiYWNrXHJcbiAqL1xyXG5mdW5jdGlvbiB0cnlIYW5kbGVDYWNoZShkYXRhLCBvcHRpb25zLCBjYikge1xyXG4gICAgaWYgKGNiKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgLy8gTm90ZTogaWYgdGhlcmUgaXMgYW4gZXJyb3Igd2hpbGUgcmVuZGVyaW5nIHRoZSB0ZW1wbGF0ZSxcclxuICAgICAgICAgICAgLy8gSXQgd2lsbCBidWJibGUgdXAgYW5kIGJlIGNhdWdodCBoZXJlXHJcbiAgICAgICAgICAgIHZhciB0ZW1wbGF0ZUZuID0gaGFuZGxlQ2FjaGUkMShvcHRpb25zKTtcclxuICAgICAgICAgICAgdGVtcGxhdGVGbihkYXRhLCBvcHRpb25zLCBjYik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGNiKGVycik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgLy8gTm8gY2FsbGJhY2ssIHRyeSByZXR1cm5pbmcgYSBwcm9taXNlXHJcbiAgICAgICAgaWYgKHR5cGVvZiBwcm9taXNlSW1wbCA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IHByb21pc2VJbXBsKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRlbXBsYXRlRm4gPSBoYW5kbGVDYWNoZSQxKG9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSB0ZW1wbGF0ZUZuKGRhdGEsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBFdGFFcnIoXCJQbGVhc2UgcHJvdmlkZSBhIGNhbGxiYWNrIGZ1bmN0aW9uLCB0aGlzIGVudiBkb2Vzbid0IHN1cHBvcnQgUHJvbWlzZXNcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbi8qKlxyXG4gKiBHZXQgdGhlIHRlbXBsYXRlIGZ1bmN0aW9uLlxyXG4gKlxyXG4gKiBJZiBgb3B0aW9ucy5jYWNoZWAgaXMgYHRydWVgLCB0aGVuIHRoZSB0ZW1wbGF0ZSBpcyBjYWNoZWQuXHJcbiAqXHJcbiAqIFRoaXMgcmV0dXJucyBhIHRlbXBsYXRlIGZ1bmN0aW9uIGFuZCB0aGUgY29uZmlnIG9iamVjdCB3aXRoIHdoaWNoIHRoYXQgdGVtcGxhdGUgZnVuY3Rpb24gc2hvdWxkIGJlIGNhbGxlZC5cclxuICpcclxuICogQHJlbWFya3NcclxuICpcclxuICogSXQncyBpbXBvcnRhbnQgdGhhdCB0aGlzIHJldHVybnMgYSBjb25maWcgb2JqZWN0IHdpdGggYGZpbGVuYW1lYCBzZXQuXHJcbiAqIE90aGVyd2lzZSwgdGhlIGluY2x1ZGVkIGZpbGUgd291bGQgbm90IGJlIGFibGUgdG8gdXNlIHJlbGF0aXZlIHBhdGhzXHJcbiAqXHJcbiAqIEBwYXJhbSBwYXRoIHBhdGggZm9yIHRoZSBzcGVjaWZpZWQgZmlsZSAoaWYgcmVsYXRpdmUsIHNwZWNpZnkgYHZpZXdzYCBvbiBgb3B0aW9uc2ApXHJcbiAqIEBwYXJhbSBvcHRpb25zIGNvbXBpbGF0aW9uIG9wdGlvbnNcclxuICogQHJldHVybiBbRXRhIHRlbXBsYXRlIGZ1bmN0aW9uLCBuZXcgY29uZmlnIG9iamVjdF1cclxuICovXHJcbmZ1bmN0aW9uIGluY2x1ZGVGaWxlKHBhdGgsIG9wdGlvbnMpIHtcclxuICAgIC8vIHRoZSBiZWxvdyBjcmVhdGVzIGEgbmV3IG9wdGlvbnMgb2JqZWN0LCB1c2luZyB0aGUgcGFyZW50IGZpbGVwYXRoIG9mIHRoZSBvbGQgb3B0aW9ucyBvYmplY3QgYW5kIHRoZSBwYXRoXHJcbiAgICB2YXIgbmV3RmlsZU9wdGlvbnMgPSBnZXRDb25maWcoeyBmaWxlbmFtZTogZ2V0UGF0aChwYXRoLCBvcHRpb25zKSB9LCBvcHRpb25zKTtcclxuICAgIC8vIFRPRE86IG1ha2Ugc3VyZSBwcm9wZXJ0aWVzIGFyZSBjdXJyZWN0bHkgY29waWVkIG92ZXJcclxuICAgIHJldHVybiBbaGFuZGxlQ2FjaGUkMShuZXdGaWxlT3B0aW9ucyksIG5ld0ZpbGVPcHRpb25zXTtcclxufVxyXG5mdW5jdGlvbiByZW5kZXJGaWxlKGZpbGVuYW1lLCBkYXRhLCBjb25maWcsIGNiKSB7XHJcbiAgICAvKlxyXG4gICAgSGVyZSB3ZSBoYXZlIHNvbWUgZnVuY3Rpb24gb3ZlcmxvYWRpbmcuXHJcbiAgICBFc3NlbnRpYWxseSwgdGhlIGZpcnN0IDIgYXJndW1lbnRzIHRvIHJlbmRlckZpbGUgc2hvdWxkIGFsd2F5cyBiZSB0aGUgZmlsZW5hbWUgYW5kIGRhdGFcclxuICAgIEhvd2V2ZXIsIHdpdGggRXhwcmVzcywgY29uZmlndXJhdGlvbiBvcHRpb25zIHdpbGwgYmUgcGFzc2VkIGFsb25nIHdpdGggdGhlIGRhdGEuXHJcbiAgICBUaHVzLCBFeHByZXNzIHdpbGwgY2FsbCByZW5kZXJGaWxlIHdpdGggKGZpbGVuYW1lLCBkYXRhQW5kT3B0aW9ucywgY2IpXHJcbiAgICBBbmQgd2Ugd2FudCB0byBhbHNvIG1ha2UgKGZpbGVuYW1lLCBkYXRhLCBvcHRpb25zLCBjYikgYXZhaWxhYmxlXHJcbiAgICAqL1xyXG4gICAgdmFyIHJlbmRlckNvbmZpZztcclxuICAgIHZhciBjYWxsYmFjaztcclxuICAgIGRhdGEgPSBkYXRhIHx8IHt9OyAvLyBJZiBkYXRhIGlzIHVuZGVmaW5lZCwgd2UgZG9uJ3Qgd2FudCBhY2Nlc3NpbmcgZGF0YS5zZXR0aW5ncyB0byBlcnJvclxyXG4gICAgLy8gRmlyc3QsIGFzc2lnbiBvdXIgY2FsbGJhY2sgZnVuY3Rpb24gdG8gYGNhbGxiYWNrYFxyXG4gICAgLy8gV2UgY2FuIGxlYXZlIGl0IHVuZGVmaW5lZCBpZiBuZWl0aGVyIHBhcmFtZXRlciBpcyBhIGZ1bmN0aW9uO1xyXG4gICAgLy8gQ2FsbGJhY2tzIGFyZSBvcHRpb25hbFxyXG4gICAgaWYgKHR5cGVvZiBjYiA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIC8vIFRoZSA0dGggYXJndW1lbnQgaXMgdGhlIGNhbGxiYWNrXHJcbiAgICAgICAgY2FsbGJhY2sgPSBjYjtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHR5cGVvZiBjb25maWcgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAvLyBUaGUgM3JkIGFyZyBpcyB0aGUgY2FsbGJhY2tcclxuICAgICAgICBjYWxsYmFjayA9IGNvbmZpZztcclxuICAgIH1cclxuICAgIC8vIElmIHRoZXJlIGlzIGEgY29uZmlnIG9iamVjdCBwYXNzZWQgaW4gZXhwbGljaXRseSwgdXNlIGl0XHJcbiAgICBpZiAodHlwZW9mIGNvbmZpZyA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICByZW5kZXJDb25maWcgPSBnZXRDb25maWcoY29uZmlnIHx8IHt9KTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIC8vIE90aGVyd2lzZSwgZ2V0IHRoZSBjb25maWcgZnJvbSB0aGUgZGF0YSBvYmplY3RcclxuICAgICAgICAvLyBBbmQgdGhlbiBncmFiIHNvbWUgY29uZmlnIG9wdGlvbnMgZnJvbSBkYXRhLnNldHRpbmdzXHJcbiAgICAgICAgLy8gV2hpY2ggaXMgd2hlcmUgRXhwcmVzcyBzb21ldGltZXMgc3RvcmVzIHRoZW1cclxuICAgICAgICByZW5kZXJDb25maWcgPSBnZXRDb25maWcoZGF0YSk7XHJcbiAgICAgICAgaWYgKGRhdGEuc2V0dGluZ3MpIHtcclxuICAgICAgICAgICAgLy8gUHVsbCBhIGZldyB0aGluZ3MgZnJvbSBrbm93biBsb2NhdGlvbnNcclxuICAgICAgICAgICAgaWYgKGRhdGEuc2V0dGluZ3Mudmlld3MpIHtcclxuICAgICAgICAgICAgICAgIHJlbmRlckNvbmZpZy52aWV3cyA9IGRhdGEuc2V0dGluZ3Mudmlld3M7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGRhdGEuc2V0dGluZ3NbJ3ZpZXcgY2FjaGUnXSkge1xyXG4gICAgICAgICAgICAgICAgcmVuZGVyQ29uZmlnLmNhY2hlID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBVbmRvY3VtZW50ZWQgYWZ0ZXIgRXhwcmVzcyAyLCBidXQgc3RpbGwgdXNhYmxlLCBlc3AuIGZvclxyXG4gICAgICAgICAgICAvLyBpdGVtcyB0aGF0IGFyZSB1bnNhZmUgdG8gYmUgcGFzc2VkIGFsb25nIHdpdGggZGF0YSwgbGlrZSBgcm9vdGBcclxuICAgICAgICAgICAgdmFyIHZpZXdPcHRzID0gZGF0YS5zZXR0aW5nc1sndmlldyBvcHRpb25zJ107XHJcbiAgICAgICAgICAgIGlmICh2aWV3T3B0cykge1xyXG4gICAgICAgICAgICAgICAgY29weVByb3BzKHJlbmRlckNvbmZpZywgdmlld09wdHMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8gU2V0IHRoZSBmaWxlbmFtZSBvcHRpb24gb24gdGhlIHRlbXBsYXRlXHJcbiAgICAvLyBUaGlzIHdpbGwgZmlyc3QgdHJ5IHRvIHJlc29sdmUgdGhlIGZpbGUgcGF0aCAoc2VlIGdldFBhdGggZm9yIGRldGFpbHMpXHJcbiAgICByZW5kZXJDb25maWcuZmlsZW5hbWUgPSBnZXRQYXRoKGZpbGVuYW1lLCByZW5kZXJDb25maWcpO1xyXG4gICAgcmV0dXJuIHRyeUhhbmRsZUNhY2hlKGRhdGEsIHJlbmRlckNvbmZpZywgY2FsbGJhY2spO1xyXG59XHJcbmZ1bmN0aW9uIHJlbmRlckZpbGVBc3luYyhmaWxlbmFtZSwgZGF0YSwgY29uZmlnLCBjYikge1xyXG4gICAgcmV0dXJuIHJlbmRlckZpbGUoZmlsZW5hbWUsIHR5cGVvZiBjb25maWcgPT09ICdmdW5jdGlvbicgPyBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgZGF0YSksIHsgYXN5bmM6IHRydWUgfSkgOiBkYXRhLCB0eXBlb2YgY29uZmlnID09PSAnb2JqZWN0JyA/IF9fYXNzaWduKF9fYXNzaWduKHt9LCBjb25maWcpLCB7IGFzeW5jOiB0cnVlIH0pIDogY29uZmlnLCBjYik7XHJcbn1cblxuLyogRU5EIFRZUEVTICovXHJcbi8qKlxyXG4gKiBDYWxsZWQgd2l0aCBgaW5jbHVkZUZpbGUocGF0aCwgZGF0YSlgXHJcbiAqL1xyXG5mdW5jdGlvbiBpbmNsdWRlRmlsZUhlbHBlcihwYXRoLCBkYXRhKSB7XHJcbiAgICB2YXIgdGVtcGxhdGVBbmRDb25maWcgPSBpbmNsdWRlRmlsZShwYXRoLCB0aGlzKTtcclxuICAgIHJldHVybiB0ZW1wbGF0ZUFuZENvbmZpZ1swXShkYXRhLCB0ZW1wbGF0ZUFuZENvbmZpZ1sxXSk7XHJcbn1cblxuLyogRU5EIFRZUEVTICovXHJcbmZ1bmN0aW9uIGhhbmRsZUNhY2hlKHRlbXBsYXRlLCBvcHRpb25zKSB7XHJcbiAgICBpZiAob3B0aW9ucy5jYWNoZSAmJiBvcHRpb25zLm5hbWUgJiYgb3B0aW9ucy50ZW1wbGF0ZXMuZ2V0KG9wdGlvbnMubmFtZSkpIHtcclxuICAgICAgICByZXR1cm4gb3B0aW9ucy50ZW1wbGF0ZXMuZ2V0KG9wdGlvbnMubmFtZSk7XHJcbiAgICB9XHJcbiAgICB2YXIgdGVtcGxhdGVGdW5jID0gdHlwZW9mIHRlbXBsYXRlID09PSAnZnVuY3Rpb24nID8gdGVtcGxhdGUgOiBjb21waWxlKHRlbXBsYXRlLCBvcHRpb25zKTtcclxuICAgIC8vIE5vdGUgdGhhdCB3ZSBkb24ndCBoYXZlIHRvIGNoZWNrIGlmIGl0IGFscmVhZHkgZXhpc3RzIGluIHRoZSBjYWNoZTtcclxuICAgIC8vIGl0IHdvdWxkIGhhdmUgcmV0dXJuZWQgZWFybGllciBpZiBpdCBoYWRcclxuICAgIGlmIChvcHRpb25zLmNhY2hlICYmIG9wdGlvbnMubmFtZSkge1xyXG4gICAgICAgIG9wdGlvbnMudGVtcGxhdGVzLmRlZmluZShvcHRpb25zLm5hbWUsIHRlbXBsYXRlRnVuYyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGVtcGxhdGVGdW5jO1xyXG59XHJcbi8qKlxyXG4gKiBSZW5kZXIgYSB0ZW1wbGF0ZVxyXG4gKlxyXG4gKiBJZiBgdGVtcGxhdGVgIGlzIGEgc3RyaW5nLCBFdGEgd2lsbCBjb21waWxlIGl0IHRvIGEgZnVuY3Rpb24gYW5kIHRoZW4gY2FsbCBpdCB3aXRoIHRoZSBwcm92aWRlZCBkYXRhLlxyXG4gKiBJZiBgdGVtcGxhdGVgIGlzIGEgdGVtcGxhdGUgZnVuY3Rpb24sIEV0YSB3aWxsIGNhbGwgaXQgd2l0aCB0aGUgcHJvdmlkZWQgZGF0YS5cclxuICpcclxuICogSWYgYGNvbmZpZy5hc3luY2AgaXMgYGZhbHNlYCwgRXRhIHdpbGwgcmV0dXJuIHRoZSByZW5kZXJlZCB0ZW1wbGF0ZS5cclxuICpcclxuICogSWYgYGNvbmZpZy5hc3luY2AgaXMgYHRydWVgIGFuZCB0aGVyZSdzIGEgY2FsbGJhY2sgZnVuY3Rpb24sIEV0YSB3aWxsIGNhbGwgdGhlIGNhbGxiYWNrIHdpdGggYChlcnIsIHJlbmRlcmVkVGVtcGxhdGUpYC5cclxuICogSWYgYGNvbmZpZy5hc3luY2AgaXMgYHRydWVgIGFuZCB0aGVyZSdzIG5vdCBhIGNhbGxiYWNrIGZ1bmN0aW9uLCBFdGEgd2lsbCByZXR1cm4gYSBQcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gdGhlIHJlbmRlcmVkIHRlbXBsYXRlLlxyXG4gKlxyXG4gKiBJZiBgY29uZmlnLmNhY2hlYCBpcyBgdHJ1ZWAgYW5kIGBjb25maWdgIGhhcyBhIGBuYW1lYCBvciBgZmlsZW5hbWVgIHByb3BlcnR5LCBFdGEgd2lsbCBjYWNoZSB0aGUgdGVtcGxhdGUgb24gdGhlIGZpcnN0IHJlbmRlciBhbmQgdXNlIHRoZSBjYWNoZWQgdGVtcGxhdGUgZm9yIGFsbCBzdWJzZXF1ZW50IHJlbmRlcnMuXHJcbiAqXHJcbiAqIEBwYXJhbSB0ZW1wbGF0ZSBUZW1wbGF0ZSBzdHJpbmcgb3IgdGVtcGxhdGUgZnVuY3Rpb25cclxuICogQHBhcmFtIGRhdGEgRGF0YSB0byByZW5kZXIgdGhlIHRlbXBsYXRlIHdpdGhcclxuICogQHBhcmFtIGNvbmZpZyBPcHRpb25hbCBjb25maWcgb3B0aW9uc1xyXG4gKiBAcGFyYW0gY2IgQ2FsbGJhY2sgZnVuY3Rpb25cclxuICovXHJcbmZ1bmN0aW9uIHJlbmRlcih0ZW1wbGF0ZSwgZGF0YSwgY29uZmlnLCBjYikge1xyXG4gICAgdmFyIG9wdGlvbnMgPSBnZXRDb25maWcoY29uZmlnIHx8IHt9KTtcclxuICAgIGlmIChvcHRpb25zLmFzeW5jKSB7XHJcbiAgICAgICAgaWYgKGNiKSB7XHJcbiAgICAgICAgICAgIC8vIElmIHVzZXIgcGFzc2VzIGNhbGxiYWNrXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAvLyBOb3RlOiBpZiB0aGVyZSBpcyBhbiBlcnJvciB3aGlsZSByZW5kZXJpbmcgdGhlIHRlbXBsYXRlLFxyXG4gICAgICAgICAgICAgICAgLy8gSXQgd2lsbCBidWJibGUgdXAgYW5kIGJlIGNhdWdodCBoZXJlXHJcbiAgICAgICAgICAgICAgICB2YXIgdGVtcGxhdGVGbiA9IGhhbmRsZUNhY2hlKHRlbXBsYXRlLCBvcHRpb25zKTtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlRm4oZGF0YSwgb3B0aW9ucywgY2IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjYihlcnIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBObyBjYWxsYmFjaywgdHJ5IHJldHVybmluZyBhIHByb21pc2VcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBwcm9taXNlSW1wbCA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBwcm9taXNlSW1wbChmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShoYW5kbGVDYWNoZSh0ZW1wbGF0ZSwgb3B0aW9ucykoZGF0YSwgb3B0aW9ucykpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgRXRhRXJyKFwiUGxlYXNlIHByb3ZpZGUgYSBjYWxsYmFjayBmdW5jdGlvbiwgdGhpcyBlbnYgZG9lc24ndCBzdXBwb3J0IFByb21pc2VzXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIGhhbmRsZUNhY2hlKHRlbXBsYXRlLCBvcHRpb25zKShkYXRhLCBvcHRpb25zKTtcclxuICAgIH1cclxufVxyXG4vKipcclxuICogUmVuZGVyIGEgdGVtcGxhdGUgYXN5bmNocm9ub3VzbHlcclxuICpcclxuICogSWYgYHRlbXBsYXRlYCBpcyBhIHN0cmluZywgRXRhIHdpbGwgY29tcGlsZSBpdCB0byBhIGZ1bmN0aW9uIGFuZCBjYWxsIGl0IHdpdGggdGhlIHByb3ZpZGVkIGRhdGEuXHJcbiAqIElmIGB0ZW1wbGF0ZWAgaXMgYSBmdW5jdGlvbiwgRXRhIHdpbGwgY2FsbCBpdCB3aXRoIHRoZSBwcm92aWRlZCBkYXRhLlxyXG4gKlxyXG4gKiBJZiB0aGVyZSBpcyBhIGNhbGxiYWNrIGZ1bmN0aW9uLCBFdGEgd2lsbCBjYWxsIGl0IHdpdGggYChlcnIsIHJlbmRlcmVkVGVtcGxhdGUpYC5cclxuICogSWYgdGhlcmUgaXMgbm90IGEgY2FsbGJhY2sgZnVuY3Rpb24sIEV0YSB3aWxsIHJldHVybiBhIFByb21pc2UgdGhhdCByZXNvbHZlcyB0byB0aGUgcmVuZGVyZWQgdGVtcGxhdGVcclxuICpcclxuICogQHBhcmFtIHRlbXBsYXRlIFRlbXBsYXRlIHN0cmluZyBvciB0ZW1wbGF0ZSBmdW5jdGlvblxyXG4gKiBAcGFyYW0gZGF0YSBEYXRhIHRvIHJlbmRlciB0aGUgdGVtcGxhdGUgd2l0aFxyXG4gKiBAcGFyYW0gY29uZmlnIE9wdGlvbmFsIGNvbmZpZyBvcHRpb25zXHJcbiAqIEBwYXJhbSBjYiBDYWxsYmFjayBmdW5jdGlvblxyXG4gKi9cclxuZnVuY3Rpb24gcmVuZGVyQXN5bmModGVtcGxhdGUsIGRhdGEsIGNvbmZpZywgY2IpIHtcclxuICAgIC8vIFVzaW5nIE9iamVjdC5hc3NpZ24gdG8gbG93ZXIgYnVuZGxlIHNpemUsIHVzaW5nIHNwcmVhZCBvcGVyYXRvciBtYWtlcyBpdCBsYXJnZXIgYmVjYXVzZSBvZiB0eXBlc2NyaXB0IGluamVjdGVkIHBvbHlmaWxsc1xyXG4gICAgcmV0dXJuIHJlbmRlcih0ZW1wbGF0ZSwgZGF0YSwgT2JqZWN0LmFzc2lnbih7fSwgY29uZmlnLCB7IGFzeW5jOiB0cnVlIH0pLCBjYik7XHJcbn1cblxuLy8gQGRlbm9pZnktaWdub3JlXHJcbmNvbmZpZy5pbmNsdWRlRmlsZSA9IGluY2x1ZGVGaWxlSGVscGVyO1xyXG5jb25maWcuZmlsZXBhdGhDYWNoZSA9IHt9O1xuXG5leHBvcnQgeyByZW5kZXJGaWxlIGFzIF9fZXhwcmVzcywgY29tcGlsZSwgY29tcGlsZVRvU3RyaW5nLCBjb25maWcsIGNvbmZpZ3VyZSwgY29uZmlnIGFzIGRlZmF1bHRDb25maWcsIGdldENvbmZpZywgbG9hZEZpbGUsIHBhcnNlLCByZW5kZXIsIHJlbmRlckFzeW5jLCByZW5kZXJGaWxlLCByZW5kZXJGaWxlQXN5bmMsIHRlbXBsYXRlcyB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZXRhLmVzLmpzLm1hcFxuIiwiaW1wb3J0IHsgQXBwLCBURmlsZSB9IGZyb20gXCJvYnNpZGlhblwiO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgVFBhcnNlciB7XG4gICAgY29uc3RydWN0b3IocHVibGljIGFwcDogQXBwKSB7fVxuICAgIGFic3RyYWN0IGdlbmVyYXRlQ29udGV4dChmaWxlOiBURmlsZSk6IFByb21pc2U8YW55Pjtcbn0iLCJpbXBvcnQgVGVtcGxhdGVyUGx1Z2luIGZyb20gXCJtYWluXCI7XG5pbXBvcnQgeyBBcHAsIFRGaWxlIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBUUGFyc2VyIH0gZnJvbSBcIlRQYXJzZXJcIjtcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEludGVybmFsTW9kdWxlIGV4dGVuZHMgVFBhcnNlciB7XG4gICAgcHJvdGVjdGVkIGFic3RyYWN0IG5hbWU6IHN0cmluZztcbiAgICBwcm90ZWN0ZWQgc3RhdGljX3RlbXBsYXRlczogTWFwPHN0cmluZywgYW55PiA9IG5ldyBNYXAoKTtcbiAgICBwcm90ZWN0ZWQgZHluYW1pY190ZW1wbGF0ZXM6IE1hcDxzdHJpbmcsIGFueT4gPSBuZXcgTWFwKCk7XG4gICAgcHJvdGVjdGVkIGZpbGU6IFRGaWxlO1xuXG4gICAgY29uc3RydWN0b3IoYXBwOiBBcHAsIHByb3RlY3RlZCBwbHVnaW46IFRlbXBsYXRlclBsdWdpbikge1xuICAgICAgICBzdXBlcihhcHApO1xuICAgIH1cblxuICAgIGdldE5hbWUoKTogU3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmFtZVxuICAgIH1cblxuICAgIGFic3RyYWN0IGNyZWF0ZVN0YXRpY1RlbXBsYXRlcygpOiBQcm9taXNlPHZvaWQ+O1xuICAgIGFic3RyYWN0IHVwZGF0ZVRlbXBsYXRlcygpOiBQcm9taXNlPHZvaWQ+O1xuXG4gICAgYXN5bmMgZ2VuZXJhdGVDb250ZXh0KGZpbGU6IFRGaWxlKSB7XG4gICAgICAgIHRoaXMuZmlsZSA9IGZpbGU7XG5cbiAgICAgICAgaWYgKHRoaXMuc3RhdGljX3RlbXBsYXRlcy5zaXplID09PSAwKSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmNyZWF0ZVN0YXRpY1RlbXBsYXRlcygpO1xuICAgICAgICB9XG4gICAgICAgIGF3YWl0IHRoaXMudXBkYXRlVGVtcGxhdGVzKCk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC4uLk9iamVjdC5mcm9tRW50cmllcyh0aGlzLnN0YXRpY190ZW1wbGF0ZXMpLFxuICAgICAgICAgICAgLi4uT2JqZWN0LmZyb21FbnRyaWVzKHRoaXMuZHluYW1pY190ZW1wbGF0ZXMpLFxuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCB7IEludGVybmFsTW9kdWxlIH0gZnJvbSBcIi4uL0ludGVybmFsTW9kdWxlXCI7XG5cbmV4cG9ydCBjbGFzcyBJbnRlcm5hbE1vZHVsZURhdGUgZXh0ZW5kcyBJbnRlcm5hbE1vZHVsZSB7XG4gICAgbmFtZSA9IFwiZGF0ZVwiO1xuXG4gICAgYXN5bmMgY3JlYXRlU3RhdGljVGVtcGxhdGVzKCkge1xuICAgICAgICB0aGlzLnN0YXRpY190ZW1wbGF0ZXMuc2V0KFwibm93XCIsIHRoaXMuZ2VuZXJhdGVfbm93KCkpO1xuICAgICAgICB0aGlzLnN0YXRpY190ZW1wbGF0ZXMuc2V0KFwidG9tb3Jyb3dcIiwgdGhpcy5nZW5lcmF0ZV90b21vcnJvdygpKTtcbiAgICAgICAgdGhpcy5zdGF0aWNfdGVtcGxhdGVzLnNldChcIndlZWtkYXlcIiwgdGhpcy5nZW5lcmF0ZV93ZWVrZGF5KCkpO1xuICAgICAgICB0aGlzLnN0YXRpY190ZW1wbGF0ZXMuc2V0KFwieWVzdGVyZGF5XCIsIHRoaXMuZ2VuZXJhdGVfeWVzdGVyZGF5KCkpO1xuICAgIH1cblxuICAgIGFzeW5jIHVwZGF0ZVRlbXBsYXRlcygpIHt9XG5cbiAgICBnZW5lcmF0ZV9ub3coKSB7XG4gICAgICAgIHJldHVybiAoZm9ybWF0OiBzdHJpbmcgPSBcIllZWVktTU0tRERcIiwgb2Zmc2V0PzogbnVtYmVyfHN0cmluZywgcmVmZXJlbmNlPzogc3RyaW5nLCByZWZlcmVuY2VfZm9ybWF0Pzogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBpZiAocmVmZXJlbmNlICYmICF3aW5kb3cubW9tZW50KHJlZmVyZW5jZSwgcmVmZXJlbmNlX2Zvcm1hdCkuaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCByZWZlcmVuY2UgZGF0ZSBmb3JtYXQsIHRyeSBzcGVjaWZ5aW5nIG9uZSB3aXRoIHRoZSBhcmd1bWVudCAncmVmZXJlbmNlX2Zvcm1hdCdcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgZHVyYXRpb247XG4gICAgICAgICAgICBpZiAodHlwZW9mIG9mZnNldCA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgIGR1cmF0aW9uID0gd2luZG93Lm1vbWVudC5kdXJhdGlvbihvZmZzZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIG9mZnNldCA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgICAgIGR1cmF0aW9uID0gd2luZG93Lm1vbWVudC5kdXJhdGlvbihvZmZzZXQsIFwiZGF5c1wiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5tb21lbnQocmVmZXJlbmNlLCByZWZlcmVuY2VfZm9ybWF0KS5hZGQoZHVyYXRpb24pLmZvcm1hdChmb3JtYXQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2VuZXJhdGVfdG9tb3Jyb3coKSB7XG4gICAgICAgIHJldHVybiAoZm9ybWF0OiBzdHJpbmcgPSBcIllZWVktTU0tRERcIikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5tb21lbnQoKS5hZGQoMSwgJ2RheXMnKS5mb3JtYXQoZm9ybWF0KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdlbmVyYXRlX3dlZWtkYXkoKSB7XG4gICAgICAgIHJldHVybiAoZm9ybWF0OiBzdHJpbmcgPSBcIllZWVktTU0tRERcIiwgd2Vla2RheTogbnVtYmVyLCByZWZlcmVuY2U/OiBzdHJpbmcsIHJlZmVyZW5jZV9mb3JtYXQ/OiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIGlmIChyZWZlcmVuY2UgJiYgIXdpbmRvdy5tb21lbnQocmVmZXJlbmNlLCByZWZlcmVuY2VfZm9ybWF0KS5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHJlZmVyZW5jZSBkYXRlIGZvcm1hdCwgdHJ5IHNwZWNpZnlpbmcgb25lIHdpdGggdGhlIGFyZ3VtZW50ICdyZWZlcmVuY2VfZm9ybWF0J1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB3aW5kb3cubW9tZW50KHJlZmVyZW5jZSwgcmVmZXJlbmNlX2Zvcm1hdCkud2Vla2RheSh3ZWVrZGF5KS5mb3JtYXQoZm9ybWF0KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdlbmVyYXRlX3llc3RlcmRheSgpIHtcbiAgICAgICAgcmV0dXJuIChmb3JtYXQ6IHN0cmluZyA9IFwiWVlZWS1NTS1ERFwiKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gd2luZG93Lm1vbWVudCgpLmFkZCgtMSwgJ2RheXMnKS5mb3JtYXQoZm9ybWF0KTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJleHBvcnQgY29uc3QgVU5TVVBQT1JURURfTU9CSUxFX1RFTVBMQVRFOiBzdHJpbmcgPSBcIkVycm9yX01vYmlsZVVuc3VwcG9ydGVkVGVtcGxhdGVcIjtcbmV4cG9ydCBjb25zdCBJQ09OX0RBVEE6IHN0cmluZyA9IGA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2aWV3Qm94PVwiMCAwIDUxLjEzMjggMjguN1wiPjxwYXRoIGQ9XCJNMCAxNS4xNCAwIDEwLjE1IDE4LjY3IDEuNTEgMTguNjcgNi4wMyA0LjcyIDEyLjMzIDQuNzIgMTIuNzYgMTguNjcgMTkuMjIgMTguNjcgMjMuNzQgMCAxNS4xNFpNMzMuNjkyOCAxLjg0QzMzLjY5MjggMS44NCAzMy45NzYxIDIuMTQ2NyAzNC41NDI4IDIuNzZDMzUuMTA5NCAzLjM4IDM1LjM5MjggNC41NiAzNS4zOTI4IDYuM0MzNS4zOTI4IDguMDQ2NiAzNC44MTk1IDkuNTQgMzMuNjcyOCAxMC43OEMzMi41MjYxIDEyLjAyIDMxLjA5OTUgMTIuNjQgMjkuMzkyOCAxMi42NEMyNy42ODYyIDEyLjY0IDI2LjI2NjEgMTIuMDI2NyAyNS4xMzI4IDEwLjhDMjMuOTkyOCA5LjU3MzMgMjMuNDIyOCA4LjA4NjcgMjMuNDIyOCA2LjM0QzIzLjQyMjggNC42IDIzLjk5OTUgMy4xMDY2IDI1LjE1MjggMS44NkMyNi4yOTk0LjYyIDI3LjcyNjEgMCAyOS40MzI4IDBDMzEuMTM5NSAwIDMyLjU1OTQuNjEzMyAzMy42OTI4IDEuODRNNDkuODIyOC42NyAyOS41MzI4IDI4LjM4IDI0LjQxMjggMjguMzggNDQuNzEyOC42NyA0OS44MjI4LjY3TTMxLjAzMjggOC4zOEMzMS4wMzI4IDguMzggMzEuMTM5NSA4LjI0NjcgMzEuMzUyOCA3Ljk4QzMxLjU2NjIgNy43MDY3IDMxLjY3MjggNy4xNzMzIDMxLjY3MjggNi4zOEMzMS42NzI4IDUuNTg2NyAzMS40NDYxIDQuOTIgMzAuOTkyOCA0LjM4QzMwLjU0NjEgMy44NCAyOS45OTk1IDMuNTcgMjkuMzUyOCAzLjU3QzI4LjcwNjEgMy41NyAyOC4xNjk1IDMuODQgMjcuNzQyOCA0LjM4QzI3LjMyMjggNC45MiAyNy4xMTI4IDUuNTg2NyAyNy4xMTI4IDYuMzhDMjcuMTEyOCA3LjE3MzMgMjcuMzM2MSA3Ljg0IDI3Ljc4MjggOC4zOEMyOC4yMzYxIDguOTI2NyAyOC43ODYxIDkuMiAyOS40MzI4IDkuMkMzMC4wNzk1IDkuMiAzMC42MTI4IDguOTI2NyAzMS4wMzI4IDguMzhNNDkuNDMyOCAxNy45QzQ5LjQzMjggMTcuOSA0OS43MTYxIDE4LjIwNjcgNTAuMjgyOCAxOC44MkM1MC44NDk1IDE5LjQzMzMgNTEuMTMyOCAyMC42MTMzIDUxLjEzMjggMjIuMzZDNTEuMTMyOCAyNC4xIDUwLjU1OTQgMjUuNTkgNDkuNDEyOCAyNi44M0M0OC4yNTk1IDI4LjA3NjYgNDYuODI5NSAyOC43IDQ1LjEyMjggMjguN0M0My40MjI4IDI4LjcgNDIuMDAyOCAyOC4wODMzIDQwLjg2MjggMjYuODVDMzkuNzI5NSAyNS42MjMzIDM5LjE2MjggMjQuMTM2NiAzOS4xNjI4IDIyLjM5QzM5LjE2MjggMjAuNjUgMzkuNzM2MSAxOS4xNiA0MC44ODI4IDE3LjkyQzQyLjAzNjEgMTYuNjczMyA0My40NjI4IDE2LjA1IDQ1LjE2MjggMTYuMDVDNDYuODY5NCAxNi4wNSA0OC4yOTI4IDE2LjY2NjcgNDkuNDMyOCAxNy45TTQ2Ljg1MjggMjQuNTJDNDYuODUyOCAyNC41MiA0Ni45NTk1IDI0LjM4MzMgNDcuMTcyOCAyNC4xMUM0Ny4zNzk1IDIzLjgzNjcgNDcuNDgyOCAyMy4zMDMzIDQ3LjQ4MjggMjIuNTFDNDcuNDgyOCAyMS43MTY3IDQ3LjI1OTUgMjEuMDUgNDYuODEyOCAyMC41MUM0Ni4zNjYxIDE5Ljk3IDQ1LjgxNjIgMTkuNyA0NS4xNjI4IDE5LjdDNDQuNTE2MSAxOS43IDQzLjk4MjggMTkuOTcgNDMuNTYyOCAyMC41MUM0My4xNDI4IDIxLjA1IDQyLjkzMjggMjEuNzE2NyA0Mi45MzI4IDIyLjUxQzQyLjkzMjggMjMuMzAzMyA0My4xNTYxIDIzLjk3MzMgNDMuNjAyOCAyNC41MkM0NC4wNDk0IDI1LjA2IDQ0LjU5NjEgMjUuMzMgNDUuMjQyOCAyNS4zM0M0NS44ODk1IDI1LjMzIDQ2LjQyNjEgMjUuMDYgNDYuODUyOCAyNC41MlpcIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPjwvc3ZnPmA7IiwiaW1wb3J0IHsgSW50ZXJuYWxNb2R1bGUgfSBmcm9tIFwiLi4vSW50ZXJuYWxNb2R1bGVcIjtcblxuaW1wb3J0IHsgRmlsZVN5c3RlbUFkYXB0ZXIsIGdldEFsbFRhZ3MsIE1hcmtkb3duVmlldywgbm9ybWFsaXplUGF0aCwgcGFyc2VMaW5rdGV4dCwgcmVzb2x2ZVN1YnBhdGgsIFRGaWxlIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBVTlNVUFBPUlRFRF9NT0JJTEVfVEVNUExBVEUgfSBmcm9tIFwiQ29uc3RhbnRzXCI7XG5cbmV4cG9ydCBjb25zdCBERVBUSF9MSU1JVCA9IDEwO1xuXG5leHBvcnQgY2xhc3MgSW50ZXJuYWxNb2R1bGVGaWxlIGV4dGVuZHMgSW50ZXJuYWxNb2R1bGUge1xuICAgIG5hbWUgPSBcImZpbGVcIjtcbiAgICBwcml2YXRlIGluY2x1ZGVfZGVwdGg6IG51bWJlciA9IDA7XG4gICAgcHJpdmF0ZSBsaW5rcGF0aF9yZWdleCA9IG5ldyBSZWdFeHAoXCJeXFxcXFtcXFxcWyguKilcXFxcXVxcXFxdJFwiKTtcblxuICAgIGFzeW5jIGNyZWF0ZVN0YXRpY1RlbXBsYXRlcygpIHtcbiAgICAgICAgLy8gVE9ETzogUmVtb3ZlIHRoaXNcbiAgICAgICAgdGhpcy5zdGF0aWNfdGVtcGxhdGVzLnNldChcImNsaXBib2FyZFwiLCB0aGlzLmdlbmVyYXRlX2NsaXBib2FyZCgpKTtcbiAgICAgICAgdGhpcy5zdGF0aWNfdGVtcGxhdGVzLnNldChcImN1cnNvclwiLCB0aGlzLmdlbmVyYXRlX2N1cnNvcigpKTtcbiAgICAgICAgdGhpcy5zdGF0aWNfdGVtcGxhdGVzLnNldChcInNlbGVjdGlvblwiLCB0aGlzLmdlbmVyYXRlX3NlbGVjdGlvbigpKTtcbiAgICB9XG5cbiAgICBhc3luYyB1cGRhdGVUZW1wbGF0ZXMoKSB7XG4gICAgICAgIHRoaXMuZHluYW1pY190ZW1wbGF0ZXMuc2V0KFwiY29udGVudFwiLCBhd2FpdCB0aGlzLmdlbmVyYXRlX2NvbnRlbnQoKSk7XG4gICAgICAgIHRoaXMuZHluYW1pY190ZW1wbGF0ZXMuc2V0KFwiY3JlYXRpb25fZGF0ZVwiLCB0aGlzLmdlbmVyYXRlX2NyZWF0aW9uX2RhdGUoKSk7XG4gICAgICAgIHRoaXMuZHluYW1pY190ZW1wbGF0ZXMuc2V0KFwiZm9sZGVyXCIsIHRoaXMuZ2VuZXJhdGVfZm9sZGVyKCkpO1xuICAgICAgICB0aGlzLmR5bmFtaWNfdGVtcGxhdGVzLnNldChcImluY2x1ZGVcIiwgdGhpcy5nZW5lcmF0ZV9pbmNsdWRlKCkpO1xuICAgICAgICB0aGlzLmR5bmFtaWNfdGVtcGxhdGVzLnNldChcImxhc3RfbW9kaWZpZWRfZGF0ZVwiLCB0aGlzLmdlbmVyYXRlX2xhc3RfbW9kaWZpZWRfZGF0ZSgpKTtcbiAgICAgICAgdGhpcy5keW5hbWljX3RlbXBsYXRlcy5zZXQoXCJwYXRoXCIsIHRoaXMuZ2VuZXJhdGVfcGF0aCgpKTtcbiAgICAgICAgdGhpcy5keW5hbWljX3RlbXBsYXRlcy5zZXQoXCJyZW5hbWVcIiwgdGhpcy5nZW5lcmF0ZV9yZW5hbWUoKSk7XG4gICAgICAgIHRoaXMuZHluYW1pY190ZW1wbGF0ZXMuc2V0KFwidGFnc1wiLCB0aGlzLmdlbmVyYXRlX3RhZ3MoKSk7XG4gICAgICAgIHRoaXMuZHluYW1pY190ZW1wbGF0ZXMuc2V0KFwidGl0bGVcIiwgdGhpcy5nZW5lcmF0ZV90aXRsZSgpKTtcblxuICAgIH1cblxuICAgIGdlbmVyYXRlX2NsaXBib2FyZCgpIHtcbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgIC8vIFRPRE86IFJlbW92ZSB0aGlzXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5sb2dfdXBkYXRlKFwidHAuZmlsZS5jbGlwYm9hcmQgd2FzIG1vdmVkIHRvIGEgbmV3IG1vZHVsZTogU3lzdGVtIE1vZHVsZSE8YnIvPiBZb3UgbXVzdCBub3cgdXNlIHRwLnN5c3RlbS5jbGlwYm9hcmQoKVwiKTtcbiAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2VuZXJhdGVfY3Vyc29yKCkge1xuICAgICAgICByZXR1cm4gKG9yZGVyPzogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgICAvLyBIYWNrIHRvIHByZXZlbnQgZW1wdHkgb3V0cHV0XG4gICAgICAgICAgICByZXR1cm4gYDwlIHRwLmZpbGUuY3Vyc29yKCR7b3JkZXIgPz8gJyd9KSAlPmA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBnZW5lcmF0ZV9jb250ZW50KCkge1xuICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5hcHAudmF1bHQucmVhZCh0aGlzLmZpbGUpO1xuICAgIH1cblxuICAgIGdlbmVyYXRlX2NyZWF0aW9uX2RhdGUoKSB7XG4gICAgICAgIHJldHVybiAoZm9ybWF0OiBzdHJpbmcgPSBcIllZWVktTU0tREQgSEg6bW1cIikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5tb21lbnQodGhpcy5maWxlLnN0YXQuY3RpbWUpLmZvcm1hdChmb3JtYXQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2VuZXJhdGVfZm9sZGVyKCkge1xuICAgICAgICByZXR1cm4gKHJlbGF0aXZlOiBib29sZWFuID0gZmFsc2UpID0+IHtcbiAgICAgICAgICAgIGxldCBwYXJlbnQgPSB0aGlzLmZpbGUucGFyZW50O1xuICAgICAgICAgICAgbGV0IGZvbGRlcjtcblxuICAgICAgICAgICAgaWYgKHJlbGF0aXZlKSB7XG4gICAgICAgICAgICAgICAgZm9sZGVyID0gcGFyZW50LnBhdGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb2xkZXIgPSBwYXJlbnQubmFtZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIGZvbGRlcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdlbmVyYXRlX2luY2x1ZGUoKSB7XG4gICAgICAgIHJldHVybiBhc3luYyAoaW5jbHVkZV9saW5rOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIC8vIFRPRE86IEFkZCBtdXRleCBmb3IgdGhpcywgdGhpcyBtYXkgY3VycmVudGx5IGxlYWQgdG8gYSByYWNlIGNvbmRpdGlvbi4gXG4gICAgICAgICAgICAvLyBXaGlsZSBub3QgdmVyeSBpbXBhY3RmdWwsIHRoYXQgY291bGQgc3RpbGwgYmUgYW5ub3lpbmcuXG4gICAgICAgICAgICB0aGlzLmluY2x1ZGVfZGVwdGggKz0gMTtcbiAgICAgICAgICAgIGlmICh0aGlzLmluY2x1ZGVfZGVwdGggPiBERVBUSF9MSU1JVCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5jbHVkZV9kZXB0aCA9IDA7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiUmVhY2hlZCBpbmNsdXNpb24gZGVwdGggbGltaXQgKG1heCA9IDEwKVwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IG1hdGNoO1xuICAgICAgICAgICAgaWYgKChtYXRjaCA9IHRoaXMubGlua3BhdGhfcmVnZXguZXhlYyhpbmNsdWRlX2xpbmspKSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLmxvZ191cGRhdGUoXCJ0cC5maWxlLmluY2x1ZGUgd2FzIHVwZGF0ZWQhIFlvdSBtdXN0IG5vdyBwcm92aWRlIHRoZSAnaW5jbHVkZV9maWxlbmFtZScgcGFyYW1ldGVyIGFzIGFuIG9ic2lkaWFuIGxpbmsgaW4gdGhlIGZvcm0gJ1tbTXlGaWxlXV0nPGJyLz48YnIvPlRoaXMgZW5zdXJlcyB0aGF0IGlmIHlvdSBjaGFuZ2UgYSBmaWxlIG5hbWUsIHRwLmZpbGUuaW5jbHVkZSBpc24ndCBicm9rZW4uPGJyLz48YnIvPlRoaXMgYWxzbyBhZGRzIHN1cHBvcnRzIGZvciBzZWN0aW9ucyBhbmQgYmxvY2tzIGluY2x1c2lvbnMhXCIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCB7cGF0aCwgc3VicGF0aH0gPSBwYXJzZUxpbmt0ZXh0KG1hdGNoWzFdKTtcblxuICAgICAgICAgICAgbGV0IGluY19maWxlID0gdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5nZXRGaXJzdExpbmtwYXRoRGVzdChwYXRoLCBcIlwiKTtcbiAgICAgICAgICAgIGlmICghaW5jX2ZpbGUpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEZpbGUgJHtpbmNsdWRlX2xpbmt9IGRvZXNuJ3QgZXhpc3RgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghKGluY19maWxlIGluc3RhbmNlb2YgVEZpbGUpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke2luY2x1ZGVfbGlua30gaXMgYSBmb2xkZXIsIG5vdCBhIGZpbGVgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGluY19maWxlX2NvbnRlbnQgPSBhd2FpdCB0aGlzLmFwcC52YXVsdC5yZWFkKGluY19maWxlKTtcbiAgICAgICAgICAgIGlmIChzdWJwYXRoKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNhY2hlID0gdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5nZXRGaWxlQ2FjaGUoaW5jX2ZpbGUpO1xuICAgICAgICAgICAgICAgIGlmIChjYWNoZSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcmVzdWx0ID0gcmVzb2x2ZVN1YnBhdGgoY2FjaGUsIHN1YnBhdGgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmNfZmlsZV9jb250ZW50ID0gaW5jX2ZpbGVfY29udGVudC5zbGljZShyZXN1bHQuc3RhcnQub2Zmc2V0LCByZXN1bHQuZW5kPy5vZmZzZXQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgcGFyc2VkX2NvbnRlbnQgPSBhd2FpdCB0aGlzLnBsdWdpbi5wYXJzZXIucGFyc2VUZW1wbGF0ZXMoaW5jX2ZpbGVfY29udGVudCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuaW5jbHVkZV9kZXB0aCAtPSAxO1xuICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBwYXJzZWRfY29udGVudDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdlbmVyYXRlX2xhc3RfbW9kaWZpZWRfZGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIChmb3JtYXQ6IHN0cmluZyA9IFwiWVlZWS1NTS1ERCBISDptbVwiKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHJldHVybiB3aW5kb3cubW9tZW50KHRoaXMuZmlsZS5zdGF0Lm10aW1lKS5mb3JtYXQoZm9ybWF0KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdlbmVyYXRlX3BhdGgoKSB7XG4gICAgICAgIHJldHVybiAocmVsYXRpdmU6IGJvb2xlYW4gPSBmYWxzZSkgPT4ge1xuICAgICAgICAgICAgLy8gVE9ETzogQWRkIG1vYmlsZSBzdXBwb3J0XG4gICAgICAgICAgICBpZiAodGhpcy5hcHAuaXNNb2JpbGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gVU5TVVBQT1JURURfTU9CSUxFX1RFTVBMQVRFO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCEodGhpcy5hcHAudmF1bHQuYWRhcHRlciBpbnN0YW5jZW9mIEZpbGVTeXN0ZW1BZGFwdGVyKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImFwcC52YXVsdCBpcyBub3QgYSBGaWxlU3lzdGVtQWRhcHRlciBpbnN0YW5jZVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCB2YXVsdF9wYXRoID0gdGhpcy5hcHAudmF1bHQuYWRhcHRlci5nZXRCYXNlUGF0aCgpO1xuXG4gICAgICAgICAgICBpZiAocmVsYXRpdmUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5maWxlLnBhdGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYCR7dmF1bHRfcGF0aH0vJHt0aGlzLmZpbGUucGF0aH1gO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2VuZXJhdGVfcmVuYW1lKCkge1xuICAgICAgICByZXR1cm4gYXN5bmMgKG5ld190aXRsZTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBsZXQgbmV3X3BhdGggPSBub3JtYWxpemVQYXRoKGAke3RoaXMuZmlsZS5wYXJlbnQucGF0aH0vJHtuZXdfdGl0bGV9LiR7dGhpcy5maWxlLmV4dGVuc2lvbn1gKTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuYXBwLmZpbGVNYW5hZ2VyLnJlbmFtZUZpbGUodGhpcy5maWxlLCBuZXdfcGF0aCk7XG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdlbmVyYXRlX3NlbGVjdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgIGxldCBhY3RpdmVfdmlldyA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG4gICAgICAgICAgICBpZiAoYWN0aXZlX3ZpZXcgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkFjdGl2ZSB2aWV3IGlzIG51bGwsIGNhbid0IHJlYWQgc2VsZWN0aW9uLlwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGVkaXRvciA9IGFjdGl2ZV92aWV3LmVkaXRvcjtcbiAgICAgICAgICAgIHJldHVybiBlZGl0b3IuZ2V0U2VsZWN0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZW5lcmF0ZV90YWdzKCkge1xuICAgICAgICBsZXQgY2FjaGUgPSB0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLmdldEZpbGVDYWNoZSh0aGlzLmZpbGUpO1xuICAgICAgICByZXR1cm4gZ2V0QWxsVGFncyhjYWNoZSk7XG4gICAgfVxuXG4gICAgZ2VuZXJhdGVfdGl0bGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZpbGUuYmFzZW5hbWU7XG4gICAgfVxufSIsImltcG9ydCB7IEludGVybmFsTW9kdWxlIH0gZnJvbSBcIi4uL0ludGVybmFsTW9kdWxlXCI7XG5cbmV4cG9ydCBjbGFzcyBJbnRlcm5hbE1vZHVsZVdlYiBleHRlbmRzIEludGVybmFsTW9kdWxlIHtcbiAgICBuYW1lID0gXCJ3ZWJcIjtcblxuICAgIGFzeW5jIGNyZWF0ZVN0YXRpY1RlbXBsYXRlcygpIHtcbiAgICAgICAgdGhpcy5zdGF0aWNfdGVtcGxhdGVzLnNldChcImRhaWx5X3F1b3RlXCIsIHRoaXMuZ2VuZXJhdGVfZGFpbHlfcXVvdGUoKSk7XG4gICAgICAgIHRoaXMuc3RhdGljX3RlbXBsYXRlcy5zZXQoXCJyYW5kb21fcGljdHVyZVwiLCB0aGlzLmdlbmVyYXRlX3JhbmRvbV9waWN0dXJlKCkpO1xuICAgICAgICAvL3RoaXMuc3RhdGljX3RlbXBsYXRlcy5zZXQoXCJnZXRfcmVxdWVzdFwiLCB0aGlzLmdlbmVyYXRlX2dldF9yZXF1ZXN0KCkpO1xuICAgIH1cbiAgICBcbiAgICBhc3luYyB1cGRhdGVUZW1wbGF0ZXMoKSB7fVxuXG4gICAgYXN5bmMgZ2V0UmVxdWVzdCh1cmw6IHN0cmluZyk6IFByb21pc2U8UmVzcG9uc2U+IHtcbiAgICAgICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsKTtcbiAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRXJyb3IgcGVyZm9ybWluZyBHRVQgcmVxdWVzdFwiKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfVxuXG4gICAgZ2VuZXJhdGVfZGFpbHlfcXVvdGUoKSB7XG4gICAgICAgIHJldHVybiBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLmdldFJlcXVlc3QoXCJodHRwczovL3F1b3Rlcy5yZXN0L3FvZFwiKTtcbiAgICAgICAgICAgIGxldCBqc29uID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuXG4gICAgICAgICAgICBsZXQgYXV0aG9yID0ganNvbi5jb250ZW50cy5xdW90ZXNbMF0uYXV0aG9yO1xuICAgICAgICAgICAgbGV0IHF1b3RlID0ganNvbi5jb250ZW50cy5xdW90ZXNbMF0ucXVvdGU7XG4gICAgICAgICAgICBsZXQgbmV3X2NvbnRlbnQgPSBgPiAke3F1b3RlfVxcbj4gJm1kYXNoOyA8Y2l0ZT4ke2F1dGhvcn08L2NpdGU+YDtcblxuICAgICAgICAgICAgcmV0dXJuIG5ld19jb250ZW50O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2VuZXJhdGVfcmFuZG9tX3BpY3R1cmUoKSB7XG4gICAgICAgIHJldHVybiBhc3luYyAoc2l6ZTogc3RyaW5nLCBxdWVyeT86IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5nZXRSZXF1ZXN0KGBodHRwczovL3NvdXJjZS51bnNwbGFzaC5jb20vcmFuZG9tLyR7c2l6ZSA/PyAnJ30/JHtxdWVyeSA/PyAnJ31gKTtcbiAgICAgICAgICAgIGxldCB1cmwgPSByZXNwb25zZS51cmw7XG4gICAgICAgICAgICByZXR1cm4gYCFbdHAud2ViLnJhbmRvbV9waWN0dXJlXSgke3VybH0pYDsgICBcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRPRE9cbiAgICBnZW5lcmF0ZV93ZWF0aGVyKCkge1xuICAgICAgICByZXR1cm4gYXN5bmMgKHF1ZXJ5Pzogc3RyaW5nKSA9PiB7XG5cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdlbmVyYXRlX2dldF9yZXF1ZXN0KCkge1xuICAgICAgICByZXR1cm4gYXN5bmMgKHVybDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLmdldFJlcXVlc3QodXJsKTtcbiAgICAgICAgICAgIGxldCBqc29uID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgICAgcmV0dXJuIGpzb247XG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IHsgSW50ZXJuYWxNb2R1bGUgfSBmcm9tIFwiLi4vSW50ZXJuYWxNb2R1bGVcIjtcblxuZXhwb3J0IGNsYXNzIEludGVybmFsTW9kdWxlRnJvbnRtYXR0ZXIgZXh0ZW5kcyBJbnRlcm5hbE1vZHVsZSB7XG4gICAgbmFtZSA9IFwiZnJvbnRtYXR0ZXJcIjtcblxuICAgIGFzeW5jIGNyZWF0ZVN0YXRpY1RlbXBsYXRlcygpIHt9XG5cbiAgICBhc3luYyB1cGRhdGVUZW1wbGF0ZXMoKSB7XG4gICAgICAgIGxldCBjYWNoZSA9IHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0RmlsZUNhY2hlKHRoaXMuZmlsZSlcbiAgICAgICAgdGhpcy5keW5hbWljX3RlbXBsYXRlcyA9IG5ldyBNYXAoT2JqZWN0LmVudHJpZXMoY2FjaGU/LmZyb250bWF0dGVyIHx8IHt9KSk7XG4gICAgfVxufSIsImltcG9ydCB7IEFwcCwgTW9kYWwgfSBmcm9tIFwib2JzaWRpYW5cIjtcblxuZXhwb3J0IGNsYXNzIFByb21wdE1vZGFsIGV4dGVuZHMgTW9kYWwge1xuICAgIHByaXZhdGUgcHJvbXB0RWw6IEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgcHJpdmF0ZSByZXNvbHZlOiAodmFsdWU6IHN0cmluZykgPT4gdm9pZDtcbiAgICBwcml2YXRlIHJlamVjdDogKHJlYXNvbj86IGFueSkgPT4gdm9pZDtcbiAgICBwcml2YXRlIHN1Ym1pdHRlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgY29uc3RydWN0b3IoYXBwOiBBcHAsIHByaXZhdGUgcHJvbXB0X3RleHQ6IHN0cmluZywgcHJpdmF0ZSBkZWZhdWx0X3ZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgc3VwZXIoYXBwKTtcbiAgICB9XG5cbiAgICBvbk9wZW4oKSB7XG4gICAgICAgIHRoaXMudGl0bGVFbC5zZXRUZXh0KHRoaXMucHJvbXB0X3RleHQpO1xuICAgICAgICB0aGlzLmNyZWF0ZUZvcm0oKTtcbiAgICB9XG5cbiAgICBvbkNsb3NlKCkge1xuICAgICAgICB0aGlzLmNvbnRlbnRFbC5lbXB0eSgpO1xuICAgICAgICBpZiAoIXRoaXMuc3VibWl0dGVkKSB7XG4gICAgICAgICAgICB0aGlzLnJlamVjdChuZXcgRXJyb3IoXCJDYW5jZWxsZWQgcHJvbXB0XCIpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZUZvcm0oKSB7XG4gICAgICAgIGxldCBkaXYgPSB0aGlzLmNvbnRlbnRFbC5jcmVhdGVEaXYoKTtcbiAgICAgICAgZGl2LmFkZENsYXNzKFwidGVtcGxhdGVyLXByb21wdC1kaXZcIik7XG5cbiAgICAgICAgbGV0IGZvcm0gPSBkaXYuY3JlYXRlRWwoXCJmb3JtXCIpO1xuICAgICAgICBmb3JtLmFkZENsYXNzKFwidGVtcGxhdGVyLXByb21wdC1mb3JtXCIpO1xuICAgICAgICBmb3JtLnR5cGUgPSBcInN1Ym1pdFwiO1xuICAgICAgICBmb3JtLm9uc3VibWl0ID0gKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgICB0aGlzLnN1Ym1pdHRlZCA9IHRydWU7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLnJlc29sdmUodGhpcy5wcm9tcHRFbC52YWx1ZSk7XG4gICAgICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnByb21wdEVsID0gZm9ybS5jcmVhdGVFbChcImlucHV0XCIpO1xuICAgICAgICB0aGlzLnByb21wdEVsLnR5cGUgPSBcInRleHRcIjtcbiAgICAgICAgdGhpcy5wcm9tcHRFbC5wbGFjZWhvbGRlciA9IFwiVHlwZSB0ZXh0IGhlcmUuLi5cIjtcbiAgICAgICAgdGhpcy5wcm9tcHRFbC52YWx1ZSA9IHRoaXMuZGVmYXVsdF92YWx1ZSA/PyBcIlwiO1xuICAgICAgICB0aGlzLnByb21wdEVsLmFkZENsYXNzKFwidGVtcGxhdGVyLXByb21wdC1pbnB1dFwiKVxuICAgICAgICB0aGlzLnByb21wdEVsLnNlbGVjdCgpO1xuICAgIH1cblxuICAgIGFzeW5jIG9wZW5BbmRHZXRWYWx1ZShyZXNvbHZlOiAodmFsdWU6IHN0cmluZykgPT4gdm9pZCwgcmVqZWN0OiAocmVhc29uPzogYW55KSA9PiB2b2lkKSB7XG4gICAgICAgIHRoaXMucmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgICAgIHRoaXMucmVqZWN0ID0gcmVqZWN0O1xuICAgICAgICB0aGlzLm9wZW4oKTtcbiAgICB9XG59IiwiaW1wb3J0IHsgQXBwLCBGdXp6eU1hdGNoLCBGdXp6eVN1Z2dlc3RNb2RhbCB9IGZyb20gXCJvYnNpZGlhblwiO1xuXG5cbmV4cG9ydCBjbGFzcyBTdWdnZXN0ZXJNb2RhbDxUPiBleHRlbmRzIEZ1enp5U3VnZ2VzdE1vZGFsPFQ+IHtcbiAgICBwcml2YXRlIHJlc29sdmU6ICh2YWx1ZTogVCkgPT4gdm9pZDtcbiAgICBwcml2YXRlIHJlamVjdDogKHJlYXNvbj86IGFueSkgPT4gdm9pZDtcbiAgICBwcml2YXRlIHN1Ym1pdHRlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgY29uc3RydWN0b3IoYXBwOiBBcHAsIHByaXZhdGUgdGV4dF9pdGVtczogc3RyaW5nW10gfCAoKGl0ZW06IFQpID0+IHN0cmluZyksIHByaXZhdGUgaXRlbXM6IFRbXSkge1xuICAgICAgICBzdXBlcihhcHApO1xuICAgIH1cblxuICAgIGdldEl0ZW1zKCk6IFRbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLml0ZW1zO1xuICAgIH1cbiAgICBcbiAgICBvbkNsb3NlKCkge1xuICAgICAgICBpZiAoIXRoaXMuc3VibWl0dGVkKSB7XG4gICAgICAgICAgICB0aGlzLnJlamVjdChuZXcgRXJyb3IoXCJDYW5jZWxsZWQgcHJvbXB0XCIpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNlbGVjdFN1Z2dlc3Rpb24odmFsdWU6IEZ1enp5TWF0Y2g8VD4sIGV2dDogTW91c2VFdmVudCB8IEtleWJvYXJkRXZlbnQpIHtcbiAgICAgICAgdGhpcy5zdWJtaXR0ZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICAgIHRoaXMub25DaG9vc2VTdWdnZXN0aW9uKHZhbHVlLCBldnQpO1xuICAgIH1cblxuICAgIGdldEl0ZW1UZXh0KGl0ZW06IFQpOiBzdHJpbmcge1xuICAgICAgICBpZiAodGhpcy50ZXh0X2l0ZW1zIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRleHRfaXRlbXMoaXRlbSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMudGV4dF9pdGVtc1t0aGlzLml0ZW1zLmluZGV4T2YoaXRlbSldIHx8IFwiVW5kZWZpbmVkIFRleHQgSXRlbVwiO1xuICAgIH1cblxuICAgIG9uQ2hvb3NlSXRlbShpdGVtOiBULCBfZXZ0OiBNb3VzZUV2ZW50IHwgS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgICAgICB0aGlzLnJlc29sdmUoaXRlbSk7XG4gICAgfVxuXG4gICAgYXN5bmMgb3BlbkFuZEdldFZhbHVlKHJlc29sdmU6ICh2YWx1ZTogVCkgPT4gdm9pZCwgcmVqZWN0OiAocmVhc29uPzogYW55KSA9PiB2b2lkKSB7XG4gICAgICAgIHRoaXMucmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgICAgIHRoaXMucmVqZWN0ID0gcmVqZWN0O1xuICAgICAgICB0aGlzLm9wZW4oKTtcbiAgICB9XG59IiwiaW1wb3J0IHsgVU5TVVBQT1JURURfTU9CSUxFX1RFTVBMQVRFIH0gZnJvbSBcIkNvbnN0YW50c1wiO1xuaW1wb3J0IHsgSW50ZXJuYWxNb2R1bGUgfSBmcm9tIFwiSW50ZXJuYWxUZW1wbGF0ZXMvSW50ZXJuYWxNb2R1bGVcIjtcbmltcG9ydCB7IFByb21wdE1vZGFsIH0gZnJvbSBcIi4vUHJvbXB0TW9kYWxcIjtcbmltcG9ydCB7IFN1Z2dlc3Rlck1vZGFsIH0gZnJvbSBcIi4vU3VnZ2VzdGVyTW9kYWxcIjtcblxuZXhwb3J0IGNsYXNzIEludGVybmFsTW9kdWxlU3lzdGVtIGV4dGVuZHMgSW50ZXJuYWxNb2R1bGUge1xuICAgIG5hbWUgPSBcInN5c3RlbVwiO1xuXG4gICAgYXN5bmMgY3JlYXRlU3RhdGljVGVtcGxhdGVzKCkge1xuICAgICAgICB0aGlzLnN0YXRpY190ZW1wbGF0ZXMuc2V0KFwiY2xpcGJvYXJkXCIsIHRoaXMuZ2VuZXJhdGVfY2xpcGJvYXJkKCkpO1xuICAgICAgICB0aGlzLnN0YXRpY190ZW1wbGF0ZXMuc2V0KFwicHJvbXB0XCIsIHRoaXMuZ2VuZXJhdGVfcHJvbXB0KCkpO1xuICAgICAgICB0aGlzLnN0YXRpY190ZW1wbGF0ZXMuc2V0KFwic3VnZ2VzdGVyXCIsIHRoaXMuZ2VuZXJhdGVfc3VnZ2VzdGVyKCkpO1xuICAgIH1cblxuICAgIGFzeW5jIHVwZGF0ZVRlbXBsYXRlcygpIHt9XG5cbiAgICBnZW5lcmF0ZV9jbGlwYm9hcmQoKSB7XG4gICAgICAgIHJldHVybiBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAvLyBUT0RPOiBBZGQgbW9iaWxlIHN1cHBvcnRcbiAgICAgICAgICAgIGlmICh0aGlzLmFwcC5pc01vYmlsZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBVTlNVUFBPUlRFRF9NT0JJTEVfVEVNUExBVEU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC5yZWFkVGV4dCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2VuZXJhdGVfcHJvbXB0KCkge1xuICAgICAgICByZXR1cm4gYXN5bmMgKHByb21wdF90ZXh0Pzogc3RyaW5nLCBkZWZhdWx0X3ZhbHVlPzogc3RyaW5nLCB0aHJvd19vbl9jYW5jZWw6IGJvb2xlYW4gPSBmYWxzZSk6IFByb21pc2U8c3RyaW5nPiA9PiB7XG4gICAgICAgICAgICBsZXQgcHJvbXB0ID0gbmV3IFByb21wdE1vZGFsKHRoaXMuYXBwLCBwcm9tcHRfdGV4dCwgZGVmYXVsdF92YWx1ZSk7XG4gICAgICAgICAgICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlOiAodmFsdWU6IHN0cmluZykgPT4gdm9pZCwgcmVqZWN0OiAocmVhc29uPzogYW55KSA9PiB2b2lkKSA9PiBwcm9tcHQub3BlbkFuZEdldFZhbHVlKHJlc29sdmUsIHJlamVjdCkpO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgcHJvbWlzZTtcbiAgICAgICAgICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhyb3dfb25fY2FuY2VsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdlbmVyYXRlX3N1Z2dlc3RlcigpIHtcbiAgICAgICAgcmV0dXJuIGFzeW5jIDxUPih0ZXh0X2l0ZW1zOiBzdHJpbmdbXSB8ICgoaXRlbTogVCkgPT4gc3RyaW5nKSwgaXRlbXM6IFRbXSwgdGhyb3dfb25fY2FuY2VsOiBib29sZWFuID0gZmFsc2UpOiBQcm9taXNlPFQ+ID0+IHtcbiAgICAgICAgICAgIGxldCBzdWdnZXN0ZXIgPSBuZXcgU3VnZ2VzdGVyTW9kYWwodGhpcy5hcHAsIHRleHRfaXRlbXMsIGl0ZW1zKTtcbiAgICAgICAgICAgIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmU6ICh2YWx1ZTogVCkgPT4gdm9pZCwgcmVqZWN0OiAocmVhc29uPzogYW55KSA9PiB2b2lkKSA9PiBzdWdnZXN0ZXIub3BlbkFuZEdldFZhbHVlKHJlc29sdmUsIHJlamVjdCkpO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgcHJvbWlzZVxuICAgICAgICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICAgICAgICAgIGlmICh0aHJvd19vbl9jYW5jZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCB7IEFwcCwgVEZpbGUgfSBmcm9tIFwib2JzaWRpYW5cIjtcblxuaW1wb3J0IFRlbXBsYXRlclBsdWdpbiBmcm9tIFwibWFpblwiO1xuaW1wb3J0IHsgVFBhcnNlciB9IGZyb20gXCJUUGFyc2VyXCI7XG5pbXBvcnQgeyBJbnRlcm5hbE1vZHVsZSB9IGZyb20gXCIuL0ludGVybmFsTW9kdWxlXCI7XG5pbXBvcnQgeyBJbnRlcm5hbE1vZHVsZURhdGUgfSBmcm9tIFwiLi9kYXRlL0ludGVybmFsTW9kdWxlRGF0ZVwiO1xuaW1wb3J0IHsgSW50ZXJuYWxNb2R1bGVGaWxlIH0gZnJvbSBcIi4vZmlsZS9JbnRlcm5hbE1vZHVsZUZpbGVcIjtcbmltcG9ydCB7IEludGVybmFsTW9kdWxlV2ViIH0gZnJvbSBcIi4vd2ViL0ludGVybmFsTW9kdWxlV2ViXCI7XG5pbXBvcnQgeyBJbnRlcm5hbE1vZHVsZUZyb250bWF0dGVyIH0gZnJvbSBcIi4vZnJvbnRtYXR0ZXIvSW50ZXJuYWxNb2R1bGVGcm9udG1hdHRlclwiO1xuaW1wb3J0IHsgSW50ZXJuYWxNb2R1bGVTeXN0ZW0gfSBmcm9tIFwiLi9zeXN0ZW0vSW50ZXJuYWxNb2R1bGVTeXN0ZW1cIjtcblxuZXhwb3J0IGNsYXNzIEludGVybmFsVGVtcGxhdGVQYXJzZXIgZXh0ZW5kcyBUUGFyc2VyIHtcbiAgICBwcml2YXRlIG1vZHVsZXNfYXJyYXk6IEFycmF5PEludGVybmFsTW9kdWxlPiA9IG5ldyBBcnJheSgpO1xuXG4gICAgY29uc3RydWN0b3IoYXBwOiBBcHAsIHByaXZhdGUgcGx1Z2luOiBUZW1wbGF0ZXJQbHVnaW4pIHtcbiAgICAgICAgc3VwZXIoYXBwKTtcbiAgICAgICAgdGhpcy5jcmVhdGVNb2R1bGVzKCk7XG4gICAgfVxuXG4gICAgY3JlYXRlTW9kdWxlcygpIHtcbiAgICAgICAgdGhpcy5tb2R1bGVzX2FycmF5LnB1c2gobmV3IEludGVybmFsTW9kdWxlRGF0ZSh0aGlzLmFwcCwgdGhpcy5wbHVnaW4pKTtcbiAgICAgICAgdGhpcy5tb2R1bGVzX2FycmF5LnB1c2gobmV3IEludGVybmFsTW9kdWxlRmlsZSh0aGlzLmFwcCwgdGhpcy5wbHVnaW4pKTtcbiAgICAgICAgdGhpcy5tb2R1bGVzX2FycmF5LnB1c2gobmV3IEludGVybmFsTW9kdWxlV2ViKHRoaXMuYXBwLCB0aGlzLnBsdWdpbikpO1xuICAgICAgICB0aGlzLm1vZHVsZXNfYXJyYXkucHVzaChuZXcgSW50ZXJuYWxNb2R1bGVGcm9udG1hdHRlcih0aGlzLmFwcCwgdGhpcy5wbHVnaW4pKTtcbiAgICAgICAgdGhpcy5tb2R1bGVzX2FycmF5LnB1c2gobmV3IEludGVybmFsTW9kdWxlU3lzdGVtKHRoaXMuYXBwLCB0aGlzLnBsdWdpbikpO1xuICAgIH1cblxuICAgIGFzeW5jIGdlbmVyYXRlQ29udGV4dChmOiBURmlsZSkge1xuICAgICAgICBsZXQgbW9kdWxlc19jb250ZXh0X21hcCA9IG5ldyBNYXAoKTtcblxuICAgICAgICBmb3IgKGxldCBtb2Qgb2YgdGhpcy5tb2R1bGVzX2FycmF5KSB7XG4gICAgICAgICAgICBtb2R1bGVzX2NvbnRleHRfbWFwLnNldChtb2QuZ2V0TmFtZSgpLCBhd2FpdCBtb2QuZ2VuZXJhdGVDb250ZXh0KGYpKTtcbiAgICAgICAgfVxuXG4gICAgICAgcmV0dXJuIE9iamVjdC5mcm9tRW50cmllcyhtb2R1bGVzX2NvbnRleHRfbWFwKTtcbiAgICB9XG59IiwiaW1wb3J0IHsgQXBwLCBGaWxlU3lzdGVtQWRhcHRlciwgTm90aWNlLCBURmlsZSB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgZXhlYyB9IGZyb20gXCJjaGlsZF9wcm9jZXNzXCI7XG5pbXBvcnQgeyBwcm9taXNpZnkgfSBmcm9tIFwidXRpbFwiO1xuXG5pbXBvcnQgVGVtcGxhdGVyUGx1Z2luIGZyb20gXCJtYWluXCI7XG5pbXBvcnQgeyBDb250ZXh0TW9kZSB9IGZyb20gXCJUZW1wbGF0ZVBhcnNlclwiO1xuaW1wb3J0IHsgVFBhcnNlciB9IGZyb20gXCJUUGFyc2VyXCI7XG5pbXBvcnQgeyBVTlNVUFBPUlRFRF9NT0JJTEVfVEVNUExBVEUgfSBmcm9tIFwiQ29uc3RhbnRzXCI7XG5cbmV4cG9ydCBjbGFzcyBVc2VyVGVtcGxhdGVQYXJzZXIgZXh0ZW5kcyBUUGFyc2VyIHtcbiAgICBjd2Q6IHN0cmluZztcbiAgICBjbWRfb3B0aW9uczogYW55O1xuXG4gICAgY29uc3RydWN0b3IoYXBwOiBBcHAsIHByaXZhdGUgcGx1Z2luOiBUZW1wbGF0ZXJQbHVnaW4pIHtcbiAgICAgICAgc3VwZXIoYXBwKTtcbiAgICAgICAgdGhpcy5yZXNvbHZlQ3dkKCk7ICAgICAgICBcbiAgICB9XG5cbiAgICByZXNvbHZlQ3dkKCkge1xuICAgICAgICAvLyBUT0RPOiBBZGQgbW9iaWxlIHN1cHBvcnRcbiAgICAgICAgaWYgKHRoaXMuYXBwLmlzTW9iaWxlIHx8ICEodGhpcy5hcHAudmF1bHQuYWRhcHRlciBpbnN0YW5jZW9mIEZpbGVTeXN0ZW1BZGFwdGVyKSkge1xuICAgICAgICAgICAgdGhpcy5jd2QgPSBcIlwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jd2QgPSB0aGlzLmFwcC52YXVsdC5hZGFwdGVyLmdldEJhc2VQYXRoKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBnZW5lcmF0ZVVzZXJUZW1wbGF0ZXMoZmlsZTogVEZpbGUpIHtcbiAgICAgICAgbGV0IHVzZXJfdGVtcGxhdGVzID0gbmV3IE1hcCgpO1xuICAgICAgICBjb25zdCBleGVjX3Byb21pc2UgPSBwcm9taXNpZnkoZXhlYyk7XG5cbiAgICAgICAgbGV0IGNvbnRleHQgPSBhd2FpdCB0aGlzLnBsdWdpbi5wYXJzZXIuZ2VuZXJhdGVDb250ZXh0KGZpbGUsIENvbnRleHRNb2RlLklOVEVSTkFMKTtcblxuICAgICAgICBmb3IgKGxldCBbdGVtcGxhdGUsIGNtZF0gb2YgdGhpcy5wbHVnaW4uc2V0dGluZ3MudGVtcGxhdGVzX3BhaXJzKSB7XG4gICAgICAgICAgICBpZiAodGVtcGxhdGUgPT09IFwiXCIgfHwgY21kID09PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmFwcC5pc01vYmlsZSkge1xuICAgICAgICAgICAgICAgIHVzZXJfdGVtcGxhdGVzLnNldCh0ZW1wbGF0ZSwgKHVzZXJfYXJncz86IGFueSk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBVTlNVUFBPUlRFRF9NT0JJTEVfVEVNUExBVEU7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNtZCA9IGF3YWl0IHRoaXMucGx1Z2luLnBhcnNlci5wYXJzZVRlbXBsYXRlcyhjbWQsIGNvbnRleHQpO1xuXG4gICAgICAgICAgICAgICAgdXNlcl90ZW1wbGF0ZXMuc2V0KHRlbXBsYXRlLCBhc3luYyAodXNlcl9hcmdzPzogYW55KTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwcm9jZXNzX2VudiA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5wcm9jZXNzLmVudixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi51c2VyX2FyZ3MsXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgY21kX29wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGltZW91dDogdGhpcy5wbHVnaW4uc2V0dGluZ3MuY29tbWFuZF90aW1lb3V0ICogMTAwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjd2Q6IHRoaXMuY3dkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudjogcHJvY2Vzc19lbnYsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4uKHRoaXMucGx1Z2luLnNldHRpbmdzLnNoZWxsX3BhdGggIT09IFwiXCIgJiYge3NoZWxsOiB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zaGVsbF9wYXRofSksXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQge3N0ZG91dH0gPSBhd2FpdCBleGVjX3Byb21pc2UoY21kLCBjbWRfb3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3Rkb3V0LnRyaW1SaWdodCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNhdGNoKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5sb2dfZXJyb3IoYEVycm9yIHdpdGggVXNlciBUZW1wbGF0ZSAke3RlbXBsYXRlfWAsIGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHVzZXJfdGVtcGxhdGVzO1xuICAgIH1cblxuICAgIGFzeW5jIGdlbmVyYXRlQ29udGV4dChmaWxlOiBURmlsZSkge1xuICAgICAgICBsZXQgdXNlcl90ZW1wbGF0ZXMgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy5lbmFibGVfc3lzdGVtX2NvbW1hbmRzID8gYXdhaXQgdGhpcy5nZW5lcmF0ZVVzZXJUZW1wbGF0ZXMoZmlsZSkgOiBuZXcgTWFwKCk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC4uLk9iamVjdC5mcm9tRW50cmllcyh1c2VyX3RlbXBsYXRlcyksXG4gICAgICAgIH07XG4gICAgfVxufSIsImltcG9ydCB7IEFwcCwgRWRpdG9yUG9zaXRpb24sIEVkaXRvclJhbmdlT3JDYXJldCwgRWRpdG9yVHJhbnNhY3Rpb24sIE1hcmtkb3duVmlldyB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgZXNjYXBlUmVnRXhwIH0gZnJvbSBcIlV0aWxzXCI7XG5cbmV4cG9ydCBjbGFzcyBDdXJzb3JKdW1wZXIge1xuICAgIHByaXZhdGUgY3Vyc29yX3JlZ2V4ID0gbmV3IFJlZ0V4cChcIjwlXFxcXHMqdHAuZmlsZS5jdXJzb3JcXFxcKCg/PG9yZGVyPlswLTldezAsMn0pXFxcXClcXFxccyolPlwiLCBcImdcIik7XHRcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYXBwOiBBcHApIHt9XG5cbiAgICBnZXRfZWRpdG9yX3Bvc2l0aW9uX2Zyb21faW5kZXgoY29udGVudDogc3RyaW5nLCBpbmRleDogbnVtYmVyKTogRWRpdG9yUG9zaXRpb24ge1xuICAgICAgICBsZXQgc3Vic3RyID0gY29udGVudC5zdWJzdHIoMCwgaW5kZXgpO1xuXG4gICAgICAgIGxldCBsID0gMDtcbiAgICAgICAgbGV0IG9mZnNldCA9IC0xO1xuICAgICAgICBsZXQgciA9IC0xO1xuICAgICAgICBmb3IgKDsgKHIgPSBzdWJzdHIuaW5kZXhPZihcIlxcblwiLCByKzEpKSAhPT0gLTEgOyBsKyssIG9mZnNldD1yKTtcbiAgICAgICAgb2Zmc2V0ICs9IDE7XG5cbiAgICAgICAgbGV0IGNoID0gY29udGVudC5zdWJzdHIob2Zmc2V0LCBpbmRleC1vZmZzZXQpLmxlbmd0aDtcblxuICAgICAgICByZXR1cm4ge2xpbmU6IGwsIGNoOiBjaH07XG4gICAgfVxuXG4gICAgYXN5bmMganVtcF90b19uZXh0X2N1cnNvcl9sb2NhdGlvbigpIHtcbiAgICAgICAgbGV0IGFjdGl2ZV92aWV3ID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcbiAgICAgICAgaWYgKGFjdGl2ZV92aWV3ID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJObyBhY3RpdmUgdmlldywgY2FuJ3QgYXBwZW5kIHRlbXBsYXRlcy5cIik7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGFjdGl2ZV9maWxlID0gYWN0aXZlX3ZpZXcuZmlsZTtcbiAgICAgICAgYXdhaXQgYWN0aXZlX3ZpZXcuc2F2ZSgpO1xuXG4gICAgICAgIGxldCBjb250ZW50ID0gYXdhaXQgdGhpcy5hcHAudmF1bHQucmVhZChhY3RpdmVfZmlsZSk7XG5cbiAgICAgICAgY29uc3Qge25ld19jb250ZW50LCBwb3NpdGlvbnN9ID0gdGhpcy5yZXBsYWNlX2FuZF9nZXRfY3Vyc29yX3Bvc2l0aW9ucyhjb250ZW50KTtcbiAgICAgICAgaWYgKHBvc2l0aW9ucykge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5hcHAudmF1bHQubW9kaWZ5KGFjdGl2ZV9maWxlLCBuZXdfY29udGVudCk7XG4gICAgICAgICAgICB0aGlzLnNldF9jdXJzb3JfbG9jYXRpb24ocG9zaXRpb25zKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlcGxhY2VfYW5kX2dldF9jdXJzb3JfcG9zaXRpb25zKGNvbnRlbnQ6IHN0cmluZykge1xuICAgICAgICBsZXQgY3Vyc29yX21hdGNoZXMgPSBbXTtcbiAgICAgICAgbGV0IG1hdGNoO1xuICAgICAgICB3aGlsZSgobWF0Y2ggPSB0aGlzLmN1cnNvcl9yZWdleC5leGVjKGNvbnRlbnQpKSAhPSBudWxsKSB7XG4gICAgICAgICAgICBjdXJzb3JfbWF0Y2hlcy5wdXNoKG1hdGNoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY3Vyc29yX21hdGNoZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4ge307XG4gICAgICAgIH1cblxuICAgICAgICBjdXJzb3JfbWF0Y2hlcy5zb3J0KChtMSwgbTIpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBOdW1iZXIobTEuZ3JvdXBzW1wib3JkZXJcIl0pIC0gTnVtYmVyKG0yLmdyb3Vwc1tcIm9yZGVyXCJdKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGxldCBtYXRjaF9zdHIgPSBjdXJzb3JfbWF0Y2hlc1swXVswXTtcblxuICAgICAgICBjdXJzb3JfbWF0Y2hlcyA9IGN1cnNvcl9tYXRjaGVzLmZpbHRlcihtID0+IHtcbiAgICAgICAgICAgIHJldHVybiBtWzBdID09PSBtYXRjaF9zdHI7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxldCBwb3NpdGlvbnMgPSBbXTtcbiAgICAgICAgbGV0IGluZGV4X29mZnNldCA9IDA7XG4gICAgICAgIGZvciAobGV0IG1hdGNoIG9mIGN1cnNvcl9tYXRjaGVzKSB7XG4gICAgICAgICAgICBsZXQgaW5kZXggPSBtYXRjaC5pbmRleCAtIGluZGV4X29mZnNldDtcbiAgICAgICAgICAgIHBvc2l0aW9ucy5wdXNoKHRoaXMuZ2V0X2VkaXRvcl9wb3NpdGlvbl9mcm9tX2luZGV4KGNvbnRlbnQsIGluZGV4KSk7XG5cbiAgICAgICAgICAgIGNvbnRlbnQgPSBjb250ZW50LnJlcGxhY2UobmV3IFJlZ0V4cChlc2NhcGVSZWdFeHAobWF0Y2hbMF0pKSwgXCJcIik7XG4gICAgICAgICAgICBpbmRleF9vZmZzZXQgKz0gbWF0Y2hbMF0ubGVuZ3RoO1xuXG4gICAgICAgICAgICAvLyBUT0RPOiBSZW1vdmUgdGhpcywgYnJlYWtpbmcgZm9yIG5vdyB3YWl0aW5nIGZvciB0aGUgbmV3IHNldFNlbGVjdGlvbnMgQVBJXG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgIC8vIEZvciB0cC5maWxlLmN1cnNvcigpLCB3ZSBvbmx5IGZpbmQgb25lXG4gICAgICAgICAgICBpZiAobWF0Y2hbMV0gPT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICovXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge25ld19jb250ZW50OiBjb250ZW50LCBwb3NpdGlvbnM6IHBvc2l0aW9uc307XG4gICAgfVxuXG4gICAgc2V0X2N1cnNvcl9sb2NhdGlvbihwb3NpdGlvbnM6IEFycmF5PEVkaXRvclBvc2l0aW9uPikge1xuICAgICAgICBsZXQgYWN0aXZlX3ZpZXcgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xuICAgICAgICBpZiAoYWN0aXZlX3ZpZXcgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRPRE86IFJlbW92ZSB0aGlzXG4gICAgICAgIGxldCBlZGl0b3IgPSBhY3RpdmVfdmlldy5lZGl0b3I7XG4gICAgICAgIGVkaXRvci5mb2N1cygpO1xuICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yKHBvc2l0aW9uc1swXSk7XG5cbiAgICAgICAgLypcbiAgICAgICAgbGV0IHNlbGVjdGlvbnMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgcG9zIG9mIHBvc2l0aW9ucykge1xuICAgICAgICAgICAgc2VsZWN0aW9ucy5wdXNoKHthbmNob3I6IHBvcywgaGVhZDogcG9zfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWRpdG9yLmZvY3VzKCk7XG4gICAgICAgIGVkaXRvci5zZXRTZWxlY3Rpb25zKHNlbGVjdGlvbnMpO1xuICAgICAgICAqL1xuXG4gICAgICAgIC8qXG4gICAgICAgIC8vIENoZWNrIGh0dHBzOi8vZ2l0aHViLmNvbS9vYnNpZGlhbm1kL29ic2lkaWFuLWFwaS9pc3N1ZXMvMTRcblxuICAgICAgICBsZXQgZWRpdG9yID0gYWN0aXZlX3ZpZXcuZWRpdG9yO1xuICAgICAgICBlZGl0b3IuZm9jdXMoKTtcblxuICAgICAgICBmb3IgKGxldCBwb3Mgb2YgcG9zaXRpb25zKSB7XG4gICAgICAgICAgICBsZXQgdHJhbnNhY3Rpb246IEVkaXRvclRyYW5zYWN0aW9uID0ge1xuICAgICAgICAgICAgICAgIHNlbGVjdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICBmcm9tOiBwb3NcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZWRpdG9yLnRyYW5zYWN0aW9uKHRyYW5zYWN0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICAqL1xuICAgIH1cbn0iLCJpbXBvcnQgKiBhcyBvYnNpZGlhbiBmcm9tICdvYnNpZGlhbic7IFxuaW1wb3J0IHsgQXBwLCBNYXJrZG93blZpZXcsIFRGaWxlLCBURm9sZGVyIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgKiBhcyBFdGEgZnJvbSBcImV0YVwiO1xuXG5pbXBvcnQgeyBJbnRlcm5hbFRlbXBsYXRlUGFyc2VyIH0gZnJvbSBcIi4vSW50ZXJuYWxUZW1wbGF0ZXMvSW50ZXJuYWxUZW1wbGF0ZVBhcnNlclwiO1xuaW1wb3J0IFRlbXBsYXRlclBsdWdpbiBmcm9tIFwiLi9tYWluXCI7XG5pbXBvcnQgeyBVc2VyVGVtcGxhdGVQYXJzZXIgfSBmcm9tIFwiLi9Vc2VyVGVtcGxhdGVzL1VzZXJUZW1wbGF0ZVBhcnNlclwiO1xuaW1wb3J0IHsgVFBhcnNlciB9IGZyb20gXCJUUGFyc2VyXCI7XG5pbXBvcnQgeyBDdXJzb3JKdW1wZXIgfSBmcm9tIFwiQ3Vyc29ySnVtcGVyXCI7XG5cbmV4cG9ydCBlbnVtIENvbnRleHRNb2RlIHtcbiAgICBJTlRFUk5BTCxcbiAgICBVU0VSX0lOVEVSTkFMLFxuICAgIERZTkFNSUMsXG59O1xuXG5leHBvcnQgY2xhc3MgVGVtcGxhdGVQYXJzZXIgZXh0ZW5kcyBUUGFyc2VyIHtcbiAgICBwdWJsaWMgaW50ZXJuYWxUZW1wbGF0ZVBhcnNlcjogSW50ZXJuYWxUZW1wbGF0ZVBhcnNlcjtcblx0cHVibGljIHVzZXJUZW1wbGF0ZVBhcnNlcjogVXNlclRlbXBsYXRlUGFyc2VyID0gbnVsbDtcbiAgICBwcml2YXRlIGN1cnJlbnRfY29udGV4dDogYW55O1xuICAgIHB1YmxpYyBjdXJzb3JfanVtcGVyOiBDdXJzb3JKdW1wZXI7XG4gICAgXG4gICAgY29uc3RydWN0b3IoYXBwOiBBcHAsIHByaXZhdGUgcGx1Z2luOiBUZW1wbGF0ZXJQbHVnaW4pIHtcbiAgICAgICAgc3VwZXIoYXBwKTtcbiAgICAgICAgdGhpcy5jdXJzb3JfanVtcGVyID0gbmV3IEN1cnNvckp1bXBlcih0aGlzLmFwcCk7XG4gICAgICAgIHRoaXMuaW50ZXJuYWxUZW1wbGF0ZVBhcnNlciA9IG5ldyBJbnRlcm5hbFRlbXBsYXRlUGFyc2VyKHRoaXMuYXBwLCB0aGlzLnBsdWdpbik7XG4gICAgICAgIHRoaXMudXNlclRlbXBsYXRlUGFyc2VyID0gbmV3IFVzZXJUZW1wbGF0ZVBhcnNlcih0aGlzLmFwcCwgdGhpcy5wbHVnaW4pO1xuICAgIH1cblxuICAgIGFzeW5jIHNldEN1cnJlbnRDb250ZXh0KGZpbGU6IFRGaWxlLCBjb250ZXh0X21vZGU6IENvbnRleHRNb2RlKSB7XG4gICAgICAgIHRoaXMuY3VycmVudF9jb250ZXh0ID0gYXdhaXQgdGhpcy5nZW5lcmF0ZUNvbnRleHQoZmlsZSwgY29udGV4dF9tb2RlKTtcbiAgICB9XG5cbiAgICBhZGRpdGlvbmFsQ29udGV4dCgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG9ic2lkaWFuOiBvYnNpZGlhbixcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBhc3luYyBnZW5lcmF0ZUNvbnRleHQoZmlsZTogVEZpbGUsIGNvbnRleHRfbW9kZTogQ29udGV4dE1vZGUgPSBDb250ZXh0TW9kZS5VU0VSX0lOVEVSTkFMKSB7XG4gICAgICAgIGxldCBjb250ZXh0ID0ge307XG4gICAgICAgIGxldCBhZGRpdGlvbmFsX2NvbnRleHQgPSB0aGlzLmFkZGl0aW9uYWxDb250ZXh0KCk7XG4gICAgICAgIGxldCBpbnRlcm5hbF9jb250ZXh0ID0gYXdhaXQgdGhpcy5pbnRlcm5hbFRlbXBsYXRlUGFyc2VyLmdlbmVyYXRlQ29udGV4dChmaWxlKTtcbiAgICAgICAgbGV0IHVzZXJfY29udGV4dCA9IHt9O1xuXG4gICAgICAgIGlmICghdGhpcy5jdXJyZW50X2NvbnRleHQpIHtcbiAgICAgICAgICAgIC8vIElmIGEgdXNlciBzeXN0ZW0gY29tbWFuZCBpcyB1c2luZyB0cC5maWxlLmluY2x1ZGUsIHdlIG5lZWQgdGhlIGNvbnRleHQgdG8gYmUgc2V0LlxuICAgICAgICAgICAgdGhpcy5jdXJyZW50X2NvbnRleHQgPSBpbnRlcm5hbF9jb250ZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgT2JqZWN0LmFzc2lnbihjb250ZXh0LCBhZGRpdGlvbmFsX2NvbnRleHQpO1xuICAgICAgICBzd2l0Y2ggKGNvbnRleHRfbW9kZSkge1xuICAgICAgICAgICAgY2FzZSBDb250ZXh0TW9kZS5JTlRFUk5BTDpcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKGNvbnRleHQsIGludGVybmFsX2NvbnRleHQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBDb250ZXh0TW9kZS5EWU5BTUlDOlxuICAgICAgICAgICAgICAgIHVzZXJfY29udGV4dCA9IGF3YWl0IHRoaXMudXNlclRlbXBsYXRlUGFyc2VyLmdlbmVyYXRlQ29udGV4dChmaWxlKTtcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKGNvbnRleHQsIHtcbiAgICAgICAgICAgICAgICAgICAgZHluYW1pYzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgLi4uaW50ZXJuYWxfY29udGV4dCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzZXI6IHVzZXJfY29udGV4dCxcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBDb250ZXh0TW9kZS5VU0VSX0lOVEVSTkFMOlxuICAgICAgICAgICAgICAgIHVzZXJfY29udGV4dCA9IGF3YWl0IHRoaXMudXNlclRlbXBsYXRlUGFyc2VyLmdlbmVyYXRlQ29udGV4dChmaWxlKTtcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKGNvbnRleHQsIHtcbiAgICAgICAgICAgICAgICAgICAgLi4uaW50ZXJuYWxfY29udGV4dCxcbiAgICAgICAgICAgICAgICAgICAgdXNlcjogdXNlcl9jb250ZXh0LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNvbnRleHQ7XG4gICAgfVxuXG4gICAgYXN5bmMgcGFyc2VUZW1wbGF0ZXMoY29udGVudDogc3RyaW5nLCBjb250ZXh0PzogYW55LCB0aHJvd19vbl9lcnJvcjogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgICAgIGlmICghY29udGV4dCkge1xuICAgICAgICAgICAgY29udGV4dCA9IHRoaXMuY3VycmVudF9jb250ZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnRlbnQgPSBhd2FpdCBFdGEucmVuZGVyQXN5bmMoY29udGVudCwgY29udGV4dCwge1xuICAgICAgICAgICAgICAgIHZhck5hbWU6IFwidHBcIixcbiAgICAgICAgICAgICAgICBwYXJzZToge1xuICAgICAgICAgICAgICAgICAgICBleGVjOiBcIipcIixcbiAgICAgICAgICAgICAgICAgICAgaW50ZXJwb2xhdGU6IFwiflwiLFxuICAgICAgICAgICAgICAgICAgICByYXc6IFwiXCIsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBhdXRvVHJpbTogZmFsc2UsXG4gICAgICAgICAgICAgICAgZ2xvYmFsQXdhaXQ6IHRydWUsXG4gICAgICAgICAgICB9KSBhcyBzdHJpbmc7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLmxvZ19lcnJvcihcIlRlbXBsYXRlIHBhcnNpbmcgZXJyb3IsIGFib3J0aW5nLlwiLCBlcnJvcik7XG4gICAgICAgICAgICBpZiAodGhyb3dfb25fZXJyb3IpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH1cblxuICAgIHJlcGxhY2VfaW5fYWN0aXZlX2ZpbGUoKTogdm9pZCB7XG5cdFx0dHJ5IHtcblx0XHRcdGxldCBhY3RpdmVfdmlldyA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG5cdFx0XHRpZiAoYWN0aXZlX3ZpZXcgPT09IG51bGwpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiQWN0aXZlIHZpZXcgaXMgbnVsbFwiKTtcblx0XHRcdH1cblx0XHRcdHRoaXMucmVwbGFjZV90ZW1wbGF0ZXNfYW5kX292ZXJ3cml0ZV9pbl9maWxlKGFjdGl2ZV92aWV3LmZpbGUpO1xuXHRcdH1cblx0XHRjYXRjaChlcnJvcikge1xuXHRcdFx0dGhpcy5wbHVnaW4ubG9nX2Vycm9yKGVycm9yKTtcblx0XHR9XG5cdH1cblxuICAgIGFzeW5jIGNyZWF0ZV9uZXdfbm90ZV9mcm9tX3RlbXBsYXRlKHRlbXBsYXRlX2ZpbGU6IFRGaWxlLCBmb2xkZXI/OiBURm9sZGVyKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgdGVtcGxhdGVfY29udGVudCA9IGF3YWl0IHRoaXMuYXBwLnZhdWx0LnJlYWQodGVtcGxhdGVfZmlsZSk7XG5cbiAgICAgICAgICAgIGlmICghZm9sZGVyKSB7XG4gICAgICAgICAgICAgICAgZm9sZGVyID0gdGhpcy5hcHAuZmlsZU1hbmFnZXIuZ2V0TmV3RmlsZVBhcmVudChcIlwiKTtcbiAgICAgICAgICAgICAgICAvL2ZvbGRlciA9IHRoaXMuYXBwLnZhdWx0LmdldENvbmZpZyhcIm5ld0ZpbGVGb2xkZXJQYXRoXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBUT0RPOiBDaGFuZ2UgdGhhdCwgbm90IHN0YWJsZSBhdG1cbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIGxldCBjcmVhdGVkX25vdGUgPSBhd2FpdCB0aGlzLmFwcC5maWxlTWFuYWdlci5jcmVhdGVOZXdNYXJrZG93bkZpbGUoZm9sZGVyLCBcIlVudGl0bGVkXCIpO1xuXG4gICAgICAgICAgICBhd2FpdCB0aGlzLnNldEN1cnJlbnRDb250ZXh0KGNyZWF0ZWRfbm90ZSwgQ29udGV4dE1vZGUuVVNFUl9JTlRFUk5BTCk7XG5cbiAgICAgICAgICAgIGxldCBjb250ZW50O1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb250ZW50ID0gYXdhaXQgdGhpcy5wbHVnaW4ucGFyc2VyLnBhcnNlVGVtcGxhdGVzKHRlbXBsYXRlX2NvbnRlbnQsIHVuZGVmaW5lZCwgdHJ1ZSk7XG4gICAgICAgICAgICB9IGNhdGNoKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5hcHAudmF1bHQuZGVsZXRlKGNyZWF0ZWRfbm90ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhd2FpdCB0aGlzLmFwcC52YXVsdC5tb2RpZnkoY3JlYXRlZF9ub3RlLCBjb250ZW50KTtcblxuICAgICAgICAgICAgbGV0IGFjdGl2ZV9sZWFmID0gdGhpcy5hcHAud29ya3NwYWNlLmFjdGl2ZUxlYWY7XG4gICAgICAgICAgICBpZiAoIWFjdGl2ZV9sZWFmKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gYWN0aXZlIGxlYWZcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhd2FpdCBhY3RpdmVfbGVhZi5vcGVuRmlsZShjcmVhdGVkX25vdGUsIHtzdGF0ZToge21vZGU6ICdzb3VyY2UnfSwgZVN0YXRlOiB7cmVuYW1lOiAnYWxsJ319KTtcblxuICAgICAgICAgICAgYXdhaXQgdGhpcy5jdXJzb3JfanVtcGVyLmp1bXBfdG9fbmV4dF9jdXJzb3JfbG9jYXRpb24oKTtcbiAgICAgICAgfVxuXHRcdGNhdGNoKGVycm9yKSB7XG5cdFx0XHR0aGlzLnBsdWdpbi5sb2dfZXJyb3IoZXJyb3IpO1xuXHRcdH1cbiAgICB9XG5cbiAgICBhc3luYyByZXBsYWNlX3RlbXBsYXRlc19hbmRfYXBwZW5kKHRlbXBsYXRlX2ZpbGU6IFRGaWxlKSB7XG4gICAgICAgIGxldCBhY3RpdmVfdmlldyA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG4gICAgICAgIGlmIChhY3RpdmVfdmlldyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gYWN0aXZlIHZpZXcsIGNhbid0IGFwcGVuZCB0ZW1wbGF0ZXMuXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGVkaXRvciA9IGFjdGl2ZV92aWV3LmVkaXRvcjtcbiAgICAgICAgbGV0IGRvYyA9IGVkaXRvci5nZXREb2MoKTtcblxuICAgICAgICBsZXQgY29udGVudCA9IGF3YWl0IHRoaXMuYXBwLnZhdWx0LnJlYWQodGVtcGxhdGVfZmlsZSk7XG5cbiAgICAgICAgYXdhaXQgdGhpcy5zZXRDdXJyZW50Q29udGV4dChhY3RpdmVfdmlldy5maWxlLCBDb250ZXh0TW9kZS5VU0VSX0lOVEVSTkFMKTtcbiAgICAgICAgY29udGVudCA9IGF3YWl0IHRoaXMucGFyc2VUZW1wbGF0ZXMoY29udGVudCk7XG4gICAgICAgIFxuICAgICAgICBkb2MucmVwbGFjZVNlbGVjdGlvbihjb250ZW50KTtcblxuICAgICAgICBhd2FpdCB0aGlzLmN1cnNvcl9qdW1wZXIuanVtcF90b19uZXh0X2N1cnNvcl9sb2NhdGlvbigpO1xuICAgICAgICBlZGl0b3IuZm9jdXMoKTtcbiAgICB9XG5cbiAgICBhc3luYyByZXBsYWNlX3RlbXBsYXRlc19hbmRfb3ZlcndyaXRlX2luX2ZpbGUoZmlsZTogVEZpbGUpIHtcbiAgICAgICAgbGV0IGNvbnRlbnQgPSBhd2FpdCB0aGlzLmFwcC52YXVsdC5yZWFkKGZpbGUpO1xuXG4gICAgICAgIGF3YWl0IHRoaXMuc2V0Q3VycmVudENvbnRleHQoZmlsZSwgQ29udGV4dE1vZGUuVVNFUl9JTlRFUk5BTCk7XG4gICAgICAgIGxldCBuZXdfY29udGVudCA9IGF3YWl0IHRoaXMucGFyc2VUZW1wbGF0ZXMoY29udGVudCk7XG5cbiAgICAgICAgaWYgKG5ld19jb250ZW50ICE9PSBjb250ZW50KSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmFwcC52YXVsdC5tb2RpZnkoZmlsZSwgbmV3X2NvbnRlbnQpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAodGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKSA9PT0gZmlsZSkge1xuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuY3Vyc29yX2p1bXBlci5qdW1wX3RvX25leHRfY3Vyc29yX2xvY2F0aW9uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IHsgYWRkSWNvbiwgRXZlbnRSZWYsIE1hcmtkb3duUG9zdFByb2Nlc3NvckNvbnRleHQsIE1lbnUsIE1lbnVJdGVtLCBOb3RpY2UsIFBsdWdpbiwgVEFic3RyYWN0RmlsZSwgVEZpbGUsIFRGb2xkZXIgfSBmcm9tICdvYnNpZGlhbic7XHJcblxyXG5pbXBvcnQgeyBERUZBVUxUX1NFVFRJTkdTLCBUZW1wbGF0ZXJTZXR0aW5ncywgVGVtcGxhdGVyU2V0dGluZ1RhYiB9IGZyb20gJ1NldHRpbmdzJztcclxuaW1wb3J0IHsgVGVtcGxhdGVyRnV6enlTdWdnZXN0TW9kYWwgfSBmcm9tICdUZW1wbGF0ZXJGdXp6eVN1Z2dlc3QnO1xyXG5pbXBvcnQgeyBDb250ZXh0TW9kZSwgVGVtcGxhdGVQYXJzZXIgfSBmcm9tICdUZW1wbGF0ZVBhcnNlcic7XHJcbmltcG9ydCB7IElDT05fREFUQSB9IGZyb20gJ0NvbnN0YW50cyc7XHJcbmltcG9ydCB7IGRlbGF5IH0gZnJvbSAnVXRpbHMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGVtcGxhdGVyUGx1Z2luIGV4dGVuZHMgUGx1Z2luIHtcclxuXHRwdWJsaWMgZnV6enlTdWdnZXN0OiBUZW1wbGF0ZXJGdXp6eVN1Z2dlc3RNb2RhbDtcclxuXHRwdWJsaWMgc2V0dGluZ3M6IFRlbXBsYXRlclNldHRpbmdzOyBcclxuXHRwdWJsaWMgcGFyc2VyOiBUZW1wbGF0ZVBhcnNlclxyXG5cdHByaXZhdGUgdHJpZ2dlcl9vbl9maWxlX2NyZWF0aW9uX2V2ZW50OiBFdmVudFJlZjtcclxuXHJcblx0YXN5bmMgb25sb2FkKCkge1xyXG5cdFx0YXdhaXQgdGhpcy5sb2FkU2V0dGluZ3MoKTtcclxuXHJcblx0XHR0aGlzLmZ1enp5U3VnZ2VzdCA9IG5ldyBUZW1wbGF0ZXJGdXp6eVN1Z2dlc3RNb2RhbCh0aGlzLmFwcCwgdGhpcyk7XHJcblx0XHR0aGlzLnBhcnNlciA9IG5ldyBUZW1wbGF0ZVBhcnNlcih0aGlzLmFwcCwgdGhpcyk7XHJcblxyXG5cdFx0dGhpcy5yZWdpc3Rlck1hcmtkb3duUG9zdFByb2Nlc3NvcigoZWwsIGN0eCkgPT4gdGhpcy5keW5hbWljX3RlbXBsYXRlc19wcm9jZXNzb3IoZWwsIGN0eCkpO1xyXG5cclxuXHRcdGFkZEljb24oXCJ0ZW1wbGF0ZXItaWNvblwiLCBJQ09OX0RBVEEpO1xyXG5cdFx0dGhpcy5hZGRSaWJib25JY29uKCd0ZW1wbGF0ZXItaWNvbicsICdUZW1wbGF0ZXInLCBhc3luYyAoKSA9PiB7XHJcblx0XHRcdHRoaXMuZnV6enlTdWdnZXN0Lmluc2VydF90ZW1wbGF0ZSgpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0dGhpcy5hZGRDb21tYW5kKHtcclxuXHRcdFx0aWQ6IFwiaW5zZXJ0LXRlbXBsYXRlclwiLFxyXG5cdFx0XHRuYW1lOiBcIkluc2VydCBUZW1wbGF0ZVwiLFxyXG5cdFx0XHRob3RrZXlzOiBbXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0bW9kaWZpZXJzOiBbXCJBbHRcIl0sXHJcblx0XHRcdFx0XHRrZXk6ICdlJyxcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRdLFxyXG5cdFx0XHRjYWxsYmFjazogKCkgPT4ge1xyXG5cdFx0XHRcdHRoaXMuZnV6enlTdWdnZXN0Lmluc2VydF90ZW1wbGF0ZSgpO1xyXG5cdFx0XHR9LFxyXG5cdFx0fSk7XHJcblxyXG5cdFx0dGhpcy5hZGRDb21tYW5kKHtcclxuICAgICAgICAgICAgaWQ6IFwicmVwbGFjZS1pbi1maWxlLXRlbXBsYXRlclwiLFxyXG4gICAgICAgICAgICBuYW1lOiBcIlJlcGxhY2UgdGVtcGxhdGVzIGluIHRoZSBhY3RpdmUgZmlsZVwiLFxyXG4gICAgICAgICAgICBob3RrZXlzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbW9kaWZpZXJzOiBbXCJBbHRcIl0sXHJcbiAgICAgICAgICAgICAgICAgICAga2V5OiAncicsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xyXG5cdFx0XHRcdHRoaXMucGFyc2VyLnJlcGxhY2VfaW5fYWN0aXZlX2ZpbGUoKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuXHJcblx0XHR0aGlzLmFkZENvbW1hbmQoe1xyXG5cdFx0XHRpZDogXCJqdW1wLXRvLW5leHQtY3Vyc29yLWxvY2F0aW9uXCIsXHJcblx0XHRcdG5hbWU6IFwiSnVtcCB0byBuZXh0IGN1cnNvciBsb2NhdGlvblwiLFxyXG5cdFx0XHRob3RrZXlzOiBbXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0bW9kaWZpZXJzOiBbXCJBbHRcIl0sXHJcblx0XHRcdFx0XHRrZXk6IFwiVGFiXCIsXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XSxcclxuXHRcdFx0Y2FsbGJhY2s6ICgpID0+IHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0dGhpcy5wYXJzZXIuY3Vyc29yX2p1bXBlci5qdW1wX3RvX25leHRfY3Vyc29yX2xvY2F0aW9uKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNhdGNoKGVycm9yKSB7XHJcblx0XHRcdFx0XHR0aGlzLmxvZ19lcnJvcihlcnJvcik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHR0aGlzLmFkZENvbW1hbmQoe1xyXG5cdFx0XHRpZDogXCJjcmVhdGUtbmV3LW5vdGUtZnJvbS10ZW1wbGF0ZVwiLFxyXG5cdFx0XHRuYW1lOiBcIkNyZWF0ZSBuZXcgbm90ZSBmcm9tIHRlbXBsYXRlXCIsXHJcblx0XHRcdGhvdGtleXM6IFtcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRtb2RpZmllcnM6IFtcIkFsdFwiXSxcclxuXHRcdFx0XHRcdGtleTogXCJuXCIsXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XSxcclxuXHRcdFx0Y2FsbGJhY2s6ICgpID0+IHtcclxuXHRcdFx0XHR0aGlzLmZ1enp5U3VnZ2VzdC5jcmVhdGVfbmV3X25vdGVfZnJvbV90ZW1wbGF0ZSgpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHR0aGlzLmFwcC53b3Jrc3BhY2Uub25MYXlvdXRSZWFkeSgoKSA9PiB7XHJcblx0XHRcdHRoaXMudXBkYXRlX3RyaWdnZXJfZmlsZV9vbl9jcmVhdGlvbigpO1x0XHJcblx0XHR9KTtcclxuXHJcblx0XHR0aGlzLnJlZ2lzdGVyRXZlbnQoXHJcblx0XHRcdHRoaXMuYXBwLndvcmtzcGFjZS5vbihcImZpbGUtbWVudVwiLCAobWVudTogTWVudSwgZmlsZTogVEZpbGUpID0+IHtcclxuXHRcdFx0XHRpZiAoZmlsZSBpbnN0YW5jZW9mIFRGb2xkZXIpIHtcclxuXHRcdFx0XHRcdG1lbnUuYWRkSXRlbSgoaXRlbTogTWVudUl0ZW0pID0+IHtcclxuXHRcdFx0XHRcdFx0aXRlbS5zZXRUaXRsZShcIkNyZWF0ZSBuZXcgbm90ZSBmcm9tIHRlbXBsYXRlXCIpXHJcblx0XHRcdFx0XHRcdFx0LnNldEljb24oXCJ0ZW1wbGF0ZXItaWNvblwiKVxyXG5cdFx0XHRcdFx0XHRcdC5vbkNsaWNrKGV2dCA9PiB7XHJcblx0XHRcdFx0XHRcdFx0XHR0aGlzLmZ1enp5U3VnZ2VzdC5jcmVhdGVfbmV3X25vdGVfZnJvbV90ZW1wbGF0ZShmaWxlKTtcclxuXHRcdFx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KVxyXG5cdFx0KTtcclxuXHJcblx0XHR0aGlzLmFkZFNldHRpbmdUYWIobmV3IFRlbXBsYXRlclNldHRpbmdUYWIodGhpcy5hcHAsIHRoaXMpKTtcclxuXHR9XHJcblxyXG5cdGFzeW5jIHNhdmVTZXR0aW5ncygpIHtcclxuXHRcdGF3YWl0IHRoaXMuc2F2ZURhdGEodGhpcy5zZXR0aW5ncyk7XHJcblx0fVxyXG5cclxuXHRhc3luYyBsb2FkU2V0dGluZ3MoKSB7XHJcblx0XHR0aGlzLnNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9TRVRUSU5HUywgYXdhaXQgdGhpcy5sb2FkRGF0YSgpKTtcclxuXHR9XHRcclxuXHJcblx0dXBkYXRlX3RyaWdnZXJfZmlsZV9vbl9jcmVhdGlvbigpIHtcclxuXHRcdGlmICh0aGlzLnNldHRpbmdzLnRyaWdnZXJfb25fZmlsZV9jcmVhdGlvbikge1xyXG5cdFx0XHR0aGlzLnRyaWdnZXJfb25fZmlsZV9jcmVhdGlvbl9ldmVudCA9IHRoaXMuYXBwLnZhdWx0Lm9uKFwiY3JlYXRlXCIsIGFzeW5jIChmaWxlOiBUQWJzdHJhY3RGaWxlKSA9PiB7XHJcblx0XHRcdFx0Ly8gVE9ETzogRmluZCBhIHdheSB0byBub3QgdHJpZ2dlciB0aGlzIG9uIGZpbGVzIGNvcHlcclxuXHRcdFx0XHQvLyBUT0RPOiBmaW5kIGEgYmV0dGVyIHdheSB0byBkbyB0aGlzXHJcblx0XHRcdFx0Ly8gQ3VycmVudGx5LCBJIGhhdmUgdG8gd2FpdCBmb3IgdGhlIGRhaWx5IG5vdGUgcGx1Z2luIHRvIGFkZCB0aGUgZmlsZSBjb250ZW50IGJlZm9yZSByZXBsYWNpbmdcclxuXHRcdFx0XHQvLyBOb3QgYSBwcm9ibGVtIHdpdGggQ2FsZW5kYXIgaG93ZXZlciBzaW5jZSBpdCBjcmVhdGVzIHRoZSBmaWxlIHdpdGggdGhlIGV4aXN0aW5nIGNvbnRlbnRcclxuXHRcdFx0XHRhd2FpdCBkZWxheSgzMDApO1xyXG5cdFx0XHRcdC8vICEgVGhpcyBjb3VsZCBjb3JydXB0IGJpbmFyeSBmaWxlc1xyXG5cdFx0XHRcdGlmICghKGZpbGUgaW5zdGFuY2VvZiBURmlsZSkgfHwgZmlsZS5leHRlbnNpb24gIT09IFwibWRcIikge1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLnBhcnNlci5yZXBsYWNlX3RlbXBsYXRlc19hbmRfb3ZlcndyaXRlX2luX2ZpbGUoZmlsZSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHR0aGlzLnJlZ2lzdGVyRXZlbnQoXHJcblx0XHRcdFx0dGhpcy50cmlnZ2VyX29uX2ZpbGVfY3JlYXRpb25fZXZlbnRcclxuXHRcdFx0KTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRpZiAodGhpcy50cmlnZ2VyX29uX2ZpbGVfY3JlYXRpb25fZXZlbnQpIHtcclxuXHRcdFx0XHR0aGlzLmFwcC52YXVsdC5vZmZyZWYodGhpcy50cmlnZ2VyX29uX2ZpbGVfY3JlYXRpb25fZXZlbnQpO1xyXG5cdFx0XHRcdHRoaXMudHJpZ2dlcl9vbl9maWxlX2NyZWF0aW9uX2V2ZW50ID0gdW5kZWZpbmVkO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRsb2dfdXBkYXRlKG1zZzogc3RyaW5nKSB7XHJcblx0XHRsZXQgbm90aWNlID0gbmV3IE5vdGljZShcIlwiLCAxNTAwMCk7XHJcblx0XHQvLyBUT0RPOiBGaW5kIGJldHRlciB3YXkgZm9yIHRoaXNcclxuXHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdG5vdGljZS5ub3RpY2VFbC5pbm5lckhUTUwgPSBgPGI+VGVtcGxhdGVyIHVwZGF0ZTwvYj46PGJyLz4ke21zZ31gO1xyXG5cdH1cclxuXHJcblx0bG9nX2Vycm9yKG1zZzogc3RyaW5nLCBlcnJvcj86IHN0cmluZykge1xyXG5cdFx0bGV0IG5vdGljZSA9IG5ldyBOb3RpY2UoXCJcIiwgODAwMCk7XHJcblx0XHRpZiAoZXJyb3IpIHtcclxuXHRcdFx0Ly8gVE9ETzogRmluZCBhIGJldHRlciB3YXkgZm9yIHRoaXNcclxuXHRcdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0XHRub3RpY2Uubm90aWNlRWwuaW5uZXJIVE1MID0gYDxiPlRlbXBsYXRlciBFcnJvcjwvYj46PGJyLz4ke21zZ308YnIvPkNoZWNrIGNvbnNvbGUgZm9yIG1vcmUgaW5mb3JtYXRpb25zYDtcclxuXHRcdFx0Y29uc29sZS5lcnJvcihtc2csIGVycm9yKTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHRcdG5vdGljZS5ub3RpY2VFbC5pbm5lckhUTUwgPSBgPGI+VGVtcGxhdGVyIEVycm9yPC9iPjo8YnIvPiR7bXNnfWA7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRhc3luYyBkeW5hbWljX3RlbXBsYXRlc19wcm9jZXNzb3IoZWw6IEhUTUxFbGVtZW50LCBjdHg6IE1hcmtkb3duUG9zdFByb2Nlc3NvckNvbnRleHQpIHtcclxuXHRcdGxldCBjb250ZW50ID0gZWwuaW5uZXJUZXh0LnRyaW0oKTtcclxuXHRcdGlmIChjb250ZW50LmNvbnRhaW5zKFwidHAuZHluYW1pY1wiKSkge1xyXG5cdFx0XHRsZXQgZmlsZSA9IHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Rmlyc3RMaW5rcGF0aERlc3QoXCJcIiwgY3R4LnNvdXJjZVBhdGgpO1xyXG5cdFx0XHRpZiAoIWZpbGUgfHwgIShmaWxlIGluc3RhbmNlb2YgVEZpbGUpKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGF3YWl0IHRoaXMucGFyc2VyLnNldEN1cnJlbnRDb250ZXh0KGZpbGUsIENvbnRleHRNb2RlLkRZTkFNSUMpO1xyXG5cdFx0XHRsZXQgbmV3X2NvbnRlbnQgPSBhd2FpdCB0aGlzLnBhcnNlci5wYXJzZVRlbXBsYXRlcyhjb250ZW50KTtcclxuXHRcdFx0ZWwuaW5uZXJUZXh0ID0gbmV3X2NvbnRlbnQ7XHJcblx0XHR9XHJcblx0fVxyXG59OyJdLCJuYW1lcyI6WyJQbHVnaW5TZXR0aW5nVGFiIiwiU2V0dGluZyIsImVzY2FwZVJlZ0V4cCIsIm5vcm1hbGl6ZVBhdGgiLCJURm9sZGVyIiwiVmF1bHQiLCJURmlsZSIsIkZ1enp5U3VnZ2VzdE1vZGFsIiwicGF0aCIsImV4aXN0c1N5bmMiLCJyZWFkRmlsZVN5bmMiLCJwYXJzZUxpbmt0ZXh0IiwicmVzb2x2ZVN1YnBhdGgiLCJGaWxlU3lzdGVtQWRhcHRlciIsIk1hcmtkb3duVmlldyIsImdldEFsbFRhZ3MiLCJNb2RhbCIsInByb21pc2lmeSIsImV4ZWMiLCJvYnNpZGlhbiIsIkV0YS5yZW5kZXJBc3luYyIsIlBsdWdpbiIsImFkZEljb24iLCJOb3RpY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBdURBO0FBQ08sU0FBUyxTQUFTLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFO0FBQzdELElBQUksU0FBUyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsT0FBTyxLQUFLLFlBQVksQ0FBQyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxVQUFVLE9BQU8sRUFBRSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFO0FBQ2hILElBQUksT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsT0FBTyxDQUFDLEVBQUUsVUFBVSxPQUFPLEVBQUUsTUFBTSxFQUFFO0FBQy9ELFFBQVEsU0FBUyxTQUFTLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtBQUNuRyxRQUFRLFNBQVMsUUFBUSxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtBQUN0RyxRQUFRLFNBQVMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLE1BQU0sQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFBRTtBQUN0SCxRQUFRLElBQUksQ0FBQyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxVQUFVLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUM5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
