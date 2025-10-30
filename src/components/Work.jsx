import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import "./Work.css";

gsap.registerPlugin(Draggable);

/**
 * Work Component - Work History Window
 * 
 * Displays work experience in a draggable retro Mac-style window
 */
const Work = () => {
  const containerRef = useRef(null);

  /**
   * Main useEffect - handles component initialization and cleanup
   * Sets up draggable functionality
   */
  useEffect(() => {
    /**
     * Set up GSAP Draggable functionality
     * Makes the window draggable within the container bounds
     */
    let highestZ = 100;

    const setupDraggable = () => {
      try {
        const bringToFront = (element) => {
          const allWindows = document.querySelectorAll('.window, .nowplaying, .analyzer, .workfuel, .dogframe, .work-window');
          let currentHighest = 0;
          allWindows.forEach(win => {
            const z = parseInt(window.getComputedStyle(win).zIndex) || 0;
            if (z > currentHighest) currentHighest = z;
          });

          const newZ = Math.max(highestZ, currentHighest) + 1;
          highestZ = newZ;
          gsap.set(element, { zIndex: newZ });
        };

        // Initialize draggable
        const workWindow = document.querySelector('#workHistoryWindow');
        if (workWindow) {
          gsap.set(workWindow, { zIndex: highestZ });
          
          Draggable.create('#workHistoryWindow', {
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
        }
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
      const draggables = Draggable.get('#workHistoryWindow');
      if (draggables) {
        draggables.kill();
      }
    };
  }, []);

  return (
    <div ref={containerRef} id="workContainer">
      {/* Work History Window */}
      <div
        id="workHistoryWindow"
        className="work-window"
        style={{ position: 'absolute', left: '500px', top: '400px' }}
      >
        {/* Draggable title bar */}
        <div className="dragarea"></div>
        <h3>Work History</h3>
        <div className="work-content">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
            quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore 
            eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt 
            in culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <p>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium 
            doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore 
            veritatis et quasi architecto beatae vitae dicta sunt explicabo.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Work;
