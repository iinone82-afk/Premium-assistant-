import React, { useState } from 'react';
import { 
  Sparkles, 
  Trash2, 
  FileText, 
  Send, 
  HelpCircle, 
  Sliders, 
  Check, 
  CornerDownRight, 
  Layers,
  ArrowRight,
  Clock,
  Briefcase
} from 'lucide-react';
import { ReplyIntent, ToneStyle, LengthStyle, EmailTemplate } from '../types';
import { SAMPLE_EMAILS } from '../data/sampleEmails';

interface EmailInputPanelProps {
  emailContent: string;
  onEmailContentChange: (val: string) => void;
  intent: ReplyIntent;
  onIntentChange: (intent: ReplyIntent) => void;
  tone: ToneStyle;
  onToneChange: (tone: ToneStyle) => void;
  length: LengthStyle;
  onLengthChange: (length: LengthStyle) => void;
  customKeyPoints: string;
  onCustomKeyPointsChange: (val: string) => void;
  onGenerateReplies: () => void;
  isGenerating: boolean;
  onLoadTemplate: (template: EmailTemplate) => void;
}

export const EmailInputPanel: React.FC<EmailInputPanelProps> = ({
  emailContent,
  onEmailContentChange,
  intent,
  onIntentChange,
  tone,
  onToneChange,
  length,
  onLengthChange,
  customKeyPoints,
  onCustomKeyPointsChange,
  onGenerateReplies,
  isGenerating,
  onLoadTemplate,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const intentOptions: { value: ReplyIntent; label: string; desc: string }[] = [
    { value: 'confirm', label: 'Agree & Approve', desc: 'Accept proposal, confirm meeting, or approve request' },
    { value: 'decline', label: 'Decline Politely', desc: 'Respectfully say no without burning bridges' },
    { value: 'clarify', label: 'Ask Clarification', desc: 'Probe for missing details, files, or requirements' },
    { value: 'reschedule', label: 'Counter / Reschedule', desc: 'Propose alternate times, scope, or terms' },
    { value: 'update', label: 'Status Update', desc: 'Provide crisp progress report or accountability' },
    { value: 'executive', label: 'Executive Brief', desc: 'Radical brevity & bottom-line decision first' },
  ];

  const toneOptions: { value: ToneStyle; label: string; icon: string }[] = [
    { value: 'executive', label: 'Executive (BLUF)', icon: '⚡' },
    { value: 'formal', label: 'Formal Business', icon: '👔' },
    { value: 'warm', label: 'Warm & Collaborative', icon: '🤝' },
    { value: 'assertive', label: 'Assertive & Firm', icon: '🛡️' },
    { value: 'brevity', label: 'Mobile Brevity', icon: '📱' },
  ];

  const lengthOptions: { value: LengthStyle; label: string; desc: string }[] = [
    { value: 'short', label: 'Short', desc: '1-3 sentences' },
    { value: 'medium', label: 'Balanced', desc: '1-2 paragraphs' },
    { value: 'bullets', label: 'Bulleted', desc: 'Clear next steps' },
  ];

  const wordCount = emailContent.trim() ? emailContent.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-4">
      {/* Sample Scenario Quick-Loader */}
      <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center">
            <FileText className="w-3.5 h-3.5 mr-1 text-slate-400" />
            Quick Scenarios & Templates:
          </span>
          <span className="text-[10px] text-slate-400">Click to preview context</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {SAMPLE_EMAILS.map((tpl) => (
            <button
              key={tpl.id}
              id={`load-${tpl.id}`}
              type="button"
              onClick={() => onLoadTemplate(tpl)}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80 transition-all text-left truncate max-w-full hover:border-slate-300"
            >
              <span className="font-medium">{tpl.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Email Input Box */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-800 uppercase tracking-wider flex items-center">
            <span>Incoming Email or Thread Context</span>
            <span className="ml-2 text-[10px] font-normal text-slate-400">
              ({wordCount} words)
            </span>
          </label>
          {emailContent && (
            <button
              id="clear-email-content"
              type="button"
              onClick={() => onEmailContentChange('')}
              className="text-slate-400 hover:text-rose-600 text-xs flex items-center transition-colors p-1 rounded"
              title="Clear input"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              <span>Clear</span>
            </button>
          )}
        </div>

        <textarea
          id="email-context-textarea"
          rows={7}
          value={emailContent}
          onChange={(e) => onEmailContentChange(e.target.value)}
          placeholder="Paste incoming email or thread here... (e.g. From: Marcus Vance <m.vance@example.com>, Subject: Project Scope...)"
          className="w-full text-xs sm:text-sm font-mono leading-relaxed p-3 rounded-lg border border-slate-200 bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-y"
        />

        {/* Intent Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Your Reply Objective
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {intentOptions.map((opt) => {
              const active = intent === opt.value;
              return (
                <button
                  key={opt.value}
                  id={`intent-${opt.value}`}
                  type="button"
                  onClick={() => onIntentChange(opt.value)}
                  className={`px-3 py-2 text-left rounded-lg text-xs font-medium transition-all border ${
                    active
                      ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="font-medium truncate">{opt.label}</div>
                  <div className={`text-[10px] mt-0.5 truncate ${active ? 'text-slate-300' : 'text-slate-400'}`}>
                    {opt.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tone & Length Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Professional Tone
            </label>
            <div className="flex flex-wrap gap-1.5">
              {toneOptions.map((t) => (
                <button
                  key={t.value}
                  id={`tone-${t.value}`}
                  type="button"
                  onClick={() => onToneChange(t.value)}
                  className={`px-2.5 py-1.5 text-xs rounded-lg font-medium transition-all border ${
                    tone === t.value
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className="mr-1">{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Draft Length
            </label>
            <div className="flex gap-1.5">
              {lengthOptions.map((l) => (
                <button
                  key={l.value}
                  id={`length-${l.value}`}
                  type="button"
                  onClick={() => onLengthChange(l.value)}
                  className={`flex-1 px-2 py-1.5 text-xs text-center rounded-lg font-medium transition-all border ${
                    length === l.value
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div>{l.label}</div>
                  <div className={`text-[9px] ${length === l.value ? 'text-indigo-100' : 'text-slate-400'}`}>
                    {l.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Key Points / Specific Constraints */}
        <div className="pt-2 border-t border-slate-100">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span className="flex items-center">
              <CornerDownRight className="w-3.5 h-3.5 mr-1 text-slate-400" />
              Key Details, Constraints, or Next Steps to Include
            </span>
            <span className="text-[10px] font-normal text-slate-400">Optional</span>
          </label>
          <input
            id="custom-key-points-input"
            type="text"
            value={customKeyPoints}
            onChange={(e) => onCustomKeyPointsChange(e.target.value)}
            placeholder="e.g. Free Thursday at 3pm EST, firm $20k budget cap, CC David on contract"
            className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-white placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        {/* Generate CTA Button */}
        <div className="pt-2">
          <button
            id="generate-replies-button"
            type="button"
            disabled={!emailContent.trim() || isGenerating}
            onClick={onGenerateReplies}
            className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center space-x-2 shadow-xs ${
              !emailContent.trim() || isGenerating
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/10 active:scale-[0.99]'
            }`}
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                <span>Crafting 3 Strategic Responses with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Draft Professional Responses</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
