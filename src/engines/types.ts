export type JSONataEngine = {
    evaluate: (expression: string, input: any) => Promise<any>;
    version: string;
};

export interface IEngineAdapter {
    getEngine(version: string): Promise<JSONataEngine>;
    getSupportedVersions(): string[];
}
