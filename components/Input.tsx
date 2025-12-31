import React, { useRef, useState } from 'react';
import { Question } from '../types';

interface QuestionInputProps {
  question: Question;
  value: string;
  comment: string;
  onChange: (value: string) => void;
  onCommentChange: (value: string) => void;
  onEnter?: () => void;
  onAiAssist?: () => Promise<string[]>;
}

export const QuestionInput: React.FC<QuestionInputProps> = ({ question, value, comment, onChange, onCommentChange, onEnter, onAiAssist }) => {
  const [dragActive, setDragActive] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAiClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!onAiAssist) return;

    setIsGenerating(true);
    setSuggestions([]);
    try {
      const names = await onAiAssist();
      setSuggestions(names);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const CommentInput = () => (
    <div className="mt-6 w-full animate-fade-in" style={{ animationDelay: '100ms' }}>
      <textarea
        className="w-full bg-transparent border-b border-slate-200 dark:border-slate-800 py-3 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:border-slate-900 dark:focus:border-white outline-none transition-colors resize-none font-sans"
        placeholder="Add context or nuance (optional)..."
        rows={1}
        value={comment}
        onChange={(e) => {
          onCommentChange(e.target.value);
          e.target.style.height = 'auto';
          e.target.style.height = e.target.scrollHeight + 'px';
        }}
        onKeyDown={(e) => {
          // Allow Cmd+Enter in comment too if needed, but usually main input handles it. 
          // We'll let global listener handle comment field Cmd+Enter unless we want to stop it here.
          // Leaving as is allows global listener to catch Cmd+Enter here.
        }}
      />
    </div>
  );

  // --- Visual Card Layout ---
  if (question.type === 'card') {
    return (
      <div className="w-full animate-fade-in-up max-w-5xl mx-auto">
        <h3 className="text-2xl md:text-4xl font-serif text-slate-900 dark:text-white mb-2 text-center">{question.text}</h3>
        {question.helperText && <p className="text-slate-500 dark:text-slate-400 mb-8 text-center text-sm md:text-base">{question.helperText}</p>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {question.options?.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
              }}
              className={`relative h-48 md:h-56 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center p-6 gap-3 group ${value === option.value
                ? 'border-slate-900 bg-slate-50 dark:border-white dark:bg-slate-800'
                : 'border-slate-100 bg-white dark:bg-slate-900 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                }`}
            >
              {/* Visual Preview */}
              <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mb-2 shadow-inner border border-black/5 ${option.meta && option.meta.startsWith('bg-')
                ? option.meta
                : 'bg-slate-100'
                }`}>
                {option.meta && option.meta.startsWith('font-') && (
                  <span className={`${option.meta} text-slate-900`}>Aa</span>
                )}
              </div>

              <div className="text-center">
                <span className={`block text-base md:text-lg font-bold text-slate-900 dark:text-white mb-0.5`}>
                  {option.label}
                </span>
                {option.subLabel && (
                  <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                    {option.subLabel}
                  </span>
                )}
              </div>

              {value === option.value && (
                <div className="absolute top-4 right-4 text-slate-900 dark:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
              )}
            </button>
          ))}
        </div>
        <div className="max-w-xl mx-auto">
          <CommentInput />
        </div>
      </div>
    );
  }

  // --- File Upload Layout ---
  if (question.type === 'file') {
    const handleDrag = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        onChange(`File uploaded: ${e.dataTransfer.files[0].name}`);
      }
    };

    return (
      <div className="w-full animate-fade-in-up max-w-2xl mx-auto text-center">
        <h3 className="text-2xl md:text-4xl font-serif text-slate-900 dark:text-white mb-2">{question.text}</h3>
        {question.helperText && <p className="text-slate-500 mb-8 text-sm md:text-base">{question.helperText}</p>}

        <div
          className={`w-full h-48 md:h-56 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${dragActive
            ? 'border-slate-900 bg-slate-50 dark:border-white dark:bg-slate-800'
            : value
              ? 'border-green-500 bg-green-50 dark:border-green-400 dark:bg-green-900/20'
              : 'border-slate-300 bg-white dark:bg-slate-900 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/20'
            }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => onChange("User selected a logo file manually.")}
        >
          {value ? (
            <div className="text-center animate-fade-in">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <p className="text-slate-900 font-medium">File Attached</p>
            </div>
          ) : (
            <div className="text-center pointer-events-none">
              <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
              </div>
              <p className="text-slate-900 font-medium">Drop your logo here</p>
            </div>
          )}
        </div>
        <div className="max-w-xl mx-auto">
          <CommentInput />
        </div>
      </div>
    );
  }

  // --- Standard Layout (Text or Select) ---
  return (
    <div className="w-full animate-fade-in-up max-w-2xl mx-auto">
      <h3 className="text-2xl md:text-4xl font-serif text-slate-900 dark:text-white mb-2 leading-snug tracking-tight text-center">
        {question.text}
      </h3>

      {question.helperText && (
        <p className="text-slate-500 dark:text-slate-400 mb-8 text-base md:text-lg text-center">{question.helperText}</p>
      )}

      {/* Options Grid */}
      {question.options && question.options.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 mb-4">
          {question.options.map((option) => (
            <button
              key={option.value}
              onClick={() => onChange(option.value)}
              className={`text-left px-5 py-3 md:px-6 md:py-4 rounded-xl transition-all duration-200 border flex items-center justify-between group ${value === option.value
                ? 'bg-slate-900 border-slate-900 text-white dark:bg-slate-100 dark:border-white dark:text-black'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-slate-400 dark:hover:border-white/20 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              <div>
                <span className={`block text-sm md:text-base font-semibold ${value === option.value ? 'text-white dark:text-black' : 'text-slate-900 dark:text-white'}`}>
                  {option.label}
                </span>
                {option.subLabel && (
                  <span className={`text-xs uppercase tracking-wider font-medium mt-1 block ${value === option.value ? 'text-slate-400' : 'text-slate-400'}`}>
                    {option.subLabel}
                  </span>
                )}
              </div>
              {value === option.value && (
                <div className="animate-fade-in">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
              )}
            </button>
          ))}
        </div>
      ) : (
        // Text Input
        <div className="relative">
          <textarea
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl p-6 text-slate-900 dark:text-white placeholder-slate-300 dark:placeholder-slate-600 focus:border-slate-900 dark:focus:border-white focus:ring-1 focus:ring-slate-900 dark:focus:ring-white outline-none transition-all resize-none min-h-[160px] text-lg md:text-xl shadow-sm leading-relaxed"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (onEnter && (
                (e.key === 'Enter' && !e.shiftKey) ||
                (e.key === 'Enter' && (e.metaKey || e.ctrlKey))
              )) {
                e.preventDefault();
                e.stopPropagation();
                onEnter();
              }
            }}
            placeholder="Type your answer here..."
          />
          <div className="absolute bottom-4 right-4 text-xs text-slate-300 font-mono pointer-events-none">
            SHIFT + ENTER for new line
          </div>
        </div>
      )}

      {/* AI Assist Section */}
      {onAiAssist && (
        <div className="mt-4 animate-fade-in">
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={handleAiClick}
              disabled={isGenerating}
              className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors border border-slate-200 hover:border-indigo-200 bg-white px-4 py-2 rounded-full flex items-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="w-3 h-3 border-2 border-slate-400 border-t-indigo-600 rounded-full animate-spin"></div>
                  <span>Dreaming...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>
                  <span>Generate Ideas</span>
                </>
              )}
            </button>
            {suggestions.length > 0 && <span className="text-xs text-slate-400">Click to select</span>}
          </div>

          {suggestions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {suggestions.map((name) => (
                <button
                  key={name}
                  onClick={() => onChange(name)}
                  className="px-4 py-2 bg-white border border-slate-200 hover:border-slate-900 hover:bg-slate-50 rounded-lg text-sm text-slate-700 font-medium transition-all"
                >
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Optional Context Field for standard questions too */}
      <CommentInput />
    </div>
  );
};