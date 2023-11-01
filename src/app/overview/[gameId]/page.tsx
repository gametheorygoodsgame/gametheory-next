'use client';

import React, { useEffect, useState } from 'react';
import { Button, Center, Container, Grid, Group, ScrollArea, Stack, Text } from '@mantine/core';
import { useDisclosure, useViewportSize } from '@mantine/hooks';
import DataCollection from '../../../components/dataCollection/datacollection';
import { StartGameModal } from '@/components/game/startGameModal';
import { logger } from '@/utils/logger';

interface GameOverviewGameMasterProps {
  params: {
    gameId: string; // Adjust the type according to your route's parameter type
  };
}

export default function GameOverviewGameMaster({ params }: GameOverviewGameMasterProps) {
  const { height } = useViewportSize();
  const { gameId } = params;
  const [redCardValue, setRedCardValue] = useState<number | string>(1);
  const [opened, { close }] = useDisclosure(false);
  const [currentRound, setCurrentRound] = useState(0);

  async function fetchCurrentRound() {
    try {
      const response = await fetch(`../api/rounds?gameID=${gameId}`);
      const data = await response.json();
      setCurrentRound(data.currentRound);
    } catch (error) {
      logger.error('Error fetching data: ', error);
    }
  }

  const handleNextRound = async () => {
    await fetch('/api/rounds', {
      method: 'POST',
      body: JSON.stringify({ gameID: gameId, redCardValue }),
      headers: { 'Content-Type': 'application/json' },
    });
    fetchCurrentRound();
    close();
  };

  useEffect(() => {
    fetchCurrentRound();
  }, [gameId]);

  useEffect(() => {
    const interval = setInterval(fetchCurrentRound, 10000); // Fetch current round every 10 seconds

    return () => {
      clearInterval(interval);
    };
  }, [gameId]);

  return (
    <Container p={60} fluid h={height - 63}>
      <Grid grow justify="space-around" h={height - 200}>
        <Grid.Col span={1}>
          <ScrollArea h={height - 220}>
            <DataCollection gameId={gameId} />
          </ScrollArea>
        </Grid.Col>
        <Grid.Col span={5}>
          <Stack justify="space-between" h={height - 200}>
            <Group align="right" px={90}>
              <Text style={{ fontFamily: 'Instrument Sans, sans-serif', fontWeight: 700 }}>
                Runde: {currentRound}
              </Text>
            </Group>
            <Center>Rundenauswertung</Center>
            <Group align="right" gap="xl">
              <Button variant="outline" color="red" bg="white">
                Spielabbruch
              </Button>
              <StartGameModal
                currentRound={currentRound}
                isOpen={opened}
                handleNextRound={handleNextRound}
                redCardValue={redCardValue}
                setRedCardValue={setRedCardValue}
                close={close}
              />
            </Group>
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
