import { useState, useCallback, useEffect, useRef } from 'react';
import { engineAdapter } from '../engines/EngineAdapter';
import { safeJsonParse, formatOutput, debounce } from '../utils/jsonUtils';

export type Status = 'Ready' | 'Running...' | 'Error' | 'Success';

export const useTransformer = (
    initialJson: string,
    initialExpression: string,
    initialVersion: string
) => {
    console.log('useTransformer: Hook initializing with version:', initialVersion);
    const [jsonInput, setJsonInput] = useState(initialJson);
    const [expression, setExpression] = useState(initialExpression);
    const [version, setVersion] = useState(initialVersion);
    const [output, setOutput] = useState('');
    const [status, setStatus] = useState<Status>('Ready');
    const [error, setError] = useState<{ json?: string; expression?: string; fatal?: string }>({});

    const evaluate = useCallback(async (currentJson: string, currentExpr: string, currentVer: string) => {
        setStatus('Running...');
        setError({});

        try {
            // Validate JSON
            let parsedJson;
            try {
                parsedJson = safeJsonParse(currentJson);
            } catch (e) {
                setError(prev => ({ ...prev, json: (e as Error).message }));
                setStatus('Error');
                return;
            }

            if (!currentExpr.trim()) {
                setError(prev => ({ ...prev, expression: 'Expression / Spec is required' }));
                setStatus('Error');
                return;
            }

            const engine = await engineAdapter.getEngine(currentVer);
            const result = await engine.evaluate(currentExpr, parsedJson);

            setOutput(formatOutput(result));
            setStatus('Success');
        } catch (e) {
            console.error('Evaluation error:', e);
            setError(prev => ({ ...prev, expression: (e as Error).message }));
            setStatus('Error');
        }
    }, []);

    const debouncedEvaluate = useRef(
        debounce((j: string, e: string, v: string) => evaluate(j, e, v), 500)
    ).current;

    // Always auto-run
    useEffect(() => {
        debouncedEvaluate(jsonInput, expression, version);
    }, [jsonInput, expression, version, debouncedEvaluate]);

    const runManual = () => evaluate(jsonInput, expression, version);

    return {
        jsonInput,
        setJsonInput,
        expression,
        setExpression,
        version,
        setVersion,
        output,
        status,
        error,
        runManual,
        availableVersions: engineAdapter.getSupportedVersions(),
    };
};
