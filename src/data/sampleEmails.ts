import { EmailTemplate } from '../types';

export const SAMPLE_EMAILS: EmailTemplate[] = [
  {
    id: 'sample-client-budget',
    category: 'Client & Sales',
    title: 'Client Requesting Discount & Scope Expansion',
    sender: 'Marcus Vance <m.vance@vanceholdings.com>',
    subject: 'Follow-up on Q3 Platform Migration Proposal',
    content: `Hi team,

We reviewed the proposed $45,000 budget and 8-week timeline for the Q3 migration. While we are excited to partner, our internal finance committee has capped our budget at $35,000 for this phase.

Additionally, we would like to confirm if custom SSO integration with Okta and weekend cutover support are already included in this price.

Can you accommodate the $35k figure without dropping the core data migration? If so, we are ready to sign before Friday.

Best,
Marcus Vance
VP of Technology, Vance Holdings`,
    suggestedIntent: 'reschedule',
    suggestedTone: 'assertive',
    suggestedPoints: 'Budget cannot be discounted to $35k for the full scope; propose phasing Okta SSO into Phase 2 to meet the $35k cap, or keep full scope at $45k with weekend support included. Offer a 15-min call Wednesday 2pm.',
    initialAnalysis: {
      detectedSender: 'Marcus Vance <m.vance@vanceholdings.com>',
      detectedRecipient: 'Team / Alex Morgan',
      detectedSubject: 'Re: Follow-up on Q3 Platform Migration Proposal',
      detectedUrgency: 'high',
      detectedTone: 'Assertive, budget-conscious, deadline-driven',
      coreQuestions: [
        'Can you accommodate the $35,000 budget without dropping core data migration?',
        'Are Okta SSO and weekend cutover support included in the proposed scope?'
      ],
      actionItems: [
        'Sign agreement before Friday if terms align',
        'Clarify SSO and cutover coverage'
      ],
      strategicAdvice: 'Protect margins and scope boundaries. Offer a phased approach: core migration at $35k, deferring SSO/weekend cutover to Phase 2, or keep full scope at $45k with bundled perks.'
    },
    initialDrafts: [
      {
        id: 'draft-1',
        title: 'Crisp & Direct (BLUF)',
        subject: 'Re: Follow-up on Q3 Platform Migration Proposal - Scope & Phasing Options',
        body: `Hi Marcus,

To hit your $35,000 cap before Friday, we can execute the core platform and data migration now, while moving the Okta SSO integration into Phase 2. 

If weekend cutover support and Okta SSO remain essential for Day 1, our fixed investment is $45,000 to ensure dedicated senior engineering coverage.

Are you available for a brief 15-minute sync Wednesday at 2:00 PM EST to finalize whichever path suits your committee best?

Best regards,
Alex Morgan`,
        rationale: 'Leads with the solution in sentence 1, sets clear financial boundaries without saying "no", and drives a 15-minute closing call.',
        keyStrength: 'Firm pricing boundary with actionable phased compromise',
        wordCount: 78,
        readTimeSeconds: 21,
      },
      {
        id: 'draft-2',
        title: 'Diplomatic & Thorough',
        subject: 'Re: Q3 Platform Migration Proposal - Scope & Budget Alignment',
        body: `Hi Marcus,

Thank you for the update. We are eager to partner with Vance Holdings on this migration and have structured two options to accommodate your finance committee's parameters:

Option A ($35,000 Cap):
• Complete core data migration and platform infrastructure
• Standard weekday cutover window
• Phase 2: Okta custom SSO deferred to Q4

Option B ($45,000 Full Scope):
• Full data migration + custom Okta SSO integration
• Dedicated 24/7 weekend cutover support and post-launch monitoring

Let's connect for 15 minutes this Wednesday at 2:00 PM EST to confirm your preference so we can issue the updated agreement before Friday.

Warm regards,
Alex Morgan`,
        rationale: 'Presents structured choices side-by-side, shifting negotiation from "discounting" to "scope selection".',
        keyStrength: 'Empowers client with clear trade-off choices',
        wordCount: 110,
        readTimeSeconds: 30,
      },
      {
        id: 'draft-3',
        title: 'Executive Strategic',
        subject: 'Re: Q3 Migration - Pricing & Scope Confirmation',
        body: `Marcus,

We can accommodate your $35k cap by delivering the core data migration now and scheduling Okta SSO for Phase 2. 

If your team requires SSO and weekend cutover at launch, the full package stands at $45k. 

I have held Wednesday at 2:00 PM EST for a quick call to lock in your preference and execute contracts ahead of Friday.

Alex`,
        rationale: 'Ultra-concise C-level brief. Zero fluff, direct contrast of options, and clear calendar slot.',
        keyStrength: 'High-velocity decision framing',
        wordCount: 66,
        readTimeSeconds: 18,
      }
    ]
  },
  {
    id: 'sample-exec-brief',
    category: 'Internal Leadership',
    title: 'Executive VP Asking for Urgent Project Status',
    sender: 'Claire Sterling <c.sterling@acmecorp.com>',
    subject: 'URGENT: Alpha Launch Readiness & Blocker Status',
    content: `Alex,

I am stepping into the CEO briefing in 45 minutes and need the ground truth on Project Alpha. 

1. Are we still on track for the September 30 release?
2. Did the payment gateway webhook issue get resolved?
3. What is our fallback plan if testing slips?

Give me the bottom line, no long essays please.

Claire`,
    suggestedIntent: 'executive',
    suggestedTone: 'executive',
    suggestedPoints: '1. Yes, green for Sept 30. 2. Gateway issue resolved and verified in staging this morning. 3. Fallback: 48-hr staging soak test with rollback automation ready.',
    initialAnalysis: {
      detectedSender: 'Claire Sterling <c.sterling@acmecorp.com>',
      detectedRecipient: 'Alex',
      detectedSubject: 'Re: URGENT: Alpha Launch Readiness & Blocker Status',
      detectedUrgency: 'critical',
      detectedTone: 'Urgent, direct, executive-level brevity',
      coreQuestions: [
        'Are we on track for Sept 30 release?',
        'Was the payment gateway webhook issue resolved?',
        'What is the fallback plan if testing slips?'
      ],
      actionItems: ['CEO briefing in 45 minutes'],
      strategicAdvice: 'Use bulleted BLUF format. State "Green" status first, answer all three questions directly without backstory.'
    },
    initialDrafts: [
      {
        id: 'draft-1',
        title: 'Crisp & Direct (BLUF)',
        subject: 'Re: URGENT: Alpha Launch Readiness - Green Status for CEO Briefing',
        body: `Claire,

Bottom line: Project Alpha is GREEN for September 30 release.

1. Timeline: On track for Sept 30 launch.
2. Webhook Issue: Resolved and verified in staging as of 8:30 AM today.
3. Fallback: 48-hour staging soak test with automated one-click rollback if any anomaly surfaces.

I am on standby if you need live numbers during the briefing.

Alex`,
        rationale: 'Answers all 3 questions in numbered order in under 60 words. Ideal for scanning right before stepping into a meeting.',
        keyStrength: 'Zero ambiguity, answers questions sequentially',
        wordCount: 61,
        readTimeSeconds: 17,
      },
      {
        id: 'draft-2',
        title: 'Executive Strategic',
        subject: 'Re: Alpha Launch Status: All Systems Go',
        body: `Claire,

Alpha is on schedule for Sept 30. The payment webhook fix passed staging validation this morning, and our automated rollback protocols are primed as fallback. 

You can confirm launch readiness with the CEO with confidence.

Alex`,
        rationale: 'Narrative executive summary in two tight sentences.',
        keyStrength: 'Reassuring executive confidence',
        wordCount: 42,
        readTimeSeconds: 12,
      },
      {
        id: 'draft-3',
        title: 'Mobile Brevity',
        subject: 'Re: Alpha Status: GREEN',
        body: `Claire,

Status: GREEN.
• Sept 30 launch on schedule.
• Payment webhook resolved & tested.
• Fallback: 48-hr staging soak with automated rollback ready.

Good luck with the briefing.

Alex`,
        rationale: 'Mobile-first bulleted layout readable on Apple Watch or smartphone in 5 seconds.',
        keyStrength: 'Ultra-high scannability',
        wordCount: 34,
        readTimeSeconds: 10,
      }
    ]
  },
  {
    id: 'sample-vendor-delay',
    category: 'Vendors & Partners',
    title: 'Vendor Pushing Back Deadline',
    sender: 'David Lin <david@logisticsplus.io>',
    subject: 'Shipment Schedule Update - Order #88219',
    content: `Hello,

Due to unexpected customs backlogs at port entry, the shipment for Order #88219 previously scheduled for delivery tomorrow (Tuesday) will be delayed until Friday afternoon.

We apologize for the inconvenience and will keep you updated as tracking clears.

Regards,
David Lin
Operations Lead`,
    suggestedIntent: 'clarify',
    suggestedTone: 'assertive',
    suggestedPoints: 'Delay causes critical production stoppage for Thursday client demo. Request immediate expedited air freight alternative at their cost, or provide tracking bill of lading by 12 PM today.',
    initialAnalysis: {
      detectedSender: 'David Lin <david@logisticsplus.io>',
      detectedRecipient: 'Operations / Alex',
      detectedSubject: 'Re: Shipment Schedule Update - Order #88219 - URGENT ACTION REQUIRED',
      detectedUrgency: 'high',
      detectedTone: 'Vendor delivery delay notification',
      coreQuestions: ['Can delivery be expedited prior to Friday?'],
      actionItems: ['Provide air freight option or customs release by 12 PM today'],
      strategicAdvice: 'Establish clear business impact immediately (Thursday demo). Demand proactive mitigation rather than passive updates.'
    },
    initialDrafts: [
      {
        id: 'draft-1',
        title: 'Assertive & Firm (BLUF)',
        subject: 'Re: Shipment Schedule Update - Order #88219 - Urgent Escalation',
        body: `Hi David,

A Friday delivery is unacceptable as this order is tied to a scheduled client demo on Thursday morning.

Please advise immediately by 12:00 PM today on:
1. Feasibility of splitting the shipment and putting critical components on priority air freight today.
2. Current customs entry numbers so our freight broker can assist with clearance.

We need an actionable resolution within the next 2 hours.

Best regards,
Alex Morgan`,
        rationale: 'States business impact immediately, establishes a noon deadline, and demands concrete options.',
        keyStrength: 'Decisive escalation without emotional confrontation',
        wordCount: 68,
        readTimeSeconds: 19,
      },
      {
        id: 'draft-2',
        title: 'Diplomatic & Thorough',
        subject: 'Re: Shipment Schedule Update - Order #88219 - Priority Mitigation Needed',
        body: `Hi David,

Thank you for notifying us. However, our manufacturing schedule cannot absorb a delay until Friday because of an executive milestone this Thursday.

Could you please explore expedited courier or air freight for the primary units at your earliest availability? Please share the customs entry details by 12:00 PM today so we can explore expedited clearance options together.

Appreciate your urgent attention to this.

Regards,
Alex Morgan`,
        rationale: 'Constructive partnership tone while holding firm to the noon deadline.',
        keyStrength: 'Collaborative problem solving under pressure',
        wordCount: 71,
        readTimeSeconds: 20,
      },
      {
        id: 'draft-3',
        title: 'Executive Strategic',
        subject: 'Re: Order #88219 - Delay Unacceptable / Air Freight Required',
        body: `David,

A Friday delivery halts our Thursday client rollout. We need an expedited air freight solution quoted and dispatched today.

Please send tracking numbers or a customs release update by 12:00 PM today.

Alex Morgan`,
        rationale: 'Direct, clear consequences, short reading time.',
        keyStrength: 'High urgency brevity',
        wordCount: 39,
        readTimeSeconds: 11,
      }
    ]
  },
  {
    id: 'sample-meeting-reschedule',
    category: 'Scheduling & Collaboration',
    title: 'Conflicting Meeting & Reschedule Request',
    sender: 'Sarah Jenkins <sjenkins@fintechpartners.org>',
    subject: 'Strategy Session - Tomorrow at 10:00 AM EST',
    content: `Hi Alex,

An emergency client escalation just landed on my plate for tomorrow morning at 10:00 AM EST. Would you mind if we pushed our quarterly strategy sync to later in the week?

Let me know what days work best for you. Looking forward to discussing the partnership roadmap.

Warmly,
Sarah`,
    suggestedIntent: 'reschedule',
    suggestedTone: 'warm',
    suggestedPoints: 'Accept reschedule with understanding. Propose Thursday at 11:00 AM EST or Friday at 2:00 PM EST.',
    initialAnalysis: {
      detectedSender: 'Sarah Jenkins <sjenkins@fintechpartners.org>',
      detectedRecipient: 'Alex',
      detectedSubject: 'Re: Strategy Session - Tomorrow at 10:00 AM EST',
      detectedUrgency: 'normal',
      detectedTone: 'Warm, respectful, apologetic',
      coreQuestions: ['Can we push the meeting to later in the week? What times work best?'],
      actionItems: ['Reschedule quarterly strategy sync'],
      strategicAdvice: 'Acknowledge the client escalation warmly. Provide two distinct time slots to eliminate back-and-forth scheduling ping-pong.'
    },
    initialDrafts: [
      {
        id: 'draft-1',
        title: 'Warm & Collaborative',
        subject: 'Re: Strategy Session - Reschedule Options for Later This Week',
        body: `Hi Sarah,

Completely understand—client escalations always take priority.

I would be glad to reschedule. Here are two windows that work well on my end:
• Thursday at 11:00 AM EST
• Friday at 2:00 PM EST

Let me know if either of those fits your calendar and I will send an updated invite.

Best,
Alex`,
        rationale: 'Gracious acknowledgment, zero friction, and two clear scheduling options with time zones.',
        keyStrength: 'Eliminates calendar ping-pong',
        wordCount: 56,
        readTimeSeconds: 15,
      },
      {
        id: 'draft-2',
        title: 'Crisp & Direct',
        subject: 'Re: Strategy Session - Reschedule to Thursday or Friday',
        body: `Hi Sarah,

No problem at all. I can do either Thursday at 11:00 AM EST or Friday at 2:00 PM EST. 

Reply with your preference and I will update our calendar invite.

Best regards,
Alex`,
        rationale: 'Quick, friendly, under 35 words.',
        keyStrength: 'Immediate scheduling resolution',
        wordCount: 35,
        readTimeSeconds: 10,
      },
      {
        id: 'draft-3',
        title: 'Executive Brief',
        subject: 'Re: Strategy Session Reschedule',
        body: `Sarah,

Understood. Let's move to Thursday at 11:00 AM EST. If that doesn't work, Friday at 2:00 PM EST is open.

Good luck with the client emergency.

Alex`,
        rationale: 'Fast decision that chooses a default slot while offering a backup.',
        keyStrength: 'Decisive calendar booking',
        wordCount: 29,
        readTimeSeconds: 8,
      }
    ]
  },
  {
    id: 'sample-job-negotiation',
    category: 'Career & HR',
    title: 'Candidate / Offer Follow-up',
    sender: 'Elena Rostova <elena.rostova@venturelabs.co>',
    subject: 'Offer Letter Details - Principal Solutions Architect',
    content: `Dear Alex,

We were thrilled with your interview rounds and would love to extend a formal offer for the Principal Solutions Architect position with a base salary of $175,000 + bonus.

We hope you can review the attached agreement and let us know your decision by Wednesday close of business.

Sincerely,
Elena Rostova
Head of People, VentureLabs`,
    suggestedIntent: 'confirm',
    suggestedTone: 'formal',
    suggestedPoints: 'Express deep gratitude for the offer. Request until Monday to review thoroughly with family, and ask for details regarding equity vesting and remote work stipend.',
    initialAnalysis: {
      detectedSender: 'Elena Rostova <elena.rostova@venturelabs.co>',
      detectedRecipient: 'Alex',
      detectedSubject: 'Re: Offer Letter Details - Principal Solutions Architect',
      detectedUrgency: 'normal',
      detectedTone: 'Formal, enthusiastic, deadline-oriented',
      coreQuestions: ['Can you confirm your decision by Wednesday close of business?'],
      actionItems: ['Review agreement and confirm acceptance/terms'],
      strategicAdvice: 'Show strong appreciation while politely asking for an extension until Monday and requesting clarification on equity vesting.'
    },
    initialDrafts: [
      {
        id: 'draft-1',
        title: 'Formal Business & Diplomatic',
        subject: 'Re: Offer Letter Details - Principal Solutions Architect - Alex Morgan',
        body: `Dear Elena,

Thank you very much for extending this offer. I am genuinely excited about the opportunity to join VentureLabs and lead the solutions architecture team.

In reviewing the agreement, I had two quick questions:
1. Could you share the specific vesting schedule and strike price for the equity package?
2. Does the compensation package include a remote office technology stipend?

To allow adequate time to review these details thoroughly, could we adjust the response deadline to next Monday, September 22?

Thank you again for this compelling offer, and I look forward to your thoughts.

Sincerely,
Alex Morgan`,
        rationale: 'Expresses enthusiasm upfront, asks pointed questions diplomatically, and requests reasonable extension.',
        keyStrength: 'Poised, professional negotiation stance',
        wordCount: 97,
        readTimeSeconds: 26,
      },
      {
        id: 'draft-2',
        title: 'Crisp & Direct',
        subject: 'Re: Offer Letter - Principal Solutions Architect',
        body: `Dear Elena,

Thank you for extending this offer—I am thrilled by the prospect of joining VentureLabs.

Before finalizing, could you clarify the equity vesting schedule and whether a remote setup stipend is provided? Additionally, would it be possible to extend the deadline to next Monday, September 22, to review the details?

Appreciate your help and look forward to speaking soon.

Best regards,
Alex Morgan`,
        rationale: 'Tight 70-word draft covering both inquiries and the deadline extension request.',
        keyStrength: 'Polite, concise inquiry',
        wordCount: 71,
        readTimeSeconds: 19,
      },
      {
        id: 'draft-3',
        title: 'Warm & Collaborative',
        subject: 'Re: Offer Letter - Principal Solutions Architect',
        body: `Hi Elena,

Thank you so much! It was a pleasure meeting the team, and I am very energized about the vision for VentureLabs.

I am reviewing the documentation now and would love clarification on the equity vesting schedule. Could we push the decision window to Monday so I can give this agreement the full attention it deserves?

Warmly,
Alex`,
        rationale: 'Warm, personable tone suitable for modern tech companies.',
        keyStrength: 'Enthusiastic and respectful',
        wordCount: 65,
        readTimeSeconds: 18,
      }
    ]
  }
];
