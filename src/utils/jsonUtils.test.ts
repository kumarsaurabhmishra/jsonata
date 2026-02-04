import { describe, it, expect } from 'vitest';
import { safeJsonParse, formatOutput } from './jsonUtils';

describe('jsonUtils', () => {
    describe('safeJsonParse', () => {
        it('should parse valid JSON', () => {
            expect(safeJsonParse('{"a": 1}')).toEqual({ a: 1 });
        });

        it('should throw error for invalid JSON', () => {
            expect(() => safeJsonParse('{a: 1}')).toThrow();
        });

        it('should return null for empty string', () => {
            expect(safeJsonParse('   ')).toBeNull();
        });
    });

    describe('formatOutput', () => {
        it('should format objects as pretty JSON', () => {
            const input = { a: 1, b: [2, 3] };
            const output = formatOutput(input);
            expect(output).toContain('"a": 1');
            expect(output).toContain('  '); // indented
        });

        it('should return string representation of primitives', () => {
            expect(formatOutput(123)).toBe('123');
            expect(formatOutput('hello')).toBe('hello');
            expect(formatOutput(true)).toBe('true');
        });

        it('should return "null" for null', () => {
            expect(formatOutput(null)).toBe('null');
        });

        it('should return "undefined" for undefined', () => {
            expect(formatOutput(undefined)).toBe('undefined');
        });

        it('should handle functions gracefully', () => {
            expect(formatOutput(() => { })).toBe('[Function]');
        });
    });
});
