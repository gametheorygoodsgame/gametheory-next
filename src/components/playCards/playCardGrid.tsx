import { Grid } from "@mantine/core";
import PlayCard, { PlayCardProps } from "@/components/playCards/playCard"; //
import React, { ChangeEventHandler } from "react";

interface PlayCardGridProps {
    onChange: (event: React.ChangeEvent<HTMLInputElement>, side: string) => void;
}

const PlayCardGrid: React.FC<PlayCardGridProps> = ({ onChange }) => (
    <Grid gutter="md">
        {[
            { id: '1', side: 'left' },
            { id: '2', side: 'left' },
            { id: '3', side: 'right' },
            { id: '4', side: 'right' },
        ].map((card) => (
            <Grid.Col span={3} key={card.id}>
                <PlayCard id={card.id} onChange={(event) => onChange(event, card.side)} side={card.side} />
            </Grid.Col>
        ))}
    </Grid>
);

export default PlayCardGrid;
