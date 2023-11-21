'use client';

import React from 'react';
import { Badge, Stack } from '@mantine/core';
import {IconCards, IconCircleCheck, IconClockHour3} from '@tabler/icons-react';
import classes from "@/components/overviewTable/ActionIcon.module.css";
import {Player} from "@gametheorygoodsgame/gametheory-openapi/api";

export interface DataCollectionItem {
  id: string;
  name: string;
  isMoveMade: boolean;
}

export default function PlayerListView({
  playerList, currentTurn
}: {
  playerList: Player[];
  currentTurn: number;
}) {
  const icon = <IconCards />;
  const waiting = <IconClockHour3 />;
  const success = <IconCircleCheck />;

  return (
    <Stack>
      {playerList.map((item: Player) => (
        <Badge
            leftSection={icon}
            rightSection={item.moves.length >= currentTurn ? success : waiting}
            h={50}
            w={200}
            size="xl"
            radius="md"
            color="indigo"
            key={item.id}>
          {item.name}
        </Badge>
      ))}
    </Stack>
  );
}
