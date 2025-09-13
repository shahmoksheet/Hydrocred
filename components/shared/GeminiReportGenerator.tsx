
import React, { useState } from 'react';
import { SparklesIcon } from './icons/Icons';
import Spinner from './Spinner';

interface GeminiReportGeneratorProps {
    title: string;
    description: string;
    placeholder: string;
    buttonText: string;
    onGenerate: (query: string) => Promise<string>;
}

const GeminiReportGenerator: React.FC<GeminiReportGeneratorProps> = ({
    title,
    description,
    placeholder,
    buttonText,
    onGenerate
}) => {
  const [query, setQuery] = useState('');
  const [report, setReport] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Use a different handler name to avoid conflict
  const handleGenerateClick = async () => {
    // For single-button reports, we can ignore the query if not needed
    // or use a default value.
    setIsLoading(true);
    setError('');
    setReport('');
    try {
      const result = await onGenerate(query);
      setReport(result);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(errorMessage);
      setReport(`Failed to generate report: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const isQueryBased = placeholder; // Determine if the textarea should be shown

  return (
    <div className="bg-slate-900 p-6 rounded-lg border border-slate-800 transition-all hover:border-cyan-500/30">
      <div className="flex items-center mb-2">
        <SparklesIcon className="w-6 h-6 text-cyan-400 mr-3" />
        <h3 className="text-xl font-semibold text-slate-100">{title}</h3>
      </div>
      <p className="text-slate-400 text-sm mb-4">{description}</p>
      
      <div className="space-y-4">
        {isQueryBased && (
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg h-24 focus:ring-cyan-500 focus:border-cyan-500 text-slate-200 placeholder-slate-500 transition-colors"
              rows={3}
            />
        )}
        <button
          onClick={handleGenerateClick}
          disabled={isLoading || (isQueryBased && !query.trim())}
          className="w-full flex justify-center items-center bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold py-2 px-4 rounded-lg hover:from-cyan-600 hover:to-teal-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
        >
          {isLoading ? <><Spinner className="mr-2" /> Analyzing...</> : buttonText}
        </button>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        {report && (
          <div className="mt-4 p-4 bg-slate-950 border border-slate-800 rounded-lg">
            <h4 className="font-semibold mb-2 text-slate-200">Analysis Report:</h4>
            <div 
              className="prose prose-sm prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: report.replace(/\n/g, '<br />').replace(/\\n/g, '<br />') }} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GeminiReportGenerator;
