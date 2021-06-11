import { SpeechOptions } from '../SpeechOptions';
import { SsmlFormatterBase } from './SsmlFormatterBase';
export declare class GoogleAssistantSsmlFormatter extends SsmlFormatterBase {
    options: SpeechOptions;
    constructor(options: SpeechOptions);
    private getTextModifierObject;
    protected formatFromAst(ast: any, lines?: string[]): string[];
}
