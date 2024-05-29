'use client';

import React from 'react';
import './instruction.css'; // Import the CSS file

export interface InstructionProps {
    id: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>, side: string) => void;
    side: string;
}

const PlayCard: React.FC<InstructionProps> = React.memo(({ id, onChange, side }) => (
        <div className="item">
            <label htmlFor={`instruction-${id}`} className={`instruction-label instructionBody-${side}`}>
                {/* Added a class 'selected' when the card is checked */}
                <input
                  type="checkbox"
                  name="instruction"
                  id={`instruction-${id}`}
                  value={id}
                  onChange={(e) => onChange(e, side)}
                  data-side={side}
                />
                <div className={`instructionBody-${side}  instruction`} />
            </label>
        </div>
    ));

export default PlayCard;