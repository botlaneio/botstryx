import {defineTheme} from '@astryxdesign/core/theme';
import {neutralTheme} from '@astryxdesign/theme-neutral';

/**
 * Botlane on Astryx.
 *
 * The site is neutral: ink on a cool paper grey in light, the reverse in dark. Colour is held back so the
 * electric blue reads as a signature (it lives in globals.css as --bl-blue, used by the logo square, never by
 * controls).
 *
 * Fonts come from next/font, which exposes them as CSS variables on <html>.
 */
const SANS = 'var(--font-instrument), "Instrument Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif';
const MONO = 'var(--font-jetbrains), "JetBrains Mono", ui-monospace, "SF Mono", Consolas, monospace';

export const botlaneTheme = defineTheme({
  name: 'botlane',
  extends: neutralTheme,

  typography: {
    scale: {base: 15, ratio: 1.2},
    body: {family: 'Instrument Sans', fallbacks: 'sans-serif'},
    heading: {family: 'Instrument Sans', fallbacks: 'sans-serif'},
    code: {family: 'JetBrains Mono', fallbacks: 'monospace'},
  },

  // A lift for discrete changes, quick for hover and press.
  motion: {fast: 140, medium: 320, slow: 700, ratio: 0.75},

  tokens: {
    '--font-family-body': SANS,
    '--font-family-heading': SANS,
    '--font-family-code': MONO,

    // Surfaces: the Botlane neutral scale.
    '--color-background-body': ['#F2F3F5', '#0B0C0E'],
    '--color-background-surface': ['#FFFFFF', '#101114'],
    '--color-background-card': ['#FFFFFF', '#131518'],
    '--color-background-popover': ['#FFFFFF', '#16181C'],
    '--color-background-muted': ['#E8E9EC', '#1C1F24'],

    // Text and icons.
    '--color-text-primary': ['#16181C', '#EDEEF0'],
    '--color-text-secondary': ['#5A606B', '#9BA1AB'],
    '--color-icon-primary': ['#16181C', '#EDEEF0'],
    '--color-icon-secondary': ['#5A606B', '#9BA1AB'],

    // Hairlines.
    '--color-border': ['#D6D9DE', '#2B2F36'],
    '--color-border-emphasized': ['#AEB3BB', '#484D57'],

    // Primary is ink, not colour.
    '--color-accent': ['#16181C', '#EDEEF0'],
    '--color-on-accent': ['#FCFCFD', '#0B0C0E'],
    '--color-text-accent': ['#16181C', '#EDEEF0'],
    '--color-icon-accent': ['#16181C', '#EDEEF0'],

    // Precise, not soft.
    '--radius-inner': '5px',
    '--radius-element': '9px',
    '--radius-container': '14px',
  },

  components: {
    button: {
      base: {fontWeight: '550', letterSpacing: '-0.01em'},
    },
  },
});
