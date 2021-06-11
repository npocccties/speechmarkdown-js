"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var SsmlFormatterBase_1 = require("./SsmlFormatterBase");
var SamsungBixbySsmlFormatter = /** @class */ (function (_super) {
    __extends(SamsungBixbySsmlFormatter, _super);
    function SamsungBixbySsmlFormatter(options) {
        var _this = _super.call(this, options) || this;
        _this.options = options;
        _this.modifierKeyToSsmlTagMappings.emphasis = null;
        _this.modifierKeyToSsmlTagMappings.address = null;
        _this.modifierKeyToSsmlTagMappings.number = 'say-as';
        _this.modifierKeyToSsmlTagMappings.characters = 'say-as';
        _this.modifierKeyToSsmlTagMappings.expletive = null;
        _this.modifierKeyToSsmlTagMappings.fraction = 'say-as';
        _this.modifierKeyToSsmlTagMappings.interjection = null;
        _this.modifierKeyToSsmlTagMappings.ordinal = 'say-as';
        _this.modifierKeyToSsmlTagMappings.telephone = null;
        _this.modifierKeyToSsmlTagMappings.unit = null;
        _this.modifierKeyToSsmlTagMappings.time = null;
        _this.modifierKeyToSsmlTagMappings.date = null;
        _this.modifierKeyToSsmlTagMappings.sub = 'sub';
        _this.modifierKeyToSsmlTagMappings.ipa = null;
        _this.modifierKeyToSsmlTagMappings.rate = 'prosody';
        _this.modifierKeyToSsmlTagMappings.pitch = 'prosody';
        _this.modifierKeyToSsmlTagMappings.volume = 'prosody';
        _this.modifierKeyToSsmlTagMappings.whisper = 'prosody';
        return _this;
    }
    // tslint:disable-next-line: max-func-body-length
    SamsungBixbySsmlFormatter.prototype.getTextModifierObject = function (ast) {
        var textModifierObject = {
            tags: {},
            text: ''
        };
        for (var index = 0; index < ast.children.length; index++) {
            var child = ast.children[index];
            switch (child.name) {
                case 'plainText':
                case 'plainTextSpecialChars':
                case 'plainTextEmphasis':
                case 'plainTextPhone':
                case 'plainTextModifier': {
                    textModifierObject['text'] = child.allText;
                    break;
                }
                case 'textModifierKeyOptionalValue': {
                    var key = child.children[0].allText;
                    key = this.modifierKeyMappings[key] || key;
                    var value = child.children.length === 2 ? child.children[1].allText : '';
                    var ssmlTag = this.modifierKeyToSsmlTagMappings[key];
                    var sortId = this.ssmlTagSortOrder.indexOf(ssmlTag);
                    switch (key) {
                        // case 'emphasis': {
                        //   if (!textModifierObject.tags[ssmlTag]) {
                        //     textModifierObject.tags[ssmlTag] = { sortId: sortId, attrs: null };
                        //   }
                        //   textModifierObject.tags[ssmlTag].attrs = { level: value || 'moderate' };
                        //   break;
                        // }
                        // case 'address':
                        // case 'expletive':
                        // case 'telephone':
                        // case 'unit':
                        case 'fraction':
                        case 'ordinal':
                            {
                                if (!textModifierObject.tags[ssmlTag]) {
                                    textModifierObject.tags[ssmlTag] = { sortId: sortId, attrs: null };
                                }
                                textModifierObject.tags[ssmlTag].attrs = { 'interpret-as': key };
                                break;
                            }
                        case "number": {
                            if (!textModifierObject.tags[ssmlTag]) {
                                textModifierObject.tags[ssmlTag] = { sortId: sortId, attrs: null };
                            }
                            textModifierObject.tags[ssmlTag].attrs = { 'interpret-as': 'cardinal' };
                            break;
                        }
                        case "characters": {
                            if (!textModifierObject.tags[ssmlTag]) {
                                textModifierObject.tags[ssmlTag] = { sortId: sortId, attrs: null };
                            }
                            var attrValue = 'digits';
                            if (isNaN(textModifierObject.text)) {
                                attrValue = 'spell-out';
                            }
                            textModifierObject.tags[ssmlTag].attrs = { 'interpret-as': attrValue };
                            break;
                        }
                        // case 'date': {
                        //   if (!textModifierObject.tags[ssmlTag]) {
                        //     textModifierObject.tags[ssmlTag] = { sortId: sortId, attrs: null };
                        //   }
                        //   textModifierObject.tags[ssmlTag].attrs = { 'interpret-as': key, format: value || 'ymd' };
                        //   break;
                        // }
                        // case 'time': {
                        //   if (!textModifierObject.tags[ssmlTag]) {
                        //     textModifierObject.tags[ssmlTag] = { sortId: sortId, attrs: null };
                        //   }
                        //   textModifierObject.tags[ssmlTag].attrs = { 'interpret-as': key, format: value || 'hms12' };
                        //   break;
                        // }
                        case 'whisper': {
                            if (!textModifierObject.tags[ssmlTag]) {
                                textModifierObject.tags[ssmlTag] = { sortId: sortId, attrs: null };
                            }
                            textModifierObject.tags[ssmlTag].attrs = { volume: 'x-soft', rate: 'slow' };
                            break;
                        }
                        // case 'ipa': {
                        //   // Google Assistant does not support <phoneme> tag
                        //   if (!textModifierObject.tags[ssmlTag]) {
                        //     textModifierObject.tags[ssmlTag] = { sortId: sortId, attrs: null };
                        //   }
                        //   textModifierObject['textOnly'] = true;
                        //   break;
                        // }
                        case 'sub': {
                            if (!textModifierObject.tags[ssmlTag]) {
                                textModifierObject.tags[ssmlTag] = { sortId: sortId, attrs: null };
                            }
                            textModifierObject.tags[ssmlTag].attrs = { alias: value };
                            break;
                        }
                        case 'volume':
                        case 'rate':
                        case 'pitch': {
                            if (!textModifierObject.tags[ssmlTag]) {
                                textModifierObject.tags[ssmlTag] = { sortId: sortId, attrs: null };
                            }
                            var attrs = {};
                            attrs[key] = value || 'medium';
                            textModifierObject.tags[ssmlTag].attrs = __assign(__assign({}, textModifierObject.tags[ssmlTag].attrs), attrs);
                            break;
                        }
                        default: {
                        }
                    }
                    break;
                }
            }
        }
        return textModifierObject;
    };
    // tslint:disable-next-line: max-func-body-length
    SamsungBixbySsmlFormatter.prototype.formatFromAst = function (ast, lines) {
        if (lines === void 0) { lines = []; }
        switch (ast.name) {
            case 'document': {
                if (this.options.includeFormatterComment) {
                    this.addComment('Converted from Speech Markdown to SSML for Samsung Bixby', lines);
                }
                if (this.options.includeSpeakTag) {
                    return this.addSpeakTag(ast.children, true, false, null, lines);
                }
                else {
                    this.processAst(ast.children, lines);
                    return lines;
                }
            }
            case 'paragraph': {
                if (this.options.includeParagraphTag) {
                    return this.addTag('p', ast.children, true, false, null, lines);
                }
                else {
                    this.processAst(ast.children, lines);
                    return lines;
                }
            }
            case 'shortBreak': {
                var time = ast.children[0].allText;
                return this.addTagWithAttrs(lines, null, 'break', { time: time });
            }
            case 'break': {
                var val = ast.children[0].allText;
                var attrs = {};
                switch (ast.children[0].children[0].name) {
                    case 'breakStrengthValue':
                        attrs = { strength: val };
                        break;
                    case 'time':
                        attrs = { time: val };
                        break;
                }
                return this.addTagWithAttrs(lines, null, 'break', attrs);
            }
            case 'shortEmphasisModerate':
            case 'shortEmphasisStrong':
            case 'shortEmphasisNone':
            case 'shortEmphasisReduced':
                {
                    var text = ast.children[0].allText;
                    if (text) {
                        lines.push(text);
                    }
                    return lines;
                }
            // case 'shortEmphasisStrong': {
            //   const text = ast.children[0].allText;
            //   return this.addTagWithAttrs(lines, text, 'emphasis', { level: 'strong' });
            // }
            // case 'shortEmphasisNone': {
            //   const text = ast.children[0].allText;
            //   return this.addTagWithAttrs(lines, text, 'emphasis', { level: 'none' });
            // }
            // case 'shortEmphasisReduced': {
            //   const text = ast.children[0].allText;
            //   return this.addTagWithAttrs(lines, text, 'emphasis', { level: 'reduced' });
            // }
            // case 'textModifier': {
            //   const tmo = this.getTextModifierObject(ast);
            //   if (tmo.textOnly) {
            //     // Quick return if tag is not supported
            //     lines.push(tmo.text)
            //     return lines
            //   }
            //   const tagsSortedDesc = Object.keys(tmo.tags).sort((a: any, b: any) => { return tmo.tags[b].sortId - tmo.tags[a].sortId });
            //   let inner = tmo.text;
            //   for (let index = 0; index < tagsSortedDesc.length; index++) {
            //     const tag = tagsSortedDesc[index];
            //     const attrs = tmo.tags[tag].attrs;
            //     inner = this.getTagWithAttrs(inner, tag, attrs);
            //   }
            //   lines.push(inner);
            //   return lines;
            // }
            case 'textModifier': {
                var tmo_1 = this.getTextModifierObject(ast);
                if (tmo_1.textOnly) {
                    // Quick return if tag is not supported
                    lines.push(tmo_1.text);
                    return lines;
                }
                var tagsSortedDesc = Object.keys(tmo_1.tags).sort(function (a, b) { return tmo_1.tags[b].sortId - tmo_1.tags[a].sortId; });
                var inner = tmo_1.text;
                for (var index = 0; index < tagsSortedDesc.length; index++) {
                    var tag = tagsSortedDesc[index];
                    var attrs = tmo_1.tags[tag].attrs;
                    inner = this.getTagWithAttrs(inner, tag, attrs);
                }
                lines.push(inner);
                return lines;
            }
            case 'audio': {
                var url = ast.children[0].allText.replace(/&/g, '&amp;');
                return this.addTagWithAttrs(lines, null, 'audio', { src: url }, true);
            }
            case 'simpleLine': {
                this.processAst(ast.children, lines);
                return lines;
            }
            case 'lineEnd': {
                lines.push(ast.allText);
                return lines;
            }
            case 'emptyLine': {
                if (this.options.preserveEmptyLines) {
                    lines.push(ast.allText);
                }
                return lines;
            }
            case 'plainText':
            case 'plainTextSpecialChars':
            case 'plainTextEmphasis':
            case 'plainTextPhone':
            case 'plainTextModifier': {
                lines.push(ast.allText);
                return lines;
            }
            default: {
                this.processAst(ast.children, lines);
                return lines;
            }
        }
    };
    return SamsungBixbySsmlFormatter;
}(SsmlFormatterBase_1.SsmlFormatterBase));
exports.SamsungBixbySsmlFormatter = SamsungBixbySsmlFormatter;
//# sourceMappingURL=SamsungBixbySsmlFormatter.js.map