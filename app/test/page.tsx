'use client';

import { useState, useCallback } from 'react';
import { usePortfolioGenerator } from '@/hooks/usePortfolioGenerator';
import {
  Box,
  Button,
  Container,
  Heading,
  Textarea,
  Text,
  VStack,
  HStack,
  Code,
  Badge,
  Card,
  Flex,
  Spinner,
} from '@chakra-ui/react';

const SAMPLE_RESUME = `John Doe
Senior Software Engineer

CONTACT
Email: john.doe@email.com
Phone: (555) 123-4567
Location: San Francisco, CA
Website: johndoe.dev

SUMMARY
Passionate software engineer with 5+ years of experience building scalable web applications. Specialized in React, Node.js, and cloud architecture.

EXPERIENCE

Tech Corp - Senior Software Engineer (2021 - Present)
- Led development of microservices architecture serving 1M+ users
- Reduced API response time by 40% through optimization
- Mentored team of 5 junior developers

StartupXYZ - Software Engineer (2019 - 2021)
- Built real-time collaboration features using WebSockets
- Implemented CI/CD pipeline reducing deployment time by 60%
- Contributed to open-source projects

PROJECTS

TaskFlow - Project Management App
Full-stack application with real-time updates, drag-and-drop interface, and team collaboration features.
Tech: React, Node.js, PostgreSQL, Redis

CodeSnap - Code Snippet Manager
Browser extension for saving and organizing code snippets with syntax highlighting.
Tech: TypeScript, Chrome API, Monaco Editor

SKILLS
JavaScript, TypeScript, React, Node.js, Python, PostgreSQL, Redis, AWS, Docker, Kubernetes, GraphQL

EDUCATION
BS Computer Science - UC Berkeley (2019)`;

export default function TestPage() {
  const [resumeText, setResumeText] = useState(SAMPLE_RESUME);
  const [prompt, setPrompt] = useState('Dark mode, modern, highlight projects');
  const [directResult, setDirectResult] = useState<any>(null);
  const [directLoading, setDirectLoading] = useState(false);

  const {
    messages,
    generate,
    isLoading,
    status,
    error,
    reset,
  } = usePortfolioGenerator();

  const handleStreamGenerate = useCallback(() => {
    generate({ resumeText, prompt });
  }, [generate, resumeText, prompt]);

  const handleDirectGenerate = useCallback(async () => {
    setDirectLoading(true);
    setDirectResult(null);

    try {
      const response = await fetch('/api/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, prompt }),
      });

      const data = await response.json();
      setDirectResult(data);
    } catch (err) {
      setDirectResult({
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    } finally {
      setDirectLoading(false);
    }
  }, [resumeText, prompt]);

  const handleReset = useCallback(() => {
    reset();
    setDirectResult(null);
  }, [reset]);

  const lastMessage = messages[messages.length - 1];

  return (
    <Container maxW="container.xl" py={8}>
      <VStack gap={6} align="stretch">
        <Heading size="xl">Portfolio Generator - Test Page</Heading>
        <Text color="gray.500">
          Test the AI portfolio generation system with resume text and style preferences.
        </Text>

        <HStack gap={4} wrap="wrap">
          <Badge colorPalette={status === 'ready' ? 'green' : status === 'streaming' ? 'blue' : status === 'error' ? 'red' : 'gray'}>
            Status: {status}
          </Badge>
          <Badge colorPalette="purple">Messages: {messages.length}</Badge>
        </HStack>

        <Flex gap={6} direction={{ base: 'column', lg: 'row' }}>
          <Box flex={1}>
            <VStack gap={4} align="stretch">
              <Heading size="md">Input</Heading>

              <Box>
                <Text fontWeight="medium" mb={2}>Resume Text</Text>
                <Textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste resume text..."
                  rows={10}
                  fontFamily="mono"
                  fontSize="sm"
                />
              </Box>

              <Box>
                <Text fontWeight="medium" mb={2}>Style Prompt</Text>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., Dark mode, minimalist..."
                  rows={2}
                />
              </Box>

              <HStack gap={2}>
                <Button
                  colorPalette="blue"
                  onClick={handleStreamGenerate}
                  loading={isLoading}
                >
                  Generate (Streaming)
                </Button>
                <Button
                  colorPalette="green"
                  onClick={handleDirectGenerate}
                  loading={directLoading}
                >
                  Generate (Direct)
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  Reset
                </Button>
              </HStack>
            </VStack>
          </Box>

          <Box flex={1}>
            <VStack gap={4} align="stretch">
              <Heading size="md">Output</Heading>

              {error && (
                <Box bg="red.100" p={4} borderRadius="md" borderLeft="4px solid" borderColor="red.500">
                  <Text color="red.700">{error.message}</Text>
                </Box>
              )}

              {(isLoading || directLoading) && (
                <Flex align="center" gap={2}>
                  <Spinner size="sm" />
                  <Text>Generating...</Text>
                </Flex>
              )}

              {directResult && (
                <Box>
                  <Text fontWeight="medium" mb={2}>
                    Direct API Result
                    <Badge ml={2} colorPalette={directResult.success ? 'green' : 'red'}>
                      {directResult.success ? 'Success' : 'Error'}
                    </Badge>
                    {directResult.duration && (
                      <Badge ml={2} colorPalette="gray">{directResult.duration}ms</Badge>
                    )}
                  </Text>
                  <Box
                    maxH="400px"
                    overflow="auto"
                    bg="gray.900"
                    p={4}
                    borderRadius="md"
                  >
                    <Code display="block" whiteSpace="pre" fontSize="xs" color="white">
                      {JSON.stringify(directResult.output || directResult.error, null, 2)}
                    </Code>
                  </Box>
                </Box>
              )}

              {messages.length > 0 && (
                <Box>
                  <Text fontWeight="medium" mb={2}>
                    Streaming Messages ({messages.length})
                  </Text>
                  <Box
                    maxH="400px"
                    overflow="auto"
                    bg="gray.900"
                    p={4}
                    borderRadius="md"
                  >
                    <Code display="block" whiteSpace="pre" fontSize="xs" color="white">
                      {JSON.stringify(messages, null, 2)}
                    </Code>
                  </Box>
                </Box>
              )}
            </VStack>
          </Box>
        </Flex>

        <Card.Root mt={6}>
          <Card.Body>
            <Heading size="sm" mb={2}>API Endpoints</Heading>
            <VStack align="start" gap={2} fontSize="sm">
              <Text><Code>POST /api/test</Code> - Direct generation (returns full result)</Text>
              <Text><Code>POST /api/generate</Code> - Streaming generation (for client use)</Text>
              <Text><Code>GET /api/test</Code> - API documentation</Text>
            </VStack>
          </Card.Body>
        </Card.Root>
      </VStack>
    </Container>
  );
}
