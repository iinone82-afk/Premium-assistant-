import React from 'react';
import { X, CheckCircle2, AlertTriangle, ShieldCheck, Mail, Zap } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        id="guide-modal-card"
        className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">Executive Communication Framework</h3>
              <p className="text-xs text-slate-500">Core principles powering this AI Assistant</p>
            </div>
          </div>
          <button
            id="close-guide-modal"
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-sm text-slate-600 max-h-[75vh] overflow-y-auto">
          {/* Rule 1: BLUF */}
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 text-sm">Bottom Line Up Front (BLUF)</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                State your decision, answer, or core update in the first sentence. Busy executives and clients read emails on mobile screens where the first 25 words dictate the outcome.
              </p>
            </div>
          </div>

          {/* Rule 2: Radical Brevity */}
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 text-sm">Cut the Fluff & Cliché Fillers</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Avoid sentences like <span className="italic text-slate-700">"I hope this email finds you well"</span>, <span className="italic text-slate-700">"Just circling back"</span>, or apologetic hedging. The assistant maintains warmth while prioritizing respect for the reader's time.
              </p>
            </div>
          </div>

          {/* Rule 3: Unambiguous Action Items */}
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 text-sm">Every Response Owns the Next Step</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Never conclude with ambiguous sign-offs like "let's touch base sometime". State explicit deadlines, designated owners, or specific timeslots (e.g., <span className="italic text-slate-700">"I will send the finalized spec by Thursday 3 PM EST"</span>).
              </p>
            </div>
          </div>

          {/* Gmail Integration Note */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start space-x-3">
            <Mail className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600">
              <p className="font-medium text-slate-800">Direct Gmail & Web Compose Workflow</p>
              <p className="mt-1">
                Clicking <strong>Open in Gmail</strong> automatically launches the official Gmail web interface with the recipient, subject line, and generated draft pre-populated into an active compose window.
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            id="dismiss-guide-modal"
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
          >
            Got it, continue
          </button>
        </div>
      </div>
    </div>
  );
};
