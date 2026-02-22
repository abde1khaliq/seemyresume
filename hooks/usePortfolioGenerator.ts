'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState, useCallback } from 'react';
import type { PortfolioAgentUIMessage } from '@/components/ai/agent';

interface ImageInput {
  id: string;
  base64: string;
  mimeType: string;
}

interface GeneratePortfolioOptions {
  resumeText?: string;
  images?: ImageInput[];
  prompt?: string;
}

export function usePortfolioGenerator() {
  const [input, setInput] = useState('');

  const {
    messages,
    sendMessage,
    error,
    status,
    regenerate,
    stop,
    setMessages,
  } = useChat<PortfolioAgentUIMessage>({
    transport: new DefaultChatTransport({
      api: '/api/generate',
    }),
  });

  const generate = useCallback(
    (options: GeneratePortfolioOptions) => {
      const { resumeText, images, prompt } = options;
      const content = buildMessageContent(resumeText, images, prompt);
      sendMessage({ text: content });
    },
    [sendMessage]
  );

  const reset = useCallback(() => {
    setMessages([]);
    setInput('');
  }, [setMessages]);

  const isLoading = status === 'submitted' || status === 'streaming';

  return {
    messages,
    generate,
    isLoading,
    error,
    status,
    regenerate,
    stop,
    reset,
    input,
    setInput,
  };
}

function buildMessageContent(
  resumeText?: string,
  images?: ImageInput[],
  prompt?: string
): string {
  const parts: string[] = [];

  if (resumeText) {
    parts.push('## Resume\n');
    parts.push(resumeText);
    parts.push('\n');
  }

  if (images && images.length > 0) {
    parts.push('## Images\n');
    parts.push(`${images.length} image(s) provided:\n`);
    images.forEach((img, i) => {
      parts.push(`- Image ${i + 1}: ${img.mimeType} (${img.id})\n`);
    });
    parts.push('\n');
  }

  if (prompt) {
    parts.push('## User Preferences\n');
    parts.push(prompt);
    parts.push('\n');
  }

  parts.push('\nGenerate the portfolio configuration.');

  return parts.join('');
}
