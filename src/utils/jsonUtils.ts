export const safeJsonParse = (json: string): any => {
    if (!json.trim()) return null;
    try {
        return JSON.parse(json);
    } catch (e) {
        throw new Error(`Invalid JSON: ${(e as Error).message}`);
    }
};

export const formatOutput = (data: any): string => {
    if (data === undefined) return 'undefined';
    if (data === null) return 'null';

    if (typeof data === 'object') {
        try {
            return JSON.stringify(data, null, 2);
        } catch (e) {
            return String(data);
        }
    }

    if (typeof data === 'function') {
        return '[Function]';
    }

    return String(data);
};

export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
): ((...args: Parameters<T>) => void) => {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    return (...args: Parameters<T>) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};
