'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button, Center, Container, Grid, Group, Modal, NumberInput, ScrollArea, Stack, Text } from '@mantine/core';
import { useDisclosure, useViewportSize } from '@mantine/hooks';
import { Game, GameApi } from '@gametheorygoodsgame/gametheory-openapi/api';
import DataCollection from '../../../components/dataCollection/datacollection';
import Plot from "@/components/plot";
import { useParams, useRouter } from "next/navigation";
import { useInterval } from '@/utils/hooks';
import { logger } from "@/utils/logger";

export default function GameOverviewGameMaster() {
  const router = useRouter();
  const plotRef = useRef();
  const { height: screenHeight, width: screenWidth } = useViewportSize();
  const [loading, setLoading] = useState(true);

  const { gameId } = useParams<{ gameId?: string }>();
  const [redCardHandValue, setRedCardHandValue] = useState<number | string>(1);
  const [game, setGame] = useState<Game>();

  const [isTurnProgressionModalOpen, { open: openTurnProgressionModal, close: closeTurnProgressionModal }] = useDisclosure(false);

  const gameApi = new GameApi();

  // Hook um Funktion auf Intervall auszuführen
  useInterval(() => {
    fetchGame();
  }, 10000);

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
    } finally {
      // Set loading to false regardless of success or failure
      setLoading(false);
    }
  }

  const handleNextTurn = async () => {
    try {
      if (!game) {
        throw new Error('Game not found');
      }
      game.cardHandValue.push(typeof redCardHandValue === 'number' ? redCardHandValue : parseInt(redCardHandValue));
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

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
      <>
        <Modal opened={isTurnProgressionModalOpen} onClose={closeTurnProgressionModal} title={game?.currentTurn === 0 ? 'Spiel Starten' : 'Nächste Runde'}>
          <Stack gap="xl">
            <NumberInput
                type="text"
                label="Roter Kartenwert"
                value={redCardHandValue}
                onChange={setRedCardHandValue}
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
        <Container p={60} fluid h={screenHeight - 63}>
          <Grid grow justify="space-around" h={screenHeight - 200}>
            <Grid.Col span={1}>
              <ScrollArea h={screenHeight - 220}>
                <DataCollection gameId={gameId || ''} />
              </ScrollArea>
            </Grid.Col>
            <Grid.Col span={5}>
              <Stack justify="space-between" h={screenHeight - 200}>
                <Group align="right" px={90}>
                  <Text style={{ fontFamily: 'Instrument Sans, sans-serif', fontWeight: 700 }}>
                    Runde: {game?.currentTurn || 0} / {game?.numTurns || 0}
                  </Text>
                </Group>
                <Center>
                  <Plot game={game} portHeight={screenHeight} portWidth={screenWidth} ref={plotRef} />
                </Center>
                <Group align="right" gap="xl">
                  <Button variant="outline" color="red" bg="white" onClick={() => router.push('/overview')}>
                    Übersicht
                  </Button>
                  {game?.currentTurn === 0 ? (
                      <Button bg="brand.0" onClick={openTurnProgressionModal}>
                        Spiel Starten
                      </Button>
                  ) : (
                      <Button onClick={openTurnProgressionModal}>
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
