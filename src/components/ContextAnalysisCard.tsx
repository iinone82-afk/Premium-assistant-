import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertCircle, HelpCircle, CheckSquare, Lightbulb, Shield, Clock } from 'lucide-react';
import { EmailAnalysis } from '../types';

interface ContextAnalysisCardProps {
  analysis: EmailAnalysis | null;
  isLoading?: boolean;
}

export const ContextAnalysisCard: React.FC<ContextAnalysisCardProps> = ({
  analysis,
  isLoading = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-4 animate-pulse space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-4 bg-slate-200 rounded-sm w-36"></div>
          <div className="h-4 bg-slate-200 rounded-full w-20"></div>
        </div>
        <div className="h-3 bg-slate-100 rounded-sm w-full"></div>
        <div className="h-3 bg-slate-100 rounded-sm w-4/5"></div>
      </div>
    );
  }

  if (!analysis) return null;

  const urgencyColors = {
    critical: 'bg-rose-50 text-rose-700 border-rose-200',
    high: 'bg-amber-50 text-amber-700 border-amber-200',
    normal: 'bg-blue-50 text-blue-700 border-blue-200',
    low: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <div 
      id="context-analysis-panel"
      className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden transition-all"
    >
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-4 py-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-100/60 select-none transition-colors"
      >
        <div className="flex items-center space-x-2.5">
          <div className="w-6 h-6 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Lightbulb className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
            Context Intelligence & Intent Analysis
          </h3>
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${urgencyColors[analysis.detectedUrgency] || urgencyColors.normal}`}>
            {analysis.detectedUrgency.toUpperCase()} URGENCY
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Tone: <strong className="text-slate-700">{analysis.detectedTone}</strong>
          </span>
          <button
            id="toggle-analysis-card"
            type="button"
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-3.5 text-xs text-slate-600">
          {/* Metadata Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
            <div>
              <span className="text-slate-400 font-medium">Sender: </span>
              <span className="text-slate-800 font-medium truncate">{analysis.detectedSender || 'Unknown'}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Inferred Subject: </span>
              <span className="text-slate-800 font-medium truncate">{analysis.detectedSubject || 'Follow-up'}</span>
            </div>
          </div>

          {/* Strategic Advice */}
          {analysis.strategicAdvice && (
            <div className="flex items-start space-x-2.5 p-2.5 bg-indigo-50/50 rounded-lg border border-indigo-100/80 text-indigo-950">
              <Shield className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-semibold text-indigo-900 block mb-0.5">Strategic Advice:</span>
                {analysis.strategicAdvice}
              </div>
            </div>
          )}

          {/* Core Questions that Must be Addressed */}
          {analysis.coreQuestions && analysis.coreQuestions.length > 0 && (
            <div>
              <h4 className="font-semibold text-slate-700 flex items-center mb-1.5 text-[11px] uppercase tracking-wide">
                <HelpCircle className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
                Explicit Questions to Answer ({analysis.coreQuestions.length})
              </h4>
              <ul className="space-y-1 pl-1">
                {analysis.coreQuestions.map((q, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Items / Deliverables */}
          {analysis.actionItems && analysis.actionItems.length > 0 && (
            <div>
              <h4 className="font-semibold text-slate-700 flex items-center mb-1.5 text-[11px] uppercase tracking-wide">
                <CheckSquare className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
                Commitments & Deadlines Mentioned
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {analysis.actionItems.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
