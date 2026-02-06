export const JSONATA_BUILTINS = [
    // Aggregate functions
    { label: '$sum', detail: 'Sum of an array of numbers', kind: 'Function', insertText: '$sum(${1:array})' },
    { label: '$count', detail: 'Count elements in an array', kind: 'Function', insertText: '$count(${1:array})' },
    { label: '$average', detail: 'Average of an array of numbers', kind: 'Function', insertText: '$average(${1:array})' },
    { label: '$max', detail: 'Maximum value in an array', kind: 'Function', insertText: '$max(${1:array})' },
    { label: '$min', detail: 'Minimum value in an array', kind: 'Function', insertText: '$min(${1:array})' },

    // String functions
    { label: '$uppercase', detail: 'Convert to uppercase', kind: 'Function', insertText: '$uppercase(${1:string})' },
    { label: '$lowercase', detail: 'Convert to lowercase', kind: 'Function', insertText: '$lowercase(${1:string})' },
    { label: '$substring', detail: 'Return substring', kind: 'Function', insertText: '$substring(${1:string}, ${2:start}, ${3:length})' },
    { label: '$split', detail: 'Split string into array', kind: 'Function', insertText: '$split(${1:string}, ${2:separator})' },
    { label: '$join', detail: 'Join array into string', kind: 'Function', insertText: '$join(${1:array}, ${2:separator})' },
    { label: '$contains', detail: 'Check if string contains substring', kind: 'Function', insertText: '$contains(${1:string}, ${2:pattern})' },
    { label: '$replace', detail: 'Replace substring with another', kind: 'Function', insertText: '$replace(${1:string}, ${2:pattern}, ${3:replacement})' },
    { label: '$trim', detail: 'Remove leading/trailing whitespace', kind: 'Function', insertText: '$trim(${1:string})' },

    // Array functions
    { label: '$map', detail: 'Apply function to each element', kind: 'Function', insertText: '$map(${1:array}, ${2:function})' },
    { label: '$filter', detail: 'Filter elements by condition', kind: 'Function', insertText: '$filter(${1:array}, ${2:function})' },
    { label: '$reduce', detail: 'Reduce array to a single value', kind: 'Function', insertText: '$reduce(${1:array}, ${2:function})' },
    { label: '$sort', detail: 'Sort an array', kind: 'Function', insertText: '$sort(${1:array}, ${2:function})' },
    { label: '$reverse', detail: 'Reverse an array', kind: 'Function', insertText: '$reverse(${1:array})' },
    { label: '$append', detail: 'Append elements to an array', kind: 'Function', insertText: '$append(${1:array}, ${2:element})' },

    // Object functions
    { label: '$keys', detail: 'Get keys of an object', kind: 'Function', insertText: '$keys(${1:object})' },
    { label: '$lookup', detail: 'Lookup value by key', kind: 'Function', insertText: '$lookup(${1:object}, ${2:key})' },
    { label: '$merge', detail: 'Merge multiple objects', kind: 'Function', insertText: '$merge([${1:obj1}, ${2:obj2}])' },

    // Logic functions
    { label: '$not', detail: 'Boolean NOT', kind: 'Function', insertText: '$not(${1:value})' },
    { label: '$exists', detail: 'Check if value exists', kind: 'Function', insertText: '$exists(${1:value})' },

    // Miscellaneous
    { label: '$now', detail: 'Current date and time', kind: 'Function', insertText: '$now()' },
    { label: '$formatDateTime', detail: 'Format date time string', kind: 'Function', insertText: '$formatDateTime(${1:dt}, ${2:format})' },
    { label: '$number', detail: 'Cast to number', kind: 'Function', insertText: '$number(${1:value})' },
    { label: '$string', detail: 'Cast to string', kind: 'Function', insertText: '$string(${1:value})' }
];

export const JSONATA_OPERATORS = [
    { label: '~>', detail: 'Chain operator', kind: 'Operator' },
    { label: ':=', detail: 'Variable assignment', kind: 'Operator' },
    { label: '^(', detail: 'Sorting operator', kind: 'Operator' },
    { label: '?', detail: 'Condition start', kind: 'Operator' },
    { label: ':', detail: 'Condition else', kind: 'Operator' }
];
