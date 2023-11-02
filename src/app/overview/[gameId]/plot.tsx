'use client';

import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Bar, CartesianGrid, ComposedChart, Legend, Line, Tooltip, XAxis, YAxis } from 'recharts';

type PlotProps = {
  gameId: string;
  portHeight: number;
  portWidth: number;
};

const Plot = forwardRef<any, PlotProps>((props, ref) => {
  const { gameId, portHeight, portWidth } = props;
  const [gameStatistic, setGameStatistic] = useState<any[]>([]); // Change 'any' to the actual type of gameStatistic

  const fetchGameStatistic = async () => {
    try {
      const response = await fetch(`../api/gameStatistics?gameID=${gameId}`);
      const data = await response.json();
      setGameStatistic(data.gameStatistics);
      console.log(gameStatistic);
    } catch (error) {
      console.error('Error fetching Game Statistics: ', error);
    }
  };

  useImperativeHandle(ref, () => ({
    fetchGameStatistic,
  }));

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
      <Bar dataKey="numOfRedCardsPlayed" name="Anzahl Roter Karten im Pot" fill="#334d80" />
      <Line dataKey="redCardValue" name="Wert der Roten Karte" stroke="red" />
      <YAxis />
    </ComposedChart>
  );
});

Plot.displayName = 'Plot'; // Set the display name

export default Plot;
