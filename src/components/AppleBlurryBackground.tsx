import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

type SphereMeta = {
  id: string;
  depth: number;
  inner: string;
  outer: string;
  top: number;
  left: number;
  size: number;
};

const COLORS: Array<[string, string]> = [
  ['#007AFF', '#4DA3FF'],
  ['#AF52DE', '#D09AFF'],
  ['#FF375F', '#FF7A85'],
  ['#30D158', '#66E188'],
  ['#FFD60A', '#FFE88A'],
  ['#64D2FF', '#A4E4FF'],
];

const createSpheres = (count: number, isMobile: boolean): SphereMeta[] =>
  Array.from({ length: count }).map((_, index) => {
    const depth = 0.5 + Math.random() * 2.5;
    const baseSize = 80 + (1 / depth) * 200;
    const size = isMobile ? Math.min(baseSize, 180) : baseSize;
    const top = Math.random() * 1000 - 200; // -200% to +800%
    const left = Math.random() * 100;
    const [inner, outer] = COLORS[index % COLORS.length];

    return {
      id: `sphere-${index}`,
      depth,
      inner,
      outer,
      top,
      left,
      size,
    };
  });

const SCROLL_EASING = 0.04;
const SCROLL_FACTOR = 0.15;
const POINTER_RANGE = 40;
const GYRO_EASING = 0.06;

export function AppleBlurryBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<number>();
  const [metas, setMetas] = useState<SphereMeta[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const regenerate = () => {
      const isMobile = window.innerWidth < 768;
      const count = isMobile ? 40 : 70;
      setMetas(createSpheres(count, isMobile));
    };

    regenerate();

    const handleResize = () => {
      regenerate();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const container = containerRef.current;
    if (!container || metas.length === 0) {
      return undefined;
    }

    const spheres = Array.from(container.querySelectorAll<HTMLElement>('[data-sphere]'));
    if (spheres.length === 0) {
      return undefined;
    }

    let currentScroll = window.scrollY || 0;
    let targetScroll = currentScroll;
    let mouseX = 0;
    let mouseY = 0;
    const gyroTarget = { x: 0, y: 0 };
    const gyroCurrent = { x: 0, y: 0 };

    const handleScroll = () => {
      targetScroll = window.scrollY || 0;
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (window.matchMedia('(pointer: fine)').matches) {
        mouseX = ((event.clientX / window.innerWidth) - 0.5) * POINTER_RANGE;
        mouseY = ((event.clientY / window.innerHeight) - 0.5) * POINTER_RANGE;
      }
    };

    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch) {
        mouseX = ((touch.clientX / window.innerWidth) - 0.5) * POINTER_RANGE;
        mouseY = ((touch.clientY / window.innerHeight) - 0.5) * POINTER_RANGE;
      }
    };

    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      const { beta = 0, gamma = 0 } = event;
      gyroTarget.x = gamma * 0.5;
      gyroTarget.y = beta * 0.5;
    };

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return undefined;
    }

    spheres.forEach((sphere, index) => {
      const meta = metas[index];
      if (!meta) {
        return;
      }

      sphere.style.setProperty('--scale', `${1 / meta.depth}`);
      sphere.style.setProperty('--depth', `${meta.depth}`);
      sphere.style.setProperty('--blur', '20px');
      sphere.style.setProperty('--opacity', `${Math.min(0.85, 0.25 + (1 / meta.depth) * 0.25)}`);
      sphere.style.setProperty('--z', `${-meta.depth * 400}px`);
      sphere.style.setProperty('--x', '0px');
      sphere.style.setProperty('--y', '0px');
      sphere.style.setProperty('--scroll-y', '0px');
    });

    let orientationListenerActive = false;
    let permissionCleanup: (() => void) | undefined;

    const requestOrientationAccess = () => {
      const DeviceOrientationEventAny = window.DeviceOrientationEvent as typeof window.DeviceOrientationEvent & {
        requestPermission?: () => Promise<PermissionState>;
      };

      if (DeviceOrientationEventAny && typeof DeviceOrientationEventAny.requestPermission === 'function') {
        DeviceOrientationEventAny.requestPermission()
          .then((state) => {
            if (state === 'granted') {
              window.addEventListener('deviceorientation', handleDeviceOrientation);
              orientationListenerActive = true;
            }
          })
          .catch(() => undefined);
      } else if ('DeviceOrientationEvent' in window) {
        window.addEventListener('deviceorientation', handleDeviceOrientation);
        orientationListenerActive = true;
      }
    };

    const handleFirstInteraction = () => {
      requestOrientationAccess();
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstInteraction, { once: true });
    permissionCleanup = () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };

    const animate = () => {
      currentScroll += (targetScroll - currentScroll) * SCROLL_EASING;
      gyroCurrent.x += (gyroTarget.x - gyroCurrent.x) * GYRO_EASING;
      gyroCurrent.y += (gyroTarget.y - gyroCurrent.y) * GYRO_EASING;

      const time = Date.now() * 0.0002;

      spheres.forEach((sphere, index) => {
        const depth = parseFloat(sphere.dataset.depth || '1');
        const floatOffset = Math.sin(time + index) * 30;
        const offsetX = (mouseX + gyroCurrent.x) / depth;
        const interactiveY = (mouseY + gyroCurrent.y + floatOffset) / depth;
        const scrollOffset = (-currentScroll * SCROLL_FACTOR) / depth;

        sphere.style.setProperty('--x', `${offsetX}px`);
        sphere.style.setProperty('--y', `${interactiveY}px`);
        sphere.style.setProperty('--scroll-y', `${scrollOffset}px`);
      });

      document.documentElement.style.setProperty('--tilt-x', `${gyroCurrent.x / 2}px`);
      document.documentElement.style.setProperty('--tilt-y', `${gyroCurrent.y / 2}px`);

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

      if (orientationListenerActive) {
        window.removeEventListener('deviceorientation', handleDeviceOrientation);
      }

      if (permissionCleanup) {
        permissionCleanup();
      }
    };
  }, [metas]);

  return (
    <div className="resume-background">
      <div ref={containerRef} className="spheres-container" data-parallax="true">
        {metas.map((sphere) => (
          <div
            key={sphere.id}
            data-sphere
            data-depth={sphere.depth}
            style={
              {
                top: `${sphere.top}%`,
                left: `${sphere.left}%`,
                width: `${sphere.size}px`,
                height: `${sphere.size}px`,
                '--inner-color': sphere.inner,
                '--outer-color': sphere.outer,
                '--depth': `${sphere.depth}`,
                '--scale': `${1 / sphere.depth}`,
                '--blur': '20px',
                '--opacity': `${Math.min(0.85, 0.25 + (1 / sphere.depth) * 0.25)}`,
                '--z': `${-sphere.depth * 400}px`,
                '--x': '0px',
                '--y': '0px',
                '--scroll-y': '0px',
              } as CSSProperties & Record<string, string>
            }
            className="sphere"
          />
        ))}
      </div>
    </div>
  );
}
