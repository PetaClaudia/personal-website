import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import './About.css';

// Register the Draggable plugin
gsap.registerPlugin(Draggable);

const About = () => {
  const [currentSong, setCurrentSong] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSource, setActiveSource] = useState(null);
  const [buffers, setBuffers] = useState({});
  const [context, setContext] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const [date, setDate] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef(null);

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
    "Dummy"
  ];

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
    "Nullspace"
  ];

  const albumImages = [
    'https://f4.bcbits.com/img/a2870032268_16.jpg',
    'https://f4.bcbits.com/img/a4024825693_10.jpg',
    'https://f4.bcbits.com/img/a2689309068_16.jpg',
    'https://f4.bcbits.com/img/a2871861375_16.jpg',
    'https://f4.bcbits.com/img/a3540184311_16.jpg',
    'https://f4.bcbits.com/img/a1338331199_16.jpg',
    'https://f4.bcbits.com/img/a0033648289_16.jpg',
    'https://f4.bcbits.com/img/a0990023259_16.jpg',
    'https://f4.bcbits.com/img/a4071043534_16.jpg',
    'https://f4.bcbits.com/img/a3924570048_16.jpg'
  ];

  const trackUrls = [
    'https://raw.githubusercontent.com/adamjkuhn/audiofiles/master/drug-church.mp3',
    'https://raw.githubusercontent.com/adamjkuhn/audiofiles/master/blood-incantation.mp3',
    'https://raw.githubusercontent.com/adamjkuhn/audiofiles/master/the-chisel.mp3',
    'https://raw.githubusercontent.com/adamjkuhn/audiofiles/master/prison-affair.mp3',
    'https://raw.githubusercontent.com/adamjkuhn/audiofiles/master/dead-finks.mp3',
    'https://raw.githubusercontent.com/adamjkuhn/audiofiles/master/cassandra-jenkins.mp3',
    'https://raw.githubusercontent.com/adamjkuhn/audiofiles/master/font.mp3',
    'https://raw.githubusercontent.com/adamjkuhn/audiofiles/master/usa-nails.mp3',
    'https://raw.githubusercontent.com/adamjkuhn/audiofiles/master/sheer-mag.mp3',
    'https://raw.githubusercontent.com/adamjkuhn/audiofiles/master/dummy.mp3'
  ];

  const albumTitles = [
    'Prude',
    'Absolute Elsewhere',
    'What a Fucking Nightmare',
    'Demo IV',
    'Eve of Ascension',
    'My Light, My Destroyer',
    'Strange Burden',
    'Feel Worse',
    'Playing Favorites',
    'Free Energy'
  ];

  useEffect(() => {
    // Set up date
    const dt = new Date();
    const dateString = dt.toLocaleString("en-us", { weekday: "short" }) +
      " " +
      dt.toLocaleString("default", { month: "short" }) +
      " " +
      dt.getDate();
    setDate(dateString);

    // Initialize audio context only when user interacts
    const initAudio = () => {
      if (!context) {
        try {
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const audioAnalyser = audioContext.createAnalyser();
          setContext(audioContext);
          setAnalyser(audioAnalyser);
          
          // Load buffers for all tracks
          trackUrls.forEach(url => {
            getBuffer(url, audioContext);
          });
        } catch (error) {
          console.warn('Audio context initialization failed:', error);
        }
      }
    };

    // Set up visualizer animation
    const draw = () => {
      if (analyser) {
        requestAnimationFrame(draw);
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);
        for (let i = 0; i < 11; i++) {
          document.body.style.setProperty("--top" + i, dataArray[i * 2] * 0.015);
        }
      }
    };
    draw();

    // Add keyboard event listeners
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

    // Set up draggable functionality after component mounts
    const setupDraggable = () => {
      if (containerRef.current) {
        try {
          Draggable.create(".window, .nowplaying, .analyzer", {
            bounds: containerRef.current,
            type: "x,y",
            inertia: true
          });
        } catch (error) {
          console.warn('Draggable setup failed:', error);
        }
      }
    };

    // Delay setup to ensure DOM is ready
    setTimeout(() => {
      setupDraggable();
      setIsLoaded(true);
    }, 100);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (activeSource) {
        try {
          activeSource.stop();
        } catch (error) {
          console.warn('Error stopping audio source:', error);
        }
      }
    };
  }, [analyser, activeSource, context]);

  const getBuffer = (url, audioContext) => {
    const request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";
    request.onload = function(evt) {
      try {
        audioContext.decodeAudioData(request.response, (buffer) => {
          setBuffers(prev => ({ ...prev, [url]: buffer }));
        });
      } catch (error) {
        console.warn('Audio decode failed for', url, error);
      }
    };
    request.onerror = () => {
      console.warn('Failed to load audio:', url);
    };
    request.send();
  };

  const stopActiveSource = () => {
    if (activeSource) {
      try {
        activeSource.onended = null;
        activeSource.stop(0);
        setActiveSource(null);
      } catch (error) {
        console.warn('Error stopping audio source:', error);
      }
    }
  };

  const playTrack = (url) => {
    if (!context || !analyser) {
      console.warn('Audio context not ready');
      return;
    }

    const buffer = buffers[url];
    if (!buffer) {
      console.warn('Buffer not loaded for', url);
      return;
    }

    stopActiveSource();
    try {
      const source = context.createBufferSource();
      source.connect(analyser);
      setActiveSource(source);
      
      source.onended = function() {
        setActiveSource(null);
        if (currentSong < 9) {
          playNext();
        }
      };

      source.buffer = buffer;
      source.connect(context.destination);
      source.start(0);
    } catch (error) {
      console.warn('Error playing track:', error);
    }
  };

  const handleTrackClick = (index) => {
    setCurrentSong(index);
    if (isPlaying && context) {
      playTrack(trackUrls[index]);
    }
  };

  const playNext = () => {
    if (currentSong < 9) {
      const nextSong = currentSong + 1;
      setCurrentSong(nextSong);
      if (isPlaying && context) {
        playTrack(trackUrls[nextSong]);
      }
    }
  };

  const playPrev = () => {
    if (currentSong > 0) {
      const prevSong = currentSong - 1;
      setCurrentSong(prevSong);
      if (isPlaying && context) {
        playTrack(trackUrls[prevSong]);
      }
    }
  };

  const handlePlayClick = () => {
    const newIsPlaying = !isPlaying;
    setIsPlaying(newIsPlaying);
    
    if (newIsPlaying) {
      // Initialize audio context on first play
      if (!context) {
        try {
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const audioAnalyser = audioContext.createAnalyser();
          setContext(audioContext);
          setAnalyser(audioAnalyser);
          
          // Load buffers
          trackUrls.forEach(url => {
            getBuffer(url, audioContext);
          });
          
          // Wait a bit for buffers to load
          setTimeout(() => {
            playTrack(trackUrls[currentSong]);
          }, 500);
        } catch (error) {
          console.warn('Audio context initialization failed:', error);
          setIsPlaying(false);
        }
      } else {
        playTrack(trackUrls[currentSong]);
      }
    } else {
      stopActiveSource();
    }
  };

  return (
    <div className="about-container" ref={containerRef}>
      <div id="date">{date}</div>
      
      <div className="toprow">
        <div className="nowplaying">
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
            <button id="prev" onClick={playPrev}>‹ Prev</button>
            <button id="next" onClick={playNext}>Next ›</button>
          </div>
        </div>
        
        <div className="analyzer">
          <h3>Visualizer</h3>
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
      </div>
      
      <div className="window">
        <div className="dragarea"></div>
        <h3>Top 10 Albums - 2024</h3>
        <div className="frame">
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

      <svg imageRendering="optimizeSpeed">
        <filter colorInterpolationFilters="sRGB" height="100%" id="dither" width="100%" x="0" y="0">
          <feImage height="4" width="4" xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAA+UlEQVR42gXBERTCUABA0X/OYDAYDAZBEAyCIBgMgiAIgiAYBINgEAwGgyAIBsFgMAiCIAiCIAgGQTAYDAaDIAiCwWDwulcIIXg8HgwGA36/H4qi8Hq9sCyLtm0Rm82G0WjE5XJhvV4ThiHT6ZT7/U4QBIhut0tVVaiqSpZl9Pt9vt8vnU6HsiwRh8OB5XLJfr9nNptxPp9xXZckSbBtGyHLMs/nE9M0aZoGSZJI05ThcEhd14jdbsdkMuF2u+H7PtvtlvF4zPV6xfM8hGEYfD4fdF2nKAp6vR7v9xtN08jzHHE6nVitVsRxzGKx4Hg84jgOURQxn8/5A7oKnYRU4EpfAAAAAElFTkSuQmCC" />
          <feTile />
          <feComposite in="SourceGraphic" k1="0" k2="1" k3="1" k4="-0.5" operator="arithmetic" />
          <feComponentTransfer>
            <feFuncR tableValues="0 1" type="discrete" />
            <feFuncG tableValues="0 1" type="discrete" />
            <feFuncB tableValues="0 1" type="discrete" />
          </feComponentTransfer>
        </filter>
      </svg>
      
      <div id="icon">
        <img src="https://assets.codepen.io/383755/Mac.svg" alt="" />
      </div>
    </div>
  );
};

export default About;