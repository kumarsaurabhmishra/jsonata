/**
 * Traverses a JSON object to find keys available at a given semantic path.
 * Handles JSONata's "map-over-array" behavior where path.to.array.property
 * is valid even if 'property' is inside elements of 'array'.
 */
export const getSuggestionsForPath = (obj: any, path: string): string[] => {
    if (obj === null || typeof obj !== 'object') {
        return [];
    }

    // If path is empty, return root keys
    if (!path || path.trim() === '') {
        return Object.keys(obj);
    }

    const parts = path.split('.').filter(p => p.trim() !== '');

    let current = obj;
    for (const part of parts) {
        // Basic support for array indexing if the user types it (e.g., Order[0])
        const arrayMatch = part.match(/^(.+)\[(\d+)\]$/);
        const key = arrayMatch ? arrayMatch[1] : part;
        const index = arrayMatch ? parseInt(arrayMatch[2], 10) : null;

        // Handle JSONata's implicit map behavior:
        // If the 'current' is an array, we look at its first element to continue traversal
        if (Array.isArray(current)) {
            if (current.length === 0) return [];
            current = current[0]; // Use first element for schema/key discovery
        }

        if (current && typeof current === 'object' && key in current) {
            current = current[key];

            // If the user specified an explicit index, apply it immediately
            if (index !== null && Array.isArray(current)) {
                if (current.length > index) {
                    current = current[index];
                } else {
                    return []; // Index out of bounds
                }
            }
        } else {
            return []; // Path not found
        }
    }

    // Final resolution for suggestions
    if (Array.isArray(current)) {
        if (current.length > 0 && typeof current[0] === 'object') {
            return Object.keys(current[0]);
        }
        return [];
    }

    if (current && typeof current === 'object' && current !== null) {
        return Object.keys(current);
    }

    return [];
};

/**
 * Parses the current line and returns the path segments before the cursor.
 * Example: "Account.Order." -> "Account.Order"
 * Example: "Account.Ord" -> "Account" (since we want suggestions for context 'Account')
 */
export const getExpressionContext = (textBeforeCursor: string): string => {
    // Find the last "word" that looks like a path
    // Split by spaces, operators, etc. to find the current segment
    const match = textBeforeCursor.match(/([a-zA-Z0-9_.\d\[\]]+)$/);
    if (!match) return '';

    const fullPath = match[1];

    // If it ends with a dot, we want the keys of the part specifically before the dot
    if (fullPath.endsWith('.')) {
        return fullPath.slice(0, -1);
    }

    // If it doesn't end with a dot, we are likely typing a key name (e.g., Account.Ord)
    // so we want the keys of the parent (before the last dot)
    const lastDotIndex = fullPath.lastIndexOf('.');
    if (lastDotIndex === -1) {
        // If no dot at all, we are at the root
        return '';
    }

    return fullPath.slice(0, lastDotIndex);
};
