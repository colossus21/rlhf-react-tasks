// components/StarBackground.jsx
import React from 'react';

const StarBackground = ({ children }) => (
    <div className="bg-deep-blue w-full h-full overflow-hidden absolute">
        <div className="stars"></div>
        {children}
    </div>
);

// CSS for stars would be added in a global stylesheet or Tailwind config