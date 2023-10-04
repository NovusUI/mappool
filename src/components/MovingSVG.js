import React from 'react';
import "./MovingSVG.css"
const MovingSVG = () => {
  return (
    <div className="svg-container">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100"
        height="100"
        viewBox="0 0 100 100"
        fill="none"
        className="moving-circle"
      >
        <circle cx="50" cy="50" r="48.75" stroke="url(#paint0_linear_7_243)" stroke-width="2.5" />
        <defs>
          <linearGradient id="paint0_linear_7_243" x1="78.5" y1="75.5" x2="93.5" y2="66" gradientUnits="userSpaceOnUse">
            <stop stop-color="#1FD431" />
            <stop offset="0.95568" stop-color="#1FD431" stop-opacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default MovingSVG;
