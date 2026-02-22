import fs from 'fs';
import path from 'path';

const skillsCache = new Map<string, string>();

export function loadSkill(skillName: string): string {
  if (skillsCache.has(skillName)) {
    return skillsCache.get(skillName)!;
  }

  const skillPath = path.join(
    process.cwd(),
    'components',
    'ai',
    'skills',
    skillName,
    'SKILL.md'
  );

  try {
    const content = fs.readFileSync(skillPath, 'utf-8');
    const skillContent = stripFrontmatter(content);
    skillsCache.set(skillName, skillContent);
    return skillContent;
  } catch {
    console.warn(`Skill not found: ${skillName}`);
    return '';
  }
}

export function loadSkillSync(skillName: string): string {
  return loadSkill(skillName);
}

export function stripFrontmatter(content: string): string {
  const frontmatterRegex = /^---\n[\s\S]*?\n---\n?/;
  return content.replace(frontmatterRegex, '').trim();
}

export function loadPrompt(): string {
  const promptPath = path.join(
    process.cwd(),
    'components',
    'ai',
    'prompts',
    'PROMPT.txt'
  );

  try {
    return fs.readFileSync(promptPath, 'utf-8').trim();
  } catch {
    console.warn('PROMPT.txt not found');
    return '';
  }
}

export const skills = {
  frontendDesign: () => loadSkill('frontend-design'),
  resumeParsing: () => loadSkill('resume-parsing'),
  imageAnalysis: () => loadSkill('image-analysis'),
  portfolioAssembly: () => loadSkill('portfolio-assembly'),
  documentProcessing: () => loadSkill('document-processing'),
} as const;
