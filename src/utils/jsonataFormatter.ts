/**
 * A lightweight formatter for JSONata expressions.
 * Handles basic indentation for ( ), { }, and [ ].
 */
export const formatJSONata = (expr: string): string => {
    let depth = 0;
    let formatted = '';
    const indent = '  ';

    // Basic cleanup: remove existing newlines and extra spaces
    const cleaned = expr.replace(/\s+/g, ' ').trim();

    for (let i = 0; i < cleaned.length; i++) {
        const char = cleaned[i];

        if (char === '(' || char === '{' || char === '[') {
            depth++;
            formatted += char + '\n' + indent.repeat(depth);
        } else if (char === ')' || char === '}' || char === ']') {
            depth = Math.max(0, depth - 1);
            formatted += '\n' + indent.repeat(depth) + char;
        } else if (char === ',') {
            formatted += char + '\n' + indent.repeat(depth);
        } else {
            formatted += char;
        }
    }

    // Final cleanup: remove lines that are just whitespace
    return formatted
        .split('\n')
        .map(line => line.trimEnd())
        .filter((line, index, arr) => {
            // Keep line if it has content, or if it's the first empty line in a sequence
            return line.trim() !== '' || (index > 0 && arr[index - 1].trim() !== '');
        })
        .join('\n');
};
