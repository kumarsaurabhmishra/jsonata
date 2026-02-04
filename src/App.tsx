import React, { useEffect } from 'react';
import { AppShell } from './components/layout/AppShell';
import { EditorPanel } from './components/editors/EditorPanel';
import { VersionSelector } from './components/controls/VersionSelector';
import { Button } from './components/ui/Button';
import { useJSONata } from './hooks/useJSONata';
import { cn } from './utils/cn';
import { getSuggestionsForPath, getExpressionContext } from './utils/suggestionUtils';
import { RotateCcw, Copy, AlertCircle, Cpu, FileCode, Wand2 } from 'lucide-react';
import type * as monaco from 'monaco-editor';

const SAMPLE_JSON = JSON.stringify({
  "Account": {
    "Account Name": "Firefly",
    "Order": [
      {
        "OrderID": "order103",
        "Product": [
          {
            "Product Name": "Bowler Hat",
            "ProductID": 858,
            "Quantity": 2,
            "Price": 28
          },
          {
            "Product Name": "Trilby hat",
            "ProductID": 858,
            "Quantity": 1,
            "Price": 18
          }
        ]
      },
      {
        "OrderID": "order104",
        "Product": [
          {
            "Product Name": "Leather Jacket",
            "ProductID": 413,
            "Quantity": 1,
            "Price": 812
          }
        ]
      }
    ]
  }
}, null, 2);

const SAMPLE_EXPRESSION = "Account.Order.Product.(Price * Quantity)";

const App: React.FC = () => {
  console.log('App: Rendering component...');

  // Persistence
  const savedVersion = localStorage.getItem('jsonata_version') || 'Latest';
  const savedJson = localStorage.getItem('jsonata_json') || SAMPLE_JSON;
  const savedExpr = localStorage.getItem('jsonata_expr') || SAMPLE_EXPRESSION;

  const {
    jsonInput, setJsonInput,
    expression, setExpression,
    version, setVersion,
    output, status, error,
    availableVersions
  } = useJSONata(savedJson, savedExpr, savedVersion);

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
    if (completionProviderRef.current) return;

    completionProviderRef.current = monaco.languages.registerCompletionItemProvider('javascript', {
      triggerCharacters: ['.'],
      provideCompletionItems: (model: any, position: any) => {
        const textUntilPosition = model.getValueInRange({
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        });

        const context = getExpressionContext(textUntilPosition);
        const keys = getSuggestionsForPath(suggestionsRef.current, context);

        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        const suggestions = keys.map(key => {
          // JSONata allows keys with spaces or special characters to be wrapped in double quotes
          const needsQuotes = /[\s\-]/.test(key);
          const insertText = needsQuotes ? `"${key}"` : key;

          return {
            label: key,
            kind: monaco.languages.CompletionItemKind.Field,
            insertText: insertText,
            detail: context ? `In ${context}` : 'From JSON root',
            range,
          };
        });

        return { suggestions };
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
    localStorage.setItem('jsonata_json', jsonInput);
  }, [jsonInput]);

  useEffect(() => {
    localStorage.setItem('jsonata_expr', expression);
  }, [expression]);

  useEffect(() => {
    localStorage.setItem('jsonata_version', version);
  }, [version]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  const handleReset = () => {
    setJsonInput(SAMPLE_JSON);
    setExpression(SAMPLE_EXPRESSION);
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
    if (exprEditorRef.current) {
      exprEditorRef.current.getAction('editor.action.formatDocument')?.run();
    }
  };

  const header = (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Cpu className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-tight">JSONata <span className="text-blue-400">Playground</span></h1>
          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">Multi-Version Evaluation</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <VersionSelector
          versions={availableVersions}
          selectedVersion={version}
          onVersionChange={setVersion}
        />

        <div className="h-6 w-px bg-slate-800 mx-1" />

        <div className="flex items-center gap-2 bg-slate-800/50 p-1 rounded-lg border border-slate-700">
          <Button variant="ghost" size="sm" onClick={handleReset} title="Reset to sample">
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
                status === 'Error' ? "bg-red-500" : "bg-slate-500"
          )} />
          <span className="text-slate-400 uppercase tracking-wider">{status}</span>
        </div>
        {status === 'Error' && error.json && (
          <div className="flex items-center gap-1.5 text-red-400">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>JSON Parse Error</span>
          </div>
        )}
      </div>
      <div className="text-slate-500">
        Engine: <span className="text-slate-300 font-mono">{version}</span>
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
              title="JSONata Expression"
              language="javascript"
              value={expression}
              onChange={(val) => setExpression(val || '')}
              error={error.expression}
              onMount={(editor, monaco) => {
                exprEditorRef.current = editor;
                handleEditorMount(editor, monaco);
              }}
              actions={
                <Button variant="ghost" size="icon" onClick={formatExpression} title="Format Expression">
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
