import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import "./About.css";

// Register the Draggable plugin for GSAP
gsap.registerPlugin(Draggable);

/**
 * About Component - Retro Macintosh Music Player Interface
 *
 * This component creates a nostalgic recreation of a classic Macintosh music player
 * with draggable windows, audio playback, and visualizer functionality.
 */
const About = () => {
  // State management for audio playback and UI
  const [currentSong, setCurrentSong] = useState(0); // Currently selected track index
  const [isPlaying, setIsPlaying] = useState(false); // Play/pause state
  const [activeSource, setActiveSource] = useState(null); // Web Audio API source node
  const [buffers, setBuffers] = useState({}); // Audio buffers for all tracks
  const [context, setContext] = useState(null); // Web Audio API context
  const [analyser, setAnalyser] = useState(null); // Audio analyser for visualizer
  const [date, setDate] = useState(""); // Current date display
  const [isLoaded, setIsLoaded] = useState(false); // Component load state
  const containerRef = useRef(null); // Reference to main container for draggable bounds

  // Music data arrays - all arrays are parallel (same indices correspond to same track)
  const nowPlaying = [
    "Drug Church",
    "Blood Incantation",
    "The Chisel",
    "Prison Affair",
    "Dead Finks",
    "Cassandra Jenkins",
    "Font",
    "USA Nails",
    "Sheer Mag",
    "Dummy",
  ]; // Artist names for display

  const songPlaying = [
    "Hey Listen",
    "The Stargate [Tablet 1]",
    "Cuts Like a Knife",
    "I'm Leaving Broken",
    "Propane Tanks",
    "Aurora, IL",
    "Sentence 1",
    "Feel Worse",
    "All Lined Up",
    "Nullspace",
  ]; // Song titles for display

  const albumImages = [
    "https://f4.bcbits.com/img/a2870032268_16.jpg",
    "https://f4.bcbits.com/img/a4024825693_10.jpg",
    "https://f4.bcbits.com/img/a2689309068_16.jpg",
    "https://f4.bcbits.com/img/a2871861375_16.jpg",
    "https://f4.bcbits.com/img/a3540184311_16.jpg",
    "https://f4.bcbits.com/img/a1338331199_16.jpg",
    "https://f4.bcbits.com/img/a0033648289_16.jpg",
    "https://f4.bcbits.com/img/a0990023259_16.jpg",
    "https://f4.bcbits.com/img/a4071043534_16.jpg",
    "https://f4.bcbits.com/img/a3924570048_16.jpg",
  ]; // Album artwork URLs

  const trackUrls = [
    "https://raw.githubusercontent.com/adamjkuhn/audiofiles/master/drug-church.mp3",
    "https://raw.githubusercontent.com/adamjkuhn/audiofiles/master/blood-incantation.mp3",
    "https://raw.githubusercontent.com/adamjkuhn/audiofiles/master/the-chisel.mp3",
    "https://raw.githubusercontent.com/adamjkuhn/audiofiles/master/prison-affair.mp3",
    "https://raw.githubusercontent.com/adamjkuhn/audiofiles/master/dead-finks.mp3",
    "https://raw.githubusercontent.com/adamjkuhn/audiofiles/master/cassandra-jenkins.mp3",
    "https://raw.githubusercontent.com/adamjkuhn/audiofiles/master/font.mp3",
    "https://raw.githubusercontent.com/adamjkuhn/audiofiles/master/usa-nails.mp3",
    "https://raw.githubusercontent.com/adamjkuhn/audiofiles/master/sheer-mag.mp3",
    "https://raw.githubusercontent.com/adamjkuhn/audiofiles/master/dummy.mp3",
  ]; // Audio file URLs for playback

  const albumTitles = [
    "Prude",
    "Absolute Elsewhere",
    "What a Fucking Nightmare",
    "Demo IV",
    "Eve of Ascension",
    "My Light, My Destroyer",
    "Strange Burden",
    "Feel Worse",
    "Playing Favorites",
    "Free Energy",
  ]; // Album titles for display

  /**
   * Main useEffect - handles component initialization and cleanup
   * Sets up date display, audio context, visualizer, keyboard controls, and draggable functionality
   */
  useEffect(() => {
    // Set up current date display in Mac-style format
    const dt = new Date();
    const dateString =
      dt.toLocaleString("en-us", { weekday: "short" }) +
      " " +
      dt.toLocaleString("default", { month: "short" }) +
      " " +
      dt.getDate();
    setDate(dateString);

    /**
     * Visualizer animation loop
     * Continuously reads audio frequency data and updates CSS custom properties for bar heights
     */
    const draw = () => {
      if (analyser) {
        requestAnimationFrame(draw); // Continue animation loop
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray); // Get frequency data

        // Update CSS custom properties for each visualizer bar
        for (let i = 0; i < 11; i++) {
          document.body.style.setProperty(
            "--top" + i,
            dataArray[i * 2] * 0.015
          );
        }
      }
    };
    draw(); // Start the animation loop

    /**
     * Keyboard navigation handler
     * Arrow keys control track navigation
     */
    const handleKeyDown = (event) => {
      const key = event.key;
      if (key === "ArrowDown" || key === "ArrowRight") {
        playNext();
      }
      if (key === "ArrowUp" || key === "ArrowLeft") {
        playPrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    /**
     * Set up GSAP Draggable functionality
     * Makes all windows draggable within the container bounds
     */
    const setupDraggable = () => {
      if (containerRef.current) {
        try {
          Draggable.create(".window, .nowplaying, .analyzer", {
            bounds: containerRef.current, // Constrain dragging to container
            type: "x,y", // Allow dragging in both directions
            inertia: true, // Add momentum to dragging
          });
        } catch (error) {
          console.warn("Draggable setup failed:", error);
        }
      }
    };

    // Delay setup to ensure DOM is ready
    setTimeout(() => {
      setupDraggable();
      setIsLoaded(true);
    }, 100);

    // Cleanup function
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (activeSource) {
        try {
          activeSource.stop();
        } catch (error) {
          console.warn("Error stopping audio source:", error);
        }
      }
    };
  }, [analyser, activeSource, context]);

  // Effect to play when context is ready and we want to play
  useEffect(() => {
    if (isPlaying && context && analyser && buffers[trackUrls[currentSong]]) {
      playTrack(trackUrls[currentSong]);
    }
  }, [isPlaying, context, analyser, currentSong, buffers]);

  /**
   * Load and decode audio file into buffer
   * @param {string} url - Audio file URL
   * @param {AudioContext} audioContext - Web Audio API context
   */
  const getBuffer = (url, audioContext) => {
    const request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer"; // Request binary data
    request.onload = function (evt) {
      try {
        // Decode audio data and store in buffers state
        audioContext.decodeAudioData(request.response, (buffer) => {
          setBuffers((prev) => ({ ...prev, [url]: buffer }));
        });
      } catch (error) {
        console.warn("Audio decode failed for", url, error);
      }
    };
    request.onerror = () => {
      console.warn("Failed to load audio:", url);
    };
    request.send();
  };

  /**
   * Stop currently playing audio source
   * Safely stops and cleans up the active audio source
   */
  const stopActiveSource = () => {
    if (activeSource) {
      try {
        activeSource.onended = null; // Remove event listener
        activeSource.stop(0); // Stop immediately
        setActiveSource(null);
      } catch (error) {
        console.warn("Error stopping audio source:", error);
      }
    }
  };

  /**
   * Play audio track from buffer
   * @param {string} url - Audio file URL to play
   */
  const playTrack = (url) => {
    if (!context || !analyser) {
      console.warn("Audio context not ready");
      return;
    }

    const buffer = buffers[url];
    if (!buffer) {
      console.warn("Buffer not loaded for", url);
      return;
    }

    stopActiveSource(); // Stop any currently playing track
    try {
      const source = context.createBufferSource();
      source.connect(analyser); // Connect to analyser for visualizer
      setActiveSource(source);

      // Auto-advance to next track when current track ends
      source.onended = function () {
        setActiveSource(null);
        if (currentSong < 9) {
          playNext();
        }
      };

      source.buffer = buffer;
      source.connect(context.destination); // Connect to speakers
      source.start(0); // Start playback immediately
    } catch (error) {
      console.warn("Error playing track:", error);
    }
  };

  /**
   * Handle track selection from album list
   * @param {number} index - Index of selected track
   */
  const handleTrackClick = (index) => {
    setCurrentSong(index);
    if (isPlaying && context) {
      playTrack(trackUrls[index]);
    }
  };

  /**
   * Navigate to next track
   * Advances to next song in playlist if not at the end
   */
  const playNext = () => {
    if (currentSong < 9) {
      const nextSong = currentSong + 1;
      setCurrentSong(nextSong);
      if (isPlaying && context) {
        playTrack(trackUrls[nextSong]);
      }
    }
  };

  /**
   * Navigate to previous track
   * Goes back to previous song in playlist if not at the beginning
   */
  const playPrev = () => {
    if (currentSong > 0) {
      const prevSong = currentSong - 1;
      setCurrentSong(prevSong);
      if (isPlaying && context) {
        playTrack(trackUrls[prevSong]);
      }
    }
  };

  /**
   * Handle play/pause button click
   * Toggles playback state and initializes audio context if needed
   */
  const handlePlayClick = () => {
    const newIsPlaying = !isPlaying;
    setIsPlaying(newIsPlaying);

    if (newIsPlaying) {
      // Initialize audio context on first play (required by browser security)
      if (!context) {
        try {
          const audioContext = new (window.AudioContext ||
            window.webkitAudioContext)();
          const audioAnalyser = audioContext.createAnalyser();
          setContext(audioContext);
          setAnalyser(audioAnalyser);

          // Load audio buffers for all tracks
          trackUrls.forEach((url) => {
            getBuffer(url, audioContext);
          });
        } catch (error) {
          console.warn("Audio context initialization failed:", error);
          setIsPlaying(false);
        }
      }
    } else {
      stopActiveSource();
    }
  };

  return (
    <div className="about-container" ref={containerRef}>
      {/* Current date display in top right corner */}
      <div id="date">{date}</div>

      {/* Top row containing Now Playing and Visualizer windows */}
      <div className="toprow">
        {/* Now Playing window - shows current track info and controls */}
        <div className="nowplaying">
          <h3>Now Playing</h3>
          {/* Play/Pause button with triangle icon */}
          <div>
            <button
              id="play"
              className={isPlaying ? "playing" : ""}
              onClick={handlePlayClick}
            >
              <span></span>
            </button>
          </div>
          {/* Track information display */}
          <div>
            <div>
              <h4 id="artist">{nowPlaying[currentSong]}</h4>
              <h4 id="song">{songPlaying[currentSong]}</h4>
            </div>
          </div>
          {/* Navigation buttons */}
          <div>
            <button id="prev" onClick={playPrev}>
              ‹ Prev
            </button>
            <button id="next" onClick={playNext}>
              Next ›
            </button>
          </div>
        </div>

        {/* Audio visualizer window - shows frequency bars */}
        <div className="analyzer">
          <h3>Visualizer</h3>
          <div>
            {/* 10 frequency bars that animate based on audio data */}
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>

      {/* Main album list window */}
      <div className="window">
        {/* Draggable title bar */}
        <div className="dragarea"></div>
        <h3>Top 10 Albums - 2024</h3>
        <div className="frame">
          {/* Album artwork carousel */}
          <div className="imgwrap">
            {albumImages.map((img, index) => (
              <img
                key={index}
                className={index === currentSong ? "active" : ""}
                src={img}
                alt={`Album ${index + 1}`}
              />
            ))}
          </div>
          {/* Track list */}
          <div>
            <ul>
              {nowPlaying.map((artist, index) => (
                <li key={index}>
                  <a
                    className={index === currentSong ? "active" : ""}
                    href={trackUrls[index]}
                    onClick={(e) => {
                      e.preventDefault();
                      handleTrackClick(index);
                    }}
                  >
                    {artist} - <span>{albumTitles[index]}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* SVG filter for dithering effect - makes images look pixelated */}
      <svg imageRendering="optimizeSpeed">
        <filter
          colorInterpolationFilters="sRGB"
          height="100%"
          id="dither"
          width="100%"
          x="0"
          y="0"
        >
          <feImage
            height="4"
            width="4"
            xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAA+UlEQVR42gXBERTCUABA0X/OYDAYDAZBEAyCIBgMgiAIgiAYBINgEAwGgyAIBsFgMAiCIAiCIAgGQTAYDAaDIAiCwWDwulcIIXg8HgwGA36/H4qi8Hq9sCyLtm0Rm82G0WjE5XJhvV4ThiHT6ZT7/U4QBIhut0tVVaiqSpZl9Pt9vt8vnU6HsiwRh8OB5XLJfr9nNptxPp9xXZckSbBtGyHLMs/nE9M0aZoGSZJI05ThcEhd14jdbsdkMuF2u+H7PtvtlvF4zPV6xfM8hGEYfD4fdF2nKAp6vR7v9xtN08jzHHE6nVitVsRxzGKx4Hg84jgOURQxn8/5A7oKnYRU4EpfAAAAAElFTkSuQmCC"
          />
          <feTile />
          <feComposite
            in="SourceGraphic"
            k1="0"
            k2="1"
            k3="1"
            k4="-0.5"
            operator="arithmetic"
          />
          <feComponentTransfer>
            <feFuncR tableValues="0 1" type="discrete" />
            <feFuncG tableValues="0 1" type="discrete" />
            <feFuncB tableValues="0 1" type="discrete" />
          </feComponentTransfer>
        </filter>
      </svg>

      {/* Classic Mac icon in top right corner */}
      <div id="icon">
        <img src="https://assets.codepen.io/383755/Mac.svg" alt="" />
      </div>
    </div>
  );
};

export default About;
