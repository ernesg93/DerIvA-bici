"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  HeroNarrativeOverlay,
  HeroSequenceConfig
} from "@/src/core/hero/types";

type SequenceHeroRuntimeProps = {
  config: HeroSequenceConfig;
};

type ManifestPayload = string[] | { frames: string[] };

const FALLBACK_LOAD_TIMEOUT_MS = 4500;

function parseManifest(payload: ManifestPayload): string[] {
  if (Array.isArray(payload)) {
    return payload.filter((entry): entry is string => typeof entry === "string");
  }

  if (Array.isArray(payload.frames)) {
    return payload.frames.filter(
      (entry): entry is string => typeof entry === "string"
    );
  }

  return [];
}

function clamp(value: number, min = 0, max = 1): number {
  return Math.min(Math.max(value, min), max);
}

function joinPath(basePath: string, relativePath: string): string {
  const cleanBase = basePath.replace(/\/$/, "");
  const cleanRelative = relativePath.replace(/^\//, "");

  return `${cleanBase}/${cleanRelative}`;
}

function applyIndexPattern(pattern: string, index: number): string {
  const oneBasedIndex = index + 1;
  const withZeroBasedIndex = pattern.replace(
    /\{index0(?::(\d+))?\}/g,
    (_match, padDigits) => {
      if (!padDigits) {
        return String(index);
      }

      return String(index).padStart(Number(padDigits), "0");
    }
  );

  return withZeroBasedIndex.replace(/\{index(?::(\d+))?\}/g, (_match, padDigits) => {
    if (!padDigits) {
      return String(oneBasedIndex);
    }

    return String(oneBasedIndex).padStart(Number(padDigits), "0");
  });
}

function resolveOverlayProgress(overlay: HeroNarrativeOverlay, progress: number) {
  const { start, end } = overlay;
  const fadeInEnd = start + (end - start) * 0.25;
  const fadeOutStart = end - (end - start) * 0.25;

  if (progress < start || progress > end) {
    return null;
  }

  if (progress < fadeInEnd) {
    const t = (progress - start) / (fadeInEnd - start);
    return {
      opacity: t,
      translateY: 20 * (1 - t),
      blur: 4 * (1 - t)
    };
  }

  if (progress > fadeOutStart) {
    const t = (progress - fadeOutStart) / (end - fadeOutStart);
    return {
      opacity: 1 - t,
      translateY: -20 * t,
      blur: 4 * t
    };
  }

  return {
    opacity: 1,
    translateY: 0,
    blur: 0
  };
}

function loadImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.src = source;
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Failed to load frame: ${source}`));
  });
}

export function SequenceHeroRuntime({ config }: SequenceHeroRuntimeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);

  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hasManifestError, setHasManifestError] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isLowPowerDevice, setIsLowPowerDevice] = useState(false);

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const image = framesRef.current[index];

    if (!canvas || !context || !image) {
      return;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);

    const scale = Math.min(
      canvas.width / image.naturalWidth,
      canvas.height / image.naturalHeight
    );
    const drawWidth = image.naturalWidth * scale;
    const drawHeight = image.naturalHeight * scale;
    const offsetX = (canvas.width - drawWidth) / 2;
    const offsetY = (canvas.height - drawHeight) / 2;

    context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const isMobileViewport = window.innerWidth < 768;
    const pixelRatio = Math.min(
      window.devicePixelRatio || 1,
      isMobileViewport ? 2 : 3
    );

    canvas.width = window.innerWidth * pixelRatio;
    canvas.height = window.innerHeight * pixelRatio;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    drawFrame(currentFrameRef.current);
  }, [drawFrame]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setPrefersReducedMotion(mediaQuery.matches);

    syncPreference();
    mediaQuery.addEventListener("change", syncPreference);

    return () => {
      mediaQuery.removeEventListener("change", syncPreference);
    };
  }, []);

  useEffect(() => {
    const deviceMemory = (
      navigator as Navigator & {
        deviceMemory?: number;
      }
    ).deviceMemory;
    const cpuCores = navigator.hardwareConcurrency ?? 8;

    setIsLowPowerDevice(Boolean((deviceMemory && deviceMemory <= 4) || cpuCores <= 4));
  }, []);

  const fallbackMode = useMemo(() => {
    if (hasManifestError) {
      return config.degradation.onManifestLoadError;
    }

    if (prefersReducedMotion) {
      return config.degradation.onReducedMotion ?? "poster";
    }

    if (isLowPowerDevice) {
      return config.degradation.onLowPowerDevice ?? "poster";
    }

    return null;
  }, [config.degradation, hasManifestError, isLowPowerDevice, prefersReducedMotion]);

  const fallbackImageSource =
    fallbackMode === "static-image"
      ? config.fallback.staticImageSrc ?? config.fallback.posterSrc
      : config.fallback.posterSrc;

  useEffect(() => {
    if (fallbackMode) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    let firstFrameLoaded = false;
    const timeoutId = window.setTimeout(() => {
      if (!cancelled && !firstFrameLoaded) {
        setHasManifestError(true);
      }
    }, FALLBACK_LOAD_TIMEOUT_MS);

    const loadFrames = async () => {
      try {
        const response = await fetch(config.manifest.src, { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Manifest request failed");
        }

        const payload = (await response.json()) as ManifestPayload;
        const manifestFrames = parseManifest(payload);

        const sources =
          manifestFrames.length > 0
            ? manifestFrames
            : Array.from({ length: config.frameCount }, (_value, index) =>
                joinPath(
                  config.framesBasePath,
                  applyIndexPattern(config.frameFilePattern, index)
                )
              );

        if (sources.length === 0) {
          throw new Error("No frame sources configured");
        }

        const firstFrame = await loadImage(sources[0]);
        if (cancelled) {
          return;
        }

        firstFrameLoaded = true;
        framesRef.current = [firstFrame];
        currentFrameRef.current = 0;
        setScrollProgress(0);
        setLoadProgress(1 / sources.length);
        setHasManifestError(false);
        setIsLoading(false);

        if (sources.length === 1) {
          return;
        }

        const loadedFrames: Array<HTMLImageElement | undefined> = [firstFrame];
        let loadedCount = 1;

        await Promise.allSettled(
          sources.slice(1).map((source, sourceIndex) =>
            loadImage(source).then((image) => {
              if (cancelled) {
                return;
              }

              loadedFrames[sourceIndex + 1] = image;
              loadedCount += 1;
              setLoadProgress(loadedCount / sources.length);
            })
          )
        );

        if (!cancelled) {
          framesRef.current = loadedFrames.filter(
            (frame): frame is HTMLImageElement => Boolean(frame)
          );
        }
      } catch {
        if (!cancelled) {
          setHasManifestError(true);
          setIsLoading(false);
        }
      } finally {
        window.clearTimeout(timeoutId);
      }
    };

    setIsLoading(true);
    setLoadProgress(0);
    setHasManifestError(false);
    framesRef.current = [];
    currentFrameRef.current = 0;

    void loadFrames();

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [
    config.frameCount,
    config.frameFilePattern,
    config.framesBasePath,
    config.manifest.src,
    fallbackMode
  ]);

  useEffect(() => {
    if (isLoading || fallbackMode) {
      return;
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [fallbackMode, isLoading, resizeCanvas]);

  useEffect(() => {
    if (isLoading || fallbackMode) {
      return;
    }

    let frameId = 0;

    const updateByScroll = () => {
      const container = containerRef.current;
      if (!container) {
        return;
      }

      const rect = container.getBoundingClientRect();
      const scrollableHeight = container.offsetHeight - window.innerHeight;
      const progress =
        scrollableHeight > 0 ? clamp(-rect.top / scrollableHeight) : 0;

      setScrollProgress(progress);

      const totalFrames = framesRef.current.length;
      if (totalFrames <= 0) {
        return;
      }

      const nextFrameIndex = Math.min(
        Math.floor(progress * totalFrames),
        totalFrames - 1
      );

      if (nextFrameIndex !== currentFrameRef.current) {
        currentFrameRef.current = nextFrameIndex;
        drawFrame(nextFrameIndex);
      }
    };

    const onScroll = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(updateByScroll);
    };

    updateByScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.cancelAnimationFrame(frameId);
    };
  }, [drawFrame, fallbackMode, isLoading]);

  if (fallbackMode) {
    return (
      <section className="hero-fallback-shell" aria-label={config.fallback.ariaLabel}>
        <img
          src={fallbackImageSource}
          alt={config.fallback.imageAlt ?? ""}
          className="hero-fallback-image"
        />
      </section>
    );
  }

  const overlays = config.narrative?.overlays ?? [];
  const loaderLabel = config.narrative?.loaderLabel;
  const showScrollHint = config.narrative?.showScrollHint ?? true;
  const scrollHintLabel = config.narrative?.scrollHintLabel;

  return (
    <section
      ref={containerRef}
      className="sequence-hero-container"
      style={{ height: `${config.viewportScrollHeightVh ?? 360}vh` }}
      aria-label={config.narrative?.ariaLabel}
    >
      {isLoading ? (
        <div className="sequence-hero-loader" role="status" aria-live="polite">
          {loaderLabel ? (
            <div className="sequence-hero-loader-title">{loaderLabel}</div>
          ) : null}
          <div className="sequence-hero-loader-bar">
            <span style={{ width: `${Math.round(loadProgress * 100)}%` }} />
          </div>
        </div>
      ) : null}

      <div className="sequence-hero-sticky-shell">
        <canvas ref={canvasRef} className="sequence-hero-canvas" aria-hidden="true" />
        <div className="sequence-hero-gradient" aria-hidden="true" />

        {overlays.map((overlay) => {
          const overlayState = resolveOverlayProgress(overlay, scrollProgress);

          if (!overlayState || overlayState.opacity < 0.01) {
            return null;
          }

          return (
            <div
              key={overlay.id}
              className={`sequence-hero-overlay sequence-hero-overlay--${overlay.position}`}
            >
              <div
                className="sequence-hero-overlay-content"
                style={{
                  opacity: overlayState.opacity,
                  transform: `translateY(${overlayState.translateY}px)`,
                  filter: `blur(${overlayState.blur}px)`
                }}
              >
                {overlay.heading ? <h2>{overlay.heading}</h2> : null}
                {overlay.body ? <p>{overlay.body}</p> : null}

                {overlay.accent ? (
                  <p
                    className={`sequence-hero-overlay-accent sequence-hero-overlay-accent--${overlay.accentTone ?? "primary"}`}
                  >
                    {overlay.accent}
                  </p>
                ) : null}

                {overlay.ctas?.length ? (
                  <div className="sequence-hero-overlay-ctas">
                    {overlay.ctas.map((cta) => (
                      <a
                        key={`${overlay.id}-${cta.href}-${cta.label}`}
                        href={cta.href}
                        className={`sequence-hero-cta sequence-hero-cta--${cta.variant ?? "primary"}`}
                      >
                        {cta.label}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}

        {showScrollHint && scrollHintLabel && scrollProgress < 0.05 && !isLoading ? (
          <div className="sequence-hero-scroll-hint" aria-hidden="true">
            <span>{scrollHintLabel}</span>
            <svg viewBox="0 0 16 24" fill="none">
              <path
                d="M8 4v12m0 0l-4-4m4 4l4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        ) : null}
      </div>
    </section>
  );
}
