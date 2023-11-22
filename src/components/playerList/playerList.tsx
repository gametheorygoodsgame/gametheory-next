'use client';

import React from 'react';
import { Badge, Stack } from '@mantine/core';
import {IconCards, IconCircleCheck, IconClockHour3} from '@tabler/icons-react';
import classes from "@/components/overviewTable/overviewTable.module.css";
import {Player} from "@gametheorygoodsgame/gametheory-openapi/api";
import {Game} from "@gametheorygoodsgame/gametheory-openapi";

export interface DataCollectionItem {
  id: string;
  name: string;
  isMoveMade: boolean;
}

export default function PlayerList({game}: {game: Game | undefined;}) {
  const icon = <IconCards />;
  const waiting = <IconClockHour3 />;
  const success = <IconCircleCheck />;

  return (
    <Stack>
      {game?.players.map((player: Player) => (
        <Badge
            leftSection={icon}
            rightSection={player.moves.length - 1 >= game?.currentTurn ? success : waiting}
            h={50}
            w={200}
            size="xl"
            radius="md"
            color={player.moves.length - 1 >= game?.currentTurn ? "brand.0" : "brand.7"}
            key={player.id}>
          {player.name}
        </Badge>
      ))}
    </Stack>
  );
}
