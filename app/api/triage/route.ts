import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { processTriage } from '@/lib/triage';

const RequestSchema = z.object({
  message: z.string().min(1, 'Symptom description is required'),
  model: z.string().optional(),
  location: z.object({
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    address: z.string().optional()
  }).optional(),
  conversationHistory: z.array(z.any()).optional()
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = RequestSchema.parse(body);

    const triageResult = await processTriage(validated);
    return NextResponse.json(triageResult, { status: 200 });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    if (error?.message?.startsWith('OLLAMA_UNAVAILABLE')) {
      return NextResponse.json(
        { 
          error: 'Ollama Service Unavailable', 
          message: 'Ollama is not running on http://localhost:11434. Please start Ollama by running "ollama run gemma4" in your terminal.' 
        },
        { status: 503 }
      );
    }

    console.error('[API /api/triage] Triage execution failed:', error);
    return NextResponse.json(
      { error: error?.message || 'An internal error occurred during health triage reasoning.' },
      { status: 500 }
    );
  }
}
