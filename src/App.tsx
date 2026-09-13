/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { EmailInputPanel } from './components/EmailInputPanel';
import { DraftWorkbench } from './components/DraftWorkbench';
import { ContextAnalysisCard } from './components/ContextAnalysisCard';
import { PersonaModal } from './components/PersonaModal';
import { GuideModal } from './components/GuideModal';
import { 
  ReplyIntent, 
  ToneStyle, 
  LengthStyle, 
  SenderPersona, 
  EmailAnalysis, 
  DraftResponse,
  EmailTemplate 
} from './types';
import { SAMPLE_EMAILS } from './data/sampleEmails';
import { AlertCircle, CheckCircle2, Sparkles, X } from 'lucide-react';

const DEFAULT_PERSONA: SenderPersona = {
  name: 'Alex Morgan',
  title: 'Operations Director',
  company: 'Vanguard Systems',
  signature: 'Best regards,\nAlex Morgan | Vanguard Systems',
};

export default function App() {
  // State
  const [emailContent, setEmailContent] = useState<string>(SAMPLE_EMAILS[0].content);
  const [intent, setIntent] = useState<ReplyIntent>('reschedule');
  const [tone, setTone] = useState<ToneStyle>('assertive');
  const [length, setLength] = useState<LengthStyle>('short');
  const [customKeyPoints, setCustomKeyPoints] = useState<string>(SAMPLE_EMAILS[0].suggestedPoints);
  
  const [persona, setPersona] = useState<SenderPersona>(() => {
    try {
      const saved = localStorage.getItem('user_sender_persona');
      return saved ? JSON.parse(saved) : DEFAULT_PERSONA;
    } catch {
      return DEFAULT_PERSONA;
    }
  });

  const [isPersonaModalOpen, setIsPersonaModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  
  const [analysis, setAnalysis] = useState<EmailAnalysis | null>(SAMPLE_EMAILS[0].initialAnalysis || null);
  const [drafts, setDrafts] = useState<DraftResponse[]>(SAMPLE_EMAILS[0].initialDrafts || []);
  const [activeDraftIndex, setActiveDraftIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const extractErrorMessage = (err: any): string => {
    if (!err) return 'An unexpected error occurred.';
    const raw = typeof err === 'string' ? err : err.message || '';
    try {
      const parsed = JSON.parse(raw);
      if (parsed.error?.message) return parsed.error.message;
      if (parsed.message) return parsed.message;
    } catch {}
    if (raw.includes('quota') || raw.includes('429')) {
      return 'AI model quota temporarily reached. Please wait a few moments or use the instant smart drafts.';
    }
    if (raw.includes('503') || raw.includes('high demand')) {
      return 'Gemini AI is experiencing high demand. Using smart executive draft engine.';
    }
    return raw || 'Unable to complete request. Please try again.';
  };

  // Persist persona
  const handleSavePersona = (updated: SenderPersona) => {
    setPersona(updated);
    try {
      localStorage.setItem('user_sender_persona', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to persist persona in localStorage', e);
    }
    setSuccessNotice('Sender profile updated.');
    setTimeout(() => setSuccessNotice(null), 3000);
  };

  // Load a scenario template
  const handleLoadTemplate = (tpl: EmailTemplate) => {
    setEmailContent(tpl.content);
    setIntent(tpl.suggestedIntent);
    setTone(tpl.suggestedTone);
    setCustomKeyPoints(tpl.suggestedPoints);
    if (tpl.initialDrafts && tpl.initialDrafts.length > 0) {
      setDrafts(tpl.initialDrafts);
      setAnalysis(tpl.initialAnalysis || null);
      setActiveDraftIndex(0);
    } else {
      setDrafts([]);
      setAnalysis(null);
    }
    setErrorMessage(null);
  };

  // Generate replies via Gemini backend
  const handleGenerateReplies = async () => {
    if (!emailContent.trim()) return;

    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/generate-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailContent,
          intent,
          tone,
          length,
          customKeyPoints,
          persona,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with status ${response.status}`);
      }

      const data = await response.json();
      setAnalysis(data.analysis || null);
      setDrafts(data.drafts || []);
      setActiveDraftIndex(0);
      setSuccessNotice('Drafts ready.');
      setTimeout(() => setSuccessNotice(null), 3000);
    } catch (err: any) {
      console.error('Error generating replies:', err);
      setErrorMessage(extractErrorMessage(err));
    } finally {
      setIsGenerating(false);
    }
  };

  // Refine an existing draft via Gemini backend
  const handleRefineDraft = async (instruction: string) => {
    if (!drafts[activeDraftIndex] || !instruction.trim()) return;

    setIsRefining(true);
    setErrorMessage(null);

    try {
      const current = drafts[activeDraftIndex];
      const response = await fetch('/api/refine-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalEmail: emailContent,
          currentDraft: current,
          instruction,
          tone,
          length,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Refine failed with status ${response.status}`);
      }

      const data = await response.json();
      const updatedDrafts = [...drafts];
      updatedDrafts[activeDraftIndex] = data.draft;
      setDrafts(updatedDrafts);
      setSuccessNotice(data.changesSummary || 'Draft refined successfully.');
      setTimeout(() => setSuccessNotice(null), 3500);
    } catch (err: any) {
      console.error('Error refining draft:', err);
      setErrorMessage(extractErrorMessage(err));
    } finally {
      setIsRefining(false);
    }
  };

  // Direct manual edits on draft body and subject
  const handleUpdateDraftBody = (draftId: string, newBody: string, newSubject: string) => {
    setDrafts((prev) =>
      prev.map((d) => {
        if (d.id === draftId) {
          const words = newBody.trim().split(/\s+/).filter(Boolean).length;
          return {
            ...d,
            body: newBody,
            subject: newSubject,
            wordCount: words,
            readTimeSeconds: Math.max(5, Math.ceil((words / 220) * 60)),
          };
        }
        return d;
      })
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Navbar Header */}
      <Header
        persona={persona}
        onOpenPersonaModal={() => setIsPersonaModalOpen(true)}
        onOpenGuideModal={() => setIsGuideModalOpen(true)}
      />

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Toast / Notification Banner */}
        {errorMessage && (
          <div 
            id="error-banner"
            className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs sm:text-sm text-rose-800 flex items-start justify-between shadow-2xs"
          >
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-rose-600 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {successNotice && (
          <div 
            id="success-banner"
            className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between shadow-2xs animate-in fade-in"
          >
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium">{successNotice}</span>
            </div>
            <button
              onClick={() => setSuccessNotice(null)}
              className="text-emerald-500 hover:text-emerald-700 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* 2-Column Responsive Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Context Input & Intent Config */}
          <div className="lg:col-span-5 space-y-4">
            <EmailInputPanel
              emailContent={emailContent}
              onEmailContentChange={setEmailContent}
              intent={intent}
              onIntentChange={setIntent}
              tone={tone}
              onToneChange={setTone}
              length={length}
              onLengthChange={setLength}
              customKeyPoints={customKeyPoints}
              onCustomKeyPointsChange={setCustomKeyPoints}
              onGenerateReplies={handleGenerateReplies}
              isGenerating={isGenerating}
              onLoadTemplate={handleLoadTemplate}
            />

            {/* Context Intelligence Card */}
            <ContextAnalysisCard
              analysis={analysis}
              isLoading={isGenerating}
            />
          </div>

          {/* Right Column: Draft Workbench & Gmail Actions */}
          <div className="lg:col-span-7 sticky top-20">
            <DraftWorkbench
              drafts={drafts}
              activeDraftIndex={activeDraftIndex}
              onSelectDraftIndex={setActiveDraftIndex}
              analysis={analysis}
              onUpdateDraftBody={handleUpdateDraftBody}
              onRefineDraft={handleRefineDraft}
              isRefining={isRefining}
            />
          </div>
        </div>
      </main>

      {/* Sender Persona Modal */}
      <PersonaModal
        isOpen={isPersonaModalOpen}
        onClose={() => setIsPersonaModalOpen(false)}
        persona={persona}
        onSave={handleSavePersona}
      />

      {/* Executive Guidelines Modal */}
      <GuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />
    </div>
  );
}
