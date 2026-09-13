export type ReplyIntent = 
  | 'confirm' 
  | 'decline' 
  | 'clarify' 
  | 'reschedule' 
  | 'update' 
  | 'executive' 
  | 'custom';

export type ToneStyle = 
  | 'executive' 
  | 'formal' 
  | 'warm' 
  | 'assertive' 
  | 'brevity';

export type LengthStyle = 
  | 'short' 
  | 'medium' 
  | 'bullets';

export interface SenderPersona {
  name: string;
  title: string;
  company: string;
  signature?: string;
}

export interface EmailAnalysis {
  detectedSender: string;
  detectedRecipient: string;
  detectedSubject: string;
  detectedUrgency: 'low' | 'normal' | 'high' | 'critical';
  detectedTone: string;
  coreQuestions: string[];
  actionItems: string[];
  strategicAdvice: string;
}

export interface DraftResponse {
  id: string;
  title: string;
  subject: string;
  body: string;
  rationale: string;
  keyStrength: string;
  wordCount: number;
  readTimeSeconds: number;
  tags?: string[];
}

export interface GenerateReplyRequest {
  emailContent: string;
  subject?: string;
  sender?: string;
  intent: ReplyIntent;
  customKeyPoints?: string;
  tone: ToneStyle;
  length: LengthStyle;
  persona?: SenderPersona;
}

export interface GenerateReplyResponse {
  analysis: EmailAnalysis;
  drafts: DraftResponse[];
}

export interface RefineReplyRequest {
  originalEmail: string;
  currentDraft: DraftResponse;
  instruction: string;
  tone?: ToneStyle;
  length?: LengthStyle;
}

export interface RefineReplyResponse {
  draft: DraftResponse;
  changesSummary: string;
}

export interface EmailTemplate {
  id: string;
  category: string;
  title: string;
  sender: string;
  subject: string;
  content: string;
  suggestedIntent: ReplyIntent;
  suggestedTone: ToneStyle;
  suggestedPoints: string;
  initialDrafts?: DraftResponse[];
  initialAnalysis?: EmailAnalysis;
}
