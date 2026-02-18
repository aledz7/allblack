// theme.ts
import { vars } from "nativewind";

// ============================================================================
// FONT CONFIGURATION
// ============================================================================
export interface ThemeFonts {
  heading: {
    family: string;
    weights: Record<string, string>;
  };
  body: {
    family: string;
    weights: Record<string, string>;
  };
  mono: {
    family: string;
    weights: Record<string, string>;
  };
}

export const themeFonts: ThemeFonts = {
  heading: {
    family: 'Inter',
    weights: {
      normal: 'Inter_400Regular',
      medium: 'Inter_500Medium',
      semibold: 'Inter_600SemiBold',
      bold: 'Inter_700Bold',
    },
  },
  body: {
    family: 'Inter',
    weights: {
      normal: 'Inter_400Regular',
      medium: 'Inter_500Medium',
      semibold: 'Inter_600SemiBold',
    },
  },
  mono: {
    family: 'JetBrainsMono',
    weights: {
      normal: 'JetBrainsMono_400Regular',
      medium: 'JetBrainsMono_500Medium',
    },
  },
};

// ============================================================================
// ALL BLACK THEME CONFIGURATION
// ============================================================================
// Design Request:
// - Background: #000000 (Pure Black)
// - Cards: #1a1a1a or #2a2a2a
// - Text: #ffffff (Titles), #b0b0b0 (Secondary)
// - Accents: #00ff88 (Neon Green), #ffd700 (Gold), #ff4444 (Red)
// ============================================================================

export const lightTheme = vars({
  "--radius": "12", // Slightly more rounded for modern feel

  // Core semantic colors - Matching "All Black" request
  "--background": "0 0 0", // #000000 Pure Black
  "--foreground": "255 255 255", // #ffffff White text

  "--card": "26 26 26", // #1a1a1a Dark Card
  "--card-foreground": "255 255 255", // #ffffff

  "--popover": "26 26 26", // #1a1a1a
  "--popover-foreground": "255 255 255",

  // Primary Action - Neon Green
  "--primary": "0 255 136", // #00ff88 Neon Green
  "--primary-foreground": "0 0 0", // Black text on green

  // Secondary
  "--secondary": "42 42 42", // #2a2a2a
  "--secondary-foreground": "255 255 255",

  // Muted - Dark Gray for subtle backgrounds
  "--muted": "26 26 26", // #1a1a1a
  "--muted-foreground": "176 176 176", // #b0b0b0 Light Gray

  // Accent
  "--accent": "42 42 42", // #2a2a2a
  "--accent-foreground": "255 255 255",

  // Destructive - Red
  "--destructive": "255 68 68", // #ff4444 Red

  // Borders
  "--border": "42 42 42", // #2a2a2a Subtle borders
  "--input": "26 26 26", // #1a1a1a Input background
  "--ring": "0 255 136", // #00ff88 Focus ring matches primary

  // Chart colors - Vibrant on black
  "--chart-1": "0 255 136", // Neon Green
  "--chart-2": "255 215 0", // Gold
  "--chart-3": "255 68 68", // Red
  "--chart-4": "59 130 246", // Blue
  "--chart-5": "168 85 247", // Purple

  // Sidebar colors
  "--sidebar": "0 0 0", // Black
  "--sidebar-foreground": "255 255 255",
  "--sidebar-primary": "0 255 136",
  "--sidebar-primary-foreground": "0 0 0",
  "--sidebar-accent": "26 26 26",
  "--sidebar-accent-foreground": "255 255 255",
  "--sidebar-border": "42 42 42",
  "--sidebar-ring": "0 255 136",
});

export const darkTheme = vars({
  "--radius": "12",

  // In "All Black" theme, light and dark modes are very similar
  // We keep the pure black aesthetic but ensure high contrast
  
  "--background": "0 0 0", // #000000
  "--foreground": "255 255 255", // #ffffff

  "--card": "26 26 26", // #1a1a1a
  "--card-foreground": "255 255 255",

  "--popover": "42 42 42", // #2a2a2a Slightly lighter for popovers
  "--popover-foreground": "255 255 255",

  "--primary": "0 255 136", // #00ff88 Neon Green
  "--primary-foreground": "0 0 0",

  "--secondary": "42 42 42", // #2a2a2a
  "--secondary-foreground": "255 255 255",

  "--muted": "26 26 26", // #1a1a1a
  "--muted-foreground": "176 176 176", // #b0b0b0

  "--accent": "64 64 64", // #404040
  "--accent-foreground": "255 255 255",

  "--destructive": "255 68 68", // #ff4444

  "--border": "42 42 42", // #2a2a2a
  "--input": "26 26 26", // #1a1a1a
  "--ring": "0 255 136", // #00ff88

  // Chart colors - Same vibrant palette
  "--chart-1": "0 255 136",
  "--chart-2": "255 215 0",
  "--chart-3": "255 68 68",
  "--chart-4": "59 130 246",
  "--chart-5": "168 85 247",

  // Sidebar
  "--sidebar": "0 0 0",
  "--sidebar-foreground": "255 255 255",
  "--sidebar-primary": "0 255 136",
  "--sidebar-primary-foreground": "0 0 0",
  "--sidebar-accent": "26 26 26",
  "--sidebar-accent-foreground": "255 255 255",
  "--sidebar-border": "42 42 42",
  "--sidebar-ring": "0 255 136",
});