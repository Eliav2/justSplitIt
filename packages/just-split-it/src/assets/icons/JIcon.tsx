import React from 'react';

function JIcon({ theme = 'light', size = 8 }: { theme: 'light' | 'dark'; size: number }) {
  return (
    <svg
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      width="135.000000pt"
      height="157.000000pt"
      viewBox="0 0 135.000000 157.000000"
      preserveAspectRatio="xMidYMid meet"
    >
      <g
        transform="translate(0.000000,157.000000) scale(0.100000,-0.100000)"
        fill="#000000"
        stroke="none"
      >
        <path
          d="M550 1463 c0 -11 263 -273 274 -273 9 0 346 267 346 275 0 3 -139 5 -310 5 -171 0 -310 -3 -310 -7z"
          fill="#ED1C24"
        />
        <path
          d="M1050 1308 l-185 -149 -45 -314 c-49 -344 -51 -351 -124 -388 -58 -30 -124 -33 -179 -9 -50 22 -87 69 -87 111 0 19 -4 22 -23 19 -12 -3 -87 -18 -166 -34 l-143 -29 5 -63 c19 -238 272 -393 553 -339 125 25 237 80 311 154 60 60 113 147 132 218 12 43 144 965 139 970 -2 2 -86 -64 -188 -147z"
          fill="#1A1A1A"
        />
      </g>
    </svg>
  );
}

export default J;
