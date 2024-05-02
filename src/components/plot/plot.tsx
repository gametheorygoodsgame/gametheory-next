'use client';

import React, { forwardRef, useEffect, useState } from 'react';
import { Bar, CartesianGrid, ComposedChart, Legend, Line, Tooltip, XAxis, YAxis } from 'recharts';
import { Game } from '@gametheorygoodsgame/gametheory-openapi/api';
import { logger } from '@/utils/logger';

type PlotProps = {
  game: Game | undefined;
  portHeight: number;
  portWidth: number;
};

const Plot = forwardRef<any, PlotProps>((props, ref) => {
    const { portHeight, portWidth } = props;
    const [gameStatistic, setGameStatistic] = useState<any[]>([]);

    const fetchGame = async () => {
        try {
            if (props.game) {
                const gameStatisticsTemp: Object[] = [];

                for (let i = 1; i <= props.game.currentTurn; i++) {
                    const currentTurnObj = {
                        redCardHandValue: props.game.cardHandValue[i],
                        numOfRedCardsPlayed: props.game.potCards[i],
                    };
                    gameStatisticsTemp.push(currentTurnObj);
                }

                setGameStatistic(gameStatisticsTemp);
                logger.info('Fetched game data successfully.');
            }
        } catch (error) {
            logger.error('Error fetching data: ', error);
        }
    };

    useEffect(() => {
        fetchGame();
    }, [props.game]);

    return (
        <ComposedChart
          width={portWidth - 500}
          height={portHeight - 300}
          data={gameStatistic}
          margin={{
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
            }}
        >
            <CartesianGrid />
            <XAxis dataKey="turn" />
            <Tooltip />
            <Legend />
            <Bar dataKey="numOfRedCardsPlayed" name="Anzahl Roter Karten im Pot" fill="#334d80" barSize={60} />
            <Line dataKey="redCardHandValue" name="Wert der Roten Karte" stroke="#cc4444" strokeWidth={3} />
            <YAxis allowDecimals={false} />
        </ComposedChart>
    );
});

Plot.displayName = 'Plot';

export default Plot;
