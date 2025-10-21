import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";

const DraggableText = () => {
  const tooltipRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Register the Draggable plugin
    gsap.registerPlugin(Draggable);

    const tooltip = tooltipRef.current;
    const draggablePaths =
      containerRef.current?.querySelectorAll(".draggable-path");

    if (!tooltip || !draggablePaths) return;

    // Initially hide tooltip
    tooltip.style.visibility = "hidden";
    tooltip.style.opacity = "0";

    // Track if we're dragging (to prevent tooltip flicker during drag)
    let isDragging = false;

    // Create draggable instances for each letter path
    draggablePaths.forEach((path, index) => {
      // Make each path draggable
      Draggable.create(path, {
        type: "x,y",
        inertia: true,
        onDragStart: function () {
          isDragging = true;
          gsap.to(this.target, { opacity: 0.7, duration: 0.2 });
          hideTooltip();
        },
        onDragEnd: function () {
          isDragging = false;
          gsap.to(this.target, { opacity: 1, duration: 0.2 });
        },
        onPress: function () {
          // Bring to front by appending to parent
          const parent = this.target.parentNode;
          parent.appendChild(this.target);
        },
      });

      // Mouse events for tooltip
      path.addEventListener("mouseenter", function (e) {
        if (!isDragging) {
          showTooltip(e);
        }
      });

      path.addEventListener("mouseleave", function () {
        if (!isDragging) {
          hideTooltip();
        }
      });

      path.addEventListener("mousemove", function (e) {
        if (!isDragging) {
          moveTooltip(e);
        }
      });
    });

    function showTooltip(e) {
      tooltip.style.visibility = "visible";
      tooltip.style.opacity = "1";
      moveTooltip(e);
    }

    function hideTooltip() {
      tooltip.style.visibility = "hidden";
      tooltip.style.opacity = "0";
    }

    function moveTooltip(e) {
      // Position tooltip exactly on the cursor
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      tooltip.style.left = mouseX + "px";
      tooltip.style.top = mouseY + "px";
    }

    // Debug log to verify script is running
    console.log(
      "Draggable functionality initialized for",
      draggablePaths.length,
      "SVG paths"
    );

    // Cleanup function
    return () => {
      // Clean up event listeners and draggable instances
      draggablePaths.forEach((path) => {
        path.removeEventListener("mouseenter", showTooltip);
        path.removeEventListener("mouseleave", hideTooltip);
        path.removeEventListener("mousemove", moveTooltip);
      });
    };
  }, []);

  return (
    <div className="draggable-text-container">
      <div className="draggable-svg-container" ref={containerRef}>
        <svg
          fill="none"
          height="300"
          viewBox="0 0 1000 300"
          width="1000"
          xmlns="http://www.w3.org/2000/svg"
          id="logo"
        >
          <g>
            <text
              className="draggable-path"
              x="10%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="200" // ⬅️ Double the font size
              fontFamily="Anybody, sans-serif"
              fill="#f2e8cf"
            >
              C
            </text>
            <text
              className="draggable-path"
              x="20%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="200" // ⬅️ Double the font size
              fontFamily="Anybody, sans-serif"
              fill="#f2e8cf"
            >
              R
            </text>
            <text
              className="draggable-path"
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="96" // ⬅️ Double the font size
              fontFamily="Arial, sans-serif"
              fill="#f2e8cf"
            >
              E
            </text>
            <text
              className="draggable-path"
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="96" // ⬅️ Double the font size
              fontFamily="Arial, sans-serif"
              fill="#f2e8cf"
            >
              A
            </text>
            <path
              className="draggable-path"
              d="M212.3 438.6c-29.8 0-54.7-24.1-54.7-53.9V183.7c0-29.8 24.9-53.9 54.7-53.9h64.2c47.2 0 85.5 38.3 85.5 85.5v14.6c0 47.2-38.3 85.5-85.5 85.5H254v69.3c0 29.8-24.9 53.9-54.7 53.9zm41.7-155.7h22.5c16.8 0 30.5-13.7 30.5-30.5v-14.6c0-16.8-13.7-30.5-30.5-30.5h-22.5v75.6z"
            />
            {/* <path 
              className="draggable-path" 
              d="m1243.55 204.68c-28.16 0-39.04-14.08-39.04-54.08 0-31.36-1.28-61.7599-1.28-88.9599 0-44.16 17.28-57.27999 61.44-57.27999 36.16 0 69.44 14.07999 69.44 48.95999 0 72.3199-67.2 37.12-67.2 70.0799 0 14.4 1.6 43.2 1.6 54.72 0 20.48-3.52 26.56-24.96 26.56zm42.24-149.4399c0-5.76-5.12-9.6-11.52-9.6-7.36 0-13.44 2.88-13.44 12.48 0 6.08 3.84 8 9.92 8 7.36 0 15.04-3.84 15.04-10.88z"
            />
            <path 
              className="draggable-path" 
              d="m1181.72 132.36c13.12 0 19.2 10.56 19.2 21.76 0 32-22.4 50.88-55.68 50.88-48.32 0-53.12-43.52-53.12-92.16 0-12.16.32-24.6401.32-36.8001 0-48.96 20.16-69.11998 64-69.11998 16.32 0 35.84 5.11998 35.84 25.91998 0 27.2-45.12 9.6-45.12 27.84 0 19.52 39.04 1.6 39.04 29.12 0 32.3201-39.68 8.32-39.68 32.3201 0 8.64 8.64 11.84 16.96 11.84 6.4 0 12.48-1.6 18.24-1.6z"
            />
            <path 
              className="draggable-path" 
              d="m1070.93 132.36c13.13 0 19.2 10.56 19.2 21.76 0 32-22.39 50.88-55.67 50.88-48.325 0-53.125-43.52-53.125-92.16 0-12.16.32-24.6401.32-36.8001 0-48.96 20.155-69.11998 63.995-69.11998 16.32 0 35.84 5.11998 35.84 25.91998 0 27.2-45.12 9.6-45.12 27.84 0 19.52 39.04 1.6 39.04 29.12 0 32.3201-39.68 8.32-39.68 32.3201 0 8.64 8.65 11.84 16.97 11.84 6.4 0 12.47-1.6 18.23-1.6z"
            />
            <path 
              className="draggable-path" 
              d="m902.204 128.84c-9.92 0-11.84 15.04-11.84 29.44 0 19.84-8 45.44-28.48 45.44-29.44 0-30.4-41.6-30.4-69.76 0-14.08.96-27.84 1.28-42.56 1.92-32-1.6-90.87998 37.12-90.87998 33.92 0 26.24 49.91998 30.08 73.91998.96 5.76 2.88 8.32 5.12 8.32 2.56 0 5.44-3.2 8-7.68 9.6-17.6 2.24-72.95996 28.8-72.95996 27.84 0 32.64 30.39996 32.64 62.07996 0 16.96-1.28 34.24-1.28 47.36 0 6.4.32 13.76.32 21.76 0 29.12-1.92 71.68-32.64 71.68-24.96 0-27.52-24-27.52-48 0-15.04-.64-28.16-11.2-28.16z"
            />
            <path 
              className="draggable-path" 
              d="m826.275 137.8c0 45.12-36.16 69.12-75.84 69.12-18.88 0-30.72-14.08-30.72-30.72 0-35.2 44.16-36.48 44.16-67.52 0-20.48-37.12-23.36-37.12-48 0-41.6 39.36-54.39997 73.92-54.39997 12.16 0 25.6 5.75997 25.6 22.07997 0 25.6-31.68 17.28-31.68 36.16 0 23.68 31.68 32.0001 31.68 73.28z"
            />
            <path 
              className="draggable-path" 
              d="m709.342 4.36011c10.24 0 17.6 4.16 17.6 15.35999 0 45.76-41.6 61.44-41.6 107.5199 0 11.2 1.28 23.36 1.28 35.2 0 15.68-5.12 42.56-23.68 42.56-22.72 0-30.72-25.92-30.72-44.16-.64-16-.96-31.68-.96-48 0-31.3599-34.24-44.4799-34.24-71.0399 0-14.4 10.88-32.31998 25.6-32.31998 26.88 0 27.52 44.15998 36.48 44.15998 12.8 0 16-49.27999 50.24-49.27999z"
            />
            <path 
              className="draggable-path" 
              d="m480.475 205c-24.96 0-31.04-40.64-31.04-68.48 0-29.12 1.6-55.9998 1.6-85.1198 0-20.16 8.64-46.72002 26.56-46.72002 22.4 0 26.24 12.80002 26.24 26.56002 0 7.04-1.28 13.44-1.28 19.2 0 6.4 1.28 16 7.04 16 18.24 0 30.4-56.64001 65.92-58.56003h.96c10.88 0 20.16 11.52003 20.16 23.36003 0 38.72-37.44 48.96-37.44 63.04 0 20.4798 39.04 48.9598 39.04 83.1998 0 14.72-8 30.08-26.24 30.08-39.04 0-40.96-89.28-54.72-89.28-7.04 0-7.68 13.76-7.68 20.48 0 4.8.32 9.28.32 12.16 0 29.12-.64 54.08-29.44 54.08z"
            />
            <path 
              className="draggable-path" 
              d="m402.947 6.6001c20.16 0 38.08 8.96 38.08 25.6 0 61.44-60.8 7.04-60.8 71.9999 0 66.88 66.56 22.08 66.56 70.08 0 19.2-22.08 30.72-44.48 30.72-51.84 0-76.48-39.68-76.48-92.8 0-78.3999 43.84-105.5999 77.12-105.5999z"
            />
            <path 
              className="draggable-path" 
              d="m200.155 66.1201c6.08-27.2 15.36-59.52 42.88-59.52 57.92 0 81.92 95.9999 81.92 157.1199 0 17.92-4.8 34.88-22.08 34.88-23.04 0-25.92-23.04-31.04-41.6-2.24-8-7.36-10.88-15.36-10.88-3.52 0-7.36.32-11.84 1.28-6.4 1.6-6.72 3.52-8 9.92-4.8 20.16-7.68 47.68-31.68 47.68-17.92 0-23.68-13.76-23.68-35.52 0-30.4 12.16-73.2799 18.88-103.3599zm46.08 37.4399c3.52.64 7.68.96 11.84.96 4.48 0 5.44-.96 5.44-6.0799 0-15.68-5.76-33.6-10.88-33.6-7.68 0-11.52 20.48-11.52 34.24 0 2.5599.96 3.8399 5.12 4.4799z"
            />
            <path 
              className="draggable-path" 
              d="M17.25 58.10Q12.35 58.10 8.43 56.07Q4.50 54.05 2.25 50.05Q0 46.05 0 40.20Q0 34.35 2.28 30.10Q4.55 25.85 8.53 23.57Q12.50 21.30 17.60 21.30Q23.50 21.30 26.65 22.95Q29.80 24.60 29.80 27.85Q29.80 30.35 28.45 31.97Q27.10 33.60 24.75 33.60Q22.75 33.60 20.88 33.07Q19 32.55 16.50 32.55Q13.30 32.55 11.45 34.40Q9.60 36.25 9.60 39.25Q9.60 42.20 11.45 44.17Q13.30 46.15 16.50 46.15Q18.20 46.15 19.63 45.87Q21.05 45.60 22.43 45.30Q23.80 45.00 25.40 45.00Q28.05 45.00 29.30 46.72Q30.55 48.45 30.55 51.00Q30.55 53.55 28.70 55.12Q26.85 56.70 23.82 57.40Q20.80 58.10 17.25 58.10Z"
            /> */}
          </g>
        </svg>
      </div>
      <span className="draggable-tooltip" ref={tooltipRef} id="tooltip">
        Drag me!
      </span>
      <p className="draggable-instructions">
        Hover over any character to see the tooltip and drag to reposition.
      </p>
    </div>
  );
};

export default DraggableText;
