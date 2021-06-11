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
var AmazonAlexaSsmlFormatter = /** @class */ (function (_super) {
    __extends(AmazonAlexaSsmlFormatter, _super);
    function AmazonAlexaSsmlFormatter(options) {
        var _this = _super.call(this, options) || this;
        _this.options = options;
        _this.validVoices = {
            'Ivy': 'en-US',
            'Joanna': 'en-US',
            'Joey': 'en-US',
            'Justin': 'en-US',
            'Kendra': 'en-US',
            'Kimberly': 'en-US',
            'Matthew': 'en-US',
            'Salli': 'en-US',
            'Nicole': 'en-AU',
            'Russell': 'en-AU',
            'Amy': 'en-GB',
            'Brian': 'en-GB',
            'Emma': 'en-GB',
            'Aditi': 'en-IN',
            'Raveena': 'en-IN',
            'Hans': 'de-DE',
            'Marlene': 'de-DE',
            'Vicki': 'de-DE',
            'Conchita': 'es-ES',
            'Enrique': 'es-ES',
            'Carla': 'it-IT',
            'Giorgio': 'it-IT',
            'Mizuki': 'ja-JP',
            'Takumi': 'ja-JP',
            'Celine': 'fr-FR',
            'Lea': 'fr-FR',
            'Mathieu': 'fr-FR',
        };
        _this.validEmotionIntensity = [
            'low',
            'medium',
            'high',
        ];
        _this.modifierKeyToSsmlTagMappings.whisper = 'amazon:effect';
        _this.modifierKeyToSsmlTagMappings.lang = 'lang';
        _this.modifierKeyToSsmlTagMappings.voice = 'voice';
        _this.modifierKeyToSsmlTagMappings.dj = 'amazon:domain';
        _this.modifierKeyToSsmlTagMappings.newscaster = 'amazon:domain';
        _this.modifierKeyToSsmlTagMappings.excited = 'amazon:emotion';
        _this.modifierKeyToSsmlTagMappings.disappointed = 'amazon:emotion';
        return _this;
    }
    // tslint:disable-next-line: max-func-body-length
    AmazonAlexaSsmlFormatter.prototype.getTextModifierObject = function (ast) {
        var textModifierObject = {
            tags: {}
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
                        case 'emphasis': {
                            if (!textModifierObject.tags[ssmlTag]) {
                                textModifierObject.tags[ssmlTag] = { sortId: sortId, attrs: null };
                            }
                            textModifierObject.tags[ssmlTag].attrs = { level: value || 'moderate' };
                            break;
                        }
                        case 'address':
                        case 'characters':
                        case 'expletive':
                        case 'fraction':
                        case 'interjection':
                        case 'number':
                        case 'ordinal':
                        case 'telephone':
                        case 'unit': {
                            if (!textModifierObject.tags[ssmlTag]) {
                                textModifierObject.tags[ssmlTag] = { sortId: sortId, attrs: null };
                            }
                            textModifierObject.tags[ssmlTag].attrs = { 'interpret-as': key };
                            break;
                        }
                        case 'date': {
                            if (!textModifierObject.tags[ssmlTag]) {
                                textModifierObject.tags[ssmlTag] = { sortId: sortId, attrs: null };
                            }
                            textModifierObject.tags[ssmlTag].attrs = { 'interpret-as': key, format: value || 'ymd' };
                            break;
                        }
                        case 'time': {
                            if (!textModifierObject.tags[ssmlTag]) {
                                textModifierObject.tags[ssmlTag] = { sortId: sortId, attrs: null };
                            }
                            textModifierObject.tags[ssmlTag].attrs = { 'interpret-as': key, format: value || 'hms12' };
                            break;
                        }
                        case 'whisper': {
                            if (!textModifierObject.tags[ssmlTag]) {
                                textModifierObject.tags[ssmlTag] = { sortId: sortId, attrs: null };
                            }
                            textModifierObject.tags[ssmlTag].attrs = { name: 'whispered' };
                            break;
                        }
                        case 'ipa': {
                            console.log("process ipa");
                            if (!textModifierObject.tags[ssmlTag]) {
                                textModifierObject.tags[ssmlTag] = { sortId: sortId, attrs: null };
                            }
                            textModifierObject.tags[ssmlTag].attrs = { alphabet: key, ph: value };
                            break;
                        }
                        case 'ruby': {
                            console.log("process ruby");
                            if (!textModifierObject.tags[ssmlTag]) {
                                textModifierObject.tags[ssmlTag] = { sortId: sortId, attrs: null };
                            }
                            textModifierObject.tags[ssmlTag].attrs = { type: key, ph: value };
                            break;
                        }
                        case 'kana': {
                            console.log("process kana");
                            if (!textModifierObject.tags[ssmlTag]) {
                                textModifierObject.tags[ssmlTag] = { sortId: sortId, attrs: null };
                            }
                            textModifierObject.tags[ssmlTag].attrs = { alphabet: "x-amazon-pron-kana", ph: value };
                            break;
                        }
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
                        case 'lang': {
                            if (!textModifierObject.tags[ssmlTag]) {
                                textModifierObject.tags[ssmlTag] = { sortId: sortId, attrs: null };
                            }
                            textModifierObject.tags[ssmlTag].attrs = { 'xml:lang': value };
                            break;
                        }
                        case 'voice': {
                            var name = this.sentenceCase(value || 'device');
                            if (this.validVoices[name]) {
                                if (!textModifierObject.tags[ssmlTag]) {
                                    textModifierObject.tags[ssmlTag] = { sortId: sortId, attrs: null };
                                }
                                textModifierObject.tags[ssmlTag].attrs = { 'name': name };
                            }
                            break;
                        }
                        case 'excited':
                        case 'disappointed': {
                            var intensity = (value || 'medium').toLowerCase();
                            if (this.validEmotionIntensity.includes(intensity)) {
                                if (!textModifierObject.tags[ssmlTag]) {
                                    textModifierObject.tags[ssmlTag] = { sortId: sortId, attrs: null };
                                }
                                textModifierObject.tags[ssmlTag].attrs = { 'name': key, 'intensity': intensity };
                            }
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
    AmazonAlexaSsmlFormatter.prototype.getSectionObject = function (ast) {
        var sectionObject = {
            tags: {}
        };
        for (var index = 0; index < ast.children.length; index++) {
            var child = ast.children[index];
            if (child.name === 'sectionModifierKeyOptionalValue') {
                var key = child.children[0].allText;
                var value = child.children.length === 2 ? child.children[1].allText : '';
                var ssmlTag = this.modifierKeyToSsmlTagMappings[key];
                var sortId = this.ssmlTagSortOrder.indexOf(ssmlTag);
                switch (key) {
                    case 'lang': {
                        if (!sectionObject.tags[ssmlTag]) {
                            sectionObject.tags[ssmlTag] = { sortId: sortId, attrs: null };
                        }
                        sectionObject.tags[ssmlTag].attrs = { 'xml:lang': value };
                        break;
                    }
                    case 'voice': {
                        var name = this.sentenceCase(value || 'device');
                        if (this.validVoices[name]) {
                            if (!sectionObject.tags[ssmlTag]) {
                                sectionObject.tags[ssmlTag] = { sortId: sortId, attrs: null };
                            }
                            sectionObject.tags[ssmlTag].attrs = { 'name': name };
                        }
                        break;
                    }
                    case 'dj': {
                        if (!sectionObject.tags[ssmlTag]) {
                            sectionObject.tags[ssmlTag] = { sortId: sortId, attrs: null };
                        }
                        sectionObject.tags[ssmlTag].attrs = { 'name': 'music' };
                        break;
                    }
                    case 'newscaster': {
                        if (!sectionObject.tags[ssmlTag]) {
                            sectionObject.tags[ssmlTag] = { sortId: sortId, attrs: null };
                        }
                        sectionObject.tags[ssmlTag].attrs = { 'name': 'news' };
                        break;
                    }
                    case 'defaults': {
                        break;
                    }
                    case 'excited':
                    case 'disappointed': {
                        var intensity = (value || 'medium').toLowerCase();
                        if (this.validEmotionIntensity.includes(intensity)) {
                            if (!sectionObject.tags[ssmlTag]) {
                                sectionObject.tags[ssmlTag] = { sortId: sortId, attrs: null };
                            }
                            sectionObject.tags[ssmlTag].attrs = { 'name': key, 'intensity': intensity };
                        }
                        break;
                    }
                    default: {
                    }
                }
            }
        }
        return sectionObject;
    };
    // tslint:disable-next-line: max-func-body-length
    AmazonAlexaSsmlFormatter.prototype.formatFromAst = function (ast, lines) {
        if (lines === void 0) { lines = []; }
        switch (ast.name) {
            case 'document': {
                if (this.options.includeFormatterComment) {
                    this.addComment('Converted from Speech Markdown to SSML for Amazon Alexa', lines);
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
            case 'shortEmphasisModerate': {
                var text = ast.children[0].allText;
                return this.addTagWithAttrs(lines, text, 'emphasis', { level: 'moderate' });
            }
            case 'shortEmphasisStrong': {
                var text = ast.children[0].allText;
                return this.addTagWithAttrs(lines, text, 'emphasis', { level: 'strong' });
            }
            case 'shortEmphasisNone': {
                var text = ast.children[0].allText;
                return this.addTagWithAttrs(lines, text, 'emphasis', { level: 'none' });
            }
            case 'shortEmphasisReduced': {
                var text = ast.children[0].allText;
                return this.addTagWithAttrs(lines, text, 'emphasis', { level: 'reduced' });
            }
            case 'textModifier': {
                var tmo_1 = this.getTextModifierObject(ast);
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
            case 'section': {
                var so_1 = this.getSectionObject(ast);
                var tagsSortedAsc = Object.keys(so_1.tags).sort(function (a, b) { return so_1.tags[a].sortId - so_1.tags[b].sortId; });
                this.addSectionEndTag(lines);
                this.addSectionStartTag(tagsSortedAsc, so_1, lines);
                return lines;
            }
            case 'audio': {
                var url = ast.children[0].allText.replace(/&/g, '&amp;');
                return this.addTagWithAttrs(lines, null, 'audio', { src: url });
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
            case 'plainTextSpecialChars': {
                lines.push(ast.allText);
                return lines;
            }
            default: {
                this.processAst(ast.children, lines);
                return lines;
            }
        }
    };
    return AmazonAlexaSsmlFormatter;
}(SsmlFormatterBase_1.SsmlFormatterBase));
exports.AmazonAlexaSsmlFormatter = AmazonAlexaSsmlFormatter;
//# sourceMappingURL=AmazonAlexaSsmlFormatter.js.map