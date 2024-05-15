import React from 'react';
import PlayCard from '@/components/playCards/playCard'; //
import './playCardGrid.css'; // Import the CSS file

interface PlayCardGridProps {
    onChange: (event: React.ChangeEvent<HTMLInputElement>, side: string) => void;
}

const PlayCardGrid: React.FC<PlayCardGridProps> = ({ onChange }) => (
    <div className="wrapper">
        <div className="container">
        {[
            { id: '1', side: 'left' },
            { id: '2', side: 'left' },
            { id: '3', side: 'right' },
            { id: '4', side: 'right' },
        ].map((card) => (
            <PlayCard
              id={card.id}
              onChange={
                    (event) => onChange(event, card.side)
                }
              side={card.side}
            />
        ))}
        </div>
    </div>
);

export default PlayCardGrid;
