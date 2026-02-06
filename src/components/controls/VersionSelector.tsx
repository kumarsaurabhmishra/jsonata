import React from 'react';
import { ChevronDown } from 'lucide-react';

interface VersionSelectorProps {
    versions: string[];
    selectedVersion: string;
    onVersionChange: (version: string) => void;
    mode: 'jsonata' | 'jolt';
    disabled?: boolean;
}

export const VersionSelector: React.FC<VersionSelectorProps> = ({
    versions,
    selectedVersion,
    onVersionChange,
    mode,
    disabled
}) => {
    return (
        <div className="relative inline-block">
            <label className="sr-only" htmlFor="version-select">Select {mode === 'jsonata' ? 'JSONata' : 'Jolt'} Version</label>
            <div className="relative">
                <select
                    id="version-select"
                    value={selectedVersion}
                    onChange={(e) => onVersionChange(e.target.value)}
                    disabled={disabled}
                    className="appearance-none bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-md pl-3 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    {versions.map((v) => (
                        <option key={v} value={v}>
                            {mode === 'jsonata' ? 'JSONata' : 'Jolt'} {v}
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
        </div>
    );
};
