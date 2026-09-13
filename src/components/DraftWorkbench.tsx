import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  ExternalLink, 
  Mail, 
  Edit3, 
  RefreshCw, 
  Sparkles, 
  Clock, 
  FileText, 
  Wand2, 
  ArrowUpRight,
  Shield,
  Layers,
  ChevronRight
} from 'lucide-react';
import { DraftResponse, EmailAnalysis } from '../types';

interface DraftWorkbenchProps {
  drafts: DraftResponse[];
  activeDraftIndex: number;
  onSelectDraftIndex: (idx: number) => void;
  analysis: EmailAnalysis | null;
  onUpdateDraftBody: (draftId: string, newBody: string, newSubject: string) => void;
  onRefineDraft: (instruction: string) => void;
  isRefining: boolean;
}

export const DraftWorkbench: React.FC<DraftWorkbenchProps> = ({
  drafts,
  activeDraftIndex,
  onSelectDraftIndex,
  analysis,
  onUpdateDraftBody,
  onRefineDraft,
  isRefining,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [copiedSubject, setCopiedSubject] = useState(false);
  const [copiedBody, setCopiedBody] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [customRefineInput, setCustomRefineInput] = useState('');

  if (!drafts || drafts.length === 0) {
    return (
      <div 
        id="empty-workbench-placeholder"
        className="h-full min-h-[440px] flex flex-col items-center justify-center p-8 bg-white rounded-2xl border border-dashed border-slate-200 text-center"
      >
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 shadow-xs">
          <Mail className="w-7 h-7" />
        </div>
        <h3 className="text-base font-semibold text-slate-800 mb-1">
          Awaiting Email Context
        </h3>
        <p className="text-xs text-slate-500 max-w-sm leading-relaxed mb-6">
          Paste an incoming email thread or select one of the executive scenarios on the left to generate 3 customized professional responses.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full max-w-md text-left">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-[11px] font-semibold text-slate-700">1. Crisp & Direct</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Bottom line up front</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-[11px] font-semibold text-slate-700">2. Diplomatic</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Collaborative boundary</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-[11px] font-semibold text-slate-700">3. Executive</div>
            <div className="text-[10px] text-slate-400 mt-0.5">High-impact leadership</div>
          </div>
        </div>
      </div>
    );
  }

  const currentDraft = drafts[activeDraftIndex] || drafts[0];

  const handleCopySubject = () => {
    navigator.clipboard.writeText(currentDraft.subject);
    setCopiedSubject(true);
    setTimeout(() => setCopiedSubject(false), 2000);
  };

  const handleCopyBody = () => {
    navigator.clipboard.writeText(currentDraft.body);
    setCopiedBody(true);
    setTimeout(() => setCopiedBody(false), 2000);
  };

  const handleCopyAll = () => {
    const fullText = `Subject: ${currentDraft.subject}\n\n${currentDraft.body}`;
    navigator.clipboard.writeText(fullText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  // Recipient detection for Gmail link
  const recipient = analysis?.detectedSender && !analysis.detectedSender.includes('Unknown')
    ? analysis.detectedSender
    : '';

  // Official Gmail Web Compose URL
  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipient)}&su=${encodeURIComponent(currentDraft.subject)}&body=${encodeURIComponent(currentDraft.body)}`;

  // Standard Mailto URI
  const mailtoUri = `mailto:${recipient}?subject=${encodeURIComponent(currentDraft.subject)}&body=${encodeURIComponent(currentDraft.body)}`;

  const quickRefinements = [
    { label: '30% Shorter', prompt: 'Make this draft 30% more concise while keeping all core facts' },
    { label: 'More Diplomatic', prompt: 'Soften the tone to be warmer and more diplomatic while maintaining clarity' },
    { label: 'More Assertive', prompt: 'Make the response firmer and more assertive regarding boundaries/timeline' },
    { label: 'Bullet Next Steps', prompt: 'Format the deliverables and next actions into clear bullet points' },
  ];

  return (
    <div id="draft-workbench" className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
      {/* Draft Variation Selector Header */}
      <div className="border-b border-slate-200 bg-slate-50/70 p-2 sm:px-4 sm:py-2.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-1.5 overflow-x-auto py-1">
          {drafts.map((draft, idx) => {
            const active = idx === activeDraftIndex;
            return (
              <button
                key={draft.id || idx}
                id={`draft-tab-${idx}`}
                type="button"
                onClick={() => {
                  onSelectDraftIndex(idx);
                  setIsEditing(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                  active
                    ? 'bg-white text-slate-900 border border-slate-200/80 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <span>{draft.title || `Option ${idx + 1}`}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${active ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400'}`}>
                  {draft.wordCount}w
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center space-x-2 text-[11px] text-slate-500">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{currentDraft.wordCount} words (~{currentDraft.readTimeSeconds}s read)</span>
        </div>
      </div>

      {/* Draft Body Content */}
      <div className="p-4 sm:p-6 space-y-4 flex-1">
        {/* Subject Line Bar */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center space-x-2 min-w-0 flex-1 mr-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide shrink-0">
              Subject:
            </span>
            {isEditing ? (
              <input
                id="edit-draft-subject"
                type="text"
                value={currentDraft.subject}
                onChange={(e) => onUpdateDraftBody(currentDraft.id, currentDraft.body, e.target.value)}
                className="w-full text-xs font-semibold text-slate-800 bg-white px-2 py-1 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            ) : (
              <span className="text-xs font-semibold text-slate-800 truncate select-all">
                {currentDraft.subject}
              </span>
            )}
          </div>
          <button
            id="copy-draft-subject"
            type="button"
            onClick={handleCopySubject}
            className="text-[11px] font-medium text-slate-600 hover:text-slate-900 px-2 py-1 rounded-md hover:bg-white transition-all shrink-0 flex items-center space-x-1"
            title="Copy Subject Line"
          >
            {copiedSubject ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Text View / Edit Area */}
        <div className="relative">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center">
              <span>Draft Content</span>
              {currentDraft.keyStrength && (
                <span className="ml-2 text-[11px] font-normal text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                  {currentDraft.keyStrength}
                </span>
              )}
            </span>
            <button
              id="toggle-edit-mode"
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center space-x-1 px-2 py-0.5 rounded hover:bg-slate-100 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-400" />
              <span>{isEditing ? 'Done Editing' : 'Edit Text'}</span>
            </button>
          </div>

          {isEditing ? (
            <textarea
              id="edit-draft-body"
              rows={9}
              value={currentDraft.body}
              onChange={(e) => onUpdateDraftBody(currentDraft.id, e.target.value, currentDraft.subject)}
              className="w-full text-xs sm:text-sm font-sans leading-relaxed p-4 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-2xs resize-y"
            />
          ) : (
            <div 
              id="view-draft-body"
              className="p-4 sm:p-5 rounded-xl bg-slate-50/60 border border-slate-200/80 text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed select-text font-normal shadow-2xs min-h-[160px]"
            >
              {currentDraft.body}
            </div>
          )}
        </div>

        {/* Strategic Rationale Callout */}
        {currentDraft.rationale && (
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-600 flex items-start space-x-2.5">
            <Shield className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-slate-700">Strategy Rationale: </strong>
              {currentDraft.rationale}
            </div>
          </div>
        )}

        {/* Quick AI Refinements Bar */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-indigo-500" />
              Instant AI Refinements:
            </span>
            {isRefining && (
              <span className="text-[11px] text-indigo-600 flex items-center">
                <RefreshCw className="w-3 h-3 animate-spin mr-1" />
                Applying polish...
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {quickRefinements.map((qr, idx) => (
              <button
                key={idx}
                id={`refine-btn-${idx}`}
                type="button"
                disabled={isRefining}
                onClick={() => onRefineDraft(qr.prompt)}
                className="px-2.5 py-1 text-xs rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80 transition-all hover:border-slate-300 disabled:opacity-50"
              >
                {qr.label}
              </button>
            ))}
          </div>

          {/* Custom refinement input */}
          <div className="flex space-x-2 pt-1">
            <input
              id="custom-refinement-input"
              type="text"
              value={customRefineInput}
              disabled={isRefining}
              onChange={(e) => setCustomRefineInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && customRefineInput.trim() && !isRefining) {
                  onRefineDraft(customRefineInput.trim());
                  setCustomRefineInput('');
                }
              }}
              placeholder="Custom tweak (e.g., 'Mention I will cc the legal team' or 'Politely reject Friday morning')"
              className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            <button
              id="apply-custom-refinement"
              type="button"
              disabled={!customRefineInput.trim() || isRefining}
              onClick={() => {
                if (customRefineInput.trim()) {
                  onRefineDraft(customRefineInput.trim());
                  setCustomRefineInput('');
                }
              }}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-white hover:bg-slate-900 transition-colors disabled:opacity-40"
            >
              Refine
            </button>
          </div>
        </div>
      </div>

      {/* Action Hub / Dispatch Footer */}
      <div className="p-4 bg-slate-50/80 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <button
            id="copy-draft-body"
            type="button"
            onClick={handleCopyBody}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-white text-slate-800 border border-slate-200 shadow-2xs hover:bg-slate-50 transition-all flex items-center space-x-1.5"
          >
            {copiedBody ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Copied Body</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-500" />
                <span>Copy Body</span>
              </>
            )}
          </button>

          <button
            id="copy-all-details"
            type="button"
            onClick={handleCopyAll}
            className="px-3 py-2 text-xs font-medium rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all flex items-center space-x-1.5"
            title="Copy both Subject and Body text"
          >
            {copiedAll ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">All Copied</span>
              </>
            ) : (
              <>
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy All</span>
              </>
            )}
          </button>
        </div>

        {/* Email App & Gmail Launchers */}
        <div className="flex items-center space-x-2">
          <a
            id="open-desktop-mailto"
            href={mailtoUri}
            className="px-3 py-2 text-xs font-medium rounded-xl text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-2xs transition-all flex items-center space-x-1.5"
            title="Open in default mail application (Outlook, Apple Mail)"
          >
            <Mail className="w-3.5 h-3.5 text-slate-500" />
            <span>Default Mail</span>
          </a>

          <a
            id="open-in-gmail"
            href={gmailComposeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all flex items-center space-x-1.5 active:scale-[0.99]"
            title="Launch Gmail Web with pre-filled subject and response"
          >
            <Mail className="w-4 h-4 text-indigo-200" />
            <span>Open in Gmail</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-indigo-300" />
          </a>
        </div>
      </div>
    </div>
  );
};
