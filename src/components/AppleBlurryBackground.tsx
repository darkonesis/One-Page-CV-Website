import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

type DepthLayer = 'back' | 'mid' | 'front';

interface DepthConfig {
  name: DepthLayer;
  weight: number;
  depthRange: [number, number];
  blurRange: [number, number];
  sizeRange: [number, number];
  opacity: number;
}

interface SphereMeta {
  id: string;
  layer: DepthLayer;
  depth: number;
  top: number;
  left: number;
  size: number;
  gradient: {
    inner: string;
    outer: string;
    type: 'radial' | 'mesh' | 'aurora';
  };
  opacity: number;
  blurBase: number;
  floatSpeed: number;
  floatAmplitude: number;
  floatPhase: number;
  rotation: number;
  shape: 'circle' | 'ellipse';
  aspectRatio: number;
}

const COLOR_PALETTES: Array<[string, string]> = [
  ['rgba(255, 96, 92, 0.7)', 'rgba(255, 96, 92, 0.22)'],
  ['rgba(255, 189, 68, 0.7)', 'rgba(255, 189, 68, 0.22)'],
  ['rgba(0, 202, 78, 0.65)', 'rgba(0, 202, 78, 0.2)'],
  ['rgba(0, 149, 255, 0.7)', 'rgba(0, 149, 255, 0.22)'],
  ['rgba(123, 97, 255, 0.7)', 'rgba(123, 97, 255, 0.22)'],
];

const DEPTH_LAYERS: DepthConfig[] = [
  { name: 'back', weight: 0.3, depthRange: [2.5, 4.2], blurRange: [40, 90], sizeRange: [220, 360], opacity: 0.2 },
  { name: 'mid', weight: 0.45, depthRange: [1.4, 2.3], blurRange: [20, 55], sizeRange: [160, 280], opacity: 0.28 },
  { name: 'front', weight: 0.25, depthRange: [0.6, 1.1], blurRange: [8, 24], sizeRange: [120, 220], opacity: 0.35 },
];

const POINTER_RANGE = 40;
const SCROLL_EASING = 0.03;
const MOUSE_EASING = 0.07;
const GYRO_EASING = 0.05;
const SCROLL_STRENGTH_NEAR = 0.55;
const SCROLL_STRENGTH_FAR = 0.12;
const HERO_MIN = 8;
const MID_MIN = 14;
const FOOTER_MIN = 8;

const getPageHeight = () => {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return 0;
  }
  return Math.max(document.documentElement.scrollHeight, window.innerHeight);
};

const randInRange = (min: number, max: number) => min + Math.random() * (max - min);
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const pickLayerCounts = (total: number): Record<DepthLayer, number> => {
  const counts: Record<DepthLayer, number> = { back: 0, mid: 0, front: 0 };
  let assigned = 0;
  DEPTH_LAYERS.forEach((layer, index) => {
    if (index === DEPTH_LAYERS.length - 1) {
      counts[layer.name] = total - assigned;
    } else {
      const count = Math.round(total * layer.weight);
      counts[layer.name] = count;
      assigned += count;
    }
  });
  return counts;
};

const createSpheres = (isMobile: boolean, pageHeight: number): SphereMeta[] => {
  if (pageHeight <= 0) {
    return [];
  }

  const viewport = typeof window !== 'undefined' ? window.innerHeight : 0;
  const totalBase = isMobile ? 28 : 40;
  const total = Math.min(totalBase + Math.floor(pageHeight / 2000), isMobile ? 38 : 60);
  const counts = pickLayerCounts(total);
  const metas: SphereMeta[] = [];

  const minDistanceX = isMobile ? 8 : 14;
  const minDistanceY = isMobile ? 45 : 80;

  DEPTH_LAYERS.forEach((config) => {
    const desiredCount = counts[config.name];
    for (let i = 0; i < desiredCount; i += 1) {
      let attempts = 0;
      let top = 0;
      let left = 0;
      let depth = 1;
      let size = 120;
      let blurBase = config.blurRange[0];
      let valid = false;

      while (attempts < 30 && !valid) {
        depth = randInRange(config.depthRange[0], config.depthRange[1]);
        const sizeBias = Math.pow(Math.random(), 0.8);
        size = lerp(config.sizeRange[0], config.sizeRange[1], sizeBias);
        const maxTop = Math.max(pageHeight - size, 0);
        top = Math.random() * (maxTop || pageHeight);
        left = -20 + Math.random() * 140;
        blurBase = randInRange(config.blurRange[0], config.blurRange[1]);

        valid = !metas.some((existing) => {
          const dy = Math.abs(existing.top - top);
          const dx = Math.abs(existing.left - left);
          return dy < minDistanceY && dx < minDistanceX;
        });

        if (!valid) {
          const retryMaxTop = Math.max(pageHeight - size, 0);
          top = Math.random() * (retryMaxTop || pageHeight);
          left = -20 + Math.random() * 140;
        }

        attempts += 1;
      }

      const [inner, outer] =
        COLOR_PALETTES[Math.floor(Math.random() * COLOR_PALETTES.length)];
      const gradientType: SphereMeta['gradient']['type'] =
        Math.random() < 0.12 ? 'aurora' : Math.random() < 0.4 ? 'mesh' : 'radial';
      const floatSpeed = 0.18 + Math.random() * 0.22;
      const floatAmplitude = 6 + (1 / depth) * 12;
      const floatPhase = Math.random() * Math.PI * 2;
      const isEllipse = Math.random() < 0.35;
      const aspectRatio = isEllipse ? randInRange(0.55, 0.85) : 1;
      const rotation = isEllipse ? randInRange(-45, 45) : 0;
      const opacity = clamp(config.opacity + randInRange(0.3, 0.4), 0.5, 0.9);
      top = Math.min(top, Math.max(pageHeight - size, 0));

      metas.push({
        id: `sphere-${config.name}-${metas.length}`,
        layer: config.name,
        depth,
        top,
        left,
        size,
        gradient: { inner, outer, type: gradientType },
        opacity,
        blurBase,
        floatSpeed,
        floatAmplitude,
        floatPhase,
        rotation,
        shape: isEllipse ? 'ellipse' : 'circle',
        aspectRatio,
      });
    }
  });

  const ensureCoverage = (start: number, end: number, minCount: number) => {
    const within = metas.filter((meta) => meta.top >= start && meta.top <= end);
    if (within.length >= minCount) {
      return;
    }
    const deficit = minCount - within.length;
    for (let i = 0; i < deficit; i += 1) {
      const meta = metas[i % metas.length];
      const maxTop = Math.max(pageHeight - meta.size, 0);
      meta.top = clamp(start + Math.random() * Math.max(end - start, 1), 0, maxTop);
      meta.left = -20 + Math.random() * 140;
    }
  };

  const heroEnd = Math.min(pageHeight, Math.max(pageHeight * 0.22, Math.min(pageHeight, viewport || 600)));
  const footerStart = Math.max(pageHeight - Math.max(pageHeight * 0.22, viewport || 600), 0);
  const midStart = heroEnd;
  const midEnd = Math.max(Math.min(footerStart, pageHeight), midStart);
  ensureCoverage(0, heroEnd, HERO_MIN);
  if (midEnd > midStart + 1) {
    ensureCoverage(midStart, midEnd, MID_MIN);
  }
  ensureCoverage(footerStart, pageHeight, FOOTER_MIN);

  return metas;
};

export function AppleBlurryBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<number>();
  const [pageHeight, setPageHeight] = useState(getPageHeight());
  const [metas, setMetas] = useState<SphereMeta[]>(() => createSpheres(false, getPageHeight()));

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    let resizeTimeout: number | undefined;

    const update = () => {
      const height = getPageHeight();
      setPageHeight(height);
      document.documentElement.style.setProperty('--page-height', `${height}px`);
    };

    const regenerate = () => {
      const height = getPageHeight();
      const isMobile = window.innerWidth < 768;
      setMetas(createSpheres(isMobile, height));
      document.documentElement.style.setProperty('--page-height', `${height}px`);
      setPageHeight(height);
    };

    update();
    regenerate();

    const handleResize = () => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      resizeTimeout = window.setTimeout(regenerate, 300);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const container = containerRef.current;
    if (!container || metas.length === 0) {
      return;
    }

    const spheres = Array.from(container.querySelectorAll<HTMLElement>('[data-sphere]'));
    if (!spheres.length) {
      return;
    }

    let currentScroll = window.scrollY || 0;
    let targetScroll = currentScroll;
    let targetMouse = { x: 0, y: 0 };
    let currentMouse = { x: 0, y: 0 };
    const gyroTarget = { x: 0, y: 0 };
    const gyroCurrent = { x: 0, y: 0 };

    const handleScroll = () => {
      targetScroll = window.scrollY || 0;
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (window.matchMedia('(pointer: fine)').matches) {
        targetMouse.x = ((event.clientX / window.innerWidth) - 0.5) * POINTER_RANGE;
        targetMouse.y = ((event.clientY / window.innerHeight) - 0.5) * POINTER_RANGE;
      }
    };

    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch) {
        targetMouse.x = ((touch.clientX / window.innerWidth) - 0.5) * POINTER_RANGE;
        targetMouse.y = ((touch.clientY / window.innerHeight) - 0.5) * POINTER_RANGE;
      }
    };

    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      const { beta, gamma } = event;
      const safeGamma = (gamma ?? 0) * 0.75;
      const safeBeta = (beta ?? 0) * 0.75;
      gyroTarget.x = safeGamma;
      gyroTarget.y = safeBeta;
    };

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return;
    }

    const DeviceOrientation = window.DeviceOrientationEvent as typeof window.DeviceOrientationEvent & {
      requestPermission?: () => Promise<PermissionState>;
    };

    let orientationEnabled = false;

    const enableOrientation = async () => {
      if (orientationEnabled) return;
      if (DeviceOrientation?.requestPermission) {
        try {
          const permission = await DeviceOrientation.requestPermission();
          if (permission === 'granted') {
            window.addEventListener('deviceorientation', handleDeviceOrientation);
            orientationEnabled = true;
          }
        } catch {
          /* ignore */
        }
      } else {
        window.addEventListener('deviceorientation', handleDeviceOrientation);
        orientationEnabled = true;
      }
    };

    enableOrientation();

    const animate = () => {
      currentScroll += (targetScroll - currentScroll) * SCROLL_EASING;
      currentMouse.x += (targetMouse.x - currentMouse.x) * MOUSE_EASING;
      currentMouse.y += (targetMouse.y - currentMouse.y) * MOUSE_EASING;
      gyroCurrent.x += (gyroTarget.x - gyroCurrent.x) * GYRO_EASING;
      gyroCurrent.y += (gyroTarget.y - gyroCurrent.y) * GYRO_EASING;

      const maxScroll = Math.max(pageHeight - window.innerHeight, 1);
      const focusPlane = 1.1 + ((window.scrollY || 0) / maxScroll) * 2.0;

      spheres.forEach((sphere, index) => {
        const meta = metas[index];
        if (!meta) return;

        const effectiveDepth = Math.max(meta.depth, 0.5);
        const scrollStrength =
          SCROLL_STRENGTH_FAR +
          (SCROLL_STRENGTH_NEAR - SCROLL_STRENGTH_FAR) * (1 / Math.min(3, effectiveDepth));

        const offsetX = (currentMouse.x + gyroCurrent.x) / Math.pow(effectiveDepth, 1.4);
        const scrollOffset = -currentScroll * scrollStrength;

        const focusDelta = Math.abs(effectiveDepth - focusPlane);
        const blur = 1.5 + 45 * Math.pow(focusDelta / 3, 1.2);
        const scale = 1 + (1 / effectiveDepth) * 0.2;
        const zOffset = -effectiveDepth * 340;
        const brightness =
          1.3 + (1 / effectiveDepth) * 0.65 - focusDelta * 0.06;

        sphere.style.setProperty('--x', `${offsetX}px`);
        sphere.style.setProperty('--scroll-y', `${scrollOffset}px`);
        sphere.style.setProperty('--blur', `${blur}px`);
        sphere.style.setProperty('--scale', `${scale}`);
        sphere.style.setProperty('--z', `${zOffset}px`);
        sphere.style.setProperty('--brightness', `${Math.max(brightness, 1.05)}`);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = undefined;
      }
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      if (orientationEnabled) {
        window.removeEventListener('deviceorientation', handleDeviceOrientation);
      }
    };
  }, [metas, pageHeight]);

  return (
    <div className="resume-background">
      <div
        ref={containerRef}
        className="spheres-container"
        data-parallax="true"
      >
        {metas.map((sphere) => (
          <div
            key={sphere.id}
            data-sphere
            data-depth={sphere.depth}
            data-gradient-type={sphere.gradient.type}
            data-shape={sphere.shape}
            className="sphere"
            style={
              {
                top: `${sphere.top}px`,
                left: `${sphere.left}%`,
                width: `${sphere.size}px`,
                height: `${sphere.shape === 'ellipse' ? sphere.size * sphere.aspectRatio : sphere.size}px`,
                borderRadius: '50%',
                '--inner-color': sphere.gradient.inner,
                '--outer-color': sphere.gradient.outer,
                '--depth': `${sphere.depth}`,
                '--scale': '1',
                '--blur': `${sphere.blurBase}px`,
                '--brightness': '1',
                '--opacity': `${sphere.opacity}`,
                '--z': `${-sphere.depth * 420}px`,
                '--x': '0px',
                '--scroll-y': '0px',
                '--rotation': `${sphere.rotation}deg`,
                '--shape-scale': `${sphere.shape === 'ellipse' ? sphere.aspectRatio : 1}`,
              } as CSSProperties & Record<string, string | number>
            }
          />
        ))}
      </div>
    </div>
  );
}

function lerp(start: number, end: number, t: number) {
  return start + (end - start) * t;
}
