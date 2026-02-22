import { describe, it, expect } from 'vitest';
import {
  resumeDataSchema,
  imageAnalysisSchema,
  portfolioConfigSchema,
  heroSectionSchema,
  sectionSchema,
  themeConfigSchema,
  seoSchema,
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
