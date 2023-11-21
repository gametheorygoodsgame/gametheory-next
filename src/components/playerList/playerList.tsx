'use client';

import { useEffect, useState } from 'react';
import {GameApi, GamePlayerApi, Player} from '@gametheorygoodsgame/gametheory-openapi/api';
import PlayerListView, {
  DataCollectionItem,
} from '@/components/playerList/playerListView';
import { logger } from '@/utils/logger';

export default function PlayerList({ game: Game }) {
  const [playerList, setPlayerList] = useState<Player[]>([]);
  const [currentTurn, setCurrentTurn] = useState<number>(0);

  const gameApi = new GameApi();

  const fetchData = async () => {
    try {
      const response = await gameApi.getGameById(gameId);
      if (response.status === 404) {
        throw new Error('Game not found');
      }
      setPlayerList(response.data.players);
      setCurrentTurn(response.data.currentTurn)
    } catch (error) {
      logger.error('Error fetching data: ', error);
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(fetchData, 3000);

    return () => clearInterval(intervalId);
  }, [gameId]);

  if (playerList.length === 0) {
    return <div>Loading...</div>;
  }

  // Render the DataCollectionList component with the fetched data
  return <PlayerListView playerList={game.players} currentTurn={currentTurn} />;
}
