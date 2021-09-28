'use strict';
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line: max-func-body-length
function speechMarkdownGrammar(myna) {
    var m = myna;
    // Override parenthesis function to not use `.guardedSeq`
    // This sequence is too assertive, and may cause exceptions rather than just returning null
    m.parenthesized = function (rule) {
        return m.seq('(', m.ws, rule, m.ws, ')').setType('parenthesized');
    };
    // tslint:disable-next-line: typedef
    // tslint:disable-next-line: max-func-body-length
    var g = new (function () {
        //         // Allows the "inline" to be referenced before it is defined.
        //         // This enables recursive definitions.
        //         this.inlineDelayed = m.delay(() => this.inline);
        //         this.boundedInline = function(begin: any, end: any) : any {
        // // tslint:disable-next-line: no-parameter-reassignment
        //             if (end === undefined) { end = begin; }
        //             return m.seq(begin, this.inlineDelayed.unless(end).zeroOrMore, end);
        //         }
        // Plain text
        var specialCharSet = '[]()';
        var specialCharSetEmphasis = '[]()*~`@#\\_!+-';
        var ws = m.char(' \t').oneOrMore;
        var optWs = ws.opt;
        var wsOrNewLine = ws.or(m.newLine);
        var nonSpecialChar = m.notChar(specialCharSetEmphasis).unless(m.newLine);
        var nonSpecialCharEmphasis = m.notChar(specialCharSet).unless(m.newLine);
        var quoteChar = m.notChar('"');
        /*
         xsd:token - XML Schema2 section 3.3.2
         token represents tokenized strings.
         The ·value space· of token is the set of strings that do not contain the
         carriage return (#xD), line feed (#xA) nor tab (#x9) characters, that have
         no leading or trailing spaces (#x20) and that have no internal sequences
         of two or more spaces. The ·lexical space· of token is the set of strings
         that do not contain the carriage return (#xD), line feed (#xA) nor
         tab (#x9) characters, that have no leading or trailing spaces (#x20) and
         that have no internal sequences of two or more spaces.
    
         This implementation plays very loose with the definition.
         */
        this.xsdToken = m.choice(m.digits, m.letters, m.char(specialCharSetEmphasis)).oneOrMore.ast;
        this.plainText = m.choice(m.digits, m.letters, ws, nonSpecialChar).oneOrMore.ast;
        this.plainTextEmphasis = m.choice(m.digits, m.letters, ws, nonSpecialChar).oneOrMore.ast;
        var plainTextChoice = m.choice(m.digits, m.letters, ws, nonSpecialCharEmphasis);
        this.plainTextModifier = plainTextChoice.oneOrMore.ast;
        this.plainTextPhone = m.seq(m.parenthesized(m.digits), plainTextChoice.oneOrMore).ast;
        this.plainTextSpecialChars = m.choice(m.seq('(', plainTextChoice, ') '), m.seq('[', plainTextChoice, '] '), m.choice.apply(m, specialCharSetEmphasis.split('')).oneOrMore).oneOrMore.ast;
        // Break
        this.timeUnit = m.choice('s', 'ms').ast;
        this.fraction = m.seq('.', m.digit.zeroOrMore);
        this.number = m.seq(m.integer, this.fraction.opt).ast;
        this.time = m.seq(this.number, this.timeUnit).ast;
        this.shortBreak = m.seq('[', this.time, ']').ast;
        // this.break = m.seq('[break:', this.time , ']').ast;
        // this.string = m.doubleQuoted(this.quoteChar.zeroOrMore).ast;
        // this.string = m.choice(m.doubleQuotedString(), m.singleQuotedString()).ast;
        // Emphasis
        // The emphasis tag should be preluded and followed by a not-letter-character.
        // Otherwise an example like above would be captured.
        var notLetterChar = m.not(m.letters);
        this.shortEmphasisModerate = m.seq(notLetterChar, '+', this.plainTextEmphasis, '+', notLetterChar).ast;
        this.shortEmphasisStrong = m.seq(notLetterChar, '++', this.plainTextEmphasis, '++', notLetterChar).ast;
        this.shortEmphasisNone = m.seq(notLetterChar, '~', this.plainTextEmphasis, '~', notLetterChar).ast;
        this.shortEmphasisReduced = m.seq(notLetterChar, '-', this.plainTextEmphasis, '-', notLetterChar).ast;
        this.emphasis = m.choice(this.shortEmphasisModerate, this.shortEmphasisStrong, this.shortEmphasisNone, this.shortEmphasisReduced);
        // Modifier
        // (text)[key] or (text)[key;]
        // (text)[key:'value'] or (text)[key:'value';]
        // (text)[key: "value"] or (text)[key: "value";]
        // (text)[key:'value';key;key:"value"]
        var colon = m.char(':').ws;
        var semicolon = m.char(';').ws;
        this.textModifierKey = m.keywords('emphasis', 'address', 'number', 'characters', 'chars', 'expletive', 'bleep', 'fraction', 'interjection', 'ordinal', 'telephone', 'phone', 'unit', 'time', 'date', 'whisper', 'ipa', 'sub', 'vol', 'volume', 'rate', 'pitch', 'lang', 'voice', 'excited', 'disappointed', 'ruby', 'kana').ast;
        // Special characters for <phoneme alphabet="ipa" ph="..."> tag
        // const ipaChars = ['.', "'", 'æ', '͡ʒ', 'ð', 'ʃ', '͡ʃ', 'θ', 'ʒ', 'ə', 'ɚ', 'aɪ', 'aʊ', 'ɑ',
        //  'eɪ', 'ɝ', 'ɛ', 'ɪ', 'oʊ', 'ɔ', 'ɔɪ', 'ʊ', 'ʌ', 'ɒ', 'ɛə', 'ɪə', 'ʊə', 'ˈ', 'ˌ', 'ŋ', 'ɹ'];
        var ipaChars = [
            '.',
            'æ',
            '͡ʒ',
            'ð',
            'ʃ',
            '͡ʃ',
            'θ',
            'ʒ',
            'ə',
            'ɚ',
            'aɪ',
            'aʊ',
            'ɑ',
            'eɪ',
            'ɝ',
            'ɛ',
            'ɪ',
            'oʊ',
            'ɔ',
            'ɔɪ',
            'ʊ',
            'ʌ',
            'ɒ',
            'ɛə',
            'ɪə',
            'ʊə',
            'ˈ',
            'ˌ',
            'ŋ',
            'ɹ',
        ];
        var hiragana = ['ぁ', 'あ', 'ぃ', 'い', 'ぅ', 'う', 'ぇ', 'え', 'ぉ', 'お', 'か', 'が', 'き', 'ぎ', 'く', 'ぐ',
            'け', 'げ', 'こ', 'ご', 'さ', 'ざ', 'し', 'じ', 'す', 'ず', 'せ', 'ぜ', 'そ', 'ぞ', 'た', 'だ',
            'ち', 'ぢ', 'っ', 'つ', 'づ', 'て', 'で', 'と', 'ど', 'な', 'に', 'ぬ', 'ね', 'の', 'は',
            'ば', 'ぱ', 'ひ', 'び', 'ぴ', 'ふ', 'ぶ', 'ぷ', 'へ', 'べ', 'ぺ', 'ほ', 'ぼ', 'ぽ', 'ま', 'み',
            'む', 'め', 'も', 'ゃ', 'や', 'ゅ', 'ゆ', 'ょ', 'よ', 'ら', 'り', 'る', 'れ', 'ろ', 'ゎ', 'わ',
            'ゐ', 'ゑ', 'を', 'ん', 'ゔ', 'ゕ', 'ゖ'];
        var katakana = ['ァ', 'ア', 'ィ', 'イ', 'ゥ', 'ウ', 'ェ', 'エ', 'ォ', 'オ', 'カ', 'ガ', 'キ', 'ギ', 'ク',
            'グ', 'ケ', 'ゲ', 'コ', 'ゴ', 'サ', 'ザ', 'シ', 'ジ', 'ス', 'ズ', 'セ', 'ゼ', 'ソ', 'ゾ', 'タ',
            'ダ', 'チ', 'ヂ', 'ッ', 'ツ', 'ヅ', 'テ', 'デ', 'ト', 'ド', 'ナ', 'ニ', 'ヌ', 'ネ', 'ノ', 'ハ',
            'バ', 'パ', 'ヒ', 'ビ', 'ピ', 'フ', 'ブ', 'プ', 'ヘ', 'ベ', 'ペ', 'ホ', 'ボ', 'ポ', 'マ', 'ミ',
            'ム', 'メ', 'モ', 'ャ', 'ヤ', 'ュ', 'ユ', 'ョ', 'ヨ', 'ラ', 'リ', 'ル', 'レ', 'ロ', 'ヮ', 'ワ',
            'ヰ', 'ヱ', 'ヲ', 'ン', 'ヴ', 'ヵ', 'ヶ', 'ヷ', 'ヸ', 'ヹ', 'ヺ', 'ー'];
        this.textModifierText = m.choice.apply(m, __spreadArrays([m.digit,
            m.letter,
            m.hyphen,
            m.space], ipaChars, hiragana, katakana)).oneOrMore.ast;
        this.textModifierTextDoubleQuote = m.choice.apply(m, __spreadArrays([m.digit,
            m.letter,
            m.hyphen,
            m.space], ipaChars, hiragana, katakana, ["'"])).oneOrMore.ast;
        this.textModifierValue = m.seq(colon, m.choice(m.singleQuoted(this.textModifierText), m.doubleQuoted(this.textModifierTextDoubleQuote)));
        this.textModifierKeyOptionalValue = m.seq(this.textModifierKey, this.textModifierValue.opt).ast;
        this.modifier = m.bracketed(m.delimited(this.textModifierKeyOptionalValue.ws, semicolon));
        var textText = m.parenthesized(this.plainTextModifier);
        var textTextPhone = m.parenthesized(this.plainTextPhone);
        this.textModifier = m.seq(m.choice(textText, textTextPhone), this.modifier).ast;
        // Audio
        this.urlSpecialChar = m.char(':/.-_~?#[]@!+,;%=()&');
        this.url = m.choice(m.digit, m.letter, this.urlSpecialChar).oneOrMore.ast;
        this.audio = m.seq('![', m.choice(m.singleQuoted(this.url), m.doubleQuoted(this.url)), ']').ast;
        // Section
        this.sectionModifierKey = m.keywords('lang', 'voice', 'defaults', 'dj', 'newscaster', 'excited', 'disappointed').ast;
        this.sectionModifierText = m.choice(m.digit, m.letter, m.hyphen).oneOrMore.ast;
        this.sectionModifierValue = m.seq(colon, m.choice(m.singleQuoted(this.sectionModifierText), m.doubleQuoted(this.sectionModifierText)));
        this.sectionModifierKeyOptionalValue = m.seq(this.sectionModifierKey, this.sectionModifierValue.opt).ast;
        this.sectionModifier = m.bracketed(m.delimited(this.sectionModifierKeyOptionalValue.ws, semicolon));
        this.section = m.seq('#', this.sectionModifier).ast;
        // values
        this.valueNone = 'none';
        this.valueXWeak = 'x-weak';
        this.valueWeak = 'weak';
        this.valueMedium = 'medium';
        this.valueStrong = 'strong';
        this.valueXStrong = 'x-strong';
        this.breakStrengthValue = m.keywords(this.valueNone, this.valueXWeak, this.valueWeak, this.valueMedium, this.valueStrong, this.valueXStrong).ast;
        this.breakValue = m.choice(this.breakStrengthValue, this.time).ast;
        this.break = m.seq('[', 'break', ':', m.choice(m.singleQuoted(this.breakValue), m.doubleQuoted(this.breakValue)), ']').ast;
        this.markTag = m.seq('[', 'mark', ':', m.choice(m.singleQuoted(this.xsdToken), m.doubleQuoted(this.xsdToken)), ']').ast;
        this.any = m.advance;
        this.inline = m
            .choice(this.textModifier, this.emphasis, this.shortBreak, this.break, this.audio, this.markTag, this.plainTextSpecialChars, this.plainText, this.any)
            .unless(m.newLine);
        this.lineEnd = m.newLine.or(m.assert(m.end)).ast;
        this.emptyLine = m.char(' \t').zeroOrMore.then(m.newLine).ast;
        this.restOfLine = m.seq(this.inline.zeroOrMore).then(this.lineEnd);
        this.simpleLine = m.seq(this.emptyLine.not, m.notEnd, this.restOfLine).ast;
        this.paragraph = this.simpleLine.oneOrMore.ast;
        this.content = m.choice(this.section, this.paragraph, this.emptyLine);
        this.document = this.content.zeroOrMore.ast;
    })();
    // Register the grammar, providing a name and the default parse rule
    return m.registerGrammar('speechmarkdown', g, g.document);
}
exports.speechMarkdownGrammar = speechMarkdownGrammar;
//# sourceMappingURL=SpeechMarkdownGrammar.js.map