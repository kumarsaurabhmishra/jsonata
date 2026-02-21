import Editor, { type EditorProps } from '@monaco-editor/react';
import { useTheme } from '../../context/ThemeContext';

interface EditorPanelProps extends EditorProps {
    title: string;
    error?: string | null;
    actions?: React.ReactNode;
}

export const EditorPanel: React.FC<EditorPanelProps> = ({
    title,
    error,
    actions,
    ...props
}) => {
    const { theme } = useTheme();
    const monacoTheme = theme === 'dark' ? 'vs-dark' : 'light';

    return (
        <div className="flex flex-col h-full border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-white dark:bg-slate-900/40">
            <div className="flex items-center justify-between px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {title}
                </h3>
                <div className="flex items-center gap-2">
                    {actions}
                </div>
            </div>
            <div className="flex-1 relative">
                <Editor
                    theme={monacoTheme}
                    onMount={(editor, monaco) => {
                        if (props.onMount) {
                            props.onMount(editor, monaco);
                        }
                    }}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 13,
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        padding: { top: 8, bottom: 8 },
                        ...props.options,
                    }}
                    {...props}
                />
                {error && (
                    <div className="absolute bottom-0 left-0 right-0 bg-red-500/5 dark:bg-red-500/10 border-t border-red-200 dark:border-red-500/50 p-2 backdrop-blur-sm">
                        <p className="text-xs text-red-600 dark:text-red-400 font-mono line-clamp-2">{error}</p>
                    </div>
                )}
            </div>
        </div>
    );
};
