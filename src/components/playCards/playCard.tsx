import React, { ChangeEvent } from 'react';
import './playCard.css';

interface CardProps {
  id: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>, side: string) => void;
  side: string;
}

const PlayCard: React.FC<CardProps> = ({ id, onChange, side }) => {
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedSide = event.target.getAttribute('data-side');
    onChange(event, selectedSide || '');
  };

  return (
    <div>
      <label htmlFor={`playCard-${id}`} className="playCard-label">
        <input
          type="checkbox"
          name="playCard"
          id={`playCard-${id}`}
          value={id}
          onChange={handleInputChange}
          data-side={side}
        />
        <div className={`playCardBody-${side}`} />
      </label>
    </div>
  );
};

export default PlayCard;
