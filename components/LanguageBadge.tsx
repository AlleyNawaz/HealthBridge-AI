'use client';

import React from 'react';
import { Globe } from 'lucide-react';

interface LanguageBadgeProps {
  language: string;
}

const LANGUAGE_FLAGS: Record<string, string> = {
  English: '🇬🇧',
  Hindi: '🇮🇳',
  Urdu: '🇵🇰',
  Punjabi: '🇮🇳',
  Bengali: '🇧🇩',
  Tamil: '🇮🇳',
  Spanish: '🇪🇸',
  French: '🇫🇷',
  Arabic: '🇸🇦',
  German: '🇩🇪',
};

export const LanguageBadge: React.FC<LanguageBadgeProps> = ({ language }) => {
  const flag = LANGUAGE_FLAGS[language] || '🌐';

  return (
    <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 text-xs sm:text-sm font-semibold shadow-xs">
      <Globe className="w-4 h-4 text-blue-600" />
      <span>Detected Language:</span>
      <span className="bg-blue-100 text-blue-900 px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
        <span>{flag}</span>
        <span>{language}</span>
      </span>
    </div>
  );
};
