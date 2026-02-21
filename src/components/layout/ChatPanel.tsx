'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from '@/styles/components/chatPanel.module.css';
import { ChatMessage } from '@/types';
import { TEMPLATES, Template } from '@/lib/templates';
import {
  MessageSquare,
  Sparkles,
  Pencil,
  BarChart3,
  ShoppingCart,
  ClipboardList,
  Briefcase,
  TrendingUp,
  Target,
  Bot,
  Brain,
  Send,
  ChevronRight,
  Layout,
  Zap,
  LucideIcon,
  ArrowRight,
} from 'lucide-react';

// Map template icon names to Lucide components
const TEMPLATE_ICON_MAP: Record<string, LucideIcon> = {
  BarChart3,
  Briefcase,
  ShoppingCart,
  ClipboardList,
  TrendingUp,
};

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  onLoadTemplate?: (template: Template) => void;
  isLoading: boolean;
  hasCode: boolean;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  onSendMessage,
  onLoadTemplate,
  isLoading,
  hasCode,
}) => {
  const [input, setInput] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '44px';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 140) + 'px';
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

  const handleTemplateClick = (template: Template) => {
    if (onLoadTemplate) {
      onLoadTemplate(template);
      setShowTemplates(false);
    }
  };

  const formatTime = (timestamp: string) =>
    new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const suggestions = [
    { icon: BarChart3, label: 'Analytics Dashboard', color: 'emerald' },
    { icon: ShoppingCart, label: 'E-Commerce Admin', color: 'blue' },
    { icon: ClipboardList, label: 'Project Manager', color: 'purple' },
    { icon: Briefcase, label: 'CRM Interface', color: 'amber' },
    { icon: TrendingUp, label: 'Finance Tracker', color: 'rose' },
    { icon: Target, label: 'Task Board', color: 'cyan' },
  ];

  // Resolve a template icon name to a Lucide component
  const getTemplateIcon = (iconName: string) => {
    return TEMPLATE_ICON_MAP[iconName] || BarChart3;
  };

  return (
    <div className={styles.chatPanel}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <MessageSquare size={16} className={styles.headerIcon} />
          AI Chat
        </div>
        <div className={styles.headerRight}>
          <button
            className={`${styles.templateToggle} ${showTemplates ? styles.templateToggleActive : ''}`}
            onClick={() => setShowTemplates(!showTemplates)}
          >
            <Layout size={12} />
            Templates
          </button>
          <span className={`${styles.headerBadge} ${hasCode ? styles.headerBadgeModify : ''}`}>
            {hasCode ? (
              <><Pencil size={11} /> Modify</>
            ) : (
              <><Sparkles size={11} /> Generate</>
            )}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className={styles.messages}>
        {/* ── Template Gallery (shown when Templates button is toggled) ── */}
        {showTemplates ? (
          <div className={styles.templateGallery}>
            <div className={styles.galleryHeader}>
              <Zap size={16} className={styles.galleryIcon} />
              <div>
                <div className={styles.galleryTitle}>Instant Templates</div>
                <div className={styles.galleryDesc}>Load a prebuilt UI instantly</div>
              </div>
            </div>
            <div className={styles.galleryGrid}>
              {TEMPLATES.map((tpl) => {
                const IconComp = getTemplateIcon(tpl.icon);
                return (
                  <button
                    key={tpl.id}
                    className={styles.galleryCard}
                    onClick={() => handleTemplateClick(tpl)}
                  >
                    <div className={styles.galleryCardTop}>
                      <div className={styles.galleryCardIconWrap}>
                        <IconComp size={20} />
                      </div>
                      <div className={styles.galleryCardMeta}>
                        <div className={styles.galleryCardName}>{tpl.name}</div>
                        <div className={styles.galleryCardDesc}>{tpl.description}</div>
                      </div>
                    </div>
                    <div className={styles.galleryCardBottom}>
                      <div className={styles.galleryCardTags}>
                        {tpl.tags.slice(0, 3).map(tag => (
                          <span key={tag} className={styles.galleryTag}>{tag}</span>
                        ))}
                      </div>
                      <div className={styles.galleryCardAction}>
                        Use <ArrowRight size={11} />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : messages.length === 0 && !isLoading ? (
          /* ── Empty State ── */
          <div className={styles.emptyState}>
            <div className={styles.heroGlow} />
            <div className={styles.emptyIcon}>
              <Sparkles size={42} className={styles.mainSparkle} />
            </div>
            <div className={styles.emptyTitle}>What do you want to build?</div>
            <div className={styles.emptyHint}>
              Describe any UI in natural language — dashboards, forms, admin panels — and watch it come to life.
            </div>

            <div className={styles.suggestionsLabel}>
              <span className={styles.suggestionsLine} />
              <span>TRY AN EXAMPLE</span>
              <span className={styles.suggestionsLine} />
            </div>

            <div className={styles.suggestions}>
              {suggestions.map((s) => {
                const Icon = s.icon;
                return (
                  <button
                    key={s.label}
                    className={`${styles.suggestionChip} ${styles[`chip_${s.color}`] || ''}`}
                    onClick={() => {
                      setInput(s.label);
                      onSendMessage(s.label);
                    }}
                    disabled={isLoading}
                  >
                    <Icon size={15} className={styles.chipIcon} />
                    <span className={styles.chipLabel}>{s.label}</span>
                    <ChevronRight size={14} className={styles.chipArrow} />
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* ── Message List ── */
          <>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`${styles.message} ${msg.role === 'user' ? styles.messageUser : styles.messageAssistant}`}
              >
                {msg.role === 'assistant' && (
                  <div className={styles.messageAvatar}>
                    <Bot size={16} />
                  </div>
                )}
                <div className={styles.messageBubble}>{msg.content}</div>
                {msg.role === 'assistant' && msg.generationResult?.explanation && (
                  <div className={styles.explanation}>
                    <div className={styles.explanationTitle}>
                      <Brain size={13} className={styles.reasoningIcon} />
                      AI REASONING
                    </div>
                    <div className={styles.explanationText}>
                      {msg.generationResult.explanation.explanation}
                    </div>
                    <div className={styles.componentTags}>
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

        {isLoading && (
          <div className={`${styles.message} ${styles.messageAssistant}`}>
            <div className={styles.messageAvatar}>
              <Bot size={16} />
            </div>
            <div className={styles.loadingBubble}>
              <div className={styles.loadingShimmer} />
              <div className={styles.loadingText}>
                <span>Generating your UI</span>
                <span className={styles.loadingDots}><span /><span /><span /></span>
              </div>
              <div className={styles.loadingSteps}>
                <div className={`${styles.loadingStep} ${styles.loadingStepActive}`}>
                  <span className={styles.stepDot} /> Planning layout
                </div>
                <div className={styles.loadingStep}>
                  <span className={styles.stepDot} /> Composing components
                </div>
                <div className={styles.loadingStep}>
                  <span className={styles.stepDot} /> Generating code
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className={styles.inputArea}>
        <div className={styles.inputContainer}>
          <textarea
            ref={textareaRef}
            className={styles.textInput}
            placeholder={hasCode ? 'Describe your modifications...' : 'Build me a...'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            rows={1}
            id="chat-input"
          />
          <div className={styles.inputActions}>
            <span className={styles.keyboardHint}>⏎ Enter</span>
            <button
              className={styles.sendButton}
              onClick={handleSubmit}
              disabled={!input.trim() || isLoading}
              id="send-button"
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};