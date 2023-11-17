'use client';

import React, {useEffect, useRef, useState} from 'react';
import {Button, Center, Container, Grid, Group, Modal, NumberInput, ScrollArea, Stack, Text} from '@mantine/core';
import { useDisclosure, useViewportSize } from '@mantine/hooks';
import { Game, GameApi } from '@gametheorygoodsgame/gametheory-openapi/api';
import DataCollection from '../../../components/dataCollection/datacollection';
import { StartGameModal } from '@/components/game/startGameModal';
import { logger } from '@/utils/logger';
import Plot from "@/app/overview/[gameId]/plot";
import {useParams, useRouter} from "next/navigation";

export default function GameOverviewGameMaster() {
  const { height } = useViewportSize();
  const { gameId } = useParams<{ gameId?: string }>();
  const [redCardValue, setRedCardValue] = useState<number | string>(1);
  const [opened, { open, close }] = useDisclosure(false);
  const [game, setGame] = useState<Game>();
  const plotRef = useRef();
  const { height: portHeight, width: portWidth } = useViewportSize();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const gameApi = new GameApi();

  async function fetchGame() {
    try {
      if (!gameId) {
        throw new Error('No Game ID.');
      }
      const response = await gameApi.getGameById(gameId);
      setGame(response.data);
      logger.info('Fetched game data successfully.');
      logger.debug(response.data);
    } catch (error) {
      logger.warn(`GameId: ${gameId}`);
      logger.error('Error fetching data: ', error);
    }
  }

  const handleNextTurn = async () => {
    try {
      if (!game) {
        throw new Error('Game not found');
      }
      game.cardHandValue.push(typeof redCardValue === 'number' ? redCardValue : parseInt(redCardValue));
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
    const fetchData = async () => {
      try {
        if (!gameId) {
          throw new Error('No Game ID.');
        }
        const response = await gameApi.getGameById(gameId);
        setGame(response.data);
        logger.info('Fetched game data successfully.');
        logger.debug(response.data);
      } catch (error) {
        logger.warn(`GameId: ${gameId}`);
        logger.error('Error fetching data: ', error);
      } finally {
        // Set loading to false regardless of success or failure
        setLoading(false);
      }
    };

    fetchData();
  }, [gameId]);

  useEffect(() => {
    const interval = setInterval(fetchGame, 10000); // Fetch current round every 10 seconds

    return () => {
      clearInterval(interval);
    };
  }, [gameId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
      <>
        <Modal opened={opened} onClose={close} title={game?.currentTurn === 0 ? 'Spiel Starten' : 'Nächste Runde'}>
          <Stack gap="xl">
            <NumberInput
                type="text"
                label="Roter Kartenwert"
                value={redCardValue}
                onChange={setRedCardValue}
            />
            <Group align="right">
              {game?.currentTurn === 0 ? (
                  <Button bg="brand.0" onClick={handleNextTurn}>Spiel Starten</Button>
              ) : (
                  <Button onClick={handleNextTurn}>Nächste Runde</Button>
              )}
            </Group>
          </Stack>
        </Modal>
        <Container p={60} fluid h={height - 63}>
          <Grid grow justify="space-around" h={height - 200}>
            <Grid.Col span={1}>
              <ScrollArea h={height - 220}>
                <DataCollection gameId={gameId || ''} />
              </ScrollArea>
            </Grid.Col>
            <Grid.Col span={5}>
              <Stack justify="space-between" h={height - 200}>
                <Group align="right" px={90}>
                  <Text style={{ fontFamily: 'Instrument Sans, sans-serif', fontWeight: 700 }}>
                    Runde: {game?.currentTurn || 0} / {game?.numTurns || 0}
                  </Text>
                </Group>
                <Center>
                  <Plot game={game} portHeight={portHeight} portWidth={portWidth} ref={plotRef}/>
                </Center>
                <Group align="right" gap="xl">
                  <Button variant="outline" color="red" bg="white" onClick={() => router.push('/overview')}>
                    Übersicht
                  </Button>
                  {game?.currentTurn === 0 ? (
                      <Button bg="brand.0" onClick={open}>
                        Spiel Starten
                      </Button>
                  ) : (
                      <Button onClick={open}>
                        Nächste Runde
                      </Button>
                  )}
                </Group>
                <Text>
                  {JSON.stringify(game)}
                </Text>
              </Stack>
            </Grid.Col>
          </Grid>
        </Container>
      </>
  );
}
