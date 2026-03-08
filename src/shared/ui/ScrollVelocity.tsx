import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

interface VelocityMapping {
  input: [number, number];
  output: [number, number];
}

interface VelocityTextProps {
  children: React.ReactNode;
  baseVelocity: number;
  scrollContainerRef?: React.RefObject<HTMLElement>;
  className?: string;
  damping?: number;
  stiffness?: number;
  numCopies?: number;
  velocityMapping?: VelocityMapping;
  parallaxClassName?: string;
  scrollerClassName?: string;
  parallaxStyle?: React.CSSProperties;
  scrollerStyle?: React.CSSProperties;
}

interface ScrollVelocityProps {
  scrollContainerRef?: React.RefObject<HTMLElement>;
  texts: string[];
  velocity?: number;
  className?: string;
  damping?: number;
  stiffness?: number;
  numCopies?: number;
  velocityMapping?: VelocityMapping;
  parallaxClassName?: string;
  scrollerClassName?: string;
  parallaxStyle?: React.CSSProperties;
  scrollerStyle?: React.CSSProperties;
}

function useElementWidth<T extends HTMLElement>(ref: React.RefObject<T | null>): number {
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    function updateWidth() {
      if (ref.current) {
        setWidth(ref.current.offsetWidth);
      }
    }

    updateWidth();
    window.addEventListener("resize", updateWidth);

    return () => window.removeEventListener("resize", updateWidth);
  }, [ref]);

  return width;
}

function wrap(min: number, max: number, value: number): number {
  const range = max - min;
  if (range === 0) {
    return min;
  }
  const mod = (((value - min) % range) + range) % range;
  return mod + min;
}

function mapRange(value: number, input: [number, number], output: [number, number]): number {
  const [inMin, inMax] = input;
  const [outMin, outMax] = output;

  if (inMax === inMin) {
    return outMin;
  }

  const ratio = (value - inMin) / (inMax - inMin);
  return outMin + ratio * (outMax - outMin);
}

export const ScrollVelocity: React.FC<ScrollVelocityProps> = ({
  scrollContainerRef,
  texts = [],
  velocity = 100,
  className = "",
  damping = 50,
  stiffness = 400,
  numCopies = 6,
  velocityMapping = { input: [0, 1000], output: [0, 5] },
  parallaxClassName,
  scrollerClassName,
  parallaxStyle,
  scrollerStyle,
}) => {
  function VelocityText({
    children,
    baseVelocity = velocity,
    scrollContainerRef,
    className = "",
    damping,
    stiffness,
    numCopies,
    velocityMapping,
    parallaxClassName,
    scrollerClassName,
    parallaxStyle,
    scrollerStyle,
  }: VelocityTextProps) {
    const copyRef = useRef<HTMLSpanElement>(null);
    const copyWidth = useElementWidth(copyRef);

    const [x, setX] = useState("0px");
    const baseXRef = useRef(0);
    const directionFactor = useRef(1);
    const smoothVelocityRef = useRef(0);
    const rawVelocityRef = useRef(0);
    const lastScrollRef = useRef(0);
    const lastTimeRef = useRef(0);
    const animationFrameRef = useRef<number | null>(null);

    useEffect(() => {
      const scrollElement = scrollContainerRef?.current;
      const getScrollY = () => (scrollElement ? scrollElement.scrollTop : window.scrollY);

      lastScrollRef.current = getScrollY();
      lastTimeRef.current = performance.now();

      const handleScroll = () => {
        const now = performance.now();
        const currentY = getScrollY();
        const deltaY = currentY - lastScrollRef.current;
        const deltaTime = Math.max(now - lastTimeRef.current, 16);

        rawVelocityRef.current = (deltaY / deltaTime) * 1000;
        lastScrollRef.current = currentY;
        lastTimeRef.current = now;
      };

      const target = scrollElement ?? window;
      target.addEventListener("scroll", handleScroll, { passive: true });

      return () => {
        target.removeEventListener("scroll", handleScroll);
      };
    }, [scrollContainerRef]);

    useEffect(() => {
      const springStrength = Math.max(stiffness ?? 400, 1) / 4000;
      const dampingFactor = Math.min(Math.max((damping ?? 50) / 100, 0), 0.95);

      const step = (_time: number, delta: number) => {
        const velocityDelta = rawVelocityRef.current - smoothVelocityRef.current;
        smoothVelocityRef.current += velocityDelta * springStrength;
        smoothVelocityRef.current *= 1 - dampingFactor * 0.1;

        const velocityFactor = mapRange(
          smoothVelocityRef.current,
          velocityMapping?.input ?? [0, 1000],
          velocityMapping?.output ?? [0, 5]
        );

        let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

        if (velocityFactor < 0) {
          directionFactor.current = -1;
        } else if (velocityFactor > 0) {
          directionFactor.current = 1;
        }

        moveBy += directionFactor.current * moveBy * velocityFactor;
        baseXRef.current += moveBy;

        if (copyWidth === 0) {
          setX("0px");
        } else {
          setX(`${wrap(-copyWidth, 0, baseXRef.current)}px`);
        }

        animationFrameRef.current = window.requestAnimationFrame((nextTime) => {
          step(nextTime, Math.max(nextTime - _time, 16));
        });
      };

      animationFrameRef.current = window.requestAnimationFrame((time) => step(time, 16));

      return () => {
        if (animationFrameRef.current !== null) {
          window.cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, [baseVelocity, copyWidth, damping, stiffness, velocityMapping?.input, velocityMapping?.output]);

    const spans = [];
    for (let i = 0; i < (numCopies ?? 6); i++) {
      spans.push(
        <span className={`shrink-0 ${className}`} key={i} ref={i === 0 ? copyRef : null}>
          {children}
        </span>
      );
    }

    return (
      <div className={`${parallaxClassName ?? ""} relative overflow-hidden`.trim()} style={parallaxStyle}>
        <div
          className={`${scrollerClassName ?? ""} flex whitespace-nowrap text-center font-sans text-4xl font-bold tracking-[-0.02em] drop-shadow md:text-[5rem] md:leading-20`.trim()}
          style={{ transform: `translateX(${x})`, ...scrollerStyle }}
        >
          {spans}
        </div>
      </div>
    );
  }

  return (
    <section>
      {texts.map((text: string, index: number) => (
        <VelocityText
          key={index}
          className={className}
          baseVelocity={index % 2 !== 0 ? -velocity : velocity}
          scrollContainerRef={scrollContainerRef}
          damping={damping}
          stiffness={stiffness}
          numCopies={numCopies}
          velocityMapping={velocityMapping}
          parallaxClassName={parallaxClassName}
          scrollerClassName={scrollerClassName}
          parallaxStyle={parallaxStyle}
          scrollerStyle={scrollerStyle}
        >
          {text}&nbsp;
        </VelocityText>
      ))}
    </section>
  );
};

export default ScrollVelocity;
