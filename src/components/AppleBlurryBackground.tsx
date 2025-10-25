import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';

const BASE_COLORS = ['#00FF9F', '#00B2FF', '#7F00FF', '#FF00F7', '#FFDD00'];
const GOLDEN_RATIO_CONJUGATE = 0.61803398875;
const GOLDEN_ANGLE = 2 * Math.PI * GOLDEN_RATIO_CONJUGATE;

type HSL = { h: number; s: number; l: number };
type RGB = { r: number; g: number; b: number };

type SphereBase = {
  id: string;
  size: number;
  x: string;
  y: string;
  blur: number;
  opacity: number;
  duration: number;
  parallaxSpeed: number;
};

type Sphere = SphereBase & { color: string };

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const clampRange = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const hexToRgb = (hex: string): RGB => {
  const parsed = hex.replace('#', '');
  const bigint = parseInt(parsed, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
};

const rgbToHex = ({ r, g, b }: RGB): string => {
  const toHex = (val: number) => val.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
};

const rgbToHsl = ({ r, g, b }: RGB): HSL => {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn:
        h = (gn - bn) / d + (gn < bn ? 6 : 0);
        break;
      case gn:
        h = (bn - rn) / d + 2;
        break;
      default:
        h = (rn - gn) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h, s, l };
};

const hslToRgb = ({ h, s, l }: HSL): RGB => {
  if (s === 0) {
    const value = Math.round(l * 255);
    return { r: value, g: value, b: value };
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  const r = hue2rgb(p, q, h + 1 / 3);
  const g = hue2rgb(p, q, h);
  const b = hue2rgb(p, q, h - 1 / 3);

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
};

const hexToHsl = (hex: string): HSL => rgbToHsl(hexToRgb(hex));
const hslToHex = (hsl: HSL): string => rgbToHex(hslToRgb(hsl));

const rgbToCss = ({ r, g, b }: RGB) => `rgb(${r}, ${g}, ${b})`;

const hexToRgbCss = (hex: string) => rgbToCss(hexToRgb(hex));

const enhanceHsl = ({ h, s, l }: HSL): HSL => ({
  h,
  s: clamp01(0.9 + s * 0.1),
  l: clamp01(0.5 + (l - 0.5) * 0.2),
});

type HslAdjust = {
  hue?: number;
  saturation?: number;
  lightness?: number;
};

const adjustHsl = (hsl: HSL, { hue = 0, saturation = 0, lightness = 0 }: HslAdjust): HSL => ({
  h: (hsl.h + hue + 1) % 1,
  s: clamp01(hsl.s + saturation),
  l: clamp01(hsl.l + lightness),
});

const hslToCssString = (hsl: HSL) => rgbToCss(hslToRgb(hsl));

const hslToRgbaString = (hsl: HSL, alpha: number) => {
  const { r, g, b } = hslToRgb(hsl);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const createPulseSequence = (color: string, blur: number, hash: number) => {
  const loopSequence = (values: string[]) => [...values, values[0]];
  const base = enhanceHsl(hexToHsl(color));
  const depthFactor = clamp01(blur / 24);
  const hueWave = 0.036 + (hash % 12) * 0.002;
  const hueWaveAlt = -0.038 - (hash % 9) * 0.0018;
  const saturationLift = 0.12 + (1 - depthFactor) * 0.06;
  const lightLift = 0.1 + (1 - depthFactor) * 0.08;

  const innerA = adjustHsl(base, { saturation: saturationLift, lightness: lightLift });
  const innerB = adjustHsl(innerA, { hue: hueWave, lightness: -0.03 });
  const innerC = adjustHsl(innerA, { hue: hueWaveAlt, lightness: 0.03 });

  const midA = adjustHsl(base, { saturation: saturationLift * 0.6, lightness: lightLift * 0.4 });
  const midB = adjustHsl(midA, { hue: hueWave * 0.9, lightness: -0.04 });
  const midC = adjustHsl(midA, { hue: hueWaveAlt * 0.85, lightness: 0.04 });

  const outerA = adjustHsl(base, { saturation: saturationLift * 0.35, lightness: lightLift * 0.2 });
  const outerB = adjustHsl(outerA, { hue: hueWave * 0.7, lightness: 0.03 });
  const outerC = adjustHsl(outerA, { hue: hueWaveAlt * 0.75, lightness: -0.03 });

  return {
    inner: loopSequence([
      hslToCssString(innerA),
      hslToCssString(innerB),
      hslToCssString(innerC),
      hslToCssString(innerB),
    ]),
    mid: loopSequence([
      hslToCssString(midA),
      hslToCssString(midB),
      hslToCssString(midC),
      hslToCssString(midB),
    ]),
    outer: loopSequence([
      hslToRgbaString(outerA, 0.7),
      hslToRgbaString(outerB, 0.62),
      hslToRgbaString(outerC, 0.58),
      hslToRgbaString(outerB, 0.62),
    ]),
  };
};

type LayoutOptions = {
  centerX?: number;
  centerY?: number;
  radiusMin: number;
  radiusMax: number;
  spreadX: number;
  spreadY: number;
  angleOffset?: number;
  arms?: number;
  twist?: number;
  armSpread?: number;
  jitter?: number;
};

type LayerDefinition = {
  count: number;
  options: LayoutOptions;
};

const pseudoRandom = (seed: number) => {
  const x = Math.sin(seed) * 43758.5453;
  return x - Math.floor(x);
};

const toPercent = (value: number) => `${(clamp01(value) * 100).toFixed(2)}%`;
const toPercentUnclamped = (value: number) => `${(value * 100).toFixed(2)}%`;

const generatePositions = (count: number, options: LayoutOptions, seedOffset: number) => {
  const {
    centerX = 0.5,
    centerY = 0.5,
    radiusMin,
    radiusMax,
    spreadX,
    spreadY,
    angleOffset = 0,
    arms = 1,
    twist = 4,
    armSpread = 0.12,
    jitter = 0,
  } = options;

  const positions: Array<{ x: string; y: string }> = [];

  for (let i = 0; i < count; i++) {
    const armIndex = i % arms;
    const radialNorm = Math.pow((i + 0.5) / count, 0.6);
    const radius = radiusMin + (radiusMax - radiusMin) * radialNorm;
    const baseArmAngle = angleOffset + (armIndex / arms) * (2 * Math.PI);
    const spiralTwist = radialNorm * twist;
    const goldenVariation = (seedOffset + i + 1) * GOLDEN_ANGLE * 0.18;
    const angle = baseArmAngle + spiralTwist + goldenVariation;
    const armOffsetMagnitude = (pseudoRandom(seedOffset * 13.57 + i * 5.91) - 0.5) * armSpread * radius;
    const perpAngle = angle + Math.PI / 2;
    const baseX =
      centerX +
      Math.cos(angle) * radius * spreadX +
      Math.cos(perpAngle) * armOffsetMagnitude * spreadX;
    const baseY =
      centerY +
      Math.sin(angle) * radius * spreadY +
      Math.sin(perpAngle) * armOffsetMagnitude * spreadY;
    const jitterSeed = seedOffset * 23.41 + i * 11.17;
    const jx = (pseudoRandom(jitterSeed) - 0.5) * jitter * (1 - radialNorm);
    const jy = (pseudoRandom(jitterSeed + 1) - 0.5) * jitter * (1 - radialNorm);
    positions.push({
      x: toPercent(baseX + jx),
      y: toPercent(baseY + jy),
    });
  }

  return positions;
};

const applyLayerLayout = (layer: SphereBase[], options: LayoutOptions, seedOffset: number) => {
  const positions = generatePositions(layer.length, options, seedOffset);
  return layer.map((sphere, index) => ({
    ...sphere,
    x: positions[index].x,
    y: positions[index].y,
  }));
};

const composeLayeredLayout = (
  spheres: SphereBase[],
  layers: LayerDefinition[],
  seedOffset: number
) => {
  const positioned: SphereBase[] = [];
  let cursor = 0;

  layers.forEach((layer, layerIndex) => {
    const segment = spheres.slice(cursor, cursor + layer.count);
    const positionedSegment = applyLayerLayout(
      segment,
      layer.options,
      seedOffset + layerIndex * 97
    );
    positioned.push(...positionedSegment);
    cursor += layer.count;
  });

  return positioned;
};

type ParticleSpec = {
  id: string;
  x: string;
  y: string;
  size: number;
  blur: number;
  opacity: number;
  animationDuration: number;
  animationDelay: number;
  color: string;
};

const generateParticleField = (
  count: number,
  palette: string[],
  seedOffset: number
): ParticleSpec[] => {
  const field: ParticleSpec[] = [];
  for (let i = 0; i < count; i++) {
    const baseColor = palette[(seedOffset + i) % palette.length];
    const baseHsl = enhanceHsl(hexToHsl(baseColor));
    const hueJitter = (pseudoRandom(seedOffset * 29.73 + i * 13.91) - 0.5) * 0.16;
    const saturation = clamp01(0.65 + pseudoRandom(seedOffset * 31.17 + i * 9.63) * 0.3);
    const lightness = clamp01(0.06 + pseudoRandom(seedOffset * 33.57 + i * 7.21) * 0.12);
    const rgb = hslToRgb({
      h: (baseHsl.h + hueJitter + 1) % 1,
      s: saturation,
      l: lightness,
    });
    const angle = (i + 1) * GOLDEN_ANGLE * 0.92;
    const radialNorm = Math.pow((i + 0.35) / count, 0.88);
    const radius = 0.1 + radialNorm * 1.45;
    const stretchX = 1.12;
    const stretchY = 1.9;
    const rawCenterX = 0.5 + Math.cos(angle) * radius * stretchX;
    const rawCenterY = 0.52 + Math.sin(angle) * radius * stretchY;
    const centerX = clampRange(rawCenterX, -0.08, 1.08);
    const centerY = clampRange(rawCenterY, -0.12, 1.12);
    const size = 0.45 + pseudoRandom(seedOffset * 37.91 + i * 5.11) * 1.2;
    const blur = 0.6 + pseudoRandom(seedOffset * 41.27 + i * 3.53) * 1.4;
    const opacity = 0.015 + pseudoRandom(seedOffset * 43.61 + i * 4.79) * 0.08;
    const animationDuration = 6 + pseudoRandom(seedOffset * 47.19 + i * 6.37) * 5;
    const animationDelay = pseudoRandom(seedOffset * 53.77 + i * 8.91) * animationDuration * -1;
    field.push({
      id: `particle-${i}`,
      x: toPercentUnclamped(centerX),
      y: toPercentUnclamped(centerY),
      size,
      blur,
      opacity,
      animationDuration,
      animationDelay,
      color: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
    });
  }
  return field;
};


const generatePalette = (count: number): string[] => {
  const palette: string[] = [];
  BASE_COLORS.forEach((base) => {
    if (palette.length < count) {
      palette.push(base.toUpperCase());
    }
  });

  const seeds = BASE_COLORS.map(hexToHsl).map(enhanceHsl);

  let shift = GOLDEN_RATIO_CONJUGATE;
  let index = 0;
  while (palette.length < count) {
    const seed = seeds[index % seeds.length];
    const h = (seed.h + shift) % 1;
    const s = clamp01(0.93 + seed.s * 0.07);
    const l = clamp01(0.6 + (seed.l - 0.5) * 0.35);
    palette.push(hslToHex({ h, s, l }));
    shift = (shift + GOLDEN_RATIO_CONJUGATE) % 1;
    index++;
  }

  return palette;
};

const applyPalette = (defs: SphereBase[], palette: string[], offset = 0): Sphere[] =>
  defs.map((def, index) => ({
    ...def,
    color: palette[(offset + index) % palette.length],
  }));

const parseRgbString = (rgbString: string): [number, number, number] => {
  const match = rgbString.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (!match) {
    return [255, 255, 255];
  }
  return [Number(match[1]), Number(match[2]), Number(match[3])];
};

const getGodrayAngle = (id: string) => {
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return 105 + (hash % 40) - 20;
};

const createGodrayGradient = (color: string, angle: number, blur: number) => {
  const [r, g, b] = parseRgbString(color);
  const baseHsl = rgbToHsl({ r, g, b });
  const hueShift = ((angle % 360) / 360 - 0.5) * 0.1;
  const rayH = (baseHsl.h + hueShift + 1) % 1;
  const rayS = clamp01(baseHsl.s * 0.85 + 0.1);
  const rayL = clamp01(baseHsl.l + 0.08);
  const { r: rayR, g: rayG, b: rayB } = hslToRgb({ h: rayH, s: rayS, l: rayL });
  const intensity = 0.18 + Math.max(0, (18 - blur) / 44);
  const rayColor = `rgba(${rayR}, ${rayG}, ${rayB}, ${intensity.toFixed(2)})`;
  return `linear-gradient(${angle}deg, ${rayColor} 0%, rgba(${rayR}, ${rayG}, ${rayB}, 0) 60%)`;
};

const RAW_BASE_SPHERES: SphereBase[] = [
  // Large layer – soft halo verso i bordi per lasciare respiro al centro
  {
    id: 'large-1',
    size: 360,
    x: '12%',
    y: '6%',
    blur: 12,
    opacity: 0.74,
    duration: 30,
    parallaxSpeed: 0.056,
  },
  {
    id: 'large-2',
    size: 340,
    x: '50%',
    y: '4%',
    blur: 11.5,
    opacity: 0.72,
    duration: 29,
    parallaxSpeed: 0.058,
  },
  {
    id: 'large-3',
    size: 360,
    x: '88%',
    y: '8%',
    blur: 12,
    opacity: 0.74,
    duration: 30,
    parallaxSpeed: 0.057,
  },
  {
    id: 'large-4',
    size: 360,
    x: '14%',
    y: '92%',
    blur: 12.5,
    opacity: 0.75,
    duration: 31,
    parallaxSpeed: 0.055,
  },
  {
    id: 'large-5',
    size: 340,
    x: '50%',
    y: '94%',
    blur: 11.5,
    opacity: 0.73,
    duration: 30,
    parallaxSpeed: 0.056,
  },
  {
    id: 'large-6',
    size: 360,
    x: '86%',
    y: '90%',
    blur: 12.5,
    opacity: 0.75,
    duration: 31,
    parallaxSpeed: 0.055,
  },

  // Medium layer – copertura uniforme centro/sfalsata
  {
    id: 'medium-1',
    size: 260,
    x: '26%',
    y: '26%',
    blur: 7,
    opacity: 0.86,
    duration: 22,
    parallaxSpeed: 0.175,
  },
  {
    id: 'medium-2',
    size: 250,
    x: '74%',
    y: '24%',
    blur: 6.8,
    opacity: 0.86,
    duration: 22,
    parallaxSpeed: 0.176,
  },
  {
    id: 'medium-3',
    size: 252,
    x: '18%',
    y: '48%',
    blur: 7.2,
    opacity: 0.85,
    duration: 21,
    parallaxSpeed: 0.182,
  },
  {
    id: 'medium-4',
    size: 252,
    x: '82%',
    y: '50%',
    blur: 7.2,
    opacity: 0.85,
    duration: 21,
    parallaxSpeed: 0.183,
  },
  {
    id: 'medium-5',
    size: 246,
    x: '38%',
    y: '64%',
    blur: 6.6,
    opacity: 0.84,
    duration: 21,
    parallaxSpeed: 0.19,
  },
  {
    id: 'medium-6',
    size: 246,
    x: '62%',
    y: '64%',
    blur: 6.6,
    opacity: 0.84,
    duration: 21,
    parallaxSpeed: 0.191,
  },
  {
    id: 'medium-7',
    size: 238,
    x: '30%',
    y: '82%',
    blur: 6.2,
    opacity: 0.83,
    duration: 20,
    parallaxSpeed: 0.188,
  },
  {
    id: 'medium-8',
    size: 238,
    x: '70%',
    y: '80%',
    blur: 6.2,
    opacity: 0.83,
    duration: 20,
    parallaxSpeed: 0.189,
  },
  {
    id: 'medium-9',
    size: 254,
    x: '50%',
    y: '38%',
    blur: 6.9,
    opacity: 0.85,
    duration: 21,
    parallaxSpeed: 0.178,
  },
  {
    id: 'medium-10',
    size: 244,
    x: '50%',
    y: '70%',
    blur: 6.5,
    opacity: 0.84,
    duration: 21,
    parallaxSpeed: 0.186,
  },

  // Small layer – dettaglio vicino al contenuto
  {
    id: 'small-1',
    size: 180,
    x: '40%',
    y: '34%',
    blur: 2.4,
    opacity: 0.9,
    duration: 14,
    parallaxSpeed: 0.42,
  },
  {
    id: 'small-2',
    size: 180,
    x: '60%',
    y: '34%',
    blur: 2.4,
    opacity: 0.9,
    duration: 14,
    parallaxSpeed: 0.423,
  },
  {
    id: 'small-3',
    size: 178,
    x: '32%',
    y: '52%',
    blur: 2.2,
    opacity: 0.89,
    duration: 14,
    parallaxSpeed: 0.435,
  },
  {
    id: 'small-4',
    size: 178,
    x: '68%',
    y: '52%',
    blur: 2.2,
    opacity: 0.89,
    duration: 14,
    parallaxSpeed: 0.436,
  },
  {
    id: 'small-5',
    size: 172,
    x: '44%',
    y: '70%',
    blur: 2.1,
    opacity: 0.88,
    duration: 13,
    parallaxSpeed: 0.446,
  },
  {
    id: 'small-6',
    size: 172,
    x: '56%',
    y: '70%',
    blur: 2.1,
    opacity: 0.88,
    duration: 13,
    parallaxSpeed: 0.448,
  },
  {
    id: 'small-7',
    size: 170,
    x: '48%',
    y: '46%',
    blur: 2,
    opacity: 0.88,
    duration: 13,
    parallaxSpeed: 0.43,
  },
  {
    id: 'small-8',
    size: 170,
    x: '52%',
    y: '58%',
    blur: 2,
    opacity: 0.88,
    duration: 13,
    parallaxSpeed: 0.432,
  },

  // Tiny sparkles – luminanza centrale
  {
    id: 'tiny-1',
    size: 140,
    x: '46%',
    y: '44%',
    blur: 1.2,
    opacity: 0.96,
    duration: 11,
    parallaxSpeed: 0.58,
  },
  {
    id: 'tiny-2',
    size: 140,
    x: '54%',
    y: '44%',
    blur: 1.2,
    opacity: 0.96,
    duration: 11,
    parallaxSpeed: 0.581,
  },
  {
    id: 'tiny-3',
    size: 138,
    x: '44%',
    y: '56%',
    blur: 1.1,
    opacity: 0.96,
    duration: 11,
    parallaxSpeed: 0.59,
  },
  {
    id: 'tiny-4',
    size: 138,
    x: '56%',
    y: '56%',
    blur: 1.1,
    opacity: 0.96,
    duration: 11,
    parallaxSpeed: 0.591,
  },
  {
    id: 'tiny-5',
    size: 136,
    x: '50%',
    y: '62%',
    blur: 1.1,
    opacity: 0.95,
    duration: 11,
    parallaxSpeed: 0.6,
  },
  {
    id: 'tiny-6',
    size: 136,
    x: '50%',
    y: '38%',
    blur: 1.1,
    opacity: 0.95,
    duration: 11,
    parallaxSpeed: 0.599,
  },
];

const BASE_BLUR_RANGE = RAW_BASE_SPHERES.reduce(
  (acc, sphere) => ({
    min: Math.min(acc.min, sphere.blur),
    max: Math.max(acc.max, sphere.blur),
  }),
  { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY }
);
const BASE_MIN_BLUR = BASE_BLUR_RANGE.min;
const BASE_MAX_BLUR = BASE_BLUR_RANGE.max;

const BASE_LAYER_LAYOUTS: LayerDefinition[] = [
  {
    count: 4,
    options: {
      centerX: 0.5,
      centerY: 0.5,
      radiusMin: 0.68,
      radiusMax: 0.9,
      spreadX: 0.62,
      spreadY: 0.94,
      arms: 4,
      twist: 4.2,
      armSpread: 0.14,
      jitter: 0.02,
      angleOffset: 0.25,
    },
  },
  {
    count: 8,
    options: {
      centerX: 0.5,
      centerY: 0.5,
      radiusMin: 0.38,
      radiusMax: 0.64,
      spreadX: 0.5,
      spreadY: 0.76,
      arms: 8,
      twist: 3.6,
      armSpread: 0.1,
      jitter: 0.024,
      angleOffset: 0.35,
    },
  },
  {
    count: 8,
    options: {
      centerX: 0.5,
      centerY: 0.5,
      radiusMin: 0.2,
      radiusMax: 0.42,
      spreadX: 0.38,
      spreadY: 0.6,
      arms: 10,
      twist: 3.1,
      armSpread: 0.08,
      jitter: 0.03,
      angleOffset: 0.78,
    },
  },
  {
    count: 4,
    options: {
      centerX: 0.5,
      centerY: 0.5,
      radiusMin: 0.12,
      radiusMax: 0.24,
      spreadX: 0.26,
      spreadY: 0.38,
      arms: 12,
      twist: 2.8,
      armSpread: 0.06,
      jitter: 0.028,
      angleOffset: 1.42,
    },
  },
];

const BASE_POSITIONED = composeLayeredLayout(RAW_BASE_SPHERES, BASE_LAYER_LAYOUTS, 150);

const PALETTE_SIZE = RAW_BASE_SPHERES.length + 8;
const VIBRANT_PALETTE = generatePalette(PALETTE_SIZE);

type ViewportTransform = {
  scaleX: number;
  scaleY: number;
  translateX?: number;
  translateY?: number;
  sizeMultiplier: number;
};

const VIEWPORT_TRANSFORMS: Record<'mobile' | 'desktop', ViewportTransform> = {
  mobile: {
    scaleX: 1.06,
    scaleY: 1.22,
    translateX: 0.012,
    translateY: 0.012,
    sizeMultiplier: 0.92,
  },
  desktop: {
    scaleX: 1.26,
    scaleY: 1.38,
    translateX: 0.032,
    translateY: -0.05,
    sizeMultiplier: 1.18,
  },
};

const percentStringToDecimal = (value: string) => {
  const parsed = parseFloat(value);
  if (Number.isNaN(parsed)) {
    return 0.5;
  }
  return parsed / 100;
};

const clampViewportValue = (value: number) => clampRange(value, -0.22, 1.35);

const distributeSpheresUniformly = (spheres: SphereBase[]): SphereBase[] => {
  if (spheres.length <= 1) {
    return spheres;
  }

  const sorted = spheres
    .map((sphere, index) => ({
      sphere,
      index,
      y: percentStringToDecimal(sphere.y),
    }))
    .sort((a, b) => a.y - b.y);

  const topOvershoot = 0.14;
  const bottomOvershoot = 0.14;
  const verticalSpan = 1 + topOvershoot + bottomOvershoot;

  const paletteSpread = [0.18, 0.5, 0.82, 0.32, 0.68, 0.5];

  const redistributed = sorted.map((entry, order) => {
    const normalized = sorted.length > 1 ? order / (sorted.length - 1) : 0.5;
    const targetY = -topOvershoot + normalized * verticalSpan;
    const jitterSeed = entry.index * 37.19 + order * 17.41;
    const edgeAttenuation = 0.015 + 0.06 * (normalized * (1 - normalized));
    const jitter = (pseudoRandom(jitterSeed) - 0.5) * edgeAttenuation;
    const distributedY = clampViewportValue(targetY + jitter);

    const baseColumn = paletteSpread[order % paletteSpread.length];
    const horizontalSeed = entry.index * 29.73 + order * 11.29;
    const columnJitter = (pseudoRandom(horizontalSeed) - 0.5) * 0.035;
    const distributedX = clampViewportValue(baseColumn + columnJitter);

    return {
      ...entry.sphere,
      x: toPercentUnclamped(distributedX),
      y: toPercentUnclamped(distributedY),
    };
  });

  const output: SphereBase[] = Array(spheres.length);
  redistributed.forEach((updatedSphere, order) => {
    const originalIndex = sorted[order].index;
    output[originalIndex] = updatedSphere;
  });

  return output;
};

const transformSpheresForViewport = (
  spheres: SphereBase[],
  transform: ViewportTransform
): SphereBase[] => {
  const { scaleX, scaleY, translateX = 0, translateY = 0, sizeMultiplier } = transform;

  return spheres.map((sphere) => {
    const xDecimal = percentStringToDecimal(sphere.x);
    const yDecimal = percentStringToDecimal(sphere.y);
    const centeredX = xDecimal - 0.5;
    const centeredY = yDecimal - 0.5;

    const adjustedX = clampViewportValue(0.5 + centeredX * scaleX + translateX);
    const adjustedY = clampViewportValue(0.5 + centeredY * scaleY + translateY);

    const depthRatio =
      BASE_MAX_BLUR === BASE_MIN_BLUR
        ? 0.5
        : clamp01((sphere.blur - BASE_MIN_BLUR) / (BASE_MAX_BLUR - BASE_MIN_BLUR));
    const sizeDepthMultiplier = 0.78 + depthRatio * 0.62;
    const blurDepthMultiplier = 0.8 + depthRatio * 1.25;
    const opacityDepthMultiplier = 0.54 + (1 - depthRatio) * 0.46;
    const parallaxDepthMultiplier = 0.38 + (1 - depthRatio) * 0.72;

    return {
      ...sphere,
      size: sphere.size * sizeMultiplier * sizeDepthMultiplier,
      blur: sphere.blur * blurDepthMultiplier,
      opacity: clamp01(sphere.opacity * opacityDepthMultiplier),
      parallaxSpeed: sphere.parallaxSpeed * parallaxDepthMultiplier,
      x: toPercentUnclamped(adjustedX),
      y: toPercentUnclamped(adjustedY),
    };
  });
};

const createViewportSpheres = (transform: ViewportTransform, palette: string[]) =>
  applyPalette(
    distributeSpheresUniformly(transformSpheresForViewport(BASE_POSITIONED, transform)),
    palette
  );

const MOBILE_SPHERES = createViewportSpheres(VIEWPORT_TRANSFORMS.mobile, VIBRANT_PALETTE);
const DESKTOP_SPHERES = createViewportSpheres(VIEWPORT_TRANSFORMS.desktop, VIBRANT_PALETTE);
const PARTICLE_FIELD = generateParticleField(90, VIBRANT_PALETTE, 620);
const PARTICLE_TWINKLE_STYLE_ID = 'galaxy-particle-twinkle';
const PARTICLE_TWINKLE_KEYFRAMES = `
@keyframes galaxy-particle-twinkle {
  0%, 100% {
    opacity: 0.4;
  }
  45% {
    opacity: 1;
  }
  60% {
    opacity: 0.6;
  }
}
`;

export function AppleBlurryBackground() {
  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  
  // Scroll tracking per parallax effect SINCRONIZZATO
  const { scrollY } = useScroll();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (shouldReduceMotion) return;
    if (typeof document === 'undefined') return;
    let styleEl = document.getElementById(PARTICLE_TWINKLE_STYLE_ID);
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = PARTICLE_TWINKLE_STYLE_ID;
      styleEl.textContent = PARTICLE_TWINKLE_KEYFRAMES;
      document.head.appendChild(styleEl);
    }
  }, [shouldReduceMotion]);
  const spheres = isMobile ? MOBILE_SPHERES : DESKTOP_SPHERES;
  
  // Componente sfera con parallax SINCRONIZZATO allo scroll
  const ParallaxSphere = ({ sphere }: { sphere: Sphere }) => {
    // Parallax Y direttamente proporzionale a scrollY (ILLIMITATO)
    // Quando scrolli 100px, la sfera si muove di (100 * parallaxSpeed)px
    const parallaxY = useTransform(
      scrollY,
      (latest) => -latest * sphere.parallaxSpeed // Negativo = verso l'alto
    );
    
    // Combina il centering (-50%) con il parallax usando calc()
    const yWithCentering = useTransform(
      parallaxY,
      (y) => `calc(-50% + ${y}px)`
    );
    
    // DEPTH OF FIELD ENHANCEMENT - Colori analoghi vibranti
    const sphereHash = sphere.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const pulseSequence = createPulseSequence(sphere.color, sphere.blur, sphereHash);
    const initialPulse = {
      inner: pulseSequence.inner[0],
      mid: pulseSequence.mid[0],
      outer: pulseSequence.outer[0],
    };
    const getDepthEnhancedColor = (color: string, blur: number) => {
      const depthFactor = clamp01(blur / 24);
      const baseHsl = enhanceHsl(hexToHsl(color));
      const hueOffset = ((sphereHash % 15) - 7) * 0.02 + depthFactor * 0.02;
      const targetHue = (baseHsl.h + hueOffset + 1) % 1;
      const targetSaturation = clamp01(0.96 + (1 - depthFactor) * 0.04);
      const targetLightness = clamp01(0.28 + (1 - depthFactor) * 0.16);
      return rgbToCss(
        hslToRgb({
          h: targetHue,
          s: targetSaturation,
          l: targetLightness,
        })
      );
    };
    // Calcola gradient stop in base alla distanza (blur)
    // Vicino: gradient denso fino a 78%
    // Lontano: gradient diffuso fino a 92% (più soft, simula diffusione luce)
    const getGradientStop = (blur: number) => {
      // blur 1-2px → 78%
      // blur 10-12px → 85%
      // blur 21-24px → 92%
      return Math.min(78 + (blur / 24) * 14, 92);
    };
    
    // ORGANIC MOTION PATTERNS - Pattern diversificati per ogni sfera basati su ID
    // Usa l'ID per generare pattern deterministici ma variati
    const getMotionPattern = (id: string, size: number, blur: number) => {
      // Hash dell'ID per generare numeri pseudo-casuali ma consistenti
      const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const patternType = hash % 4; // 4 pattern diversi
      
      // Ampiezza movimento in base al blur (sfere lontane = movimento più ampio)
      // blur 1-2px (vicino): ±50-65px
      // blur 10-12px (medio): ±75-90px
      // blur 21-24px (lontano): ±95-115px
      const baseAmplitude = 50 + (blur / 24) * 65; // Range 50-115px
      const xAmp = baseAmplitude * (0.9 + (hash % 20) / 100); // Variazione ±10%
      const yAmp = baseAmplitude * (0.85 + (hash % 25) / 100); // Leggermente diverso per ellisse
      
      // Pattern di movimento organico con 5 keyframes per smoothness
      switch(patternType) {
        case 0: // Ellipse orizzontale (movimento tipo onda)
          return {
            x: [0, xAmp * 0.85, xAmp * 0.3, -xAmp * 0.7, 0],
            y: [0, -yAmp * 0.5, yAmp * 0.65, yAmp * 0.4, 0]
          };
        case 1: // Ellipse verticale (movimento tipo galleggiamento)
          return {
            x: [0, xAmp * 0.5, -xAmp * 0.4, xAmp * 0.6, 0],
            y: [0, -yAmp * 0.8, -yAmp * 0.2, yAmp * 0.75, 0]
          };
        case 2: // Pattern circolare (movimento tipo orbita)
          return {
            x: [0, xAmp * 0.7, 0, -xAmp * 0.7, 0],
            y: [0, -yAmp * 0.7, 0, yAmp * 0.7, 0]
          };
        case 3: // Pattern figura-8 (movimento tipo infinity)
          return {
            x: [0, xAmp * 0.65, -xAmp * 0.65, xAmp * 0.65, 0],
            y: [0, yAmp * 0.5, 0, -yAmp * 0.5, 0]
          };
        default:
          return {
            x: [0, xAmp * 0.7, -xAmp * 0.5, 0],
            y: [0, -yAmp * 0.6, yAmp * 0.7, 0]
          };
      }
    };
    
    const motionPattern = getMotionPattern(sphere.id, sphere.size, sphere.blur);
    
    const enhancedColor = getDepthEnhancedColor(sphere.color, sphere.blur);
    const gradientStop = getGradientStop(sphere.blur);
    const rayAngle = getGodrayAngle(sphere.id);
    const radialGradient = `radial-gradient(circle at center, var(--pulse-color-inner) 0%, var(--pulse-color-mid) 48%, var(--pulse-color-outer) ${gradientStop}%, transparent 100%)`;
    const godrayGradient = createGodrayGradient(enhancedColor, rayAngle, sphere.blur);
    
    const animationConfig = shouldReduceMotion
      ? {}
      : {
          translateX: motionPattern.x,
          translateY: motionPattern.y,
          scale: [
            1,
            1.08,
            1,
            0.95,
            1
          ],
          rotate: [
            0,
            2.5,
            0,
            -1.8,
            0
          ],
          '--pulse-color-inner': pulseSequence.inner,
          '--pulse-color-mid': pulseSequence.mid,
          '--pulse-color-outer': pulseSequence.outer,
        };

    return (
      <motion.div
        className="absolute rounded-full"
        style={{
          width: sphere.size,
          height: sphere.size,
          left: sphere.x,
          top: sphere.y,
          // DEPTH-ENHANCED GRADIENT - Più soft per sfere lontane!
          backgroundImage: `${godrayGradient}, ${radialGradient}`,
          filter: `blur(${sphere.blur}px)`,
          opacity: sphere.opacity,
          // Motion transform system - Centering STATICO, animazione SEPARATA
          x: '-50%', // Centra orizzontalmente - NON animare questo!
          y: shouldReduceMotion ? '-50%' : yWithCentering, // Centra verticalmente + parallax
          willChange: shouldReduceMotion ? 'auto' : 'transform, opacity',
          backfaceVisibility: 'hidden',
          '--pulse-color-inner': initialPulse.inner,
          '--pulse-color-mid': initialPulse.mid,
          '--pulse-color-outer': initialPulse.outer,
        } as CSSProperties}
        // Animazione organica MULTIDIREZIONALE - Pattern ellittici/circolari naturali!
        animate={animationConfig}
        transition={{
          duration: sphere.duration,
          repeat: Infinity,
          ease: [0.37, 0, 0.63, 1], // easeInOut SMOOTH - interpola perfettamente!
          repeatType: 'loop'
        }}
      />
    );
  };

  return (
    <div 
      className="resume-background absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Background layer - Subtle depth */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.008) 0%, transparent 50%)',
        }}
      />

      <div className="absolute inset-0 pointer-events-none">
        {PARTICLE_FIELD.map((particle: ParticleSpec) => (
          <div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: particle.x,
              top: particle.y,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              background: `radial-gradient(circle, ${particle.color} 0%, rgba(0, 0, 0, 0) 70%)`,
              opacity: particle.opacity,
              filter: `blur(${particle.blur}px)`,
              transform: 'translate(-50%, -50%)',
              animation: shouldReduceMotion
                ? undefined
                : `galaxy-particle-twinkle ${particle.animationDuration}s ease-in-out ${particle.animationDelay}s infinite alternate`,
            }}
          />
        ))}
      </div>
      
      {spheres.map((sphere: Sphere) => (
        <ParallaxSphere key={sphere.id} sphere={sphere} />
      ))}
      
      {/* Vignette overlay MINIMISSIMO - quasi rimosso */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at center, transparent 60%, rgba(10, 10, 10, 0.08) 100%)
          `,
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}
