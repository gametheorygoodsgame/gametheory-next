"use client"

import React from 'react';
import './card.css';

export default function Card(props) {
    const { id, onChange, side } = props;

    const handleInputChange = (event) => {
        const selectedSide = event.target.getAttribute('data-side');
        onChange(selectedSide);
    };

    return (
        <div>
            <label className="selected-label">
                <input
                    type="checkbox"
                    name="selected-item"
                    id={`selected-item-${id}`}
                    value={id}
                    onChange={handleInputChange}
                    data-side={side}
                />
                <div className={`selected-content-${side}`}></div>
            </label>
        </div>
    );
}