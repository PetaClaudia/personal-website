import React, { useRef } from 'react';
import TextPressure from './TextPressure';
import COLOURS from '../constants/colours';

const Home = () => {
  const containerRef = useRef(null);

  return (
    <section ref={containerRef} className="section" id="home">
      {/* Footer Text with TextPressure */}
      {/* Mobile/Tablet: 2 lines */}
      <div 
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
        <div className="hidden lg:block" style={{ height: '150px' }}>
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
        </div>
      </div>
    </section>
  );
};

export default Home;
