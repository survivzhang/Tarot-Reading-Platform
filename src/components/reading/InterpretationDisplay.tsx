'use client';

import { marked } from 'marked';

interface InterpretationDisplayProps {
  interpretation: string;
  className?: string;
}

export default function InterpretationDisplay({ interpretation, className = '' }: InterpretationDisplayProps) {
  // Convert markdown to HTML
  const htmlContent = marked(interpretation);

  return (
    <div className={`bg-white rounded-lg shadow-md p-8 ${className}`}>
      <div className="prose prose-lg max-w-none">
        <div
          className="text-gray-800 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </div>
  );
}
