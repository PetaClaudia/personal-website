import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import COLOURS from '../constants/colours';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const textRef = useRef(null);
  const lettersRef = useRef([]);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      
      // Set canvas to full size
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const spacingX = 6;
      const outsideColor = COLOURS.springGreen;
      
      // Draw vertical lines (all as outside/background lines)
      ctx.strokeStyle = outsideColor;
      ctx.lineWidth = 1.5;
      
      for (let x = 0; x < canvas.width; x += spacingX) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
    }
  }, []);

  useEffect(() => {
    const letters = lettersRef.current;

    // Entrance animation when scrolling into view
    gsap.fromTo(
      letters,
      { 
        opacity: 0, 
        y: 100,
        rotationX: -90
      },
      { 
        opacity: 1, 
        y: 0,
        rotationX: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top center',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Hover-like wave animation
    letters.forEach((letter, index) => {
      gsap.to(letter, {
        y: -20,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: index * 0.1
      });
    });
  }, []);

  const text = "Contact";

  return (
    <section className="section" id="contact">
      <canvas 
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0
        }}
      />
      <div className="flex items-center justify-center h-full" style={{ position: 'relative', zIndex: 1 }}>
        <h2 
          ref={textRef}
          className="font-poiret text-7xl md:text-8xl lg:text-9xl text-portfolio-red"
          style={{ 
            perspective: '1000px',
            textShadow: '4px 4px 0px #F2C45A',
            letterSpacing: '0.1em'
          }}
        >
          {text.split('').map((char, index) => (
            <span 
              key={index}
              ref={el => lettersRef.current[index] = el}
              className="inline-block"
              style={{ 
                transformStyle: 'preserve-3d'
              }}
            >
              {char}
            </span>
          ))}
        </h2>
      </div>
    </section>
  );
};

export default Contact;
