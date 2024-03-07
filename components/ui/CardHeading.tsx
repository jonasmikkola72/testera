import * as React from "react"

interface CardHeadingProps {
  title: string;
  className?: string; // Optional className prop
}

const CardHeading: React.FC<CardHeadingProps> = ({ title, className }) => {
  // Apply the default class along with any custom classes passed in.
  // If className is not provided, only the default classes are applied.
  const barClasses = `card-heading-bar ${className || ''}`;

  return (
    <div className="card-heading">
      <div className={barClasses}></div>
      <h1 className="card-heading-title">{title}</h1>
    </div>
  );
};

export default CardHeading;