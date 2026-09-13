import React from 'react';
import { Mail, Sparkles, User, HelpCircle, ShieldCheck } from 'lucide-react';
import { SenderPersona } from '../types';

interface HeaderProps {
  persona: SenderPersona;
  onOpenPersonaModal: () => void;
  onOpenGuideModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  persona,
  onOpenPersonaModal,
  onOpenGuideModal,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Purpose */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xs">
              <Mail className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-slate-900 tracking-tight text-base sm:text-lg">
                  Professional Email Reply Assistant
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  <Sparkles className="w-3 h-3 mr-1 text-indigo-500" />
                  Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Executive BLUF framework · Context-aware drafting · One-click Gmail compose
              </p>
            </div>
          </div>

          {/* Actions & Persona */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              id="guide-button"
              type="button"
              onClick={onOpenGuideModal}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              title="View Professional Emailing Principles"
            >
              <HelpCircle className="w-4 h-4 mr-1.5 text-slate-400" />
              <span className="hidden md:inline">Executive Guidelines</span>
            </button>

            <button
              id="persona-button"
              type="button"
              onClick={onOpenPersonaModal}
              className="inline-flex items-center space-x-2 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs transition-all hover:border-slate-300"
            >
              <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                <User className="w-3.5 h-3.5" />
              </div>
              <span className="max-w-[120px] truncate text-slate-800">
                {persona.name || 'Set Sender Profile'}
              </span>
              <span className="text-[10px] text-slate-400 font-normal hidden lg:inline">
                {persona.title ? `(${persona.title})` : ''}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
