'use client';

import React, { forwardRef, useEffect, useState } from 'react';
import { Bar, LabelList, CartesianGrid, ComposedChart, Legend, Line, Tooltip, XAxis, YAxis } from 'recharts';
import { Game } from '@gametheorygoodsgame/gametheory-openapi/api';
import { logger } from '@/utils/logger';

type PlotProps = {
    game: Game | undefined;
    portHeight: number;
    portWidth: number;
};

/**
 * A component that displays a composed chart for a game’s statistics.
 *
 * The chart includes a bar graph for the number of red cards played and a line graph for the red card hand value across game turns.
 * 
 * @param {PlotProps} props - The props for the Plot component.
 * @param {Game | undefined} props.game - The game object containing the game statistics.
 * @param {number} props.portHeight - The height of the port (container) for the chart.
 * @param {number} props.portWidth - The width of the port (container) for the chart.
 * 
 * @returns {JSX.Element} A composed chart rendered using the provided game data.
 * 
 * @example
 * const game = {
 *   currentTurn: 5,
 *   cardHandValue: [0, 2, 4, 6, 8, 10],
 *   potCards: [0, 1, 2, 3, 4, 5]
 * };
 * <Plot game={game} portHeight={500} portWidth={800} />
 */
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
  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
>
  <CartesianGrid />
  <XAxis dataKey="turn" />
  <Tooltip />
  <Legend />

  {/* Sichtbare Y-Achse für Balken */}
  <YAxis yAxisId="left" allowDecimals={false}  domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.5)]} />

  {/* Unsichtbare Y-Achse für die Linie */}
  <YAxis yAxisId="right" hide />

  {/* Balken für rote Karten */}
  <Bar
    dataKey="numOfRedCardsPlayed"
    name="Anzahl Roter Karten im Pot"
    fill="#334d80"
    barSize={60}
    yAxisId="left"
  >
    <LabelList
      dataKey="redCardHandValue"
      position="top"
      content={({ x, y, value, width }) => {
        const radius = 16;

        // Typensicherheit und sinnvolle Sichtbarkeit prüfen
        const numValue = Number(value);
        const posX = Number(x);
        const posY = Number(y);
        const barWidth = Number(width);

        if (
          isNaN(numValue) ||
          isNaN(posX) ||
          isNaN(posY) ||
          isNaN(barWidth) ||
          posY < 0
        ) {
          return null;
        }

        const centerX = posX + barWidth / 2;
        const centerY = posY - radius - 2; // nie zu weit oben

        return (
          <g transform={`translate(${centerX}, ${centerY})`}>
            <circle r={radius} stroke="#cc4444" fill="none" />
            <text
              x={0}
              y={7}
              textAnchor="middle"
              fill="#cc4444"
              fontSize={18}
              fontWeight="bold"
            >
              {numValue}
            </text>
          </g>
        );
      }}
    />
  </Bar>

  {/* Unsichtbare Linie – beeinflusst die Y-Achse nicht */}
  <Line
    dataKey="redCardHandValue"
    name="Wert der Roten Karte"
    stroke="#cc4444"
    strokeWidth={0}
    strokeOpacity={0}
    dot={false}
    activeDot={false}
    yAxisId="right"
  />
</ComposedChart>

      
    );
});

Plot.displayName = 'Plot';

export default Plot;
