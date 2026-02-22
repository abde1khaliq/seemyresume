import { describe, it, expect } from 'vitest';
import { stripFrontmatter, skills } from '../components/ai/utils/skill-loader';

describe('stripFrontmatter', () => {
  it('removes YAML frontmatter', () => {
    const content = `---
name: test
description: Test skill
---

This is the skill content.`;

    const result = stripFrontmatter(content);
    expect(result).toBe('This is the skill content.');
  });

  it('handles content without frontmatter', () => {
    const content = 'Just content here.';
    const result = stripFrontmatter(content);
    expect(result).toBe('Just content here.');
  });

  it('handles empty content', () => {
    const result = stripFrontmatter('');
    expect(result).toBe('');
  });
});

describe('skills object', () => {
  it('has all expected skill loaders', () => {
    expect(skills).toHaveProperty('frontendDesign');
    expect(skills).toHaveProperty('resumeParsing');
    expect(skills).toHaveProperty('imageAnalysis');
    expect(skills).toHaveProperty('portfolioAssembly');
  });

  it('all loaders are functions', () => {
    expect(typeof skills.frontendDesign).toBe('function');
    expect(typeof skills.resumeParsing).toBe('function');
    expect(typeof skills.imageAnalysis).toBe('function');
    expect(typeof skills.portfolioAssembly).toBe('function');
  });
});
