import React from 'react';
import { ExternalLink, X, Globe } from 'lucide-react';

interface LinkSelectionModalProps {
  links: string[];
  onClose: () => void;
}

export const LinkSelectionModal: React.FC<LinkSelectionModalProps> = ({ links, onClose }) => {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden relative z-10 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center justify-between">
          <h3 className="font-bold text-slate-700 flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-500" />
            Select a Link
          </h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Link List */}
        <div className="p-4 space-y-3">
          {links.map((link, index) => {
            let label = "External Link";
            try {
                const url = new URL(link);
                label = url.hostname.replace('www.', '');
            } catch (e) {
                label = link.length > 30 ? link.substring(0, 30) + '...' : link;
            }

            return (
              <a
                key={index}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="flex items-center justify-between p-4 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-xl transition-all group"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-slate-400 group-hover:text-indigo-500">
                        <ExternalLink className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-slate-700 group-hover:text-indigo-700 truncate block">
                            {label}
                        </span>
                        <span className="text-xs text-slate-400 truncate block font-mono">
                            {link}
                        </span>
                    </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};