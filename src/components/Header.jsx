import React from 'react';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-portfolio-red shadow-lg">
      <nav className="flex items-center justify-between h-16">
        {/* Left side - Vertical stripes logo */}
        <div className="flex items-center h-full bg-[#E63946] px-6 border-r-2 border-black">
          <div className="flex gap-1">
            <div className="w-2 h-10 bg-black"></div>
            <div className="w-2 h-10 bg-black"></div>
            <div className="w-2 h-10 bg-black"></div>
            <div className="w-2 h-10 bg-black"></div>
          </div>
        </div>

        {/* Left text section */}
        <div className="flex-1 px-6 text-xs text-fluro-yellow uppercase tracking-wider border-r-2 border-black">
          <div>Enthusiastic, magic and care</div>
          <div className="font-bold">Almost ready...</div>
          <div>To join your team</div>
        </div>

        {/* Center navigation */}
        <div className="flex items-center h-full">
          <a 
            href="#about" 
            className="h-full flex items-center px-8 text-black uppercase tracking-widest text-sm font-bold border-r-2 border-black hover:bg-black hover:text-portfolio-red transition-colors duration-300"
          >
            About
          </a>
          <a 
            href="#work" 
            className="h-full flex items-center px-8 text-black uppercase tracking-widest text-sm font-bold border-r-2 border-black hover:bg-black hover:text-portfolio-red transition-colors duration-300"
          >
            Work
          </a>
          <a 
            href="#contact" 
            className="h-full flex items-center px-8 text-black uppercase tracking-widest text-sm font-bold border-r-2 border-black hover:bg-black hover:text-portfolio-red transition-colors duration-300"
          >
            Contact
          </a>
        </div>

        {/* Right side icons */}
        <div className="flex items-center h-full">
          {/* Settings icon */}
          <div className="h-full flex items-center justify-center px-4 border-r-2 border-black hover:bg-black hover:text-portfolio-red transition-colors cursor-pointer">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>

          {/* Theme toggle */}
          <div className="h-full flex items-center justify-center px-4 border-r-2 border-black hover:bg-black hover:text-portfolio-red transition-colors cursor-pointer">
            <div className="w-6 h-6 rounded-full border-2 border-current" style={{ background: 'linear-gradient(90deg, currentColor 50%, transparent 50%)' }}></div>
          </div>

          {/* LinkedIn icon */}
          <div className="h-full flex items-center justify-center px-4 border-r-2 border-black hover:bg-black hover:text-portfolio-red transition-colors cursor-pointer">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </div>

          {/* Right text section */}
          <div className="px-6 text-sm border-r-2 border-black">
            <div className="font-bold">Coding globally from France.</div>
            <div className="text-xs">Available for freelance work → <span className="underline cursor-pointer hover:text-white">Hire me</span></div>
          </div>

          {/* QR Code */}
          <div className="h-full flex items-center justify-center px-4">
            <div className="w-12 h-12 bg-black"></div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
