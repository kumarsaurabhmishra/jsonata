import React from 'react';

interface AppShellProps {
    children: React.ReactNode;
    header: React.ReactNode;
    statusBar: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children, header, statusBar }) => {
    return (
        <div className="flex flex-col h-screen overflow-hidden bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
            {/* Header */}
            <header className="flex-none border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm z-10 px-4 py-2">
                {header}
            </header>

            {/* Main Content Area */}
            <main className="flex-1 overflow-hidden relative">
                {children}
            </main>

            {/* Footer/StatusBar */}
            <footer className="flex-none border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-1">
                {statusBar}
            </footer>
        </div>
    );
};
