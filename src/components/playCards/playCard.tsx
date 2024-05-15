'use client';

import React from 'react';
import './playCard.css'; // Import the CSS file

export interface PlayCardProps {
    id: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>, side: string) => void;
    side: string;
}

const PlayCard: React.FC<PlayCardProps> = React.memo(({ id, onChange, side }) => (
        <div className="item">
            <label htmlFor={`playCard-${id}`} className={`playCard-label playCardBody-${side}`}>
                {/* Added a class 'selected' when the card is checked */}
                <input
                  type="checkbox"
                  name="playCard"
                  id={`playCard-${id}`}
                  value={id}
                  onChange={(e) => onChange(e, side)}
                  data-side={side}
                />
                <div className={`playCardBody-${side}  playCardBody`} />
            </label>
        </div>
    ));

export default PlayCard;
