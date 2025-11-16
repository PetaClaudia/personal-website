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

    // Determine bounds element (full document) for dragging
    const dragBounds =
      typeof document !== "undefined" ? document.documentElement : null;

    // Create draggable instances for each letter path
    draggablePaths.forEach((path, index) => {
      // Make each path draggable
      Draggable.create(path, {
        type: "x,y",
        inertia: true,
        bounds: dragBounds || undefined,
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
          height="100%"
          viewBox="0 0 1000 1000"
          width="100%"
          xmlns="http://www.w3.org/2000/svg"
          id="logo"
        >
          <g>
            <text
              className="draggable-path"
              x="19%"
              y="30%"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="150"
              fontFamily="Chicago, monospace"
              fill="black"
            >
              W
            </text>
            <text
              className="draggable-path"
              x="31%"
              y="30%"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="150"
              fontFamily="Chicago, monospace"
              fill="black"
            >
              e
            </text>
            <text
              className="draggable-path"
              x="38%"
              y="30%"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="150"
              fontFamily="Chicago, monospace"
              fill="black"
            >
              l
            </text>
            <text
              className="draggable-path"
              x="45%"
              y="30%"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="150"
              fontFamily="Chicago, monospace"
              fill="black"
            >
              c
            </text>
            <text
              className="draggable-path"
              x="53%"
              y="30%"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="150"
              fontFamily="Chicago, monospace"
              fill="black"
            >
              o
            </text>
            <text
              className="draggable-path"
              x="65%"
              y="30%"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="150"
              fontFamily="Chicago, monospace"
              fill="black"
            >
              m
            </text>
            <text
              className="draggable-path"
              x="77%"
              y="30%"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="150"
              fontFamily="Chicago, monospace"
              fill="black"
            >
              e
            </text>
            <text
              className="draggable-path"
              x="84%"
              y="30%"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="150"
              fontFamily="Chicago, monospace"
              fill="black"
            >
              !
            </text>
          </g>
        </svg>
      </div>
      <span className="draggable-tooltip" ref={tooltipRef} id="tooltip">
        Drag me!
      </span>
    </div>
  );
};

export default DraggableText;
