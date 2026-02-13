'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from '@/styles/components/chatPanel.module.css';
import { ChatMessage, GenerationResult } from '@/types';

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  hasCode: boolean;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  onSendMessage,
  isLoading,
  hasCode,
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '42px';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  const handleSubmit = () => {
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={styles.chatPanel}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          💬 AI Chat
        </div>
        <span className={styles.headerBadge}>
          {hasCode ? 'Modify Mode' : 'Generate Mode'}
        </span>
      </div>

      {/* Messages */}
      <div className={styles.messages}>
        {messages.length === 0 && !isLoading ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>✨</div>
            <div className={styles.emptyTitle}>Describe your UI</div>
            <div className={styles.emptyHint}>
              Tell me what UI you want to build. For example: &quot;Create a dashboard with a sidebar, stats cards, and a bar chart&quot;
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`${styles.message} ${msg.role === 'user' ? styles.messageUser : styles.messageAssistant}`}
              >
                <div className={styles.messageBubble}>
                  {msg.content}
                </div>
                {/* Show explanation for assistant messages with generation results */}
                {msg.role === 'assistant' && msg.generationResult?.explanation && (
                  <div className={styles.explanation}>
                    <div className={styles.explanationTitle}>🧠 AI Reasoning</div>
                    <div className={styles.explanationText}>
                      {msg.generationResult.explanation.explanation}
                    </div>
                    <div style={{ marginTop: '8px' }}>
                      {msg.generationResult.generation.componentList.map((comp) => (
                        <span key={comp} className={styles.componentTag}>{comp}</span>
                      ))}
                    </div>
                  </div>
                )}
                <span className={styles.messageTime}>{formatTime(msg.timestamp)}</span>
              </div>
            ))}
          </>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className={`${styles.message} ${styles.messageAssistant}`}>
            <div className={styles.messageBubble}>
              <div className={styles.loadingDots}>
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className={styles.inputArea}>
        <div className={styles.inputRow}>
          <textarea
            ref={textareaRef}
            className={styles.textInput}
            placeholder={hasCode ? 'Describe modifications...' : 'Describe the UI you want...'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            rows={1}
            id="chat-input"
          />
          <button
            className={styles.sendButton}
            onClick={handleSubmit}
            disabled={!input.trim() || isLoading}
            id="send-button"
            aria-label="Send message"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
};