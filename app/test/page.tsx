'use client';

import { useState, useCallback } from 'react';
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
  Progress,
  Icon,
  IconButton,
} from '@chakra-ui/react';
import { FiCode, FiEye, FiFileText, FiCopy, FiCheck, FiDownload, FiMonitor, FiTablet, FiSmartphone, FiZap } from 'react-icons/fi';
import { StylePresetSelector, getDefaultPreset, type StylePreset } from '@/components/style-presets';
import { parseResume } from '@/lib/parse-resume';
import type { ResumeData } from '@/components/ai/prompts/schemas';

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

type GenerationStage = 'idle' | 'parsing' | 'generating' | 'complete' | 'error';

export default function TestPage() {
  const [resumeText, setResumeText] = useState(SAMPLE_RESUME);
  const [selectedPreset, setSelectedPreset] = useState<StylePreset>(getDefaultPreset());
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null);
  const [stage, setStage] = useState<GenerationStage>('idle');
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [copied, setCopied] = useState(false);
  const [parseProgress, setParseProgress] = useState(0);
  const [generateProgress, setGenerateProgress] = useState(0);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);

  const handlePresetSelect = useCallback((preset: StylePreset) => {
    setSelectedPreset(preset);
  }, []);

  const handleGenerate = useCallback(async () => {
    setStage('parsing');
    setError(null);
    setGeneratedHtml(null);
    setParseProgress(0);
    setGenerateProgress(0);
    setResumeData(null);

    try {
      // Step 1: Parse resume (5-10s)
      console.log('[Test Page] Parsing resume...');
      setParseProgress(10);
      
      const parseResult = await parseResume(resumeText);
      setParseProgress(80);
      
      if (!parseResult.success || !parseResult.data) {
        throw new Error(parseResult.error || 'Failed to parse resume');
      }
      
      setResumeData(parseResult.data);
      setParseProgress(100);
      console.log('[Test Page] Parse complete:', parseResult.data.name);

      // Step 2: Generate HTML (30-60s)
      setStage('generating');
      setGenerateProgress(10);
      
      console.log('[Test Page] Generating portfolio with style:', selectedPreset.id);
      
      const response = await fetch('/api/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeData: parseResult.data,
          stylePreset: selectedPreset.prompt,
        }),
      });

      setGenerateProgress(50);
      
      const data = await response.json();
      setGenerateProgress(90);

      if (data.success && data.output) {
        setGeneratedHtml(data.output);
        setStage('complete');
        console.log('[Test Page] Generation complete, duration:', data.duration);
      } else {
        throw new Error(data.error || 'Generation failed');
      }
      
      setGenerateProgress(100);
    } catch (err) {
      console.error('[Test Page] Error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setStage('error');
    }
  }, [resumeText, selectedPreset]);

  const handleReset = useCallback(() => {
    setGeneratedHtml(null);
    setError(null);
    setStage('idle');
    setParseProgress(0);
    setGenerateProgress(0);
    setResumeData(null);
  }, []);

  const handleCopy = useCallback(async () => {
    if (generatedHtml) {
      await navigator.clipboard.writeText(generatedHtml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [generatedHtml]);

  const handleDownload = useCallback(() => {
    if (generatedHtml) {
      const blob = new Blob([generatedHtml], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'portfolio.html';
      a.click();
      URL.revokeObjectURL(url);
    }
  }, [generatedHtml]);

  const getPreviewWidth = () => {
    switch (previewDevice) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      default: return '100%';
    }
  };

  const renderLoadingState = () => {
    if (stage === 'parsing') {
      return (
        <Card.Root>
          <Card.Body>
            <VStack gap={4} py={8}>
              <Spinner size="lg" color="blue.500" />
              <VStack gap={2}>
                <Text fontWeight="medium">Parsing resume...</Text>
                <Text fontSize="sm" color="gray.500">
                  Extracting your information (5-10 seconds)
                </Text>
              </VStack>
              <Progress.Root value={parseProgress} width="200px" size="sm" colorPalette="blue">
                <Progress.Track>
                  <Progress.Range />
                </Progress.Track>
              </Progress.Root>
            </VStack>
          </Card.Body>
        </Card.Root>
      );
    }

    if (stage === 'generating') {
      return (
        <Card.Root>
          <Card.Body>
            <VStack gap={4} py={8}>
              <Spinner size="lg" color="purple.500" />
              <VStack gap={2}>
                <Text fontWeight="medium">Generating portfolio...</Text>
                <Text fontSize="sm" color="gray.500">
                  Creating stunning design (30-60 seconds)
                </Text>
                {resumeData && (
                  <Text fontSize="xs" color="gray.400">
                    Building portfolio for {resumeData.name}
                  </Text>
                )}
              </VStack>
              <Progress.Root value={generateProgress} width="200px" size="sm" colorPalette="purple">
                <Progress.Track>
                  <Progress.Range />
                </Progress.Track>
              </Progress.Root>
              <HStack gap={2} mt={2}>
                <Badge colorPalette="purple" variant="outline">
                  {selectedPreset.label}
                </Badge>
              </HStack>
            </VStack>
          </Card.Body>
        </Card.Root>
      );
    }

    return null;
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack gap={6} align="stretch">
        <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
          <Box>
            <Heading size="xl">
              <Icon as={FiZap} mr={2} color="purple.500" />
              Portfolio Generator
            </Heading>
            <Text color="gray.500" mt={1}>
              Create stunning portfolios in seconds - Fast, beautiful, distinctive
            </Text>
          </Box>
          {stage === 'idle' && (
            <Badge colorPalette="green" size="lg">
              ~35-70 seconds total
            </Badge>
          )}
        </Flex>

        <Flex gap={6} direction={{ base: 'column', xl: 'row' }}>
          {/* Left Panel - Input */}
          <Box flex={1} minW="400px">
            <VStack gap={6} align="stretch">
              {/* Style Preset Selector */}
              <Card.Root>
                <Card.Body>
                  <StylePresetSelector
                    selectedId={selectedPreset.id}
                    onSelect={handlePresetSelect}
                  />
                </Card.Body>
              </Card.Root>

              {/* Resume Text */}
              <Card.Root>
                <Card.Body>
                  <Heading size="sm" mb={4}>
                    <Icon as={FiFileText} mr={2} />
                    Resume Content
                  </Heading>
                  <Textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste resume text..."
                    rows={12}
                    fontFamily="mono"
                    fontSize="sm"
                  />
                  <Text fontSize="xs" color="gray.500" mt={2}>
                    {resumeText.length} characters
                  </Text>
                </Card.Body>
              </Card.Root>

              {/* Actions */}
              <HStack gap={2}>
                <Button
                  colorPalette="purple"
                  onClick={handleGenerate}
                  disabled={stage === 'parsing' || stage === 'generating'}
                  flex={1}
                  size="lg"
                >
                  {stage === 'parsing' || stage === 'generating' ? (
                    <HStack gap={2}>
                      <Spinner size="sm" />
                      <Text>Processing...</Text>
                    </HStack>
                  ) : (
                    'Generate Portfolio'
                  )}
                </Button>
                <Button variant="ghost" onClick={handleReset} size="lg">
                  Reset
                </Button>
              </HStack>
            </VStack>
          </Box>

          {/* Right Panel - Output */}
          <Box flex={1.5} minW="400px">
            <VStack gap={4} align="stretch">
              {error && (
                <Box bg="red.100" p={4} borderRadius="md" borderLeft="4px solid" borderColor="red.500">
                  <Text color="red.700" fontWeight="medium">Generation Failed</Text>
                  <Text color="red.600" fontSize="sm" mt={1}>{error}</Text>
                  <Button size="sm" mt={2} onClick={handleReset} colorPalette="red" variant="outline">
                    Try Again
                  </Button>
                </Box>
              )}

              {renderLoadingState()}

              {generatedHtml && stage === 'complete' && (
                <VStack gap={4} align="stretch">
                  {/* Toolbar */}
                  <Flex justify="space-between" align="center" wrap="wrap" gap={2}>
                    <HStack gap={2}>
                      <Badge
                        cursor="pointer"
                        onClick={() => setActiveTab('preview')}
                        colorPalette={activeTab === 'preview' ? 'blue' : 'gray'}
                      >
                        <Icon as={FiEye} mr={1} /> Preview
                      </Badge>
                      <Badge
                        cursor="pointer"
                        onClick={() => setActiveTab('code')}
                        colorPalette={activeTab === 'code' ? 'blue' : 'gray'}
                      >
                        <Icon as={FiCode} mr={1} /> Code
                      </Badge>
                    </HStack>
                    
                    <HStack gap={2}>
                      {activeTab === 'preview' && (
                        <>
                          <IconButton
                            size="sm"
                            variant={previewDevice === 'desktop' ? 'solid' : 'ghost'}
                            onClick={() => setPreviewDevice('desktop')}
                            aria-label="Desktop"
                          >
                            <Icon as={FiMonitor} />
                          </IconButton>
                          <IconButton
                            size="sm"
                            variant={previewDevice === 'tablet' ? 'solid' : 'ghost'}
                            onClick={() => setPreviewDevice('tablet')}
                            aria-label="Tablet"
                          >
                            <Icon as={FiTablet} />
                          </IconButton>
                          <IconButton
                            size="sm"
                            variant={previewDevice === 'mobile' ? 'solid' : 'ghost'}
                            onClick={() => setPreviewDevice('mobile')}
                            aria-label="Mobile"
                          >
                            <Icon as={FiSmartphone} />
                          </IconButton>
                        </>
                      )}
                      <Button size="sm" variant="outline" onClick={handleCopy}>
                        <Icon as={copied ? FiCheck : FiCopy} mr={1} />
                        {copied ? 'Copied!' : 'Copy'}
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleDownload}>
                        <Icon as={FiDownload} mr={1} />
                        Download
                      </Button>
                    </HStack>
                  </Flex>

                  {/* Preview */}
                  {activeTab === 'preview' && (
                    <Box
                      borderRadius="lg"
                      overflow="hidden"
                      border="1px solid"
                      borderColor="gray.200"
                      bg="white"
                      transition="all 0.3s"
                    >
                      <iframe
                        srcDoc={generatedHtml}
                        sandbox="allow-scripts"
                        style={{
                          width: getPreviewWidth(),
                          height: '800px',
                          border: 'none',
                          margin: previewDevice === 'desktop' ? '0' : '0 auto',
                          display: 'block',
                        }}
                      />
                    </Box>
                  )}

                  {/* Code */}
                  {activeTab === 'code' && (
                    <Box
                      maxH="800px"
                      overflow="auto"
                      bg="gray.900"
                      p={4}
                      borderRadius="lg"
                    >
                      <Code display="block" whiteSpace="pre" fontSize="xs" color="gray.100">
                        {generatedHtml}
                      </Code>
                    </Box>
                  )}
                </VStack>
              )}

              {/* Empty State */}
              {stage === 'idle' && (
                <Card.Root>
                  <Card.Body>
                    <VStack py={16} textAlign="center">
                      <Icon as={FiEye} boxSize={16} color="gray.300" mb={4} />
                      <Text color="gray.500" fontSize="lg">Your portfolio will appear here</Text>
                      <Text fontSize="sm" color="gray.400">
                        Select a style preset and click "Generate Portfolio"
                      </Text>
                      <HStack gap={2} mt={4}>
                        <Badge colorPalette="blue" variant="outline">Step 1: Parse resume</Badge>
                        <Text color="gray.400">→</Text>
                        <Badge colorPalette="purple" variant="outline">Step 2: Generate HTML</Badge>
                      </HStack>
                    </VStack>
                  </Card.Body>
                </Card.Root>
              )}
            </VStack>
          </Box>
        </Flex>
      </VStack>
    </Container>
  );
}
