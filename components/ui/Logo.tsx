import Image from 'next/image';
import React from 'react';

interface LogoProps {
  width?: number; // Optional width with a default value
  height?: number; // Optional height with a default value
}

const Logo: React.FC<LogoProps> = ({ width = 120, height = 60 }) => {
  return (
    <Image
      src="/logoty.png" // The path to your logo image file
      alt="Logo" // A text description of the image
      width={width} // Width from props or default value
      height={height} // Height from props or default value
      objectFit="contain" // Adjusts the sizing of the image (optional)
    />
  );
};

export default Logo;
