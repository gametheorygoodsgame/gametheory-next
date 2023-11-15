'use client';

import React, {useEffect, useRef, useState} from 'react';
import { Button, Center, Container, Grid, Group, ScrollArea, Stack, Text } from '@mantine/core';
import { useDisclosure, useViewportSize } from '@mantine/hooks';
import { Game, GameApi } from '@gametheorygoodsgame/gametheory-openapi/api';
import DataCollection from '../../../components/dataCollection/datacollection';
import { StartGameModal } from '@/components/game/startGameModal';
import { logger } from '@/utils/logger';
import Plot from "@/app/overview/[gameId]/plot";

interface GameOverviewGameMasterProps {
  params: {
    gameId: string; // Adjust the type according to your route's parameter type
  };
}

export default function GameOverviewGameMaster({ params }: GameOverviewGameMasterProps) {
  const { height: portHeight, width: portWidth } = useViewportSize();
  const { height } = useViewportSize();
  const { gameId } = params;
  const [redCardValue, setRedCardValue] = useState<number | string>(1);
  const [opened, { close }] = useDisclosure(false);
  const [game, setGame] = useState<Game>();
  const plotRef = useRef();

  const gameApi = new GameApi();

  async function fetchGame() {
    try {
      const response = await gameApi.getGameById(gameId);
      setGame(response.data);
      logger.info('Fetched game data successfully.');
      logger.debug(response.data);
    } catch (error) {
      logger.warn(`GameId: ${gameId}`)
      logger.error('Error fetching data: ', error);;
    }
  }

  const handleNextRound = async () => {
    try {
      if (!game) {
        throw new Error('Game not found');
      }
      // @ts-ignore
      const response = await gameApi.updateGameById(gameId, game);
      setGame(response.data);
      logger.info('Updated game data successfully.');
      logger.debug(response.data);
    } catch (error) {
      logger.error('Error updating data: ', error);
    }
    close();
  };

  useEffect(() => {
    fetchGame();
  }, [gameId, game]);

  useEffect(() => {
    const interval = setInterval(fetchGame, 10000); // Fetch current round every 10 seconds

    return () => {
      clearInterval(interval);
    };
  }, [gameId, game]);

  /*
  if (!game) {
    throw new Error('game not found.');
  }
   */

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
                Runde: {game?.currentTurn || 0} / {game?.numTurns}
              </Text>
            </Group>
            <Center>
              <Plot gameId={gameId} portHeight={portHeight} portWidth={portWidth} ref={plotRef}/>
            </Center>
            <Group align="right" gap="xl">
              <Button variant="outline" color="red" bg="white">
                Spielabbruch
              </Button>
              <StartGameModal
                currentRound={game?.currentTurn || 0}
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
