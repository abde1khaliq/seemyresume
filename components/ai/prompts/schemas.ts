import { z } from 'zod';

export const documentMimeTypeSchema = z.enum([
  'application/pdf',
  'application/x-pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/avif',
]);

export const documentInputSchema = z.object({
  url: z.string().url().optional(),
  base64: z.string().optional(),
  mimeType: documentMimeTypeSchema,
  pages: z.array(z.number()).optional(),
});

export type DocumentInput = z.infer<typeof documentInputSchema>;

export const imageInputSchema = z.object({
  id: z.string(),
  url: z.string().url().optional(),
  base64: z.string().optional(),
  mimeType: z.enum(['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/avif']).optional(),
});

export type ImageInput = z.infer<typeof imageInputSchema>;

export const resumeDataSchema = z.object({
  name: z.string(),
  title: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  website: z.string().optional(),
  summary: z.string().optional(),
  experience: z.array(
    z.object({
      company: z.string(),
      role: z.string(),
      startDate: z.string(),
      endDate: z.string().optional(),
      current: z.boolean().optional(),
      achievements: z.array(z.string()),
      location: z.string().optional(),
    })
  ).optional(),
  projects: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      techStack: z.array(z.string()),
      link: z.string().optional(),
      highlights: z.array(z.string()).optional(),
    })
  ).optional(),
  skills: z.array(z.string()).optional(),
  education: z.array(
    z.object({
      institution: z.string(),
      degree: z.string(),
      field: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    })
  ).optional(),
  certifications: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
});

export type ResumeData = z.infer<typeof resumeDataSchema>;

export const imageTypeSchema = z.enum([
  'profile',
  'project-screenshot',
  'logo',
  'background',
  'certification',
  'other',
]);

export const imagePlacementSchema = z.enum([
  'hero-profile',
  'hero-background',
  'project-card',
  'about-section',
  'education-section',
  'none',
]);

export const imageAnalysisItemSchema = z.object({
  id: z.string(),
  type: imageTypeSchema,
  description: z.string(),
  suggestedPlacement: imagePlacementSchema,
  altText: z.string(),
  priority: z.number().min(1).max(10).optional(),
});

export const imageAnalysisSchema = z.object({
  images: z.array(imageAnalysisItemSchema),
});

export type ImageAnalysis = z.infer<typeof imageAnalysisSchema>;
export type ImageAnalysisItem = z.infer<typeof imageAnalysisItemSchema>;

export const sectionTypeSchema = z.enum([
  'hero',
  'experience',
  'projects',
  'skills',
  'about',
  'contact',
  'education',
  'certifications',
]);

export const heroSectionSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  tagline: z.string().optional(),
  backgroundImage: z.string().optional(),
  profileImage: z.string().optional(),
  cta: z.object({
    label: z.string(),
    href: z.string(),
  }).optional(),
});

export const experienceItemSchema = z.object({
  company: z.string(),
  role: z.string(),
  startDate: z.string(),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
  achievements: z.array(z.string()),
  location: z.string().optional(),
}).passthrough();

export const projectItemSchema = z.object({
  name: z.string(),
  description: z.string(),
  techStack: z.array(z.string()),
  link: z.string().optional(),
  image: z.string().optional(),
  highlights: z.array(z.string()).optional(),
  highlight: z.boolean().optional(),
}).passthrough();

export const skillCategorySchema = z.object({
  name: z.string(),
  skills: z.array(z.string()),
});

export const aboutSectionDataSchema = z.object({
  summary: z.string().optional(),
  location: z.string().optional(),
  availability: z.string().optional(),
}).passthrough();

export const experienceSectionDataSchema = z.array(experienceItemSchema);

export const projectsSectionDataSchema = z.array(projectItemSchema);

export const skillsSectionDataSchema = z.object({
  categories: z.array(skillCategorySchema).optional(),
  flat: z.array(z.string()).optional(),
}).passthrough();

export const educationItemSchema = z.object({
  institution: z.string(),
  degree: z.string(),
  field: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
}).passthrough();

export const educationSectionDataSchema = z.array(educationItemSchema);

export const contactSectionDataSchema = z.object({
  email: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  website: z.string().optional(),
  cta: z.string().optional(),
  social: z.array(z.object({
    platform: z.string(),
    url: z.string(),
  })).optional(),
}).passthrough();

export const sectionSchema = z.object({
  type: sectionTypeSchema,
  title: z.string(),
  visible: z.boolean().default(true),
  order: z.number().optional(),
  data: z.any().optional(),
});

export const navigationItemSchema = z.object({
  label: z.string(),
  href: z.string(),
});

export const seoSchema = z.object({
  title: z.string(),
  description: z.string(),
  keywords: z.array(z.string()).optional(),
  ogImage: z.string().optional(),
});

export const themeConfigSchema = z.object({
  theme: z.enum(['dark', 'light', 'system']),
  accentColor: z.string(),
  fontFamily: z.object({
    heading: z.string().optional(),
    body: z.string().optional(),
  }).optional(),
});

export const portfolioConfigSchema = z.object({
  theme: themeConfigSchema,
  navigation: z.array(navigationItemSchema),
  hero: heroSectionSchema,
  sections: z.array(sectionSchema),
  seo: seoSchema,
  contact: z.object({
    email: z.string().optional(),
    phone: z.string().optional(),
    location: z.string().optional(),
    website: z.string().optional(),
    social: z.array(
      z.object({
        platform: z.string(),
        url: z.string(),
      })
    ).optional(),
  }).optional(),
});

export type PortfolioConfig = z.infer<typeof portfolioConfigSchema>;
export type Section = z.infer<typeof sectionSchema>;
export type HeroSection = z.infer<typeof heroSectionSchema>;
export type ThemeConfig = z.infer<typeof themeConfigSchema>;
export type SEO = z.infer<typeof seoSchema>;
export type ExperienceItem = z.infer<typeof experienceItemSchema>;
export type ProjectItem = z.infer<typeof projectItemSchema>;
export type EducationItem = z.infer<typeof educationItemSchema>;
export type AboutSectionData = z.infer<typeof aboutSectionDataSchema>;
export type ExperienceSectionData = z.infer<typeof experienceSectionDataSchema>;
export type ProjectsSectionData = z.infer<typeof projectsSectionDataSchema>;
export type SkillsSectionData = z.infer<typeof skillsSectionDataSchema>;
export type EducationSectionData = z.infer<typeof educationSectionDataSchema>;
export type ContactSectionData = z.infer<typeof contactSectionDataSchema>;

export const designSpecSchema = z.object({
  theme: z.enum(['dark', 'light']),
  layoutStyle: z.enum(['bento', 'timeline', 'cards', 'split', 'terminal']),
  accentColor: z.string(),
  fontFamily: z.object({
    heading: z.string(),
    body: z.string(),
  }),
  sections: z.array(z.object({
    type: z.string(),
    order: z.number(),
    highlight: z.boolean().optional(),
  })),
  animations: z.enum(['minimal', 'moderate', 'elaborate']),
  heroStyle: z.enum(['terminal', 'gradient', 'split', 'centered', 'minimal']),
  visualEffects: z.array(z.enum([
    'glassmorphism',
    'gradients',
    'shadows',
    'borders',
    'glow',
    'patterns',
  ])),
  heroCTA: z.string().optional(),
});

export type DesignSpec = z.infer<typeof designSpecSchema>;
