import jsonataLatest from 'jsonata';
import jsonata210 from 'jsonata-2.1.0';
import jsonata206 from 'jsonata-2.0.6';
import jsonata205 from 'jsonata-2.0.5';
import jsonata204 from 'jsonata-2.0.4';
import jsonata203 from 'jsonata-2.0.3';
import jsonata202 from 'jsonata-2.0.2';
import jsonata201 from 'jsonata-2.0.1';
import jsonata200 from 'jsonata-2.0.0';
import jsonata187 from 'jsonata-1.8.7';
import jsonata186 from 'jsonata-1.8.6';
import type { IEngineAdapter, JSONataEngine } from './types.ts';

const enginesMap: Record<string, any> = {
    'Latest': jsonataLatest,
    'v2.1.0': jsonata210,
    'v2.0.6': jsonata206,
    'v2.0.5': jsonata205,
    'v2.0.4': jsonata204,
    'v2.0.3': jsonata203,
    'v2.0.2': jsonata202,
    'v2.0.1': jsonata201,
    'v2.0.0': jsonata200,
    'v1.8.7': jsonata187,
    'v1.8.6': jsonata186,
    'JSONata4Java (v2.6.x)': 'java-remote',
};

// Use environment variable for backend URL in production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export class EngineAdapter implements IEngineAdapter {
    private engines: Map<string, JSONataEngine> = new Map();

    async getEngine(version: string): Promise<JSONataEngine> {
        if (this.engines.has(version)) {
            return this.engines.get(version)!;
        }

        if (version === 'JSONata4Java (v2.6.x)') {
            const engine: JSONataEngine = {
                version,
                evaluate: async (expression: string, input: any) => {
                    try {
                        const response = await fetch(`${API_BASE_URL}/api/evaluate`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ expression, input }),
                        });

                        if (!response.ok) {
                            const errorData = await response.json();
                            throw new Error(errorData.message || 'Backend evaluation failed');
                        }

                        const data = await response.json();
                        if (data.status === 'error') {
                            throw new Error(data.message);
                        }
                        return data.result;
                    } catch (e) {
                        console.error('Java Backend Error:', e);
                        throw new Error(`Java Engine Error: ${(e as Error).message}`);
                    }
                }
            };
            this.engines.set(version, engine);
            return engine;
        }

        const jsonataModule = enginesMap[version] || jsonataLatest;
        // Handle CommonJS / ESM interop
        const jsonata = typeof jsonataModule === 'function' ? jsonataModule : (jsonataModule.default || jsonataModule);

        if (typeof jsonata !== 'function') {
            console.error(`Engine ${version} is not a function:`, jsonataModule);
            throw new Error(`Engine ${version} failed to load correctly`);
        }

        const engine: JSONataEngine = {
            version,
            evaluate: async (expression: string, input: any) => {
                try {
                    const expr = jsonata(expression);
                    return await expr.evaluate(input);
                } catch (e) {
                    throw new Error(`JSONata Error: ${(e as Error).message}`);
                }
            }
        };

        this.engines.set(version, engine);
        return engine;
    }

    getSupportedVersions(): string[] {
        return Object.keys(enginesMap);
    }
}

export const engineAdapter = new EngineAdapter();
