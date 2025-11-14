import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Skills = () => {
  const itemsRef = useRef([]);
  const headerRef = useRef(null);
  const containerRef = useRef(null);
  const contentRef = useRef(null);

  const skills = [
    'C#.',
    'SQL.',
    'Java.',
    'VB.NET.',
    'C.',
    'C++.',
    'HTML.',
    'CSS.',
    'TailwindCSS.',
    'GSAP.',
    'JavaScript.',
    'React.',
    'JSON.',
    'Python.',
    'Blender.',
    'Nuke.',
    'Maya.',
    'I can learn more.'
  ];

  useEffect(() => {
    const items = itemsRef.current.filter(Boolean);
    const container = containerRef.current;
    const header = headerRef.current;
    
    if (items.length === 0 || !container || !header) return;

    // Set initial opacity - first item visible
    gsap.set(items, { opacity: (i) => (i !== 0 ? 0.2 : 1) });

    // Get the vertical position of "I can" header
    const getHeaderTop = () => {
      const headerRect = header.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      return headerRect.top - containerRect.top + container.scrollTop;
    };

    // Create ScrollTrigger for each item - trigger when aligned with "I can"
    const triggers = items.map((item, index) => {
      return ScrollTrigger.create({
        trigger: item,
        start: 'top 30px', // Align with "I can" position (15px padding + 15px offset)
        end: 'bottom 30px',
        scroller: container,
        onEnter: () => gsap.to(item, { opacity: 1, duration: 0.3 }),
        onLeave: () => gsap.to(item, { opacity: 0.2, duration: 0.3 }),
        onEnterBack: () => gsap.to(item, { opacity: 1, duration: 0.3 }),
        onLeaveBack: () => gsap.to(item, { opacity: 0.2, duration: 0.3 }),
      });
    });

    return () => {
      triggers.forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <>
      <div className="skills-window-scroll-container" ref={containerRef}>
        <div className="skills-window-content-inner" ref={contentRef}>
          <div className="skills-window-header" ref={headerRef}>I know&nbsp;</div><ul className="skills-window-list">
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
      </div>
      <div className="skills-scroll-indicator">
        <img src="/assets/down-arrow.svg" alt="Scroll down" />
      </div>
    </>
  );
};

export default Skills;
