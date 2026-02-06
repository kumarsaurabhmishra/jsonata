export type TransformerEngine = {
    evaluate: (expression: string, input: any) => Promise<any>;
    version: string;
};

export interface IEngineAdapter {
    getEngine(version: string): Promise<TransformerEngine>;
    getSupportedVersions(): string[];
}
