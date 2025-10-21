import React, { useRef, useEffect } from 'react';
// import TextPressure from './TextPressure';
import COLOURS from '../constants/colours';
import DraggableText from './DraggableText';

const Home = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // useEffect(() => {
  //   const canvas = canvasRef.current;
  //   if (!canvas) return;

  //   const ctx = canvas.getContext("2d");

  //   const text = "Creative Developer";
  //   const fontSize = 400;
  //   const fontFamily = "'New Rocker', system-ui, serif";
  //   const margin = 250;
  //   const spacingX = 10;
  //   const outsideColor = COLOURS.springGreen;
  //   const insideColor = COLOURS.pinkCocktail;

  //   let animationFrameId;

  //   const initCanvas = async () => {
  //     if (document.fonts && document.fonts.ready) {
  //       await document.fonts.ready;
  //     }

  //     // Load the New Rocker font explicitly
  //     if (document.fonts && document.fonts.load) {
  //       await document.fonts.load(`${fontSize}px 'New Rocker'`);
  //     }

  //     ctx.font = `${fontSize}px ${fontFamily}`;
  //     const m = ctx.measureText(text);
  //     const textW = Math.ceil(m.width);
  //     const textH = Math.ceil(
  //       (m.actualBoundingBoxAscent || fontSize * 0.8) +
  //       (m.actualBoundingBoxDescent || fontSize * 0.2)
  //     );

  //     canvas.width = textW + margin * 2;
  //     canvas.height = textH + margin;
  //     const w = canvas.width, h = canvas.height;

  //     const maskCanvas = document.createElement("canvas");
  //     maskCanvas.width = w;
  //     maskCanvas.height = h;
  //     const maskCtx = maskCanvas.getContext("2d");
  //     maskCtx.fillStyle = "#fff";
  //     maskCtx.font = `bold ${fontSize}px ${fontFamily}`;
  //     maskCtx.textAlign = "center";
  //     maskCtx.textBaseline = "middle";
  //     maskCtx.fillText(text, w / 2, h / 2);
  //     const maskData = maskCtx.getImageData(0, 0, w, h).data;

  //     function wave(x, y, t) {
  //       const centerX = w / 2;
  //       const centerY = h / 2;
  //       const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
  //       const maxDistance = Math.sqrt(centerX ** 2 + centerY ** 2);

  //       const waveSpeed = 0.003;
  //       const waveDelay = distance * 0.002;
  //       const wavePhase = (t - waveDelay) * waveSpeed;

  //       const amplitude = 30 * (1 - distance / maxDistance) * (y / h);
  //       const frequency = 0.03;

  //       return Math.sin(wavePhase + distance * frequency) * amplitude;
  //     }

  //     function draw(t) {
  //       ctx.clearRect(0, 0, w, h);

  //       for (let x = 0; x < w; x += spacingX) {
  //         let points = [];
  //         for (let y = 0; y < h; y++) {
  //           const i = ((y * w) + x) * 4;
  //           const inside = maskData[i + 3] > 128;
  //           const offset = inside ? wave(x, y, t) : 0;
  //           points.push({ x: x + offset, y, inside });
  //         }

  //         let currentInside = points[0].inside;
  //         ctx.beginPath();
  //         ctx.moveTo(points[0].x, points[0].y);
  //         ctx.strokeStyle = currentInside ? insideColor : outsideColor;
  //         ctx.lineWidth = currentInside ? 4 : 1.5;

  //         for (let i = 1; i < points.length; i++) {
  //           const p = points[i];
  //           if (p.inside !== currentInside) {
  //             ctx.lineTo(p.x, p.y);
  //             ctx.stroke();
  //             ctx.beginPath();
  //             ctx.moveTo(p.x, p.y);
  //             currentInside = p.inside;
  //             ctx.strokeStyle = currentInside ? insideColor : outsideColor;
  //             ctx.lineWidth = currentInside ? 4 : 1.5;
  //           } else {
  //             ctx.lineTo(p.x, p.y);
  //           }
  //         }
  //         ctx.stroke();
  //       }

  //       animationFrameId = requestAnimationFrame(draw);
  //     }

  //     animationFrameId = requestAnimationFrame(draw);
  //   };

  //   initCanvas();

  //   return () => {
  //     if (animationFrameId) {
  //       cancelAnimationFrame(animationFrameId);
  //     }
  //   };
  // }, []);

  return (
    <section ref={containerRef} className="section" id="home">
      <canvas 
        ref={canvasRef}
        id="art" 
        style={{
          display: 'block',
          margin: '0 auto',
          maxWidth: '100%',
          height: 'auto',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      />
      
      {/* Draggable Text Component */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 5
      }}>
        <DraggableText />
      </div>
      
      {/* Footer Text with TextPressure */}
      {/* Mobile/Tablet: 2 lines */}
      {/* <div 
        className="absolute bottom-8 md:bottom-10 lg:bottom-16 left-0 right-0 px-4"
        style={{ display: 'flex', flexDirection: 'column', gap: '0px', lineHeight: '0.9' }}
      >
        <div className="block lg:hidden" style={{ minHeight: '60px', maxHeight: '25vh' }}>
          <TextPressure
            text="creative"
            fontFamily="Anybody"
            flex={true}
            alpha={false}
            stroke={true}
            width={true}
            weight={true}
            italic={true}
            textColor={COLOURS.yellow}
            strokeColor={COLOURS.fluroYellow}
            minFontSize={36}
          />
        </div>
        <div className="block lg:hidden" style={{ minHeight: '60px', maxHeight: '25vh' }}>
          <TextPressure
            text="developer"
            fontFamily="Anybody"
            flex={true}
            alpha={false}
            stroke={true}
            width={true}
            weight={true}
            italic={true}
            textColor={COLOURS.yellow}
            strokeColor={COLOURS.fluroYellow}
            minFontSize={36}
          />
        </div>
        
        {/* Desktop: 1 line */}
        {/* <div className="hidden lg:block" style={{ height: '150px' }}>
          <TextPressure
            text="creative developer"
            fontFamily="Anybody"
            flex={true}
            alpha={false}
            stroke={true}
            width={true}
            weight={true}
            italic={true}
            textColor={COLOURS.yellow}
            strokeColor={COLOURS.fluroYellow}
            minFontSize={36}
          />
        </div> */}
      {/* </div> */}
    </section>
  );
};

export default Home;
