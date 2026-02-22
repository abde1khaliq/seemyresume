import { getApiKey, HACKCLUB_BASE_URL, MODELS } from '../config';

export interface OCRPage {
  index: number;
  markdown: string;
  images: Array<{
    id: string;
    top_left_x: number;
    top_left_y: number;
    bottom_right_x: number;
    bottom_right_y: number;
    image_base64?: string;
  }>;
  dimensions: {
    width: number;
    height: number;
  };
}

export interface OCRResult {
  model: string;
  pages: OCRPage[];
  document_annotation: string | null;
  usage_info: {
    pages_processed: number;
    doc_size_bytes: number;
  };
}

export interface DocumentAnalysisResult {
  text: string;
  pages: number;
  source: 'pdf-native' | 'ocr' | 'text';
  isStructured: boolean;
  metadata?: {
    dimensions?: { width: number; height: number };
    tablesDetected?: boolean;
  };
}

export interface ImageAnalysisResult {
  type: 'profile' | 'project-screenshot' | 'logo' | 'background' | 'certification' | 'other';
  description: string;
  suggestedPlacement: 'hero-profile' | 'hero-background' | 'project-card' | 'about-section' | 'education-section' | 'none';
  altText: string;
  priority: number;
}

async function makeRequest(endpoint: string, body: unknown): Promise<unknown> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('HACK_CLUB_AI_API_KEY is not set');
  }

  const response = await fetch(`${HACKCLUB_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Hack Club API error (${response.status}): ${errorText}`);
  }

  return response.json();
}

export async function ocrDocument(options: {
  documentUrl?: string;
  documentBase64?: string;
  mimeType?: string;
  tableFormat?: 'markdown' | 'html';
  pages?: number[];
  includeImages?: boolean;
}): Promise<OCRResult> {
  const { documentUrl, documentBase64, mimeType, tableFormat, pages, includeImages } = options;

  let document: { type: string; image_url?: string; document_url?: string };
  
  if (documentUrl) {
    const isImage = mimeType?.startsWith('image/') || 
      documentUrl.match(/\.(png|jpg|jpeg|webp|avif)$/i);
    
    document = isImage
      ? { type: 'image_url', image_url: documentUrl }
      : { type: 'document_url', document_url: documentUrl };
  } else if (documentBase64) {
    const isImage = mimeType?.startsWith('image/');
    const dataUrl = `data:${mimeType || 'application/pdf'};base64,${documentBase64}`;
    
    document = isImage
      ? { type: 'image_url', image_url: dataUrl }
      : { type: 'document_url', document_url: dataUrl };
  } else {
    throw new Error('Either documentUrl or documentBase64 is required');
  }

  const body: Record<string, unknown> = {
    document,
    model: 'mistral-ocr-latest',
  };

  if (tableFormat) {
    body.table_format = tableFormat;
  }

  if (pages && pages.length > 0) {
    body.pages = pages;
  }

  if (includeImages) {
    body.include_image_base64 = true;
  }

  return makeRequest('/ocr', body) as Promise<OCRResult>;
}

export async function sendPDFToModel(options: {
  pdfUrl?: string;
  pdfBase64?: string;
  prompt: string;
  engine?: 'native' | 'pdf-text' | 'mistral-ocr';
  model?: string;
}): Promise<string> {
  const { pdfUrl, pdfBase64, prompt, engine = 'native', model = MODELS.coding } = options;

  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('HACK_CLUB_AI_API_KEY is not set');
  }

  let fileData: string;
  if (pdfUrl) {
    fileData = pdfUrl;
  } else if (pdfBase64) {
    fileData = pdfBase64.startsWith('data:') 
      ? pdfBase64 
      : `data:application/pdf;base64,${pdfBase64}`;
  } else {
    throw new Error('Either pdfUrl or pdfBase64 is required');
  }

  const body = {
    model,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          {
            type: 'file',
            file: {
              filename: 'document.pdf',
              file_data: fileData,
            },
          },
        ],
      },
    ],
    plugins: [
      {
        id: 'file-parser',
        pdf: { engine },
      },
    ],
  };

  const response = await makeRequest('/chat/completions', body) as {
    choices: Array<{ message: { content: string } }>;
  };

  return response.choices[0]?.message?.content || '';
}

export async function sendImageToVision(options: {
  imageUrl?: string;
  imageBase64?: string;
  mimeType?: string;
  prompt: string;
  model?: string;
}): Promise<string> {
  const { imageUrl, imageBase64, mimeType = 'image/png', prompt, model = MODELS.vision } = options;

  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('HACK_CLUB_AI_API_KEY is not set');
  }

  let imageSource: string;
  if (imageUrl) {
    imageSource = imageUrl;
  } else if (imageBase64) {
    imageSource = imageBase64.startsWith('data:') 
      ? imageBase64 
      : `data:${mimeType};base64,${imageBase64}`;
  } else {
    throw new Error('Either imageUrl or imageBase64 is required');
  }

  const body = {
    model,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          {
            type: 'image_url',
            image_url: { url: imageSource },
          },
        ],
      },
    ],
  };

  const response = await makeRequest('/chat/completions', body) as {
    choices: Array<{ message: { content: string } }>;
  };

  return response.choices[0]?.message?.content || '';
}

export async function processDocument(options: {
  url?: string;
  base64?: string;
  mimeType: string;
  prompt?: string;
  pages?: number[];
}): Promise<DocumentAnalysisResult> {
  const { url, base64, mimeType, prompt, pages } = options;

  const isPdf = mimeType === 'application/pdf' || mimeType === 'application/x-pdf';
  const isImage = mimeType.startsWith('image/');

  if (isPdf) {
    const extractionPrompt = prompt || 'Extract all text content from this document. Preserve the structure and formatting.';
    
    try {
      const text = await sendPDFToModel({
        pdfUrl: url,
        pdfBase64: base64,
        prompt: extractionPrompt,
        engine: 'native',
      });

      const isStructured = text.length > 100 && !isGarbled(text);

      if (isStructured) {
        return {
          text,
          pages: 1,
          source: 'pdf-native',
          isStructured: true,
          metadata: {
            tablesDetected: text.includes('|') && text.includes('---'),
          },
        };
      }

      console.log('[processDocument] Native parsing produced poor results, falling back to OCR');
    } catch (error) {
      console.warn('[processDocument] Native parsing failed, falling back to OCR:', error);
    }

    const ocrResult = await ocrDocument({
      documentUrl: url,
      documentBase64: base64,
      mimeType,
      tableFormat: 'markdown',
      pages,
    });

    const text = ocrResult.pages.map(p => p.markdown).join('\n\n');

    return {
      text,
      pages: ocrResult.pages.length,
      source: 'ocr',
      isStructured: true,
      metadata: {
        dimensions: ocrResult.pages[0]?.dimensions,
        tablesDetected: text.includes('|') && text.includes('---'),
      },
    };
  }

  if (isImage) {
    const ocrResult = await ocrDocument({
      documentUrl: url,
      documentBase64: base64,
      mimeType,
      tableFormat: 'markdown',
      pages,
    });

    const text = ocrResult.pages.map(p => p.markdown).join('\n\n');

    return {
      text,
      pages: ocrResult.pages.length,
      source: 'ocr',
      isStructured: text.length > 50,
      metadata: {
        dimensions: ocrResult.pages[0]?.dimensions,
      },
    };
  }

  return {
    text: '',
    pages: 0,
    source: 'text',
    isStructured: false,
  };
}

export async function analyzeImageWithVision(options: {
  imageUrl?: string;
  imageBase64?: string;
  mimeType?: string;
}): Promise<ImageAnalysisResult> {
  const { imageUrl, imageBase64, mimeType } = options;

  const prompt = `Analyze this image for use in a personal portfolio website. Determine:

1. Image type (choose one):
   - "profile" - Professional headshot or personal photo
   - "project-screenshot" - Screenshot of an app, website, or project
   - "logo" - Company logo or personal branding
   - "background" - Large scenic or abstract image suitable for backgrounds
   - "certification" - Certificate, award, or badge
   - "other" - None of the above

2. A clear description of what the image shows (1-2 sentences)

3. Suggested placement in portfolio (choose one):
   - "hero-profile" - Use as profile photo in hero section
   - "hero-background" - Use as background image in hero section
   - "project-card" - Use in a project card/thumbnail
   - "about-section" - Use in about section
   - "education-section" - Use in education/certifications section
   - "none" - Not suitable for portfolio display

4. Alt text for accessibility (concise description)

Respond ONLY with valid JSON in this exact format:
{
  "type": "<type>",
  "description": "<description>",
  "suggestedPlacement": "<placement>",
  "altText": "<alt text>"
}`;

  const responseText = await sendImageToVision({
    imageUrl,
    imageBase64,
    mimeType,
    prompt,
    model: MODELS.vision,
  });

  try {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      
      const validTypes = ['profile', 'project-screenshot', 'logo', 'background', 'certification', 'other'] as const;
      const validPlacements = ['hero-profile', 'hero-background', 'project-card', 'about-section', 'education-section', 'none'] as const;

      const type = validTypes.includes(parsed.type as typeof validTypes[number]) 
        ? parsed.type 
        : 'other';
      
      const placement = validPlacements.includes(parsed.suggestedPlacement as typeof validPlacements[number])
        ? parsed.suggestedPlacement
        : 'none';

      const priority = type === 'profile' ? 10 
        : type === 'project-screenshot' ? 8 
        : type === 'certification' ? 6 
        : 5;

      return {
        type,
        description: parsed.description || '',
        suggestedPlacement: placement,
        altText: parsed.altText || '',
        priority,
      };
    }
  } catch (error) {
    console.warn('[analyzeImageWithVision] Failed to parse vision response:', error);
  }

  return {
    type: 'other',
    description: responseText.slice(0, 200),
    suggestedPlacement: 'none',
    altText: 'Image',
    priority: 1,
  };
}

function isGarbled(text: string): boolean {
  if (text.length < 50) return true;
  
  const readableChars = text.replace(/[^a-zA-Z0-9\s.,!?'"()-]/g, '');
  const readableRatio = readableChars.length / text.length;
  
  return readableRatio < 0.7;
}
