import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useEffect, useState } from 'react';

const BASE_COLORS = ['#FFBE0B', '#FB5607', '#FF006E', '#8338EC', '#3A86FF'];
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
  s: clamp01(0.94 + s * 0.06),
  l: clamp01(0.58 + (l - 0.5) * 0.4),
});

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

const RAW_DESKTOP_SPHERES: SphereBase[] = [
  // Layer largo: sfere soffuse agli angoli per creare profondità morbida
  {
    id: 'large-1',
    size: 1080,
    x: '18%',
    y: '18%',
    blur: 22,
    opacity: 0.76,
    duration: 36,
    parallaxSpeed: 0.022
  },
  {
    id: 'large-2',
    size: 1020,
    x: '82%',
    y: '22%',
    blur: 21,
    opacity: 0.74,
    duration: 38,
    parallaxSpeed: 0.024
  },
  {
    id: 'large-3',
    size: 980,
    x: '20%',
    y: '82%',
    blur: 21,
    opacity: 0.73,
    duration: 35,
    parallaxSpeed: 0.026
  },
  {
    id: 'large-4',
    size: 1040,
    x: '82%',
    y: '80%',
    blur: 23,
    opacity: 0.75,
    duration: 37,
    parallaxSpeed: 0.023
  },

  // Layer medio: corona attorno al focus centrale
  {
    id: 'medium-1',
    size: 620,
    x: '32%',
    y: '32%',
    blur: 11,
    opacity: 0.88,
    duration: 24,
    parallaxSpeed: 0.11
  },
  {
    id: 'medium-2',
    size: 610,
    x: '68%',
    y: '30%',
    blur: 10,
    opacity: 0.87,
    duration: 25,
    parallaxSpeed: 0.12
  },
  {
    id: 'medium-3',
    size: 600,
    x: '28%',
    y: '60%',
    blur: 10,
    opacity: 0.86,
    duration: 23,
    parallaxSpeed: 0.13
  },
  {
    id: 'medium-4',
    size: 590,
    x: '72%',
    y: '65%',
    blur: 10,
    opacity: 0.86,
    duration: 26,
    parallaxSpeed: 0.12
  },
  {
    id: 'medium-5',
    size: 580,
    x: '48%',
    y: '24%',
    blur: 9,
    opacity: 0.87,
    duration: 24,
    parallaxSpeed: 0.13
  },
  {
    id: 'medium-6',
    size: 560,
    x: '50%',
    y: '78%',
    blur: 9,
    opacity: 0.86,
    duration: 25,
    parallaxSpeed: 0.14
  },
  {
    id: 'medium-7',
    size: 570,
    x: '15%',
    y: '48%',
    blur: 10,
    opacity: 0.85,
    duration: 27,
    parallaxSpeed: 0.13
  },
  {
    id: 'medium-8',
    size: 555,
    x: '86%',
    y: '48%',
    blur: 10,
    opacity: 0.85,
    duration: 26,
    parallaxSpeed: 0.13
  },

  // Layer piccolo: accenti vicini al centro per guidare lo sguardo
  {
    id: 'small-1',
    size: 250,
    x: '40%',
    y: '40%',
    blur: 2,
    opacity: 0.99,
    duration: 14,
    parallaxSpeed: 0.42
  },
  {
    id: 'small-2',
    size: 245,
    x: '60%',
    y: '42%',
    blur: 2,
    opacity: 0.99,
    duration: 15,
    parallaxSpeed: 0.41
  },
  {
    id: 'small-3',
    size: 238,
    x: '52%',
    y: '60%',
    blur: 2,
    opacity: 0.98,
    duration: 16,
    parallaxSpeed: 0.44
  },
  {
    id: 'small-4',
    size: 230,
    x: '36%',
    y: '58%',
    blur: 2,
    opacity: 0.98,
    duration: 16,
    parallaxSpeed: 0.45
  },
  {
    id: 'small-5',
    size: 240,
    x: '68%',
    y: '50%',
    blur: 2,
    opacity: 0.98,
    duration: 15,
    parallaxSpeed: 0.43
  },
  {
    id: 'small-6',
    size: 232,
    x: '30%',
    y: '48%',
    blur: 2,
    opacity: 0.97,
    duration: 17,
    parallaxSpeed: 0.46
  },
  {
    id: 'small-7',
    size: 228,
    x: '46%',
    y: '72%',
    blur: 2,
    opacity: 0.97,
    duration: 15,
    parallaxSpeed: 0.47
  },
  {
    id: 'small-8',
    size: 226,
    x: '58%',
    y: '72%',
    blur: 2,
    opacity: 0.97,
    duration: 15,
    parallaxSpeed: 0.46
  },

  // Layer tiny: sparkles dinamici vicino al centro
  {
    id: 'tiny-1',
    size: 140,
    x: '44%',
    y: '46%',
    blur: 1,
    opacity: 0.99,
    duration: 11,
    parallaxSpeed: 0.62
  },
  {
    id: 'tiny-2',
    size: 135,
    x: '56%',
    y: '46%',
    blur: 1,
    opacity: 0.99,
    duration: 12,
    parallaxSpeed: 0.63
  },
  {
    id: 'tiny-3',
    size: 132,
    x: '52%',
    y: '54%',
    blur: 1,
    opacity: 0.99,
    duration: 11,
    parallaxSpeed: 0.64
  },
  {
    id: 'tiny-4',
    size: 138,
    x: '48%',
    y: '54%',
    blur: 1,
    opacity: 0.99,
    duration: 12,
    parallaxSpeed: 0.62
  }
];

const RAW_MOBILE_SPHERES: SphereBase[] = [
  // Layer largo
  {
    id: 'large-m1',
    size: 560,
    x: '20%',
    y: '12%',
    blur: 8,
    opacity: 0.95,
    duration: 24,
    parallaxSpeed: 0.08
  },
  {
    id: 'large-m2',
    size: 540,
    x: '80%',
    y: '18%',
    blur: 8,
    opacity: 0.95,
    duration: 25,
    parallaxSpeed: 0.09
  },
  {
    id: 'large-m3',
    size: 520,
    x: '22%',
    y: '82%',
    blur: 7,
    opacity: 0.94,
    duration: 25,
    parallaxSpeed: 0.1
  },
  {
    id: 'large-m4',
    size: 540,
    x: '78%',
    y: '84%',
    blur: 8,
    opacity: 0.95,
    duration: 26,
    parallaxSpeed: 0.09
  },

  // Layer medio
  {
    id: 'medium-m1',
    size: 380,
    x: '32%',
    y: '32%',
    blur: 5,
    opacity: 0.97,
    duration: 20,
    parallaxSpeed: 0.18
  },
  {
    id: 'medium-m2',
    size: 370,
    x: '68%',
    y: '32%',
    blur: 5,
    opacity: 0.97,
    duration: 21,
    parallaxSpeed: 0.19
  },
  {
    id: 'medium-m3',
    size: 365,
    x: '30%',
    y: '58%',
    blur: 5,
    opacity: 0.96,
    duration: 20,
    parallaxSpeed: 0.18
  },
  {
    id: 'medium-m4',
    size: 360,
    x: '70%',
    y: '60%',
    blur: 5,
    opacity: 0.96,
    duration: 21,
    parallaxSpeed: 0.19
  },
  {
    id: 'medium-m5',
    size: 350,
    x: '50%',
    y: '24%',
    blur: 4,
    opacity: 0.96,
    duration: 20,
    parallaxSpeed: 0.2
  },
  {
    id: 'medium-m6',
    size: 348,
    x: '50%',
    y: '74%',
    blur: 4,
    opacity: 0.96,
    duration: 21,
    parallaxSpeed: 0.19
  },
  {
    id: 'medium-m7',
    size: 340,
    x: '18%',
    y: '48%',
    blur: 5,
    opacity: 0.95,
    duration: 22,
    parallaxSpeed: 0.19
  },
  {
    id: 'medium-m8',
    size: 340,
    x: '82%',
    y: '50%',
    blur: 5,
    opacity: 0.95,
    duration: 22,
    parallaxSpeed: 0.2
  },

  // Layer piccolo
  {
    id: 'small-m1',
    size: 248,
    x: '42%',
    y: '38%',
    blur: 2,
    opacity: 0.99,
    duration: 14,
    parallaxSpeed: 0.39
  },
  {
    id: 'small-m2',
    size: 244,
    x: '58%',
    y: '38%',
    blur: 2,
    opacity: 0.99,
    duration: 14,
    parallaxSpeed: 0.38
  },
  {
    id: 'small-m3',
    size: 240,
    x: '48%',
    y: '54%',
    blur: 2,
    opacity: 0.99,
    duration: 15,
    parallaxSpeed: 0.4
  },
  {
    id: 'small-m4',
    size: 236,
    x: '36%',
    y: '52%',
    blur: 2,
    opacity: 0.98,
    duration: 15,
    parallaxSpeed: 0.41
  },
  {
    id: 'small-m5',
    size: 234,
    x: '62%',
    y: '54%',
    blur: 2,
    opacity: 0.98,
    duration: 16,
    parallaxSpeed: 0.41
  },
  {
    id: 'small-m6',
    size: 232,
    x: '40%',
    y: '66%',
    blur: 2,
    opacity: 0.98,
    duration: 15,
    parallaxSpeed: 0.42
  },
  {
    id: 'small-m7',
    size: 228,
    x: '56%',
    y: '66%',
    blur: 2,
    opacity: 0.98,
    duration: 15,
    parallaxSpeed: 0.42
  },
  {
    id: 'small-m8',
    size: 226,
    x: '50%',
    y: '44%',
    blur: 2,
    opacity: 0.98,
    duration: 16,
    parallaxSpeed: 0.4
  },

  // Sparkles
  {
    id: 'tiny-m1',
    size: 150,
    x: '46%',
    y: '46%',
    blur: 1,
    opacity: 0.99,
    duration: 12,
    parallaxSpeed: 0.58
  },
  {
    id: 'tiny-m2',
    size: 148,
    x: '54%',
    y: '46%',
    blur: 1,
    opacity: 0.99,
    duration: 12,
    parallaxSpeed: 0.59
  },
  {
    id: 'tiny-m3',
    size: 146,
    x: '50%',
    y: '50%',
    blur: 1,
    opacity: 0.99,
    duration: 12,
    parallaxSpeed: 0.6
  },
  {
    id: 'tiny-m4',
    size: 148,
    x: '48%',
    y: '54%',
    blur: 1,
    opacity: 0.99,
    duration: 12,
    parallaxSpeed: 0.59
  }
];

const DESKTOP_LAYER_LAYOUTS: LayerDefinition[] = [
  {
    count: 4,
    options: {
      centerX: 0.5,
      centerY: 0.5,
      radiusMin: 0.62,
      radiusMax: 0.95,
      spreadX: 0.6,
      spreadY: 0.82,
      arms: 3,
      twist: 7,
      armSpread: 0.24,
      jitter: 0.05,
      angleOffset: 0.08,
    },
  },
  {
    count: 8,
    options: {
      centerX: 0.5,
      centerY: 0.5,
      radiusMin: 0.34,
      radiusMax: 0.7,
      spreadX: 0.48,
      spreadY: 0.68,
      arms: 4,
      twist: 6.8,
      armSpread: 0.2,
      jitter: 0.04,
      angleOffset: 0.58,
    },
  },
  {
    count: 8,
    options: {
      centerX: 0.5,
      centerY: 0.5,
      radiusMin: 0.16,
      radiusMax: 0.44,
      spreadX: 0.35,
      spreadY: 0.46,
      arms: 5,
      twist: 6.1,
      armSpread: 0.16,
      jitter: 0.032,
      angleOffset: 1.05,
    },
  },
  {
    count: 4,
    options: {
      centerX: 0.5,
      centerY: 0.54,
      radiusMin: 0.08,
      radiusMax: 0.22,
      spreadX: 0.27,
      spreadY: 0.32,
      arms: 6,
      twist: 5,
      armSpread: 0.14,
      jitter: 0.025,
      angleOffset: 1.76,
    },
  },
];

const MOBILE_LAYER_LAYOUTS: LayerDefinition[] = [
  {
    count: 4,
    options: {
      centerX: 0.5,
      centerY: 0.52,
      radiusMin: 0.6,
      radiusMax: 0.92,
      spreadX: 0.44,
      spreadY: 0.88,
      arms: 3,
      twist: 6.6,
      armSpread: 0.24,
      jitter: 0.038,
      angleOffset: 0.05,
    },
  },
  {
    count: 8,
    options: {
      centerX: 0.5,
      centerY: 0.52,
      radiusMin: 0.32,
      radiusMax: 0.66,
      spreadX: 0.38,
      spreadY: 0.72,
      arms: 4,
      twist: 7,
      armSpread: 0.2,
      jitter: 0.034,
      angleOffset: 0.55,
    },
  },
  {
    count: 8,
    options: {
      centerX: 0.5,
      centerY: 0.52,
      radiusMin: 0.14,
      radiusMax: 0.36,
      spreadX: 0.3,
      spreadY: 0.54,
      arms: 5,
      twist: 6,
      armSpread: 0.16,
      jitter: 0.026,
      angleOffset: 1.02,
    },
  },
  {
    count: 4,
    options: {
      centerX: 0.5,
      centerY: 0.52,
      radiusMin: 0.08,
      radiusMax: 0.16,
      spreadX: 0.24,
      spreadY: 0.36,
      arms: 6,
      twist: 4.6,
      armSpread: 0.14,
      jitter: 0.022,
      angleOffset: 1.68,
    },
  },
];

const DESKTOP_POSITIONED = composeLayeredLayout(RAW_DESKTOP_SPHERES, DESKTOP_LAYER_LAYOUTS, 0);
const MOBILE_POSITIONED = composeLayeredLayout(RAW_MOBILE_SPHERES, MOBILE_LAYER_LAYOUTS, 150);

const PALETTE_SIZE = Math.max(RAW_DESKTOP_SPHERES.length, RAW_MOBILE_SPHERES.length) + 8;
const VIBRANT_PALETTE = generatePalette(PALETTE_SIZE);
const DESKTOP_SPHERES = applyPalette(DESKTOP_POSITIONED, VIBRANT_PALETTE);
const MOBILE_SPHERES = applyPalette(
  MOBILE_POSITIONED,
  VIBRANT_PALETTE,
  Math.floor(VIBRANT_PALETTE.length / 2)
);
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
    const getDepthEnhancedColor = (color: string, blur: number) => {
      const depthFactor = clamp01(blur / 24);
      const baseHsl = enhanceHsl(hexToHsl(color));
      const hueOffset = ((sphereHash % 15) - 7) * 0.02 + depthFactor * 0.02;
      const targetHue = (baseHsl.h + hueOffset + 1) % 1;
      const targetSaturation = clamp01(0.96 + (1 - depthFactor) * 0.04);
      const targetLightness = clamp01(0.36 + (1 - depthFactor) * 0.26);
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
    const radialGradient = `radial-gradient(circle at center, ${enhancedColor} 0%, transparent ${gradientStop}%)`;
    const godrayGradient = createGodrayGradient(enhancedColor, rayAngle, sphere.blur);
    
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
          backfaceVisibility: 'hidden'
        }}
        // Animazione organica MULTIDIREZIONALE - Pattern ellittici/circolari naturali!
        animate={shouldReduceMotion ? {} : {
          // Movimento orizzontale ORGANICO - Pattern variato per sfera
          translateX: motionPattern.x,
          // Movimento verticale ORGANICO - Pattern variato per sfera
          translateY: motionPattern.y,
          // Pulsazione scale SOTTILE - Ridotta per naturalezza
          scale: [
            1,      // 0%
            1.08,   // 25% - max scale (ridotto da 1.12)
            1,      // 50% - return
            0.95,   // 75% - min scale (ridotto da 0.92)
            1       // 100% - return
          ],
          // Rotazione SOTTILE - Ridotta per naturalezza
          rotate: [
            0,      // 0%
            2.5,    // 25% - max rotation (ridotto da 3.5)
            0,      // 50% - return
            -1.8,   // 75% - max rotation left (ridotto da -2.5)
            0       // 100% - return
          ],
        }}
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
