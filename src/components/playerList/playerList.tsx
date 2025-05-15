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

export default function PlayerList({ game }: { game: Game | undefined }) {
  const icon = <IconCards />;
  const waiting = <IconClockHour3 />;
  const success = <IconCircleCheck />;

  function getNumFinishedPlayers() {
    let count = 0;
    game?.players.forEach((player) => {
      if (player.moves[game?.currentTurn]) {
        count++;
      }
    });
    return count;
  }

  return (
      <Stack>
        <Text fw={700}>
          {getNumFinishedPlayers()} / {game ? game.players.length : 0} Spieler haben ihren Zug beendet.
        </Text>

        {game?.players.map((player: Player) => {
          const isInactive =
              (player as any).inactiveSinceTurn !== -1;

          const playerNameStyle = {
            textDecoration: isInactive ? 'line-through' : 'none',
            color: isInactive ? '#999' : undefined,
          };

          return (
              <Badge
                  leftSection={icon}
                  rightSection={
                    player.moves.length - 1 >= game?.currentTurn ? success : waiting
                  }
                  h={50}
                  w={200}
                  size="xl"
                  radius="md"
                  color={
                    player.moves.length - 1 >= game?.currentTurn
                        ? 'brand.0'
                        : 'brand.7'
                  }
                  key={player.id}
                  style={playerNameStyle}
              >
                {player.name}
              </Badge>
          );
        })}
      </Stack>
  );
}
