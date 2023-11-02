'use client';

import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Bar, CartesianGrid, ComposedChart, Legend, Line, Tooltip, XAxis, YAxis } from 'recharts';
import { Game, GameApi } from '@eikermannlfh/gametheoryapi/api';
import { logger } from '@/utils/logger';

type PlotProps = {
  gameId: string;
  portHeight: number;
  portWidth: number;
};

const Plot = forwardRef<any, PlotProps>((props, ref) => {
  const { gameId, portHeight, portWidth } = props;
  const [gameStatistic, setGameStatistic] = useState<any[]>([]); // Change 'any' to the actual type of gameStatistic
  const [game, setGame] = useState<Game>();

  const gameApi = new GameApi();

  const fetchGame = async () => {
    try {
      const response = await gameApi.getGameById(gameId);
      setGame(response.data);
      logger.info('Fetched game data successfully.');
      logger.debug(response.data);
    } catch (error) {
      logger.error('Error fetching data: ', error);
    }
  };

  const gameStatisticsTemp: Object[] = [];

  if (!game) {
    throw new Error('Game not found');
  }

  // eslint-disable-next-line no-plusplus
  for (let i = 1; i < game.currentTurn - 1; i++) {
    const currentTurnObj = {
      redCardPotValue: game.cardPotValue[i],
      numOfRedCardsPlayed: game.potCards[i],
    };
    gameStatisticsTemp.push(currentTurnObj);
  }

  setGameStatistic(gameStatisticsTemp);

  useImperativeHandle(ref, () => ({
    fetchGame,
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
