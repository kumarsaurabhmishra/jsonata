import React, { useEffect } from 'react';
import { AppShell } from './components/layout/AppShell';
import { EditorPanel } from './components/editors/EditorPanel';
import { VersionSelector } from './components/controls/VersionSelector';
import { Button } from './components/ui/Button';
import { ThemeToggle } from './components/ui/ThemeToggle';
import { useTransformer } from './hooks/useTransformer';
import { cn } from './utils/cn';
import { getSuggestionsForPath, getExpressionContext } from './utils/suggestionUtils';
import { formatJSONata } from './utils/jsonataFormatter';
import { JSONATA_BUILTINS, JSONATA_OPERATORS } from './utils/jsonataBuiltins';
import { RotateCcw, Copy, AlertCircle, Cpu, FileCode, Wand2 } from 'lucide-react';
import type * as monaco from 'monaco-editor';

const JSONATA_SAMPLES = {
  json: JSON.stringify({
    "Account": {
      "Account Name": "Firefly",
      "Order": [
        {
          "OrderID": "order103",
          "Product": [
            { "Product Name": "Bowler Hat", "ProductID": 858, "Quantity": 2, "Price": 28 },
            { "Product Name": "Trilby hat", "ProductID": 858, "Quantity": 1, "Price": 18 }
          ]
        },
        {
          "OrderID": "order104",
          "Product": [
            { "Product Name": "Leather Jacket", "ProductID": 413, "Quantity": 1, "Price": 812 }
          ]
        }
      ]
    }
  }, null, 2),
  expression: "Account.Order.Product.(Price * Quantity)",
  version: 'Latest'
};

const JOLT_SAMPLES = {
  json: JSON.stringify({
    "greeting": "Hello World",
    "details": {
      "user": "Saurabh",
      "action": "Testing Jolt"
    }
  }, null, 2),
  expression: `[
  {
    "operation": "shift",
    "spec": {
      // This is a Jolt Shift transformation spec
      "greeting": "Message",
      "details": {
        "user": "Author",
        "action": "Activity"
      }
    }
  }
]`,
  version: 'v0.1.8'
};

type TransformerMode = 'jsonata' | 'jolt';

const App: React.FC = () => {
  // Mode Management
  const [mode, setMode] = React.useState<TransformerMode>(
    (localStorage.getItem('playground_mode') as TransformerMode) || 'jsonata'
  );

  // Persistence per-mode
  const getSaved = (key: string, defaultVal: string) => localStorage.getItem(`${mode}_${key}`) || defaultVal;

  const savedVersion = getSaved('version', mode === 'jsonata' ? JSONATA_SAMPLES.version : JOLT_SAMPLES.version);
  const savedJson = getSaved('json', mode === 'jsonata' ? JSONATA_SAMPLES.json : JOLT_SAMPLES.json);
  const savedExpr = getSaved('expr', mode === 'jsonata' ? JSONATA_SAMPLES.expression : JOLT_SAMPLES.expression);

  const {
    jsonInput, setJsonInput,
    expression, setExpression,
    version, setVersion,
    output, status, error,
    availableVersions
  } = useTransformer(savedJson, savedExpr, savedVersion);

  const suggestionsRef = React.useRef<any>(null); // Store the parsed JSON object
  const completionProviderRef = React.useRef<any>(null);
  const inputEditorRef = React.useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const exprEditorRef = React.useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    try {
      suggestionsRef.current = JSON.parse(jsonInput);
    } catch (e) {
      // Keep previous valid structure if current is invalid
    }
  }, [jsonInput]);

  const handleEditorMount = (_editor: monaco.editor.IStandaloneCodeEditor, monaco: any) => {
    // Disable built-in validation as it conflicts with JSONata syntax
    if (monaco.languages.typescript?.javascriptDefaults) {
      monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
        noSyntaxValidation: true,
      });
    }

    if (completionProviderRef.current) return;

    completionProviderRef.current = monaco.languages.registerCompletionItemProvider('javascript', {
      triggerCharacters: ['.', '$'],
      provideCompletionItems: (model: any, position: any) => {
        try {
          const textUntilPosition = model.getValueInRange({
            startLineNumber: 1,
            startColumn: 1,
            endLineNumber: position.lineNumber,
            endColumn: position.column,
          });

          const word = model.getWordUntilPosition(position);
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          };

          const context = getExpressionContext(textUntilPosition);

          let parsedData = {};
          try {
            parsedData = JSON.parse(jsonInput);
          } catch (e) {
            // If JSON is invalid, we can't provide field suggestions but can still provide built-ins
          }

          const keys = getSuggestionsForPath(parsedData, context);

          const fieldSuggestions = mode === 'jsonata' ? keys.map(key => {
            const needsQuotes = /[\s\-]/.test(key);
            const insertText = needsQuotes ? `"${key}"` : key;

            return {
              label: key,
              kind: monaco.languages.CompletionItemKind ? monaco.languages.CompletionItemKind.Field : 3, // 3 is Field
              insertText: insertText,
              detail: context ? `In ${context}` : 'From JSON root',
              range,
            };
          }) : [];

          // Add built-in functions and operators (JSONata only)
          let builtInSuggestions: any[] = [];
          if (mode === 'jsonata') {
            const charBeforeCursor = textUntilPosition.slice(-1);
            const isDollarTrigger = charBeforeCursor === '$' || word.word.startsWith('$');

            if (!context || textUntilPosition.trim().endsWith('~>') || isDollarTrigger) {
              const FunctionKind = monaco.languages.CompletionItemKind ? monaco.languages.CompletionItemKind.Function : 2;
              const KeywordKind = monaco.languages.CompletionItemKind ? monaco.languages.CompletionItemKind.Keyword : 17;
              const SnippetRule = monaco.languages.CompletionItemInsertValueRule ? monaco.languages.CompletionItemInsertValueRule.InsertAsSnippet : 4;

              // Ensure the range includes the leading $ if present
              const charBeforeRange = model.getValueInRange({
                startLineNumber: position.lineNumber,
                startColumn: range.startColumn - 1,
                endLineNumber: position.lineNumber,
                endColumn: range.startColumn
              });

              const builtinRange = charBeforeRange === '$' ? {
                ...range,
                startColumn: range.startColumn - 1
              } : range;

              builtInSuggestions = [
                ...(JSONATA_BUILTINS || []).map(b => ({
                  label: b.label,
                  kind: FunctionKind,
                  insertText: b.insertText,
                  insertTextRules: SnippetRule,
                  detail: b.detail,
                  range: builtinRange,
                })),
                ...(JSONATA_OPERATORS || []).map(o => ({
                  label: o.label,
                  kind: KeywordKind,
                  insertText: o.label,
                  detail: o.detail,
                  range,
                }))
              ];
            }
          }

          return { suggestions: [...fieldSuggestions, ...builtInSuggestions] };
        } catch (err) {
          console.error('Autocomplete Error:', err);
          return { suggestions: [] };
        }
      },
    });
  };

  useEffect(() => {
    return () => {
      if (completionProviderRef.current) {
        completionProviderRef.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    console.log('App: Mounted');
  }, []);

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('playground_mode', mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem(`${mode}_json`, jsonInput);
  }, [jsonInput, mode]);

  useEffect(() => {
    localStorage.setItem(`${mode}_expr`, expression);
  }, [expression, mode]);

  useEffect(() => {
    localStorage.setItem(`${mode}_version`, version);
  }, [version, mode]);

  // Handle mode switching: Load samples for the new mode
  const switchMode = (newMode: TransformerMode) => {
    setMode(newMode);
    const samples = newMode === 'jsonata' ? JSONATA_SAMPLES : JOLT_SAMPLES;
    setVersion(samples.version);
    setJsonInput(samples.json);
    setExpression(samples.expression);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  const handleReset = () => {
    const samples = mode === 'jsonata' ? JSONATA_SAMPLES : JOLT_SAMPLES;
    setJsonInput(samples.json);
    setExpression(samples.expression);
    setVersion(samples.version);
  };

  const formatInput = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed, null, 2));
    } catch (e) {
      // Handle invalid JSON before formatting
      alert('Cannot format invalid JSON');
    }
  };

  const formatExpression = () => {
    try {
      if (mode === 'jolt') {
        // Strip comments for formatting parse
        const stripped = expression.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1');
        const parsed = JSON.parse(stripped);
        setExpression(JSON.stringify(parsed, null, 2));
      } else {
        const formatted = formatJSONata(expression);
        setExpression(formatted);
      }
    } catch (e) {
      alert(`Cannot format ${mode === 'jolt' ? 'Jolt Spec' : 'expression'} (formatting might fail if comments are present)`);
    }
  };

  const header = (
    <div className="flex items-center justify-between w-full">
      {/* Left: Logo and Title */}
      <div className="flex-1 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Cpu className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">JSON Transformer <span className="text-blue-600 dark:text-blue-400">Playground</span></h1>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-widest">Multi-Engine Evaluation</p>
        </div>
      </div>

      {/* Center: Mode Toggle */}
      <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700">
        <button
          onClick={() => switchMode('jsonata')}
          className={cn(
            "px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all",
            mode === 'jsonata' ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          )}
        >
          JSONata
        </button>
        <button
          onClick={() => switchMode('jolt')}
          className={cn(
            "px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all",
            mode === 'jolt' ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          )}
        >
          Jolt
        </button>
      </div>

      {/* Right: Version Selector and Actions */}
      <div className="flex-1 flex items-center justify-end gap-4">
        <ThemeToggle />
        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1" />
        <div className="min-w-[180px]">
          <VersionSelector
            versions={availableVersions.filter(v => mode === 'jolt' ? v.startsWith('v0') : !v.startsWith('v0'))}
            selectedVersion={version}
            onVersionChange={setVersion}
            mode={mode}
          />
        </div>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
          <Button variant="ghost" size="sm" onClick={handleReset} title="Reset to sample" className="text-slate-700 dark:text-slate-300">
            <RotateCcw className="w-4 h-4 mr-1.5" />
            <span className="text-xs">Reset</span>
          </Button>
        </div>
      </div>
    </div>
  );

  const statusBar = (
    <div className="flex items-center justify-between text-[11px] font-medium">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className={cn(
            "w-2 h-2 rounded-full",
            status === 'Running...' ? "bg-yellow-500 animate-pulse" :
              status === 'Success' ? "bg-emerald-500" :
                status === 'Error' ? "bg-red-500" : "bg-slate-400 dark:bg-slate-500"
          )} />
          <span className="text-slate-600 dark:text-slate-400 uppercase tracking-wider">{status}</span>
        </div>
        {status === 'Error' && error.json && (
          <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>JSON Parse Error</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-4">
        <div className="text-slate-500 dark:text-slate-500">
          Created by <a
            href="https://github.com/kumarsaurabhmishra"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors font-semibold"
          >Saurabh</a>
        </div>
        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
        <div className="text-slate-600 dark:text-slate-400">
          Engine: <span className="text-slate-900 dark:text-slate-300 font-mono">{version}</span>
        </div>
      </div>
    </div>
  );

  return (
    <AppShell header={header} statusBar={statusBar}>
      <div className="grid grid-cols-1 lg:grid-cols-2 h-full gap-4 p-4 lg:p-6 overflow-hidden">
        {/* Left Column: Input JSON */}
        <div className="h-[40vh] lg:h-full min-h-[200px]">
          <EditorPanel
            title="Input JSON"
            language="json"
            value={jsonInput}
            onChange={(val) => setJsonInput(val || '')}
            error={error.json}
            onMount={(editor) => { inputEditorRef.current = editor; }}
            actions={
              <Button variant="ghost" size="icon" onClick={formatInput} title="Format JSON">
                <FileCode className="w-3.5 h-3.5" />
              </Button>
            }
          />
        </div>

        {/* Right Column: Expression & Output */}
        <div className="flex flex-col h-[60vh] lg:h-full min-h-[300px] gap-4">
          <div className="flex-1">
            <EditorPanel
              title={mode === 'jsonata' ? "JSONata Expression" : "Jolt Spec"}
              language="javascript"
              value={expression}
              onChange={(val) => setExpression(val || '')}
              error={error.expression}
              onMount={(editor, monaco) => {
                exprEditorRef.current = editor;
                handleEditorMount(editor, monaco);
              }}
              actions={
                <Button variant="ghost" size="icon" onClick={formatExpression} title={mode === 'jsonata' ? "Format Expression" : "Format Spec"}>
                  <Wand2 className="w-3.5 h-3.5" />
                </Button>
              }
              options={{
                suggest: {
                  showWords: false,
                  showKeywords: false,
                  showClasses: false,
                  showColors: false,
                  showConstants: false,
                  showConstructors: false,
                  showEnums: false,
                  showEnumMembers: false,
                  showEvents: false,
                  showFields: true,
                  showFiles: false,
                  showFolders: false,
                  showFunctions: false,
                  showInterfaces: false,
                  showIssues: false,
                  showMethods: false,
                  showModules: false,
                  showOperators: false,
                  showProperties: false,
                  showReferences: false,
                  showSnippets: false,
                  showStructs: false,
                  showTypeParameters: false,
                  showUnits: false,
                  showValues: false,
                  showVariables: false,
                },
                quickSuggestions: {
                  other: true,
                  comments: false,
                  strings: false
                }
              }}
            />
          </div>
          <div className="flex-1">
            <EditorPanel
              title="Output"
              language="json"
              value={output}
              options={{ readOnly: true, lineNumbers: 'off' }}
              actions={
                <Button variant="ghost" size="icon" onClick={handleCopy} title="Copy output">
                  <Copy className="w-3.5 h-3.5" />
                </Button>
              }
            />
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default App;
