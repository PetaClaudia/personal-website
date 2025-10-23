import React, { useRef, useEffect, useState } from 'react';

const Home = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [date, setDate] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);

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
    <div className="about-container" ref={containerRef} id="home">
      {/* Current date display in top right corner */}
      <div id="name">Peta Douglas</div>
      <div id="job-title">Software Developer</div>
      <div id="date">{date}</div>

      {/* Mac icon  Top Right*/}
      <div id="mac-icon" className="icon">
        <img src="/assets/Mac.svg" alt="Mac Icon" />
        <div className="icon-label">Home</div>
      </div>

      {/* Trash icon */}
      <div id="trash-icon" className="icon">
        <img src="/assets/Trash.svg" alt="Trash" />
        <div className="icon-label">Clear</div>
      </div>

      {/* Bomb icon */}
      <div id="bomb-icon" className="icon">
        <img src="/assets/Bomb.svg" alt="Bomb" />
        <div className="icon-label">Skills</div>
      </div>

      {/* Welcome Panel */}
      {showWelcome && (
        <div className="welcome-panel">
          <div className="welcome-content">
            <h1>Welcome!</h1>
            <p>I am a Software Developer with 5 years of backend experience, developing and maintaining enterprise applications and eServices. <br />
              Off the clock I'm using web development to explore my creative side, building visually engaging, interactive sites. <br />
              Please take a look around!</p>
          </div>
          <div className="welcome-footer">
            <button
              className="welcome-button"
              onClick={() => setShowWelcome(false)}
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
