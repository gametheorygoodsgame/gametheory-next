'use client';

import React, { ChangeEvent } from 'react';
import './card.css';

interface CardProps {
    id: string;
    onChange: any;
    side: string;
}

export default function Card(props: CardProps) {
    const { id, onChange, side } = props;

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedSide = event.target.getAttribute('data-side');
        onChange(selectedSide);
    };

    return (
        <div>
            <label htmlFor={`selected-item-${id}`} className="selected-label">
                <input
                  type="checkbox"
                  name="selected-item"
                  id={`selected-item-${id}`}
                  value={id}
                  onChange={handleInputChange}
                  data-side={side}
                />
                <div className={`selected-content-${side}`} />
            </label>
        </div>
    );
}
