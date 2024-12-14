'use client';

import React from 'react';
import './instruction.css'; // Import the CSS file

export interface InstructionProps {
    id: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>, side: string) => void;
    side: string;
}

/**
 * A functional component that renders a checkbox input wrapped in a label.
 * The checkbox represents an instruction card, and the component is memoized for performance optimization.
 * It triggers an `onChange` event whenever the checkbox is clicked, passing the event and the side of the card.
 * The component is styled with a dynamic class based on the `side` prop.
 * 
 * @param {InstructionProps} props - The props for the PlayCard component.
 * @param {string} props.id - The unique identifier for the instruction card.
 * @param {function} props.onChange - A callback function that is invoked when the checkbox value changes.
 * @param {string} props.side - Specifies which side of the instruction card the component belongs to (e.g., "left" or "right").
 * 
 * @returns {JSX.Element} A checkbox input wrapped inside a styled label element.
 * 
 */
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