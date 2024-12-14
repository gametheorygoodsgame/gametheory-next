'use client';

import React from 'react';
import { Badge, Stack, Text } from '@mantine/core';
import { IconCards, IconCircleCheck, IconClockHour3 } from '@tabler/icons-react';
import { Player } from '@gametheorygoodsgame/gametheory-openapi/api';
import { Game } from '@gametheorygoodsgame/gametheory-openapi';

export interface DataCollectionItem {
  id: string;
  name: string;
  isMoveMade: boolean;
}

/**
 * A component that displays a list of players in the game and their current turn status.
 * The list shows the number of players who have finished their move and updates the status for each player.
 *
 * @param {Object} props - The component props.
 * @param {Game | undefined} props.game - The game object that contains player data and game state.
 * 
 * @returns {JSX.Element} A list of players with their respective move status.
 *
 */
export default function PlayerList({ game }: { game: Game | undefined; }) {
  const icon = <IconCards />;
  const waiting = <IconClockHour3 />;
  const success = <IconCircleCheck />;

  /**
   * Returns the number of players who have finished their moves for the current turn.
   * 
   * @returns {number} The count of players who have made their move for the current turn.
   */
  function getNumFinishedPlayers() {
    let count = 0;
    game?.players.forEach((player) => {
      if (player.moves[game?.currentTurn]) {
        // eslint-disable-next-line no-plusplus
        count++;
      }
    });
    return count;
  }

  return (
    <Stack>
      <Text fw={700}>
        {getNumFinishedPlayers()} / {game ?
          game.players.length : 0} Spieler haben ihren Zug beendet.
      </Text>
      {game?.players.map((player: Player) => (
        <Badge
          leftSection={icon}
          rightSection={player.moves.length - 1 >= game?.currentTurn ? success : waiting}
          h={50}
          w={200}
          size="xl"
          radius="md"
          color={player.moves.length - 1 >= game?.currentTurn ? 'brand.0' : 'brand.7'}
          key={player.id}
        >
          {player.name}
        </Badge>
      ))}
    </Stack>
  );
}
