'use client';

import { useState } from 'react';
import { Send, Lightbulb } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  placeholder?: string;
  suggestions?: string[];
  disabled?: boolean;
}

export function ChatInput({ 
  onSend, 
  placeholder = "Type your message...",
  suggestions = [],
  disabled = false
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="space-y-2">
      {showSuggestions && suggestions.length > 0 && (
        <div className="bg-surface rounded-md border border-gray-200 p-2 space-y-1">
          <div className="flex items-center gap-2 text-xs text-text-secondary mb-2">
            <Lightbulb className="w-3 h-3" />
            <span>Conversation starters:</span>
          </div>
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full text-left text-sm p-2 rounded hover:bg-gray-50 transition-colors duration-200"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          {suggestions.length > 0 && (
            <button
              type="button"
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-text-secondary hover:text-text-primary transition-colors duration-200"
            >
              <Lightbulb className="w-4 h-4" />
            </button>
          )}
        </div>
        
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className="btn-primary px-3"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
