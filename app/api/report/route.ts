import { NextRequest, NextResponse } from 'next/server';
import { TriageResult } from '@/types/triage';

export async function POST(req: NextRequest) {
  try {
    const data: TriageResult = await req.json();

    const formattedReport = `
========================================================================
                      HEALTHBRIDGE AI TRIAGE REPORT
========================================================================
Timestamp        : ${data.timestamp}
Session ID       : ${data.id || 'N/A'}
Core AI Model    : ${data.model_used}
Detected Language: ${data.language}

------------------------------------------------------------------------
1. PARSED SYMPTOMS & CLINICAL SEVERITY
------------------------------------------------------------------------
Symptoms Extracted : ${data.symptoms.join(', ')}
Reported Duration  : ${data.duration}
Severity Score     : ${data.severity}
Urgency Level      : ${data.urgency}
Confidence Score   : ${(data.confidence * 100).toFixed(0)}%
Is Red-Flag Emergency: ${data.emergency ? 'YES (CRITICAL CARE REQUIRED)' : 'NO'}

------------------------------------------------------------------------
2. POTENTIAL EDUCATIONAL CAUSES (NON-DIAGNOSTIC)
------------------------------------------------------------------------
${data.possible_causes.map((c, i) => `${i + 1}. ${c}`).join('\n')}

------------------------------------------------------------------------
3. RECOMMENDED NEXT STEPS & TRIAGE CARE PLAN
------------------------------------------------------------------------
${data.next_steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

------------------------------------------------------------------------
4. EMERGENCY WARNING SIGNS
------------------------------------------------------------------------
${data.warning_signs.map((w, i) => `${i + 1}. ${w}`).join('\n')}

------------------------------------------------------------------------
5. RETRIEVED RAG EVIDENCE-BASED GUIDELINES
------------------------------------------------------------------------
${(data.rag_sources || []).map((r, i) => `[Source ${i + 1}: ${r.source} - ${r.title}]\n${r.content}`).join('\n\n')}

------------------------------------------------------------------------
6. MANDATORY CLINICAL DISCLAIMER
------------------------------------------------------------------------
${data.disclaimer}
========================================================================
`;

    return new NextResponse(formattedReport, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename="healthbridge_report_${Date.now()}.txt"`
      }
    });

  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to generate triage report' }, { status: 500 });
  }
}
