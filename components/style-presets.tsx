"use client";

import { cn } from "@/lib/utils";

export interface StylePreset {
  id: string;
  label: string;
  description: string;
  prompt: string;
  preview: {
    bg: string;
    accent: string;
    cardBg: string;
  };
  default?: boolean;
}

export const STYLE_PRESETS: StylePreset[] = [
  {
    id: "glass",
    label: "Glass Modern",
    description: "Dark theme with glassmorphism cards",
    preview: {
      bg: "bg-slate-950",
      accent: "bg-indigo-500",
      cardBg: "bg-white/5 backdrop-blur",
    },
    prompt: `Style: Glass Modern
Theme: Dark (#0d0d12 background)
Typography: Outfit for headings, Satoshi for body text
Layout: Bento grid with varying card sizes
Effects: Glassmorphism cards with backdrop-blur, gradient accents (indigo/purple), depth shadows, subtle glow effects
Navbar: Glass effect with backdrop-blur, transparent background
Logo: Clean, minimal (name only or ./name format)
Colors: Background #0d0d12, cards rgba(255,255,255,0.03) with blur, accent #6366f1 indigo, text white primary
Hero: Full-height with gradient mesh background, centered content in glass card
Animations: Moderate - smooth fade-ins, elegant hover states`,
    default: true,
  },
  {
    id: "terminal",
    label: "Developer Terminal",
    description: "Command-line aesthetic for developers",
    preview: {
      bg: "bg-zinc-950",
      accent: "bg-emerald-400",
      cardBg: "bg-zinc-900 border border-emerald-400/30",
    },
    prompt: `Style: Terminal
Theme: Dark terminal (#0a0a0f background)
Typography: JetBrains Mono for code/accents, Space Grotesk for headings
Layout: Command-line inspired hero, timeline for experience, terminal window styling
Effects: Green glow (#00ff88), terminal window styling with red/yellow/green dots, monospace accents, cursor blink
Navbar: Terminal prompt style (./name format), command-line aesthetic
Logo: Terminal prompt format like "./johndoe" or "~/johndoe"
Colors: Background #0a0a0f, accent #00ff88 terminal green, secondary #64d0ff blue, text #e8e8e8
Hero: Terminal window with typing animation effect, "whoami" style intro showing name and role
Animations: Cursor blink, command-line reveal animations, typing effect`,
  },
  {
    id: "creative",
    label: "Creative Bold",
    description: "Asymmetric layout with bold typography",
    preview: {
      bg: "bg-gradient-to-br from-violet-950 to-fuchsia-950",
      accent: "bg-fuchsia-400",
      cardBg: "bg-white/10",
    },
    prompt: `Style: Creative Bold
Theme: Dark with vibrant accents
Typography: Syne or Clash Display for headings (large, bold), clean sans-serif for body
Layout: Asymmetric compositions, overlapping elements, grid-breaking design, unexpected placements
Effects: Bold gradients, large typography, vibrant color accents, dramatic compositions
Navbar: Minimal floating style or integrated into hero, subtle or hidden on desktop
Logo: Bold, large typography as the logo itself
Colors: Choose bold primary with contrasting accents, high contrast, vibrant
Hero: Large typography (6-8rem name), dynamic asymmetric composition, visually striking
Animations: Elaborate - staggered reveals, bold transitions, dramatic effects`,
  },
  {
    id: "minimal",
    label: "Minimal Light",
    description: "Clean, professional with generous whitespace",
    preview: {
      bg: "bg-white",
      accent: "bg-slate-900",
      cardBg: "bg-slate-50 border border-slate-200",
    },
    prompt: `Style: Minimal Light
Theme: Light (#ffffff background)
Typography: Plus Jakarta Sans for headings, DM Serif Display for accents
Layout: Centered content, generous whitespace, refined spacing, clean grid
Effects: Subtle shadows, minimal borders, refined details, lots of breathing room
Navbar: Clean white background with subtle shadow on scroll
Logo: Simple, elegant name typography
Colors: Background #ffffff, cards #f8fafc, text #0f172a primary, #64748b secondary, accent #3b82f6 blue
Hero: Centered, clean, lots of whitespace, simple and elegant, refined typography
Animations: Minimal - only subtle fade-ins on scroll, very gentle hover states`,
  },
];

interface StylePresetSelectorProps {
  selectedId: string;
  onSelect: (preset: StylePreset) => void;
}

export function StylePresetSelector({
  selectedId,
  onSelect,
}: StylePresetSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-slate-200">Style Preset</label>
      <div className="grid grid-cols-2 gap-3">
        {STYLE_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onSelect(preset)}
            className={cn(
              "group relative overflow-hidden rounded-lg border-2 p-3 text-left transition-all",
              "hover:border-slate-500 hover:shadow-lg",
              selectedId === preset.id
                ? "border-indigo-500 ring-2 ring-indigo-500/20"
                : "border-slate-700",
            )}
          >
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "h-10 w-10 flex-shrink-0 rounded-md",
                  preset.preview.bg,
                )}
              >
                <div
                  className={cn(
                    "h-full w-full rounded-md p-1.5",
                    preset.preview.cardBg,
                  )}
                >
                  <div
                    className={cn(
                      "h-1.5 w-4 rounded-sm",
                      preset.preview.accent,
                    )}
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-100">
                  {preset.label}
                </div>
                <div className="text-xs text-slate-400 truncate">
                  {preset.description}
                </div>
              </div>
            </div>
            {preset.default && (
              <div className="absolute top-1 right-1 text-[10px] text-indigo-400 font-medium">
                Default
              </div>
            )}
            {selectedId === preset.id && (
              <div className="absolute bottom-1 right-1">
                <svg
                  className="h-4 w-4 text-indigo-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export function getDefaultPreset(): StylePreset {
  return STYLE_PRESETS.find((p) => p.default) || STYLE_PRESETS[0];
}

export function getPresetById(id: string): StylePreset | undefined {
  return STYLE_PRESETS.find((p) => p.id === id);
}
