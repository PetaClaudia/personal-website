import React, { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import "./About.css";
import "../App.css";
import "./History.css";
import "./Contact.css";
import "./Skills.css";
import Skills from "./Skills";

// Register the Draggable plugin for GSAP
gsap.registerPlugin(Draggable);

/**
 * Windows Component - Retro Macintosh Music Player Interface
 *
 * This component creates a nostalgic recreation of a classic Macintosh music player
 * with draggable windows, audio playback, and visualiser functionality.
 * 
 * @param {boolean} showAbout - Whether to display the 'about' windows
 * @param {boolean} showHistory - Whether to display the 'history' windows (work and education)
 * @param {boolean} showContact - Whether to display the 'contact' window
 * @param {boolean} showSkills - Whether to display the 'skills' window
 */
const Windows = ({ showAbout = false, showHistory = false, showContact = false, showSkills = false }) => {
  // State management for audio playback and UI
  const [currentSong, setCurrentSong] = useState(0); // Currently selected track index
  const [isPlaying, setIsPlaying] = useState(false); // Play/pause state
  const [activeSource, setActiveSource] = useState(null); // Web Audio API source node
  const [buffers, setBuffers] = useState({}); // Audio buffers for all tracks
  const [context, setContext] = useState(null); // Web Audio API context
  const [analyser, setAnalyser] = useState(null); // Audio analyser for visualiser
  const [workLocation, setWorkLocation] = useState("home"); // Work location toggle: 'home' or 'office'
  const [hearts, setHearts] = useState([]); // Array of floating hearts with positions
  const [zIndexAbout, setZIndexAbout] = useState(1000); // Z-index for about windows
  const [zIndexHistory, setZIndexHistory] = useState(999); // Z-index for history windows
  const [zIndexContact, setZIndexContact] = useState(998); // Z-index for contact window
  const [zIndexSkills, setZIndexSkills] = useState(997); // Z-index for skills window
  const [isHoveringMerlin, setIsHoveringMerlin] = useState(false); // Track if hovering over Merlin
  const patMeRef = useRef(null); // Ref for the "Pat me" text element
  const prevShowAbout = useRef(showAbout);
  const prevShowHistory = useRef(showHistory);
  const prevShowContact = useRef(showContact);
  const prevShowSkills = useRef(showSkills);
  const maxZIndex = useRef(1000);

  // Update z-index when windows are opened (transition from false to true)
  useEffect(() => {
    // Check if About was just opened (false -> true)
    if (showAbout && !prevShowAbout.current) {
      maxZIndex.current += 1;
      setZIndexAbout(maxZIndex.current);
    }
    prevShowAbout.current = showAbout;
  }, [showAbout]);

  useEffect(() => {
    // Check if History was just opened (false -> true)
    if (showHistory && !prevShowHistory.current) {
      maxZIndex.current += 1;
      setZIndexHistory(maxZIndex.current);
    }
    prevShowHistory.current = showHistory;
  }, [showHistory]);

  useEffect(() => {
    // Check if Contact was just opened (false -> true)
    if (showContact && !prevShowContact.current) {
      maxZIndex.current += 1;
      setZIndexContact(maxZIndex.current);
    }
    prevShowContact.current = showContact;
  }, [showContact]);

  useEffect(() => {
    // Check if Skills was just opened (false -> true)
    if (showSkills && !prevShowSkills.current) {
      maxZIndex.current += 1;
      setZIndexSkills(maxZIndex.current);
    }
    prevShowSkills.current = showSkills;
  }, [showSkills]);

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
          const allWindows = document.querySelectorAll('.window, .now-playing, .analyzer, .work-fuel, .dog-frame, .work-window, .education-window, .contact-window, .skills-window');
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
        const windowIds = ['#playlistWindow', '#nowPlayingWindow', '#analyzerWindow', '#workFuelWindow', '#dogFrame', '#workHistoryWindow', '#educationHistoryWindow', '#contactWindow', '#skillsWindow'];

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  /**
   * Handle mouse move over Merlin - position text next to cursor relative to container
   */
  const handleMerlinMouseMove = (e) => {
    if (patMeRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      patMeRef.current.style.left = `${x}px`;
      patMeRef.current.style.top = `${y}px`;
    }
  };

  /**
   * Handle mouse enter on Merlin image
   */
  const handleMerlinMouseEnter = (e) => {
    setIsHoveringMerlin(true);
    if (patMeRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      patMeRef.current.style.left = `${x}px`;
      patMeRef.current.style.top = `${y}px`;
    }
  };

  /**
   * Handle mouse leave on Merlin image
   */
  const handleMerlinMouseLeave = () => {
    setIsHoveringMerlin(false);
  };

  /**
   * Handle click on Merlin picture - create floating heart
   */
  const handleMerlinClick = (e) => {
    // Get click position relative to the dog frame
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Create new heart with unique ID and position
    const newHeart = {
      id: Date.now() + Math.random(),
      x: x,
      y: y
    };

    setHearts(prevHearts => [...prevHearts, newHeart]);

    // Remove heart after animation completes (2 seconds)
    setTimeout(() => {
      setHearts(prevHearts => prevHearts.filter(heart => heart.id !== newHeart.id));
    }, 2000);
  };

  /**
   * Render Now Playing Window
   * Shows current track info and playback controls
   */
  const renderNowPlayingWindow = () => (
    <div
      id="nowPlayingWindow"
      className="now-playing"
      style={{ zIndex: zIndexAbout }}
    >
      <h3>Now Playing</h3>
      <div>
        <button
          id="play"
          className={isPlaying ? "playing" : ""}
          onClick={handlePlayClick}
        >
          <span></span>
        </button>
      </div>
      <div>
        <div>
          <h4 id="artist">{nowPlaying[currentSong]}</h4>
          <h4 id="song">{songPlaying[currentSong]}</h4>
        </div>
      </div>
      <div>
        <button id="prev" onClick={playPrev}>
          ‹ Prev
        </button>
        <button id="next" onClick={playNext}>
          Next ›
        </button>
      </div>
    </div>
  );

  /**
   * Render Visualiser Window
   * Shows audio frequency bars
   */
  const renderVisualizerWindow = () => (
    <div
      id="analyzerWindow"
      className="analyzer"
      style={{ zIndex: zIndexAbout }}
    >
      <h3>Visualiser</h3>
      <div>
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
  );

  /**
   * Render Work Fuel Window
   * Shows ASCII art of matcha (home) or coffee (office)
   */
  const renderWorkFuelWindow = () => (
    <div
      id="workFuelWindow"
      className="work-fuel"
      style={{ zIndex: zIndexAbout }}
    >
      <div className="drag-area"></div>
      <h3>Work Fuel</h3>
      <div className="frame">
        <div className="work-fuel-content">
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

          {workLocation === "home" && (
            <div className="matcha-container">
              <pre className="matcha-ascii">
                {/* Matcha ASCII art - keeping original from lines 560-614 */}
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
                {/* Coffee ASCII art - keeping original from lines 621-676 */}
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
  );

  /**
   * Render Merlin Dog Frame Window
   * Shows picture of Merlin with clickable hearts
   */
  const renderDogFrameWindow = () => (
    <div id="dogFrame"
      className="dog-frame"
      style={{ zIndex: zIndexAbout }}>
      <div className="drag-area"></div>
      <h3>Merlin</h3>
      <div
        className="dog-image-container"
        onClick={handleMerlinClick}
        onMouseEnter={handleMerlinMouseEnter}
        onMouseLeave={handleMerlinMouseLeave}
        onMouseMove={handleMerlinMouseMove}>
        <img
          src="/assets/Merlin1.jpg"
          alt="Border Collie named Merlin"
        />
        {/* Floating hearts */}
        {hearts.map(heart => (
          <img
            key={heart.id}
            src="/assets/pixel-heart.gif"
            alt="heart"
            className="floating-heart"
            style={{
              left: `${heart.x}px`,
              top: `${heart.y}px`
            }}
          />
        ))}
        {/* "Pat me" text that follows cursor (inside container) */}
        <div
          ref={patMeRef}
          className="pat-me-text"
          style={{ pointerEvents: 'none', left: '0px', top: '0px', display: isHoveringMerlin ? 'block' : 'none' }}
        >
          Pat me
        </div>
      </div>
    </div>
  );

  /**
   * Render Playlist Window
   * Shows album artwork and track list
   */
  const renderPlaylistWindow = () => (
    <div
      id="playlistWindow"
      className="window"
      style={{ zIndex: zIndexAbout }}
    >
      {/* Draggable title bar */}
      <div className="drag-area"></div>
      <h3>Work Playlist</h3>
      <div className="frame">
        {/* Album artwork carousel */}
        <div className="img-wrap">
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
  );

  /**
   * Render Work History Window
   * Shows work experience details
   */
  const renderWorkHistoryWindow = () => (
    <div
      id="workHistoryWindow"
      className="work-window"
      style={{ display: showHistory ? 'block' : 'none', zIndex: zIndexHistory }}
    >
      {/* Draggable title bar */}
      <div className="drag-area"></div>
      <h3>Work History</h3>
      <div className="work-content">
        <h4>Software Developer</h4>
        <p className="work-company">Fast Enterprises, LLC — New Zealand</p>
        <p className="work-period">Jan 2021 – Present</p>
        <ul>
          <li>Design and development of software solutions for large-scale enterprise systems.</li>
          <li>Deliver reliable, high-quality updates and bug fixes within strict deadlines.</li>
          <li>Write optimised SQL queries for large databases.</li>
          <li>Provide technical guidance to junior developers through mentorship program.</li>
          <li>Organise and lead the intern projects.</li>
          <li>Thoroughly tested code migrations. Development &gt; Testing &gt; Staging &gt; Production.</li>
          <li>Building relationships and working with clients.</li>
        </ul>
      </div>
    </div>
  );

  /**
   * Render Education History Window
   * Shows education details
   */
  const renderEducationHistoryWindow = () => (
    <div
      id="educationHistoryWindow"
      className="education-window"
      style={{ display: showHistory ? 'block' : 'none', zIndex: zIndexHistory }}
    >
      {/* Draggable title bar */}
      <div className="drag-area"></div>
      <h3>Education</h3>
      <div className="education-content">
        <h4>Bachelor of Science (BSc)</h4>
        <p className="education-institution">Victoria University of Wellington - Wellington, New Zealand</p>
        <p className="education-period">2018 - 2020</p>
        <ul>
          <li>Double Major in Computer Science and Computer Graphics</li>
          <li>Specialisation in Machine Learning</li>
        </ul>
      </div>
    </div>
  );

  /**
   * Render Contact Window
   * Shows contact information
   */
  const renderContactWindow = () => (
    <div
      id="contactWindow"
      className="contact-window"
      style={{ display: showContact ? 'block' : 'none', zIndex: zIndexContact }}
    >
      {/* Draggable title bar */}
      <div className="drag-area"></div>
      <h3>Contact</h3>
      <div className="contact-content">
        <div className="contact-email-row">
          <img
            src="/assets/Prompt.svg"
            alt="Prompt icon"
            className="contact-email-icon"
          />
          <div className="contact-email-text">
            <h4>Email</h4>
            <p className="contact-email-address">
              <a href="mailto:petadouglas@outlook.com">petadouglas@outlook.com</a>
            </p>
          </div>
        </div>

        <div className="contact-phone-row">
          <img
            src="/assets/Alert.svg"
            alt="Alert icon"
            className="contact-phone-icon"
          />
          <div className="contact-phone-text">
            <h4>Phone number</h4>
            <p className="phone-number"></p>
          </div>
        </div>
      </div>
    </div>
  );

  /**
   * Render Skills Window
   * Shows skills information with scrolling effect
   */
  const renderSkillsWindow = () => (
    <div
      id="skillsWindow"
      className="skills-window"
      style={{ display: showSkills ? 'block' : 'none', zIndex: zIndexSkills }}
    >
      {/* Draggable title bar */}
      <div className="drag-area"></div>
      <h3>Skills</h3>
      <div className="skills-content">
        <Skills />
      </div>
    </div>
  );

  /**
   * SVG filter for dithering effect - makes images look pixelated
   */
  const ditherSVG = () => (
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
  );

  return (
    <div style={{ position: 'static', width: '100%', height: '100%' }}>

      {/* About windows container - Now Playing, Visualiser and Work Fuel windows */}
      <div className="about-windows" style={{ display: showAbout ? 'block' : 'none' }}>
        {renderNowPlayingWindow()}
        {renderVisualizerWindow()}
        {renderWorkFuelWindow()}
        {renderDogFrameWindow()}
        {renderPlaylistWindow()}
      </div>

      {/* History windows container - Work History and Education History windows */}
      <div className="history-windows" style={{ display: showHistory ? 'block' : 'none' }}>
        {renderWorkHistoryWindow()}
        {renderEducationHistoryWindow()}
      </div>

      {/* Contact window container - Contact window */}
      <div className="contact-windows" style={{ display: showContact ? 'block' : 'none' }}>
        {renderContactWindow()}
      </div>

      {/* Skills window container - Skills window */}
      <div className="skills-windows" style={{ display: showSkills ? 'block' : 'none' }}>
        {renderSkillsWindow()}
      </div>

      {ditherSVG()}
    </div >
  );
};

export default Windows;

