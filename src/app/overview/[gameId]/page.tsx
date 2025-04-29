'use client';

import React, { useRef, useState } from 'react';
import {
  Button,
  Center,
  Container,
  Grid,
  Group,
  Loader,
  Modal,
  NumberInput,
  ScrollArea,
  Stack,
  Text,
} from '@mantine/core';
import { useDisclosure, useViewportSize } from '@mantine/hooks';
import { Game, GameApi } from '@gametheorygoodsgame/gametheory-openapi/api';
import { useParams, useRouter } from 'next/navigation';
import PlayerList from '@/components/playerList/playerList';
import Plot from '@/components/plot/plot';
import { useInterval } from '@/utils/hooks';
import { logger } from '@/utils/logger';
import ButtonModal from '@/components/modals/buttonModal';
import RankingModal from '@/components/modals/rankingModal';

/**
 * Component for managing the game overview as a game master.
 *
 * Displays the current game state, allows progression through turns, and provides functionality
 * to start, end, or update the game. The component auto-refreshes game data periodically.
 *
 * @returns {JSX.Element} The rendered game overview for the game master.
 */
export default function GameOverviewGameMaster() {
  const router = useRouter();
  const plotRef = useRef();
  const { height: screenHeight, width: screenWidth } = useViewportSize();
  const [loading, setLoading] = useState(true);

  const { gameId } = useParams<{ gameId?: string }>();
  const [redCardHandValue, setRedCardHandValue] = useState<number | string>(1);
  const [game, setGame] = useState<Game>();

  const [hasError, { open: openErrorModal, close: closeErrorModal }] = useDisclosure(false);
  const [errorDescription, setErrorDescription] = useState('');

  const [rankingModalOpened, { open: openRankingModal, close: closeRankingModal }] = useDisclosure(false);

  const [isTurnProgressionModalOpen, {
    open: openTurnProgressionModal,
    close: closeTurnProgressionModal }] = useDisclosure(false);

  const gameApi = new GameApi();

  /**
  * Fetches the game data from the API.
  * Handles errors and updates the `game` state with the fetched data.
  */
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
      setErrorDescription(`${(error as Error).name}: ${(error as Error).cause}; ${(error as Error).stack}`);
      openErrorModal();
      logger.error('Error fetching data: ', error);
    } finally {
      setLoading(false);
    }
  }

  /**
  * Handles progressing to the next turn in the game.
  * Updates the game state with the new red card hand value.
  */
  const handleNextTurn = async () => {
    try {
      if (!game) {
        throw new Error('Game not found');
      }
      game.cardHandValue.push(typeof redCardHandValue === 'number' ? redCardHandValue : parseInt(redCardHandValue, 10));
      // @ts-ignore
      const response = await gameApi.updateGameById(gameId, game);
      setGame(response.data);
      logger.info('Updated game data successfully.');
      logger.debug(response.data);
      closeTurnProgressionModal();
    } catch (error) {
      logger.error('Error updating data: ', error);
    }
  };

  /**
   * Handles finishing the game.
   * Sends the final game state to the API and closes the turn progression modal.
   */
  const finishGame = async () => {
    try {
      if (!game) {
        throw new Error('Game not found');
      }
      // @ts-ignore
      const response = await gameApi.updateGameById(gameId, game);
      setGame(response.data);
      logger.info('Updated game data successfully.');
      logger.debug(response.data);
      closeTurnProgressionModal();
    } catch (error) {
      logger.error('Error updating data: ', error);
    }
  };

  // Auto-refresh the game data every 10 seconds.
  useInterval(fetchGame, 10000);

  if (loading) {
    return (
      <Center>
        <Loader />
      </Center>
    );
  }

  return (
    <>
      <ButtonModal
        opened={hasError}
        onClose={closeErrorModal}
        title="Fehler"
        rightButton={{ callback: closeErrorModal, text: 'Schließen' }}
      >
        <Text>{errorDescription}</Text>
      </ButtonModal>
      <Modal
        opened={isTurnProgressionModalOpen}
        onClose={closeTurnProgressionModal}
        title={game?.currentTurn === 0 ? 'Spiel Starten' : 'Nächste Runde'}
        closeOnClickOutside={false}
      >
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
      <RankingModal opened={rankingModalOpened} onClose={closeRankingModal} />
      <Container p={60} pb={0} fluid>
        <Grid grow justify="space-around" h={screenHeight - 200}>
          <Grid.Col span={1}>
            <ScrollArea h={screenHeight - 220}>
              <PlayerList game={game} />
            </ScrollArea>
          </Grid.Col>
          <Grid.Col span={5}>
            <Stack justify="space-between" h={screenHeight - 200}>
              <Group align="right" px={90}>
                <Text fw={700}>
                  Runde: {game?.currentTurn || 0} / {game?.numTurns || 0}
                </Text>
              </Group>
              <Center>
                <Plot
                  game={game}
                  portHeight={screenHeight}
                  portWidth={screenWidth}
                  ref={plotRef}
                />
              </Center>
              <Group gap="xl">
                <Button variant="outline" color="#cc4444" bg="white" onClick={() => router.push('/overview')} ml='290px'>
                  Übersicht
                </Button>
                {!game?.isFinished && (
                  game?.currentTurn === (game ? game?.numTurns : -1) ? (
                    <Button bg="brand.0" onClick={finishGame}>Spiel Beenden</Button>

                  ) : (
                    game?.currentTurn === 0 ? (
                      <Button bg="brand.0" onClick={openTurnProgressionModal}>Spiel Starten</Button>

                    ) : (
                      <Button onClick={openTurnProgressionModal}>Nächste Runde</Button>
                    )
                  )
                )}
                {game?.isFinished && (
                  <Button
                    variant="light"
                    color="red"
                    onClick={openRankingModal}
                  >
                    Spielergebnisse
                  </Button>
                )}

              </Group>
            </Stack>
          </Grid.Col>
        </Grid>
      </Container>
    </>
  );
}