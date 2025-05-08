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
import { Game, GameApi, Player } from '@gametheorygoodsgame/gametheory-openapi/api';
import { useParams, useRouter } from 'next/navigation';
import PlayerList from '@/components/playerList/playerList';
import Plot from '@/components/plot/plot';
import { useInterval } from '@/utils/hooks';
import { logger } from '@/utils/logger';
import ButtonModal from '@/components/modals/buttonModal';

type ExtendedPlayer = Player & { inactiveSinceTurn?: number };

const cleanPlayers = (players: ExtendedPlayer[]): Player[] => {
  return players.map(player => ({
    id: player.id,
    name: player.name || '',
    score: player.score ?? 0,
    moves: Array.isArray(player.moves)
        ? player.moves.map(m => ({
          numTurn: m?.numTurn ?? 0,
          numRedCards: m?.numRedCards ?? 0
        }))
        : [],
    ...(typeof player.inactiveSinceTurn === 'number' && {
      inactiveSinceTurn: player.inactiveSinceTurn
    })
  }));
};

const createValidGamePayload = (game: Game): Game => ({
  id: game.id,
  name: game.name || '',
  numTurns: game.numTurns || 5,
  currentTurn: game.currentTurn ?? 0,
  cardHandValue: game.cardHandValue.map(Number),
  cardPotValue: game.cardPotValue.map(Number),
  potCards: game.potCards.map(Number),
  isFinished: game.isFinished ?? false,
  players: cleanPlayers(game.players as ExtendedPlayer[])
});

export default function GameOverviewGameMaster() {
  const router = useRouter();
  const plotRef = useRef();
  const { height: screenHeight, width: screenWidth } = useViewportSize();
  const [loading, setLoading] = useState(true);

  const { gameId } = useParams<{ gameId?: string }>();
  const [redCardHandValue, setRedCardHandValue] = useState<number | string>(1);
  const [game, setGame] = useState<Game>();
  const [playersToSkip, setPlayersToSkip] = useState<ExtendedPlayer[]>([]);

  const [hasError, { open: openErrorModal, close: closeErrorModal }] = useDisclosure(false);
  const [errorDescription, setErrorDescription] = useState('');

  const [isTurnProgressionModalOpen, {
    open: openTurnProgressionModal,
    close: closeTurnProgressionModal }] = useDisclosure(false);

  const [isSkipModalOpen, { open: openSkipModal, close: closeSkipModal }] = useDisclosure(false);

  const gameApi = new GameApi();

  async function fetchGame() {
    try {
      if (!gameId) throw new Error('Missing gameId');
      const response = await gameApi.getGameById(gameId);
      setGame(response.data);
      logger.info('Fetched game data successfully.');
    } catch (error) {
      setErrorDescription(`${(error as Error).name}: ${(error as Error).cause}; ${(error as Error).stack}`);
      openErrorModal();
      logger.error('Error fetching data: ', error);
    } finally {
      setLoading(false);
    }
  }

  const proceedToNextTurn = async () => {
    try {
      if (!game || !gameId) return;

      game.cardHandValue.push(
          typeof redCardHandValue === 'number'
              ? redCardHandValue
              : parseInt(redCardHandValue, 10)
      );

      const payload = createValidGamePayload(game);
      const response = await gameApi.updateGameById(gameId, game);
      setGame(response.data);
      closeTurnProgressionModal();
    } catch (error) {
      logger.error('Error updating data: ', error);
    }
  };

  // 🔧 Patch für handleSkipAndContinue in page.tsx – final mit sauberem Reload

  const handleSkipAndContinue = async () => {
    try {
      if (!game || !gameId) return;

      // 🛡️ Setze inactiveSinceTurn statt Spieler zu löschen
      (game.players as ExtendedPlayer[]).forEach(player => {
        if (playersToSkip.some(skip => skip.id === player.id)) {
          player.inactiveSinceTurn = game.currentTurn;
        }
      });

      // Füge Kartenwert hinzu
      game.cardHandValue.push(
          typeof redCardHandValue === 'number'
              ? redCardHandValue
              : parseInt(redCardHandValue, 10)
      );

      const payload = createValidGamePayload(game);
      console.log('🛰️ Sende Payload an API (Spieler überspringen):', JSON.stringify(payload, null, 2));

      const response = await gameApi.updateGameById(gameId, game);
      setGame({ ...response.data }); // 🧠 React-Update forcieren

      closeSkipModal();
      closeTurnProgressionModal();
    } catch (error) {
      logger.error('Error skipping players: ', error);
    }
  };


  const handleNextTurn = async () => {
    if (!game) return;

    const inactivePlayers = (game.players as ExtendedPlayer[]).filter(
        p =>
            p.inactiveSinceTurn === undefined &&
            !p.moves?.some?.(m => m?.numTurn === game.currentTurn)
    );

    if (inactivePlayers.length > 0) {
      setPlayersToSkip(inactivePlayers);
      openSkipModal();
      return;
    }

    await proceedToNextTurn();
  };

  const finishGame = async () => {
    try {
      if (!game || !gameId) return;

      const payload = createValidGamePayload(game);
      const response = await gameApi.updateGameById(gameId, game); // ✅ FIXED
      setGame(response.data);
      closeTurnProgressionModal();
    } catch (error) {
      logger.error('Error finishing game: ', error);
    }
  };

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

        <Modal
          opened={isSkipModalOpen}
          onClose={closeSkipModal}
          title="Spieler überspringen?"
          closeOnClickOutside={false}
        >
          <Text>{playersToSkip.length} Spieler haben ihren Zug nicht abgegeben. Möchten Sie sie entfernen und zur nächsten Runde fortfahren?</Text>
          <Stack mt="md">
            <Group justify="flex-end">
              <Button variant="default" onClick={closeSkipModal}>Abbrechen</Button>
              <Button color="red" onClick={handleSkipAndContinue}>Entfernen & Fortfahren</Button>
            </Group>
          </Stack>
        </Modal>

        <Container p={60} pb={0} fluid>
          <Grid grow justify="space-around" h={screenHeight - 200}>
            <Grid.Col span={1}>
              <ScrollArea h={screenHeight - 220}>
                <PlayerList game={game as Game} />
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
                    game={game as Game}
                    portHeight={screenHeight}
                    portWidth={screenWidth}
                    ref={plotRef}
                  />
                </Center>
                <Group gap="xl">
                  <Button variant="outline" color="#cc4444" bg="white" onClick={() => router.push('/overview')} ml="360px">
                    Übersicht
                  </Button>
                  {!game?.isFinished && (
                      game?.currentTurn === game?.numTurns ? (
                          <Button bg="brand.0" onClick={finishGame}>Spiel Beenden</Button>
                      ) : (
                          game?.currentTurn === 0 ? (
                              <Button bg="brand.0" onClick={openTurnProgressionModal}>Spiel Starten</Button>
                          ) : (
                              <Button onClick={openTurnProgressionModal}>Nächste Runde</Button>
                          )
                      )
                  )}
                </Group>
              </Stack>
            </Grid.Col>
          </Grid>
        </Container>
      </>
  );
}
