'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useNowSpeak } from '@/hooks/useNowSpeak';
import { useVoiceInput } from '@/hooks/useVoiceInput';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/lib/api';

const QUICK_PROMPTS = [
  "I have a fever 🤒",
  "Need coffee ☕",
  "Party supplies 🎉",
  "Running low on milk 🥛",
];

interface Props {
  readonly onProductSelect?: (product: Product) => void;
}

export function NowSpeak({ onProductSelect }: readonly Props) {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { messages, isStreaming, sendMessage } = useNowSpeak();

  // Voice → same sendMessage pipeline
  const handleVoiceResult = (transcript: string) => {
    sendMessage(transcript);
  };

  const { isListening, startListening, stopListening, isSupported } =
    useVoiceInput(handleVoiceResult);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText.trim());
    setInputText('');
  };

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* ── Messages ─────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">🎙️</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">What do you need?</h2>
            <p className="text-gray-500 text-sm max-w-xs">
              Speak or type your urgent need — I'll find it and get it to you in 30 minutes.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              {QUICK_PROMPTS.map(prompt => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="text-sm bg-white border border-gray-200 hover:border-blue-300 hover:text-blue-700 text-gray-700 px-4 py-2 rounded-full transition-colors shadow-sm"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-[88%]">
              {msg.role === 'user' ? (
                <div className="bg-blue-600 text-white px-4 py-3 rounded-2xl rounded-tr-sm text-sm leading-relaxed">
                  {msg.text}
                </div>
              ) : (
                <div className="space-y-3">
                  {(msg.text || (isStreaming && i === messages.length - 1)) && (
                    <div className="bg-white border border-gray-100 shadow-sm px-4 py-3 rounded-2xl rounded-tl-sm text-sm text-gray-800 leading-relaxed">
                      {msg.text}
                      {isStreaming && i === messages.length - 1 && (
                        <span className="inline-block w-1.5 h-4 bg-blue-400 ml-1 animate-pulse rounded-sm align-middle" />
                      )}
                    </div>
                  )}
                  {msg.products && msg.products.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {msg.products.map(p => (
                        <ProductCard
                          key={p.id}
                          product={p}
                          onAddToCart={onProductSelect}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Input bar ────────────────────────────────────────────────────── */}
      <div className="border-t border-gray-100 bg-white px-4 py-3 safe-area-bottom">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder={isListening ? '🎤 Listening...' : 'What do you need urgently?'}
            disabled={isStreaming || isListening}
            className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder:text-gray-400 disabled:opacity-60"
          />

          {isSupported && (
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              disabled={isStreaming}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all disabled:opacity-40 ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              <span className="text-xl">{isListening ? '⏹' : '🎤'}</span>
            </button>
          )}

          <button
            type="submit"
            disabled={!inputText.trim() || isStreaming}
            className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center disabled:opacity-40 hover:bg-blue-700 active:scale-95 transition-all"
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={2.5}>
              <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
