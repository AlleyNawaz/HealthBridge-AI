import fs from 'fs';
import path from 'path';

export interface DocumentChunk {
  id: string;
  sourceFile: string;
  title: string;
  content: string;
  keywords: string[];
}

export interface SearchResult {
  chunk: DocumentChunk;
  score: number;
}

let cachedChunks: DocumentChunk[] | null = null;

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2);
}

export function loadAndChunkDocs(): DocumentChunk[] {
  if (cachedChunks) return cachedChunks;

  const docsDir = path.join(process.cwd(), 'docs');
  const chunks: DocumentChunk[] = [];

  if (!fs.existsSync(docsDir)) {
    return chunks;
  }

  const files = fs.readdirSync(docsDir).filter(f => f.endsWith('.md'));

  let chunkIdCounter = 1;

  for (const file of files) {
    const filePath = path.join(docsDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');

    // Split content by header sections (## or #)
    const sections = content.split(/(?=\n##?\s+)/);

    for (const sec of sections) {
      const trimmed = sec.trim();
      if (!trimmed) continue;

      const lines = trimmed.split('\n');
      const titleLine = lines[0].replace(/^#+\s*/, '').trim();
      const body = lines.slice(1).join('\n').trim() || trimmed;

      chunks.push({
        id: `chunk-${chunkIdCounter++}`,
        sourceFile: file,
        title: titleLine || file,
        content: body,
        keywords: tokenize(trimmed)
      });
    }
  }

  cachedChunks = chunks;
  return chunks;
}

export function searchVectorStore(userQuery: string, topK: number = 5): SearchResult[] {
  const chunks = loadAndChunkDocs();
  if (chunks.length === 0) return [];

  const queryTokens = tokenize(userQuery);
  if (queryTokens.length === 0) return [];

  // Compute TF-IDF / term overlap cosine similarity score
  const scoredResults = chunks.map(chunk => {
    let score = 0;
    const chunkTokens = chunk.keywords;
    
    // Frequency map
    const freqMap: Record<string, number> = {};
    for (const t of chunkTokens) {
      freqMap[t] = (freqMap[t] || 0) + 1;
    }

    for (const qt of queryTokens) {
      if (freqMap[qt]) {
        // Boost score for specific clinical markers
        score += freqMap[qt] * 2.5;
      }
    }

    // Bonus for phrase match
    if (chunk.content.toLowerCase().includes(userQuery.toLowerCase())) {
      score += 5;
    }

    return { chunk, score };
  });

  // Sort descending by score
  scoredResults.sort((a, b) => b.score - a.score);

  // Return top K non-zero score chunks, or top 3 default chunks if query tokens are broad
  const filtered = scoredResults.filter(r => r.score > 0);
  if (filtered.length === 0) {
    return scoredResults.slice(0, Math.min(topK, scoredResults.length));
  }

  return filtered.slice(0, topK);
}
