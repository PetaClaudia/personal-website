import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import "./About.css";
import "../App.css";

// Register the Draggable plugin for GSAP
gsap.registerPlugin(Draggable);

/**
 * About Component - Retro Macintosh Music Player Interface
 *
 * This component creates a nostalgic recreation of a classic Macintosh music player
 * with draggable windows, audio playback, and visualiser functionality.
 */
const About = () => {
  // State management for audio playback and UI
  const [currentSong, setCurrentSong] = useState(0); // Currently selected track index
  const [isPlaying, setIsPlaying] = useState(false); // Play/pause state
  const [activeSource, setActiveSource] = useState(null); // Web Audio API source node
  const [buffers, setBuffers] = useState({}); // Audio buffers for all tracks
  const [context, setContext] = useState(null); // Web Audio API context
  const [analyser, setAnalyser] = useState(null); // Audio analyser for visualiser
  const [workLocation, setWorkLocation] = useState("home"); // Work location toggle: 'home' or 'office'
  const containerRef = useRef(null); // Reference to main container for draggable bounds

  // Music data arrays - all arrays are parallel (same indices correspond to same track)
  const nowPlaying = [
    "The Black Keys",
    "Grimes",
    "Radiohead",
    "The Beatles",
    "Elton John",
    "Nirvana",
    "Clairo",
    "Chris Stapleton",
    "My Chemical Romance",
    "Billie Eilish",
  ]; // Artist names for display

  const songPlaying = [
    "Weight Of Love",
    "Oblivion",
    "Just",
    "While My Guitar Gently Weeps",
    "Goodbye Yellow Brick Road",
    "About A Girl",
    "Nomad",
    "The Bottom",
    "House Of Wolves",
    "L'AMOUR DE MA VIE",
  ]; // Song titles for display

  const albumImages = [
    "/assets/blackkeys.jpg",
    "/assets/grimes.jpg",
    "/assets/radiohead.jpg",
    "/assets/Abbey-Road.webp",
    "/assets/Elton-John-Goodbye-Yellow-Brick-Road-album-cover-820.webp",
    "/assets/Nirvana-Bleach.jpg",
    "/assets/clairocharm.jpg",
    "/assets/CHRIS-STAPLETON-HIGHER.jpg",
    "/assets/mcr.jpg",
    "/assets/billie.jpg",
  ]; // Album artwork URLs

  const trackUrls = [
    "/assets/audio/The-Black-Keys-Weight-of-Love.mp3",
    "/assets/audio/Grimes-Oblivion.mp3",
    "/assets/audio/Radiohead-Just.mp3",
    "/assets/audio/wmggw.mp3",
    "/assets/audio/Goodbye-Yellow-Brick-Road.mp3",
    "/assets/audio/AboutAGirl.mp3",
    "/assets/audio/Clairo-Nomad.mp3",
    "/assets/audio/ChrisStapleton-TheBottom.mp3",
    "/assets/audio/MCR-HouseofWolves.mp3",
    "/assets/audio/BillieEilish-LAMOURDEMAVIE.mp3",
  ]; // Audio file URLs for playback

  /**
   * Main useEffect - handles component initialization and cleanup
   * Sets up date display, audio context, visualiser, keyboard controls, and draggable functionality
   */
  useEffect(() => {
    /**
     * Visualiser animation loop
     * Continuously reads audio frequency data and updates CSS custom properties for bar heights
     */
    const draw = () => {
      if (analyser) {
        requestAnimationFrame(draw); // Continue animation loop
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray); // Get frequency data

        // Update CSS custom properties for each visualiser bar
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
    // Track the highest z-index to ensure proper layering
    let highestZ = 100; // Start from a base z-index

    const setupDraggable = () => {
      try {
        // Function to bring a window to the front
        const bringToFront = (element) => {
          // Find the current highest z-index among all windows
          const allWindows = document.querySelectorAll('.window, .nowplaying, .analyzer');
          let currentHighest = 0;
          allWindows.forEach(win => {
            const z = parseInt(window.getComputedStyle(win).zIndex) || 0;
            if (z > currentHighest) currentHighest = z;
          });

          // Set the new z-index to be higher than the current highest
          const newZ = Math.max(highestZ, currentHighest) + 1;
          highestZ = newZ;
          gsap.set(element, { zIndex: newZ });
        };

        // Initialize all draggables with proper z-index management
        const windowIds = ['#playlistWindow', '#nowPlayingWindow', '#analyzerWindow', '#workFuelWindow', '#dogFrame'];

        // First pass: Set initial z-index values only
        // Positions are now handled by inline styles in JSX directly
        windowIds.forEach((id, index) => {
          const element = document.querySelector(id);
          if (element) {
            gsap.set(element, {
              zIndex: highestZ + index
            });
          }
        });

        // Second pass: Make them draggable using the IDs
        windowIds.forEach(id => {
          Draggable.create(id, {
            type: 'x,y',
            bounds: 'body',
            edgeResistance: 0.65,
            onPress: function () {
              bringToFront(this.target);
            },
            onDragStart: function () {
              bringToFront(this.target);
            }
          });
        });
      } catch (error) {
        console.warn("Draggable setup failed:", error);
      }
    };

    // Delay setup to ensure DOM is ready
    setTimeout(() => {
      setupDraggable();
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
      source.connect(analyser); // Connect to analyser for visualiser
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
    <div ref={containerRef} id="containerRef">
      {/* Top row containing Now Playing, Visualiser and Work Fuel windows */}
      <div className="toprow">
        {/* Now Playing window - shows current track info and controls */}
        <div
          id="nowPlayingWindow"
          className="nowplaying"
          style={{ position: 'absolute', left: '740px', top: '350px' }}
        >
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

        {/* Audio visualiser window - shows frequency bars */}
        <div
          id="analyzerWindow"
          className="analyzer"
          style={{ position: 'absolute', left: '490px', top: '350px' }}
        >
          <h3>Visualiser</h3>
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

        {/* Work Fuel window */}
        <div
          id="workFuelWindow"
          className="workfuel"
          style={{ position: 'absolute', left: '1250px', top: '320px' }}
        >
          <div className="dragarea"></div>
          <h3>Work Fuel</h3>
          <div className="frame">
            <div className="work-fuel-content">
              {/* Toggle button */}
              <div className="work-location-toggle">
                <button
                  className={workLocation === "home" ? "active" : ""}
                  onClick={() => setWorkLocation("home")}
                >
                  Work from home
                </button>
                <button
                  className={workLocation === "office" ? "active" : ""}
                  onClick={() => setWorkLocation("office")}
                >
                  In office
                </button>
              </div>

              {/* Work location ASCII art displays */}
              {workLocation === "home" && (
                <div className="matcha-container">
                  <pre className="matcha-ascii">
                    {`                          ░░▒▒▒░░░░▒▒▒▒░                          
               ░ ░░░░░░▒░░   ░░       ░        ░▓░                
           ▒░            ░░ ░░░░░░░░░░░░             ▓░           
        ▒  ░              ░░ ▒▒▓███▒▒▒▒▒▒▒▒░░ ░         ▒▓        
     ▒▒ ░░                ▒▒▒███████▒░▒▒▓█▓▓▒▒▒░░░░░       █      
   ▒░   ░░░░░░         ▒░▒░░░░░▒░▒▓▓▒░  ░▓▒▒▓▒▓█▓▓▓░░ ░░   ░▒█    
  ▒▒   ▒▒▒░░░░░░░  ░░░░            ░░ ░░░▒▒▓▒▒▒▒ ▓█▓▓▒▒░▒▒▒   █▒  
 ▒▒   ░░░░░▒▒▒▓▒▒▒▒ ░░               ░░░░░▒░░▒▓▒▒█▒ ▓██▒▓▓▒▒░  █▓ 
 ▓▒ ░░░░░░░░░▓▒░▓▒▒▓▓▒░               ░░░░░░▒░ ▒▒░▓██░▒▒▓▓▓▓▒▒░██ 
 ▒▓ ░░        ░ ░▓▓▒▒░▒░              ░░ ░░░▒▒░░▒░▒▒▓▓ ▒▒░▓▒▒▒ █  
 ▓▓▓            ░▒▒▒░▒░ ░ ░░░ ░░░      ░░░░░░░▒▒▒▓░▓▓▓██▒▒ ░▓▒█ ▓ 
 ░▒▓▓▓░       ░░▒▒▒ ░░ ░░░░░░░  ░░░ ▒▒░░░░░░░░░░▒▒▒▓▓▓█████▓▓░ ▒  
 ░░ ▒▓▓█ ░ ░░░░░▒▒░░░  ░▒▒▒▒▒▒▒░░░░░ ▒░    ░░░▒░░░░░░▒▒▒▒▒▓█ ░░   
 ░▒▒   ░░░░▓░░░▒▒▓░   ░░░▒▒▒▒▒░░░  ░░░▒  ▒    ░▓░░ ░░░░█    ░     
  ▒▒▒▒▒    ░░ ░▓▒░░░░░░▒▒▒▒▒▒▒▒░░░░ ░░▒▒ ▒  ░ ░░▒▒█░░  ░ ░        
  ▒▒▒▒▒▒░░   ░░░░░   ░░ ░▒██░ ░▒░░ ░  ░ ░ ░██▒▒░   ░░░ ░          
  ░▒▒▓▓▓▒▒▒░░            ░░   ▒▓░░░░░░░░░░▒▒▒▓▒░░░░         ░░    
  ░▒▒▒▓▓▓▓▓▓▒▒▒░░░ ░    ░░░      ░▓▒▒▒░▒▒▒░░░   ░░        ░░      
  ░░▒▒▒▒▓▓▓▓▓▓▓▓▓▓▒▒▒▒░░░░░░ ░  ▒░▒▒▒▒▒▒░▒░░░ ░    ░░░░░░         
   ░░▒▓▒▓▓▓▓▓█▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒░░░░░░░░░         
   ░░▒▒▒▒▓▓▓▓▓█▓▓▓██████████████████▓▓▓▓▓▒▒▒▒▒▒░▒░░░░░░░░░        
   ░░░▒▒▒▒▓▓▓▓▓▓▓▓▓▓▓▓██▓▓▓██████▓█▓█▓▓▓▒▒▒▒▒░░░░░░░░░░░░         
   ░░░▒▒▒▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓███████▓▓▓▓▓▓▒▒▒▒▒▒░░░░░░░░░░░░          
   ░░▒▒▒▒▒▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒▒▒▒▒░░░░░░░░░░░░           
    ░▒▒▒▒▒▒▓▓▓▓▓▓▓▒▓▓▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒▒▒▒▒░░░░░░░░░░░░            
    ▒▒▒▒▒▒▒▒▓▒▓▓▒▒▒▓▒▒▒▓▓▓▒▓▒▒▒▒▒▓▒▓▒▒▒▒▒▒░░░░░░░░░░░             
    ▒▒▒▒▒▒▒▒▓▒▒▒▒▒▒▒▒▒▒▒▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░░░░                    
    ░░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░░░░                    
     ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░░░░                     
     ▒░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░░░░░                 ░    
     ▒▒▒▒▒▒▒▒▒▒▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░░░░░                     
     ░▒▒▒▒▒▒▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░░░░                ░     
      ▒▒▓▓▒▓▓▓▒▒▒▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░░░░                ░░     
      ▒▒▓▓▓▓▓▓▓▒▓▓▓▓▓▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░░░░░       ░ ░░  ░░     
      ▒▒▓▓▓▒▓▓▓▓▓▓▓▓▓▓▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░▒░░░░    ░░░░░░░ ░░░     
      ▒▓▓▓▓▓▓█▓▓▓██▓▓▓▓▓▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░░░░ ░░░░░░░░ ░░      
       ▓▓████████████▓▓▓▓▓▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░░░░░░░░░░░░▒▒      
       █▒▓█████████████▓▓▓▓▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░░░░░░░░░▒▒░░▒      
       █▒▓█████████████████▓▓▓▓▒▓▒▓▒▒▒▒▒▒▒▒▒▒▒▒░░░▒▒▒▒▒▒░▒▒░      
       ▒▓▓███████████████████▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒▒▒▒▒░▒▒▒▒▒▒▒░▒▒░      
       ░▓▓▓█████████████████████████▓▓▓▓▓▓▓▓▓▓▓▒▒▒▓▒▒▒▒▒░▒░       
        ▓▒▓██████████████████████████████▓▓▓▓▓▓▒▒▒▓▓▒▒▒▒▒▒        
        ▓▒▓▓██████████████████████████████████▓▒▒▒▓▓▒▒▒▒▒▒░       
        █▓▓▓██████████████████████████████████▓▒▒▒▓▓▓▒▒▒▒░░       
        ▒▓▒███████████████████████████████████▓▒▒▓▓▒▓▒▒▒▒░        
        ░▒▒███████████████████████████████████▓▒▒▒▒▒▒▒▒░▒▒        
        ░ ▓▒██████████████████████████████████▓▒▒▓▓▓▓▒░▒░░        
            ▓█████████████████████████████████▓▒▒▓▓▒▓▒░░░         
         █ ▒░▓█████████████████████████████▓▓▓▒▒▒▓▓▓▓▒▒▒          
          ▓█▒▓▒██▒▓██████████████████████████▓▒▒▓▓▓▒▒▒▒▒          
           ▒░█▒▒░▓▒██████████████████████████▒▒▒▓░▒▒▒▒░░          
            ▒░▒█░▒░▓▓▓▓██▓██▓▓▓▒▒████▓▒▒▓▒▓▓▒▒▓▒▓▒▒▓▒░            
              ▓▒▒█████▓▒▒▒▒▒▒▒▓░░▓▓▓▓▓▓▓████░░░▒▓▒▒░              
                ░ ░░▒▒▒████████░▒█▓▓▓▓▓█████▓▒▒▓▒░                
                   ▒██▒░▒▒▒▒▒▒▒░▒▒▒▓▓▒▓▓██▓▒█▒▒                   
                           ░▓██▒░▓██▒                             `}
                  </pre>
                </div>
              )}
              {workLocation === "office" && (
                <div className="coffee-cup-container">
                  <pre className="coffee-cup-ascii">
                    {`                                                                   
           █████████████████████████████████████████████           
      ████████████ ▒░ ░▒▒▒▓▓▓▓▓▓█████████████████████████████      
      ██▓░  ████████████████████▓   ▒▒    ░▒▒▒▒▒▓▓▓██▓█   ▒▒█      
      █████▓░  ░█▓    ░▓███████████████████▒ ░      ▒████████      
      █████████▓▓▓██████████████████▓█████████████████████████     
   █████████████▓████▓██████████████████████████████████████▓███▓  
 ████▓▒▒▓██████▓██████▓█████████████████████████████████████▒▒████ 
 ████▓███▒░░░░░ ░▒▓██████████████████████████████████████████▓░  █░
 ██░░▒██████████████▓███████████████████████████████████▓    ▒████ 
 █████▓       ▒▓▓████▓▓▒▓▓▓█████████████▓▒▒░            ░█████████ 
 ██████████████▓▓▓████████████████████████████████████████████████ 
  █████████▓▓█▓▓▓▓▓▓▓████████████████████████████████████████████  
      ████████████▓█▓████████████████████████████████████████      
             █████████████████████████████████████████             
                                                      ░▓▓██▒░      
                                                 ░░░▒▒▒▒▒▒▒▒       
                              ░░░░░░░░░░░░░░▒▒▒▒▒▒▒▒▒░░░▒▒▒▒       
                               ░ ░░░░░░░░▒▒▒▒▒░░░░░░░░▒▒▒▒▒░       
                                ░░░░░░░░░░░░░░░░░░▒▒▒▒▒▒▒▒         
       █                         ░░░░ ░░░░░░░░░░▒▒▒▒▒░▒▒▒  █       
        ▓▓                          ░░░░░░░░░░░░▒░░░░░   ▓█        
        ░████                         ░ ░ ░           ▒████        
         ▒▒░▒██████                             ▒██████████        
         ▒▒░▓░░░▒▒▓██████████████████████████████▓█▒▓▓▒▓▓█▒        
         ░▒▒▒▒░▒░░░▒░▒ ▒▒▒▒░▓▒▒█▒▒▒▒▒▒▒▓░▒▓▒▒▒▒▒▓▓▓▓▓▓▒█▓█         
          ▒▒░▒░▒▒▒▓▒░▒▒▒▒▒▒▒▓▒▒▒▓▓█▒▓▓▒▓█▓▒▓▓▓▓█▒▓▓▒▓▓▓███         
          ▒▒▒░▒▒▒▒░▒▒▓░▒▒▓░░▒▒▒▒▒▒▒▒▒▒▒▒▓▓▒▒▒▒▒▓▒▓▓▒▓█▒██▓         
          ▒░░▒▒░░▒▒▒▒▒░▒▒▒▒▓▒▓ ▒▒▓▒▒▒▒▓▒▒▒▓▓▒▒▓▓█▓▓█▓▓▓██          
          ░▓░▒▒░▒▒░▒░░▒▓░▒░░░▓▓▓▒▒▓▒▒▓▓▒▓▒▒▒█▓▓▒▒▒▓▓▓█▓██          
           ▒▒▒░▒▒▒░░▒▒▒▒░▒░▓▒▒░▓▒▓▓▒▓░▓▒▓▒▓▒▒░▓▓▓▓▓▓▓▓▓██          
           ▒▒░▒░▒░▒▒▒▒▒░▒▒ ▒░▒▒░▓ ▓░▒▓▒▒▒▓▓▒▓▓█▓▒▓▓▓▓▓██░          
           ▒▒▒▒▒ ▒▒▒▒░░░▒▒▒▒▓▒█▒▓░▓▒▓▒▒▒▓▒▒▓▒▓▓▒▒▓▓▓█▓▓█           
            ▒▒░▒▒░▒░▒▒▒▒▒░▒░▒▒░▒▓░▒▓▒▓▓▒▒▓▓▓▒▒▒▓█▓▓█▓▓██           
            ▒▒▒▒░░░░░░▒░▓▒░▒▒░▒▒▓▓░▒░▒░▓▒▒▒▓███▒█▓▓▓▓██▓           
            ▒▒░░░▒▒▒▒░▒▒▒▒░░▒▒▒▓░▒▒█▒█▒▒█▒▓▒▒▒▒▓▓▒▓▓▓██            
             ▓▒▒░▒░▒▒░▒░░░▒▓▓▒▒▒▓▓▒▒▒█▓▒▒▒▓▓▓▓▓▓▓▓▓▓█▓█            
             ▓░▒░▒░▒░░░▒▒▒░▒░▒▒▒░▒▒▒▒▒░▓▒▒▓▒▓▓▓▓▒▓▓▓▓██            
             ▒▒▒▒▒░░▒▒▒▒░░▒░▒▒▒▒▒▒▓▒▓▒▒▒▒▓▓▓▓▒▓▓▓▓▓▓██             
             ░▒░▒░▒▒▒▒▒ ▒▓▒▓▒▒▒▓▓▒▒▒▒▒▓▒▓▓▒▓▓▓▓▓▓▓▓▓██             
              ▒▒░░░░░▒▒░▒░░▒▒▓▒▒▒▒▒▒▒▓▒▒▒▒▓▓▓▓▓▒▓▓▓▓██             
              ▓▒▒▒░░▒▒▒░▒▒▒▒▒▒▒▒▒▒▓▓▒▒▒█▒▓▓░▒▒▒▓▓▓▓▓█▓             
              ▒▒▒▒░░▒░░▒▒▒▒▒▒▒▓░▒▓▒▒▒▓▒▓▒▓▒▓▓▓▓▓▒▓█▓█              
              ░▒▒░▒░▒▒▒▒▒▒▒▒░▒▒▒▒▒▒▓▒▒▓▓▒▒▓▒▓▓▓▓▓▓▓██              
               █▒░░░ ░ ▒▒▒░▒▒▓▒▒▓▓▒▒▒▒▒▒▒▓▓▓▓▓▒▓▓▓██               
                ███▒▒░░▒▒░▒▒░░▓▒▒▒▒▒▒▓▓▓▓▒▒▓▒▒▓▓▓██░               
                  ▒██▓▒▒░▒░▒▒▒▒ ▓░▓▒▒▒▓▒▒▓▒▓▓████ ░▒               
                      ▓██████████▒███████████░   ░▓                
                               ▒███▓▒         ░▒▒▒▓                
                                        ░░░░░▒▒▒▒▓▒ ░              
                                    ░░░░░░▒░░▒▒▒▒▒▒░               
                ░                 ░░░░░░░░▒░▒░▒▒▓▓▓                
                 ░                 ░░░░░░░░▒▒▒▒▓█ ░                
                 ░░▒              ░░░░░░░░░▒▒██░                   
                    ░▒▓                ░▒▒▓█▒                      
                                                                   `}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div id="dogFrame"
        className="dogframe"
        style={{ position: 'absolute', left: '1250px', top: '640px' }}>
        <div className="dragarea"></div>
        <h3>Merlin</h3>
        <div className="dog-image-container">
          <img src="/assets/Merlin1.jpg" alt="Border Collie named Merlin" />
        </div>
      </div>
      {/* Main album list window */}
      <div
        id="playlistWindow"
        className="window"
        style={{ position: 'absolute', left: '450px', top: '550px' }}
      >
        {/* Draggable title bar */}
        <div className="dragarea"></div>
        <h3>Work Playlist</h3>
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
                    {artist} - <span>{songPlaying[index]}</span>
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
    </div>
  );
};

export default About;
