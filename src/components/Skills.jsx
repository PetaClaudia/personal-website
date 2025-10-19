import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Skills = () => {
  const itemsRef = useRef([]);
  const headerRef = useRef(null);
  const scrollerScrubRef = useRef(null);
  const dimmerScrubRef = useRef(null);
  const chromaEntryRef = useRef(null);
  const chromaExitRef = useRef(null);

  const skills = [
    'design.',
    'prototype.',
    'solve.',
    'build.',
    'develop.',
    'debug.',
    'learn.',
    'create.',
    'ship.',
    'collaborate.',
    'innovate.',
    'test.',
    'optimize.',
    'teach.',
    'visualize.',
    'transform.',
    'scale.',
    'do it.'
  ];

  useEffect(() => {
    const items = itemsRef.current.filter(Boolean);
    const header = headerRef.current;
    
    if (items.length === 0 || !header) return;

    // Set initial opacity - first item visible
    gsap.set(items, { opacity: (i) => (i !== 0 ? 0.2 : 1) });

    // Pin the header from first to last item
    ScrollTrigger.create({
      trigger: items[0],
      endTrigger: items[items.length - 1],
      start: 'center center',
      end: 'center center',
      pin: header,
      pinSpacing: false,
    });

    // Dimmer animation for items - fade in/out as they scroll
    const dimmer = gsap
      .timeline()
      .to(items.slice(1), {
        opacity: 1,
        stagger: 0.5,
      })
      .to(
        items.slice(0, items.length - 1),
        {
          opacity: 0.2,
          stagger: 0.5,
        },
        0
      );

    dimmerScrubRef.current = ScrollTrigger.create({
      trigger: items[0],
      endTrigger: items[items.length - 1],
      start: 'center center',
      end: 'center center',
      animation: dimmer,
      scrub: 0.2,
    });

    // Scrollbar color changer
    const scroller = gsap.timeline().fromTo(
      document.documentElement,
      {
        '--hue': 0,
      },
      {
        '--hue': 360,
        ease: 'none',
      }
    );

    scrollerScrubRef.current = ScrollTrigger.create({
      trigger: items[0],
      endTrigger: items[items.length - 1],
      start: 'center center',
      end: 'center center',
      animation: scroller,
      scrub: 0.2,
    });

    // Chroma entry
    chromaEntryRef.current = gsap.fromTo(
      document.documentElement,
      {
        '--chroma': 0,
      },
      {
        '--chroma': 0.3,
        ease: 'none',
        scrollTrigger: {
          scrub: 0.2,
          trigger: items[0],
          start: 'center center+=40',
          end: 'center center',
        },
      }
    );

    // Chroma exit
    chromaExitRef.current = gsap.fromTo(
      document.documentElement,
      {
        '--chroma': 0.3,
      },
      {
        '--chroma': 0,
        ease: 'none',
        scrollTrigger: {
          scrub: 0.2,
          trigger: items[items.length - 2],
          start: 'center center',
          end: 'center center-=40',
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
      dimmerScrubRef.current?.kill();
      scrollerScrubRef.current?.kill();
      chromaEntryRef.current?.scrollTrigger?.kill();
      chromaExitRef.current?.scrollTrigger?.kill();
    };
  }, []);

  return (
    <section className="section skills-section" id="skills">
      <style>{`
        .skills-section {
          --start: 0;
          --end: 360;
          --lightness: 65%;
          --base-chroma: 0.3;
          --step: calc((var(--end) - var(--start)) / ${skills.length - 1});
        }

        .skills-container {
          position: relative;
          display: flex;
          align-items: flex-start;
          width: 100%;
          padding-left: 5rem;
        }

        .skills-sticky-header {
          position: sticky;
          top: 10vh;
          font-size: clamp(3rem, 8vw, 6rem);
          margin: 0;
          margin-right: 2rem;
          display: inline-block;
          height: fit-content;
          font-weight: 600;
          line-height: 1.25;
          color: var(--text-color, #EBAC6C);
          white-space: nowrap;
          align-self: flex-start;
          flex-shrink: 0;
        }

        .skills-list {
          font-weight: 600;
          padding: 0;
          margin: 0;
          margin-top: 10vh;
          list-style-type: none;
          font-size: clamp(3rem, 8vw, 6rem);
          flex: 1;
        }

        .skills-list li {
          line-height: 1.25;
          opacity: 0.2;
          min-height: 10vh;
          display: flex;
          align-items: flex-start;
          scroll-snap-align: center;
        }
        
        .skills-list li:first-child {
          margin-top: 0;
        }

        .skills-list li:nth-child(1) { color: oklch(var(--lightness) var(--base-chroma) calc(var(--start) + (var(--step) * 0))); }
        .skills-list li:nth-child(2) { color: oklch(var(--lightness) var(--base-chroma) calc(var(--start) + (var(--step) * 1))); }
        .skills-list li:nth-child(3) { color: oklch(var(--lightness) var(--base-chroma) calc(var(--start) + (var(--step) * 2))); }
        .skills-list li:nth-child(4) { color: oklch(var(--lightness) var(--base-chroma) calc(var(--start) + (var(--step) * 3))); }
        .skills-list li:nth-child(5) { color: oklch(var(--lightness) var(--base-chroma) calc(var(--start) + (var(--step) * 4))); }
        .skills-list li:nth-child(6) { color: oklch(var(--lightness) var(--base-chroma) calc(var(--start) + (var(--step) * 5))); }
        .skills-list li:nth-child(7) { color: oklch(var(--lightness) var(--base-chroma) calc(var(--start) + (var(--step) * 6))); }
        .skills-list li:nth-child(8) { color: oklch(var(--lightness) var(--base-chroma) calc(var(--start) + (var(--step) * 7))); }
        .skills-list li:nth-child(9) { color: oklch(var(--lightness) var(--base-chroma) calc(var(--start) + (var(--step) * 8))); }
        .skills-list li:nth-child(10) { color: oklch(var(--lightness) var(--base-chroma) calc(var(--start) + (var(--step) * 9))); }
        .skills-list li:nth-child(11) { color: oklch(var(--lightness) var(--base-chroma) calc(var(--start) + (var(--step) * 10))); }
        .skills-list li:nth-child(12) { color: oklch(var(--lightness) var(--base-chroma) calc(var(--start) + (var(--step) * 11))); }
        .skills-list li:nth-child(13) { color: oklch(var(--lightness) var(--base-chroma) calc(var(--start) + (var(--step) * 12))); }
        .skills-list li:nth-child(14) { color: oklch(var(--lightness) var(--base-chroma) calc(var(--start) + (var(--step) * 13))); }
        .skills-list li:nth-child(15) { color: oklch(var(--lightness) var(--base-chroma) calc(var(--start) + (var(--step) * 14))); }
        .skills-list li:nth-child(16) { color: oklch(var(--lightness) var(--base-chroma) calc(var(--start) + (var(--step) * 15))); }
        .skills-list li:nth-child(17) { color: oklch(var(--lightness) var(--base-chroma) calc(var(--start) + (var(--step) * 16))); }
        .skills-list li:nth-child(18) { 
          background: linear-gradient(
            var(--text-color, #EBAC6C) 50%,
            color-mix(in oklch, var(--bg-color, #EB6D6F), var(--text-color, #EBAC6C) 25%)
          );
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
        }

        .skills-end-section {
          min-height: 100vh;
          display: flex;
          place-items: center;
          width: 100%;
          justify-content: center;
        }

        .skills-end-title {
          font-size: clamp(3rem, 8vw, 6rem);
          margin: 0;
          font-weight: 600;
          background: linear-gradient(
            var(--text-color, #EBAC6C) 50%,
            color-mix(in oklch, var(--bg-color, #EB6D6F), var(--text-color, #EBAC6C) 25%)
          );
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
        }

        @media (max-width: 768px) {
          .skills-container {
            padding: 0 2rem;
          }
          .skills-sticky-header,
          .skills-list,
          .skills-end-title {
            font-size: clamp(2rem, 10vw, 4rem);
          }
        }
      `}</style>

      <div className="skills-container">
        <h2 className="skills-sticky-header" ref={headerRef}>
          <span aria-hidden="true">I can&nbsp;</span>
          <span className="sr-only">I can ship things.</span>
        </h2>
        <ul className="skills-list" aria-hidden="true">
          {skills.map((skill, index) => (
            <li
              key={index}
              ref={(el) => (itemsRef.current[index] = el)}
            >
              {skill}
            </li>
          ))}
        </ul>
      </div>

      <div className="skills-end-section">
        <h2 className="skills-end-title">fin.</h2>
      </div>
    </section>
  );
};

export default Skills;
