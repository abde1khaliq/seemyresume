import { describe, it, expect } from 'vitest';
import {
  resumeDataSchema,
  imageAnalysisSchema,
  portfolioConfigSchema,
  heroSectionSchema,
  sectionSchema,
  themeConfigSchema,
  seoSchema,
  experienceItemSchema,
  projectItemSchema,
  aboutSectionDataSchema,
  experienceSectionDataSchema,
  projectsSectionDataSchema,
  skillsSectionDataSchema,
  educationSectionDataSchema,
  contactSectionDataSchema,
} from '../components/ai/prompts/schemas';

describe('resumeDataSchema', () => {
  it('validates minimal resume data', () => {
    const result = resumeDataSchema.safeParse({
      name: 'John Doe',
    });

    expect(result.success).toBe(true);
  });

  it('validates complete resume data', () => {
    const result = resumeDataSchema.safeParse({
      name: 'John Doe',
      title: 'Software Engineer',
      email: 'john@example.com',
      phone: '(555) 123-4567',
      location: 'San Francisco, CA',
      summary: 'Passionate developer',
      experience: [
        {
          company: 'Tech Corp',
          role: 'Senior Engineer',
          startDate: '2021',
          endDate: '2023',
          achievements: ['Led team', 'Built features'],
        },
      ],
      projects: [
        {
          name: 'Project X',
          description: 'A cool project',
          techStack: ['React', 'Node.js'],
        },
      ],
      skills: ['JavaScript', 'TypeScript', 'React'],
      education: [
        {
          institution: 'UC Berkeley',
          degree: 'BS',
          field: 'Computer Science',
        },
      ],
    });

    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = resumeDataSchema.safeParse({
      name: 'John Doe',
      email: 123,
    });

    expect(result.success).toBe(false);
  });

  it('handles optional fields', () => {
    const result = resumeDataSchema.safeParse({
      name: 'Jane Doe',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe('Jane Doe');
      expect(result.data.title).toBeUndefined();
      expect(result.data.experience).toBeUndefined();
    }
  });
});

describe('imageAnalysisSchema', () => {
  it('validates image analysis result', () => {
    const result = imageAnalysisSchema.safeParse({
      images: [
        {
          id: 'img-1',
          type: 'profile',
          description: 'Professional headshot',
          suggestedPlacement: 'hero-profile',
          altText: 'Profile photo of John Doe',
        },
      ],
    });

    expect(result.success).toBe(true);
  });

  it('rejects invalid image type', () => {
    const result = imageAnalysisSchema.safeParse({
      images: [
        {
          id: 'img-1',
          type: 'invalid-type',
          description: 'Test',
          suggestedPlacement: 'hero-profile',
          altText: 'Test',
        },
      ],
    });

    expect(result.success).toBe(false);
  });

  it('rejects invalid placement', () => {
    const result = imageAnalysisSchema.safeParse({
      images: [
        {
          id: 'img-1',
          type: 'profile',
          description: 'Test',
          suggestedPlacement: 'invalid-placement',
          altText: 'Test',
        },
      ],
    });

    expect(result.success).toBe(false);
  });
});

describe('portfolioConfigSchema', () => {
  it('validates complete portfolio config', () => {
    const result = portfolioConfigSchema.safeParse({
      theme: {
        theme: 'dark',
        accentColor: '#6366f1',
      },
      navigation: [
        { label: 'Home', href: '#home' },
        { label: 'Projects', href: '#projects' },
      ],
      hero: {
        title: 'John Doe',
        subtitle: 'Software Engineer',
      },
      sections: [
        {
          type: 'experience',
          title: 'Experience',
          visible: true,
        },
      ],
      seo: {
        title: 'John Doe | Portfolio',
        description: 'Software Engineer Portfolio',
      },
    });

    expect(result.success).toBe(true);
  });

  it('validates minimal portfolio config', () => {
    const result = portfolioConfigSchema.safeParse({
      theme: {
        theme: 'light',
        accentColor: '#000000',
      },
      navigation: [],
      hero: {
        title: 'Name',
        subtitle: 'Title',
      },
      sections: [],
      seo: {
        title: 'Portfolio',
        description: 'My portfolio',
      },
    });

    expect(result.success).toBe(true);
  });

  it('rejects invalid theme', () => {
    const result = portfolioConfigSchema.safeParse({
      theme: {
        theme: 'invalid',
        accentColor: '#000000',
      },
      navigation: [],
      hero: {
        title: 'Name',
        subtitle: 'Title',
      },
      sections: [],
      seo: {
        title: 'Portfolio',
        description: 'My portfolio',
      },
    });

    expect(result.success).toBe(false);
  });

  it('accepts any string as accent color (flexible)', () => {
    const result = portfolioConfigSchema.safeParse({
      theme: {
        theme: 'dark',
        accentColor: 'red',
      },
      navigation: [],
      hero: {
        title: 'Name',
        subtitle: 'Title',
      },
      sections: [],
      seo: {
        title: 'Portfolio',
        description: 'My portfolio',
      },
    });

    expect(result.success).toBe(true);
  });
});

describe('heroSectionSchema', () => {
  it('validates hero with all fields', () => {
    const result = heroSectionSchema.safeParse({
      title: 'John Doe',
      subtitle: 'Software Engineer',
      tagline: 'Building the future',
      backgroundImage: 'https://example.com/bg.jpg',
      profileImage: 'https://example.com/profile.jpg',
      cta: {
        label: 'Contact Me',
        href: '#contact',
      },
    });

    expect(result.success).toBe(true);
  });

  it('validates minimal hero', () => {
    const result = heroSectionSchema.safeParse({
      title: 'John Doe',
      subtitle: 'Engineer',
    });

    expect(result.success).toBe(true);
  });
});

describe('themeConfigSchema', () => {
  it('validates theme config with fonts', () => {
    const result = themeConfigSchema.safeParse({
      theme: 'dark',
      accentColor: '#6366f1',
      fontFamily: {
        heading: 'Inter',
        body: 'Roboto',
      },
    });

    expect(result.success).toBe(true);
  });

  it('validates theme config without fonts', () => {
    const result = themeConfigSchema.safeParse({
      theme: 'light',
      accentColor: '#000000',
    });

    expect(result.success).toBe(true);
  });
});

describe('seoSchema', () => {
  it('validates SEO with all fields', () => {
    const result = seoSchema.safeParse({
      title: 'John Doe | Portfolio',
      description: 'Software Engineer with 5 years experience',
      keywords: ['react', 'nodejs', 'typescript'],
      ogImage: 'https://example.com/og.jpg',
    });

    expect(result.success).toBe(true);
  });

  it('validates minimal SEO', () => {
    const result = seoSchema.safeParse({
      title: 'Portfolio',
      description: 'My portfolio',
    });

    expect(result.success).toBe(true);
  });
});

describe('experienceItemSchema', () => {
  it('validates experience with all fields', () => {
    const result = experienceItemSchema.safeParse({
      company: 'Tech Corp',
      role: 'Senior Engineer',
      startDate: '2021',
      endDate: '2023',
      current: false,
      achievements: ['Built feature A', 'Led team B'],
      location: 'San Francisco',
      technologies: ['React', 'Node.js'],
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.company).toBe('Tech Corp');
    }
  });

  it('allows extra fields via passthrough', () => {
    const result = experienceItemSchema.safeParse({
      company: 'Tech Corp',
      role: 'Engineer',
      startDate: '2020',
      achievements: [],
      customField: 'any value',
    });

    expect(result.success).toBe(true);
  });
});

describe('projectItemSchema', () => {
  it('validates project with all fields', () => {
    const result = projectItemSchema.safeParse({
      name: 'TaskFlow',
      description: 'Project management app',
      techStack: ['React', 'Node.js'],
      link: 'https://taskflow.com',
      image: 'https://example.com/taskflow.png',
      highlights: ['Real-time sync', 'Drag and drop'],
      highlight: true,
    });

    expect(result.success).toBe(true);
  });

  it('validates minimal project', () => {
    const result = projectItemSchema.safeParse({
      name: 'Simple App',
      description: 'A simple app',
      techStack: ['JavaScript'],
    });

    expect(result.success).toBe(true);
  });
});

describe('aboutSectionDataSchema', () => {
  it('validates about section data', () => {
    const result = aboutSectionDataSchema.safeParse({
      summary: 'Passionate developer',
      location: 'San Francisco',
      availability: 'Open to opportunities',
    });

    expect(result.success).toBe(true);
  });

  it('allows empty object', () => {
    const result = aboutSectionDataSchema.safeParse({});

    expect(result.success).toBe(true);
  });
});

describe('experienceSectionDataSchema', () => {
  it('validates array of experiences', () => {
    const result = experienceSectionDataSchema.safeParse([
      {
        company: 'Company A',
        role: 'Engineer',
        startDate: '2020',
        achievements: ['Built X'],
      },
      {
        company: 'Company B',
        role: 'Senior Engineer',
        startDate: '2022',
        achievements: ['Led Y'],
      },
    ]);

    expect(result.success).toBe(true);
  });
});

describe('projectsSectionDataSchema', () => {
  it('validates array of projects', () => {
    const result = projectsSectionDataSchema.safeParse([
      {
        name: 'Project 1',
        description: 'Description',
        techStack: ['React'],
      },
    ]);

    expect(result.success).toBe(true);
  });
});

describe('skillsSectionDataSchema', () => {
  it('validates skills with categories', () => {
    const result = skillsSectionDataSchema.safeParse({
      categories: [
        { name: 'Frontend', skills: ['React', 'Vue'] },
        { name: 'Backend', skills: ['Node.js', 'Python'] },
      ],
    });

    expect(result.success).toBe(true);
  });

  it('validates skills with flat array', () => {
    const result = skillsSectionDataSchema.safeParse({
      flat: ['JavaScript', 'TypeScript', 'React'],
    });

    expect(result.success).toBe(true);
  });
});

describe('educationSectionDataSchema', () => {
  it('validates array of education items', () => {
    const result = educationSectionDataSchema.safeParse([
      {
        institution: 'UC Berkeley',
        degree: 'BS',
        field: 'Computer Science',
        endDate: '2019',
      },
    ]);

    expect(result.success).toBe(true);
  });
});

describe('contactSectionDataSchema', () => {
  it('validates contact data', () => {
    const result = contactSectionDataSchema.safeParse({
      email: 'john@example.com',
      phone: '(555) 123-4567',
      location: 'San Francisco, CA',
      website: 'johndoe.dev',
      cta: "Let's connect!",
      social: [
        { platform: 'GitHub', url: 'https://github.com/johndoe' },
        { platform: 'LinkedIn', url: 'https://linkedin.com/in/johndoe' },
      ],
    });

    expect(result.success).toBe(true);
  });
});

describe('sectionSchema', () => {
  it('validates section with typed data', () => {
    const result = sectionSchema.safeParse({
      type: 'experience',
      title: 'Work Experience',
      visible: true,
      order: 1,
      data: [
        {
          company: 'Tech Corp',
          role: 'Engineer',
          startDate: '2020',
          achievements: ['Built features'],
        },
      ],
    });

    expect(result.success).toBe(true);
  });

  it('defaults visible to true', () => {
    const result = sectionSchema.safeParse({
      type: 'about',
      title: 'About Me',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.visible).toBe(true);
    }
  });
});
