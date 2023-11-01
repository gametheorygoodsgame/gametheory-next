'use client';

import React from 'react';
import { Badge, Stack } from '@mantine/core';
import { IconCards } from '@tabler/icons-react';

export interface DataCollectionItem {
  id: string;
  name: string;
}

export default function DataCollectionList({
  dataCollection,
}: {
  dataCollection: DataCollectionItem[];
}) {
  const icon = <IconCards />;

  return (
    <Stack>
      {dataCollection.map((item: DataCollectionItem) => (
        <Badge leftSection={icon} h={50} w={200} size="xl" radius="md" color="indigo" key={item.id}>
          {item.name}
        </Badge>
      ))}
    </Stack>
  );
}
