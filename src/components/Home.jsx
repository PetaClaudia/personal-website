import React, { useRef, useEffect, useState } from 'react';
import "../App.css";
import "./About.css";
import About from './About';

const Home = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [date, setDate] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);
  const [showAbout, setShowAbout] = useState(false);
  const [zIndices, setZIndices] = useState({
    welcome: 1,
    about: 0,
    // Add more windows here as needed
  });

  // Function to bring a window to the front
  const bringToFront = (windowName) => {
    const maxZIndex = Math.max(...Object.values(zIndices));
    if (zIndices[windowName] < maxZIndex) {
      setZIndices(prev => ({
        ...prev,
        [windowName]: maxZIndex + 1
      }));
    }
  };

  // Handle window toggle
  const toggleWindow = (windowName) => {
    if (windowName === 'about') {
      setShowAbout(prev => !prev);
      if (!showAbout) {
        bringToFront('about');
      }
    }
    // Add more window toggles here as needed
  };

  // Set up current date and time display
  useEffect(() => {
    const updateDateTime = () => {
      const dt = new Date();
      const dateString =
        dt.toLocaleString("en-us", { weekday: "short" }) +
        " " +
        dt.toLocaleString("default", { month: "short" }) +
        " " +
        dt.getDate() +
        ", " +
        dt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      setDate(dateString);
    };

    // Update immediately
    updateDateTime();

    // Update every minute
    const intervalId = setInterval(updateDateTime, 60000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="interface-container" ref={containerRef} id="home">
      {/* Current date display in top right corner */}
      <div id="name">Peta Pocock</div>
      <div id="job-title">Software Developer</div>
      <div id="date">{date}</div>

      {/* Mac icon  Top Right*/}
      <div id="mac-icon" className="icon">
        <img src="/assets/Mac.svg" alt="Mac Icon" />
        <div className="icon-label">Projects</div>
      </div>

      {/* Trash icon */}
      <div id="trash-icon" className="icon">
        <img src="/assets/Trash.svg" alt="Trash" />
        <div className="icon-label">Clear</div>
      </div>

      {/* Bomb icon */}
      <div id="bomb-icon" className="icon">
        <img src="/assets/Bomb.svg" alt="Bomb" />
        <div className="icon-label">My skills</div>
      </div>

      {/* Music icon */}
      <button
        id="music-icon"
        className="icon"
        onClick={() => toggleWindow('about')}
        style={{ cursor: 'pointer' }}
        aria-label={showAbout ? 'Hide music player' : 'Show what I\'m listening to'}
      >
        <img src="/assets/Music.svg" alt="" aria-hidden="true" />
        <div className="icon-label">At my desk</div>
      </button>

      {/* About component - always in DOM but conditionally shown */}
      <div
        className={`about-container ${showAbout ? 'active' : ''}`}
        style={{ zIndex: zIndices.about }}
        onClick={() => bringToFront('about')}
      >
        <About />
      </div>

      {/* LinkedIn icon */}
      <a
        href="https://www.linkedin.com/in/peta-douglas-56b41231"
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: 'none' }}
      >
        <div id="linkedin-icon" className="icon">
          <img src="/assets/linkedin.svg" alt="LinkedIn" />
          <div className="icon-label">LinkedIn</div>
        </div>
      </a>

      {/* Volume icon */}
      <div id="volume-icon" className="icon">
        <img src="/assets/Volume.svg" alt="Contact" />
        <div className="icon-label">Contact me!</div>
      </div>

      {/* Welcome Panel */}
      {showWelcome && (
        <div 
          className="welcome-panel"
          style={{ zIndex: zIndices.welcome }}
          onClick={() => bringToFront('welcome')}
        >
          <div className="welcome-content">
            <h1>Welcome!</h1>
            <p>I am a Software Developer with 5 years of backend experience, developing and maintaining enterprise applications and eServices. <br />
              <br />
              Off the clock I'm using web development to explore my creative side, building visually engaging, interactive sites. <br />
              <br />
              Please take a look around!</p>
          </div>
          <div className="welcome-footer">
            <button
              className="welcome-button"
              onClick={(e) => {
                e.stopPropagation();
                setShowWelcome(false);
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}

      <canvas
        ref={canvasRef}
        id="art"
        className="art-canvas"
      />
    </div>
  );
};

export default Home;
