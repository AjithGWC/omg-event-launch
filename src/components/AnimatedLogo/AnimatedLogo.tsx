import React from 'react';
import logo from "../../assets/site-logo.png";

interface AnimatedLogoProps {
  size?: 'small' | 'medium' | 'large' | 'xlarge';
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ size = 'small' }) => {
  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-16 h-16',
    large: 'w-24 h-24',
    xlarge: 'w-48 h-48',
  };  

  return (
    <div className={`relative ${sizeClasses[size]}`}>
      {/* Red and Blue Abstract Figure - O shape */}
      <div className="w-full h-full animate-tilt">
        <img src={logo} alt="logo" className="w-full h-full" />
      </div>
    </div>
  );
};

export default AnimatedLogo;

