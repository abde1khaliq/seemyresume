---
name: document-processing
description: Guidelines for processing various document types (PDFs, images) using Hack Club AI APIs. Smart detection for optimal processing.
---

## Document Processing Strategy

### Document Types

**Digital PDFs**
- Well-structured text, selectable content
- Use PDF Inputs API with `native` engine
- Best quality, preserves structure
- Fast processing

**Scanned PDFs**
- Image-based, no selectable text
- Use OCR API for extraction
- Handles tables, multi-column layouts
- Supports multiple pages

**Images (PNG, JPEG, WebP)**
- Photos, screenshots, scanned documents
- Use OCR API for text extraction
- Use Vision API for content analysis

### Smart Detection Algorithm

1. **Try native parsing first** for PDFs
   - Send to model with `native` engine
   - Check result quality (length, readability)

2. **Fall back to OCR** if native fails
   - Use when: short output, garbled text, errors
   - OCR handles scanned content better

3. **Always use OCR** for images
   - No native image parsing available
   - Mistral OCR handles complex layouts

### Quality Indicators

**Good extraction:**
- Sufficient length (>100 chars for resumes)
- High readable character ratio (>70%)
- Preserved structure (headers, lists)
- Tables formatted correctly

**Poor extraction:**
- Very short output
- Many special characters
- Missing sections
- Garbled/encoded text

### Processing Guidelines

1. **Always preserve structure**
   - Headers and sections
   - Lists and bullet points
   - Table formatting (use markdown)

2. **Handle multi-page documents**
   - Process all pages
   - Maintain page order
   - Combine results logically

3. **Extract metadata**
   - Document dimensions
   - Tables detected
   - Image count

### API Selection Guide

| Document Type | First Choice | Fallback |
|---------------|--------------|----------|
| Digital PDF | PDF Inputs (native) | OCR |
| Scanned PDF | OCR | - |
| Image with text | OCR | - |
| Image for analysis | Vision API | - |
