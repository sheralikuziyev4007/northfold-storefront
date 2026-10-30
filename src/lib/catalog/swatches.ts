/** Maps colour option names to swatch colours. Unknown names fall back to a neutral grey. */
const SWATCHES: Record<string, string> = {
  loden: '#3D5A4B',
  charcoal: '#2F3533',
  oat: '#D7D3C8',
  'slate blue': '#6E7F92',
  white: '#FFFFFF',
  khaki: '#8A7F6A',
  black: '#1E2422',
  grey: '#8A918D',
  gray: '#8A918D',
  green: '#4F7A55',
  olive: '#6B6B3A',
  navy: '#24324A',
  blue: '#3E64A8',
  ocean: '#2F6F8F',
  red: '#A23B2E',
  purple: '#6A4C8C',
  pink: '#D79AA6',
  brown: '#6B4E3A',
  beige: '#D9CBB0',
  cream: '#EEE7D6',
  yellow: '#D9B13B',
  orange: '#C8692F',
  clay: '#B0705A',
};

export function swatchFor(name: string): string {
  return SWATCHES[name.trim().toLowerCase()] ?? '#B5BAB6';
}
